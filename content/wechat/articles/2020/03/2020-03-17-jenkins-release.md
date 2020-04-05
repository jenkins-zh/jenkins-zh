---
title: "Jenkins 长期支持版更新"
description: "本次更新的版本包括：2.176.2~2.204.5、2.180~2.184"
date: 2020-03-17
tags:
- jenkins
- release
author: jenkinsci
translator: zhaoying818
poster: “./2020-03-17-jenkins-release/great-wall.jpeg”
---

![great-wall](great-wall.jpeg)

## 2.176.2 (2019-07-17)
* 用于等待外部进程完成的线程池可能会使类加载器泄露。
* 当分离的插件（其插件功能曾经是 Jenkins 本身的一部分）作为已经存在的其他插件的隐含依赖时，确保 Jenkins 在启动时对其进行安装。这简化了不使用更新中心的专用安装方案的兼容性，例如当从带有某些插件的预包装 Docker 镜像运行 Jenkins 时。
* 更新 WinP 从 1.27 到 1.28 ，以修复 Windows 正常进程关闭逻辑中缺少 DLL 和控制台窗口闪退的问题
* 用更简单的消息替换一些与代理通道有关的异常堆栈跟踪。

## 2.176.3 (2019-08-28)
* 当其他插件对其仅具有可选依赖时，插件管理器 UI 不再阻止禁用插件。
* 解决使用 "记住我" 时的性能问题。 (由 2.160 引入的缺陷回归)
* 测试代理配置时不要抛出异常。 (由 2.168 引入的缺陷回归)
* 防止 Jenkins 重启和用户会话无效时的偶发 `IllegalStateException` 异常。

## 2.176.4 (2019-09-25)
* 2.176.4 和 2.190.1 包含相同的安全修复程序。我们将提供 2.176.x LTS 系列的附加版本，以允许管理员应用安全更新，而无需进行重大升级。

## 2.190.1
* 修复 RSS / Atom 提要中缺少的绝对 URL 。 (由 2.190 引入的缺陷回归)
* 当提示慢触发的管理警告时，Jenkins UI 中断。(由 2.189 引入的缺陷回归)
* Jenkins 不再在项目或构建目录中创建符号链接。如果需要，可以安装 <a href="https://plugins.jenkins.io/build-symlink" target="_blank">Build Symlink</a> 插件来恢复此功能。诸如 `/job/…/lastStableBuild/` 之类的URL不受影响，仅影响直接访问 `$JENKINS_HOME` 文件系统的工具。
* 从 Jenkins 核心中删除 Trilead SSH 库，并使其在新的<a href="https://plugins.jenkins.io/trilead-api" target="_blank">独立插件</a>中可用。
* 在任务名称中添加对表情符号和其他非 UTF-8 字符的支持。 🎉
* 更新 Windows Agent Installer 从 1.10.0 到 1.11 ，以 .NET 4.6 或更高版本运行时，在代理下载上启用 TLS 1.2 。
* 更新 Winstone-Jetty 从 5.2 到 5.3 ，以更新 Jetty 到 9.4.18 。
* 更新 JNA 从 4.5.2 到 5.3.1 ，以解决使用 OpenJDK 时在 AIX 上加载共享库的问题。
* 更新 Remoting 到 3.33 。
* 支持在流水线和其他任务类型的 `fingerprint()` 构建步骤中设置排除和大小写敏感。
* 提升 `ListView` 中 Configuration-as-Code 的兼容性。
* 停止在 `install-plugin` CLI 命令中使用 `name` 参数。
* 注销时删除超时的会话 cookie ，以防止与 header 太大等相关的错误。
* 在 Jenkins URL 配置中添加对 IPv6 地址的支持。
* 通过不同阴影的构建球，可以区分新项目、禁用项目和已中止构建的项目。
* 当 cron 触发器的执行时间较长时，添加告警。
* 在安装向导中分批安装插件以提高性能。
* 现在可以通过设置系统属性 `hudson.node_monitors.AbstractNodeMonitorDescriptor.periodMinutes` 来更改节点监视器的默认大小（例如可用磁盘空间）。

##  2.190.2 (2019-10-28)
* 无法访问名称中带有表情符号的某些项目 URL 。
* 在基于 HTTP 的 CLI 上增加客户端保持活动 ping 的频率，以防止超时。
* 内部: 发生错误时，`hudson.util.ProcessTree.OSProcess#getEnvironmentVariables` 返回 `null` ，即使它不应该发生也是如此。

##  2.190.3 (2019-11-20)
* 稳定性: 不允许用户使用 POST 在需要提交表单的 URL 上重新提交请求，因为那样无论如何都会失败。
* `lastCompletedBuild` 永久链接未缓存在 `…/builds/permalinks` 文件中。
* 将标签固定到 Atom 供稿链接。
* 在 Firefox 的 Jenkins 经典 UI 中还原表单提交的更改。更改导致了带有"文件"格式的内容提交的表单的缺陷回归。这样做是为了预料 Firefox 中的错误修正，此错误已被撤消。(由 2.164.3 引入的缺陷回归)

