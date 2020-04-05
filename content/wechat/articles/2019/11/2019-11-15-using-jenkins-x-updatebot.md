---
title: "了解如何使用 Jenkins-X UpdateBot"
description: "了解如何使用 Jenkins-X UpdateBot 自动执行对依赖版本的更新。"
date: 2019-11-15
original: "https://dzone.com/articles/using-jenkins-x-updatebot"
tags:
- Jenkins-X
- UpdateBot
keywords:
- Jenkins-X
- UpdateBot
- 自动执行依赖版本更新
author: Ryan Dawson
translator: wenjunzhangp
poster: "cover.jpg"
---

![cover](cover.jpg)

[Jenkins-X UpdateBot](https://github.com/jenkins-x/updatebot) 是用于在项目源代码中自动更新依赖项版本的工具。假设您正在构建两个项目 A 和 B，B 使用 A 作为依赖项。A 的发布过程可以使用 UpdateBot 更新项目 B 的源，以使用 A 的新版本。在 pull request 中使用 UpdateBot，可以测试和检查更改或自动合并更改。

在 [Jenkins-X platform](https://jenkins-x.io/about/) 中，`UpdateBot` 由 Jenkinsfile 中的 `UpdateBot` 命令自动显示和调用。但是 UpdateBot 也可以在 Jenkins-X 之外使用，并且单独运行它可以帮助了解它可以做什么并测试版本替换。因此，让我们用一个简单的测试项目来尝试一下。

## 配置演示

UpdateBot 可以为各种不同的[文件类型设置版本](https://github.com/jenkins-x/updatebot/blob/a08fdec38654a96f8bc5785b59b086193e861911/updatebot-core/src/main/java/io/jenkins/updatebot/kind/Kind.java#L30)-我们不会在这里对它们进行全部测试，但是我们希望一个项目具有多个功能。因此，我们可以使用 [JHipster sample app](https://github.com/ryandawsonuk/jhipster-sample-app) 示例应用程序，因为它具有 Maven [pom.xml](https://github.com/ryandawsonuk/jhipster-sample-app/blob/master/pom.xml)，npm [package.json](https://github.com/ryandawsonuk/jhipster-sample-app/blob/master/package.json) 和 [Dockerfile](https://github.com/ryandawsonuk/jhipster-sample-app/blob/master/Dockerfile)。我们将对其运行 UpdateBot，以查看 UpdateBot 可以替换这些资源文件中哪些内容。

我们可以下载 [UpdateBot jar file](https://mvnrepository.com/artifact/io.jenkins.updatebot/updatebot/1.1.31)（v1.1.31），并为要更新的项目设置指向 GitHub 存储库的简单 UpdateBot 配置文件：
```
github:
  organisations:
  - name: ryandawsonuk
    repositories:
    - name: jhipster-sample-app
      useSinglePullRequest: true
```
`useSinglePullRequest` 标记意味着将创建一个包含我们所做的所有更改的 PR。但是我们实际上并不会进行任何更改-我们将在本地运行它，这样我们就不需要 GitHub 对存储库的写权限。通过设置[环境变量](https://github.com/jenkins-x/updatebot/blob/a08fdec38654a96f8bc5785b59b086193e861911/updatebot-core/src/main/java/io/jenkins/updatebot/EnvironmentVariables.java#L20)，我们可以在不推送到 GitHub 的情况下运行：
```
export UPDATEBOT_DRY_RUN=true
```
然后，我们仍然需要使用 `UPDATEBOT_GITHUB_USER` 和 `UPDATEBOT_GITHUB_PASSWORD`（[Token](https://github.com/jenkins-x/updatebot/blob/a08fdec38654a96f8bc5785b59b086193e861911/updatebot-core/src/main/java/io/jenkins/updatebot/EnvironmentVariables.java#L26)）的其他环境变量设置 git 凭据。

然后，我们可以运行一些 `UpdateBot` 命令，并查看从 Git 克隆的项目中替换了什么。为此，我们可以在 GitHub 上使用一个包含[预配置脚本](https://github.com/ryandawsonuk/usingupdatebot/blob/master/updatebot-dryrun.sh)的[演示项目](https://github.com/ryandawsonuk/usingupdatebot)。

## 运行演示

首先，脚本更新了 maven pom.xml，要求更改 Spring Boot 版本：
```
java -jar updatebot-1.1.31.jar push-version --kind maven org.springframework.boot:spring-boot-starter-data-jpa 2.1.0.RELEASE
```

然后检查更改并输出 git diff，我们可以看到以下结果：
![screen-shot-2018-11-07-at-091421](screen-shot-2018-11-07-at-091421.png)

因此版本被替换了。请注意，在依赖项引用的属性中将其替换，在这种情况下，pom.xml 在属性中具有此版本。UpdateBot 还可以用于直接在依赖项或[父项](https://github.com/jenkins-x/updatebot/blob/a08fdec38654a96f8bc5785b59b086193e861911/updatebot-core/src/main/java/io/jenkins/updatebot/kind/maven/PomHelper.java#L91)或[插件](https://github.com/jenkins-x/updatebot/blob/a08fdec38654a96f8bc5785b59b086193e861911/updatebot-core/src/main/java/io/jenkins/updatebot/kind/maven/PomHelper.java#L119)中进行的更改。

对 package.json 的更改是将 ngx-cookie 版本更改为 2.0.2：
```
java -jar updatebot-1.1.31.jar push-version --kind npm ngx-cookie 2.0.2
```

这正是我们所期望的：
![screen-shot-2018-11-06-at-192924](screen-shot-2018-11-06-at-192924.png)

对 Dockerfile 的更改是将 openjdk 版本/标签更改为 jdk8：
```
java -jar updatebot-1.1.31.jar push-version --kind docker openjdk 8-jdk
```

这表明我们可以抓取出来。Dockerfile 实际上使用两个不同的 openjdk 镜像，每个镜像都有一个不同的标签，并且此命令将替换这两个镜像：
![screen-shot-2018-11-06-at-193341](screen-shot-2018-11-06-at-193341.png)

我在运行命令之前没有考虑过这一点，因此在这里我需要确定我真正要替换的内容。

## 实际运行

如果我们在没有 dry-run 标记的情况下运行，则将创建一个真实的 pull request，前提是我们有权创建它。

![screen-shot-2018-11-06-at-193558-58](screen-shot-2018-11-06-at-193558-58.gif)

UpdateBot 具有自动合并 pull request 的功能，例如通过轮询 GitHub 来检查 PR 状态并合并是否一切正常（命令为`updatebot update-loop`）。但是，GitHub 确实对这些请求进行了速率限制，因此 UpdateBot 也可以将其[批准添加到 PR ](https://github.com/jenkins-x/updatebot/blob/a08fdec38654a96f8bc5785b59b086193e861911/updatebot-core/src/main/java/io/jenkins/updatebot/Configuration.java#L96)中，以使其通过与 GitHub 直接集成的工具进行合并。当使用诸如 [prow](https://github.com/kubernetes/test-infra/tree/master/prow) 或 [mergify](https://mergify.io/) 之类的工具进行自动合并时，这可能会很好地工作。

UpdateBot 可以尝试仅通过使用 `updatebot push` 而不是带有显式参数的 `updatebot push-version` 来推断要作为提交触发管道的一部分进行的更改。但是，通常管道作业将有权访问要推送的版本，而 `push version` 使更改更明确且更易于跟踪。

本示例使用单个 UpdateBot YAML 文件将一组依赖项/版本推送到一个下游项目。YAML 文件还支持将一组更改推送到多个[下游存储库](https://github.com/jenkins-x/jenkins-x-platform/commit/196ef005ff026cbd9be8fd505945bbbc5b71da67)。UpdateBot 推送其能够进行的所有替换，以便每个下游存储库都获得适用于它的所有更改。

例如，在[构建没有快照的 Maven 项目](https://redstack.wordpress.com/2014/07/14/continuous-integration-without-snapshots/)时，[UpdateBot 可用于在 CI/CD 设置中传播版本](https://community.alfresco.com/community/bpm/blog/2018/11/05/activiti-cloud-cicd-approach-for-java-libraries-and-beyond)。但是，正如我们已经看到的那样，它不仅限于 Maven，而且可以对产生各种不同类型制品的项目进行一系列更改。