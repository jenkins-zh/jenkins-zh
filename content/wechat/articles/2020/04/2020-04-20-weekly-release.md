---
title: "Jenkins 每周版更新"
description: "本次更新的版本包括：2.185~2.230"
date: 2020-04-20
tags:
- jenkins
- release
keywords:
- Jenkins 版本发布
- Jenkins 2.185发布
- Jenkins 2.186发布
- Jenkins 2.187发布
- Jenkins 2.188发布
- Jenkins 2.189发布
- Jenkins 2.190发布
- Jenkins 2.191发布
- Jenkins 2.192发布
- Jenkins 2.193发布
- Jenkins 2.194发布
- Jenkins 2.195发布
- Jenkins 2.196发布
- Jenkins 2.197发布
- Jenkins 2.198发布
- Jenkins 2.199发布
- Jenkins 2.200发布
- Jenkins 2.201发布
- Jenkins 2.202发布
- Jenkins 2.203发布
- Jenkins 2.204发布
- Jenkins 2.205发布
- Jenkins 2.206发布
- Jenkins 2.207发布
- Jenkins 2.208发布
- Jenkins 2.209发布
- Jenkins 2.210发布
- Jenkins 2.211发布
- Jenkins 2.212发布
- Jenkins 2.213发布
- Jenkins 2.214发布
- Jenkins 2.215发布
- Jenkins 2.216发布
- Jenkins 2.217发布
- Jenkins 2.218发布
- Jenkins 2.219发布
- Jenkins 2.220发布
- Jenkins 2.221发布
- Jenkins 2.222发布
- Jenkins 2.223发布
- Jenkins 2.224发布
- Jenkins 2.225发布
- Jenkins 2.226发布
- Jenkins 2.227发布
- Jenkins 2.228发布
- Jenkins 2.229发布
- Jenkins 2.230发布
author: jenkinsci
translator: zhaoying818
poster: “./2020-04-20-jenkins-release/great-wall.jpeg”
---


## 2.230 (2020-04-06)
* 改进告警横幅的样式，使其更具视觉吸引力并更好地匹配现有的用户界面组件。 现在，警报在显示时完全覆盖了导航栏，而不是仅覆盖导航栏的一部分。 (issue 61478)
* 检查任何一个权限时，权限错误中将不再显示已禁用的权限。 (issue 61467)
* 显示与标签相关而非单个节点的阻塞原因时，允许使用超链接。 (pull 4616)
* 添加选项以支持配置归档制品时的符号链接。 (issue 5597)
* 除了通常的全局/Administer权限之外，具有全局/管理权限的用户现在也可以访问准备关机管理链接。 (issue 61453)
* 更新页脚样式。 (issue 61496)
* 允许 configuration-as-code plugin 禁用管理员监控。 (issue 56937)
* 更新 Groovy Init hooks，使其在任务配置修改后运行。 (issue 61694)
* 修复指纹清除线程中的类强制转换异常。 (issue 61479)

## 2.229 (2020-03-29)
* 重新启动时使用保存的全局构建丢弃配置。 Jenkins 2.221 到 2.228 在重新启动时会忽略保存的全局构建丢弃配置。 (issue 61688)
* 修复设置密码后代理表单验证的问题(由 2.205 引入的缺陷回归)。 (issue 61692)
* 更新 .NET 版本检查，使其更适合自带的 .NET 版本。 (pull 4554)
* 具有全局/管理或全局/系统读取（以及通常的全局/Administer）权限的用户可以访问关于 Jenkins 的管理链接。 (issue 61455)
* 稳定性: 将 null 转换为 Secret 时不再抛出 NullPointerException。 (pull 4608)
* 升级到 Remoting 4.3，以解决 WebSockets 上的大量有效负载的问题。 需要具有 Remoting 4.3 或更高版本的配套 agent.jar。 (pull 4601, pull 4596, issue 61409, Remoting 4.3 变更日志, WebSockets 博客文章, JEP-222)
* 开发者: 在失败时自动创建符号链接，并记录告警。 (issue 56643)
* 开发者: 无需 JenkinsRule 即可在单元测试中使用 Secret 和 ConfidentialKey。 (pull 4603)

## 2.228 (2020-03-25)
* 重要安全修复。 (安全公告)
* 与请求路由和 CSRF 保护有关的安全增强。 (相关升级指导)

## 2.227 (2020-03-22)
* 具有全局/管理权限的用户可以访问系统信息管理链接，其中仅显示插件和内存使用信息。 (issue 61456)
* 在超大屏幕上限制管理 Jenkins 条目的最大宽度。 (pull 4582)
* 具有全局/管理权限(以及通常的全局/Administer)的用户可以配置系统配置中的使用统计。 (issue 61457)
* 使基于 HTTP DELETE 的项目删除行为更像 API，建议通过 POST /doDelete 进行删除。 (issue 61308)
* 提高上下文菜单的滚动速度。 (pull 4592)
* 在插件管理的已安装选项卡上列出未能加载的插件。 (pull 4589)
* 当插件正在寻找新的维护者时，在插件管理器中突出显示（“领养此插件”）。 (pull 4584)
* 开发者: 添加用于管理链接类别定义的 Javadoc。 (pull 4578)
* 内部: 允许使用高于 8 的 JDK 版本进行 core 构建。 (issue 61105)