##  2.204.1 (2019-12-18)
* 将鼠标悬停在侧栏链接上时，显示带有完整链接名称的工具提示。
* 防止错误的子任务提供者使构建永久运行。
* 修复"插件管理-已安装"列表中`卸载`列的排序。
* 在完成加载内存模型之前，请避免调用 `Jenkins#save` 持久数据。 这样可以防止 Jenkins 主配置损坏。
* 删除使用用户浏览器下载更新中心元数据的功能（自 2015 年起不推荐使用）。如果没有连接更新站点，Jenkins 将不再通知可用更新。在这种情况下，建议使用更新站点的本地镜像，或使用 <a href="https://github.com/jenkinsci/juseppe">Juseppe</a> 之类的自托管更新中心。
* 允许按用户设置时区。
* 为资源根 URL 添加一个选项，Jenkins 可以通过该选项为用户生成的静态资源（例如工作空间文件或已归档的制品）提供服务，而无需 Content-Security-Policy 标头。
* 停止绑定 Maven 插件、 Subversion 插件和 Jenkins war 文件中的一些其他插件。在极少数情况下，尝试安装与 1.310 版本之前的 Jenkins 兼容的插件时，可能会导致问题。Jenkins 项目目前未发布任何此类插件。
* 弃用 macOS 本地安装程序以使用 Homebrew。
* 还原在 Firefox 的 Jenkins 经典 UI 中对表单提交的更改（此更改导致了带有"文件"输入的表单的缺陷回归）。这样做是为了预料 Firefox 中的错误修正，此错误已被撤消。(由 2.173 引入的缺陷回归)
* 删除构建历史记录小部件中关于构建说明的 100 个字符长度限制。
* 将 Remoting 从 3.33 更新到 3.36。为入站 TCP 代理添加新的连接模式。将最低必需的 Remoting 版本更新为 3.14。添加命令行选项 "-help" 和 "-version"。

##  2.204.2 (2020-01-29)
* 验证另一个用户时，当前用户不再注销。
* 安全增强：在 REST API 响应中将 `X-Content-Type-Options` 设置为 `nosniff`
* 如果 `hudson.Util.maxFileDeletionRetries` 为零，禁用多次删除尝试。
* 通过在 Computer.removeExecutor 中删除一次性执行器来防止 master 上的“僵尸”执行器。
* 修复在 CephFS 上创建空文件时的 AtomicFileWriter 性能问题。
* 开发者: ViewGroupMixIn#getPrimaryView() 可能返回 `null`，需要基于这个周版本及以后的版本在插件中进行检查。这是一个过渡状态，直到实现默认视图为止。

##  2.204.3 (2020-02-28)
* 内部: Winstone 5.7: 将 Jetty 线程池名称更改为 “Jetty（winstone）”。
* 如果在运行安装向导之前已经通过脚本配置了 Jenkins 根 URL，即使跳过了创建 admin 用户的选项，也要跳过配置面板。
* 在安装 Monitoring 插件时，防止有关 Java 11 缺少的、由 JavaMelody 触发的类的错误告警。
* 当构建连续失败时，在系统日志中包括详细信息。
* 修复 AdoptOpenJDK 11 的 Java 版本检查。 
* 防止更新中心在进行数据解析时 Jenkins 页面卡住。
* Winstone 5.7: 修复对系统日志记录定制的支持 (由 2.177 引入的缺陷回归)。
* 修复代理脱机时代理 API 中的空指针异常（例如查询代理版本或操作系统说明）。

##  2.204.4 (2020-03-03)
* 传递某些类型（例如域通配符）的证书时，修复 Jetty `不支持包含多个证书的密钥库`的错误(由 2.204.3 引入的缺陷回归)。

##  2.204.5 (2020-03-07)
* 此版本重新引入了 Jenkins 2.177 到 2.203.3 的系统日志记录自定义缺陷（<a href="https://issues.jenkins-ci.org/browse/JENKINS-57888">JENKINS-57888 - 系统日志记录自定义</a>），因为它不如其它被修复的缺陷那么严重。计划在 2.22.1 版本中修复。
* 修复最大表单内容大小和表单内容密钥的传递(由 Jenkins 2.204.3 和 Jetty 9.4.20 引入的缺陷回归)。
* 修复由于 X-Forwarded-Host 和 X-Forwarded-Port 订阅问题而导致的将不正确的反向代理重定向到 127.0.0.1 的问题(由 Jenkins 2.204.3 和 Jetty 9.4.20 引入的缺陷回归)。
* 将 Winstone 从 5.8 还原到 5.3，以解决 Winstone 更高版本中嵌入的 Jetty Web 容器引入的问题。默认最大表单大小限制和反向代理重定向被还原(由 2.204.3 引入的缺陷回归)。
