---
title: “Jenkins Docker 镜像重大更新”  
date: 2021-03-29  
description: "Jenkins Docker 镜像更新基础镜像"
author: Mark Waite  
translator: LinuxSuRen  
original: https://www.jenkins.io/blog/2021/02/08/docker-base-os-upgrade/
poster: dockerJenkins.png
---

![dockerJenkins](dockerJenkins.png)

从 Jenkins 2.279 和 2.263.4 开始，Jenkins 项目会更新基础操作系统和 Java 的版本，涉及到的镜像包括：`jenkins/jenkins:latest` 和 `jenkins/jenkins:lts`。会将 OpenJDK 8u242 替换为 AdoptOpenJDK 8u282，将 Debian 9 ("Stretch") 替换为 Debian 10 ("Buster")。

## 为什么？
我们更改基础镜像，是为了可以有更好的操作系统的支持，以及包含更多 Java 发行版本。

## 更好的操作系统支持
由 Jenkins 提供的 Docker 镜像依赖于操作系统提供者对于系统安全的维护。

我们的 Docker 镜像已经使用了 Debian 9 ("Stretch") 很多年。Debian 9 的安全更新已于 2020 年 7 月 6 日停止更新。Debian 9 长期支持版本的安全更新也将于 2022 年 6 月停止更新。使用 Debian 10 可以让我们得到由操作系统安全团队更好的维护。

## 更多 Java 发行版
Debian 9 Docker 镜像是基于 openjdk:8-jdk-stretch 的。它的最后一次更新是在一年前，包含 JDK 8u242. 我们需要一个及时维护的 Docker 基础镜像，和 JDK 发布以及操作系统的更新保持一定的节奏，这样控制器就可以运行在最新的 Java 以及操作系统的之上。

其他 Jenkins 控制器的基础镜像已经从 openjdk 切换为由 Eclipse Adoptium 提供的镜像。Eclipse Adoptium 是 AdoptOpenJDK 加入 Eclipse 基金会后成立的。镜像 jenkins/jenkins:latest 和 jenkins/jenkins:lts 已经采用了基础镜像  Adoptium JDK，与此同时使用 JDK 11 的 Jenkins 镜像也同样采用了新的基础镜像，例如：jenkins/jenkins:lts-jdk11。这是 Jenkins Platform SIG 和 Eclipse Adoptium 项目合作的成果。我们期待继续和对方合作。

非常感谢 Alex Earl 和 Jim Crowley 为镜像构建做了基础重构的工作，使得镜像升级变得容易。同时，也非常感谢 Oleg Nenashev 和其他贡献者在此过程中 review 已经测试工作。

## 发行包变更
基于 Debian 10 ("Buster") 的 Jenkins Docker 镜像中所包含的软件包会与 Debian 9 ("Stretch") 的有一些不同。部分软件包由于对应社区不再提供支持，已经被移除。另外有一些软件包则由于不再被广泛使用而移除。Jenkins Docker 镜像的用户如果还需要那些软件包的话，则需要自行定制镜像。

## 被移除的 SCM 软件包
Jenkins 控制器镜像 jenkins/jenkins:latest 以及 jenkins/jenkins:lts 中已经不再包含如下的软件配置管理包：

* bzr
* mercurial
* subversion

## 其他被移除的软件包
Jenkins 控制器镜像中不再包含的其他软件包有：

* bzip2
* mime-support
* python (the Python project stopped supporting Python 2 January 1, 2020)
* xz-utils

你可以从 Pull Request 中看到完整的列表。

## 升级与兼容
Jenkins 控制器镜像设计时考虑到了可扩展性，以方便满足用户的需求。自定义 Jenkins 控制器镜像时，可以添加 Jenkins 插件以及其他操作系统软件包。

例如，在自定义 Docker 镜像中可以通过 Docker 的指令可以安装 Blue Ocean 插件和一些操作系统软件包。

## 带有 Subversion 的 Docker 镜像
下面的 Docker 镜像基于最新的 Jenkins 长期支持版，以及 subversion 插件和 subversion 命令：

```
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends subversion
USER jenkins
RUN jenkins-plugin-cli --plugins subversion:2.14.0
```

从这个 Dockerfile 构建出一个新的镜像，并给一个合适的名称，例如："myjenkins-subversion:1.1"

`docker build -t myjenkins-subversion:1.1 .`

## 带有 Mercurial 的 Docker 镜像
下面的 Docker 镜像基于最新的 Jenkins 长期支持版，以及 mercurial 插件和 hg 命令：

```
FROM jenkins/jenkins:latest
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends mercurial
USER jenkins
RUN jenkins-plugin-cli --plugins mercurial:2.12
```

从这个 Dockerfile 构建出一个新的镜像，并给一个合适的名称，例如："myjenkins-mercurial:1.1"

`docker build -t myjenkins-mercurial:1.1 .`

## 下一步？
Java 有新的版本发布后，我们会继续更新 Jenkins 的 Docker 镜像。

如果你对 Jenkins Docker 打包的新特性感兴趣的话，请持续关注后续的公告！你可以在 Jenkins 公开的 roadmap 上看到有多个正在进行中的计划。部分如下：

* Switching to AdoptOpenJDK.
* General availability of Windows images.
* Support for more platforms (AArch64, IBM s390x, PowerPC).
* Introducing multi-platform Docker images.

如果你对如上的任意项目感兴趣，并想要贡献的话，请联系平台特别兴趣小组，共同协作推进。