## 2.226 (2020-03-15)
* 修复了任务配置表单中之前保存步骤中存在的拖放操作问题 (由 2.217 引入的缺陷回归)。 (issue 61429)
* 删除铃铛旁边不必要的“监视器”文本，以使 UI 更加整洁。 更改铃铛旁边的通知颜色，以使其更引人注意。 (issue 61224)
* 允许使用 configuration-as-code 插件配置使用情况统计信息。 (issue 54662)
* 允许使用 configuration-as-code 插件配置 ssh 鉴权密钥。 (pull 4563, ssh-cli-auth 1.8 变更日志)
* 尽可能使用浏览器提供的当前系统字体。 更改正文和标题的字体大小，以提高一致性和可读性。 (issue 60921)
* 将捆绑的 Script Security 插件从 1.70 更新到 1.71。 (pull 4561, Script security plugin 1.70 变更日志, SECURITY-1754 sandbox bypass 漏洞)
* 当前已安装的插件中存在安全问题时，在插件管理列表中显示。 (pull 4553)
 为'新建视图'添加法语翻译。 (issue 61424)
* 修复了 Jelly enum 格式控件中对 default 属性的支持。 (issue 61385)
* 添加 ManagementLink#getCategory() 以便于将“管理 Jenkins” 上的条目分类。 有关支持的返回值，请参见 ManagementLink.Category 枚举。 (pull 4546)
* 开发者: 使 h.checkAnyPermission 和 <l:layout permissions="…"> 可以在非 AccessControlled 的对象上工作。 (issue 61465)
* 标记 newInstanceFromRadioList() 方法和调用者可以为 null。 (pull 4543)
* 内部: 重新启动视图中删除内联资源。 (issue 60866)

## 2.225 (2020-03-09)
* 保存任务时不丢失 SCM 配置(由 2.224 引入的缺陷回归)。 (issue 61398)

## 2.224 (2020-03-08)
* WARNING: 此版本在保存任务时引入了严重的问题。 请参阅 JENKINS-61398。 请避免更新到此版本。
* Winstone 5.9: 修复最大表单内容大小和表单内容密钥的传递(由 Jetty 9.4.20 和 Jenkins 2.205 引入的缺陷回归)。 (pull 4542, issue 60409, Winstone 5.9 变更日志)
* Winstone 5.9: 修复由于 X-Forwarded-Host 和 X-Forwarded-Port 订阅问题而导致的将不正确的反向代理重定向到 Host 的问题(由 Jetty 9.4.20 和 Jenkins 2.205 引入的缺陷回归)。 (pull 4542, issue 60199, Winstone 5.9 变更日志, Jetty 9.4.27 变更日志)
* 不会对某些具有任务/配置权限的用户禁用任务配置表单上的所有控件(由 2.223 引入的缺陷回归)。 (issue 61321)
* 在插件管理器中显示插件发布日期。 (pull 4535)
* 禁止将非管理员用户的错误堆栈跟踪作为核心功能。 (issue 60410)
* 指示何时通过插件管理器中的更新解决安全问题。 (issue 61166)
* 在插件管理器中将插件类别显示为标签，而不是将它们分组到不同的表格中。 (pull 4534)
* 防止在 DescriptorList#newInstanceFromRadioList() 和 ExtensionDescriptorList#newInstanceFromRadioList() 中处理未处理的 JSONException。 (issue 61345)
* 调整屏幕大小时，调整搜索框到合适的大小。 (issue 61300)
* 删除只读用户在 textarea 表单元素下方的灰色条。 (issue 61284)
* 防止在没有工具安装程序元数据的情况下单击自定义更新中心的“立即检查”时的 NullPointerException。 (issue 60788)
* 如果未安装 cloud plugin，修复 clouds 配置页面上的空白页面。 (issue 61285)
* 更新 descriptorRadioList 表单元素，以遵循 DescriptorVisibilityFilter 扩展点。 (issue 51495)
* 将版本号库从 1.6 更新到 1.7，以解除对 FindBugs 注解的暂时依赖性。 (issue 61279)

## 2.223 (2020-03-01)
* 删除“自动刷新”功能，包括现在已过时的自动刷新遥测功能。 (pull 4503)
* 允许具有系统读取权限的用户查看全局安全配置页面。 (issue 61205)
* 允许具有系统读取权限的用户查看关于 Jenkins 页面。 (issue 61201)
* 具有扩展读取权限的用户现在将获得外观更具只读性的 UI。 (issue 61202)
* 防止出现 “Jenkins.instance 丢失”的情况。 (pull 4525, issue 55070, issue 59992, issue 60454, issue 61192)
* 默认情况下重新引入构建历史描述截断。 允许通过 historyWidget.descriptionLimit 系统属性管理/禁用限制。 负值将消除限制，0 则强制为空。 (pull 4529, issue 61004, issue 60299)
* 避免在将自定义根目录设置为文件系统根目录（例如 C:\）的情况下启动非流水线构建时的 NullPointerException。 (issue 61197)
* 允许 FingerprintFacet 阻止删除指纹。 (issue 28379)
* 内部: 删除未使用的类 StringConverter2。 (pull 4468)
* 内部: 删除未使用的内部类 Memoizer（此类使用了 ConcurrentHashMap）。 (pull 4470)
* 开发者: 在调试模式下，默认监听回送接口。 (pull 4515)

