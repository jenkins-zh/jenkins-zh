---
title: "Jenkins 每周版更新"
description: "本次更新的版本包括：2.250~2.256"
date: 2020-10-09
tags:
- jenkins
- weekly
- release
keywords:
- Jenkins 版本发布
- Jenkins 2.250发布
- Jenkins 2.251发布
- Jenkins 2.252发布
- Jenkins 2.253发布
- Jenkins 2.254发布
- Jenkins 2.255发布
- Jenkins 2.256发布
author: jenkinsci
translator: zhaoying818
poster: "./2020-10-09-weekly-release/great-wall.jpeg"
---

![great-wall](great-wall.jpeg)

## 2.256 (2020-09-08)
* 避免在 hudson.FilePath 中的有关匿名类的日志告警。 (issue 63563)

## 2.255 (2020-08-31)
104 sunny0 cloudy0 storm
* 开发者: 忽略不稳定的 UpdateCenter2Test.install 测试。 (pull 4916)

## 2.254 (2020-08-25)
* 停止预格式化代理日志以防止死锁（由 2.231 引入的缺陷的回归）。 (issue 63458)
* “全局/系统读取”权限正式变为“整体可用 (GA) ” 状态。 (pull 4909, JEP-224)
* 设置 Cross-Origin-Opener-Policy 为 same-origin。 (pull 4910)
* 通过使用新的浏览器标签打开配置屏幕的内联帮助中的插件链接，避免丢失正在进行的工作。 (issue 63429)
* 开发者: 从 f:dropdownList 中删除未使用的 description 属性。 (issue 63220)

## 2.253 (2020-08-18)
* 基于 Alpine 的 Jenkins Docker 镜像的重大更新。 基于 Alpine 的 Jenkins Docker 镜像现在使用 Alpine 3.12 和 AdoptOpenJDK 8u262。 (LTS 升级指南)
* 修复将 API token 复制到剪贴板的按钮问题（由 2.238 引入的缺陷的回归）。 (issue 63274)
* 修复代理日志中的死锁。 (issue 63082)
* 修复了 Cmd + Enter 不能在 Mac 上的脚本控制台中运行脚本的情况（由 2.248 引入的缺陷回归）。 (issue 63342)
* 修复退格键有时不能从 Mac 上的脚本控制台中删除文本（由 2.248 引入的缺陷回归）。 (issue 63342)
* 修复正则表达式验证器 UI 位置。 (issue 63308)
* 使警报颜色与 “Jenkins 管理”警报颜色一致。 (issue 63330)
* 为用户配置屏幕添加日语翻译。 (pull 4904)
* 防止并发构建删除。 (issue 61687)
* 开发者: 使不可用的插件背景与主题背景一致。 (issue 63331)
* 开发者: 公开插件的指纹范围集序列化方法。 (pull 4888)
* 内部: 从 Jenkins 核心中删除一些已经移至 LDAP 和 PAM Authentication 插件的文本消息。 确保升级到 LDAP 1.22 或更高版本以及 PAM Authentication 1.5 或更高版本。 (pull 4866)
* 内部: 删除不推荐使用和未使用的 ProcessTreeKiller 类。 (pull 4874)
* 内部: 从 jenkins.war 包中排除 JUnit 和 Hamcrest 库。 (issue 63269)

## 2.252 (2020-08-12)
* 重要安全修复。 (安全公告)

## 2.251 (2020-08-04)
* 将包装选项卡还原为多行，而不是溢出(由 2.248 引入的缺陷回归)。 (issue 63180)
* 在“构建时间趋势”页面中显示构建时间数据(由 2.245 引入的缺陷回归)。 (issue 63232)
* 标准化小部件颜色，使其与新调色板一致。 (修复暗黑主题中的面包屑闪现问题)
* 空的已安装插件表文本将再次可读(由 2.249 引入的缺陷回归)。 (issue 63276)
* 日语文档和消息中的 agent 替换对 slave 的文本引用。 (issue 63166)
* 在某些情况下，在注册验证器时防止 JavaScript 错误。 (issue 42228)
* 等待更新中心数据时，不会阻塞 Manage Jenkins 的渲染。 (pull 4881)
* 开发者: 允许将指纹从本地存储迁移到外部存储。 (issue 62757)

## 2.250 (2020-07-28)
* 内部: 修复 java.vendor 和 java.vm.vendor 中的 UsageStatisticsTest 故障。 (pull 4879)

