---
title: "Jenkins 长期支持版更新"
description: "本次更新的版本包括：2.176.3~2.176.4、2.190.1~2.190.3、2.204.1~2.204.6、2.222.1"
date: 2020-04-22
tags:
- jenkins
- release
author: jenkinsci
translator: zhaoying818
poster: “./2020-04-22-jenkins-release/great-wall.jpeg”
---

![great-wall](great-wall.jpeg)

## 2.222.1 (2020-03-25) 
> Jenkins 启动时将不从磁盘加载全局构建丢弃程序的配置(JENKINS-61688)。 配置已保存，但在重新启动时将不加载。 Jenkins 2.222.1 将始终以 Job Build Discarder 的默认配置启动。 重新启动时将忽略自定义全局构建丢弃配置。 每次 Jenkins 重新启动时，都会配置默认的全局构建丢弃。

### 自 2.222 以来的变更：
* 重要安全修复。 (安全公告)
* 修复了任务配置表单中之前保存步骤中存在的拖放操作问题 (由 2.217 引入的缺陷回归)。 (issue 61429)
* Winstone 5.9: 修复最大表单内容大小和表单内容密钥的传递(由 Jetty 9.4.20 和 Jenkins 2.205 引入的缺陷回归)。 (pull 4542, issue 60409, Winstone 5.9 变更日志, Jetty 9.4.27 变更日志)
* Winstone 5.9: 修复由于 X-Forwarded-Host 和 X-Forwarded-Port 订阅问题而导致的将不正确的反向代理重定向到 Host 的问题(由 Jetty 9.4.20 和 Jenkins 2.205 引入的缺陷回归)。 (pull 4542, issue 60199, Winstone 5.9 变更日志, Jetty 9.4.27 变更日志)
* 与请求路由和 CSRF 保护有关的安全增强。 (相关升级指导)
* 开发者: 在调试模式下，默认监听回送接口。 (pull 4515)

### 自 2.204.6 以来的重大变更:
* 修改标题栏和 breadcrumbs 导航的布局和图标。 依赖于 Jenkins 布局细节的插件的实例（例如 Simple Theme Plugin）可能会遇到 UI/布局问题。 通过将 jenkins.ui.refresh 系统属性设置为 true，可以启用新的实验性标题颜色方案。 (issue 60920)
* 添加全局配置的构建丢弃程序，删除未标记为“永久保留”的旧构建，即使没有配置、积极性较低、配置的按项目构建丢弃程序或者在构建完成后定期执行。 (pull 4368)
* 将云配置从"配置系统"移动到"管理节点"页面上其自身的配置表单中。 (pull 4339)
* 删除全局安全配置中的启用安全复选框。 (issue 40228)
* 删除禁用 CSRF 保护的功能。 从较旧版本的 Jenkins 升级的实例将启用 CSRF 保护和设置默认的发行者，如果之前被禁用。 (pull 4509)
* 重新设计密码字段，以防止自动填写密码（登录表单除外）。 减少提供更新存储密码的浏览器。 通过将系统属性 hudson.Functions.hidingPasswordFields 设置为 false 来还原。 (pull 3991)
* 弃用 macOS 本地安装程序包。 (Jenkins macOS 本地安装程序弃用)
* 删除古老的、不推荐使用的、不支持的代理协议 Inbound TCP Agent Protocol/1, Inbound TCP Agent Protocol/2 和 Inbound TCP Agent Protocol/3。 将 Remoting 从 3.36 更新到 4.2，以删除不受支持的协议和增加对于 WebSocket 的支持。 (issue 60381, Remoting 3.40 发布说明, Remoting 4.0 发布说明, Remoting 4.0.1 发布说明, Remoting 4.2 发布说明)
* 增加实验性的 WebSocket 支持。 (JEP-222, 博客文章)
* 扩展当前里程碑，以便插件可以在 Jenkins 初始化期间更新任务和配置。 增加初始化里程碑: SYSTEM_CONFIG_LOADED、SYSTEM_CONFIG_ADAPTED 和 JOB_CONFIG_ADAPTED。 (issue 51856)
* 引入一个新的实验性 UI，可以通过将 jenkins.ui.refresh 系统属性设置为 true 来启用。 作为 UI/UX 改进的一部分，当前，它包括一个新的标题颜色方案，后续将添加更多更改。 (pull 4463, issue 60920, JEP-223, Jenkins UX SIG)
* 添加新的实验性 全局/管理 权限，该权限允许用户在不具有 全局/Administer 权限的情况下配置部分全局 Jenkins 配置。 这是一项实验性功能，默认情况下处于禁用状态，可以通过将 jenkins.security.ManagePermission 系统属性设置为 true 来启用。 (pull 4501, issue 60266, JEP-223)
* 添加一个新的实验性全局/系统读取权限，该权限（几乎）为 Jenkins 实例提供完全读取权限。 默认情况下，该权限是禁用的，请安装 Extended Read Permission 插件以将其激活。 (pull 4506, issue 12548, JEP-224, Extended Read Permission 插件)
* 现在可以从（非流水线）构建中使用环境变量 WORKSPACE_TMP 来访问与构建工作空间关联的临时目录。 (issue 60634)
* 弃用全局/运行脚本、全局/上传插件和全局/配置更新中心权限。 在 2017 年，主要授权插件中的权限被宣布为危险且默认情况下被禁用。 自定义授权策略实现将授予全局/Administer 权限，而不暗示这三个权限中的一个或多个将不再按预期工作。 在没有全局/Administer 权限的情况下向用户授予这些权限中任何一个的配置将不能按预期工作。 (pull 4365, issue 60266, JEP-223, 2017-04-10 Matrix Authorization 插件的安全公告, 2017-04-10 Role-Based Authorization 插件的安全公告)
* 修复在获取具有状态阈值的运行列表时的空指针异常（由 2.202 引入的缺陷回归）。 (issue 60884)
* 验证另一个用户时，当前用户不再注销。 (issue 59107)
* Winstone 5.9: 修复对自定义系统日志的支持(由 2.204.5 引入的缺陷回归)。 (pull 4452, issue 57888, Winstone 5.9 变更日志, Jetty 9.4.27 变更日志)

