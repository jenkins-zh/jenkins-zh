---
layout: post
title: Jenkins 的重要安全更新
description: 重要安全更新
tags:
- core
- security
author: daniel-beck
translator: linuxsuren
---

我们刚刚发布了版本 2.154 和 LTS 2.150.1 的 Jenkins 安全更新，修复了多个安全漏洞。
由于 2.150.1 是新的 LTS 中的第一个版本，而且，我们还发布了上一个 LTS 2.138.4 版本的安全更新。
这使得管理员们可以安装今天的安全修复，而不必立即升级到新的 LTS 版本。

查看 link:/security/advisory/2018-12-05[安全报告]，了解有哪些被修复。
查看我们的 link:/doc/upgrade-guide/2.138/#upgrading-to-jenkins-lts-2-138-4[LTS 2.138.4 升级指导]，了解影响范围。

### 当前修复中有关之前发布变更的部分

在八月和十月份的 Jenkins 核心安全更新中，包括一项改进，可以通过设置多个系统属性来禁用。
那些变更是 SECURITY-595 修复的重要部分，因此，我们强烈建议禁用。而且，之前发布的文档已更新。