## 2.222 (2020-02-23)
* 修改标题栏和 breadcrumbs 导航的布局和图标。 依赖于 Jenkins 布局细节的插件的实例（例如简易主题插件）可能会遇到 UI/布局问题。 通过将 jenkins.ui.refresh 系统属性设置为 true，可以启用新的实验性标题颜色方案。 (issue 60920)
* 引入一个新的实验性 UI，可以通过将 jenkins.ui.refresh 系统属性设置为 true 来启用。 作为 UI/UX 改进的一部分，当前，它包括一个新的标题颜色方案，后续将添加更多更改。 (pull 4463, issue 60920, JEP-223, Jenkins UX SIG)
* 添加新的实验性 全局/管理 权限，该权限允许用户在不具有 全局/Administer 权限的情况下配置部分全局 Jenkins 配置。 这是一项实验性功能，默认情况下处于禁用状态，可以通过将 jenkins.security.ManagePermission 系统属性设置为 true 来启用。 (pull 4501, issue 60266, JEP-223)
* 添加一个新的实验性全局/系统读取权限，该权限（几乎）为 Jenkins 实例提供完全读取权限。 默认情况下，该权限是禁用的，请安装 Extended Read Permission 插件以将其激活。 (pull 4506, issue 12548, JEP-224, Extended Read Permission 插件)
* 弃用全局/运行脚本、全局/上传插件和全局/配置更新中心权限。 在 2017 年，主要授权插件中的权限被宣布为危险且默认情况下被禁用。 自定义授权策略实现将授予全局/Administer 权限，而不暗示这三个权限中的一个或多个将不再按预期工作。 在没有全局/Administer 权限的情况下向用户授予这些权限中任何一个的配置将不能按预期工作。 (pull 4365, issue 60266, JEP-223, 2017-04-10 Matrix Authorization 插件的安全公告, 2017-04-10 Role-Based Authorization 插件的安全公告)
* 删除禁用 CSRF 保护的功能。 从较旧版本的 Jenkins 升级的实例将启用 CSRF 保护和设置默认的发行者，如果之前被禁用。 (pull 4509)
* 在全局配置页面中订购管理员监视器。 (issue 60966)
* 将内存使用情况监视器添加到系统信息页面。 (pull 4499)
* 提高加载捆绑任务时的性能。 (pull 4497)
* 解决使用资源域时打开文件过多错误的问题。 (issue 61121)
* 添加法语翻译以获取并发构建帮助。 (pull 4505)
* 开发者: 添加新的 checkAnyPermission 和 hasAnyPermission 方法，如果用户具有上述权限之一，则允许访问。 (pull 4506, issue 12548, JEP-224)
* 开发者: 添加一个新的 f:possibleReadOnlyField jelly 标签，将字段包装为 if 只读检查，如果经过身份验证的用户仅具有读取访问权限，则将结果以文本输出。 如果该字段为空，则添加 N/A。 (pull 4506, issue 12548, JEP-224)
* 开发者: 添加一个新的 l:hasAdministerOrManage jelly 标签，如果用户没有 Jenkins.ADMINISTER 或Jenkins.MANAGE，则隐藏标签的正文。 (pull 4506, issue 12548, JEP-224)
* 开发者: 允许插件基于 UpdateSite 强制更新。 (issue 61046)

## 2.221 (2020-02-19)
> 此版本首次提供了全局配置的构建废弃器。 Jenkins 现在将定期执行已配置的每个项目的构建废弃器，即使当前尚无构建完成。 如果自上次运行构建以来，已经为项目配置了更激进的构建丢弃程序配置，则全局配置的构建丢弃程序可能会删除旧的构建。

* 添加全局配置的构建丢弃程序，删除未标记为“永久保留”的旧构建，即使没有配置、积极性较低、配置的按项目构建丢弃程序或者在构建完成后定期执行。 (pull 4368)
* 默认情况下，即使当前没有构建完成，Jenkins 也会定期执行配置的每个项目的构建废弃器。 这可能会删除自上次运行以来具有更积极的构建丢弃程序配置的项目的旧构建。 (pull 4368)
* 动态加载某些插件可能会导致权限错误。 (issue 61071)
* 将捆绑的脚本安全性插件从 1.68 更新到 1.70。 (pull 4490)
* 权限错误中不再显示禁用的权限。 (pull 4482)
* 开发者: 在 Javadoc 说明中使用正确的告警框名称。 (pull 4493)
* 开发者: 向 getAllItems()、allItems() 和 getItems() 引入过滤重载。 (pull 4469)
* 开发者: 添加新的扩展点 BackgroundBuildDiscarderStrategy，以便为全局构建丢弃程序配置提供更灵活的构建丢弃策略。 (pull 4368)
* 开发者: 将 findsecbugs 插件添加到 spotbugs 构建插件。 (pull 4381)
* 内部: 从 HudsonPrivateSecurityRealm 视图中删除内联资源。 (issue 60866)
* 内部: 当 AtomicFileWriter 无法写入文件时显示已更改异常。 (pull 3989)

