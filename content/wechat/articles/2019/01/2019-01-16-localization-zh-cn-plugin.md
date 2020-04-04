---
title: "Jenkins 中文语言包"
description: "Jenkins 中文版本升级通知"
author: linuxsuren
toc: true
---

部分 Jenkins 中文用户可能已经发现，在最近升级 Jenkins 版本，或下载较新的 Jenkins 后，界面上很多部分显示的是英文。对此，我简单介绍一下原因以及如何安装中文插件。

各种语言的本地化资源文件都是集中存放在 Jenkins Core 及其插件中，这对于要做本地化贡献的人来说，需要向很多代码仓库中提交 PR。最明显的一个现象就是，这些仓库不一定都会有熟悉中文的维护者，因此导致 PR 无法真实、及时地进行 Review 以及合并发布。基于以上的考虑，我开发了简体中文插件，并从 Jenkins `2.145` 版本中把大部分的中文本地化资源文件迁移到了该插件中。而且，最终会对 Jenkins Core 以及流行的插件中所有的中文本地化资源文件进行迁移。

安装简体中文插件也很简单，只要在 Jenkins 的插件管理界面上，搜索*中文*就能找到该插件。安装并重启后就能看到中文界面。

更多细节请查看{{< exref "变更记录" "https://jenkins.io/changelog/" >}}。欢迎对中文本地化工作感兴趣的同学[加入我们]({{< relref "about/how-to-involve.md" >}})！