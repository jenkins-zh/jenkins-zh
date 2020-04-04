---
title: "Jenkins 每周版更新"
description: "本次更新的版本包括：2.180~2.184"
date: 2019-07-18
tags:
- jenkins
- release
keywords:
- Jenkins 版本发布
- Jenkins 2.180发布
- Jenkins 2.181发布
- Jenkins 2.182发布
- Jenkins 2.183发布
- Jenkins 2.184发布
author: linuxsuren
poster: “./2019-07-09-jenkins-release/great-wall.jpeg”
---

![great-wall](great-wall.jpeg)

## 2.184 (2019-07-07) 
* 注销时，移除过期的会话 cookies ，阻止头信息中的相关错误太大。 (issue 25046)
* 当运行在 Java 11 上时，增加缺失类相关的 telemetry 实验。 (issue 57223)
* 修复使用“记住我”时的性能问题（于 2.160 中退化） (issue 56243)
* 开发者：清理 AbstractCloudSlave 的构造器 (pull 4086)

## 2.183 (2019-06-30)
* 在 Jenkins 的 URL 配置增加对 IPv6 地址的支持。 (issue 58041)
* 更新 args4j 2.0.31 到 2.33。 (issue 57959)
* 开发者：允许插件为 CodeMirror 文本域控制提供 onBlur() 的支持。 (issue 58240)
* 开发者：使得 WindowsUtil 可以让插件使用。 (pull 4038)
* 内部：更新 maven-war-plugin 3.0.0 到 3.2.3 (issue 47127)

## 2.182 (2019-06-23)
* 当删除目录时，移除 Windows 下的只读标记。 (issue 57855)
* 更新 Remoting 3.29 到 3.33。 (issue 57959, issue 50095, issue 57713, 完整变更日志)

## 2.181 (2019-06-16)
* 插件管理界面中，允许对有可选依赖的插件禁用。 (issue 33843)
* 用于等待外部进程结束的线程池可能导致类加载溢出。 (issue 57725)
* 稳健性：当调度队列中的任务时有异常抛出可能会导致无法调度其他任务。 (issue 57805)
* 替换节点通道相关的部分异常栈为简单的消息。 (issue 57993)
* 更新 JNA 4.5.2 到 5.3.1，修复了在 AIX 上使用 OpenJDK 加载共享库的问题。 (issue 57515)
* 开发者：更新依赖 ant 1.9.2 到 1.9.14。 (pull 4053)
* 内部：使用 SpotBugs 代替 FindBugs 用于静态分析。 (pull 4062)
* 内部：为 hudson.model.UpdateSite#isDue 添加 synchronized 标记。 (issue 57466)

## 2.180 (2019-06-09)
* 由于 JNLP 节点在特定情况下无法连接云节点，Remoting 回退到 3.29（在版本 2.176 中退化） (issue 57759, issue 57713)
* 改善配置即代码对 ListView 的兼容性。 (issue 57121)
