---
title: "Jenkins 2.173 发布通知"
description: "Jenkins 更新通知"
date: 2019-04-22
tags:
- devops
- ai
author: linuxsuren
---

本次更新移除了一些不太推荐的功能，请管理员及时关注，如果希望能恢复的旧的形态，可以按照下面的提示操作。

另外，有一项重要的更新，使得我们可以把所有的中文本地化资源文件从 Jenkins 核心中移除。因此，
请关注 Jenkins 简体中文插件后续的动态，我们会及时完成所有的迁移。

- 移除对 CCtray 文件的内置支持。  
如果要继续使用该功能的话，请安装CCtray XML Plugin (issue 40750)
- 调整代码在远程计算节点上运行时的流刷新行为，使得具有更好的性能。  
这可能导致插件在节点集群上输出日志，但是没有刷新时，丢失消息。  
使用 -Dhudson.util.StreamTaskListener.AUTO_FLUSH=true 恢复自由风格构建之前的行为。注意，流水线的构建总是需要远程刷新。 (pull 3961)
- 增加用于将新创建的 API token 拷贝到粘贴板的按钮。 (issue 56733)
- 使得 Jenkins 经典界面上的表单提交按钮，对 Firefox 的 bug 修复是兼容的。 (issue 53462, Firefox bug 1370630)
- 如果一个工作空间已经被跨节点重连的流水线正在使用，那么，不会提供给新的构建。 (issue 50504)
- 从核心中移除 Mailer 相关的本地化字符串。确保你使用 Mailer Plugin 1.23。 (issue 55292)
- 从 Maven 控制台装饰器中适当地刷新输出。 (issue 56995)
- 开发者：更新 Stapler 1.256 到 1.257，增加对从任意插件中加载本地化 webapp 资源的支持。  
增加接口 jenkins.PluginLocaleDrivenResourceProvider 使得插件可以参与本地化资源的查找。 (JEP-216, 完整的变更日志)
- 开发者：SystemProperties 可以在计算节点中使用。 参考 SystemProperties#allowOnAgent。 (pull 3961)
- 开发者：增加 LineTransformationOutputStream#Delegating 使得更加方便。 (pull 3959)
- 开发者：hudson.util.ssh.SFTPClient 被移除。  
使用库 Trilead SSH 中的 com.trilead.ssh2.jenkins.SFTPClient 作为代替。 (issue 56166)
- 内部：更新 commons-beanutils 1.8.3 到 1.9.3。 (pull 3948)
