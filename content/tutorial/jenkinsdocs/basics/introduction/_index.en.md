---
title: "Jenkins简介与应用"
weight: 10
#pre: "<b> </b>"
chapter: true
draft: false
date: 2018-12-29T11:02:05+06:00
lastmod: 2020-01-05T10:42:26+06:00
# search related keywords
keywords: ["Jenkins基础管理","简介"]
---


大家好，本章我们将介绍Jenkins，让大家认识Jenkins！告诉大家Jenkins是什么？ 它能做什么？


### 目录
+ [简单介绍](#简单介绍)
+ [发展历史](#发展历史)
+ [功能特点](#功能特点)
+ [应用场景](#应用场景)
+ [web页面展示](#web页面展示)

---

### 简单介绍

[Jenkins](https://jenkins.io)前身是Hudson，使用java语言开发的自动化发布工具。在中大型金融等企业中普遍使用Jenkins来作为项目发布工具。 Jenkins官方提供的插件使Jenkins更为强大。Jenkins是一个自动化服务器，目前发展超过15年，比较成熟的CI工具（也可以CD）能够实现自动化集成发布。建立好流水线后，期间无需专业运维人员介入，开发人员随时发布部署，任性!。

### 发展历史
* Jenkins的前身是Hudson，采用JAVA编写的持续集成开源工具。
* Hudson由Sun公司在2004年启动，第一个版本于2005年在java.net发布。
* 2007年开始Hudson逐渐取代CruiseControl和其他的开源构建工具的江湖地位。
* 在2008年的JavaOne大会上在开发者解决方案中获得杜克选择大奖（Duke’s Choice Award）。

* 在2010年11月期间，因为Oracle对Sun的收购带来了Hudson的所有权问题。主要的项目贡献者和Oracle之间，
尽管达成了很多协议，但有个关键问题就是商标名称“Hudson”。

* 甲骨文在2010年12月声明拥有该名称并申请商标的权利。因此，2011年1月11日，有人要求投票将项目名称从“Hudson”改为“Jenkins”。

* 2011年1月29日，该建议得到社区投票的批准，创建了Jenkins项目。

* 2011年2月1日，甲骨文表示，他们打算继续开发Hudson，并认为Jenkins只是一个分支，而不是重命名。因此，Jenkins和Hudson继续作为两个独立的项目，每个都认为对方是自己的分支。
* 到2013年12月，GitHub上的Jenkins拥有567个项目成员和约1,100个公共仓库，与此相对的Hudson有32个项目成员和17个公共仓库。到现在两者的差异更多，应该说Jenkins已经全面超越了Hudson。此外，大家可能是出于讨厌Oracle的情绪，作为Java开发者天然地应该支持和使用Jenkins。


### 功能特点
* 开源免费
* 多平台支持（windows/linux/macos）
* 主从分布式架构
* 提供web可视化配置管理页面
* 安装配置简单
* 插件资源丰富


### 应用场景
* 集成svn/git客户端实现源代码下载检出
* 集成maven/ant/gradle/npm等构建工具实现源码编译打包单元测试
* 集成sonarqube对源代码进行质量检查（坏味道、复杂度、新增bug等）
* 集成SaltStack/Ansible实现自动化部署发布
* 集成Jmeter/Soar/Kubernetes/.....
* 可以自定义插件或者脚本通过jenkins传参运行
* 可以说Jenkins比较灵活插件资源丰富，日常运维工作都可以自动化。

### web页面展示

* 管理页面: 系统管理页面包含系统管理、全局安全管理、全局工具配置、节点管理、授权管理、插件管理、系统备份管理、日志监控管理

![webpage](images/01-systemmanage.png?width=60pc)

* 项目管理页面: 项目、项目状态、项目视图、构建队列等信息

![webpage](images/02-jobsmanager.png?width=60pc)

* 构建输出页面: 用于查看项目的构建详情，能够看到项目的构建过程及详细日志。

![webpage](images/03-buildinput.png?width=60pc)

---
