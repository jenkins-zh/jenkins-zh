---
type: tutorial
title: 直接使用 Jenkins war 包
author: linuxsuren
---

我们可以通过执行 `java` 命令的方式启动 Jenkins，命令如下：

`java -jar jenkins.war`

通常情况下，我们不推荐在生产环境中使用这种方式。最主要的是，这种方式无法作为守护程序来运行。

服务的默认端口是 8080，应用上下文为 `/`。因此，默认的访问路径就是 http://localhost:8080/

## 原理
这里简单地描述下 Jenkins 为什么可以直接用 Java 就可以启动。因为，Jenkins 的 war 包中内置了一个应用服务器，也就是 `jetty`。
Jetty 是 Java 实现的一个轻量级的 Servlet 容器。

## 参数
我们可以在 Jenkins 启动时，通过设置参数、环境变量的方式达到修改 Jenkins 行为的效果：

| 参数 | 解释 |
|---|---|
| `--httpPort=8080` | 指定 Web 访问的端口 |
| `--httpsPort=8083` | 指定 HTTPS 协议的 Web 访问的端口 | 
| `--prefix=/jenkins` | 应用上下文 |
| `--webroot=/var/cache/jenkins` | Web 程序的根目录 |
| `--argumentsRealm.passwd.admin=admin` | 管理员的密码 |
| `--argumentsRealm.roles.admin=admin` | 管理员的角色 |
| `--httpsPrivateKey=/var/lib/jenkins/pk` | HTTPS 协议密钥文件 |
| `--httpsCertificate=/var/lib/jenkins/cert` | HTTPS 协议证书文件 |

| 环境变量 | 解释 |
|---|---|
| `-Djenkins.install.runSetupWizard=true` | 是否运行设置向导 |
| `-Djenkins.security.ApiTokenProperty.adminCanGenerateNewTokens=false` | 是否允许管理员为其他用户生成 Token |
| `-Dcom.cloudbees.hudson.plugins.folder.computed.ThrottleComputationQueueTaskDispatcher.LIMIT=10` | 多分支扫描的并发数限制 |

更多的参数以及环境变量可以通过阅读代码来获取，例如：[runSetupWizard](https://github.com/jenkinsci/jenkins/blob/449c5aced523a6e66fe3d6a804e5dbfd5c5c67c6/core/src/main/java/jenkins/install/InstallUtil.java#L146)的代码。
