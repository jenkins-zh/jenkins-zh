---
title: "Jenkins 每周版更新"
description: "本次更新的版本包括：2.231~2.237"
date: 2020-05-25
tags:
- jenkins
- release
keywords:
- Jenkins 版本发布
- Jenkins 2.231发布
- Jenkins 2.232发布
- Jenkins 2.233发布
- Jenkins 2.234发布
- Jenkins 2.235发布
- Jenkins 2.236发布
- Jenkins 2.237发布
author: jenkinsci
translator: zhaoying818
poster: "./2020-05-25-jenkins-release/great-wall.jpeg"
---

![great-wall](great-wall.jpeg)

## 2.237 (2020-05-18) 
* 防止以 Java 11 运行时缺少 javax.annotation 类的导致的遥测告警(由 2.231 引入的缺陷回归)。 (issue 61920)
* 在类字段解组问题的情况下，防止 Old Data Monitor 插件加载失败。 (issue 62231)
* 确保在 UserLanguages 遥测初始化程序总是在扩展后运行。 (issue 60118)
* 确保 job/folder 创建事务正确检查请求的名称中是否包含无效字符。 (issue 61956)
* 开发者: 将 Apache Ant 从 1.10.7 更新到 1.10.8。 (pull 4725)
* 开发者: 将 JSTL API 库从 1.2.1 更新到 1.2.7。 (pull 4656, 变更日志更新到 1.2.5, 1.2.3 到 1.2.7 的差异, 1.2.1 到 1.2.3 的差异)
* 开发者: 在 Java API 中弃用 jenkins.model.Configuration。 (pull 4715)

## 2.236 (2020-05-11) 
* 使插件管理可以再次支持 Internet Explorer 11 (由 2.231 引入的缺陷回归)。 (issue 62163)
* 安全增强: 即使没有加密的 Secret 字段支持，也始终以加密形式来回传递密码表单控制值。 如果出现问题，可以通过在启动时将系统属性 hudson.util.Secret.AUTO_ENCRYPT_PASSWORD_CONTROL 设置为 false 来禁用此功能。 (issue 61808)
* 安全增强: 当用户缺少“项目/配置”权限时，即使没有加密的 Secret 字段支持，也始终在项目相关的配置表单中使用占位符值作为密码表单控制值。 如果出现问题，可以通过将系统属性 hudson.util.Secret.BLANK_NONSECRET_PASSWORD_FIELDS_WITHOUT_ITEM_CONFIGURE 设置为 false 来禁用此功能 (issue 61808)
* 开发者: 使 SystemProperties API 可用于插件，以便它们的属性可以由标准引擎管理。 (pull 4707, Javadoc 系统属性, 受系统属性控制的 Jenkins 功能)

## 2.235 (2020-05-04) 
* 当根目录 URL 配置指向先前配置的根目录 URL 时，防止表单验证出现 “404 Not Found” 错误（由 2.205 引入的缺陷回归）。 (issue 62133)
* 在通知告警可再次单击之前一直显示面包屑导航页面。 (issue 62065)
* 允许系统读取以查看更多管理员监视器。 (issue 61208)
* 限制某些操作（例如递归目录删除）引发的异常数。 在这之前，在极少数情况下，无法删除大目录时引发的异常会占用大量内存。 (issue 61841)
* 指示哪个组件提供的 URL 在全局安全配置中无需身份验证即始终可用。 (pull 4668)
* 解决执行 ProcessTree.get() 时的类加载问题。 (issue 62006)
* 开发者: 一次可以从多个特定扩展点查找扩展实现。 (issue 62056)
* 开发者: Add nogrid 在 layout.jelly 标签中添加 nogrid 选项，以禁止隐藏 bootstrap 3 网格。 详细信息，请参见 bootstrap4-api-plugin 。 (issue 61326)
* 开发者: 升级 javax.mail 为 jakarta.mail 1.6.5。 (pull 4660)
* 内部: 从 ReverseProxySetupMonitor 视图中删除内联资源。 当 Jenkins 根 URL 不包含 contextPath 时，添加特定的告警。 (issue 60866)
* 内部: 从 LogRecorder 视图中删除内联资源。 将 bigtables 的列标题向左对齐。 (issue 60866)

