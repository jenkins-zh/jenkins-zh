## Contributing to Jenkins WeChat

This page provides information about contributing articles to the Jenkins WeChat subscription account.

## Scope

* Translated blogs from jenkins.io
* Jenkins events
* Other Jenkins-related articles

## How to do

Everyone could create a PR what are you hoping to publish to Jenkins WeChat. But you'd better do this ahead of schedule one week.

Copy from the [sample.md](articles/sample.md), then change the content and front matter. All files name only can use numbers, alphabets or `-`. The file name should contains the publish date.

## Review

All PRs should get at least one approve. If your PR gets no response then please ping `@jenkins-infra/chinese-localization-sig`.

## 环境

我们定义了两个环境：
* [预览环境](config/preview)
* [生产环境](config/production)

在发布时，会使用*生产环境*的配置文件。在构建 Pull Request 时会使用*预览环境*的配置文件。

## 布局

我们为不同类型的页面提供了不同的*布局*，你可以从 [layout](layout) 中找到。