## 2.220 (2020-02-09)
* 将代理安装作为 Windows 上的服务的问题修复（由 2.217 引入的缺陷回归）。 (Remoting 4.2 变更日志, Agent Installer Module 1.7 变更日志)
* 修复在获取具有状态阈值的运行列表时的空指针异常（由 2.202 引入的缺陷回归）。 (issue 60884)
* 移除网络发现服务（UDP 和 DNS）。 (issue 60913)
* 扩展当前里程碑，以便插件可以在 Jenkins 初始化期间更新任务和配置。 增加初始化里程碑：SYSTEM_CONFIG_LOADED、SYSTEM_CONFIG_ADAPTED 和 JOB_CONFIG_ADAPTED。 (issue 51856)
* 在更新站点 REST API 中导出插件兼容性标志。 (pull 4385)
* 在安装向导中建议安装 Jenkins Configuration as Code 插件。 (pull 4410)
* 在某些情况下，不会记录创建代理的用户。 (issue 21837)
* 避免记录由节点删除引起的节点监视异常。 (issue 54496)
* 改进 RSS 订阅的标题。 (issue 60848)
* 在任务的构建历史记录中显示构建持续时长作为一个工具提示到构建日期/时间。 (pull 4453)
* 提高表视图在显示项目时的性能。 (pull 4462)
* 提高在使用 jenkins.model.StandardArtifactManager.disableTrafficCompression=true 时制品归档的性能。 (issue 60907)
* 防止在 Jenkins 启动时创建重复的设置向导单例实例。 (issue 60867)
* 修复 ChoiceParameterDefinition.getDefaultParameterValue 中的 IndexOutOfBounds 异常。 (issue 60721)
* 更新插件管理器页面，以便在 Jenkins 正在重新启动时显示图标。 (issue 59486)

## 2.219 (2020-01-29)

* 重要的安全修复。 (安全公告)
* 与 Stapler 路由相关的安全增强。
* 安全增强: 在 REST API 响应中将 X-Content-Type-Options 设置为 nosniff。

## 2.218 (2020-01-27)
* Winstone 5.8: 修复传递某些种类的证书（例如域通配符）时，Jetty 的 KeyStores with multiple certificates are not supported 错误 (由 2.217 引入的缺陷回归) (issue 60857, Winstone 5.8 发布说明 - 由 Winstone 5.6 引入的缺陷回归)
* Winstone 5.7: 修复对系统日志记录定制的支持 (由 2.177 引入的缺陷回归) (issue 57888, Winstone 5.7 发布说明)
* 将布尔禁用标志添加到适用于任务的 REST API 输出中，以用于 Freestyle、Maven 和 Multi-configuration（Matrix）等经典项目类型。 (pull 4436)
* 内部: Winstone 5.7: 将 Jetty 线程池名称更改为“Jetty（winstone）” (Winstone 5.7 发布说明)

## 2.217 (2020-01-23)
* 将本地化版本修复为不再报告 can't parse argument number: changelog.url (由 2.214 引入的缺陷回归)。 (issue 60822)
* Jenkins 2.212+ 无法加载某些注入的字段，例如 Bitbucket Server Integration 插件使用的字段。 (issue 60816)
* 添加实验性的 WebSocket 支持。 (JEP-222, blog post)
* 将 Jetty 从 9.4.22.v20191022 升级到 9.4.25.v20191220。 (Jetty 9.4.23 发布说明, Jetty 9.4.24 发布说明, Jetty 9.4.25 发布说明)
* 将 Remoting 升级到 4.0。 (Remoting 4.0 发布说明)
* 在安装 Monitoring 插件时，防止有关 Java 11 缺少的、由 JavaMelody 触发的类的错误告警。 (issue 60725)
* 修复 AdoptOpenJDK 11 的 Java 版本检查。 (issue 60678)
* 内部: 前端工具链已升级为使用 webpack。 使 babel 能够转义某些 JS 模块。 (issue 60734)
* 开发者: 更新访问修饰符以允许插件使用屏蔽。 (pull 4441)

## 2.216 (2020-01-22)
> NOTE: 版本构建失败，不发布。
* 构建失败，版本不发布。

## 2.215 (2020-01-19)
* 如果在运行安装向导之前已经通过脚本配置了 Jenkins 根 URL，即使选择跳过创建 admin 用户的选项，跳过位置配置面板。 (issue 60750)
* 防止计算节点页面中的 RSS 订阅返回错误 404。 (issue 60577)
* 当构建连续失败时，在系统日志中包括详细信息。 (issue 60716)

