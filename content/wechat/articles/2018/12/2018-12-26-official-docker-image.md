---
layout: post
title: Docker Hub 上的官方 Jenkins 镜像
description: 正确地使用 Jenkins 镜像
tags:
- docker
author: batmat
translator: linuxsuren
---

目前，在 Docker Hub 上有三个不同的仓库正（或曾经）被当作“官方” Jenkins 镜像。
本文是为了申明哪个是当前的官方镜像(截至2018年12月).

## 官方的

`docker pull jenkins/jenkins`

例如：[https://hub.docker.com/r/jenkins/jenkins/](https://hub.docker.com/r/jenkins/jenkins/) 是正确的仓库。

在我的博客
[对于使用 Jenkins 官方 Docker 镜像推荐的方法](https://batmat.net/2018/09/07/how-to-run-and-upgrade-jenkins-using-the-official-docker-image/)
上也有一些记录。

## 废弃的

[`jenkins`](https://hub.docker.com/_/jenkins/)
已经废弃了很久。
我们停止使用和更新该镜像的简短原因是，我们每次发版时都需要人工参与。
[`jenkinsci/jenkins`](https://hub.docker.com/r/jenkinsci/jenkins)
同样已经废弃了很久，但为了过渡，我们会同时更新 `jenkins/jenkins`（正确的那个） 和 `jenkinsci/jenkins`。
2018年12月初，我们停止更新 `jenkinsci/jenkins`（如果您感兴趣的话，查看 [INFRA-1934](https://issues.jenkins-ci.org/browse/INFRA-1934) 可以获取更多详情）。

感谢您的阅读！