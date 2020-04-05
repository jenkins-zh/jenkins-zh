---
title: "多分支流水线任务对 GitLab SCM 的支持"
description: "本文介绍了多分支流水线任务对 GitLab SCM 的支持"
date: 2019-07-04
tags:
- gitlab
- plugins
- pipeline
- credentials
- developer
- gsoc
- gsoc2019
keywords:
- Jenkins 多分支流水线
- Jenkins
author:   baymac
original: https://jenkins.io/blog/2019/06/29/phase-1-multibranch-pipeline-support-for-gitlab/
translator: donhui
toc: true
poster: "./2019-07-10-phase-1-multibranch-pipeline-support-for-gitlab/tea.jpg"
---

![tea](tea.jpg)

这是在 GSoC 2019中的一个 Jenkins 项目。
我们正致力于增加[多分支流水线任务和文件夹组织对 GitLab ](https://jenkins.io/projects/gsoc/2019/gitlab-support-for-multibranch-pipeline/)的支持。
这个计划是创建以下插件：
* [GitLab API 插件](https://github.com/jenkinsci/gitlab-api-plugin) - 包装 GitLab Java APIs。
* [GitLab 分支源插件](https://github.com/baymac/gitlab-branch-source-plugin) - 包括两个包：
    * `io.jenkins.plugins.gitlabserverconfig` - 管理服务器配置和 Web hooks 管理。理想情况下应该在另一个名为 `GitLab Plugin` 的插件中。
未来，这个包应该移动到新的插件中。
    * `io.jenkins.plugins.gitlabbranchsource` - 为多分支流水线任务（包括 Merge Requests ）和文件夹组织添加 GitLab 分支源。

## 现状

* 完全支持自由风格的任务和流水线（单分支）任务。
* 部分支持多分支流水线任务（没有 MRS 检测）。
* 不支持 Gitlab 文件夹组织。

## 这个项目的目标

* 实现一个依赖于 Gitlab API 插件的轻量级 Gitlab 插件。
* 遵循3个独立插件的约定，即 `GitLab 插件`，`GitLab API 插件`，`GitLab 分支源插件`。
* 实现 Gitlab 分支源插件，支持多分支管道作业。
* 支持新的 Jenkins 特性，例如
[Jenkins 代码即配置](https://github.com/jenkinsci/configuration-as-code-plugin) (JCasC)，
[增量式工具](https://github.com/jenkinsci/incrementals-tools/)。
* 清晰高效的设计。
* 支持新的 SCM 特性 APIs。
* 支持 Java 8 及更高版本。

## 构建插件

这个插件还没有二进制文件可用，因为这个插件还处于非常早期的 alpha 阶段，还没有为公众准备好。
如果您想尽早介入，可以尝试自己从源代码构建它。

### 安装：

* 将源代码签出到您的本地机器上：
```bash
git clone https://github.com/baymac/gitlab-branch-source-plugin.git
cd gitlab-branch-source-plugin
```

* 安装插件：
```bash
mvn clean install 
mvn clean install -DskipTests # to skip tests
```

* 运行插件：
```bash
mvn hpi:run # runs a Jenkins instance at localhost:8080
mvn hpi:run -Djetty.port=<port> # to run on your desired port number 
```

如果您想用 Jenkins 服务器测试它，`mvn clean install` 之后在你的 Jenkins 实例中遵循以下步骤：
1. 选择 `系统管理`
2. 选择 `插件管理`
3. 选择 `高级` 选项卡
4. 在 `上传插件` 部分，选择 `选择文件`
5. 选择 `$<root_dir>/target/gitlab-branch-source.hpi`
6. 选择 `上传`
7. 选择 `安装（无需重启）`
    
## 使用

假设插件安装已经完成。

### 在 Jenkins 上设置 Gitlab 服务器配置

1. 在 jenkins 上，选择 `系统管理`
2. 选择 `系统设置`
3. 向下滚动找到 `GitLab` 部分
   
   ![gitlab-section](gitlab-section.png)
4. 选择 `Add GitLab Server` | 选择 `GitLab Server`
5. 现在您将看到 GitLab 服务器配置选项。
    
    ![gitlab-server](gitlab-server.png)

    需要配置的字段有4个：  
    * `Name` - 插件自动为您生成唯一的服务器名称。用户可能希望配置此字段以满足其需要，但应确保它足够唯一。我们建议保持原样。
    * `Server URL` - 包含指向 Gitlab 服务器的 URL 。默认设置为 "https://gitlab.com" 。用户可以修改它以输入其 Gitlab 服务器 URL ，例如 https://gitlab.gnome.org/、http://gitlab.example.com:7990 等等。
    * `Credentials` - 包含类型为 GitLab Personal Access Token 的凭据条目列表。当没有添加凭证时，它显示 "-none-" 。用户可以通过单击 "Add" 按钮添加凭证。
    * `Web Hook` - 此字段是一个复选框。如果希望插件在与 Gitlab 项目相关的任务上设置 Webhook ，请选中此框。该插件监听相关 Gitlab 项目的 URL ，当 Gitlab 服务器中发生事件时，服务器将向设置 Web Hook 的 URL 发送事件触发器。如果您希望在 Gitlab 项目上持续集成（或持续交付），那么您可能希望自动设置它。  
6. 添加一个 Personal Access Token 凭据(自动生成 Personal Access Token 请参考[下一个部分](#在-jenkins-内创建个人访问令牌)):
    * 用户需要添加一个 `GitLab Personal Access Token` 类型凭证条目用来安全地将 token 保存在 Jenkins 内部。
        * 在你的 GitLab 服务器生成一个 `Personal Access Token`
            * 从右上角选择配置文件下拉菜单
            * 选择 `Settings`
            * 从左侧菜单选择 `Access Token`
            * 输入一个名称 | 将 Scope 设置为 `api`，`read_user`，`read_repository`
            * 选择 `Create Personal Access Token`
            * 复制生成的 token
        * 返回 Jenkins | 在凭据字段中选择 `Add` | 选择 `Jenkins`
        * 设置 `Kind` 为 GitLab Personal Access Token
        * 输入 `Token`
        * 在 `ID` 处输入唯一的 id
        * 输入人类可读的描述
        * 选择 `Add`
            
            ![gitlab-credentials](gitlab-credentials.png)
7. 测试连接：
    * 在 `Credentials` 下拉列表选择你需要的 token
    * 选择 `Test Connection`
    * 它应该会返回 `Credentials verified for user <username>`
8. 选择 `Apply`（在底部）
9. GitLab 服务器现在在 Jenkins 设置好了

### 在 Jenkins 内创建个人访问令牌

或者，用户可以在 Jenkins 内部生成 Gitlab 个人访问令牌，并自动添加 Gitlab 个人访问令牌凭据到 Jenkins 服务器凭据。
1. 在 `GitLab` 部分的底部选择 `Advanced`
2. 选择 `Manage Additional GitLab Actions`
3. 选择 `Convert login and password to token`
4. 设置 `GitLab Server URL`
5. 有两个选项来生成令牌：
   * `From credentials` - 要选择已在的持久存储的用户名密码凭据，或添加用户名密码凭据来持久存储它。
   * `From login and password` - 如果这是一次性的，那么您可以直接在文本框中输入凭据，并且用户名/密码凭据不会持久化。
   
6. 设置完你的用户名密码凭据后，选择 `Create token credentials`.
7. token 创建器将在 GitLab 服务器中为具有所需范围的给定用户创建个人访问令牌，并为 Jenkins 服务器中的相同用户创建凭据。
您可以返回 GitLab 服务器配置来选择生成的新凭证(首先选择 "-none-" ，然后将出现新的凭证)。出于安全原因，此令牌不显示为纯文本，而是返回一个 `id` 。
它是一个128位长的 UUID-4字符串(36个字符)。
    
    ![gitlab-token-creator](gitlab-token-creator.png)
   
### 配置即代码

没有必要在UI中浪费时间。 `Jenkins 配置即代码 (JCasC)` 或者简单地 `配置即代码` 插件允许你通过一个 `yaml` 文件配置 Jenkins。
如果你是新用户，你可以在[这里](https://github.com/jenkinsci/configuration-as-code-plugin)了解更多关于 JCasC 的信息.

#### 添加配置 YAML：

这里有多种方式配置 JCasC yaml 文件来配置 Jenkins：
* JCasC 默认情况下在 `$JENKINS_ROOT` 搜索一个名为 `jenkins.yaml` 的文件。
* JCasC 寻找一个环境变量 `CASC_JENKINS_CONFIG` ，其中包含配置 `yaml` 文件的路径。
    * 一个包含一组配置文件的文件夹的路径，例如： `/var/jenkins_home/casc_configs`。
    * 单个文件的完整路径，例如： `/var/jenkins_home/casc_configs/jenkins.yaml`。
    * 一个指向 web 上提供的文件的 URL ，例如： `https://<your-domain>/jenkins.yaml`。
* 您还可以在 UI 中设置配置的 yaml 路径。转到 `<your-jenkins-domain>/configuration-as-code`。
输入 `jenkins.yaml` 的路径或 URL 并选择 `Apply New Configuration`。

一个通过 `jenkins.yaml` 配置 GitLab 服务器的例子:
```yaml
credentials:
  system:
    domainCredentials:
      - credentials:
          - gitlabPersonalAccessToken:
              scope: SYSTEM
              id: "i<3GitLab"
              token: "XfsqZvVtAx5YCph5bq3r" # gitlab personal access token
unclassified:
  gitLabServers:
    servers:
      - credentialsId: "i<3GitLab"
        manageHooks: true
        name: "gitlab.com"
        serverUrl: "https://gitlab.com"
```

要获得更好的安全性，请参阅 JCasC 文档中的处理 secrets [部分](https://github.com/jenkinsci/configuration-as-code-plugin#handling-secrets)。

## 未来工作范围

GSoC 的第二阶段将用于开发 Gitlab 分支源插件。新功能正在开发中，但代码库不稳定，需要大量的错误修复。
一些功能（如多分支流水线任务）工作正常。在第二阶段结束时会有更多关于它的信息。

## 问题跟踪

这个项目使用 Jenkins [JIRA](https://issues.jenkins-ci.org/) 来跟踪问题。你可以在 `gitlab-branch-source-plugin` 模块提交问题。

## 致谢

这个插件是由 Google 编程夏令营 (GSoC)团队为 [GitLab 支持多分支流水线](https://jenkins.io/projects/gsoc/2019/gitlab-support-for-multibranch-pipeline/)而构建和维护的。
很多灵感来自于 `GitLab 插件`，`Gitea 插件` 及 `GitHub 插件`。

我们的团队成员：[baymac](https://www.github.com/baymac)，[LinuxSuRen](https://github.com/LinuxSuRen)，
[Marky](https://github.com/markyjackson-taulia)，[Joseph](https://github.com/casz)，
[Justin](https://github.com/justinharringa)，[Jeff](https://github.com/jeffpearce)。

来自其他人的支持：[Oleg](https://github.com/oleg-nenashev)，[Greg](https://github.com/gmessner)，[Owen](https://github.com/omehegan)。

也感谢整个 Jenkins 社区提供的专业技术和灵感。

## 链接

* [第一阶段示例](https://www.youtube.com/watch?v=ij6ByZqI67o)
* [演示幻灯片](https://drive.google.com/open?id=1c3UWwEb5rDmO6YEn5fU3qVbVW-opuUXb)
* [GitLab API 插件](https://github.com/jenkinsci/gitlab-api-plugin)
* [GitLab 分支源插件](https://github.com/baymac/gitlab-branch-source-plugin)
* [GitLab API 插件 Wiki](https://wiki.jenkins.io/display/JENKINS/GitLab+API+Plugin)
* [第一阶段的问题跟踪](https://issues.jenkins-ci.org/browse/JENKINS-57445)
* [博客](https://baymac.github.io)
