---
title: "Jenkins 安全修复 SECURITY-626 的紧急通知"
description: "Jenkins 安全修复通知"
date: 2020-12-21
author: linuxsuren
poster: "jenkins-cli.png"
---

![jenkins](jenkins.png)

# 普通用户

检查你的 Jenkins 版本，界面上是否有 SECURITY-626 相关的安全漏洞提醒。如果有的话，建议准备升级。尤其是对于 Jenkins 运行在公有云环境中的用户。

后文，您可以选择性阅读。

# 开发者（或将 Jenkins 作为 CI/CD 工具集成的厂商、用户）

仔细阅读下面的内容，并根据具体情况做响应的调整。

默认情况下，Jenkins 中的 CSRF Token 只对认证信息以及 IP 地址进行校验。这就导致了一个潜在的安全漏洞，攻击者可以利用另外一个用户的 CSRF Token 进行攻击，而且只要受害者的 IP 地址保持不变，就可以一直有效。

从 Jenkins 2.176.2 开始，CSRF Token 还会检查 Web Session ID 以确保他们是来自于同一个会话。当会话失效后，对应的 Token 也会不可用。

因此，默认情况下，通过 `/crumbIssuer/api` 这个 API 获取的 Token 将会无法使用。除非，这些 Token 能关联到同一个会话上。

# 解决方案

1. 安装插件 `Strict Crumb Issuer Plugin` 后，自定义 Crumb 校验规则
2. 禁用新特性，设置系统属性 `hudson.security.csrf.DefaultCrumbIssuer.EXCLUDE_SESSION_ID` 为 `true`

# 案例

* KubeSphere
对于开源平台 KubeSphere 的用户来说，已经不用担心这个问题，社区已经在 `ks-jenkins` 这个项目中修复了这个问题。

# 参考资料

https://www.jenkins.io/doc/upgrade-guide/2.176/#SECURITY-626
https://github.com/kubesphere/kubesphere/issues/3209
https://github.com/kubesphere/ks-jenkins/
