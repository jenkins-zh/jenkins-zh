---
title: "GitHub App 身份验证支持已发布"
description: "GitHub App 身份验证支持已发布，本文教你简单使用以及一些注意事项"
date: 2020-06-17
original: "https://www.jenkins.io/blog/2020/04/16/github-app-authentication/#github-app-authentication-support-released"
tags:
- github
- authentication
author: Tim Jacomb
translator: wenjunzhangp
poster: "cover.jpg"
---

![cover](cover.jpg)

我很高兴的宣布在 Jenkins 中作为 GitHub 应用进行身份验证现已支持。这是许多用户期待已久的功能。它已在 [GitHub Branch Source 2.7.1](https://github.com/jenkinsci/github-branch-source-plugin/releases/tag/github-branch-source-2.7.1) 中发布，现在可以在 Jenkins 更新中心使用。

身份验证为 GitHub 应用带来了很多好处：

* `更高的请求频率限制` - GitHub 应用程序的速率限制随您的组织规模而定，而基于用户的令牌的限制为 5000，无论您拥有多少存储库。
* `与用户无关的身份验证` - 每个 GitHub 应用都有自己的用户独立身份验证。不再需要“机器人”用户或确定谁应该是 2FA 或 OAuth 令牌的所有者。
* `改进的安全性和更严格的权限` - 与服务用户及其个人访问令牌相比，GitHub Apps 提供了更精细的权限。这使 Jenkins GitHub 应用程序需要更少的权限集即可正常运行。
* `访问 GitHub Checks API` - GitHub Apps 可以访问 GitHub Checks API 以从 Jenkins 作业创建检查运行和检查套件，并提供有关提交和代码注释的详细反馈。

## 开始使用

安装 [GitHub Branch Source](https://plugins.jenkins.io/github-branch-source/) 插件，确保版本为 `2.7.1` 或更高。

## 配置 GitHub Organization 文件夹

遵循 [GitHub App Authentication setup guide](https://github.com/jenkinsci/github-branch-source-plugin/blob/master/docs/github-app.adoc)。这些说明也可在 GitHub 上的插件 README 文件中看到。

设置完成后，Jenkins 将验证您的凭据，并且您应该会看到新的速率限制。这是一个大型组织的示例：

![github-app-rate-limit](github-app-rate-limit.png)

## 如何在流水线中获取 API 令牌？

除了将 GitHub App 身份验证用于多分支流水线之外，您还可以直接在流水线中使用 app 身份验证。您只需照常加载“用户名/密码”凭据即可访问 GitHub API 的 Bearer 令牌，该插件将在后台处理 GitHub 的身份验证。

这可以用于从流水线中调用其他 GitHub API 端点，可能是 [deployments api](https://developer.github.com/v3/repos/deployments/)，或者您可能希望实现自己的 [checks api](https://developer.github.com/v3/checks/) 集成，直到 Jenkins 开箱即用为止。

注意：您获得的 API 令牌仅有效一小时，请勿在流水线开始时获得它，并假设它一直有效

`示例`：让我们通过流水线向 Jenkins 提交检查运行：

``` yaml
pipeline {
  agent any

  stages{
    stage('Check run') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'githubapp-jenkins',
                                          usernameVariable: 'GITHUB_APP',
                                          passwordVariable: 'GITHUB_JWT_TOKEN')]) {
            sh '''
            curl -H "Content-Type: application/json" \
                 -H "Accept: application/vnd.github.antiope-preview+json" \
                 -H "authorization: Bearer ${GITHUB_JWT_TOKEN}" \
                 -d '{ "name": "check_run", \
                       "head_sha": "'${GIT_COMMIT}'", \
                       "status": "in_progress", \
                       "external_id": "42", \
                       "started_at": "2020-03-05T11:14:52Z", \
                       "output": { "title": "Check run from Jenkins!", \
                                   "summary": "This is a check run which has been generated from Jenkins as GitHub App", \
                                   "text": "...and that is awesome"}}' https://api.github.com/repos/<org>/<repo>/check-runs
            '''
        }
      }
    }
  }
}
```

## 下一步打算

Jenkins 中的 GitHub Apps 身份验证是一个巨大的进步。许多团队已经开始使用它，并通过提供预发布反馈来帮助改进它。途中还有更多改进。

有一个拟议的 Google Summer of Code 项目：[GitHub Checks for Jenkins Plugins](https://www.jenkins.io/projects/gsoc/2020/project-ideas/github-checks/)。它将着眼于与 [Checks API](https://developer.github.com/v3/checks/) 集成，重点是将使用 [warnings-ng](https://plugins.jenkins.io/warnings-ng/) 插件直接发现的问题报告到 GitHub pull request 中，以及 GitHub 上的测试结果摘要。希望它将为 Jenkins 用户简化下面的 Pipeline 示例：）如果您想参与其中，请加入 [GSoC Gitter](https://gitter.im/jenkinsci/gsoc-sig) 渠道并询问如何提供帮助。