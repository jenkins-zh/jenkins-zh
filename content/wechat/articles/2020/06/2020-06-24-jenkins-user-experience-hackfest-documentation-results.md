---
title: "Jenkins 黑客节用户体验文档报告"
description: "通过黑客节，我们得到了很多的进步，我们会进一步丰富技术文档，来提高 Jenkins 用户体验"
date: 2020-06-24
original: "https://www.jenkins.io/blog/2020/06/08/hackfest-docs-results/"
tags:
- ux
- documentation
- community
author: Mark Waite, Tracy Miranda
translator: wenjunzhangp
poster: "cover.jpg"
---

![cover](cover.jpg)

Jenkins 技术文档是我们项目的重要组成部分，因为它是正确使用 Jenkins 的关键。好的文档可以指导用户，并鼓励选择好的实现方式。这是用户体验的关键部分。

在最近的 Jenkins UI/UX hackfest 中，文档是改善 Jenkins 用户体验的特定途径。我们从经验丰富的 Jenkins 贡献者和新移民那里获得了许多进步。来自世界各地的贡献者提交了有关安装，管理和操作 Jenkins 文档的 PR。

![contributions-by-country](contributions-by-country.png)

## 从 Wiki 迁移文档

Jenkins Wiki 页面为 Jenkins 用户收集了 15 年的经验和智慧。但是，这种经验和智慧与不准确，不完整和过时的信息混杂在一起。

Jenkins Wiki 迁移项目确定了 Jenkins Wiki 上访问量最大的 50 个页面，并创建了 GitHub 问题来跟踪这些页面到 www.jenkins.io 的迁移。这是我们第一次使用 GitHub 问题作为文档的大规模实验。结果是压倒性的正面。Hackfest 贡献者在许多文档章节中添加了新的章节，包括：

* [Jenkins 使用](https://www.jenkins.io/doc/book/using/)
* [流水线](https://www.jenkins.io/doc/book/pipeline/)
* [Jenkins 管理](https://www.jenkins.io/doc/book/managing/)
* [系统管理](https://www.jenkins.io/doc/book/system-administration/)

Hackfest 解决了 Wiki 迁移问题中的 19 个问题。有关其他 25 个 Wiki 迁移问题的工作正在进行中。我们已经取得了长足的进步，并期待将来取得更好的成绩。新的贡献者非常有效地使用了“好第一期”标签。我们以未分配的 25 个“良好的第一期”中的大多数未分配开始了 Hackfest，并以 14 个已关闭的项目和另外 10 个正在进行的项目完成了 Hackfest。 当我们使用 Jenkins Wiki 迁移来欢迎新的文档撰稿人时，我们将提供更多的“良好的第一期”。

![sample-pages](sample-pages.png)

## 迁移插件文档

插件文档也在过渡中。自 2019 年 11 月以来，插件一直将其文档移至托管插件源代码的 GitHub 存储库中。这种[“将文档作为代码”](https://www.jenkins.io/blog/2019/10/21/plugin-docs-on-github/)的方法使插件维护人员可以在实现新功能的相同 PR 中包括文档改进。它确保文档更改由审查和批准新功能的相同维护者审查。

Hackfest 参与者提交了 PR，以将插件文档迁移到 GitHub。Hackfest 正在进行 10 个插件提取请求。来自 Hackfest 的 5 个插件 PR 已被合并，正在等待插件的发布。

## Chuck Norris 使用文档作为代码

出于娱乐和冒险的精神，Oleg Nenashev [在 2020 年 5 月 26 日的 Hackfest 现场演示](https://www.youtube.com/watch?v=BaEJ8v7INNQ)中将 “Chuck Norris 插件” 迁移为 GitHub 文档中的代码。可以从以下链接获取录音，插件迁移指南和导出工具的链接：[将插件迁移为代码文档](https://github.com/jenkinsci/ui-ux-hackfest-2020/tree/master/presentations/04-migrating-plugin-docs)”。

![chuck-norris-docs-as-code](chuck-norris-docs-as-code.png)

## 文档更新

Jenkins 与其他技术合作，解决了许多不同环境中的自动化挑战。我们在“[解决方案页面](https://www.jenkins.io/solutions/)”中描述了这些环境。作为 Hackfest 的一部分，我们已经对解决方案页面进行了一系列改进。

[Docker 解决方案](https://www.jenkins.io/solutions/)页面现在包括更新的视频和更好的页面布局，以便于阅读和导航。其他解决方案页面将来也会得到类似的改进。

![jenkins-and-docker](jenkins-and-docker.png)

## 系统属性

可以在启动时通过定义 Java 属性来修改 Jenkins 的全局配置。当新的默认配置可能与现有安装不兼容时，系统属性可以更改系统默认值，并可以提供兼容性“转义阴影线”。

Daniel Beck 作为 Hackfest 的一部分，改进了系统属性页面的导航和用户体验。现在，通过将鼠标悬停在每个属性的右侧以及对每个属性进行分类和分类的标签，可以使用可嵌入的链接来轻松阅读和引用。

![system-properties](system-properties.png)

## 插件站点改进

在 Hackfest 期间，Gavin Mogan 继续致力于改善 Jenkins 插件站点，以便用户可以轻松访问插件更改日志和报告的问题。合并此 PR 后，它将极大地改善那些想要更新插件并查找有关其变化和可能遇到的问题的文档的 Jenkins 用户的体验。

Jira 插件的传入 UI 示例：

![plugins-site](plugins-site.png)

## 下一步是什么？

Jenkins 文档中仍有很多工作要做，我们需要您的帮助。[参与](https://www.jenkins.io/participate/) Jenkins 项目的方式有很多，包括[文档](https://www.jenkins.io/participate/document)。请参阅[提供指导](https://github.com/jenkins-infra/jenkins.io/blob/master/CONTRIBUTING.adoc)以获取详细说明。加入文档聊天室，获得个性化的帮助和鼓励。

Jenkins 项目也已于今年加入 [Google Docs](https://developers.google.com/season-of-docs)。这项开源指导计划使开源社区和技术作家社区聚集在一起，从而使双方受益。我们正在寻找有兴趣为 2020 年 9 月至 12 月对该项目做出贡献的技术撰稿人。这是学习作为文档编码的工具并了解有关为开源项目做出贡献的更多信息的绝佳机会。您可以在[此处](https://www.jenkins.io/sigs/docs/gsod/)找到 Jenkins 项目构想和更多信息。