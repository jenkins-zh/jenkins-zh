---
title: 开源软件供应链点亮计划 - 暑期2021
description: 通过 CLI 对 Jenkins 实现安全升级
---

## 项目标题
通过 CLI 对 Jenkins 实现安全升级

## 项目难度
中

## 技能要求

* Golang
* Java
* Jenkins
* RESTful

## 背景

Jenkins 有 1500+ 由社区提供的[插件](http://plugins.jenkins.io/)，利用这些插件，几乎可以完成任何你想完成的任务。但是，在这众多的插件中，并没有非常严格的标准，因此，用户有可能会使用到部分对兼容性、安全性等方面表现不是很好的插件。那么，升级 Jenkins 或者插件将会是一件非常繁琐、甚至容易出问题的操作。

[Jenkins CLI](https://github.com/jenkins-zh/jenkins-cli) 是用 Golang 实现的，目前可以实现对 Jenkins 的大部分操作，部分非核心功能是[通过插件实现](https://github.com/jenkins-zh/jcli-plugins)。

## 概述

当用户执行升级操作时，命令行（CLI）给出一个升级向导，通过询问用户的方式进行交互式地升级：

* 是否希望升级 Jenkins，以及希望升级到哪个版本
  * 给出可以升级的版本列表，并给出相关的安全、稳定性、更新日期等信息
* 是否希望升级插件
  * 根据官方社区公布的安全漏洞，给出建议升级的插件列表以及目标版本
  * 用户可以看到插件的当前维护信息，例如：star、watch、安装量、最新发布日期等
* 启动临时升级环境
  * 安装目标版本的 Jenkins 以及插件
* 对临时环境的 Jenkins 执行兼容性测试
  * 针对不同的插件执行不同的 API 测试
  * 给出一个非常容易扩展的方式来对不同插件的兼容性测试进行补充
* 输出兼容性测试报告
* 提示用户是否要进行备份
* 提示用户是否要进行升级

## 快速上手

你可以通过[新人友好的 issues](https://github.com/jenkins-zh/jenkins-cli/issues?q=is%3Aissue+is%3Aopen+label%3Anewbie) 快速了解 [Jenkins CLI](https://github.com/jenkins-zh/jenkins-cli).

另外，该项目中也许会需要开发（或维护）一个 Jenkins 插件，你可以参考[官方插件教程](https://www.jenkins.io/doc/developer/)，以及由 Jenkins 中文社区给出的[中文视频教程](https://www.bilibili.com/video/BV1fp4y1r7Dd)。

关于 Jenkins 备份、恢复，你也可以参考[一些已有的插件](https://github.com/jenkinsci/?q=backup&type=&language=&sort=)。

## 社区联系人

* 开源软件供应链点亮计划，社区管理员，[史彦军](https://github.com/yJunS)
* 导师，[Rick](https://github.com/LinuxSuRen/)

## 相关代码仓库
* https://github.com/jenkins-zh/jenkins-cli
* https://github.com/jenkinsci/pipeline-restful-api-plugin

