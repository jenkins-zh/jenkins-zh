---
title: "使用 Visual Studio Code 验证 JCasC 配置文件"
description: "介绍 Visual Studio Code 新的 JCasC 插件以及如何使用该插件来验证您的 YAML 配置文件"
date: 2020-03-06
original: "https://jenkins.io/blog/2020/02/25/vscode-caseStudy/"
tags:
- community-bridge
- JCasC
- VSCode
- community
keywords:
- Visual Studio Code
- JCasC
author: Sladyn Nunes
translator: wenjunzhangp
poster: "cover.png"
---

![封面图](cover.png)

## 配置即代码插件

问题陈述：将现有的模式验证工作流程脚本语言 [Jenkins 配置即代码插件](https://plugins.jenkins.io/configuration-as-code/)转换为基于 Java 的重写，从而增强其可读性和可测试性，并由该测试框架提供支持。通过开发 VSCode 插件来促进自动完成和验证，从而增强开发人员的经验，这将有助于开发人员在应用到 Jenkins 实例之前编写正确的 yaml 文件。

[配置即代码插件](https://plugins.jenkins.io/configuration-as-code/)已被设计为 Jenkins 基于声明式配置文件配置的基本方式，无需成为 Jenkins 专家亦可编写这样的文件，只需将配置过程中转换成用于在 web UI 中执行的代码即可。该插件使用此类模式来验证要应用于 Jenkins 实例的文件。

启用了新的 JSON 模式后，开发人员现在可以针对其测试 yaml 文件。该模式检查 `descriptors`，即可以应用于插件或 Jenkins 核心的配置，使用正确的类型并在某些情况下提供帮助文本。 VSCode 允许我们通过一些修改立即测试架构。该项目是 [Community Bridge](https://communitybridge.org/) 计划的一部分，Community Bridge 计划是 Linux 基金会创建的一个平台，旨在使开发人员以及支持他们的个人和公司提高开源技术的可持续性、安全性和多样性。您可以看一下[ Jenkins Community Bridge 项目](https://people.communitybridge.org/project/bce45251-1ff4-4131-9699-0a0017b31495)。

## 启用架构验证的步骤

1. 第一步安装 [Visual Studio Code 的 JCasC 插件](https://marketplace.visualstudio.com/items?itemName=jcasc-developers.jcasc-plugin)，并通过扩展列表打开扩展。使用 `Ctrl + Shift + X` 在 VSCode 编辑器中打开扩展列表的快捷方式。

2. 为了启用验证，我们需要将其包括在工作空间设置中。依次导航到 `File`，`Preference` 和 `Settings`。内部设置中搜索 `json`，内部 `settings.json` 中包含以下配置。

```
{
"yaml.schemas": {
        "schema.json": "y[a]?ml"
    }
}
```

您可以将全局模式指定为 schema.json 的值，schema.json 是模式的文件名。这会将架构应用于所有 yaml 文件。例如：`.[y [a]？ml]`

3. 使用 VSCode 可以完成以下任务：
    - 自动完成（Ctrl + Space）：自动补全所有命令。
    - 文档大纲（Ctrl + Shift + O）：提供文件中所有已完成节点的文档概述。

4. 在工作目录下创建一个名为 jenkins.yml 的新文件。例如，参考以下文件的内容：

```
jenkins:
  systemMessage: “Hello World”
  numExecutors: 2
```
   - 上面的 yaml 文件根据架构有效，vscode 为您提供验证和自动完成功能。

## 截图

![vscode](vscode.png)

![参考文档1](userDocs1.png)

![参考文档2](userDocs2.png)

我们于 2 月 26 日举行了在线 [meetup](https://www.meetup.com/Jenkins-online-meetup/events/268823268)（译注：该 meetup 已举办，Video 及 Slides 链接见最下方），讨论该插件以及如何使用它来验证您的 YAML 配置文件。对于有关架构的任何建议或讨论，请随时加入我们的 [gitter 频道](https://gitter.im/jenkinsci/jcasc-devtools-project)。可以在 [Github](https://github.com/jenkinsci/configuration-as-code-plugin/issues) 上提交问题。

## 链接

* [Video](https://www.youtube.com/watch?v=nlm-ZaW9FPo&feature=youtu.be)
* [Slides](https://www.slideshare.net/SladynNunes/jenkins-jcasc-online-meetup)