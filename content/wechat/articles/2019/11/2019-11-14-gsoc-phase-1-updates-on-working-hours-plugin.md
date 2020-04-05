---
title: "Working Hours 插件的第一阶段更新"
description: "实现了 Working Hours Plugin 和 React 集成，提供更加好用的排除日期和时间范围选择器"
date: 2019-11-14
original: "https://jenkins.io/blog/2019/07/09/Phase1-Updates-On-Working-Hours-Plugin/"
tags:
- react plugins gsoc gsoc2019
keywords:
- react gsoc
author: Jack Shen
translator: wenjunzhangp
poster: "cover.jpg"
---

![cover](cover.jpg)

Working Hour Plugin 提供了一个界面，用于设置允许的构建日期和时间。在配置 Working Hour 之外运行的作业将保留到下一个允许的构建时间为止。

在 Google Summer of Code 的第一个代码阶段，我一直在从事 [Working Hours Project](https://jenkins.io/projects/gsoc/2019/working-hours-improvements/) 项目，该项目还有待于改善可用性。

当我们想设计一个具有大量可以使用自定义库的 UI 时，React 似乎比经典的 Jelly 页面更受青睐，尤其是日期选择器之类的开源组件。

但是，我们目前正致力于将 React 和 Jenkins 集成在一起，这是一个挑战。

## 第一阶段的成就

在第一个代码阶段，我们专注于 UI 改进，我们取得了以下主要改进：
* 一个独立的 Web 应用程序，可以将其集成。
* 滑块，用于选择时间范围。
* 设置排除日期时间的更多字段。
* 用于选择排除日期的预设。
* Jenkins 样式界面

## 我们如何将 React 集成到 Jenkins 中

可以在[这里](https://drive.google.com/open?id=1JLRCDg9JNBWR0Dfq8w3pTI9mrl6i9JU29pBoH6bO0J8)找到集成的解决方案文档

最初，我们发现 BlueOcean 是在 Jenkins 中使用 React 的一个很好的例子，但是对于使用插件进行通用开发来说，它并不是一个好的选择。因此，我们需要找到另一种集成方式。

这是进行集成的步骤：
* 在你 jelly 文件中的挂载点，通常是具有唯一 `ID` 的元素。
* 编写您的 React Application，但需要将安装点设置为您在上面设置的 ID。
* 将构建后的插件复制到 webapp 目录。
* 在你的 jelly 文件中，使用 script 标签引入
```
<script type="text/javascript"
        src="${resURL}/plugin/working-hours/js/main.js"></script>
```
* 使用 React 之后，传统的请求将不再可用，处理请求的另一种方法是使用 stapler。您可以定义如下的过程函数[source, java] 
```
public HttpResponse doDynamic(StaplerRequest request) {
        if (config == null) {
            config = ExtensionList.lookup(WorkingHoursPlugin.class).get(0);
        }
        String restOfPath = request.getRestOfPath();
        String[] pathTokens = restOfPath.split("/");
        List<String> params = new ArrayList<>();
        switch (params.get(0)) {
            case "list-excluded-dates":
                return listExcludedDate(request);
            case "set-excluded-dates":
                return setExcludedDates(request);
            case "list-time-ranges":
                return listTimeRanges(request);
            case "set-time-ranges":
                return setTimeRanges(request);
        }
    }
```

## 运行我们的应用程序

如果您想看一下我们的插件，可以查看 [working-hours-plugin](https://github.com/jenkinsci/working-hours-plugin/tree/dev) 的仓库。
只需阅读 README 文件，即可运行 working-hours-plugin 的副本。

## 截图
当前的插件外观有点简单，插件使用起来有些不便。
比如说如果我们要输入排除的日期，它将是一个恒定格式的字符串，例如 15/9/2019，但是新的用户界面选择了 React，因此我们可以使用日期选择器进行改进。

## 当前插件

![working-hours-config](working-hours-config.png)

## 新版时间范围选择器

![working-hours-example-time-range](working-hours-example-time-range.png)

## 新版排除日期

![working-hours-exmaple-excluded-date](working-hours-exmaple-excluded-date.png)

## 帮助链接

如果您有任何疑问或建议，我们很高兴收到您的来信。
下面列出了几个有用的链接：
* [Develop Repo](https://github.com/jenkinsci/working-hours-plugin/tree/dev)
* [Main Repo](https://github.com/jenkinsci/working-hours-plugin)
* [Design Doc](https://docs.google.com/document/d/1SezLtQejur2ji-KUur3dC3TXK8ivxrttiwHYbTkA8Yk/edit#)
* [Doc for React Integration Solution](https://drive.google.com/open?id=1JLRCDg9JNBWR0Dfq8w3pTI9mrl6i9JU29pBoH6bO0J8)
* [Gitter Chat](https://gitter.im/jenkinsci/working-hours-plugin)
* [Slides for Phase 1 Demo](https://docs.google.com/presentation/d/1Psz6MrYvw81D_7d8pfW04FDoBtexlSVdgrbqp99Wjm0/edit?usp=sharing)
* [Video Recording for Phase 1](https://www.youtube.com/watch?v=MDs0Vr7gnnA)
