---
title: "Alpha 版本的插件管理库和 CLI 工具"
description: "Alpha 版本的插件管理库和 CLI 工具"
date: 2019-10-25
original: "https://jenkins.io/blog/2019/07/02/plugin-management-tool-alpha-release/"
tags:
- plugins
- pluginmanagement
- platform-sig
- cli
- gsoc
- gsoc2019
keywords:
- plugins
- pluginmanagement
- platform-sig
- cli
- gsoc
- gsoc2019
author: stopalopa
translator: zhaoying818
poster: devopsworld.jpg
---

![devopsworld File](devopsworld.jpg)

_"人人都在重复造轮子，部分像实现插件管理的"细节"（签名元数据，制品校验和，从核心独立出来的插件...）。
很明显， Jenkins 应该为实时 Jenkins 实例之外的插件安装提供充足的工具。"_ [JENKINS-53767](https://issues.jenkins-ci.org/browse/JENKINS-53767)


我的 [Google Summer of Code project](https://jenkins.io/projects/gsoc/2019/plugin-installation-manager-tool-cli/) 项目试图解决这个问题，方法是创建一个库，该库将在 Jenkins 的不同实现中统一插件管理逻辑，并提供一个可以使用户轻松下载插件并在 Jenkins 启动之前查看插件信息的 CLI 工具。 
我很高兴分享我们刚刚发布的 Alpha 版本，您可以在[此处](https://github.com/jenkinsci/plugin-installation-manager-tool/releases)查看！


## GSoC 阶段 1 更新

当我考虑将[插件管理器](https://github.com/jenkinsci/jenkins/blob/master/core/src/main/java/hudson/PluginManager.java)从 Jenkins 核心中移出时，由于依赖项的复杂性和数量，这最终成为了最具挑战性的第一步。相反，我们决定首先将 Jenkins Docker 中的 [install-plugins.sh bash 脚本](https://github.com/jenkinsci/docker/blob/master/install-plugins.sh)转换为 Java。 install-plugins.sh 脚本存在多个问题，即它是 bash 脚本并且扩展性有限，此外，它不会检索所有最新的更新中心的元数据。

## Alpha 版本详情

模仿官方 Jenkins Docker 镜像中 [install-plugins.sh](https://github.com/jenkinsci/docker/blob/master/install-plugins.sh) 脚本中的操作，新的插件管理库接收插件列表、它们的版本和（或） URL，从中可以下载插件，并下载所需的插件及其依赖。插件从更新中心下载到指定目录，然后可以加载到 Jenkins 中。当前，可以通过 plugins.txt 文件和（或） -plugins 的 cli 选项指定要下载的插件，我们计划进一步扩展可以接收的输入格式。 还支持用于不同更新中心的[自定义版本说明符](https://github.com/jenkinsci/docker#plugin-version-format)。

![Example plugins.txt File](pluginstxt.png)

该库将首先检查当前是否在用户指定的下载位置或用户指定的 Jenkins war 文件中安装了任何请求的插件。如果要求更高版本或更高版本作为依赖项，则将忽略或升级已安装的插件。确定插件下载 URL 后，库将下载插件并解析和下载其依赖。

![Example of Downloading Plugins](downloadexample.png)

![Plugin Download Directory](downloadedplugins.png)

这仅仅是个开始：插件管理器库和 cli 工具仍在开发中。 有关 CLI 选项以及如何运行该工具的最新信息，请参见[存储库 README.md ](https://github.com/jenkinsci/plugin-installation-manager-tool/blob/master/README.md)。 即将提供更强大的输入解析，对安全警告和可用更新的支持，Docker集成以及其他功能！

## 链接和反馈

欢迎通过[插件安装管理器 CLI 工具 Gitter 聊天室](https://gitter.im/jenkinsci/plugin-installation-manager-cli-tool)或 [Jenkins 开发者邮件列表](mailto:jenkinsci-dev@googlegroups.com)与我们联系。我希望收到您的问题，评论和反馈！我们在世界标准时间下午6点（星期二和星期四）开会。

* [Phase 1 Presentation Slides](https://docs.google.com/presentation/d/12Bo8w9SinrG5n82w-Unjx4MNq0mjkHFEOMc3Jf6rTQQ/edit#slide=id.p1)
* [Phase 1 Recorded Demo](https://youtu.be/MDs0Vr7gnnA?t=196)
* [Jira Issue Search](https://issues.jenkins-ci.org/browse/JENKINS-58199?jql=project%20%3D%20JENKINS%20AND%20component%20%3D%20plugin-installation-manager-tool)
* [Repository](https://github.com/jenkinsci/plugin-installation-manager-tool)
