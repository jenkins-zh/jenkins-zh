---
type: tutorial
layout: list
---

# 介绍

本教程由 Jenkins 中文社区发起，并由每一位 Jenkins 的爱好者、用户或者开发者共同维护。

Jenkins 完全系列中文教程视频，正在火热🔥制作中。所有教程都会上传到社区的[哔哩哔哩](https://space.bilibili.com/433584098)账号下，欢迎关注。

想关注视频录制计划，请[点击这里](https://github.com/jenkins-zh/jenkins-zh/issues/345)。

## 如何参与？

文档以 Markdown 的格式来编写，并采用 [Hugo](http://github.com/gohugoio/hugo/) 生成静态网站，每当[该仓库](https://github.com/jenkins-zh/jenkins-zh)的 `master` 分支发生变化后，就会由 [hugo-plugin](https://github.com/jenkinsci/hugo-plugin) 构建并自动上线。

每一位贡献者，都需要通过发起 [Pull Request](https://github.com/jenkins-zh/jenkins-zh/pulls) 的方式来帮忙完善、改进该 Jenkins 中文教程。

在每个 Markdown 文件的头部，我们以 YAML 格式附加了一些信息，支持的字段如下：

| 字段名称 | 说明 |
| :--- | :--- |
| type | 固定值：`tutorial` |
| title | 教程标题（必填项） |
| toc | 是否显示目录结构，为 `true` 时显示 |
| author | 作者，首位编写本教程的人，值为 GitHub ID（必填项） |
| editors | 协作者，作者以外的所有完善过本教程的人，值为 GitHub ID |
| references | 本教程涉及的参考资料链接，包括的字段：name、link |
| katacoda | Jenkins 中文社区维护的 [Katacoda](https://github.com/jenkins-zh/jenkins-zh/tree/6a5b027ebff1d155b1b0fc8bef45bc22a01db98a/content/tutorial/katacoda/README.md) 交互式教程[项目](https://github.com/jenkins-zh/jenkins-zh/tree/6a5b027ebff1d155b1b0fc8bef45bc22a01db98a/content/tutorial/jenkins-zh-courses/README.md)的 ID |
