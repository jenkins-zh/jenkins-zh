---
title: "使用 Python 制作酷炫多彩的 Jenkins 插件词云图"
description: "Jenkins 插件名称高频关键词有哪些？一切尽在酷炫多彩的词云图"
date: 2020-06-29
tags:
- jenkins
- wordcloud
author: donhui
poster: "jenkins-logo-word-cloud.png"
---

![jenkins-logo-word-cloud](jenkins-logo-word-cloud.png)

作为最流行的 CI/CD 工具，Jenkins 的优势之一是其生态强大，而这与其插件体系分不开的。
目前 Jenkins 插件 1500+ （截止20200617，插件数量为1749）。

近日发现词云比较好玩，于是想着以 Jenkins 插件名称为数据源，形成的词云会是什么样的呢，什么关键字会比较突出呢？
想到就去做，带着问题，带着好奇心，开始了实践之旅～

## 插件基本字段说明
以 Jenkins 中文本地化插件为例，在 Jenkins 官网插件详情页面可以看出：
其 ID 为 localization-zh-cn，Name 为 Localization: Chinese (Simplified)。

![localization-zh-cn](localization-zh-cn.png)

## 获取所有 Jenkins 插件的名称

如何获取所有 Jenkins 插件的名称呢？这里我想到3种方式，或许还有更多方式：

- [插件官网](https://plugins.jenkins.io/)爬虫抓取

- [插件权限文件](https://github.com/jenkins-infra/repository-permissions-updater)获取

- [插件更新中心配置文件](http://updates.jenkins-ci.org/update-center.json)获取

对比上面的三种方式，插件权限文件中并没有 Name 字段，插件更新中心配置文件相对从插件官网抓取比较简单。
所以计划从 update-center.json 进行解析，其中插件名称在 json 中对应字段为 title。

![update-center-json](update-center-json.png)

## 生成 Jenkins 插件名称文件
读取 update-center.json 中 plugin 的 title 字段，按行写入到 jenkins-plugins.txt 文件，代码如下：

```python
# -*- coding: UTF-8 -*-
import json


if __name__ == "__main__":
    json_obj = json.load(open("update-center.json", "r"))
    plugins_obj = json_obj["plugins"]
    with open("jenkins-plugins.txt", "w") as fw:
        for plugin_name in plugins_obj:
            plugin_obj = plugins_obj[plugin_name]
            print plugin_obj["title"]
            fw.write(plugin_obj["title"].encode('utf-8') + "\n")
```

jenkins-plugins.txt 文件共有 1749 行（与 Jenkins 1749个插件对应），其内容截图如下：

![jenkins-plugins-txt](jenkins-plugins-txt.png)

## 生成词云图
这里使用 Python 代码生成词云图，词的来源为 jenkins-plugins.txt，代码如下：

```python
# -*- coding: UTF-8 -*-

from wordcloud import WordCloud
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image


def generate_word_cloud_image(background_image):
    # mask
    mask = np.array(Image.open(background_image))

    # generate word cloud
    wc = WordCloud(mask=mask, scale=1.5, mode='RGBA', background_color="white", max_words=2000).generate(text=text)

    # show word cloud
    plt.imshow(wc, interpolation='bilinear')
    plt.axis('off')
    plt.show()

    # save to file
    background_image = str(background_image).split("/")[-1].replace(".png", "")
    wc.to_file("word-cloud-img/" + background_image + '-word-cloud.png')


if __name__ == "__main__":
    with open('jenkins-plugins.txt') as f:
        text = f.read()

        for image_name in ["background-img/kongfu.png", "background-img/jenkins-logo.png"]:
            generate_word_cloud_image(background_image=image_name)
```

生成的词云图各个关键字以不同大小和比例，绘制出一幅多彩的画卷，感觉很美观、很酷炫！

以 Jenkins logo 为背景图片，生成的词云图如下：

![jenkins-logo-word-cloud](jenkins-logo-word-cloud.png)

以 Jenkins 中文社区的 kongfu 为背景图片，生成的词云图如下：

![kongfu-word-cloud](kongfu-word-cloud.png)

从词云图中可以看出，Pipeline 词频最高，Build、API、Job 次之，紧接着还有 Publisher、Notifier、Trigger、Step、GitHub 等等。

## 资源说明
所有代码及文件可以在 GitHub 仓库找到，如果你也觉得好玩有趣，顺便点个 star 吧，谢谢～

- [https://github.com/donhui/jenkins-plugins-word-cloud](https://github.com/donhui/jenkins-plugins-word-cloud)
