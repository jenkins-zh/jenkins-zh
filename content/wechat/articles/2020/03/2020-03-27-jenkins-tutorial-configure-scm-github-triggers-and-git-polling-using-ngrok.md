---
title: "Jenkins 教程：使用 Ngrok 配置（SCM）Github 触发器和 Git 轮询"
description: "教你如何在作业上配置 Github 触发器以及如何使用 Webhook 与 Github 相通"
date: 2020-03-27
original: "https://www.previous.cloudbees.com/blog/jenkins-tutorial-configure-scm-github-triggers-and-git-polling-using-ngrok"
tags:
- Ngrok
- SCM
- Github
- Git
author: Kiley Nichols
translator: wenjunzhangp
poster: "cover.png"
---

![封面图](cover.png)

## 总览

Jenkins 是领先的开源自动化服务。它提供了 1500+ 个插件来支持构建，部署和自动化任何项目。在本文中，我们将研究如何在作业上配置 Github 触发器，以及如何使用 Webhook 与 Github 相通，该 Webhook 指示何时轮询作业以构建对项目进行的更改。

## 前提条件

您需要在 [Github](https://github.com/) 中有一个项目。

您将需要启动并运行 [Jenkins 服务](https://jenkins.io/download/)。

## 入门

### 安装和运行 Ngrok

Ngrok 是一个反向代理，它接受公共地址上的流量，并将该流量中继到计算机上运行的 ngrok 进程，然后再中继到您指定的本地地址。

因此，通过您选择的任何一种方法，前往 [Ngrok](https://ngrok.com/) 并注册一个帐户。然后，您应该会看到下面的截图，其中显示了如何解压缩和运行它。

![Ngrok 安装](setup-install.png)

运行`./ngrok http 8080`，它将指向我们的 Jenkins 服务。

运行该命令后，您将收到代理主机名，如下所示：

转发 `http://xxxxx.ngrok.io` -> `http://localhost:8080`

转发 `https://xxxxx.ngrok.io` -> `http://localhost:8080`

### 设置 Github Webhook

因此，跳转到 `Github 项目`并单击设置，在左侧面板上应该会看到 `webhooks`，现在单击该按钮。

添加我们的 webhook：

![添加 webhook](webhook.png)

### 设置 Jenkins 项目或流水线作业

选择 Github 挂钩触发器进行 GitScm 轮询：

![设置触发器](triggers.png)

然后，使用您的 GitHub 帐户设置 Jenkins Pipeline：

![设置 Jenkins Pipeline](pipeline.png)

开始准备测试我们的工作！使用您指定的 `develop`，`master` 等分支将提交提交到您的项目。

推送完成后，您应该开始看到您的工作建立了最新的推送，您可以跳转到 Github Hook Log 并检查 Webhook 是否通过 `Ngrok` 进行了代理。

![Jenkins 界面菜单](jenkins-build.png)

![最后推送](last-push.png)