---
layout: post
title: "Java 11 预览支持已在 Jenkins 2.155+ 中可用"
description: "Java 11 预览支持已在 Jenkins 2.155+ 中可用"
date: 2019-02-20
tags:
- core
- developer
- java11
- community
- platform-sig
author: oleg_nenashev
translator: cizezsy
links:
  gitter: /jenkinsci/platform-sig
  googlegroup: jenkins-platform-sig
  sig: platform
---

> NOTE: 这是由 [Java 11 支持团队](https://github.com/orgs/jenkinsci/teams/java11-support) 联合撰写的博客。
在 12 月 18 号（UTC时间下午4点）我们也会在 Jenkins 在线 Meetup 展示对 Java 11 的预览支持。（[链接](https://www.meetup.com/Jenkins-online-meetup/events/257008190/)）

![Jenkins Java](../../../images/logos/formal/256.png)

Jenkins 作为领先的开源自动化服务器之一，目前仍然只支持到 Java 8。在 9 月 25 日 OpenJDK 11 发布了。这是一个长期支持版本，并将持续多年，我们想要在 Jenkins 项目中对这个版本进行全面的支持。在过去的一年中，许多贡献者一直致力于在项目中支持 Java 11（Jenkins JEP-211）。这是一条艰辛的道路，但是现在，代表 [Jenkins Platform SIG](https://jenkins.io/sigs/platform)，我们很高兴的宣布在 Jenkins 每周发布提供 Java 11 预览！


为什么我们需要 Java 11 的预览？

这是因为它可以提供给 Jenkins 贡献者和早期使用者一个在明年年初（译者注：此文发布于 2018 年）GA 发布之前尝试这些变化的途径。它也可以帮助我们进行更多的探索性测试，并且有希望在 Jenkins 正式地提供 Java 11 支持之前，解决大部分的问题。


在这篇文章中，我们将会介绍如何在 Java 11 环境下运行 Jenkins，还有如何调查兼容性问题并报告它们。

### 背景

你可能还记得，在 2018 年 6 月我们举办了一个针对 Java 10+ 支持的[在线黑客马拉松](https://jenkins.io/blog/2018/06/08/jenkins-java10-hackathon/)。作为黑客马拉松的一部分，我们提供了 [Java 11 的实验性支持](https://jenkins.io/blog/2018/06/17/running-jenkins-with-java10-11/)。这次活动对我们来说非常成功。我们可以在 Java 10 和 Java 11-ea 环境下运行 Jenkins 以及一些主要的功能 —— 包括流水线、JobDSL、Docker/Kubernetes plugin、Configuration as Code、BlueOcean 等。它让我们相信我们可以在 Jenkins 中提供Java 11支持而不会发生破坏性变化。在这场马拉松之后 [Oleg Nenashev](https://github.com/oleg-nenashev/) 创建了 ["Java 10+ support in Jenkins"](https://github.com/jenkinsci/jep/blob/master/jep/211/README.adoc)（之后修改为只针对支持 Java 11）。[Jenkins Platform SIG](https://jenkins.io/sigs/platform) 也已成立，以协调 Java 11 的支持工作和其他平台的支持工作（打包，操作系统支持等）。

一组贡献者一直持续致力于 Java 11 支持，他们主要在关注上游的功能性补丁、在开发工具中提供 Java 11 支持、测试和解决已知的兼容性问题。详细的状态的更新，请参阅 [Platform SIG 的会议记录](https://jenkins.io/sigs/platform/#meetings)。从 Jenkins 2.148 开始，Jenkins 在多个不同的 Linux 和 Windows 平台下成功的在最新的 OpenJDK 11 版本下运行。我们进行了大量的自动化和探索性测试，除了一些例外（见下文），大部分 Jenkins 插件运行良好。GA 版本发布需要的自动化测试工作还在进行，但是我们已经成功的运行了 Jenkins core 的测试，通过了全部的 [Acceptance Test Harness](https://github.com/jenkinsci/acceptance-test-harness/)，以及在推荐插件上运行通过了 [Plugin Compat Tester](https://github.com/jenkinsci/plugin-compat-tester)。我们也部署了一个临时的为 Java 11 搭建的 [Experimental Update Center](https://github.com/jenkinsci/jep/tree/master/jep/211#temporary-experimental-update-center-for-java-11)，可以为 Java 11 的早期采用者提供快速的问题修复。使用Java 11 运行时，Jenkins 2.155+ 将会默认使用此更新中心，这就是我们宣布此版本的预览可用性的原因。

在 2018 年 11 月 19 日，我们在 Platform SIG 会议的[幻灯片](https://docs.google.com/presentation/d/1lw4unaFhsQk7a8HzhxhgTK4X2X2ocv_W_VW7aoH2WkM/edit?usp=sharing)上展示了当前的 Java 11 支持的状态，我们同意发布 Java 11 的可用性预览，以便我们可以提供内容让 Jenkins 用户得以进行评估。 在 12 月 4 日的下一次会议上，所有障碍都已得到解决，Platform SIG 会议签署发布了Java 11 预览版。


### 在 Docker 中运行 Jenkins 和 Java 11

从 Jenkins 2.155 开始，我们开始为 Jenkins master 和 agent 提供 Docker 镜像。
所有这些镜像都基于官方的由 Docker 社区维护的 [openjdk:11-jdk](https://hub.docker.com/r/_/openjdk/) 镜像。这里有一些关于迁移到其他基本镜像的讨论，但是我们决定在预览可用性的范围中将其排除。基于同样的原因，我们目前不提供 Alpine 镜像。

#### Jenkins master 镜像

官方的 [jenkins/jenkins](https://hub.docker.com/r/jenkins/jenkins/) 镜像现在已经提供了 Java 11 的支持。你可以向下面这样简单在 Java 11 的环境中运行 Jenkins。

```sh
docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:jdk11
```

可以使用下面这些标签：

* `jdk11` - 最新的包含 Java 11 支持的每周发布
* `2.155-jdk11` - 包含 Java 11 支持的每周发布=

这些镜像完全和 [jenkins/jenkins documentation](https://github.com/jenkinsci/docker/blob/master/README.md) 兼容。例如：你可以使用 `plugins.txt` 来安装插件、挂载卷或者通过环境变量传递额外选项。

#### Agent 镜像

如果你通过 Docker 或 Kubernetes 插件使用容器化的 agent，我们也发布了 Jenkins agent 的官方 Docker 镜像：

* [jenkins/slave](https://hub.docker.com/r/jenkins/slave/)
* [jenkins/jnlp-slave](https://hub.docker.com/r/jenkins/jnlp-slave/)
* [jenkins/ssh-slave](https://hub.docker.com/r/jenkins/ssh-slave/)

所有的镜像都可以使用 `latest-jdk11` 标签来获取 JDK 11 的捆绑。同时为这些过时的名字抱歉！


#### 实验性 Jenkins master 镜像

为了简化测试，我们也在 DockerHub 提供了一些实验性的镜像。
对于这些镜像，我们为其搭建好了持续交付流水线，所以不需要等待 Jenkins 的每周发布，就可以获得补丁。

* [jenkins4eval/blueocean-platform-support](https://hub.docker.com/r/jenkins4eval/blueocean-platform-support/) - 等同于 [jenkinsci/blueocean](https://hub.docker.com/r/jenkinsci/blueocean/)
    * 标签: `latest-jdk11`
    * 这个镜像捆绑了在 Java 11 上运行时需要的所有的 Jenkins 流水线和 Blue Ocean 的补丁
    * 如果你想要使用流水线，使用这个镜像
* [jenkins/jenkins-experimental](https://hub.docker.com/r/jenkins/jenkins-experimental/) - 等同于 [jenkins/jenkins](https://hub.docker.com/r/jenkins/jenkins/)
    * 标签: `latest-jdk11`
    * 这个镜像是从 Jenkins core 的 `java11-support` 分支中发布的
    * 这个分支可能轻微的领先或落后于 `master` 分支，我们可能会用这个分支去快速发布补丁给 Java 11 用户

我们最终会把这个实验性流水线移到新的在 [jep:217](https://github.com/jenkinsci/jep/blob/master/jep/217/README.adoc) 中创建的 `jenkins4eval` 组织中去。

### 在 Java 11 中运行 jenkins.war

在 Docker 外运行 Jenkins 并没有那么简单。这是因为 Jenkins 依赖一些在 Java 11 中已经被移除的模块。我们计划在 GA 发布中以某种方式解决掉这个问题 (参见 [JENKINS-52186](https://issues.jenkins-ci.org/browse/JENKINS-52186))，但是现在，我们还需要一些手动操作才能在 Java 11 中运行 Jenkins WAR。


1. 下载 2.155 版本的 Jenkins WAR
2. 下载下面这些库到 jenkins.war 所在的目录中去
    * [jaxb-api-2.3.0.jar](http://central.maven.org/maven2/javax/xml/bind/jaxb-api/2.3.0/jaxb-api-2.3.0.jar) (保存为 jaxb-api.jar)
    * [jaxb-core-2.3.0.1.jar](http://central.maven.org/maven2/com/sun/xml/bind/jaxb-core/2.3.0.1/jaxb-core-2.3.0.1.jar) (保存为 jaxb-core.jar)
    * [jaxb-impl-2.3.0.1.jar](http://central.maven.org/maven2/com/sun/xml/bind/jaxb-impl/2.3.0.1/jaxb-impl-2.3.0.1.jar) (保存为 jaxb-impl.jar)
    * [javax.activation v.1.2.0](https://github.com/javaee/activation/releases/download/JAF-1_2_0/javax.activation.jar)  (保存为 javax.activation.jar)
3. 运行下列命令

```sh
Run Jenkins with ${JAVA11_HOME}/bin/java \
    -p jaxb-api.jar:javax.activation.jar --add-modules java.xml.bind,java.activation \
    -cp jaxb-core.jar:jaxb-impl.jar \
    -jar jenkins.war --enable-future-java --httpPort=8080 --prefix=/jenkins
```

### 已知的兼容性问题

为了帮助用户追踪兼容性问题，我们新创建了 [Known Java 11 Compatibility Issues](https://wiki.jenkins.io/display/JENKINS/Known+Java+11+Compatibility+issues) wiki 页面。

几个重要的问题和障碍：

* [Pipeline: Support Plugin](https://plugins.jenkins.io/workflow-support) 有一个已知的在 Java 11 中运行会产生的上下文持久性问题 ([JENKINS-51998](https://issues.jenkins-ci.org/browse/JENKINS-51998))
    * 我们已经在 [Experimental Update Center for Java 11](https://github.com/jenkinsci/jep/tree/master/jep/211#temporary-experimental-update-center-for-java-11) 中部署了一个临时的修复版本。修复版本号： `3.0-java11-alpha-1`。
    * 如果你使用 Jenkins 流水线，请确认你使用了这个版本，否则你的 Job 会几乎立即失败
    * 当你更新实例到 Java 11 时，请确认没有正在运行的流水线。
* [JENKINS-54305](https://issues.jenkins-ci.org/browse/JENKINS-54305) - [JDK Tool Plugin](https://jenkins.io/blog/2018/12/14/java11-preview-availability/jdk-tool) 不提供 JDK 11 的安装器
* [JENKINS-52282](https://issues.jenkins-ci.org/browse/JENKINS-52282) - Java Web Start 在 Java 11 中已经不再可用, 所以我们不再可能在网页图形界面中启动 agent。我们也没有计划提供一个替代品。

我们也在其它插件中发现了一些次要的不兼容问题，但是我们不认为它们对于预览可用性来说是一个阻碍。

### 报告兼容性问题

如果你碰到了任何有关 Java 11 兼容性的问题，请在我们的 [bug 跟踪工具中报告问题](https://wiki.jenkins.io/display/JENKINS/How+to+report+an+issue)。并为这类问题添加 `java11-compatibility` 标签，这样它们会自动出现在 wiki 页面中，并被分级。


对于安全性问题，请使用标准的 [漏洞报告流程](https://jenkins.io/security/#reporting-vulnerabilities)。尽管我们在预览发布时，会公开修复 Java 11 相关的问题，但是遵守这个安全流程也会帮助我们调查它对 Java 8 用户的影响。

### Java 11 支持团队

一旦 Java 11 支持发布，我们希望会有插件和 Jenkins core 的回归 (regression)报告。我们关心的部分之一就是不同平台的本地库，还有其它的 Java 的版本的问题。同样，这里也存在第三方库和 Java 11 不兼容的风险。为了减轻这些风险，我们创建了 [Java 11 支持团队](https://github.com/orgs/jenkinsci/teams/java11-support)。这个团队将会专注于对到来的问题进行分级、帮助 review PR、在一些情况下也会修复问题。这个团队的工作流程可在 JEP-211 [文档](https://github.com/jenkinsci/jep/tree/master/jep/211#post-release-support)中看到。

我们不希望 _Java 11 支持团队_ 去修复所有的发现的问题，我们将会和 Jenkins core 和插件的维护者一起解决它们。假如你有兴趣加入这个团队，可以在 [Platform SIG Gitter Channel](https://gitter.im/jenkinsci/platform-sig) 中联系我们。

### 贡献

我们感谢任何一种对 Java 11 支持的贡献， 包括在 Java 11 下运行 Jenkins，报告和解决兼容性问题。

* 假如你想要进行一些探索性测试，我们推荐你在你的其中一个测试实例中尝试 Java 11 支持。我们对这样的测试感激不尽。我们在[上面](https://jenkins.io/blog/2018/12/14/java11-preview-availability/#reporting-compatibility-issues)提供了问题报告的准则。
* 假如你是一个插件的开发者/维护者，我们非常感谢你能在 Java 11 中测试你的插件。为了帮助你，我们创建了 [Java 11 Developer guidelines](https://wiki.jenkins.io/display/JENKINS/Java+11+Developer+Guidelines)。这个页面阐述了如何在 Java 11 下测试你的插件，同时它也列出了在开发工具中的已知的问题。

无论你做什么，请通过向 [Platform SIG mailing list](https://groups.google.com/forum/#!forum/jenkins-platform-sig)发送邮件告诉我们你的体验。这些信息将帮助我们跟踪变化和贡献。有关迁移复杂性的任何其他反馈将不胜感激！

### 下一步是什么？

在 12 月 18 号（UTC时间下午4点）我们也会在 Jenkins 在线 Meetup 展示对 Java 11 预览支持([链接](https://www.meetup.com/Jenkins-online-meetup/events/257008190/))。在这个 meetup 上我们将会总结目前的 Java 11 预览支持的状态。如果你是插件开发者，我们还将会组织单独的会议讨论有关在 Java 11 下测试插件以及有关修复兼容性问题的常见最佳实践。如果你有兴趣，请关注 Platform SIG 的公告。

在下一周，我们将会专注于处理来自早期使用者的反馈并且修复一些发现的兼容性问题。我们还将继续为明年的 GA 发布开发 Java 11 支持补丁 ([JENKINS-51805](https://issues.jenkins-ci.org/browse/JENKINS-51805))。除此之外，我们将会开始在子项目中提供 Java 11 支持，包括 [Jenkins X](https://jenkins.io/projects/jenkins-x/) 和 [Jenkins Evergreen](https://jenkins.io/projects/evergreen/)。
