---
title: "Jenkins 每周版更新"
description: "本次更新的版本包括：2.238~2.249"
date: 2020-07-31
tags:
- jenkins
- release
keywords:
- Jenkins 版本发布
- Jenkins 2.238发布
- Jenkins 2.239发布
- Jenkins 2.240发布
- Jenkins 2.241发布
- Jenkins 2.242发布
- Jenkins 2.243发布
- Jenkins 2.244发布
- Jenkins 2.245发布
- Jenkins 2.246发布
- Jenkins 2.247发布
- Jenkins 2.248发布
- Jenkins 2.249发布
author: jenkinsci
translator: zhaoying818
poster: "./2020-07-31-jenkins-release/great-wall.jpeg"
---

![great-wall](great-wall.jpeg)

## 2.249 (2020-07-24)  
* 为某些构建步骤构建环境时，不再抛出异常（由 2.248 引入的缺陷的回归）。 特别是，对 Powershell 插件中的 Powershell 步骤有影响。 (issue 63168)
* 对齐插件管理器表标题。 (pull 4858)
* 修复了某些元素的标题（例如授权矩阵）的样式错误的问题。 (pull 4861)

## 2.248 (2020-07-21)  
> 由于发布基础设施的问题导致的意外，Windows MSI 软件包尚未发布。 解决方法是，手动下载并替换 JENKINS_HOME 中的 jenkins.war。

* 停止支持 .NET Framework 2.0 将 Jenkins 服务和代理作为 Windows 服务启动。 现在需要 .NET Framework 4.0 或更高版本。 (公告, 升级指南, issue 60005, issue 61862, Windows 支持策略)
* 将 Windows Service Wrapper（WinSW）从基于 .NET Framework 2.0 的 2.3.0 可执行文件更新为基于 .NET Framework 4.0 的 2.9.0。 包括多项改进和问题修复。 最值得注意的是，如果需要，服务安装程序现在将要求权限提升。 (变更摘要, WinSW 完整的变更日志, Windows Agent Installer 2.0 变更日志)
* 重新排列左侧面板中的配置和删除按钮。 (pull 4852)
* 为 Shell 和 Windows 批处理构建步骤添加了过滤掉环境变量的功能。 (issue 62014)
* 使用更好的间距和一致的调色板来修改选项卡和表格。 (issue 63002)
* 从页脚中删除页面生成时间戳。 (issue 61806)
* “旧数据”管理表添加排序功能。 (issue 25259)
* 允许从配置页面中选择指纹存储引擎。 (issue 63022, JEP-226)
* 在更新管理器和管理监视器中显示有关已弃用插件的告警。 (issue 59136)
* 更新 Jenkins 表单样式，为更改表单布局做准备。 (issue 56109, Configuration UI Accessibility: Tables to Divs migration)
* 在配置用户定义的时区时，在服务器时区上显示有关当前时间的提示。 (issue 61806)
* 修复由于 Util.isOverridden() 中的行为异常导致的 IllegalArgumentException: Method not found(由 2.241 引入的缺陷回归)。 (issue 62723)
* 当代理使用旧版本的 glibc 时，避免堆栈跟踪。 (pull 4830)
* 从 JNLP 启动文件中删除 Jenkins URL回调，以便可以通过 Java Web Start 连接 WebSocket 代理。 (issue 63014)
* 修复 Windows 服务 serviceaccount 配置中的默认域名。 (issue 12660, Windows Service Wrapper 2.7.0 变更日志)
* 开发者: 添加新的扩展点以定义构建步骤环境过滤器(当前处于 beta 阶段)。 (issue 62014)
* 开发者: 添加对于 alert-* 类的主题支持。 (暗黑主题仓库)
* 开发者: 添加 alert-success 横幅。 (issue 62747)
* 开发者: 允许主题化文本区域句柄。 (暗黑主题仓库)
* 开发者: 需要 FingerprintStorage 描述符，以便可以从配置页面进行配置。 (issue 63022)
* 开发者: 移除 BeanBuilder.loadBeans(String) 方法。 (pull 4838)
* 内部: 允许在 Jenkins 核心单元测试中使用 JUnit 5。 基于 Jenkins Test Harness 的集成测试仍然需要 JUnit 4。 (pull 4699)
* 内部: 使用内置的 WinSW 功能进行权限提升和强加密。 (pull 4823, Windows Agent Installer 2.0 变更日志)
* 内部: 升级到 Remoting 4.5。 这会将 agent.jar 和 remoting.jar 切换到 CDF 拥有的代码签名证书。 (pull 4832, Remoting 4.4 变更日志, Remoting 4.5 变更日志)
* 内部: 从布局中删除内联资源。 (issue 60866)
* 内部: 记录 Jenkins 核心问题分类指南。 (文档)

