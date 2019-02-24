# Jenkins 中文社区网站源码

该站点采用 Markdown 格式编写，由 [Hugo](https://github.com/gohugoio/hugo) 生成静态文件。

包含的内容，包括：

* 微信公众号文章
* 社区活动（建设中）
* 站点介绍

除了上述内容外，还基于 [utterance](https://github.com/utterance) 提供了文章评论功能。

# 参与

对于如何参与社区活动，可以参考[站点中的介绍](https://jenkins-zh.github.io/about/how-to-involve/)。这里，要介绍的是如何运行站点。

1. 下载 [Hugo](https://github.com/gohugoio/hugo/releases) 命令行；
2. 更新主题 `make fetch-theme`
3. 启动服务 `hugo server -D`
