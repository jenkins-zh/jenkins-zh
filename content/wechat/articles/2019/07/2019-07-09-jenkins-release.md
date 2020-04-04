---
title: "Jenkins 长期支持版更新"
description: "本次更新的版本包括：2.164.2、2.164.3、2.176.1"
date: 2019-07-09
tags:
- jenkins
- release
keywords:
- Jenkins 版本发布
- Jenkins 2.164.2发布
- Jenkins 2.164.3发布
- Jenkins 2.176.1发布
author: linuxsuren
poster: “./2019-07-09-jenkins-release/great-wall.jpeg”
---

![great-wall](great-wall.jpeg)

## 2.176.1 (2019-06-10)

* 自 2.176 以来的变更：
    * 恢复安装向导中用到的中文本地化资源。 (issue 57412)
    * Robustness: 当 ComputerListener#onOnline() 发生运行时异常后不把节点设置为离线状态。 (issue 57111)

* CLI 中通过参数 (-remoting option) 对远程模式的支持已经被移除。 (pull 3838, 博客发布)
* 移除符号 nonStoredPasswordParam 对密码参数定义的误导，因为，它会存储加密后的数据。 (issue 56776)
* 移除对 CCtray (cc.xml) 文件的默认支持。 要使用该功能，需要按照插件 CCtray XML Plugin。 (issue 40750)
* 增加 CLI 命令 stop-job 终止构建。 (issue 11888)
* 在日志配置中支持关闭一项日志记录器。 (issue 56200)
* 为 REST API 的响应增加运行参数过滤器。 (issue 56554)
* 构建结束后更新状态图标。 (issue 16750)
* 在 Jenkins 节点的界面上移除对 Java Web Start and JNLP 的误导性引用。 (pull 3998)
* 当涉及到以虚拟 SYSTEM 用户运行构建时，通知管理员潜在的不安全设置。 (issue 24513)
* 当运行在虚拟的 SYSTEM 认证下时，在构建日志中增加一条日志消息。 (pull 3908)
* 迁移所有中文本地化资源文件到 简体中文插件。 (pull 4008)
* 调整流刷新行为，使得运行在远程的节点上时有更好的性能。这可能会导致部分插件在节点机器上打印构建日志却不刷新输出时丢失消息。 通过 -Dhudson.util.StreamTaskListener.AUTO_FLUSH=true 可以让自由风格的构建回到之前的行为。 注意，流水线的构建总是期待远程刷新。 (pull 3961)
* Winstone 的版本从 5.1 更新到 5.2，使得 HTTPS cipher 为可配置的。 (issue 56659, issue 56591, 完整变更日志)
* 从核心中移除邮件相关的本地化字符串。确保你使用 Mailer Plugin 1.23。 (issue 55292)
* 如果工作空间已经被一个跨节点运行的流水线重连时使用了，那么，它将不会再给新的构建分配租期。 (issue 50504)
* 开发者：为了支持从任意插件中加载本地化资源，Stapler 的版本从 1.256 更新到 1.257。 增加接口 jenkins.PluginLocaleDrivenResourceProvider 用于让其他插件可以定制本地化资源的查找过程。 (JEP-216, 完整变更日志)
* 开发者：本地化库的版本从 1.24 更新到 1.26，使用插件可以覆盖查找本地化资源文件的逻辑。 (pull 3896, JEP-216, 完整变更日志)
* 开发者：为类似于单行 f:password 的多行文本凭据添加 Jelly UI 组件 f:secretTextarea。 (pull 3967, 在 Jenkins 中存储凭据)
* 开发者：SystemProperties 现在可以用于节点端的代码。参考 SystemProperties#allowOnAgent。 (pull 3961)

## 2.164.3 (2019-05-09)

* 有问题的 console notes 会使得 ConsoleNote#readFrom 抛出一个无意义的 NegativeArraySizeException 异常，并导致构建日志无法正常显示。 (issue 45661)
* 安装向导没有正确地对密码进行转义，导致遇到特殊字符后会有错误。 (issue 56856)
* 使得 Jenkins 经典界面中的表单提交按钮与 Firefox 即将发布的缺陷修复兼容。 (issue 53462, Firefox bug 1370630)
* 正确地刷新 Maven console annotator 的输出。 (issue 56995)
* 使得 Debian/Ubuntu 的启动脚本与 Java 11 兼容。 (issue 57096)
* 复用 Stapler 请求分发 telemetry。 (issue 57167)

## 2.164.2 (2019-04-10)

* 安全修复。 (安全公告)
* 运行在 Microsoft Docker 下的 Windows Server 2016 时，工作空间以及归档文件无法工作。（由 2.150.2 引入的缺陷回归） (issue 56114)
* 当丢弃不可读的指纹数据时避免 NullPointerException 。 (issue 43218)
