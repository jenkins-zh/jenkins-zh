---
title: "Jenkins 版本发布"
description: "Jenkins 每周更新版发布"
date: 2019-05-09
tags:
- jenkins
- release
author: linuxsuren
poster: “../../../images/cow.jpg”
---

![](../../../images/cow.jpg)

## 2.175 (2019-04-28)

* 当构建完成后，更新状态图标 (issue 16750)
* 插件管理页面提供了更方便的插件更新选项，包括：“全选”、“兼容的“或”全不选“。 “兼容”的选择（之前为“全选”）已经不再包括含有任何兼容性警告的插件。 (issue 56477)
* 从连接 Jenkins 节点的界面上移除会误导到 Java Web Start 和 JNLP 的链接等引用。 (pull 3998)
* 再次启用 Stapler 请求分发 telemetry。 (pull 3999)
* 确保远程对象仅通过远程通道被序列化。 确定永远不会设计以 XML 形式持久化到磁盘中的类包括： FilePath, [Stream]TaskListener, and ProcessTree. (issue 47896)
* 修复在 Linux 代理安装器中看到的一些错误。 (issue 57071)
* 使得 Debian/Ubuntu 启动器脚本对 Java 11 兼容。 (issue 57096)
* 开发者：使得 mvn -f war hudson-dev:run支持${port}。 (pull 3984)

## 2.174 (2019-04-21)

* 重命名一个代理节点，保持旧的配置，导致重启后旧的代理节点再次出现。 (issue 56403)
* 嵌套的视图现在也可以根据名称搜索了。 (issue 43322)
