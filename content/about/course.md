---
title: "Jenkins 培训"
description: "Jenkins 培训大纲"
type: slide
date: 2019-01-03T22:50:02+08:00
draft: false
toc: true
---

class: center, middle

# Jenkins 培训

---

# 大纲

* Jenkins 项目介绍
* 安装、部署
    * 传统环境
    * 容器环境
* 插件管理
* 构建任务
    * 流水线
    * 多分支流水线
    * API
* 计算节点管理
    * 静态
    * 动态

---

# 大纲

* 日志、任务外部存储
* 权限、认证体系
* 安全防护
* 备份、恢复
* 集成
* 社区介绍
    * Gitter && 邮件组
    * Meetup
    * 特别兴趣小组（SIG）
    * 基础设施

---

# 安装、部署

Jenkins 的版本分为长期支持版（LTS）和每周更新版。

* <a href="https://jenkins.io/zh/doc/book/installing/" target="_blank">安装手册</a>
* <a href="https://hub.docker.com/r/jenkins/jenkins/" target="_blank">Docker</a>

---

## 插件管理

* <a href="https://linuxsuren.github.io/blog/devops/jenkins/jenkins-plugin/" target="_blank">介绍</a>
* <a href="https://plugins.jenkins.io/" target="_blank">仓库</a>
* <a href="https://linuxsuren.github.io/blog/devops/jenkins/basic/jenkins-host/" target="_blank">托管</a>

---

## 计算节点管理

* <a href="https://linuxsuren.github.io/blog/devops/jenkins/basic/jenkins-agent/" target="_blank">节点类型</a>
    * 固定
    * 动态（虚拟机、Docker、Kubernetes）
* 通道
    * SSH
    * JNLP 
* <a href="https://linuxsuren.github.io/blog/devops/jenkins/basic/jenkins-label/" target="_blank">标签（label）</a>
    * 表达式

---

## 流水线（Pipeline）

Jenkins 流水线采用 Groovy 来编写，通常会保存在代码库根目录下名为 Jenkinsfile 的文件中。根据写法不同，分为：脚本式、申明式流水线。

快速入手，参考：

* 语法生成器
* 步骤列表
* 例子
* 复用
* IDE 插件

.left[.footnote[https://linuxsuren.github.io/blog/devops/jenkins/pipeline/]]

---

## 多分支流水线（Multi-branch Pipeline）

对于使用 Git 作为代码仓库的团队来说，Jenkins 的多分支流水线能够充分地利用 Git 的分支功能，简化重复的工作。简单来说，它可以根据既定的策略动态地创建、删除流水线。而对于部分 Git 服务，还能很好地支持 Pull Request 的流水线构建。

---

# API

Jenkins 的大部分操作支持通过 <a href="https://linuxsuren.github.io/blog/devops/jenkins/api/" target="_blank">HTTP API</a> 进行调用，可以返回 JSON、XML 的数据格式。

---
class: center, middle

# 社区介绍
Jenkins Community

---

## 沟通交流

推荐的交流途径包括：Gitter、Google 邮件组。不同的主题，会有不同频道、组。

* 普通用户（中文、英文）
* 开发者
* 特别兴趣小组

.left[.footnote[https://remarkjs.com]]

---

## Meetup

线上、线下交流活动。每年，在国内很多城市都组织一些线下交流活动。

* 北京
* 西安
* 上海
* 深圳

分享的主题通常包括：特性介绍、案例分享、工作坊等。

.left[.footnote[https://www.meetup.com/Beijing-Jenkins-Area-Meetup/]]

---

class: center, middle

# 特别兴趣小组

Jenkins Special Interest Groups

.left[.footnote[<a href="https://jenkins.io/zh/sigs/" target="_blank">SIGs</a>]]

???
here is the note

---

## 中文本地化

致力于改善 Jenkins 的中文用户的使用体验。涉及的范围包括： Jenkins 核心和插件以及官方网站。欢迎加入！

* 官网（Jenkins、JX）
* Jenkins 及其插件
* Jenkins 官方微信公众号
* 定期会议

.footnote[<a href="https://jenkins.io/zh/sigs/chinese-localization/" target="_blank">Chinese Localization</a>]

---

## 宣传与推广

---

## 平台