## 2.204.6 (2020-03-25) 
* 重要安全修复。 (安全公告)
* 与请求路由和 CSRF 保护有关的安全增强。 (相关升级指导)

# 2.204.5 (2020-03-07) 
> 此版本重新引入了 Jenkins 2.177 到 2.203.3 的系统日志记录自定义缺陷（JENKINS-57888 - 系统日志记录自定义），因为它不如其它被修复的缺陷那么严重。 计划在 2.22.1 版本中修复。

* 修复最大表单内容大小和表单内容密钥的传递(由 Jenkins 2.204.3 和 Jetty 9.4.20 引入的缺陷回归)。 (issue 60409)
* 修复由于 X-Forwarded-Host 和 X-Forwarded-Port 订阅问题而导致的将不正确的反向代理重定向到 127.0.0.1 的问题(由 Jenkins 2.204.3 和 Jetty 9.4.20 引入的缺陷回归)。 (issue 60199)
* 将 Winstone 从 5.8 还原到 5.3，以解决 Winstone 更高版本中嵌入的 Jetty Web 容器引入的问题。 默认最大表单大小限制和反向代理重定向被还原(由 2.204.3 引入的缺陷回归)。 (issue 60409, issue 60199, Winstone 变更日志)

## 2.204.4 (2020-03-03) 
* 传递某些类型（例如域通配符）的证书时，修复 Jetty 不支持包含多个证书的密钥库的错误(由 2.204.3 引入的缺陷回归)。 (pull 4539, issue 60857, Winstone 5.8 发布说明)

## 2.204.3 (2020-02-28) 
* 内部: Winstone 5.7: 将 Jetty 线程池名称更改为 “Jetty（winstone）”。 (pull 4452, issue 60821, Winstone 5.7 发布说明)
* 如果在运行安装向导之前已经通过脚本配置了 Jenkins 根 URL，即使跳过了创建 admin 用户的选项，也要跳过配置面板。 (issue 60750)
* 在安装 Monitoring 插件时，防止有关 Java 11 缺少的、由 JavaMelody 触发的类的错误告警。 (issue 60725)
* 当构建连续失败时，在系统日志中包括详细信息。 (issue 60716)
* 修复 AdoptOpenJDK 11 的 Java 版本检查。 (issue 60678)
* 防止更新中心在进行数据解析时 Jenkins 页面卡住。 (issue 60625)
* Winstone 5.7: 修复对系统日志记录定制的支持 (由 2.177 引入的缺陷回归)。 (pull 4452, issue 57888, Winstone 5.7 release notes)
* 修复代理脱机时代理 API 中的空指针异常（例如查询代理版本或操作系统说明）。 (issue 42658)

