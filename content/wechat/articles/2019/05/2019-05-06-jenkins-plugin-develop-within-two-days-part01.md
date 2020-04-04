---
title: "Jenkins 插件开发之旅：两天内从 idea 到发布(上篇)"
description: "两天内，从产生 idea 到编写插件，最后发布到 Jenkins 插件更新中心"
date: 2019-05-06
toc: true
tags:
- jenkins
- maven
- jira
author: donhui
poster: "./2019-05-06-jenkins-plugin-develop-within-two-days-part01/huashan.png"
---

![huashan](huashan.png)

本文介绍了笔者首个 Jenkins 插件开发的旅程，
包括从产生 idea 开始，然后经过插件定制开发，
接着申请将代码托管到 jenkinsci GitHub  组织，
最后将插件发布到 Jenkins 插件更新中心的过程。

鉴于文章篇幅过长，将分为上下两篇进行介绍。

## 从一个 idea 说起
前几天和朋友聊天时，聊到了 Maven 版本管理领域的 SNAPSHOT 版本依赖问题，
这给他带来了一些困扰，消灭掉历史遗留应用的 SNAPSHOT 版本依赖并非易事。
 
类似问题也曾经给笔者带来过困扰，在最初没能去规避问题，
等到再想去解决问题时却发现困难重重，牵一发而动全身，
导致这个问题一直被搁置，而这也给笔者留下深刻的印象。
  
等到再次制定 Maven 规范时，从一开始就考虑
强制禁止 SNAPSHOT 版本依赖发到生产环境。

这里是通过在 Jenkins 构建时做校验实现的。
因为没有找到提供类似功能的 Jenkins 插件，
目前这个校验通过 shell 脚本来实现的，
具体的做法是在 Jenkins 任务中 Maven 构建之前增加一个 Execute shell 的步骤，
来判断 pom.xml 中是否包含 SNAPSHOT 关键字，如果包含，该次构建状态将被标记为失败。
脚本内容如下：
```bash
#!/bin/bash
if [[ ` grep -R --include="pom.xml" SNAPSHOT .` =~ "SNAPSHOT" ]]; 
then echo "SNAPSHOT check failed" && grep -R --include="pom.xml" SNAPSHOT . && exit 1; 
else echo "SNAPSHOT check success"; 
fi
```

恰好前不久在看 Jenkins 插件开发文档，
那何不通过 Jenkins 插件的方式实现它呢？

于是笔者开始了首个 Jenkins 插件开发之旅。

## 插件开发过程
Jenkins 是由 Java 语言开发的最流行的 CI/CD 引擎。