## 2.214 (2020-01-11)
* 删除古老的、不推荐使用的、不支持的代理协议 Inbound TCP Agent Protocol/1, Inbound TCP Agent Protocol/2 和 Inbound TCP Agent Protocol/3。 将 Remoting 从 3.36 更新到 3.40，以删除不受支持的协议和较小的维护改进。 (issue 60381, Remoting 3.40 发布说明)
* 删除全局安全配置中的启用安全复选框。 (issue 40228)
* 阐明构建历史不包括流水线阶段。 (issue 59412)
* 现在可以从（非流水线）构建中使用环境变量 WORKSPACE_TMP 来访问与构建工作空间关联的临时目录。 (issue 60634)
* 内部: 在 EnvVars 中添加一个方法，该方法通过滤除 null 值来扩展 TreeMap.putAll() 功能。 (issue 59220)
* 内部: 允许使用 DescriptorVisibilityFilter 来过滤 UI 上的 View 属性。 (issue 60579)
* 修复代理脱机时代理 API 中的空指针异常（例如查询代理版本或操作系统说明）。 (issue 42658)
* 当无法检索可选的依赖元数据时，修复插件管理器中的 JavaScript 错误。 改进插件管理器 UI 中的措辞。 (issue 56152)
* 解决一些较小的本地化问题（例如转义、条目不完整等）。 (pull 4420)
* 修复 Javadoc 和 WebUI 中的错别字和拼写。 (pull 4418)

## 2.213 (2020-01-06)
* 修复了包含库 JAR 的插件的插件类资源加载失败的问题。 至少已知脚本安全性和活动目录插件会受到影响。 (由 2.112 引入的缺陷回归) (issue 60641, issue 60644)

## 2.212 (2020-01-05)
> WARNING: 此版本存在严重的问题，请参阅 JENKINS-60644。 请避免更新到此版本。

* 防止更新中心在进行数据解析时 Jenkins 页面卡住。 (issue 60625)
* 当无效字符串作为运行状态 CLI 参数传递时，将返回错误。 (pull 4212)
* 修复了加载可选依赖项的极端情况，这些依赖项会导致 Jenkins 在启动时崩溃。 (pull 4393, pull 4417, issue 60449)
* 开发者: 引入新的 AntClassLoader.getUrl() 方法以防止代码重复。 (pull 4254)

## 2.211 (2020-01-02)

* 使 queue/cancelItem REST API 返回有意义的结果代码，而不是错误 404。 (issue 60326)
* 从 Jenkins CLI 中移除未使用的 commons-codec 依赖。 (issue 60326)

## 2.210 (2019-12-22)

* 解决启动日志中的 AtomicInteger 和类过滤器告警。 (issue 60513)
* 验证另一个用户时，当前用户不再注销。 (issue 59107)
* 呈现某些用户控制的字符串时，显示 null 文本而不是空白文本。 (issue 60554)
* 从安装向导中删除易受攻击的 Team Concert 插件。 (CSRF 漏洞, 凭据枚举漏洞)
* 如果 hudson.Util.maxFileDeletionRetries 为零，禁用多次删除尝试。 (issue 60351)

## 2.209 (2019-12-15)
* 改进了传统 GUI 的执行程序小部件中的停止按钮行为，以避免意外中断错误的任务。 (issue 59656)
* 使用 SCMDescriptor#generation 中的 AtomicInteger 修复 Spotbugs 报告的并发问题。 (pull 4337)

## 2.208 (2019-12-09)
* 修复文件访问规则的在线示例、文档。 (pull 4383)
* 基于“代理节点到 master 的访问控制”使用白名单命令，当输入为空时，防止出现异常。 (issue 60278)
* 通过在 Computer.removeExecutor 中删除一次性执行器来防止 master 上的“僵尸”执行器。 (issue 57304)

## 2.207 (2019-12-01)
* 将捆绑的脚本安全性插件更新为 1.68。 (pull 4367)
* 当 Jenkins 使用反向代理并重新启动时，请不要过早重新加载。 (issue 6798)

## 2.206 (2019-11-24)
* 弃用 macOS 本机安装程序打包。 (Jenkins macOS 本机安装程序描述)
* 在插件管理器通过独立的页签打开插件和许可证链接。 (issue 60189)
* 为页面自动刷新标记设置 HttpOnly 标志。 (pull 4363)
* 避免在使用任务 DSL 定义视图时出现异常。 (issue 60092)
* 修复在 CephFS 上创建空文件时的 AtomicFileWriter 性能问题。 (issue 60167)
* 开发者: ViewGroupMixIn#getPrimaryView() 可能返回 null，需要基于这个周版本及以后的版本在插件中进行检查。 这是一个过渡状态，直到实现默认视图为止。 (issue 60092)
* 开发者: 使用 junit5 进行 CLI 测试。 (pull 4220)