## 2.247 (2020-07-21)  
> 此发行版本未在发行基础设施上正确签名。 jenkins.war 的发行已被暂停，不建议使用。 安装程序和本地软件包未发布。
在这次发布中没有显著的变更。

## 2.246 (2020-07-21)  
> 此发行版本未在发行基础设施上正确签名。 jenkins.war 的发行已被暂停，不建议使用。 安装程序和本地软件包未发布。
在这次发布中没有显著的变更。

## 2.245 (2020-07-15)  
> 由于发布基础设施的问题导致的意外，Windows MSI 软件包尚未发布。 解决方法是，手动下载并替换 JENKINS_HOME 中的 jenkins.war。
* 重要的安全修复 (安全公告)

## 2.244 (2020-07-07)  
* 清理更多与工作空间相关的目录，例如 Pipeline 库中的 @libs。 (issue 41805)
* 更新意大利语本地化。 (pull 4810)
* 内部: JavaScript 重构，为表单布局的现代化做准备。 (issue 56109)
* 开发者: 扩展 DownloadService.Downloadable API，使其更易于使用默认 ID。 (issue 62572)
* 开发者: 引入 API 来检查 ParameterDefinition 的有效性。 (issue 62889)
* 开发者: 使插件可以访问 WorkspaceList.COMBINATOR。 (issue 41805)

## 2.243 (2020-06-30)  
* 更新管理页面上链接的样式。 (pull 4782)
* 重新设计样式并改善 RSS 提要栏的可访问性。 (issue 62750)
* Winstone 5.10: 添加 --httpsRedirectHttp 选项可激活 HTTP 请求自动重定向到 HTTPs。 (pull 4811)
* Winstone 5.10: 将 Jetty 从 9.4.27.v20200227 更新到 9.4.30.v20200611。 (pull 4811, 9.4.28.v20200408 变更日志, 9.4.29.v20200521 变更日志, 9.4.30.v20200611 变更日志)
* Winstone 5.10: 修复 --httpKeepAliveTimeout 选项无效的问题(由 2.224 引入的缺陷回归)。 (issue 61823)
* 配置 SCM 触发器后可以优雅地关闭。 (issue 62695)
* 开发者: 允许 f:repeatableHeteroProperty 从封闭的 f:entry 获取 field 属性。 (pull 4807)
* 开发者: 从 User.toString() 中的 fullName 切换到 id。 (issue 62688)
* 开发者: 现在可以通过 LabelExpression.autoComplete() 获得标签的自动完成功能。 弃用 hudson.model.AbstractProject.LabelValidator，推荐使用 jenkins.model.labels.LabelValidator。 但是旧版本还具有新的 checkItem() 方法，以允许其验证“非 Project” 项目。 弃用 hudson.model.AbstractProject.DescriptorImpl.validateLabelExpression()，推荐使用 LabelExpression.validate() (该方法可以接受任何种类的 Item 对象，而不仅仅是 AbstractProjects)。 汇总 LabelValidator 报告的所有告警与错误（包括旧的和新的）。 (issue 26097)

## 2.242 (2020-06-23)  
* 在安装了私有源插件的情况下浏览至插件管理时，不会记录异常(由 2.240 引入的缺陷回归)。 (issue 62622)
* 使用暗黑主题时，删除“永久保留这次构建”的白色背景。 (pull 4814, 暗黑主题插件)
* 重新设置超链接的样式，使其看起来更现代、更易读。 (issue 62698)
* 在设置页面上更新计划程序的日语消息。 (pull 4783)
* 保存任务配置时，修复选择参数的 IllegalArgumentException。 (issue 61438, Stapler 1.260 changelog)
* 将数据导出为 JSON 时保证编码控件和替代字符的正确性。 (pull 4813, Stapler 1.260 变更日志)
* 法语文档中的 esclave 替换为 agent。 (issue 62714)
* 开发者: 添加实验性的外部指纹存储（External Fingerprint Storage） API。 (issue 62345, pull 4731, JEP-226, 参考实施)
* 开发者: 引入新的指纹API方法： Fingerprint#getPersistedFacets()、Fingerprint#delete(String) 和与文件无关的 CRUD 方法。 弃用 Fingerprint#save(File)。 (issue 62345, pull 4731, Fingerprint API Javadoc)

