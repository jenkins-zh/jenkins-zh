---
title: "Jenkins 国内插件源恢复正常"
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

经过对比，发现原来原始插件源和国内插件源返回的 json 内容几乎一致,导致国内插件源下载 Url 都指向了国外插件下载地址,国内有些网络的情况下会有直接下载失败的情况

![old-vs-updateCenter](old-vs-updateCenter.png)

![download-failed](download-failed.png)

## 解决方案

发现插件源与国内插件源下载 Url 一致之后，发现最终原因竟是原有生成插件源的程序替换 Url 未成功，所以我们只要替换掉即可。

![download-failed](download-failed.png)

## 完美解决

重新将程序打包上传之后，插件源重新生成之后，插件更新基本正常解决

![new-vs-updateCenter](new-vs-updateCenter.png)

![download](download.png)