## 2.205 (2019-11-17)
* 将云配置从"配置系统"移动到"管理节点"页面上其自身的配置表单中。 (pull 4339)
* 重新设计密码字段，以防止自动填写密码（登录表单除外）。 减少提供更新存储密码的浏览器。 通过将系统属性 hudson.Functions.hidingPasswordFields 设置为 false 来还原。 (pull 3991)
* 将鼠标悬停在文本上时，工作台上显示代理错误状态。 (issue 6722)
* 将鼠标悬停在侧栏链接上时，显示带有完整链接名称的工具提示。 (issue 59508)
* 运行完成和更新中心轮询事件的级别从 INFO 降低为 FINEST。 (pull 4345)
* 尝试始终在主服务器上执行轻量级任务，例如流水线或矩阵任务的主要构建。 (pull 3983)
* 将 Winstone 从 5.3 更新到 5.4，将 Jetty 从 9.4.18 更新到 9.4.22。 (Winstone 5.4 完整变更日志, Jetty 9.4.22 变更日志, Jetty 9.4.21 变更日志, Jetty 9.4.20 变更日志, Jetty 9.4.19 变更日志)
* 内部: 使 ProxyConfiguration 与 configuration-as-code 插件兼容。 不再需要 configuration-as-code 插件侧边栏的解决方法。 (issue 56553)
* 内部: 从核心中删除未使用的 jenkins-slave.xml 文件模板。 需要 1.3.1（2017.03.14 发布）或更高版本的 WMI Windows Agents 插件。 (pull 4330)
* 修复"插件管理-已安装"列表中卸载列的排序。 (issue 59665)
* 修复构建历史记录表样式。 (issue 59631)
* 防止错误的子任务提供者使构建永久运行。 (issue 59793)
* 内部: jenkins-cli.jar 中移出未使用的远程库。 (pull 4350)
* 开发者: 将 maven-jenkins-dev-plugin 切换到上游的 jetty-maven-plugin。 (pull 4351)
* 禁用 HTTP TRACE，以防止安全扫描程序的告警。 对于 2003 年的 Web 浏览器来说，这种风险是巨大的。 现代的浏览器禁止 TRACE 请求来防止跨站点跟踪（XST）攻击，因此没有真正的风险。 (issue 60180)

## 2.204 (2019-11-10)
* 插件管理器描述始终链接到插件站点，而不是 Jenkins wiki。 (issue 59679)
* 增加为多阶段时间序列图记录的数据点的数量，例如用于负荷统计的那些。 (pull 4341)
* 将 Remoting 从 3.35 更新到 3.36，以添加新的命令行选项 "-help" 和 "-version"。 (Remoting 发布说明)
* 开发者: 加强队列，以防止 NodeProperty 和 QueueTaskDispatcher 扩展点中的 canTake() 和 canRun() 实现而导致的队列挂起。 (issue 59886)

## 2.203 (2019-11-05)
* 允许按用户设置时区。 (issue 19887)
* 日志用户界面: 重新排列侧面板条目的顺序，添加一条注释，即"所有日志消息"将仅包含 NOTE 和更高级别的条目。 (pull 4305)
* 更新"插件管理器更新"选项卡，呈现有关不兼容依赖项的更多信息。 (pull 4299)
* 现在，构建趋势页面上的构建状态球链接到相应构建的控制台输出。 (issue 17459)
* 通过使 PluginManager#start() 以 SYSTEM 身份运行，可以在动态加载插件时防止权限问题。 (issue 59775)
* 正确处理资源根 URL token 中包含 : 字符的用户名。 (issue 59859)
* 防止在不发送 cookie 的情况下访问 /logout 的 NullPointerException 异常。 (issue 59904)
* 开发者: 使 ResourceDomainConfiguration 中的某些方法可以在插件中调用。 (pull 4335)

## 2.202 (2019-10-27)
* 在 Firefox 的 Jenkins 经典 UI 中还原表单提交的更改已导致带有"文件"输入的表单的回归。 这样做是为了预料 Firefox 中的错误修正，此错误已被撤消。 (由 2.173 引入的缺陷回归) (issue 58296, issue 53462, Firefox issue 1370630)
* 在"自动刷新"功能的使用中添加遥测。 (pull 3894)
* 将 java.util.concurrent.ConcurrentLinkedDeque 添加到 JEP-200 反序列化白名单。 (pull 4300)
* 开发者: 引入 Run#getBuildsOverThreshold() 方法以使超出所需的执行结果得以运行。 (pull 4259)

## 2.201 (2019-10-20)
* 由于编码问题，资源 URL 无法提供名称不重要的文件。 (issue 59849)
* 修复本地化标题在安装向导中跨越多行时的显示问题。 (issue 59800)

## 2.200 (2019-10-14)
* 为资源根 URL 添加一个选项，Jenkins 可以通过该选项为用户生成的静态资源（例如工作空间文件或已归档的制品）提供服务，而无需 Content-Security-Policy 标头。 (issue 41891)
* 删除使用用户浏览器下载更新中心元数据的功能（自 2015 年起不推荐使用）。 如果没有连接更新站点，Jenkins 将不再通知可用更新。 在这种情况下，建议使用更新站点的本地镜像，或使用 Juseppe 之类的自托管更新中心。 (pull 3970)
* 修复在弹出窗口中显示参考消息的管理监视器的样式。 (issue 59684)
* 为创建项目按钮添加缺少的"按下"样式。 (issue 34226)
* 将标签固定到 Atom 供稿链接。 (issue 48375)
* 开发者: 添加 Functions#urlEncode(String) 可以简化来自 Jelly 视图的 URL 查询参数的编码。 (pull 4278)
* 开发者: TarOutputStream 现在被标记为受限，因此插件中不使用它。 (pull 4272)
* 内部: 清理无用代码。 (issue 36720, pull 4248, pull 4258, pull 4260, pull 4256, pull 4257, pull 4261, pull 4267)

