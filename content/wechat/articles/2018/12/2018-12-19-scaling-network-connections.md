---
title: "从 Jenkins Master 扩展网络连接"
description: "从 Jenkins Master 扩展网络连接"
tags:
- jenkinsworld
- jenkinsworld2018
- cloud-native
- performance
- scalability
- remoting
author: jglick
translator: sailingwithoutwind
---

![DevOps World | Jenkins World 2018](../../../images/conferences/devops-world-2018.jpg)

Oleg Nenashev 和我今年将在旧金山的 DevOps World | Jenkins World 上，做[从 Jenkins Master 扩展网络连接](https://devopsworldjenkinsworld2018.sched.com/event/F9NP) 的演讲。
多年来，我们一直致力于分析、优化和加强 Remoting channel，
才有了现如今 master 能够协调 agent 的活动，并且接收构建的结果。
尽管许多技术可以改进服务，比如优化代理启动器，但是想要有质的改变，只有从根本上改变传播的内容和方式。

3月，JENKINS-27035 引入了一个框架，用于检查 Remoting channel 在高级别上的通信。
以前，开发人员只能使用一般的低级工具，例如 Wireshark，
它不能精确的识别 Jenkins 负责通信的代码片段。

在过去的几个月里，[Cloud Native SIG](https://jenkins.io/sigs/cloud-native/) 在解决根本原因方面取得了进展。
[Artifact Manager on S3 plugin](https://plugins.jenkins.io/artifact-manager-s3) 已经发布并与 Jenkins Evergreen 整合，
支持在 agent 和 Amazon 服务器之间，进行大制品的上传和下载，
源生插件允许由 agent 生成的所有构建的日志内容（例如在 steps 的 sh 中）
直接定向流到外部存储服务，如 AWS CloudWatch Logs。
与此同时也开始上传 junit 格式的测试结果，这些测试结果有时会变的很大，将直接从 agent 到存储数据库。
所有这些努力都可以减轻 Jenkins Master 和本地网络的负载，而不需要开发人员修改他们的 pipeline 脚本。

其他方法也在酝酿之中。
虽然“一次性”的 agent 在新的 vm 或容器中运行，可以极大地提高可重复性，
但是每一次构建都需要传输兆字节的 Java 代码，所以 Jenkins 的特征是需要对它们建立预缓存。
使用 Apache Kafka 的工作正在进行中，以使得通道在网络故障时更加健壮。
最引人注目的是，这个提议 
[Cloud Native Jenkins MVP](https://jenkins.io/blog/2018/08/31/shifting-gears/#cloud-native-jenkins-mvp) 将消除单个 Jenkins Master 服务处理数百个构建的瓶颈。
