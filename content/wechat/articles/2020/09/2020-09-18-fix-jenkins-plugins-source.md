---
title: "Jenkins 国内插件源恢复正常啦"
date: 2020-09-22
description: "修复 Jenkins 国内插件源，恢复正常使用"
author: yJunS
tags:
- jenkins
- updateCenter
poster: "jenkins-voltron.png"
---

![cover](jenkins-voltron.png)

> 近期，Jenkins 中文社区微信群内有些童鞋提出*国内插件源*无法正常使用了，究竟是什么情况呢？

## 对比插件源

经过对比，发现原来原始插件源和国内插件源返回的 JSON 内容几乎一致，导致国内插件源下载 URL 都指向了国外插件下载地址，国内有些网络的情况下会有直接下载失败的情况

![old-vs-updateCenter](old-vs-updateCenter.png)

![download-failed](download-failed.png)

## 解决方案

发现插件源与国内插件源下载 URL 一致之后，发现最终原因竟是原有生成插件源的程序替换 URL 未成功，所以我们只要替换掉即可，修复 [PR](https://github.com/jenkins-zh/mirror-adapter/pull/11)

![replace-url](replace-url.png)

## 完美解决

重新将程序打包上传之后，插件源重新生成之后，插件更新基本正常解决。

![new-vs-updateCenter](new-vs-updateCenter.png)

![download](download.png)

## 如何使用

如想知道如是使用国内插件源，请参考[此页](https://jenkins-zh.cn/wechat/articles/2019/11/2019-11-11-update-center-mirror-announcement/)。源地址替换为[插件源地址](https://updates.jenkins-zh.cn/update-center.json)

*欢迎大家通过我们的[论坛](https://community.jenkins-zh.cn/) 或通过添加我们的微信小助手进群交流*

![wechat-assistant](wechat.png)