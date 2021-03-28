---
title: "Jenkins 更新中心证书更新"
date: 2021-03-31
description: "Jenkins 更新中心证书更新，部分版本的用户需要注意及时更新"
author: Olivier Vernin
translator: LinuxSuRen
original: https://www.jenkins.io/blog/2021/03/15/update-center-certificate-rotation/
poster: certificate-rotation-opengraph.png
---

![certificate-rotation-opengraph](certificate-rotation-opengraph.png)

2021 年 3 月 29 日，我们会更新 Jenkins 更新中心的证书。当前的证书将会于 2021 年 4 月过期。当新证书启用后，Jenkins 2.178 之前的版本（2018 年）就无法与默认的更新中心以及实验性更新中心通讯。对于自行部署的更新中心，则不会收到影响。对于插件更新，更新中心会支持一年内的 Jenkins core 的版本，2.204 就是最老的版本。

你如果不定期更新的话，请查阅 Jenkins 安全公告，并以此作为依据来更新你的 Jenkins 版本。

## 哪些人？

还在使用 Jenkins 2.178 之前版本的用户，将于 2021 年 3 月 29 日证书更新后无法获得任何更新。

对于 Jenkins 开发者，如果使用的 Jenkins 是 2.178 之前的版本的话，在执行 `mvn hpi:run` 命令测试插件时看不到插件更新。插件开发者可以把最小依赖更新到相对较新的版本。在指导手册“如何选择 Jenkins 版本”中有关于最小 Jenkins 版本的说明。另外，开发者也可以通过参数 `mvn -Djenkins.version=2.249.1 hpi:run` 来测试更高的版本。

对于运行的 Jenkins 版本高于 2.178 的用户，则不会受到影响。

## 做了什么？

Jenkins 通过更新中心来检查核心以及插件的更新。该服务使用带有根证书的证书丢元信息做签名。Jenkins 中带有该根证书，因此可以保证更新中心的数据可信。当有更新可用时，会有提示信息出现在 Jenkins 界面上以提醒用户更新。

## 为什么？

绑定在 Jenkins 中的根证书创建于 2011 年 4 月，有效期至 2021 年 4 月。这是 2018 年 4 月更新的 Jenkins 核心的根证书。现在，该使用新的根证书了。最新根证书的过期日期为 2028 年 4 月。

你可以从 [INFRA-2902](https://issues.jenkins.io/browse/INFRA-2902) 这个工单中了解到更多证书更新的细节。

总之，只要更新你的实例，就不会有任何问题。

相关链接：

* [INFRA-2902](https://issues.jenkins.io/browse/INFRA-2902) - 更新中心证书的更新
* [INFRA-2732](https://issues.jenkins.io/browse/INFRA-2732) - 手动更新证书
* [INFRA-1502](https://issues.jenkins.io/browse/INFRA-1502) - 增加新的根证书（2018年）
* [jenkins-infra/update-center2](https://github.com/jenkins-infra/update-center2/tree/master/resources/certificates) - Jenkins 更新中心证书
* [updates.jenkins.io](https://updates.jenkins.io/) - Jenkins 更新中心
* [advisories](https://www.jenkins.io/security/advisories/) - Jenkins 安全公告
