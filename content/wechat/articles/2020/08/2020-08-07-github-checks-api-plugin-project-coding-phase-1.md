---
title: GSoC: GitHub Checks API 项目第一阶段总结
description: GitHub Checks API 插件项目 - 编码阶段 1
date: 2020-08-07
original: "https://www.jenkins.io/blog/2020/07/09/github-checks-api-plugin-coding-phase-1/"
tags:
- github
- api
- plugins
- developer
- gsoc
- gsoc2020
author: Kezhi Xiong
translator: XiongKezhi
poster: "jenkins-gsoc-logo_small.png"
---

![jenkins-gsoc-logo_small](jenkins-gsoc-logo_small.png)

这篇博客将介绍 GSoC 项目 [GitHub Checks API Plugin](https://www.jenkins.io/projects/gsoc/2020/projects/github-checks/) 在一阶段的相关进展。

简单来说，GitHub Checks API 就是一套可高度定制化接受 CI 报告的接口。
CI 工具可以通过该接口反馈信息给特定的 Pull Request，随后，用户便可以直接在 GitHub 的 UI 界面上直观的浏览 CI 报告。

![GitHub Check Run Screenshot from GitHub Docs](github-check-run.png)

更激动人心的是，它可以针对指定的代码行进行注释，这类似于开发者平时在代码审查时留下的评论。

![Check Run Annotation Screenshot from GitHub Docs](github-check-annotations.png)

同时，在 Jenkins 这边，[Warnings Next Generation Plugin](https://plugins.jenkins.io/warnings-ng/) 能通过源代码视图实现类似的功能。

![Source Code View from Warnings Next Generation Plugin](source-view.png)

因此，通过使用 GitHub Checks API 将这些信息直接反馈给 GitHub 能使 Jenkins 对 GitHub 用户更加友好。

# 阶段一实现的相关特性

在过去的一个月里，我们团队的工作主要集中在 General Checks API 和 GitHub Checks API 的实现上。

## General Checks API

尽管 General Checks API 是基于 GitHub Checks API 的语义实现的，我们仍然希望能提供这样的泛化接口为其他平台的相关概念做好准备，例如：GitLab 上的 [Commit Status API](https://docs.gitlab.com/ee/api/commits.html#commit-status)。
在今后，我们欢迎所有人贡献针对这些平台的相关实现。

## GitHub Checks API 实现

目前，我们对 GitHub Checks API 的支持工作已基本完成。
除此以外，我们还实现了一个用于表明当前 Jenkins 构建状况的功能。
在发布之后，通过调用我们的 API，Jenkins 的开发者们（特别是插件开发者们）能够为 GitHub Branch SCM 项目创建属于他们自己的 GitHub Checks。

### 例子：要创建一个如下图所示的 check run：

![Created Check Run](created-check-run.png)

用户需要如下地调用我们的接口：

```
ChecksDetails details = new ChecksDetailsBuilder()
        .withName("Jenkins")
        .withStatus(ChecksStatus.COMPLETED)
        .withDetailsURL("https://ci.jenkins.io")
        .withStartedAt(LocalDateTime.now(ZoneOffset.UTC))
        .withCompletedAt(LocalDateTime.now(ZoneOffset.UTC))
        .withConclusion(ChecksConclusion.SUCCESS)
        .withOutput(new ChecksOutputBuilder()
                .withTitle("Jenkins Check")
                .withSummary("# A Successful Build")
                .withText("## 0 Failures")
                .withAnnotations(Arrays.asList(
                        new ChecksAnnotationBuilder()
                                .withPath("Jenkinsfile")
                                .withLine(1)
                                .withAnnotationLevel(ChecksAnnotationLevel.NOTICE)
                                .withMessage("say hello to Jenkins")
                                .withStartColumn(0)
                                .withEndColumn(20)
                                .withTitle("Hello Jenkins")
                                .withRawDetails("a simple echo command")
                                .build(),
                        new ChecksAnnotationBuilder()
                                .withPath("Jenkinsfile")
                                .withLine(2)
                                .withAnnotationLevel(ChecksAnnotationLevel.WARNING)
                                .withMessage("say hello to GitHub Checks API")
                                .withStartColumn(0)
                                .withEndColumn(30)
                                .withTitle("Hello GitHub Checks API")
                                .withRawDetails("a simple echo command")
                                .build()))
                .build())
        .withActions(Collections.singletonList(
                new ChecksAction("formatting", "format code", "#0")))
        .build();

ChecksPublisher publisher = ChecksPublisherFactory.fromRun(run);
publisher.publish(details);
```

## 未来的工作

我们的下一步计划是将该接口集成到 [Warnings Next General Plugin](https://plugins.jenkins.io/warnings-ng/) 和 [Code Coverage API Plugin](https://plugins.jenkins.io/code-coverage-api/) 当中。
在此之后，我们还会添加对流水线的支持：在创建 check run 时，用户可以直接在流水线中调用我们的接口而无需依赖其他插件的实现.

## 相关资源

* [GitHub 仓库](https://github.com/jenkinsci/checks-api-plugin)
* [项目主页](https://www.jenkins.io/projects/gsoc/2020/projects/github-checks/)
* [Gitter 聊天室](https://gitter.im/jenkinsci/github-checks-api)

## 引用

* [GitHub 文档：使用 Checks API 创建 CI 测试](https://docs.github.com/en/developers/apps/creating-ci-tests-with-the-checks-api)
* [Warnings Next Generation Plugin：源代码视图](https://github.com/jenkinsci/warnings-ng-plugin/blob/master/doc/Documentation.md#source-code-view)