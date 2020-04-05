---
title: 自动更新、易于使用的 Jenkins
description: 借助 Evergreen 持续提供易于使用的 Jenkins
tags:
- jenkinsworld
- jenkinsworld2018
- evergreen
author: rtyler
translator: runzexia
---

当我第一次{{< exref "写 Jenkins Evergreen 相关的文章" "https://jenkins.io/blog/2018/04/06/jenkins-essentials/" >}}， 后来被称为 "Jenkins Essentials"，我提到的一系列的未来的发展在接下来的几个月里已经变成了 **现实** 。 今年在旧金山举办的 DevOps World - Jenkins World 会议上，我会介绍 Jenkins Evergreen 背后哲学的更多细节，展示我们已经做了什么，并且讨论这个激进的 Jenkins 发行版的走向。

{{< img "/images/evergreen/magician_256.png" >}}

正如我在第一篇博客以及{{< exref "JEP-300" "https://github.com/jenkinsci/jep/tree/master/jep/300" >}}中所讨论的 Jenkins Evergreen 的前两大支柱是我们关注的要点.

# 自动更新的发行版

不出所料, 实现安全、自动地更新Jenkins发行版（包括核心和插件）所需的机制需要很多的工作。在{{< exref "Baptiste 的演讲中" "https://jenkins.io/blog/2018/09/13/speaker-blog-evergreen-safely-upgrading/" >}}他将讨论如何使 Evergreen "走起来"，而我会讨论 **为何** 自动更新的发行版很重要。

持续集成和持续交付变得越来越普遍，并且是现代软件工程的基础 ，在不同的组织当中有两种不同的方式使用 Jenkins 。在一些组织当中，Jenkins 通过 Chef ，Puppet 等自动化工具有条不紊的被管理和部署着。然而在许多其他组织当中， Jenkins 更像是一个 **设备** ，与办公室的无线路由器不同。当安装完毕，只要它能继续完成工作，人们就不会太多的关注这个设备。

Jenkins Evergreen 发行版通过确保最新的功能更新，bug 修复以及安全性修复始终能安装到 Jenkins 当中,"让 Jenkins 更像是一个设备"。

除此之外, 我相信 Evergreen 能够向一些我们现在没有完全服务的团队提供良好的服务:这些团体希望能够以 **服务** 的形式使用 Jenkins 。我们暂时没有考虑提供公有云版本的 Jenkins 。我们意识到了自动接收增量更新，使用户可以在无需考虑更新 Jenkins 的情况下进行持续开发的好处。

我相信 Jenkins Evergreen 可以并且可以提供相同的体验。

# 自动配置默认值

Jenkins 平台真正强大的地方是可以为不同的组织提供不同的模式和做法。对于很多新用户来说，或一些只希望使用通用案例的用户来说， Jenkins 的灵活性与让用户做出合适的选择形成了悖论。使用 Jenkins Evergreen，很多常用的配置将自动配置，使 Jenkins 变成开箱即用的工具。

默认情况下将包括 Jenkins 流水线和 Jenkins Blue Ocean，我们也删除了一些 Jenkins 的遗留功能。

我们同样在使用非常棒的{{< exref "Configuration as Code" "https://jenkins.io/projects/jcasc/" >}}进行工作, Configuration as Code 现在已经完成了1.0版本的发布, 我们通过它实现自动进行默认配置。

# 现状

迄今为止，这个项目取得了重大的进展，我们非常高兴有用户开始尝试 Jenkins Evergreen，现在{{< exref "Jenkins Evergreen" "https://jenkins.io/projects/evergreen" >}}已经可以被 **早期使用者** 尝试. 不过我们现在 **不** 推荐在生产环境中使用 Jenkins Evergreen 。

我们希望能够得到您的反馈和想法在我们的{{< exref "Gitter channel" "https://gitter.im/jenkins-infra/evergreen" >}}!