## 2.204.2 (2020-01-29) 
* 重要的安全修复。 (安全公告)
* 验证另一个用户时，当前用户不再注销。 (issue 59107)
* 与 Stapler 路由相关的安全增强。
* 安全增强：在 REST API 响应中将 X-Content-Type-Options 设置为 nosniff。
* 如果 hudson.Util.maxFileDeletionRetries 为零，禁用多次删除尝试。 (issue 60351)
* 通过在 Computer.removeExecutor 中删除一次性执行器来防止 master 上的“僵尸”执行器。 (issue 57304)
* 修复在 CephFS 上创建空文件时的 AtomicFileWriter 性能问题。 (issue 60167)
* 开发者: ViewGroupMixIn#getPrimaryView() 可能返回 null，需要基于这个周版本及以后的版本在插件中进行检查。 这是一个过渡状态，直到实现默认视图为止。 (issue 60092)

## 2.204.1 (2019-12-18) 
> 升级为 Jenkins 2.204.1 的 Configuration as code plugin 用户需要查看 LTS升级指南全局配置保存主题和 LTS 升级指南下载设置主题

### 自 2.204 以来的变更：
* 将鼠标悬停在侧栏链接上时，显示带有完整链接名称的工具提示。 (issue 59508)
* 防止错误的子任务提供者使构建永久运行。 (issue 59793)
* 修复"插件管理-已安装"列表中卸载列的排序。 (issue 59665)
### 自 2.190.3 以来的重大变更:
* 在完成加载内存模型之前，请避免调用 Jenkins#save 持久数据。 这样可以防止 Jenkins 主配置损坏。 (issue 58993)
* 删除使用用户浏览器下载更新中心元数据的功能（自 2015 年起不推荐使用）。 如果没有连接更新站点，Jenkins 将不再通知可用更新。 在这种情况下，建议使用更新站点的本地镜像，或使用 Juseppe 之类的自托管更新中心。 (pull 3970)
* 允许按用户设置时区。 (issue 19887)
* 为资源根 URL 添加一个选项，Jenkins 可以通过该选项为用户生成的静态资源（例如工作空间文件或已归档的制品）提供服务，而无需 Content-Security-Policy 标头。 (issue 41891)
* 停止绑定 Maven 插件、 Subversion 插件和 Jenkins war 文件中的一些其他插件。 在极少数情况下，尝试安装与 1.310 版本之前的 Jenkins 兼容的插件时，可能会导致问题。 Jenkins 项目目前未发布任何此类插件。 (pull 4040)
* 弃用 macOS 本地安装程序以使用 Homebrew。 (macOS 本地安装程序弃用博客文章)
* 还原在 Firefox 的 Jenkins 经典 UI 中对表单提交的更改（此更改导致了带有"文件"输入的表单的缺陷回归）。 这样做是为了预料 Firefox 中的错误修正，此错误已被撤消。 (由 2.173 引入的缺陷回归) (issue 58296, issue 53462, Firefox issue 1370630)
* 删除构建历史记录小部件中关于构建说明的 100 个字符长度限制。 (issue 19760, issue 31209)
* 将 Remoting 从 3.33 更新到 3.36。 为入站 TCP 代理添加新的连接模式。 将最低必需的 Remoting 版本更新为 3.14。 添加命令行选项 "-help" 和 "-version"。 (Remoting 3.36 发布说明, pull 4193, Remoting 3.35 发布说明, pull 4208, pull 4186, issue 53461, pull 4165, Remoting 3.34 发布说明, 减少远程连接步骤)

## 2.190.3 (2019-11-20) 
* 稳定性: 不允许用户使用 POST 在需要提交表单的 URL 上重新提交请求，因为那样无论如何都会失败。 (issue 59514)
* lastCompletedBuild 永久链接未缓存在 …/builds/permalinks 文件中。 (issue 56809)
* 将标签固定到 Atom 供稿链接。 (issue 48375)
* 在 Firefox 的 Jenkins 经典 UI 中还原表单提交的更改。 更改导致了带有"文件"格式的内容提交的表单的缺陷回归。 这样做是为了预料 Firefox 中的错误修正，此错误已被撤消。 (由 2.164.3 引入的缺陷回归) (issue 58296, issue 53462, Firefox issue 1370630)

