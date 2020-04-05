---
title: 春季安全清查
description: Jenkins 管理员们应该关注的安全问题
tags:
- plugins
- security
author: daniel-beck
translator: p01son6415
original: https://jenkins.io/blog/2019/04/03/security-advisory/
---

今天我们公布了一个 [安全报告](https://jenkins.io/security/advisory/2019-04-03/)，
主要是关于 Jenkins 的插件中 _还没有被修复_ 的问题。
发生了什么？

Jenkins 安全团队将 [漏洞反馈分类发布在 Jira 和我们的非公开邮件列表中](https://jenkins.io/security/#reporting-vulnerabilities)。
一旦我们确定它不是由 Jenkins 安全团队成员维护的插件，我们会尝试将该问题通知插件维护者，以帮助我们开发，审查和发布修复。

这种情况下，我们会发布 [安全报告，将这些问题告知用户，即使没有发布修复版本。](https://jenkins.io/security/#vulnerabilities-in-plugins)
这样可以让管理员作出决定，是否继续使用具有未解决的安全漏洞的插件。
今天发布的报告里大多数都是这样的安全问题。

在这个列表中看到您感兴趣的插件并且想要帮忙？了解如何 [认领一个插件](https://wiki.jenkins-ci.org/display/JENKINS/Adopt+a+Plugin)。