## 2.199 (2019-10-06)
* 在完成加载内存模型之前，请避免调用 Jenkins#save 持久数据。 这样可以防止 Jenkins 主配置损坏。 (issue 58993)
* 在基于 HTTP 的 CLI 上增加客户端保持活动 ping 的频率，以防止超时。 (issue 59267)
* 将默认的软终止超时从 2 分钟减少到 5 秒，以便生成其他进程的构建可以更快地完成。 (issue 59152)
* 停止与 Jenkins 捆绑 Maven 插件和 Subversion 插件。 在极少数情况下，尝试安装与 1.310 版本之前的 Jenkins 兼容的插件时，可能会导致问题。 Jenkins 项目目前未发布任何此类插件。 (pull 4242)
* 删除捆绑在一起的插件只是为了促进其使用，因为与旧插件兼容时不需要它们。 从 Jenkins 2.0 开始，默认情况下安装插件的概念已替换为安装向导。 (pull 4040)
* 将捆绑的脚本安全插件版本更新为 1.65 。 (pull 4245)
* 开发者: 如果 proc 参数为 null ，ProcessTree#killAll 不会再因 NPE 失败。 (pull 4232)
* 内部: 发生错误时，hudson.util.ProcessTree.OSProcess#getEnvironmentVariables 返回 null ，即使它不应该发生也是如此。 (issue 59580)

## 2.198 (2019-09-29)
* 删除构建历史记录小部件中的构建说明的 100 个字符长度限制。 (issue 19760, issue 31209)
* 将所需的 Remoting 客户端最低版本更新为 3.14 ，以简化实现。 (pull 4208)
* 临时离线状态使用不同的计算机图标。 (issue 59283)
* 稳定性：不允许用户使用 POST 在需要提交表单的 URL 上重新提交请求，因为那样无论如何都会失败。 (issue 59514)
* 来自 Computer.getLogDir 的失败消息的更好的诊断。 (pull 4226)
* 在少数情况下会从捆绑版本中安装 Ant 、 PAM Authentication 、 Mailer 和 Script Security 插件的捆绑版本。 (pull 4230)
* 将 commons-compress 从 1.10 更新为 1.19。 (pull 4221, changelog)
* 将 jfreechart 从 1.0.9 更新到 1.0.19，以获取最新的改进和错误修复。 (pull 4229, 变更日志)
* lastCompletedBuild 永久链接未缓存在 …/builds/permalinks 文件中。 (issue 56809)
* 开发者： 添加 TcpSlaveAgentListener#getAdvertisedHost()。 (pull 4227)

## 2.197 (2019-09-25)
* 安全修复。 (安全公告)

## 2.196 (2019-09-22)
* 现在，可以通过设置系统属性 jenkins.model.StandardArtifactManager.disableTrafficCompression=true 来禁用从节点将归档的结果件传输到主服务器时的 Gzip 压缩包。 (issue 26008, Jenkins features controlled by system properties)
* 使日志回传更加可靠。 (issue 58779)
* 修复 Atom 和 RSS 2.0 提要中格式错误的 XML 。 (由 2.94 引入的缺陷回归) (issue 59231)
* 无法访问名称中带有表情符号的某些项目 URL 。 (issue 59406)

## 2.195 (2019-09-16)
* 有时不正确地删除安装向导，Jenkins 仅显示空白屏幕。 (issue 59017)

## 2.194 (2019-09-08)
* 修复 RSS/Atom 提要中缺少的绝对 URL 。(由 2.190 引入的缺陷回归) (issue 59167)
* 将 Remoting 从 3.33 更新到 3.35 ，以允许入站 TCP 代理直接连接，而无需首先通过 HTTP 查询 Jenkins 的连接参数。 (issue 59094, issue 53461, 完整的变更日志)
* 将 Windows Service Wrapper 从 2.2.0 更新到 2.3.0 ，以获取修复程序和改进。 (pull 4167, WinSW 变更日志, Windows Agent Installer 模块 1.12 变更日志)
* 内部: 将 dom4j 库从 Jenkins 项目分支更新到上游版本 2.1.1。 (issue 53322)
* 内部: 用 java.util.Base64 替换了不同的 base64 实现。 (pull 4169)

## 2.193 (2019-09-01)
* 由于涉及隧道连接的问题，将 Remoting 从 3.34 降级为 3.33 。 (由 2.191 引入的缺陷回归) (issue 59094)
* 当提示慢触发的管理警告时， Jenkins UI 中断。(由 2.189 引入的缺陷回归) (issue 58938)

