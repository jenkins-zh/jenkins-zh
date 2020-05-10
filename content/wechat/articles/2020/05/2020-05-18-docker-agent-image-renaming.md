---
title: Jenkins agent Docker 镜像重新命名了，赶快来了解一下吧！
date: 2020-05-18
description: 本文介绍了 Jenkins agent Docker 镜像新名称、重新命名的缘由、升级说明以及下一步计划
author: Oleg Nenashev
poster: dockerJenkins.png 
translator: donhui  
original: https://www.jenkins.io/blog/2020/05/06/docker-agent-image-renaming/
tags:
- announcement  
- docker  
- jenkins  
- platform-sig
---

![dockerJenkins](dockerJenkins.png)

我们想要宣布对 Jenkins agent 官方 Docker 镜像重新命名。
它不会对 Jenkins 用户产生任何直接影响，但是希望他们逐渐升级他们的实例。
本文提供了新的镜像名称、升级过程以及旧镜像支持策略等相关信息。
我们还将讨论在 Jenkins 中 Docker 包的下一步计划。

## 新镜像名称

* [jenkins/agent](https://hub.docker.com/r/jenkins/agent) 是旧的 [jenkins/slave](https://hub.docker.com/r/jenkins/slave) 镜像的新名称，从 [4.3-2](https://github.com/jenkinsci/docker-agent/releases/tag/4.3-2) 开始
* [jenkins/inbound-agent](https://hub.docker.com/r/jenkins/inbound-agent) 是旧的 [jenkins/jnlp-slave](https://hub.docker.com/r/jenkins/jnlp-slave) 镜像的新名称，从 [4.3-2](https://github.com/jenkinsci/docker-inbound-agent/releases/tag/4.3-2) 开始
* [jenkins/ssh-agent](https://hub.docker.com/r/jenkins/ssh-agent) 是旧的 [jenkins/ssh-slave](https://hub.docker.com/r/jenkins/ssh-slave) 镜像的新名称，从 [2.0.0](https://github.com/jenkinsci/docker-ssh-agent/releases/tag/2.0.0) 开始

请参阅下面的升级指南。

## 为什么要重新命名？

"slave" 一词在开源社区中被广泛认为是不合适的。它已于2016年在 Jenkins 2.0中正式弃用，但在某些 Jenkins 组件中仍有剩余用法。
这个 Epic —— [JENKINS-42816：Slave 到 Agent 的重命名遗留问题](https://issues.jenkins-ci.org/browse/JENKINS-42816) 用于跟踪此类问题的清理。
官方 Docker agent 镜像是一个显而易见的案例，要修改在 DockerHub 上的旧版本镜像并非易事。很高兴这次更新终于解决了镜像命名问题。

另一个值得注意的变化是使用 *inbound agent* 代替 *JNLP agent* 术语。
历史上，"JNLP" 已被用作[远程协议](https://github.com/jenkinsci/remoting/blob/master/docs/protocols.md)的名称。
JNLP 代表 [Java Network Launch Protocol](https://en.wikipedia.org/wiki/Java_Web_Start#Java_Network_Launching_Protocol_(JNLP))，它是 Java Web Start 的一部分。
在 Java 1.8 上运行 agent 时，Jenkins 支持 agent 的 Java Web Start 模式，但是我们的网络协议基于 TCP 的，与 Java Network Launch Protocol 无关。
此名称从一开始就非常混乱，随着 Jenkins 2.217（[JEP-222](https://github.com/jenkinsci/jep/blob/master/jep/222/README.adoc)）中引入 WebSocket 支持而变得更糟。
Docker agent 镜像支持 WebSockets，因此我们决定将镜像名称更改为 [jenkins/inbound-agent](https://hub.docker.com/r/jenkins/inbound-agent)，这样可以防止进一步的混乱。
*Inbound agent* 术语是指 agent 协议，其中 agent 通过不同的协议启动与 Jenkins master 的连接。

非常感谢 [Alex Earl](https://www.jenkins.io/blog/authors/slide_o_mix/) 和 [krufab](https://github.com/krufab) 进行的存储库重组工作，这使重命名成为可能！还要感谢 [Tim Jacomb](https://www.jenkins.io/blog/authors/timja/)、[Marky Jackson](https://www.jenkins.io/blog/authors/markyjackson-taulia/)、[Mark Waite](https://www.jenkins.io/blog/authors/markewaite)、[Ivan Fernandez Calvo](https://github.com/kuisathaverat) 和其他贡献者的评审和测试。

## 升级和兼容性说明

好消息是此命名不会引起重大变化。所有镜像已被修改为在内部使用新术语。
如果使用以前镜像的最新版本，那么可以使用新名称替换就名称。
这些名称可以在 Dockerfile、脚本和 Jenkins 配置中引用。

我们将继续在 DockerHub 上更新旧镜像至少3个月（直到2020年8月5日）。
不会在旧镜像中添加任何新配置和平台，但是所有现有配置和平台都将保持可用（ Java 1.8的 Debian 和 Java 1.8的 Alpine，等等）。
2020年8月5日之后，旧镜像将不再接收更新，但以前的版本将仍然对 DockerHub 的用户可用。

## 下一步计划是什么？

我们将继续在 Jenkins 组件中重命名引用旧镜像名称的 Docker 镜像。
还有一组[便利的 Docker 镜像](https://github.com/jenkinsci/jnlp-agents)，其中包括 Maven 或 Gradle 之类的构建工具，这些工具将在以后重命名。
该 `jenkins/ssh-agent` 镜像将来也可能会重命名；请参阅此开发人员[邮件列表线程中](https://groups.google.com/forum/#!msg/jenkinsci-dev/oxD-Hd_7l9k/WAbvqD-wEQAJ)正在进行的讨论。

如果您对 Jenkins Docker 包中的新功能非常感兴趣，请继续关注未来的公告！
您可以在 [Jenkins 公开路线图中](https://www.jenkins.io/project/roadmap/) 找到多个正在进行的计划 （在草案阶段，请参阅 [JEP-14](https://github.com/jenkinsci/jep/blob/master/jep/14/README.adoc)）

一些故事： 

* Windows 镜像的一般可用性。
* 支持更多平台（AArch64、IBM s390x、PowerPC）。
* 切换到 AdoptOpenJDK。
* 引入多平台 Docker 镜像。

如果您对这些项目中的任何一个感兴趣并想做出贡献，请联系 [Platform Special Interest Group](https://www.jenkins.io/sigs/platform)，该[小组](https://www.jenkins.io/sigs/platform)负责协调与 Docker 中的 Jenkins 相关的计划。

关于 Docker 镜像之外的 agent 术语清除，我们将继续在 [Advocacy＆Outreach SIG](https://www.jenkins.io/sigs/advocacy-and-outreach) 中进行此项目。
如果您在 Jenkins 组织中的任何地方（Web UI、文档等）看到过时的 "slave" 术语的使用，请随时提交 pull request 或在这个 Epic —— [JENKINS-42816：Slave 到 Agent 的重命名遗留问题](https://issues.jenkins-ci.org/browse/JENKINS-42816)中报告问题。
在 `jenkinsci` GitHub 组织中恰好有 [3000个问题](https://github.com/search?q=org%3Ajenkinsci+slave&type=Code)，但我们会完成这个目标。
对于任何贡献将不胜感激！
