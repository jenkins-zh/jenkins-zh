---
title: "如何参与"
description: ""
date: 2019-01-05T22:56:04+08:00
draft: false
toc: true
author: linuxsuren
---

# 为什么要参与开源社区

* [翟志军](https://github.com/zacker330)：想亲身参与一个开源社区，了解其运行机制。而为什么选择 Jenkins 中文社区？是想更多人了解持续交付。
* [zhangc819](https://github.com/zhangc819)：日常工作里经常需要开源社区的力量来解决问题、学习经验，参与开源社区建设也是为了给社区提供更多的力量，相互左右才能壮大下去。

# 如何参与 Jenkins 中文社区

参与 Jenkins 中文社区的方式不只有 Coding 一条路可选，还有很多方式，比如：
1. 发表或翻译 Jenkins 相关的文章，并发表到社区网站。
1. Jenkins 本地化。
1. 成为 Jenkins 线下或线上活动的志愿者。
1. Review 别人提交到 Pull Request。
1. 发现 Jenkins 社区哪里可以改善，然后提个 Issue。

等等。所有你能想到的，促进 Jenkins 中文社区发展的事情都算是参与 Jenkins 中文社区。

但是，具体怎么做呢？

首先，我们都是基于 Git 工具进行协作的，所以，你需要会一些 Git 及 GitHub 的基础操作。接下来，咱们分别介绍每一种参与方式。

对 Git 与 GitHub 不熟悉的同学可以观看此教程视频：链接:https://pan.baidu.com/s/1nKY34O6KBUIpqewyixEexA ，密码：2sbt。

# Jenkins 中文社区代码仓库列表
那么，我们可以向哪些源代码仓库进行贡献呢？以下是各仓库的链接及简单介绍：

* [wechat](https://github.com/jenkins-infra/wechat)：存放 jenkins-zh.cn 网站的文章。也就是发文章可在此仓库提 PR。
* [jenkins-zh](https://github.com/jenkins-zh/jenkins-zh/)：Jenkins 中文社区网站源码，由 [Hugo](https://github.com/gohugoio/hugo) 实现。
* [wechat-backend](https://github.com/jenkins-zh/wechat-backend)：Jenkins 微信公众号机器人。
* [hugo-jenkins-theme](https://github.com/jenkins-zh/hugo-jenkins-theme)：Jenkins 中文社区网站主题。
* [artwork](https://github.com/jenkins-zh/artwork)：Jenkins 中文社区的艺术作品，比如 Jenkins Logo。

# 贡献 Jenkins 中文社区的具体工作
具体有哪些工作，可以让我们参与？

## 翻译 Jenkins 相关文章
所有的翻译任务都会列在 [GitHub的看板]](https://github.com/orgs/jenkins-zh/projects/2)上。可以在看板上找到自己感兴趣的文章，然后将其拖到“In progress”列。这样可以避免重复的翻译。

![kanban-jenkins.png](kanban-jenkins.png)

当然，为保证翻译质量，希望大家能做到：

1. 认真、负责第一位。
1. 翻译任务通常不建议超过两周。
1. 遵守[翻译规范](https://github.com/jenkinsci/localization-zh-cn-plugin/blob/master/specification.md)。

## Jenkins 中文本地化
本地化的工作包括：
1. 对 Jenkins 官方网站及{{< exref "博客" "https://jenkins.io/node/">}}的翻译。Pull Request 提交到：{{< exref "cn.jenkins.io 代码仓库" "https://github.com/jenkins-infra/cn.jenkins.io">}}。
1. 维护{{< exref "简体中文语言插件" "https://github.com/jenkinsci/localization-zh-cn-plugin" >}}Pull Request 提交到 {{< exref "localization-zh-cn-plugin" "https://github.com/jenkinsci/localization-zh-cn-plugin/pulls">}}

## 发表 Jenkins 原创文章

<TODO>

## 分享

你可以在本站或者 [Meetup]({{< ref "meetups.md" >}}) 上分享你在使用 Jenkins 或者相关技术时总结的经验、教训、成果等。

## 维护本站点

你可以从了解[本站的架构]({{< ref "about-site.md" >}})开始。小到错别字修正，大到站点风格、架构完善都需要你的参与。

## Review 别人提交到 Pull Request
Review 代码也算贡献社区的一种方式。

Linus 说过：Given enough eyeballs, all bugs are shallow（足够多的眼睛，就可让所有问题浮现）。所以，当有贡献者提 Pull Request 到 Jenkins 中文社区的任何一个代码仓库，原则上，我们都需要两人及以上的人对该 Pull Request 进行 review。

