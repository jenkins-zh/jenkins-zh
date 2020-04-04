---
title: "WebSocket"
description: "谈谈 Jenkins 对 WebSocket 的实验性支持"
date: 2020-02-10
original: "https://jenkins.io/blog/2020/02/02/web-socket/"
tags:
- Jenkins
- WebSocket
keywords:
- WebSocket
- CloudBees
- Kubernetes
author: Jesse Glick
translator: wenjunzhangp
poster: "cover.jpg"
---

![cover](cover.jpg)

我很高兴地提出报告，[JEP-222](https://github.com/jenkinsci/jep/blob/master/jep/222/README.adoc) 从 Jenkins 每周更新版开始落地。此改进为 Jenkins 带来了实验性的 WebSocket 支持，可在连接入站代理程序或运行 CLI 时使用。WebSocket 协议允许通过 HTTP（S）端口进行双向交互式通信.

尽管 Jenkins 的许多用户都可以受益，但实现该系统对 CloudBees 尤为重要，因为 [现代云平台上的 CloudBees Core](https://docs.cloudbees.com/docs/cloudbees-core/latest/)（即在 Kubernetes 上运行）如何配置网络。当管理员希望将入站（以前称为“JNLP”）外部代理连接到 Jenkins 主服务器（例如在集群外部运行并使用代理服务包装器的 Windows 虚拟机）时，到目前为止，唯一的选择是使用特殊的 TCP 端口。需要使用低级网络配置将此端口开放给外部流量。例如，nginx 入口控制器的用户将需要为集群中的每个 Jenkins 服务代理一个单独的外部端口。有关此操作的说明很复杂，很难调试。

使用 WebSocket，现在可以在存在反向代理的情况下更简单地连接入站代理：如果 HTTP（S）端口已在提供流量，则大多数代理将允许 WebSocket 连接而无需其他配置。可以在代理配置中启用 WebSocket 模式，并且即将推出 [Kubernetes 插件](https://plugins.jenkins.io/kubernetes/)中对基于 Pod 的代理的支持。您将需要一个[ 4.0 ](https://github.com/jenkinsci/remoting/releases/tag/remoting-4.0)或更高版本的代理，该代理版本以常规方式与 Jenkins 捆绑在一起（带有该版本的 Docker 镜像即将发布）。

Jenkins 的另一个对反向代理用户造成麻烦的部分是 CLI。除了端口 22 上的 SSH 协议（这又是从外部打开的麻烦）之外，CLI 还具有使用 [HTTP（S）传输](https://jenkins.io/blog/2017/04/11/new-cli/)的功能.不幸的是，用于实现混淆某些技巧的技巧并不十分可移植。Jenkins 2.217 提供了一个新的 `webSocket` CLI 模式，该模式避免了这些问题。再次说明，您将需要下载新版本的 `jenkins-cli.jar` 才能使用此模式。

已经针对 Kubernetes 实现示例（包括 OpenShift）对 WebSocket 代码进行了测试，但是很可能仍然存在一些 bugs 和局限性，并且尚未测试重构建负载下代理的可伸缩性。暂时将此功能视为 Beta 版，并让我们了解其工作原理！