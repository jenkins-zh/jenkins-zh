---
title: "Jenkins 自动化安装插件"
description: "Jenkins 批量安装指定版本插件"
date: 2019-05-07
tags:
- jenkins
author: zacker330
poster: ./2019-05-07-jenkins-install-plugins-shell/poster.png
---

### 手工安装 Jenkins 插件的方法
通常，我们有两种方法安装 Jenkins 插件。第一种方法是到 Jenkins 插件管理页面搜索插件，然后安装。第二种方法是上传 Jenkins 插件的 hpi 文件安装。这两种方法能满足大多数人的需求。

第一种方法，如下图所示：
![搜索安装](pc1.png)

第二种方法，如下图所示：
![上传插件](pc2.png)

但是对于需要保证 Jenkins 稳定或在 Jenkins 上进行二次开发的同学来说，以上方法是无法满足需求的。

第一种方法是无法指定插件的版本。第二种方式必须自己找到该插件的依赖树，然后根据依赖关系一个个地安装。是的，手工上传插件的这种方法，Jenkins 是不会自动下载依赖的。

还有，就是这两种方式都无法实现批量安装。

### 自动安装插件的方法

那么，有什么方法能指定插件的版本，又能自动下载它的依赖，还能批量下载呢？

幸运的是，Jenkins 的 Docker 镜像的代码仓库里的 install-plugins.sh 脚本已经实现。只不过需要我们拿过来小小修改才能使用。笔者修改后创建了相应的代码仓库：[jenkins-install-plugins-shell](https://github.com/jenkinsci/docker/blob/master/install-plugins.sh) 。链接在文章末尾。

以下是 jenkins-install-plugins-shell 的使用方法：
1. 将代码 clone 到 JENKINS_HOME 目录中。
```
cd $JENKINS_HOME
git clone https://github.com/zacker330/jenkins-install-plugins-shell.git
cd jenkins-install-plugins-shell
```

2. 在 plugins.txt 中加入希望安装的插件
在 `jenkins-install-plugins-shell` 目录中，有一个 plugins.txt 文件，在文件中写入希望安装的插件及版本号。例如：
```
ansible:1.0
powershell:1.3
```
3. 执行安装
```bash
 # Jenkins War 的路径，用于分析
export JENKINS_WAR_PATH=<Jenkins war文件的路径>
chmod +x install-plugins.sh jenkins-support
./install-plugins.sh < plugins.txt
```
4. 重启 Jenkins 
install-plugins 本质上做的事情就只是将插件从云端下载到 JENKINS_HOME 下的 plugins 目录中。要使安装的插件生效，还需要重启 Jenkins。

### 关于 Jenkins 插件的名称
Jenkins 插件有两个名称。一个叫 display name，一个叫 short name。比如 Ansible 插件的 disply name 为 Ansible plugin，short  name 为 ansible。

如何知道一个插件的 short name 呢？可以在 Jenkins 插件官网上找到，比如 Ansible 的：

![image.png](pc3.png)

在 `plugins.txt` 中使用的是 short name。

### 总结
笔者为什么一定要确定 Jenkins 插件的版本？是因为插件的版本会影响 Jenkins 流水线的可靠性。所以，笔者才会这么在意 Jenkins 插件的版本。

### 附录
* Jenkins 官方 Docker 镜像中的自动化插件安装脚本：[https://github.com/jenkinsci/docker/blob/master/install-plugins.sh](https://github.com/jenkinsci/docker/blob/master/install-plugins.sh)
* 笔者修改后的自动化插件安装脚本：
[https://github.com/zacker330/jenkins-install-plugins-shell](https://github.com/zacker330/jenkins-install-plugins-shell)
