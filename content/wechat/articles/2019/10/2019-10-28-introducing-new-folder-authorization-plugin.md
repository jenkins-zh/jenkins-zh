---
title: "介绍新的文件夹授权插件"
description: "介绍新的文件夹授权插件"
date: 2019-10-28
original: "https://jenkins.io/blog/2019/08/16/folder-auth-plugin/"
tags:
- 外挂程式 安全 性能 gsoc gsoc2019
keywords:
- JENKINS FOLDER-AUTH-PLUGIN
author:  Abhyudaya Sharma
translator: wenjunzhangp
poster: “./2019-10-28-introducing-new-folder-authorization-plugin/cover.jpg”
---

![cover](cover.jpg)

在我的 [Google Summer of Code Project](https://jenkins.io/projects/gsoc/2019/role-strategy-performance) 期间，我创建了全新的 [Folder Auth](https://plugins.jenkins.io/folder-auth) 插件，可轻松管理 [Folders plugin](https://plugins.jenkins.io/cloudbees-folder) 对文件夹中组织的项目的权限。这个新插件旨在通过易于管理的角色进行快速权限检查。该插件的 1.0 版本刚刚发布，可以从您的 Jenkins 更新中心下载。

该插件的灵感来自角色策略插件，可改善性能并简化角色管理。开发该插件是为了解决 [Role Strategy Plugin](https://plugins.jenkins.io/role-strategy) 在许多角色上的性能限制。同时，该插件通过文件夹解决了 Jenkins 中组织项目最受欢迎的方式之一。该插件还具有一个新的 UI ，将来会有更多改进。

该插件支持三种类型的角色，分别适用于 Jenkins 中的不同位置。
* 全局角色：适用于 Jenkins 的所有地方
* 代理角色：限制连接到您的实例的多个代理的权限
* 文件夹角色：适用于文件夹内组织的多个作业

![folder-auth](folder-auth.png)

## 角色策略插件的性能改进
与角色策略插件不同，此插件不使用正则表达式来查找匹配的项目和代理，从而改善了我们的性能并简化了管理员的工作。为了减少需要管理的角色数量，通过文件夹角色授予文件夹的权限将继承其所有子项。这对于通过单个角色访问多个项目很有用。同样，一个代理角色可以应用于多个代理，并分配给多个用户。

此插件的设计目的是在权限检查方面优于角色策略插件。这些改进是使用我在 GSOC 项目的第一阶段创建的[micro-benchmark framework](https://jenkins.io/blog/2019/06/21/performance-testing-jenkins/)来衡量的。两个插件相同配置的基准测试表明，与角色策略 2.13 中的全局角色相比， 500 个全局角色的权限检查速度提高了 934 倍，角色策略 2.13 本身包含一些性能改进。将文件夹角色与角色策略的项目角色进行比较，对于 250 个组织在 150 个用户的实例上的两级深层文件夹中的项目，对作业的访问权限检查几乎快了 15 倍。您可以在 [此处](https://github.com/jenkinsci/folder-auth-plugin/pull/13) 看到基准和结果比较。

## Jenkins 配置作为代码支持
该插件支持 Jenkins 的“代码即配置”功能，因此您无需通过 Web UI 即可配置权限。YAML 配置如下所示：

``` javascript
jenkins:
  authorizationStrategy:
    folderBased:
      globalRoles:
        - name: "admin"
          permissions:
            - id: "hudson.model.Hudson.Administer"
              # ...
          sids:
            - "admin"
        - name: "read"
          permissions:
            - id: "hudson.model.Hudson.Read"
          sids:
            - "user1"
      folderRoles:
        - folders:
            - "root"
          name: "viewRoot"
          permissions:
            - id: "hudson.model.Item.Read"
          sids:
            - "user1"
      agentRoles:
        - agents:
            - "agent1"
          name: "agentRole1"
          permissions:
            - id: "hudson.model.Computer.Configure"
            - id: "hudson.model.Computer.Disconnect"
          sids:
            - "user1"
```
## 带有 Swagger 支持的 REST API

该插件提供 REST API ，用于通过 Swagger.json 管理具有 OpenAPI 规范的角色。您可以在 [SwaggerHub](https://app.swaggerhub.com/apis/abhyudaya/folder-auth/1.0.0s) 上查看 Swagger API 。SwaggerHub 提供了多种语言的存根，可以下载并用于与插件进行交互。您还可以使用 [curl](https://curl.haxx.se/) 从命令行查看一些示例请求。

![swagger](swagger.png)
![swagger2](swagger2.png)

## 接下来做什么

在不久的将来，我想改进用户界面，使插件更容易使用。我还希望改进 API 、文档和更多的优化来提高插件的性能。

## 链接和反馈

我很想听听你的意见和建议。请随时通过 [Role Strategy Plugin Gitter chat](https://gitter.im/jenkinsci/role-strategy-plugin) 或通过 [Jenkins Developer Mailing list](mailto:jenkinsci-dev@googlegroups.com) 与我联系。

* [Presentation slides for second phase evaluations](https://drive.google.com/file/d/1IVe3T8WdTILmb62PAIJveR4KbBWzPt1k/view?usp=sharing)
* [Documentation for the Folder Auth Plugin](https://github.com/jenkinsci/folder-auth-plugin/blob/master/README.md)
* [Demo of the Folder Authorization plugin](https://www.youtube.com/watch?v=tAUHfYYQrpo)