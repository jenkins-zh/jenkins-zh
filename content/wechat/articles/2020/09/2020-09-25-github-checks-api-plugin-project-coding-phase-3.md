---
title: "GSoC: GitHub Checks API 项目第三阶段总结"
description: "GitHub Checks API 插件项目 - 编码阶段 3"
date: 2020-09-25
original: "https://www.jenkins.io/blog/2020/08/31/github-checks-api-plugin-coding-phase-3/"
tags:
- github
- api
- plugins
- developer
- gsoc
- gsoc2020
author: XiongKezhi
poster: "jenkins-gsoc-logo_small.png"
---

*这篇文章将介绍 [GitHub Checks API](https://www.jenkins.io/projects/gsoc/2020/projects/github-checks/) 项目在谷歌编程之夏第三阶段的相关工作。*

在这个夏天的尾声，GitHub Checks API 项目迎来了它在 GSoC 的最后一段旅程。在这篇文章当中，我将向你们展示我们在这最后一个阶段中的相关工作：
- 流水线支持
- Rerun 请求支持
- Git SCM 支持
- 文档的完善

*以上的特性已经合并在了最新发布的 [Checks API 插件](https://plugins.jenkins.io/checks-api) 与 [GitHub Checks 插件](https://plugins.jenkins.io/github-checks) 的 1.0.0 版本中。*

## 流水线支持

对流水线的支持让用户无需依赖任何 Checks API 的实现就可以直接在他们编写的流水线当中轻松发布 checks。

![Pipeline Checks](pipeline-checks.png)

上图中的 check 可以通过如下脚本实现：

```groovy
publishChecks name: 'pipeline check', title: 'pipeline ', summary: '# A pipeline check example',
        text: "## This check is published through the pipeline script",
        detailsURL: 'https://ci.jenkins.io'
```

*如果你想要发布 checks 到 GitHub，请安装 [GitHub 的实现](https://github.com/jenkinsci/github-checks-plugin) 并查阅 [GitHub API 文档](https://docs.github.com/en/rest/reference/checks) 了解各个参数的相关用途。其中，`detailsURL` 会拥有一个链接到此次 Jenkins 构建页面的默认值。*

如果你的每个构建阶段都耗时较长且容易出错，那么这个特性就会变得十分有用：你可以为每一个阶段发布一次 check 以跟踪当前构建的相关流程。

## Rerun 请求支持

Rerun 请求允许 GitHub 用户对失败的 CI 构建发起重新执行的请求。当一次构建失败后（导致发布了一个失败的 check），GitHub 会为此次构建自动添加一个 `Re-run` 按键。

![Failed Checks](failed-checks.png)

点击 `Re-run`，Jenkins 就会重新为当前分支的最后一次提交安排一次新的构建。

## Git SCM 支持

感谢 [Ullrich](https://github.com/uhafner) 的帮助，[GitHub Checks 插件](https://plugins.jenkins.io/github-checks) 现在支持了 [Git SCM](https://github.com/jenkinsci/git-plugin). 这意味着你将可以为你的 Freestyle 项目或者其他任何使用 Git SCM 的项目发布 checks 了。

## 文档

[Consumer Guide](https://github.com/jenkinsci/checks-api-plugin/blob/master/docs/consumers-guide.md) 和 [Implementation Guide](https://github.com/jenkinsci/checks-api-plugin/blob/master/docs/implementation-guide.md) 已经发布了。作为一名 Jenkins 的开发者，你现在可以开始消费我们的 API 甚至提供一些基于其他 SCM 平台（如 GitLab, Gitee 等）的相关实现了。

## 致谢

整个 [GitHub Checks API](https://www.jenkins.io/projects/gsoc/2020/projects/github-checks/) 项目开始于 2020 年的谷歌编程之夏。十分感谢我的导师（[Tim](https://github.com/timja) 和 [Ullirch](https://github.com/uhafner)）在整个夏天的给予我的帮助。同样感谢 [Jenkins 谷歌编程之夏兴趣小组](https://www.jenkins.io/sigs/gsoc/), [Jenkins 中文社区](https://www.jenkins.io/sigs/chinese-localization/) 以及整个 Jenkins 社区提供的技术支持与相关资源。

## 链接

- [Checks API 插件](https://github.com/jenkinsci/checks-api-plugin)
- [GitHub Checks 插件](https://github.com/jenkinsci/github-checks-plugin)
- [项目主页](https://www.jenkins.io/projects/gsoc/2020/projects/github-checks/)
- [Gitter 聊天室](https://gitter.im/jenkinsci/github-checks-api)