## 2.190.2 (2019-10-28) 
* 无法访问名称中带有表情符号的某些项目 URL 。 (issue 59406)
* 在基于 HTTP 的 CLI 上增加客户端保持活动 ping 的频率，以防止超时。 (issue 59267)
* 内部: 发生错误时，hudson.util.ProcessTree.OSProcess#getEnvironmentVariables 返回 null ，即使它不应该发生也是如此。 (issue 59580)

## 2.190.1 (2019-09-25) 
### 自 2.190 以来的变更：
* 重要的安全修复。 (2019-09-25 安全公告, 2019-08-28 安全公告)
* 修复 RSS / Atom 提要中缺少的绝对 URL 。 (由 2.190 引入的缺陷回归) (issue 59167)
* 当提示慢触发的管理警告时， Jenkins UI 中断。 (由 2.189 引入的缺陷回归) (issue 58938)
### 自 2.176.4 以来的重大变更:
* Jenkins 不再在项目或构建目录中创建符号链接。 如果需要，可以安装 Build Symlink 插件来恢复此功能。 诸如 /job/…/lastStableBuild/ 之类的URL不受影响，仅影响直接访问 $JENKINS_HOME 文件系统的工具。 (issue 37862)
* 从 Jenkins 核心中删除 Trilead SSH 库，并使其在新的独立插件中可用。 (issue 43610)
* 在任务名称中添加对表情符号和其他非 UTF-8 字符的支持。 🎉 (issue 23349)
* 更新 Windows Agent Installer 从 1.10.0 到 1.11 ，以 .NET 4.6 或更高版本运行时，在代理下载上启用 TLS 1.2 。 (issue 51577, 完整变更日志)
* 更新 Winstone-Jetty 从 5.2 到 5.3 ，以更新 Jetty 到 9.4.18 。 (pull 4016, 完整变更日志, Jetty 9.4.18 变更日志, Jetty 9.4.17 变更日志, Jetty 9.4.16 变更日志)
* 更新 JNA 从 4.5.2 到 5.3.1 ，以解决使用 OpenJDK 时在 AIX 上加载共享库的问题。 (issue 57515)
* 更新 Remoting 到 3.33 。 (issue 57959, issue 50095, issue 57713, 完整变更日志)
* 支持在流水线和其他任务类型的 fingerprint() 构建步骤中设置排除和大小写敏感。 (文档, pull 3915)
* 提升 ListView 中 Configuration-as-Code 的兼容性。 (issue 57121)
* 停止在 install-plugin CLI 命令中使用 name 参数。 (pull 4123)
* 注销时删除超时的会话 cookie ，以防止与 header 太大等相关的错误。 (issue 25046)
* 在 Jenkins URL 配置中添加对 IPv6 地址的支持。 (issue 58041)
* 通过不同阴影的构建球，可以区分新项目、禁用项目和已中止构建的项目。 (pull 3997)
* 当 cron 触发器的执行时间较长时，添加告警。 (issue 54854)
* 在安装向导中分批安装插件以提高性能。 (pull 4124)
* 现在可以通过设置系统属性 hudson.node_monitors.AbstractNodeMonitorDescriptor.periodMinutes 来更改节点监视器的默认大小（例如可用磁盘空间）。 (pull 4105, 受系统属性控制的 Jenkins 功能)

## 2.176.4 (2019-09-25) 
> 2.176.4 和 2.190.1 包含相同的安全修复程序。 我们将提供 2.176.x LTS 系列的附加版本，以允许管理员应用安全更新，而无需进行重大升级。

* 安全更新。 (安全公告)

## 2.176.3 (2019-08-28) 
* 重要的安全修复。 (安全公告)
* 当其他插件对其仅具有可选依赖时，插件管理器 UI 不再阻止禁用插件。 (issue 33843)
* 解决使用 "记住我" 时的性能问题。 (由 2.160 引入的缺陷回归) (issue 56243)
* 测试代理配置时不要抛出异常。 (由 2.168 引入的缺陷回归) (issue 57383)
* 防止 Jenkins 重启和用户会话无效时的偶发 IllegalStateException 异常。 (issue 55945)
