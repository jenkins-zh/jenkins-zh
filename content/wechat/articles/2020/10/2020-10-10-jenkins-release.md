---
title: "Jenkins 长期支持版更新"
description: "本次更新的版本包括：2.235.3~2.249.1"
date: 2020-10-10
tags:
- jenkins
- release
author: jenkinsci
translator: zhaoying818
poster: “./2020-10-10-jenkins-release/great-wall.jpeg”
---

![great-wall](great-wall.jpeg)


## 2.249.1 (2020-09-09)

### 自 2.249 以来的变更：
* Jenkins 2.252 和 2.235.4 的重要安全修复。 (安全公告)
* 停止预格式化代理日志以防止死锁(由 2.231 引入的缺陷回归)。 (issue 63458)
* 修复将 API token 复制到剪贴板的按钮(由 2.238 引入的缺陷回归)。 (issue 63274)
* 将包装选项卡还原为多行，而不是溢出(由 2.248 引入的缺陷回归)。 (issue 63180)
* 标准化小部件颜色，使其与新调色板一致。 (修复暗黑主题中的面包屑刷新)
* 空的已安装插件表文本将再次可读(由 2.249 引入的缺陷回归)。 (issue 63276)
* 在“构建时间趋势”页面中显示构建时间数据(由 2.245 引入的缺陷回归)。 (issue 63232)
* 在日语文档和消息中用 agent 替换对 slave 的文本引用。 (issue 63166)
* 修复退格键有时无法从 Mac 上的脚本控制台删除文本的问题 (由 2.248 引入的缺陷回归)。 (issue 63342)
* 修复正则表达式验证器 UI 位置 (由 2.244 引入的缺陷回归)。 (issue 63308)
* 防止并发构建删除。 (issue 61687)

### 自 2.235.5 以来的重大变更:
* 发布 'alpha' 版本暗黑主题。 (issue 60924, pull 4752, issue 62515, pull 4763, pull 4772, pull 4814, pull 4842, pull 4843, 暗黑主题仓库, Jenkins 暗黑主题简介)
* 停止支持 .NET Framework 2.0 将 Jenkins 服务器和代理作为 Windows 服务启动。 需要 .NET Framework 4.0 或更高版本。 (公告, 升级指南, issue 60005, issue 61862, Windows 支持策略)
* 基于 .NET Framework 2.0 的 Windows Service Wrapper（WinSW） 2.3.0 可执行文件更新为 基于 .NET Framework 4.0 的 2.9.0 版本。 包括许多改进和错误修正。 最值得注意的是，如果需要，服务安装程序现在将要求权限提升。 (变更摘要, 完整的 WinSW 变更日志, Windows Agent Installer 2.0 变更日志)
* 当存在较新版本的插件，但由于需求未满足而未提供时，在插件管理器中显示。 在更新管理器和管理监视器中显示已弃用插件的警告。 (pull 4073, issue 59136, pull 4742, issue 62332)
* 为 Jenkins UI 提供更现代化的外观。 (issue 62698, pull 4808, issue 61973, pull 4700, issue 62750, pull 4816, issue 56109, pull 4820, issue 63002, pull 4835, “配置 UI 辅助功能：从表到 Divs 的迁移”, pull 4782, issue 4767, issue 62175)
* 从页脚中删除页面生成时间戳。 (issue 61806)
* 允许具有“全局/管理”权限的用户配置节点监视并从磁盘重新加载配置。 (issue 62264, pull 4724, issue 61458, pull 4728)
* 添加对“节点监视配置”、配置云、查看代理配置、系统信息和日志系统读取支持。 (issue 61206)
* 在 Jenkins-CLI -auth 参数中支持 Bearer token。 (pull 4673)
* 安全增强: 即使没有加密的 Secret 字段支持，密码形式的控制值也总是以加密形式来回传递。 如果出现问题，可以通过在启动时将系统属性 hudson.util.Secret.AUTO_ENCRYPT_PASSWORD_CONTROL 设置为 false 来禁用此功能。 (issue 61808)
* 安全增强: 当用户缺少“项目/配置”权限时，即使没有加密的 Secret字段支持，也请始终在项目相关的配置表单中使用占位符值作为密码表单控制值。 如果出现问题，可以通过将系统属性 hudson.util.Secret.BLANK_NONSECRET_PASSWORD_FIELDS_WITHOUT_ITEM_CONFIGURE 设置为 false 来禁用此功能。 (issue 61808)
* 修复 Windows 服务 serviceaccount 配置中的默认域名。 (issue 12660, Windows Service Wrapper 2.7.0 变更日志)
* 将 Winstone 从 5.9 更新到 5.10。 将 Jetty 从 9.4.27.v20200227 更新到 9.4.30.v20200611。 添加 -httpsRedirectHttp 选项，以激活自动 HTTP 请求重定向到 HTTPs。 (pull 4811, 9.4.28.v20200408 变更日志, 9.4.29.v20200521 变更日志, 9.4.30.v20200611 变更日志)
* 修复 --httpKeepAliveTimeout 选项不生效的问题(由 2.224 引入的缺陷回归)。 (issue 61823)
* 将 Stapler 从 1.259 更新到 1.260。 (issue 61438, pull 4813, Stapler 1.260 变更日志)
* 添加了为 Shell 和 Windows 批处理构建步骤过滤掉环境变量的功能。 (issue 62014)
* 修复由 Util.isOverridden() 异常引起的 IllegalArgumentException: Method not found 错误(由 2.241 引入的缺陷回归)。 (issue 62723)
* 从 JNLP 启动文件中删除返回的 Jenkins URL，以便可以通过 Java Web Start 连接 WebSocket 代理。 (issue 63014)
* 允许从配置页面选择指纹存储引擎。 添加新的外部指纹存储 API 方法。 (pull 4834, issue 62345, pull 4731, JEP-226, Fingerprint API Javadoc, Redis 参考实施)
* 开发者: 添加 alert-success 横幅。 (issue 62747)
* 开发者: 添加新的扩展点以定义构建步骤环境过滤器（当前为 Beta 版本）。 (issue 62014)
* 内部: 升级到 Remoting 4.5。 这会将 agent.jar 和 remoting.jar 切换到 CDF 拥有的代码签名证书。 (pull 4832, Remoting 4.4 变更日志, Remoting 4.5 变更日志)

## 2.235.5 (2020-08-17) 中有什么新内容 
* 重要安全修复。 (安全公告)
* 基于 Alpine 的 Jenkins Docker 镜像的重大更新。 (升级指南)

## 2.235.4 (2020-08-12) 中有什么新内容 

> Jenkins 长期支持软件包仓库使用了新的 GPG 签名密钥。 按照 Linux 仓库库签名博客文章中的说明在计算机上安装新的公共密钥。

* 重要安全修复。 (安全公告)
* 将新的 64 位 Windows 安装程序与服务帐户检查和端口验证一起使用。 支持 64 位的 Java 8 和 64 位的 Java 11。 (公告, 升级指南)
* 配置 SCM 触发器后可以优雅地关闭。 (issue 62695)
* 修复由于 Util.isOverridden() 中的行为异常导致的 IllegalArgumentException: Method not found 错误(由 2.241 引入的缺陷回归)。 (issue 62723)

## 2.235.3 (2020-07-27) 中有什么新内容 
* 更新 Jenkins 长期支持仓库的 Debian 和 Red Hat 仓库的签名密钥。 (公告与升级指南)
