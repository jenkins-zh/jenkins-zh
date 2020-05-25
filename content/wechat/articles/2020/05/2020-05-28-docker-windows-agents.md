---
title: Windows Docker Agent 镜像可以常规使用了 
date: 2020-05-28  
description: 介绍了几个官方的 Windows Docker Agent 镜像  
author: slide_o_mix  
poster: dockerJenkins_social.png  
translator: zhaoying818
original: https://www.jenkins.io/blog/2020/05/11/docker-windows-agents/  
tags:
- 公告
- docker
- platform-sig
- windows  
---

![dockerJenkins](dockerJenkins_social.png)

我们想宣布可以使用官方 Windows agent Docker 镜像，这些镜像允许在 Docker 和 Kubernetes 上使用 Windows 操作系统配置 Jenkins agent。

## 新镜像

现在，所有 agent 的正式 Docker 镜像都提供 `nanoserver-1809` 和 `windowsservercore-1809` 标签，其中包括 Windows 镜像以及当前的 Java 8（类似于 `latest` 标签）。
我们还提供了明确的 Java 选择，例如 `jdk8-windowsservercore-1809` 或 `jdk11-nanoserver-1809`。
版本标记也可用，例如 `jenkins/agent:4.3-4-jdk8-nanoserver-1809`。

* [jenkins/agent](https://hub.docker.com/r/jenkins/agent) 是一个基本的 agent，它捆绑 agent.jar 来进行 agent<= => master之间的通讯，最有用的是可以作为其他镜像的基础镜像。Windows 镜像从版本 [4.3-4](https://github.com/jenkinsci/docker-agent/releases/tag/4.3-4) 开始可用。

* [jenkins/inbound-agent](https://hub.docker.com/r/jenkins/inbound-agent) 是一个基于上面 jenkins/agent 镜像的 agent，它提供了用 PowerShell 编写的包装类脚本，以帮助指定 agent.jar 的参数。Windows 镜像从版本 [4.3-4](https://github.com/jenkinsci/docker-agent/releases/tag/4.3-4) 开始可用。

* [jenkins/ssh-agent](ttps://hub.docker.com/r/jenkins/ssh-agent) 是一个安装了 OpenSSH 的镜像， 应该与 [SSH Build Agents Plugin](https://plugins.jenkins.io/ssh-slaves) 一起使用。Windows 镜像从版本 [2.1.0](https://github.com/jenkinsci/docker-ssh-agent/releases/tag/2.1.0) 开始可用。

## 使用 Windows Docker 镜像

要使用新镜像，您将需要支持运行 Windows 容器的合适 Docker 或 Kubernetes 环境。对于 Windows 桌面用户，最简单的方法是使用[Docker for Windows](https://docs.docker.com/docker-for-windows/)。[此处](https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/)记录了 Kubernetes 对于 Windows 的支持。

### jenkins/agent

jenkins/agent 镜像是 JDK 和 agent.jar（Jenkins Remoting 库）的简单 agent。

该镜像有两个主要用途：

 1. 作为其他 Docker 镜像的基础镜像（例如 Dockerfile 中的 `FROM jenkins/agent:jdk8-nanoserver-1809`），jenkins/inbound-agent 就是基于这个镜像。
 2. 该镜像还可用于通过 *Launch agent via execution of command on the master* 的 *Launch method* 启动agent，这允许主服务器自动在 docker 容器内启动 agent。

要针对第二个用途运行 agent，请在设置 *Remote root directory* 为 `C:\Users\jenkins\agent` 后，在 Jenkins 主服务器上指定以下命令：

```
 docker run -i --rm --name agent --init jenkins/agent:jdk8-windowsservercore-1809 java -jar C:/ProgramData/Jenkins/agent.jar
```

### jenkins/inbound-agent

inbound-agent Docker 镜像尝试提供与 agent.jar 可执行文件的更高级别的交互。它提供了一个围绕 agent.jar 的 PowerShell 包装类脚本，并且被指定为入口点，因此您只需要传递一些命令行参数即可运行 agent。已打开一个 [pull request](https://github.com/jenkinsci/docker-inbound-agent)，其中记录了这些命令行参数和环境变量。

示例：

```
 docker run jenkins/inbound-agent:windowsservercore-1809 `
    -Url http://jenkins-server:port `
    -WorkDir=C:/Users/jenkins/Agent `
    -Secret <SECRET> `
    -Name <AGENTNAME>
```

使用环境变量的示例：

```
 docker run -e "JENKINS_URL=http://jenkins-server:port" -e "JENKINS_AGENT_NAME=AGENTNAME" `
    jenkins/inbound-agent:windowsservercore-1809 `
    -WorkDir=C:/Users/jenkins/Agent `
    -Secret <SECRET> `
    -Name <AGENTNAME>
```

---
注意：`-Url`、`-Name` 和 `-Secret` 是必选参数，但可以将其指定为命令行参数或环境变量。
---


### jenkins/ssh-agent

如上所述，jenkins/ssh-agent docker 镜像基于与主机的 SSH 通信，而不是基于远程 TCP 或 WebSocket 协议。 该镜像设置了一个 `jenkins` 用户和 OpenSSH 服务器，以便主服务器可以通过 SSH 连接到 agent。该镜像需要 SSH 公钥作为参数，并将该密钥放入 `jenkins` 用户的 `authorized_keys` 文件中，应在主服务器上的 agent 配置中指定私钥，以允许主服务器连接。

示例：

```
 docker run jenkins/ssh-agent:jdk8-windowsservercore-1809 "<public key>"
```

使用 `docker run` 时，还可以将公钥作为环境变量传递。

示例：

```
 docker run -e "JENKINS_AGENT_SSH_PUBKEY=<public key>" jenkins/ssh-agent:jdk8-windowsservercore-1809
```

然后，将能够作为 “jenkins” 使用 [SSH Build Agents Plugin](https://plugins.jenkins.io/ssh-slaves/)与匹配的私钥连接该 agent。


## 下一步计划?

我们正在考虑提供基于 _Windows Server 2019 build 1909_ 的版本，以便 Jenkins 用户可以在 GKE 群集上运行这些镜像（请参阅[此问题](https://github.com/jenkinsci/docker-agent/issues/134)）。

我们还正在研究提供多体系结构清单，以使 Windows 镜像成为 `latest` 标签的一部分。

还有一个[开放的 pull-request](https://github.com/jenkinsci/docker/pull/924)，用于为 Jenkins 主服务器创建基于 Windows 的 Docker 镜像。对此没有很多要求，但是为了使 Windows 用户的产品完善，创建了这个 pull request。

对于与 Windows 不相关的计划，请参阅 [agent 的 Docker镜像：新名称和下一步](http://jenkins-zh.cn/wechat/articles/2020/05/2020-05-18-docker-agent-image-renaming/)博客文章。
