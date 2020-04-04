---
title: "Windows 安装程序更新"
description: "平台特别兴趣小组提供了 Windows 安装程序的更新"
tags:
- windows
- platform-sig
- installers
author: slide_o_mix
translator: arjenzhou
original: https://jenkins.io/blog/2019/02/01/windows-installers/
---

Jenkins 的 Windows 安装程序已经存在很多年了，它是用户在 Windows 上安装 Jenkins Master 作为服务的一种方式。
从被开发出来至今，它还没有什么新特性，但现在是时候做出改变了。

首先，让我们瞧瞧现版本安装程序的使用经验。

### 第1步 启动安装程序

![启动安装程序](../../../images/articles/2019/02/2019-02-01-windows-installer/old_installer_1.png)

这是使用 [WiX Toolset](https://wixtoolset.org) Windows 安装程序的默认界面外观，算不上太好看，而且没有太多对安装程序进行说明的品牌信息。

### 第2步 安装目录

![安装目录](../../../images/articles/2019/02/2019-02-01-windows-installer/old_installer_2.png)

同样，没有太多的品牌信息。

### 第3步 安装

![安装](../../../images/articles/2019/02/2019-02-01-windows-installer/old_installer_3.png)

除了选择安装位置外，安装程序大体上没有提供一些安装 Jenkins 的选项。

## 问题

现在的安装程序存在一些问题，平台特别兴趣小组会修复这些问题，并为用户提供新的安装体验。

 1. 安装程序只支持32位安装。
 2. 用户不能选择 Jenkins 作为 Windows 服务启动时的端口以及账户。
 3. 安装程序捆绑了32位的 Java Runtime，而没有使用已存在的 JRE。
 4. 安装程序不支持 Jenkins for Java 11中的实验性支持。
 5. JENKINS_HOME 目录并不适合现代 Windows。
 6. 安装程序中没有品牌。
 
## 前进

使用实验性的 Jenkins Windows 安装程序，大部分问题都已解决！

 1. 安装程序将只支持64位系统，这也是如今大多数 Windows 系统的现状，所以能让更多的用户能够使用安装包来安装 Jenkins。
 2. 用户能够为服务输入用户信息，同时选择端口以便于 Jenkins 验证端口是否可用。
 3. 安装程序不再捆绑 JRE 而是在操作系统中寻找合适的 JRE。如果用户想要使用一个不同的 JRE，可以在安装时指定。
 4. 安装程序已经支持 Java 11，包括在 [Java 11 预览](https://jenkins.io/zh/blog/2018/12/14/java11-preview-availability/)上面列出的组件。
 5. JENKINS_HOME 目录被放置在启动服务用户的 LocalAppData 目录下，这与现代 Windows 文件系统布局一致。
 6. 安装程序已经升级带有品牌了，这让它看起来更酷并能提供一个更好的用户体验。
 
## 截图

以下是新安装程序的系列屏幕截图：

### 第1步 启动安装程序

![启动安装程序](../../../images/articles/2019/02/2019-02-01-windows-installer/new_installer_1.png)

Jenkins logo 现在是安装程序 UI 的重要组成部分。

### 第2步 安装目录

![安装目录](../../../images/articles/2019/02/2019-02-01-windows-installer/new_installer_2.png)

在安装程序的所有阶段，Jenkins logo 和名称都出现在标题中。

### 第3步 选择账户

![选择账户](../../../images/articles/2019/02/2019-02-01-windows-installer/new_installer_3.png)

安装程序现在允许您指定要运行的帐户的用户名/密码，并检查该帐户是否具有 LogonAsService 权限。

### 第4步 端口选择

![端口选择](../../../images/articles/2019/02/2019-02-01-windows-installer/new_installer_4.png)

安装程序还允许您指定 Jenkins 运行的端口，并且在输入和测试有效端口之前不会继续。

### 第5步 JRE 选择

![JRE 选择](../../../images/articles/2019/02/2019-02-01-windows-installer/new_installer_5.png)

安装程序现在不再捆绑 JRE，而是在系统上搜索兼容的 JRE （现在是 JRE 8）。 如果你想使用与安装程序搜索到不同的 JRE，你可以浏览目录并指定它。只支持 JRE 8 和 JRE 11 Runtime。如果发现选定的 JRE 是版本11，安装程序将自动添加必要的参数和其他 jar 文件，以便在 Java 11下运行。

### 第6步 安装

![安装](../../../images/articles/2019/02/2019-02-01-windows-installer/new_installer_6.png)

用户能在安装程序中输入的所有选项也可以在命令行上覆盖以进行自动部署。可以覆盖的完整属性列表即将推出。

## 接下来的步骤

新版本安装程序正在被平台特别兴趣小组的成员 Review 中，但我们需要人测试安装程序并给予反馈。你过你对测试新安装程序感兴趣的话，请加入[平台特别兴趣小组 gitter room](https://gitter.im/jenkinsci/platform-sig) 获取更多信息。

在新安装程序中还使用了许多一些正在研发的东西（例如，在进行升级时保留端口和其他选择）,但它已接近发布。

除了基于 MSI 的 Windows 安装程序的更新之外，平台特别兴趣小组还在努力接管 Chocolatey Jenkins 软件包并为每次更新发布一个版本。