说起 Jenkins 强大的开源生态，自然就会说到 Jenkins 插件。
Jenkins 插件主要用来对 Jenkins 的功能进行扩展。
目前 Jenkins 社区有[上千个插件](https://plugins.jenkins.io/)，
用户可以根据自己的需求选择合适的插件来定制 Jenkins 。

### 插件开发准备
插件开发需要首先安装 JDK 和 Maven，这里不做进一步说明。

### 创建一个插件
Jenkins 为插件开发提供了 Maven 原型。
打开一个命令行终端，切换到你想存放 Jenins 插件源代码的目录，运行如下命令：
```
mvn -U archetype:generate -Dfilter=io.jenkins.archetypes:
```

这个命令允许你使用其中一个与 Jenkins 相关的原型生成项目。
```
$ mvn -U archetype:generate -Dfilter=io.jenkins.archetypes:
......
Choose archetype:
1: remote -> io.jenkins.archetypes:empty-plugin (Skeleton of a Jenkins plugin with a POM and an empty source tree.)
2: remote -> io.jenkins.archetypes:global-configuration-plugin (Skeleton of a Jenkins plugin with a POM and an example piece of global configuration.)
3: remote -> io.jenkins.archetypes:hello-world-plugin (Skeleton of a Jenkins plugin with a POM and an example build step.)
Choose a number or apply filter (format: [groupId:]artifactId, case sensitive contains): : 3
Choose io.jenkins.archetypes:hello-world-plugin version:
1: 1.1
2: 1.2
3: 1.3
4: 1.4
Choose a number: 4: 4
......
[INFO] Using property: groupId = unused
Define value for property 'artifactId': maven-snapshot-check
Define value for property 'version' 1.0-SNAPSHOT: :
[INFO] Using property: package = io.jenkins.plugins.sample
Confirm properties configuration:
groupId: unused
artifactId: maven-snapshot-check
version: 1.0-SNAPSHOT
package: io.jenkins.plugins.sample
 Y: : Y
```

笔者选择了 `hello-world-plugin` 这个原型，
并在填写了一些参数，如artifactId、version 后生成了项目。  
可以使用 `mvn verify` 命令验证是否可以构建成功。

### 构建及运行插件
`Maven HPI Plugin` 用于构建和打包 Jenkins 插件。
它提供了一种便利的方式来运行一个已经包含了当前插件的 Jenkins 实例：
```
mvn hpi:run
```

这将安装一个 Jenkins 实例，可以通过 `http://localhost:8080/jenkins/` 来访问。
等待控制台输出如下内容，然后打开 Web 浏览器并查看插件的功能。
```
INFO: Jenkins is fully up and running
```

在 Jenkins 中创建一个自由风格的任务，然后给它取个名字。
然后添加 "Say hello world" 构建步骤，如下图所示：  
![say hello world](say-hello-world.png)

输入一个名字，如：Jenkins ，然后保存该任务，
点击构建，查看构建日志，输出如下所示：
```
Started by user anonymous
Building in workspace /Users/mrjenkins/demo/work/workspace/testjob
Hello, Jenkins! 
Finished: SUCCESS
```

### 定制开发插件
Jenkins 插件开发归功于有一系列扩展点。
开发人员可以对其进行扩展自定义实现一些功能。

这里有几个重要的概念需要做下说明：

#### 扩展点（ ExtensitonPoint ）
扩展点是 Jenkins 系统某个方面的接口或抽象类。
这些接口定义了需要实现的方法，而 Jenkins 插件需要实现这些方法。

笔者所写的插件需要实现 Builder 这个扩展点。
代码片段如下：
```java
public class MavenCheck extends Builder {}
```

#### Descriptor 静态内部类
Descriptor 静态内部类是一个类的描述者，用于指明这是一个扩展点的实现，
Jenkins 通过这个描述者才能知道我们写的插件。
每一个描述者静态类都需要被 @Extension 注解，
Jenkins 内部会扫描 @Extenstion 注解来获取注册了哪些插件。  
代码片段如下：
```java
@Extension
public static final class DescriptorImpl extends BuildStepDescriptor<Builder> {
    public DescriptorImpl() {
        load();
    }

    @Override
    public boolean isApplicable(Class<? extends AbstractProject> aClass) {
        return true;
    }

    @Override
    public String getDisplayName() {
        return "Maven SNAPSHOT Check";
    }
}
```

在 DesciptorImpl 实现类中有两个方法需要我们必须要进行重写：
isApplicable() 和 getDisplayName() 。
isApplicable() 这个方法的返回值代表这个 Builder 在 Jenkins Project 中是否可用，
我们可以将我们的逻辑写在其中，例如做一些参数校验，
最后返回 true 或 false 来决定这个 Builder 是否可用。

getDisplayName() 这个方法返回的是一个 String 类型的值，
这个名称被用来在 web 界面上显示。

#### 数据绑定
前端页面的数据要和后台服务端进行交互，需要进行数据绑定。
前端 `config.jelly` 页面代码片段如下：
```xml
<?jelly escape-by-default='true'?>
<j:jelly xmlns:j="jelly:core" xmlns:st="jelly:stapler" xmlns:d="jelly:define" xmlns:l="/lib/layout" xmlns:t="/lib/hudson" xmlns:f="/lib/form">
  <f:entry title="check" field="check">
    <f:checkbox />
  </f:entry>
</j:jelly>
```
如上所示，需要在 config.jelly 中包含需要传入的参数配置信息的选择框，field 为 check ，这样可以在 Jenkins 进行配置，然后通过 DataBoundConstructor 数据绑定的方式，将参数传递到 Java 代码中。
服务端 Java 代码片段如下：
```
@DataBoundConstructor
public MavenCheck(boolean check) {
    this.check = check;
}
```

#### 核心逻辑
笔者所写的插件的核心逻辑是检查 Maven pom.xml 文件是否包含 SNAPSHOT 版本依赖。

Jenkins 是 Master/Agent 架构，
这就需要读取 Agent 节点的 workspace 的文件，
这是笔者在写插件时遇到的一个难点。

Jenkins 强大之处在于它的生态，目前有上千个插件，
笔者参考了 [Text-finder Plugin](https://plugins.jenkins.io/text-finder) 的源码，
并在参考处添加了相关注释，最终实现了插件要实现的功能。

详细代码可以查看 [jenkinsci/maven-snapshot-check-plugin](https://github.com/jenkinsci/maven-snapshot-check-plugin) 代码仓库。

### 分发插件
使用 `mvn package` 命令可以打包出后缀为 hpi 的二进制包，
这样就可以分发插件，将其安装到 Jenkins 实例。

## 插件使用说明
以下是对插件的使用简要描述。
  
如果勾选了下面截图中的选择框，
Jenkins 任务在构建时将会检查 pom.xml 中是否包含 SNAPSHOT 。
![maven-snapshot-check-plugin-usage](maven-snapshot-check-plugin-usage.png)

如果检查到的话，则会将该次构建状态标记为失败。
![job-build-console-output](job-build-console-output.png)

## 总结
文章上篇主要介绍了从产生 idea 到插件开发完成的过程。  
那么插件在开发完成后是如何将它托管到 Jenkins 插件更新中心让所有用户都可以看到的呢？  
两天后的文章下篇将对这个过程进行介绍，敬请期待！
 
 
## 参考
- [Plugin tutorial](https://wiki.jenkins.io/display/JENKINS/Plugin+tutorial) 
- [Preparing for Plugin Development](https://jenkins.io/doc/developer/tutorial/prepare/)
- [Create a Plugin](https://jenkins.io/doc/developer/tutorial/create/)
- [Build and Run the Plugin](https://jenkins.io/doc/developer/tutorial/run/)
