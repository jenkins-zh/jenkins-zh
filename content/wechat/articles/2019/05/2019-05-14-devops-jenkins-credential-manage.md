---
title: "基于 Jenkins 的 DevOps 平台应该如何设计凭证管理"
description: "一种基于 Jenkins 的 DevOps 平台建设思路"
date: 2019-05-14
toc: true
tags:
- jenkins
- devops
author: zacker330
poster: "./2019-05-14-devops-jenkins-credential-manage/devops-platform-lock-jenkins.png"
---

![](devops-platform-lock-jenkins.png)

### 背景
了解到行业内有些团队是基于 Jenkins 开发 DevOps 平台。而基于 Jenkins 实现的 DevOps 平台，就不得不考虑凭证的管理问题。

本文就此问题进行讨论，尝试找出相对合理的管理凭证的方案。

一开始我们想到的方案可能是这样的：用户在 DevOps 平台增加凭证后，DevOps 再将凭证同步到 Jenkins 上。Jenkins 任务在使用凭证时，使用的是存储在 Jenkins 上的凭证，而不是 DevOps 平台上的。

但是，仔细想想，这样做会存在以下问题：
* Jenkins 与 DevOps 平台之间的凭证数据会存在不一致问题。
* 存在一定的安全隐患。通过 Jenkins 脚本命令行很容易就把所有密码的明文拿到。哪天 Jenkins 被注入了，所有的凭证一下子就被扒走。
* 无法实现 Jenkins 高可用，因为凭证存在 Jenkins master 机器上。

那么，有没有更好的办法呢？

### 期望实现的目标
先定我们觉得更合理的目标，然后讨论如何实现。以下是笔者觉得合理的目标：
> 用户还是在 DevOps 管理自己的凭证。但是 DevOps 不需要将自己凭证同步到 Jenkins 上。Jenkins 任务在使用凭证时，从 DevOps 上取。

### 实现方式
Jenkins 有一个 [Credentials Binding Plugin]([https://jenkins.io/doc/pipeline/steps/credentials-binding/](https://jenkins.io/doc/pipeline/steps/credentials-binding/)
) 插件，在 Jenkins pipeline 中的用法如下：
```groovy
withCredentials([usernameColonPassword(credentialsId: 'mylogin', variable: 'USERPASS')]) {
    sh '''
      curl -u "$USERPASS" https://private.server/ > output
    '''
  }
```
`withCredentials` 方法做的事情就是从 Jenkins 的凭证列表中取出 id 为 mylogin 的凭证，并将值赋到变量名为 USERPASS 的变量中。接下来，你就可以在闭包中使用该变量了。

说到这里，不知道读者朋友是否已经有思路了？

思路就是实现一个和 Credentials Binding Plugin 插件类似功能的方法，比如叫 `zWithCredentials`（后文还会提到）。与 `withCredentials` 不同的是，`zWithCredentials` 根据凭证 id 获取凭证时，不是从 Jenkins 上获取，而是从 DevOps 平台获取。

### 会遇到的坑
#### 需要适配只认 Jenkins 凭证的插件
`withCredentials` 方法是将凭证的内容存到变量中，这可以满足一大部分场景。但是有一种场景是无法满足的。就是某些 Jenkins 插件的步骤接收参数时，参数值必须是 Jenkins 凭证管理系统中的 id。比如 git 步骤中 credentialsId 参数：
```groovy
git branch: 'master',
    credentialsId: '12345-1234-4696-af25-123455',
    url: 'ssh://git@bitbucket.org:company/repo.git'
```
这种情况，我们不可能修改现有的插件。因为那样做的成本太高了。

那怎么办呢？

笔者想到的办法是在 `zWithCredentials` 中做一些 hack 操作。也就是 `zWithCredentials` 除了从 DevOps 平台获取凭证，还在 Jenkins 中创建一个 Jenkins 凭证。在 Jenkins 任务执行完成后，再将这个临时凭证删除。这样就可以适配那些只认 Jenkins 凭证 id 的插件了。

#### 对凭证本身的加密
DevOps 平台在存储凭证、传输凭证给 Jenkins 时，都需要对凭证进行加密。至于使用何种加密方式，交给读者思考了。

### 小结
以上解决方案对 Jenkins 本身的改造几乎没有，我们只通过一个插件就解耦了 Jenkins 的凭证管理和 DevOps 平台的凭证管理。

思路已经有了。具体怎么实现，由于一些原因不能开源，虽然实现起来不算难。还请读者见谅。

最后，希望能和遇到同样问题的同学进行交流。看看是否还可以有更好的设计思路。