## 2.192 (2019-08-28)
* 重要的安全修复。 (安全公告)

## 2.191 (2019-08-25)
* 将 Remoting 从 3.33 更新到 3.34 ，以允许入站 TCP 代理直接连接，而无需首先通过 HTTP 查询 Jenkins 的连接参数。 (issue 53461, full changelog)
* 多次次要代码清理和内部修复。 (pull 4131, pull 4162, pull 4163, issue 36720)
* 内部: 将 Mockito 从 2.22.0 升级到 3.0.0 。 (pull 4154)

## 2.190 (2019-08-18)
* 在任务名称中添加对表情符号和其他非 UTF-8 字符的支持。 🎉 (issue 23349)
* RSS 和 Atom 提要不包含所有必需的元数据。(由 2.186 引入的缺陷回归) (issue 58595)
* 在 UI 上公开节点的真实环境变量。 (issue 54772)
* 使用 SHA-256 代替 MD5 来生成 crumbs/CSRF token。 (issue 58734)
* 截断 UI 上的长构建名称以防止对齐问题。 (issue 58157)
* 开发者: 现在 AbstractItem#renameTo 重命名之前检查 #isNameEditable 。 (issue 58571)

## 2.189 (2019-08-07)
* $JENKINS_HOME/jobs/*/builds/permalinks 中的文件句柄泄露可能会阻止任务在 Windows 上被删除。 (由 2.185 引入的缺陷回归) (issue 58733)
* 从/scriptText 终点删除多余的空格输出。(由 2.186 引入的缺陷回归) (issue 58548)
* install-plugin CLI 命令允许安装不是插件的文件，从而可能破坏某些功能。 (issue 29065)
* 当 cron 触发器的执行时间较长时，添加告警。 (issue 54854)
* 在安装向导中分批安装插件以提高性能。 (pull 4124)
* 停止在 install-plugin CLI 命令中使用 name 参数。 (pull 4123)
* 更新某些独立插件的版本。 从较旧的版本升级 Jenkins 时，或者未为手动管理的插件指定隐含依赖项时，通常会安装这些工具。 (pull 4125)
* 内部: 添加对 Jenkins 核心运行 JMH 基准测试的支持。 (pull 4135)
* 内部: 将 Jenkins 测试工具从 2.49 更新到 2.54 ，以增加对 JMH 基准测试的支持。 (pull 4135, 变更日志)
* 内部: 从 jenkins.war 干掉 WEB-INF/lib/jquery-detached-1.2.jar 。 (pull 4120)

## 2.188 (2019-08-07)
* 此版本失败。没有结果件或 Git 标签存在。
* 在这次发布中没有显著的变更。

## 2.187 (2019-07-21)
* 现在可以通过设置系统属性 hudson.node_monitors.AbstractNodeMonitorDescriptor.periodMinutes 来更改节点监视器的默认时间间隔（例如可用磁盘空间）。 (pull 4105, 受系统属性控制的 Jenkins 功能)
* 稳定性: 当 AdministrativeMonitor#isActivated 失败时不要渲染视图。 (pull 4114)
* Internal: 将 slf4j 从 1.7.25 升级到 1.7.26 版本。 (pull 4118)

## 2.186 (2019-07-17)
* 重要的安全修复。 (安全公告)
* 从 Jenkins 核心中删除 Trilead SSH 依赖。这些依赖性导致 2.185 中的 SSH 构建节点连接问题。 (issue 58483)
* 将 SSH CLI Auth Module 从 1.5 升级到 1.7 ，以删除 Trilead SSH 参考。 (pull 4111, issue 43669, 1.7 的变更日志, 1.6 的变更日志)

## 2.185 (2019-07-14)
* Jenkins 不再在项目或构建目录中创建符号链接。 如果需要，可以安装 Build Symlink 插件来恢复此功能。 诸如 /job/…/lastStableBuild/ 之类的 URL 不受影响，仅影响直接访问 $JENKINS_HOME 文件系统的工具。 (issue 37862)
* 从 Jenkins 核心中删除 Trilead SSH 库，并使其在新的 独立插件 中可用。 (issue 43610)
* 测试代理配置时不要抛出异常。(由 2.168 引入的缺陷回归) (issue 57383)
* 防止 Jenkins 重启和用户会话无效时的偶发 IllegalStateException 异常。 (issue 55945)
* 避免使用重复的 screenResolution cookie 进行查看。 (pull 4103)
* 由于新旧插件的混合使用，在某些情况下，可能有两个版本的扩展点供节点的命令启动器选项使用。 (issue 58362)
* 在插件管理器的"已安装"选项卡上添加警告，警告管理员禁用独立的插件可能引起的问题，此问题自 2.181 版本开始可能会触发。 (pull 4098)
* 如果可用节点非常快，则在云节点配置期间消除不必要的延迟。 (issue 24752)
* 将 commons-codec 库从 1.9 升级到 1.12。 (pull 4052, 变更日志)
* Developer: 即使 *.jpl 文件存在，插件兼容性测试器也不会跳过捆绑的插件安装。 (issue 58362)