## 2.234 (2020-04-27) 
* 修复插件管理 "Available" 页签中的排序顺序(由 2.233 引入的缺陷回归)。 (pull 4675)
* 重新设置帮助图标的样式。 (issue 62001)
* 允许具有系统读取权限的用户查看系统日志。 (issue 61207)
* 改写插件设置向导的“以管理员身份继续”按钮。 (issue 46669)
* 现在，以程序化方式（或代码化方式）创建的代理的默认执行者数量为 1 而不是 2。 (pull 4677)
* 会话劫持保护功能得到加强。 (issue 61738)
* 在具有“全局/系统读取”或“项目/扩展读取”权限的用户的只读配置表单上，区分已定义（*****）和未定义（N/A）密码。 (issue 61812)
* 开发者: 删除了未使用的不推荐使用的 HudsonExceptionNote。 (pull 4667)

## 2.233 (2020-04-20)
* 允许使用预填充的过滤器字段链接到插件管理 URL。 将插件管理中的标签链接到预先过滤的列表。 (pull 4591)
* 添加系统读取支持到管理监视器。 (issue 61208)
* 允许具有系统读取权限的用户查看全局工具配置。 (pull 4519)
* 如果更新站点提供了流行程度数据，将在 "Available" 插件管理选项卡上按流行程度对插件进行排序。 (pull 4588)
* 重新设置了按钮样式。 增加了对于大按钮、超链接样式按钮和图标样式按钮的支持。 (issue 61840)
* 跳转 Groovy 视图显示错误界面到登录表单。 当缺少必要的权限时，某些视图显示错误界面，而不是转发到登录表单。 (issue 61905)

## 2.232 (2020-04-16)
* 修复 git 插件之类的工具（这些工具会在 PATH 中搜索其可执行文件）的输入字段提示 (由 2.205 和 2.222.1 引入的缺陷回归)。 (issue 61711)
* 内部: 从任务视图中删除内联资源。 (issue 60866)
* 内部: 引入新的 Jenkins 核心维护者指南。 (pull 4472)

## 2.231 (2020-04-12)
* 将章节标题添加到 管理 Jenkins 的上下文菜单。 (pull 4586)
* 改善没有任务时的视图显示。 (pull 4633)
* Configuration as code plugin 支持配置用户时区。 (pull 4557)
* 默认情况下，禁止显示有关缺少可选扩展名的日志消息。 (pull 4617)
* 默认不是显示所有可用的插件；使用搜索字段查找插件。 (pull 4580)
* 允许在插件管理中使用以多个空格分隔的过滤条件。 (pull 4580)
* 允许具有系统读取权限的用户查看插件管理 配置。 (issue 61203)
* 增加对从资源根 URL 提供文件参数值的支持（如果已设置）。 (pull 4614)
* 在 cookie 上设置 httpOnly 标头以存储 iconSize。 (pull 4609)
* 修复安装向导中错误消息之间的间隔（由 2.217 引入的缺陷回归）。 (issue 61660)
* 在代理上创建日志条目时，请确保日志消息不缺少数字参数。 修复由 Support Core 插件收集的日志。 (pull 4621)
* 确保从系统日志消息中删除了编码的控制台注解。 (pull 4632)
* 将 crypto-util 从 1.1 更新到 1.5，以修复 Jenkins Web UI 中的许可证链接。 (pull 4631)
* 开发者: 将 bug 检测注解从 JSR-305 切换到 SpotBugs / net.jcp 等效项。 (pull 4604)
* 开发者: commons-codec 升级到 1.14。 (pull 4636)
