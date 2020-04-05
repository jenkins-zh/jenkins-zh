---
title: 使用 Jenkins 实现 CI/CD 多分支流水线
description: 基于 Jenkins 多分支流水线任务类型创建 CI/CD 多分支流水线
author:  Krishna Prasad Kalakodimi
translator: anxk
original: https://dzone.com/articles/implement-ci-for-multibranch-pipeline-in-jenkins
poster: cover.jpg
toc: true
date: 2019-12-31
tags:
- jenkins
- multi-branch
---

![Making multiple branches with Jenkins](cover.jpg)

## 简介

Jenkins 是一个持续集成服务器，用于从版本控制系统（VCS）中获取最新代码，然后对其进行构建、测试并将结果通知给开发人员。除了作为一个持续集成（CI）服务器之外，Jenkins 还可以做很多其它的事情。最初它被称为 Hudson，是川口耕介（Kohsuke Kawaguchi）基于 Java 编写的一个开源项目，因此，在安装和运行 Jenkins 之前，首先需要安装 [Java 8](https://dzone.com/articles/how-to-install-jdk-8-on-linux-operating-system-vid)。

[多分支流水线](https://dzone.com/refcardz/declarative-pipeline-with-jenkins)是 Jenkins 中的一种流水线类型，它允许您在 Jenkinsfile 的帮助下为源码管理（SCM）库中的每个分支自动地创建一支流水线。

## 什么是 Jenkinsfile

Jenkinsfile 是一个文本文件，被用来定义一个 Jenkins 流水线。在 Jenkinsfile 中可以使用[领域特定语言（DSL）](https://dzone.com/articles/kotlin-dsl-from-theory-to-practice)编写运行 Jenkins 流水线所需要的步骤，从而将流水线实现为代码。

## 来自 Jenkins 的定义

使用多分支流水线，您可以为同一项目的不同分支实现不同的 Jenkinsfile，Jenkins 将会自动发现、管理和执行那些分支中包含 Jenkinsfile 的流水线。

![Architecture Diagram](multibranch-pipeline.png)

## 创建一个简单多分支流水线任务的步骤

1. 点击 Jenkins 工作台左上角的 **New Item** 选项：

![New Item](new-item.png)

2. 在 **Enter an item name** 中填入任务名，向下滚动，然后选择 **Multibranch Pipeline**，最后点击 **OK** 按钮：

![Multibranch pipeline](select-multibranch.png)

3. 填写**任务描述**（可选）。

4. 添加一个**分支源**（例如：GitHub）并且填写代码仓库的位置。

5. 选择 **Add** 按钮添加凭证并点击 **Jenkins**。

6. 键入 GitHub **用户名**、**密码**、**ID** 和描述。

7. 从下拉菜单中选择凭证：

![Branch sources](select-repo.png)

8. 点击 **Save** 保存该多分支流水线任务。

9. Jenkins 会自动扫描指定的仓库并为 Organization 文件夹添加索引。Organization 文件夹使得 Jenkins 能够监视整个 GitHub Organization 或 Bitbucket Team/Project，并自动为包含分支的仓库创建新的多分支流水线，然后拉取包括 Jenkinsfile 在内的源码：

![Scan repository log](scanning.png)

10. 当前，这项功能仅适用于 GitHub 和 Bitbucket 中的仓库，分别由 [GitHub Organization Folder](https://plugins.jenkins.io/github-organization-folder) 和 [Bitbucket Branch Source](https://plugins.jenkins.io/cloudbees-bitbucket-branch-source) 这两个插件提供。

11. 一旦任务被成功创建，构建将会被自动触发：

![Builds triggered](jobs.png)

## 配置 Webhooks

12. 我们需要配置 Jenkins 服务器以便与我们的 GitHub 仓库通信，为此，我们要获取 Jenkins 的 Hook URL。

13. 导航到 **Manage Jenkins** 页面，然后选择 **Configure System**。

14. 找到 **GitHub** 插件配置部分，然后点击 Advanced 按钮。

15. 选择 **Specify another hook URL for GitHub configuration**：

![Webhooks](n-ci-sepcify-hook.png)

16. 将文本框中的 URL 复制出来。

17. 单击 **Save**，返回到 Jenkins 工作台。

18. 打开浏览器，导航到 GitHub 选项卡，然后选择您的 **GitHub** 仓库。

19. 单击 **Settings**，导航到仓库设置：

![Settings](settings.png)

20. 点击 Webhooks 部分。

21. 点击 **Add Webhook** 按钮，然后将 **Hook URL** 粘贴在 **Playload URL** 中。

22. 确保 Webhook 触发器已选中 **Just the push event** 选项。

![Add webhook](add-webhook.png)

23. 点击击 **Add webhook**，就会把此 webhook 添加到您的仓库。

24. 正确添加 Webhook 后，您将会看到带有绿勾的 Webhook：

![Added webhook](green-tick.png)

25. 返回到仓库，然后切换到对应分支并更新任何文件。在此，我们更新 **README.md** 文件。

26. 现在将会看到 Jenkins 任务被自动触发：

![CI triggers](cicd.png)

27. 流水线执行完成后，可以通过点击 **Build History** 下的构建号来验证执行过的构建。

28. 点击构建号，然后选择 **Console Output**，您便可以看到每个构建步骤的输出日志：

![Console Output](console-output.png)

## 进一步阅读

[Learn How to Set Up a CI/CD Pipeline From Scratch](https://dzone.com/articles/learn-how-to-setup-a-cicd-pipeline-from-scratch)

[API Builder: A Simple CI/CD Implementation – Part 1](https://dzone.com/articles/api-builder-a-simple-cicd-implementation-part-1)
