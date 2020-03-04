---
title: "分支策略"
description: "推荐使用的分支策略"
date: 2019-07-09T19:56:04+08:00
draft: false
toc: true
author: donhui
---

本文讨论分支策略主要是提供执行并行任务时的参考指引，方便社区贡献者借鉴使用。

需要理解和注意以下几点：
- 三个代码仓库
- 每个任务一个分支
- 分支策略

## 三个 repo
git 是一个分布式版本管理系统。以提交文章到 [jenkins-infra/wechat](https://github.com/jenkins-infra/wechat) 为例，在这个过程中，我们会涉及到三个代码仓库：

1. jenkins-infra/wechat repo，也就是 upstream repo，你需要 `git remote add upstream` 将其配置为 upstream repo
2. fork/wechat repo，如果你从这里 clone 的话，也就是对应的 origin repo
3. local repo，所有的分支管理都是从这里发起的

## 每个任务一个分支
每个任务一个分支的目的是，保证在 PR review/merge 的时候不会发生冲突。
换言之，PR review/merge 不存在先后关系，可以独立进行。
对于原创文章或翻译文章，每篇文章（包括资源文件）是一个独立的任务，每个任务对应一个分支。

## 分支策略

假设已经完成 PR 提交操作（`jenkins-infra/wechat:master <- fork/wechat:dev-01`），下面是可能存在的相关分支。

```
jenkins-infra/wechat:    master
fork/wechat:             master    dev-01
local:                   master    dev-01
```

这里的故事可以分为以下几步：

1. 在 Github UI 上完成 fork 操作，所以，`jenkins-infra/wechat:master` 对应到 `fork/wechat:master`
2. `git clone` 到本地，所以 `fork/wechat:master` 对应到 `local:master`
3. 在本地创建 `dev-01` 分支
4. 提交 commit，并 push 到 `fork/wechat:dev-01`
5. GitHub UI 发起 PR （`jenkins-infra/wechat:master <- fork/wechat:dev-01`）

这里需要注意的是，`jenkins-infra/wechat:master` 和 `fork/wechat:master` 经常会
不一致（`jenkins-infra/wechat:master` 是 source of truth ，会有很多 merge 来的 commits），
这并没有什么大的影响。

有了上面的认识，下面就是一步一步的命令行，假设上面的 `dev-01` 已经被合并，需要新建 `dev-02` 分支执行新的任务：

1. `git checkout master`
2. `git pull upstream master --rebase`
3. `git checkout -b dev-02`
3. (do something)
4. `git add . && git commit -m 'do something'`
5. `git push origin dev-02` # origin is your fork
6. via Github UI (`jenkins-infra/wechat:master <- fork/wechat:dev-02`)
