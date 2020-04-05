---
title: "Jenkins 2.176~2.178版本更新"
description: "Jenkins 每周更新版2.176~2.178更新内容"
date: 2019-05-29
tags:
- jenkins
- release
keywords:
- Jenkins 版本发布
- Jenkins 2.178发布
author: donhui
poster: “./2019-05-29-jenkins-release/qingshanlake.jpg”
---

![qingshanlake](qingshanlake.jpg)

## 2.178 (2019-05-20)

* 将 jmDNS 从3.4.0-jenkins-3更新到3.5.5，以防止不必要的 DNS 组播错误消息。 (issue 25369)
* 将 WinP 从1.27更新到1.28，以修复 Windows 优雅进程关闭逻辑中缺少 DLL 和控制台窗口闪烁的问题。 (issue 57477, 完整的变更日志)
* 确保独立的插件(插件曾经是 Jenkins 本身的一部分功能)在 Jenkins 启动时(需要时)作为已经存在的其他插件的隐含依赖项安装。 这简化了不使用更新中心的特殊安装场景的兼容性，例如当 Jenkins 从预先打包了一些插件的 Docker 镜像运行时。 (issue 57528)
* 将脚本安全插件的捆绑版本与最新的安全警告一起更新，在不太可能的情况下，它确实是从 WAR 而不是更新中心安装的。 (pull 4000)

## 2.177 (2019-05-12)

* 支持在流水线或其它任务类型的 fingerprint() 构建步骤中设置排除和区分大小写。 (文档, pull 3915)
* 允许通过不同的阴影构建球区分新任务、禁用的任务和中止构建的任务。 (pull 3997)
* 将 Windows 代理安装程序从1.10.0更新到1.11，当在 .NET 4.6 或更新版本运行时，在代理下载时启用 TLS 1.2。 (issue 51577, 完整的变更日志)
* 将 Winstone-Jetty 从5.2更新到5.3以更新 Jetty 到 9.4.18。 (pull 4016, 完整的变更日志, Jetty 9.4.18变更日志, Jetty 9.4.17变更日志, Jetty 9.4.16变更日志)
* 恢复安装向导使用的中文本地化资源。(在2.176中回归)。 (issue 57412)
* 健壮性：对于 ComputerListener#onOnline() 中的运行时异常，不要将代理脱机。 (issue 57111)
* 由于排除筛选，不要为存档制品中不包含的文件记录指纹。 (issue 41696)
* 开发者：使 UserSeedProperty 对插件开发人员可用。 (pull 4018)
* 开发者：添加对 titleClassMethod 的支持（从流水线中的 symbol-hetero-list ）到 f:hetero-list. (issue 56379)

## 2.176 (2019-05-05)

* 在 2.175 中有些插件可能会失败，并会有一个与序列化 FilePath 有关的错误。 现在，这已被降级为警告。 插件更新仍然应该被用来修正潜在的错误。 (issue 57244)
* 添加 stop-job CLI命令，该命令允许中止构建。 (issue 11888)
* 将 Remoting 从3.29更新到3.30，以修复一些较小的问题。 (issue 51004, issue 57107, issue 46515, 完整的变更日志)
* 将所有中文本地化资源迁移到本地化:中文(简体)插件。 (pull 4008)
* 当 Jenkins#addNode 或 Nodes#addNode 实际替换现有节点时，NodeListener#onCreated 被调用。 (issue 57273)
* 开发者：在 classpath 中包含 CLI 模块生成的源文件。 (pull 4006)
