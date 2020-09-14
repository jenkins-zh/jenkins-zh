---
type: tutorial
title: Tomcat 中使用 Jenkins
author: linuxsuren
---

[Tomcat](http://tomcat.apache.org/) 是 [Apache](http://apache.org/) 旗下的开源应用服务器，Java 的 Web 应用经常会选择它作为应用
服务器来提供 Web 服务。

Tomcat 和 [Jenkins](http://jenkins.io/) 都是用 Java 语言开发的，因此，我们首先需要安装 Java 的运行环境（JRE，Java Runtime Environment）。

## 安装
首先，我们需要有 Java 的运行环境，JRE 或者 JDK 都可以。下面提供几种安装的方式：

* macOS 下安装 `brew cask install adoptopenjdk8`

注意，本文的实验环境是 Java8

然后，我们需要下载 Tomcat 和 Jenkins：
```
wget https://mirror.bit.edu.cn/apache/tomcat/tomcat-7/v7.0.105/bin/apache-tomcat-7.0.105.tar.gz
tar xzvf apache-tomcat-7.0.105.tar.gz

wget https://mirrors.tuna.tsinghua.edu.cn/jenkins/war/2.256/jenkins.war
mv jenkins.war apache-tomcat-7.0.105/webapps
```

另外，我们可以通过 [Jenkins CLI](https://github.com/jenkins-zh/jenkins-cli) 来下载和启动 Jenkins

`jcli center download --war-version 2.256`

## 启动
Tomcat 分别支持以交互式、守护进程的方式来启动，如果你对这两个概念还不够清楚的话，我下面会给出简单的解释。

* 交互式；执行的命令会阻塞当前窗口，直到程序退出后才会结束。
* 守护进程；命令执行完成后，立刻结束，但是程序不会退出，会在后台一直运行。

当我们学习、调试时，可以采用交互式的方式来启动，这样的话，会比较方便。

当我们要在服务器上运行时，多半情况下是要以守护进程的方式来运行。

下面，我会 Unix（Linux、macOS）为环境来给出相关的命令。

### 交互式
进入 Tomcat 的根目录下，执行命令 `./bin/catalina.sh run`

### 守护进程
进入 Tomcat 的根目录下，执行命令 `./bin/catalina.sh start` 就可以启动 Tomcat

停止 Tomcat 的命令为 `./bin/catalina.sh stop`

## 目录结构

```
webapps/jenkins
├── ColorFormatter.class
├── JNLPMain.class
├── LogFileOutputStream$1.class
├── LogFileOutputStream$2.class
├── LogFileOutputStream.class
├── META-INF
├── Main$FileAndDescription.class
├── Main.class
├── MainDialog$1$1.class
├── MainDialog$1.class
├── MainDialog.class
├── WEB-INF
├── bootstrap
├── css
├── dc-license.txt
├── executable
├── favicon.ico
├── help
├── images
├── jsbundles
├── robots.txt
├── scripts
└── winstone.jar
```

## 访问
Tomcat 默认的端口是 `8080`，如果你安装在本地的话，可以通过下面的方式来访问：

[http://localhost:8080/jenkins/](http://localhost:8080/jenkins/)

如果你的 Jenkins 是首次启动后访问的话，根据不同的网络情况，所等待的时间长短是不相同的。因此，此时 Jenkins 需要从更新中心下载插件信息。
当插件信息下载成功后，你需要输入初始 Token 才可以进入到配置初始化界面。

Token 的值会保存在该文件中：`~/.jenkins/secrets/initialAdminPassword`
