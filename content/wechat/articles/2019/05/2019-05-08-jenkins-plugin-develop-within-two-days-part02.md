---
title: "Jenkins 插件开发之旅：两天内从 idea 到发布(下篇)"
description: "两天内，从产生 idea 到编写插件，最后发布到 Jenkins 插件更新中心"
date: 2019-05-08
toc: true
tags:
- jenkins
- maven
- jira
author: donhui
poster: "./2019-05-08-jenkins-plugin-develop-within-two-days-part02/sunset.png"
---

![江边落日](sunset.png)

本文分上下两篇，上篇介绍了从产生 idea 到插件开发完成的过程；
下篇将介绍将插件托管到 Jenkins 插件更新中心的一系列过程。

## 托管插件
托管插件包括一系列流程步骤。
笔者完成了它所有步骤（包括非必须的步骤），其中主要有两个具有标志性的任务：
- 插件代码被托管在 jenkinsci GitHub 组织的一个仓库，然后作者拥有它的管理权限。  
  笔者插件的代码仓库为：[jenkinsci/maven-snapshot-check-plugin](https://github.com/jenkinsci/maven-snapshot-check-plugin) 。
- 你可以将插件发布到 Jenkins 项目的 Maven 仓库，它是 Jenkins 项目所使用的更新站点的数据来源。

### 准备工作
在请求插件托管之前，需要完成以下几个步骤。

#### 查找类似的插件
Jenkins 社区欢迎任何人的贡献，但为了让 Jenkins 用户受益，
它要求查找解决相同或类似问题的插件，看看是否可以与现有的维护人员联手。
可以在 https://plugins.jenkins.io 查看所有的插件，
以确认是否已有类似的插件实现了你计划实现的功能。
笔者在之前已进行过查找，并没有找到可以实现笔者计划实现的功能的类似插件。

#### 命名规约
Jenkins 制定了一些与插件相关的命名规约。
插件开发者要确保遵循这些命名规约。

##### artifactId
插件的 artifactId 被用于文件基本名称，是 Jenkins 插件和更新站点的唯一标识。  
它需要遵循一些发布规约：
- 使用小写 ID ，并根据需要使用连字符分隔术语。
- 除非名称有任何意义，否则不要在 ID 中包含 jenkins 或 plugin 。

##### 插件名称
插件的名称在 Jenkins UI 和其它地方（如：插件站点）展示给用户。  
如果可以，建议使用简短的描述性名称，如 *Subversion* 。  
笔者所写的插件的名称为：*Maven SNAPSHOT Check* 。

##### groupId
推荐使用 `io.jenkins.plugins` 或 `org.jenkins-ci.plugins` 作为 groupId 。
但是不禁止其他组织 ID ，除非它们是恶意的（例如引用与你没有关系的组织）。
笔者所写的插件使用的 groupId 为: `org.jenkins-ci.plugins` 。

##### Java 源代码
Jenkins 项目一般遵循 [Oracle Java 代码规约](https://jenkins.io/doc/developer/publishing/style-guides/www.oracle.com/technetwork/java/codeconvtoc-136057.html)，
但是并没有很好的强制甚至在核心组件中。
个别的插件维护者有时会选择使用不同的风格指南作为插件。
笔者日常使用 IDEA 进行开发，之前安装了「阿里 Java 规约插件」，
因而使用它作为编码规约。

##### 提交消息
Git 提交消息应该从引用与之相关的 JIRA 问题开始（如果适用），
然后在第一行进行简短的总结，并在随后的行中提供更多详细信息。例如：
```
[JENKINS-00000] Frobnicate the widget
```

如果给定的提交修复了指定的问题，
那么使用以下前缀中的任何一个将会自动化解决相关的 JIRA 问题。
```
[FIX JENKINS-00000] Frobnicate the widget
[FIXED JENKINS-00000] Frobnicate the widget
[FIXES JENKINS-00000] Frobnicate the widget
```

由于还没过将插件托管，笔者并没有遵循该规约，
等插件发布后，笔者将考虑遵循该规约。

####  License
Jenkins 项目分发的所有插件都需要是免费的开源软件。
这适用于插件源代码及其所有依赖项。
要确保在 `pom.xml` 文件和仓库中的 `LICENSE` 文件指定协议。
官方建议使用 MIT license ，它用于 Jenkins 核心和大多数插件和库，
但是任何 OSI 批准的开源 license 都可以。
笔者这里使用了 MIT license 。

#### 要求注册的账号
通过 Jenkins 项目更新站点分发的插件需要托管在 [jenkinsci GitHub 组织](https://github.com/jenkinsci)中，
因此需要在 GitHub 上有一个账号，并且需要有一个公共仓库来存放插件源代码。

为了完整地发布你的插件，需要注册一个 [Jenkins 社区帐号](https://accounts.jenkins.io/)，
它可以让你访问 [JIRA](https://issues.jenkins-ci.org/)，[wiki](https://wiki.jenkins-ci.org/) 和 [Maven 仓库](https://repo.jenkins-ci.org/) 。

### 发起托管请求
>注意：Jenkins 官方自动化流程使用更容易实现的 fork + 删除的方式（见下文），而不是转移仓库所有者。

登录到 [JIRA](https://issues.jenkins-ci.org/) 然后在 [HOSTING](https://issues.jenkins-ci.org/browse/HOSTING) 项目创建一个问题。
请确保按照描述填写所有字段。
Jenkins 项目成员将在几天内审查你的请求。
如果审查人员要求你更改，那么请按照要求进行更改。

笔者提交的申请为：[HOSTING-750](https://issues.jenkins-ci.org/browse/HOSTING-750)，
比较幸运的是当天凌晨（北京时间）笔者的请求就被审查，
正巧那时笔者未眠，于是随后按要求进行了更改并在不久后该申请被审批通过。

一旦满足了所有的需求，你的仓库将被 fork 到 jenkinsci 组织中，
并且你将被邀请加入该组织，并且将为你在 JENKINS 项目中创建 JIRA 组件。

此时，将要求你删除 Jenkins 从中 fork 的仓库。
之后你可以通过再次从 `jenkinsci` 那里 fork 来重新创建它。
这将确保 `jenkinsci` 仓库是 Github 上网络图的根。
这意味着：
- 不会混淆哪个仓库是权威仓库。
- 即使在 GitHub 上没有大量的关注者，[源代码搜索](https://help.github.com/articles/searching-in-forks/)也会成功。
- 其他人更可能在 `jenkinsci` 仓库中提交 pull request（这是协作的理想选择）。


### 创建 wiki 页面
尽管这对发布插件来说这不是严格要求的，但最好为插件创建一个 wiki 页面来存储文档。关于如何执行此操作的详细信息，请参阅[插件 wiki 页面指南](https://jenkins.io/doc/developer/publishing/wiki-page)。

笔者所写的插件的 wiki 页面为：[Maven SNAPSHOT Check Plugin](https://wiki.jenkins.io/display/JENKINS/Maven+SNAPSHOT+Check+Plugin) 。
其间除了官方文档，笔者还参考了其它插件 wiki 页面的排版。

### 开启 CI 构建
Jenkins 项目托管了一个 Jenkins 实例来执行插件的持续集成构建。
官方推荐通过在插件的 Github 仓库根目录创建一个 Jenkinsfile，
为在 Jenkinsci Github 组织中的插件设置 CI 构建。
典型的插件构建（ Maven 或 Gradle ）只需在 Jenkinsfile 中包含以下语句即可运行：
```
buildPlugin()
```

### 申请上传权限
在源代码被 fork 到 `jenkinsci` 组织后，需要提交一个上传权限请求。
按照 [jenkins-infra/repository-permissions-updater/](https://github.com/jenkins-infra/repository-permissions-updater/) 仓库的 README 文件中所说的来做就可以。

Jenkins 项目在 [Artifactory](https://repo.jenkins-ci.org/) 上托管 Maven 制品，例如核心和插件发布。
它的权限系统与 Github 是独立的，
限制了那些用户（由 Jenkins LDAP 帐户标识，与 wiki 和 JIRA 一样）可以上传。
这个仓库包含 YAML 格式的 Artifactory 上传权限定义，
以及将它们同步到 Artifactory 的工具。
> 先决条件：在申请权限之前，需要先用 Jenkins 社区帐号登录一次  [Artifactory](https://repo.jenkins-ci.org/) 。

要请求对制品（通常是插件）的上传权限，需要提交一个 PR ，
该 PR 需要创建与申请上传权限相关的 YAML 文件。
笔者所提交的 PR 为：[Plugin: Permission for maven-snapshot-check-plugin](https://github.com/jenkins-infra/repository-permissions-updater/pull/1107) 。

通过查看它可以看出该 PR 增加了一个文件：permissions/plugin-maven-snapshot-check.yml ，其内容如下：
```yaml
name: "maven-snapshot-check"
github: "jenkinsci/maven-snapshot-check-plugin"
paths:
- "org/jenkins-ci/plugins/maven-snapshot-check"
developers:
- "donhui"
```

在创建 PR 后，会有帮助说明以及 checklist 让提交人对该 PR 进行检查确认。  
等这个 PR 被审批后，插件开发者就会拥有该插件的发布权限。

### 发布插件

#### 前提
要先确认拥有发布该插件的权限。

#### Maven 要使用的 Artifactory 凭据
需要告诉 Maven 访问 Artifactory 的凭据。
登录 Artifactory ，从用户 profile 中获取`加密的密码`。
在 ` ~/.m2/settings.xml` 文件配置 server 认证信息，如下所示：
```xml
<settings xmlns="https://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="https://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">

  <servers>
    <server>
      <id>maven.jenkins-ci.org</id> 
      <username>your_user_name_here</username>
      <password>your_encrypted_password_here</password>
    </server>
  </servers>

</settings>
```

#### 配置 GitHub 以接受你的 SSH key
当执行 release 时，Maven Release Plugin 会自动往仓库推送代码，
所以需要[配置 GitHub 以接受你的 SSH key](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) 。

更多信息可以参考：[GitHub help on SSH](https://help.github.com/articles/connecting-to-github-with-ssh/) 。

#### 执行发布
当 GitHub 和 Maven 凭据配置好后，
执行一次发布应该很简单，只需要运行下面的命令：
```
mvn release:prepare release:perform
```

可能在执行发布时会遇到 "401 Unauthorized" 或 "403 Forbidden" 之类问题，
这一般是 settings.xml 配置问题或是没有上传权限。
一些公共的问题处理方案可以查看：[HostingPlugins-Workingaroundcommonissues](https://wiki.jenkins.io/display/JENKINS/Hosting+Plugins#HostingPlugins-Workingaroundcommonissues)。

插件发布后，8 小时内，将可以在插件更新中心看到它。

笔者所写的 maven-snapshot-check 插件，
在插件列表页的地址为：[https://plugins.jenkins.io/maven-snapshot-check](https://plugins.jenkins.io/maven-snapshot-check) 。

Jenkins 实例的插件管理页面的「可选插件」选项截图如下：
![maven-snapshot-check-available](maven-snapshot-check-available.png)

### 为插件分类
在 Jenkins [插件列表页面](https://plugins.jenkins.io/)，可以对插件进行分类显示。

要为插件添加一个分类，需要向 [jenkins-infra/update-center2](https://github.com/jenkins-infra/update-center2) 仓库提交一个 PR 。
笔者所提交的 PR 为：[add maven-snapshot-check category](https://github.com/jenkins-infra/update-center2/pull/271) 。

通过查看它可以看出该 PR 在 `src/main/resources/label-definitions.properties` 文件增加了一行，如下所示：
```
maven-snapshot-check=builder
```

## 总结
两天的 Jenkins 插件开发之旅（尤其是 04.24 晚上花了很多时间），
让笔者了解了插件开发的基本知识，并在托管插件的过程中学到一些知识。
然后在周末花了几个小时总结回顾，并将它写成文档。
同时也希望此文能给 Jenkins 插件开发者入门带来一点帮助！

## 参考
- [Guide to Plugin Hosting](https://jenkins.io/doc/developer/publishing/requesting-hosting/)
- [Performing a Plugin Release](https://jenkins.io/doc/developer/publishing/releasing/)
