---
title: "如何参与"
description: "参与 Jenkins 中文社区的具体步骤"
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

1. 发表或翻译 Jenkins 相关的文章，并发表到社区网站及微信公众号。
1. Jenkins 本地化。
1. 成为 Jenkins 线下或线上活动的志愿者。
1. Review 别人提交到 Pull Request。
1. 发现 Jenkins 社区哪里可以改善，然后提个 Issue 或 Pull Request。

等等。所有你能想到的，促进 Jenkins 中文社区发展的事情都算是参与 Jenkins 中文社区。

但是，具体怎么做呢？

首先，我们都是基于 Git 工具进行协作的，所以，你需要会一些 Git 及 GitHub 的基础操作。接下来，咱们分别介绍每一种参与方式。

# Jenkins 中文社区代码仓库列表
那么，我们可以向哪些源代码仓库进行贡献呢？以下是各仓库的链接及简单介绍：

* [wechat](https://github.com/jenkins-infra/wechat)：存放 jenkins-zh.cn 网站的文章。也就是发文章可在此仓库提 PR。
* [jenkins-zh](https://github.com/jenkins-zh/jenkins-zh/)：Jenkins 中文社区网站源码，由 [Hugo](https://github.com/gohugoio/hugo) 实现。
* [wechat-backend](https://github.com/jenkins-zh/wechat-backend)：Jenkins 微信公众号机器人。
* [hugo-jenkins-theme](https://github.com/jenkins-zh/hugo-jenkins-theme)：Jenkins 中文社区网站主题。
* [artwork](https://github.com/jenkins-zh/artwork)：Jenkins 中文社区的艺术作品，比如 Jenkins 中文社区 Logo。

# 贡献 Jenkins 中文社区的具体工作
具体有哪些工作，可以让我们参与？

## 翻译 Jenkins 相关文章
所有的翻译任务都会列在 [GitHub的看板](https://github.com/orgs/jenkins-zh/projects/2)上。可以在看板上找到自己感兴趣的文章，然后将其拖到“In progress”列。这样可以避免重复的翻译。

![kanban-jenkins.png](/images/kanban-jenkins.png)

当然，为保证翻译质量，希望大家能做到：

1. 认真、负责第一位。
1. 翻译任务通常不建议超过两周。
1. 遵守[翻译规范](https://github.com/jenkinsci/localization-zh-cn-plugin/blob/master/specification.md)。

## Jenkins 中文本地化
本地化的工作包括：

1. 对 Jenkins 官方网站及{{< exref "博客" "https://jenkins.io/node/">}}的翻译。Pull Request 提交到：{{< exref "cn.jenkins.io 代码仓库" "https://github.com/jenkins-infra/cn.jenkins.io">}}。
1. 维护{{< exref "简体中文语言插件" "https://github.com/jenkinsci/localization-zh-cn-plugin" >}}Pull Request 提交到 {{< exref "localization-zh-cn-plugin" "https://github.com/jenkinsci/localization-zh-cn-plugin/pulls">}}。

## 发表 Jenkins 原创文章
原创内容包括：Jenkins 相关、持续集成、持续交付、DevOps

在 Jenkins 中文社区提交的 PR 通过后，会发布在多个不同的媒体平台上，目前包括：

1. [Jenkins 中文社区网站](https://jenkins-zh.cn/)
2. Jenkins 微信公众号
3. [开源中国博客](https://my.oschina.net/jenkinszh)
4. [简书专栏](https://www.jianshu.com/c/b34c41b2f68f)
5. [掘金](https://juejin.im/user/5caa989b5188254418337798/posts)

### 发表原创文章的步骤

1. Fork [wechat](https://github.com/jenkins-infra/wechat) 仓库，如果你还没有 fork。
2. 在本地，参考 [范文](https://github.com/jenkins-infra/wechat/blob/master/articles/sample.md) 写文章。动手前请仔细阅读请阅读[规范](https://github.com/jenkins-infra/wechat/blob/master/articles/README.md)。如果实在不明白的话，你也可以参考其它仓库中 [articles](https://github.com/jenkins-infra/wechat/tree/master/articles) 目录下的其它文章来写就好。
3. 将本地的提交，推到自己的仓库。
4. 在 GitHub 上提一个 PR。

### 关于排期
为了尽可能满足你期望的发布日期，可以自行选择，但同时需要满足如下的条件：

* 为保障大家有足够的时间进行 Review，建议排到一周以后
* 工作日
* 避免同一天有相同类型的文章

### 提 PR 时的要求
1. PR 的标题格式：[类型-文章排期] 标题
2. 在 PR 类型列表前的 `[]` 中加入一个 `x`，例如：`[x]`

更多内容请参考 [PULL_REQUEST_TEMPLATE.md](https://github.com/jenkins-infra/wechat/blob/master/.github/PULL_REQUEST_TEMPLATE.md)

## 分享

你可以在本站或者 [Meetup]({{< ref "meetups.md" >}}) 上分享你在使用 Jenkins 或者相关技术时总结的经验、教训、成果等。

## 维护本站点

你可以从了解[本站的架构]({{< ref "about-site.md" >}})开始。小到错别字修正，大到站点风格、架构完善都需要你的参与。

## Review 别人提交到 Pull Request
Review 代码也算贡献社区的一种方式。

Linus 说过：“Given enough eyeballs, all bugs are shallow（足够多的眼睛，就可让所有问题浮现）”。所以，当有贡献者提 Pull Request 到 Jenkins 中文社区的任何一个代码仓库，原则上，我们都需要两人及以上的人对该 Pull Request 进行 review。