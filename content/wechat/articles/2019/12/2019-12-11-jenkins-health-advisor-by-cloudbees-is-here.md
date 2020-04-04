---
title: "Jenkins 健康检查顾问"
description: "CloudBees 推出了一项新的免费服务:Jenkins Health Advisor，帮助您保持 master 节点的健康"
date: 2019-12-11
original: "https://jenkins.io/blog/2019/11/22/jenkins-health-advisor-by-cloudbees/"
tags:
- Jenkins
- CloudBees
keywords:
- jenkins
- health
- healthcheck
- stability
author: Arnaud Héritier
translator: wenjunzhangp
poster: "cover.jpg"
---

![cover](cover.jpg)

管理任何软件都面临着独特的挑战。Jenkins Masters 也不例外。例如，

* 您如何掌握 Jenkins 环境中发生的所有事情？您是否正在查看问题跟踪器中打开的每个新缺陷？
* 您如何确保您的 master 或 agents 不会默默失效？您是否正在监控其日志？监控其所有内部组件？如果出现问题，您该如何解决？
* 您如何避免出现 “Angry Jenkins” 图标？

这就是我们通过 CloudBees 创建 Jenkins Health Advisor 的原因。

在 [CloudBees](https://www.cloudbees.com/?utm_medium=blog&utm_source=jenkins.io&utm_campaign=cloudbees-jenkins-advisor-plugin)，我们拥有多年为[使用 Jenkins 的客户提供支持](https://www.cloudbees.com/products/cloudbees-jenkins-support/overview)的经验，其中包括基于 Jenkins 构建的专有产品，例如 [CloudBees Core](https://www.cloudbees.com/products/core/overview)。因此，我们的支持团队由拥有 Jenkins 知识的自动化专家组成，您在其他任何地方都无法获得。

当我们的工程师创建一个平台时，便会开始自动运行状况检查，以便他们可以编写规则来检测客户提供的 [support bundles](https://plugins.jenkins.io/support-core) 中的已知问题，并将其重定向到所需的知识源以诊断和解决问题。

经过多年的内部使用，我们决定与社区共享此服务，我们很高兴为 **每个 Jenkins 用户推出一项新的免费服务**：[Jenkins Health Advisor by CloudBees](https://www.cloudbees.com/jenkins/health-advisor-plugin)。

[Jenkins Health Advisor by CloudBees](https://www.cloudbees.com/jenkins/health-advisor-plugin) 自动分析您的 Jenkins 环境，主动识别潜在问题，并通过详细的电子邮件报告为您提供解决方案和建议。

![logo](logo.svg)

[Jenkins Health Advisor by CloudBees](https://www.cloudbees.com/jenkins/health-advisor-plugin) 可以检测到各种问题，从简单的配置问题到安全性和最佳实践问题-Jenkins 实现的所有关键要素。入门过程分为 [3 个步骤](https://www.cloudbees.com/jenkins/health-advisor-plugin#download)，您将在 24 小时内收到第一份报告。

![overview](overview.png)

我们希望您会喜欢这项服务，它将帮助您保持 masters 的健康。

花几分钟时间阅读我们的[文档](https://docs.cloudbees.com/docs/admin-resources/latest/plugins/cloudbees-jenkins-advisor?utm_medium=blog&utm_source=jenkins.io&utm_campaign=cloudbees-jenkins-advisor-plugin)，发现服务，并随时通过 Jenkins 社区渠道（[Gitter](https://gitter.im/jenkinsci/jenkins)、[jenkinsci-users@googlegroups.com](https://groups.google.com/forum/#!forum/jenkinsci-users)，…）与我们联系。

也不要错过在 [DevOps World|Jenkins World 2019](https://www.cloudbees.com/devops-world/lisbon)上与我们的支持团队会面的机会。

参考链接：

* [插件文档](https://docs.cloudbees.com/docs/admin-resources/latest/plugins/cloudbees-jenkins-advisor?utm_medium=blog&utm_source=jenkins.io&utm_campaign=cloudbees-jenkins-advisor-plugin)
* [Jenkins 插件网站](https://plugins.jenkins.io/cloudbees-jenkins-advisor)
* [CloudBees Jenkins 支持](https://www.cloudbees.com/products/cloudbees-jenkins-support/overview)