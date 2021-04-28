---
title: Jenkins Operator 成为官方子项目
date: 2021-04-28
description: Jenkins Operator 是 k8s 平台上的 operator 模块，可以方便在 k8s 上部署 Jenkins，现已成为官方子项目
author: Bartek Antoniak, Sylwia Brant 
translator: AlexLei
original: https://www.jenkins.io/blog/2021/04/15/jenkins-operator-sub-project/
poster: gopher-butler-256.png
---
我们很高兴的宣布，Jenkins Operator 已正式成为 Jenkins 官方子项目。

## 这件事意味着什么？

![Gopher butler](gopher-butler-256.png)

成为 Jenkins 官方项目的组成部分，也是为了能更好地与 Jenkins 总体路线规划保持一致而迈出的重要一步，这也将会大大增加这个项目被使用的几率。

我们是隶属于 VirtusLab 并专门维护该项目的团队。我们终于可以和这个大社区互动，并参加 Cloud-Native SIG 会议。 这也为每个想为该项目提出建议或参与支持的人提供了平台。

我们坚信，有了社区的支持将大大改善 Jenkins Operator 项目自身以及 Jenkins 生态系统。


## 填补 Jenkins 与 Kubernetes 间的缝隙

在 Kubernetes 这样的云原生环境中运行 Jenkins 并不是件容易的事。我们希望通过该项目提供的功能使社区能够充分利用 Kubernetes 以及云平台的能力：
  - 集成云平台原生的监控、存储、安全机制
  - Kubernetes 的自动扩容和自我修复机制
  - 安全访问 Jenkins 实例
  - 声明式配置（Kubernetes Custom Resources）
  - 全生命周期管理，最终实现自动管理（autopilot）

## 参与项目，共享发展

邀请您[参与贡献](https://github.com/jenkinsci/kubernetes-operator/blob/master/CONTRIBUTING.md)该项目，实际体验自动管理 Jenkins 的乐趣！别犹豫，请参与到社区活动中来。与我们一起努力实现您认为有用的功能。也欢迎您提出缺陷、建议或补丁。我们正在积极解决社区提出的问题与建议，并设立了专门的 [Slack 互动频道](https://github.com/jenkinsci/kubernetes-operator#community)。

本项目原由 [VirtusLab](http://virtuslab.com/) 公司设立，并在持续维护中。成为 Jenkins 官方子项目后，我们也[正在讨论（google groups）](https://groups.google.com/g/jenkinsci-dev/c/OA5nb_SAgh0/m/OoBS2o8nAwAJ:)创建一个开放式的治理机制来促进沟通和协作。

## 向我们反馈并引导项目前进

为庆祝我们项目正在开启的新可能性，诚邀您参加一个小调查，助力我们找到正确方向。如您正在使用 Jenkins Operator 或在任何其他环境中运行 Jenkins，请花一点时间填写我们的快速调查表。我们将选择至少三个最有用的答案，送出我们专门设计的T恤，上面印有我们可爱的 Gopher 管家。点击[这个链接打开调查问卷（google docs）](https://docs.google.com/forms/d/1doIkgnm3_WbjtlwWSU4sOoiI7QoneHlYIjXEJOVMrfQ/edit?usp=sharing)，真诚的回复也是对我们项目最好的支持。
![gopher tshirt](tshirt-logo.jpg)

另外，如果您还没有用过 Jenkins Kubernetes Operator，[欢迎您下载使用](https://www.jenkins.io/projects/jenkins-operator/#getting-started)。试一试，发现在 Kubernetes 上 运行 Jenkins 的新方式。