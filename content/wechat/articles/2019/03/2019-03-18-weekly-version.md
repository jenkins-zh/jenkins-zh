---
title: "Jenkins 更新通知"
description: "Jenkins LTS、Weekly 以及简体中文插件更新"
date: 2019-03-20
tags:
- weekly
author: linuxsuren
---

### Jenkins LTS 2.164.1 更新内容如下：

* Java 11 现已全面支持。 自 2.150.x 开始在 Java 11 上运行 Jenkins 的多项改进，包括：支持插件在它们的元数据中申明最小 Java 版本，并拒绝加载不兼容的插件，以及当运行在 Java11 上时安装新的 JAXB 插件后允许使用 JAXB 的 API. (博客发布的申明, 运行在 Java 11, 升级到 Java 11, issue 52012, issue 52282, issue 55076, issue 55048, issue 55980, issue 55681, issue 52285)
* 当列出一个指定目录时 list-jobs 不再进行递归。 (issue 48220)
* 增加一个新的 CLI 命令 disable-plugin 来禁用一个或多个已安装的插件，并可以选择同时重启 Jenkins. (issue 27177)
* 更新 Trilead SSH 库以支持 OpenSSH 使用 AES256-CTR 加密。 (issue 47603, issue 47458, issue 55133, issue 53653)
* 在 Jenkins CLI 中增加对 ed25519 关键算法的支持。 (issue 45318)
* 减少以 ZIP 格式下载归档或者工作空间文件时 SECURITY-904 对性能的影响。 (issue 55050)
* 在插件向导中增加语言分类，并会根据浏览器的语言设置自动安装本地化插件。 (pull 3626)
* Windows Service Wrapper 从 2.1.2 更新到 2.2.0，Windows Agent Installer 从 1.9.3 更新到 1.10.0，支持禁用、重命名以及归档服务日志。 (pull 3854, Windows Service Wrapper 变更日志, Windows Agent Installer Module 变更日志)
* SSHD 模块从 2.5 更新到 2.6，当自定义值设置为 org.jenkinsci.main.modules.sshd.SSHD.idle-timeout system property 时，设定一个合适的 Apache Mina 空闲超时时间。 (issue 55978, 全部变更日志)
* 开发者: 登陆和注册页面在 2.129 中重新设计了，现在可以从多个插件中接收风格贡献 (SimplePageDecorator 的视图页面 footer) (issue 54325)


### Jenkins 每周版 2.168 更新内容如下：

* 优化移动端的登陆、加载和重启界面。
* 通知管理员关于潜在的不安全的权限设置，导致以虚拟系统用户运行构建。
* 在 Microsoft Docker 中的 Windows Server 2016 上工作空间和归档文件的浏览不可用。(在 2.154 中引入)
* 开发者: StringParameterValue.getValue() 现在返回 String 以避免不必要的类型转换。

### 简体中文插件 0.0.14

新增了多条中文词条，更多细节从查看[变更日志](https://github.com/jenkinsci/localization-zh-cn-plugin/blob/master/CHANGELOG.md)。
