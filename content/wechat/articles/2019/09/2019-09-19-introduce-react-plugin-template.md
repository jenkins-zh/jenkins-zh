---
title: "React Plugin Template，让你可以使用 React 来编写 Jenkins 插件"
description: "React Plugin Template，让你可以使用 React 来编写 Jenkins 插件"
date: 2019-09-19
tags:
- react
- plugin
- template
- gsoc
- gsoc2019
author: jackshen
poster: "plugin-ui.jpg"
---
模板地址

[React Plugin Template](https://github.com/jenkinsci/react-plugin-template)
https://github.com/jenkinsci/react-plugin-template

## 起因

这个模板是笔者在今年的 Google Summer of Code 中的项目 Working Hours - UI Improvement 中产出的。由于我们想使用 React 的一些组件来优化用户体验，例如在 Working Hours 里面我们想用 ReactDatepicker 来帮助用户选择日期，于是整个 Working Hours 插件的前端部分都试图用 React 来编写，而由于 Jenkins 的传统插件编写主要还是用的 Jelly ，一套类似 JSP 的后端渲染引擎，因此笔者在一开始也踩了不少坑。以至于想到，可以抽象出一套插件的脚手架来帮助有相似需求的同学。

链接：

[GSoC：Working Hours UI Improvement](https://summerofcode.withgoogle.com/projects/#6112735123734528) https://summerofcode.withgoogle.com/projects/#6112735123734528 

[Github：Working Hours 插件](https://github.com/jenkinsci/working-hours-plugin) https://github.com/jenkinsci/working-hours-plugin


## 概述
在以往，我们可以使用 Jelly 来开发 Jenkins 插件的前端部分，同时一些请求可以绑定到对应的类，但是当我们想要更高程度地去自定义插件界面的时候，Jelly 就显得捉襟见肘了。这就是这个模板的目的，帮助开发者使用 React 来开发一个插件。

同时，有了 React ，我们就可以使用很多基于 React 的库，webpack 也可以帮助我们更安全更高效地使用 js 库。

## 特点

| 集成 React      | 开发者可以使用 React 充分控制 UI
| 使用了 Iframe          | Iframe 隔离了之前 Jenkins 添加的一些 js 库会造成的影响，例如 Prototype.js。
| 使用 maven 的生命周期       | 使用了 Frontend Maven Plugin https://github.com/eirslett/frontend-maven-plugin, npm 脚本可以在 maven 的生命周期中被同步执行。
| 使用 Webpack               | Webpack 可以减少最终包的体积，同时避免 js 库对全部命名空间的影响
| 为每个请求附加 Jenkins Crumb| Jenkins Crumb 是 Jenkins 的一套 token 系统，在本模板中已经自动附加到 axios 实例上
| 使用了 Express 的 devserver  | 可以单独打开一个支持热更新的 devserver 来编写前端界面

## 截图

插件 UI

![plugin-ui](plugin-ui.jpg)

示例入口

![management-link.jpg](management-link.jpg)

## 入门

克隆仓库:
```
git clone https://github.com/jenkinsci/react-plugin-template.git
cd react-plugin-template
```
安装 maven 依赖和 npm 包
```
mvn install -DskipTests
```
运行支持热更新的网页
```
npm run start
```
运行插件
```bash
mvn hpi:run -Dskip.npm -f pom.xml
```
## 发送HTTP请求

由于 Jenkins Crumb 策略默认是开启的，每个请求都被要求包含一个 Jenkins Crumb, 所以请使用已经设置好了 Jenkins Crumb 的 `axiosInstance`，可以在 `src/main/react/app/api.js` 中找到。
```java
export const apiGetData = () => {
  return axiosInstance.post("/data");
};
```
或者你想使用你自己的 http client，你只需将 Jenkins Crumb 添加到你每个请求的 header中，这个 header 的 key 和 content 都可以使用 `src/main/react/app/utils/urlConfig.js`，具体操作如下

```java
const headers = {};
const crumbHeaderName = UrlConfig.getCrumbHeaderName();

if (crumbHeaderName) {
  headers[crumbHeaderName] = UrlConfig.getCrumbToken();
}
```
### 编写后端的请求处理器

当你可以自定义你的请求后，你同时也需要一个在后端的 Handler。

Jenkins 使用了一个叫做 Stapler的框架来处理请求。你可以使用一个继承了 Action 的类来创建一个子 url ，同时可以使用一个 StaplerProxy 来转发或者直接处理请求。

链接

[Stapler Reference](http://stapler.kohsuke.org/reference.html) http://stapler.kohsuke.org/reference.html.

### 示例 handler

如下，ManagementLink（已经继承 Action ）会首先拿到这个请求然后转交个 `PluginUI` 来处理。

```java
@Extension
public class PluginManagementLink extends ManagementLink implements StaplerProxy {

    PluginUI webapp;

    public Object getTarget() {
        return webapp;
    }

    public String getUrlName() {
        return "react-plugin-template";
    }
}
```
随后， stapler 会在 `PluginUI` 中寻找适合的处理函数，如下, `doDynamic` 便是一个处理函数, 然后便是我摸自定义的，根据 url 来判断需要调用的函数, `getTodos` 或者 `setTodos`, 在这里 `PluginUI` 可能更像一个 url router。
```java
public class PluginUI{
    public HttpResponse doDynamic(StaplerRequest request) {
        ...

        List<String> params = getRequestParams(request);

        switch (params.get(0)) {
        case "get-todos":
            return getTodos();
        case "set-todos":
            return setTodos(request);
        }
        ...
    }
}
```
## 保存数据
你可以使用一个 Descriptor 来保存你的数据

```java
@Extension
public class PluginConfig extends Descriptor<PluginConfig> implements Describable<PluginConfig>
```

当你每次修改数据, 调用 `save()` 来保存他们。Jenkins 是使用基于 xml 的序列化方法来保持数据的。

```java
public void setTodos(
        @CheckForNull List<Todo> value) {
    this.todos = value;
    save();
}
```
而在你的 handler 中，你可以调用如下代码来找到你的这个存储数据的对象。
```java
config = ExtensionList.lookup(PluginConfig.class).get(0);
```


## 自定义你的插件

### 把所有 `react-template` 修改为你的插件名

- 在 `org/jenkinsci/plugins/reactplugintemplate/PluginUI/index.jelly` , 修改 iframe 的 id 和 source url.
- 在 `src/main/react/server/config.js` , 修改 devserver 的代理路径
- 在 `src/main/react/package.json` , 修修 start 命令中的 BASE_URL
- 在 `pom.xml` , 修改 artifactId
- 在 `org/jenkinsci/plugins/reactplugintemplate/PluginManagementLink.java` , 修改 names。

### 为你的插件自定义一个页面

比较推荐使用 Management Link, 这会让你的插件有一个独立的页面, 并且可以在系统管理界面 `/manage` 放置一个入口。

![management-link.jpg](management-link.jpg)

## 原理

本模板仅仅是将一个 webpack 的 project 放到了 Maven project 中，同时将 webpack 的 build 结果复制到插件的 webapp 目录，随后便可以在 iframe 中通过 url 访问到，最后被 Jelly 渲染到网页。

## 为什么使用Iframe?

因为到现在，Jenkins 的网页已经添加了很多的 js 库了（似乎是添加到全局的），因此可能会和较新的库产生一些冲突。因此也行一个 Iframe 可以使我们的插件运行在一个相对“干净”的环境里面。

## 链接

[Github: React Plugin Template](https://github.com/jenkinsci/react-plugin-template)  https://github.com/jenkinsci/react-plugin-template

[Github: Working Hours Plugin](https://github.com/jenkinsci/working-hours-plugin)
https://github.com/jenkinsci/working-hours-plugin
