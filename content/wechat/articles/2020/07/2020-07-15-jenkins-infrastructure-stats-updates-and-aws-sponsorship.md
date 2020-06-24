---
title: "Jenkins 基础设施：统计、更新、AWS 赞助"
description: "聊聊 Jenkins 统计、更新、AWS和赞助的那些事儿，认识不一样的 Jenkins"
date: 2020-07-15
original: "https://www.jenkins.io/blog/2020/06/17/infra-and-aws-donation/"
tags:
- aws
- community
- infrastructure
author: Olivier Vernin
translator: wenjunzhangp
poster: "cover.jpg"
---

![cover](cover.jpg)

Jenkins 项目在很大程度上依赖于其基础架构。我们使用诸如 [www.jenkins.io](https://www.jenkins.io/) 和 [plugins.jenkins.io](https://plugins.jenkins.io/) 之类的网站，诸如 [issue.jenkins.io](https://issues.jenkins.io/secure/Dashboard.jspa) 之类的议题系统，诸如 [ci.jenkins.io](https://ci.jenkins.io/) 之类的 CI/CD 基础设施以及许多其他服务。为了提供有关 Jenkins 基础设施规模的一些信息，以下是 2020 年 4 月的一些数据：

* 超过 60 万人访问了 [www.jenkins.io](https://www.jenkins.io/)
* 超过 25 万个 Jenkins 服务器定期检查 [Jenkins 软件包服务器](https://pkg.jenkins.io/)和 [Jenkins 更新服务器](https://updates.jenkins.io/)
* [ci.jenkins.io](https://ci.jenkins.io/) 上有超过 43000 个持续集成工作
* 超过 950 个插件在 [ci.jenkins.io](https://ci.jenkins.io/) 上运行了他们的持续集成管道

jenkins.io 的国家（地区）访客

![world-map](world-map.png)

Jenkins 项目是一个开源项目，由其出色的社区构建和维护。像在任何组织中一样，有特定的人员来确保那些服务始终处于运行状态。欢迎大家[加入](https://www.jenkins.io/participate/)。基础设施也不例外，我们一直在[寻找基础设施的新贡献者](https://www.jenkins.io/projects/infrastructure/#contributing)！

尽管我们无法公开共享诸如机密和证书之类的所有内容，但我们仍会尽量保持透明，以使每个人都可以理解和改进我们的基础结构而无需特权访问。有什么比使用 Git 管理基础架构工作更好的方法？

## 谁说的 GitOps？

自 2008 年 3 月在 GitHub 上创建 [Jenkins-infra 组织](https://github.com/jenkins-infra)以来，已有 650 多人参与了 80 多个 git 存储库。这些贡献使 Jenkins 社区变成了现在的样子。如果您在该处找不到任何东西，则可能意味着需要一些帮助。

最近，在 [Gavin Mogan](https://github.com/halkeye)、[Tim Jacomb](https://github.com/timja)、[Alex Earl](https://github.com/slide)的帮助下，在许多方面都取得了重大成就，例如自动化 Jenkins 版本，刷新 [plugins.jenkins.io](https://plugins.jenkins.io/)，向 [ci.jenkins.io](https://ci.jenkins.io/computer/) 添加新代理以及维护我们的 Kubernetes cluster。我们感谢他们的帮助以及他们所实现的基础架构的进步。

## 大规模基础设施

Jenkins 项目所做的大规模运行基础设施是昂贵的，有时是非常艰巨的。我们很幸运能得到许多领先公司的支持，这些公司向我们提供了他们的专业知识，产品和支持。

最近，亚马逊网络服务公司捐赠了 6 万美元，用于在 AWS 云上运行 Jenkins 基础架构。我们非常感谢他们的捐款及其提供的灵活性。我们正在 AWS 上运行具有 AMD64 和 ARM64 架构的Linux代理。我们将 AWS 云用于 Windows 代理。Amazon Web Services 的慷慨基础设施捐赠增加了我们的持续集成能力，并扩大了我们的平台覆盖范围。

## 我们的赞助商

Jenkins 基础设施的主要赞助商包括 [CloudBees](https://cloudbees.com/)、[俄勒冈州立大学开源实验室](https://osuosl.org/)、[Continuous Delivery Foundation](https://cd.foundation/)、[Red Hat](https://redhat.com/)、[Amazon Web Services](https://aws.amazon.com/cn/) 和 [GitHub](https://github.com/)。

Jenkins 基础设施服务和软件的其他赞助商包括 [Atlassian](https://www.atlassian.com/)、[Datadog](https://www.datadoghq.com/)、[Fastly](https://www.fastly.com/)、[IBM](https://www.ibm.com/cn-zh)、[JFrog](https://jfrog.com/)、[Pagerduty](https://www.pagerduty.com/)、[Rackspace](https://www.rackspace.com/)、[Sentry](https://www.sentry.io/)、[Serverion](https://www.serverion.com/)、[SpinUp](https://spinup.com/)、[清华大学](https://www.tsinghua.edu.cn/)和 [XMission](https://xmission.com/)。

这些组织中的每一个都以自己的方式在支持 Jenkins 项目。我们感谢他们的贡献、支持和愿意帮助 Jenkins 社区的意愿。

[https://www.jenkins.io/projects/infrastructure/](https://www.jenkins.io/projects/infrastructure/)