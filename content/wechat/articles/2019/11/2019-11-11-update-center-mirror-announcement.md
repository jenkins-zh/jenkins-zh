---
title: "Jenkins 插件中心国内镜像源发布"
description: "忍受不了官方站点下载速度的速速看过来"
date: 2019-11-11
keywords:
- update-center
author: linuxsuren
poster: flash.jpg
---

![flash.jpg](flash.jpg)

Jenkins 社区的网络基础设施都是架设在国外的服务器上，而且，并没有在国内有 CDN 或者负载均衡的配置。
对所有的 Jenkins 用户而言，1500+的插件可以帮助他们解决很多问题。然而，我相信，对于国内的很多用户来说，
可能有过一些不太愉快的经历——插件下载速度很慢，甚至会超时。难道遇到这种情况下，我们就只能等吗？

程序员，作为天生懒惰的人，总是希望能通过手中的键盘来解决各种各样的问题。凭什么？下载一个插件，
我还的苦苦地等待来自美国的数据包呢？数数你手里的 Jenkins 都安装了多少个插件。30个算少的吧。
经过一番搜索，发现果然已经有前人帮忙把大树种好了。让我们一起感谢“清华大学开源软件镜像站”提供的镜像服务：

`https://mirrors.tuna.tsinghua.edu.cn/jenkins/`

但是，当我兴冲冲地把 Jenkins 插件管理页面的更新中心的地址修改后，却发现了一个奇怪的情况，好像还是那么慢啊。
不管是换地址，还是换4G，换电脑都解决不了这个网络排队的问题。本着开源的精神（不满意就提 issue 或者 Pull Request），
我只好继续挖掘这里的秘密。下面，是我向 TUNA 提的一个 issue（可以看到貌似我并不是第一个吐槽的人）：

`https://github.com/tuna/issues/issues/659`

是的，`rsync` 可以帮我们把106G的文件同步过来，免去了出国下载插件的麻烦，可没有解决最后一公里的痛。

通过下面的 PR 我们可以大致了解到，Jenkins 是通过解析 `update-center.json` 文件的方式来获取插件版本，
以及下载插件的。另外，如果你认为只是修改下文件里的 URL 就能解决这个问题的话，那么，请再仔细想一下这个事情。
既然小白兔可以把地址修改为一个比较方便的值，那么，大灰狼为啥不能往那些插件里加点辣椒水呢。
Jenkins 作为一个在 CI/CD 领域里领先了15年之久的大叔，当然不会输给了一些小毛贼。简单来说呢，这个事情
是通过两把钥匙来解决的——官方用其中一把钥匙给文件做了签名，并保管起来；把另外一把钥匙对外公布（保存在发行版中）。
只有通过了公钥验证的 `update-center.json` 文件，才会被使用到。

`https://github.com/jenkins-infra/update-center2/pull/245`

知道了问题所在，解决起来自然就容易了。Jenkins 中文社区帮大家把钥匙和地址的问题解决了，按图索骥三步走：

![jenkins-zh-footer.png](jenkins-zh-footer.png)

![jenkins-zh-setting.png](jenkins-zh-setting.png)

![jenkins-zh-update.png](jenkins-zh-update.png)

想了解技术细节？担心我们是大灰狼？我们欢迎喜欢学习的同学，更欢迎人民大众的检阅。
提问题，提需求，提代码，提文档，都是可以的。实际上，我们的整套方案中，所有的部分（除了拿一把钥匙以外）
都是开源的，包括还不够完善的设计文档。而且，并不需要花一分钱，完全利用现有的计算、存储资源。
此处，让我们再次感谢清华开源镜像站点、GitHub Actions、码云 Page 等。

`https://github.com/jenkins-zh/mirror-adapter`

**最重要**的事情，一定要在**最后**才说出来（不喜欢认真阅读文档的同学，对不起了）。想要体验极速
安装插件的同学，请认准 Jenkins 简体中文插件的版本：1.0.10

`https://plugins.jenkins.io/localization-zh-cn`