## 2.241 (2020-06-16)  
* 还原在“任务配置”页面、“帮助”页面和其他控件上的颜色(由 2.239 引入的缺陷回归)。 (pull 4781)
* 将箭头图标从图片转换为 CSS。 (issue 62496)
* 重新设置侧边栏小部件的样式，以具有更现代的外观。 (issue 62175)
* 开发者: 插件现在可以更轻松地添加对在流水线中使用构建步骤的支持，并且可以访问相应的环境变量（例如，来自工具/环境块或 withEnv 之类的步骤）。 fingerprint 和 archiveArtifacts 流水线步骤将不再应用任何环境替代。 (issue 29144)

## 2.240 (2020-06-08)  
* 使 RSS 字段和与代理断开连接的图片对于暗黑主题透明展示。 (pull 4772)
* 当存在较新版本的插件，但由于不满足要求而不能提供时，也在插件管理器中显示。 (issue 62332)
* 在登录界面添加对暗黑主题的支持。 (issue 62515, pull 4673, 暗黑主题仓库)
* 将捆绑的 Script Security Plugin 从 1.71 更新到 1.73。 (pull 4769)
* 恢复新项目和任务配置页面上的背景颜色。 (pull 4771)
* 修复模式关闭后按钮逗留一段时间的问题 (由 2.233 引入的缺陷回归)。 (pull 4770)
* 用户在配置文件中设置自定义时区后，在“构建历史记录”小部件中显示正确的时间。 (issue 61972)
* 内部: 删除非标准的 showDetails 内联资源。 (issue 60866)

## 2.239 (2020-06-03)  
* 发布 'alpha' 版的暗黑主题。 (issue 60924, pull 4752, 暗黑主题仓库)
* 修复显示给具有扩展读取权限的用户的禁用文本区域的标记预览问题。 (issue 62433)
* 使“管理 Jenkins” 中的 CLI 链接对具有“全局/系统读取”权限的用户可见。 (pull 4739)
* 通过在登录表单中为用户名和密码字段添加 aria 标签来提高可访问性。 (issue 62421)
* 在“可扩展文本框”配置表单元素中实现只读模式。 (issue 62434)
* 性能: 显示列表视图时，通过任务列表减少调用和迭代次数。 (issue 20052)
* 从“安装向导”的建议插件中删除 Subversion Plugin。 (issue 62477)
* 指纹浏览器: 将指纹链接移至现有的指纹制品文本中。 (issue 62470)
* 允许具有“全局/管理”权限的用户配置节点监视。 (issue 62264)
* 开发者: 添加对 CSS 变量的支持，在主题中很有用。 (issue 60924, pull 4752, 暗黑主题仓库)
* 内部: 如果 SlaveComputer#_connect 失败，则从原始线程中打印堆栈跟踪。 (pull 4754)
* 开发者: 添加 CSS 和 JavaScript 的源映射。 (issue 62473)

## 2.238 (2020-05-25)  
* 修复代理启动期间涉及自定义记录器的死锁(由 2.231 引入的缺陷回归)。 (issue 62181)
* 在 Jenkins-CLI -auth 参数中支持 Bearer token。 (pull 4673)
* 添加对'节点监视配置'和配置云的系统读取支持。 (issue 61206)
* 添加“代理/扩展读取”支持以查看代理配置、系统信息和日志。 (issue 61206)
* 解决 Computer#getLogDir 中的线程安全问题。 (pull 4730)
* 改进侧边栏任务列表，以提高美观性和可访问性。 (issue 61973)
* 允许具有“全局/管理”权限的用户从磁盘重新加载配置。 (issue 61458)
* 开发者: 将对 permissions 属性的支持添加到 task.jelly。 (issue 61206)
* 开发者: 将 hasAnyPermissions API 添加到 Functions 中，以允许视图调用它。 (issue 61206)
* 开发者: 将不建议使用的 Jenkins 核心库依赖项添加到 BOM。 (pull 4702)
