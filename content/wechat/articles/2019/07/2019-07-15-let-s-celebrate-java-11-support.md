---
title: "让我们庆祝 Jenkins 对 Java 11的支持"
description: "本文是为了庆祝 Jenkins 对 Java 11的支持"
date: 2019-07-15
tags:
- core
- developer
- java11
- community
- platform-sig
keywords:
- jenkins
- java11
author: alecharp
original: https://jenkins.io/blog/2019/03/11/let-s-celebrate-java-11-support/
translator: yJunS
poster: "./2019-07-15-let-s-celebrate-java-11-support/c3bd32a48c96b4f10dad51a10f644233.png"
---

![c3bd32a48c96b4f10dad51a10f644233](c3bd32a48c96b4f10dad51a10f644233.png)

> NOTE：这是由 Java 11支持团队准备的联合博客文章：Adrien Lecharpentier、Ashton Treadway、Baptiste Mathus、Jenn Briden、Kevin Earls、MaríaIsabelVilacides、Mark Waite、RamónLeón 和 Oleg Nenashev。

<div align=center><img style="width:256px;height:256px;" src="/images/logos/formal/256.png" title="Jenkins Java"></div>

我们为此努力工作，现在就在这里。我们非常激动地宣布，从 Jenkins 2.164（2019年2月10日发布）和 LTS 2.164.1（ETA：3月14日）开始，在 Jenkins 中全面支持 Java 11。这意味着您现在可以使用 Java 11 JVM 运行 Jenkins master 和代理程序。

从2018年6月开始，组织了许多活动来改进 Jenkins 代码库并添加 Java 11支持。除了这些事件之外，Core/Plugins 维护者和许多其他贡献者都在努力工作，确保他们发现并解决与 Java 11支持相关的尽可能多的问题。

支持 Java 11的努力导致在 Jenkins 中创建了 [JEP-211: Java 10+ support in Jenkins](https://github.com/jenkinsci/jep/blob/master/jep/211/README.adoc)。它还促使[平台特别兴趣小组](https://jenkins.io/sigs/platform)的成立，以协调 Java 11工作和其他平台支持工作。

## 庆祝活动

我们想花点时间感谢参与这些任务的每个人：代码贡献者、问题记者、测试人员、活动策划者和与会者以及社区中所有慷慨地为这项工作提供时间和支持的人。谢谢你们！

以下是一些帮助完成此任务的贡献者（按字母顺序排列）：

Alex Earl,
Alyssa Tong,
Ashton Treadway,
Baptiste Mathus,
Carlos Sanchez,
Daniel Beck,
David Aldrich,
Denis Digtyar,
Devin Nusbaum,
Emeric Vernat,
Evaristo Gutierrez,
Gavin Mogan,
Gianpaolo Macario,
Isabel Vilacides,
James Howe,
Jeff Pearce,
Jeff Thompson,
Jenn Briden,
Jesse Glick,
Jonah Graham,
Kevin Earls,
Ksenia Nenasheva,
Kohsuke Kawaguchi,
Liam Newman,
Mandy Chung,
Mark Waite,
Nicolas De Loof,
Oleg Nenashev,
Oliver Gondža,
Olivier Lamy,
Olivier Vernin,
Parker Ennis,
Paul Sandoz,
Ramón León,
Sam Van Oort,
Tobias Getrost,
Tracy Miranda,
Ulli Hafner,
Vincent Latombe,
Wadeck Follonier

（如果我们错过了此列表中的任何人，我们深感抱歉。）

## 指南

为了简单起见，以下是使用 Docker 镜像在 Java 11上启动 Jenkins 的方法。您可以通过为镜像的标签添加后缀来选择基于 Java 11的镜像`-jdk11`。如果要升级现有实例，请在升级之前阅读 [Jenkins Java 版本升级从8到11](https://jenkins.io/doc/administration/requirements/upgrade-java-guidelines/)。

所以你可以在 Java 11上运行 Jenkins：

```
docker run -p 50000:50000 -p 8080:8080 jenkins/jenkins:2.164-jdk11
```

但是，和往常一样，您仍然可以使用其他方法启动 Jenkins。请参阅 [Java 11上运行 Jenkins](https://jenkins.io/doc/administration/requirements/jenkins-on-java-11/) 的更详细文档。

## 开发者指南

对于参与 Jenkins 开发的开发人员，您可以在 [Java 11开发人员指南](https://wiki.jenkins.io/display/JENKINS/Java+11+Developer+Guidelines)中找到有关开发和测试 Jenkins 以在 Java 11上运行的详细信息。

此资源重新组合可能需要执行的修改，以验证 Java 11插件的兼容性。

## 下一步是什么

尽管这是一项重大成就，但我们仍有工作要做。

我们的首要任务是为 [JenkinsFile Runner](https://github.com/jenkinsci/jenkinsfile-runner) 项目添加 Java 11支持。从那里开始，我们将继续为 [Jenkins X](https://github.com/jenkins-x) 项目和 [Evergreen](https://jenkins.io/projects/evergreen/) 项目提供 Java 11支持。

所以，即使这对我们来说是个大问题，这也不是故事的结局。这是使Jenkins社区的用户，开发人员和成员受益的重要一步。

## 参考链接

* [Running Jenkins on Java 11](https://jenkins.io/doc/administration/requirements/jenkins-on-java-11/)
* [https://wiki.jenkins.io/display/JENKINS/Known+Java+11+Compatibility+issues](https://wiki.jenkins.io/display/JENKINS/Known+Java+11+Compatibility+issues)
* [https://wiki.jenkins.io/display/JENKINS/Java+11+Developer+Guidelines](https://wiki.jenkins.io/display/JENKINS/Java+11+Developer+Guidelines)
* [JEP-211:Java 11 support in Jenkins](https://github.com/jenkinsci/jep/blob/master/jep/211/README.adoc)
