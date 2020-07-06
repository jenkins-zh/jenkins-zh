---
type: tutorial
title: 通过 OpenID 认证
author: linuxsuren
keywords:
  - OpenID
  - 认证
toc: true
references:
  - name: 插件源码
    link: 'https://github.com/jenkinsci/oic-auth-plugin'
---

# OIC

如果忘记了 Jenkins 的管理员密码的话，也不用担心，只要你有权限访问 Jenkins 的根目录，就可以轻松地重置密码。

## 通常情况

Jenkins 的根目录，默认是在当前用户（启动 Jenkins 的操作系统用户）目录的 `.jenkins` 中。对于 unix 系统而言，也就是 `~/.jenkins`。

我们打开配置文件 `vim ~/.jenkins/config.xml` 后，把字段 `useSecurity` 的值设置为 `false`，然后重新启动 Jenkins。你就会发现不需要登陆也能进入管理页面。

进入页面**系统管理-&gt;全局安全配置**中，选择**启用安全**，然后在**授权策略**中勾选**任何用户可以做任何事\(没有任何限制\)**。保存后，找到你希望重置密码的用户，输入新的密码即可。

## 其他情况

如果 Jenkins 的根目录在当前用户目录下话，可以通过查找对应进程的方式来确认，下面以 Linux 系统为例说明：

```text
~# ps -ef | grep jenkins
root     26386 26359  0 Jul23 pts/0    00:24:04 java -Duser.home=/var/jenkins_home -Djenkins.model.Jenkins.slaveAgentPort=50000 -jar /usr/share/jenkins/jenkins.war
```

分析上面的输出，可以得出，该 Jenkins 的根目录为：`/var/jenkins_home`。

## JENKINS\_HOME

如果你的环境变量里设置了 `JENKINS_HOME` 的话，那么， Jenkins 的根目录就可能是 `JENKINS_HOME` 指向的目录。

