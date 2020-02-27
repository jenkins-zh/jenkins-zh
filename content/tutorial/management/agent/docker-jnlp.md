---
type: tutorial
title: 基于 JNLP 协议的 Docker 代理节点
author: linuxsuren
keywords:
- jnlp
- docker
- agent
date: 2020-02-27
---

Jenkins 支持多种类型的代理节点，本篇教程介绍的是基于 JNLP 协议的 Docker 代理节点。

步骤如下：
1. 在节点管理界面，新增一个代理节点；启动方式为：`通过Java Web启动代理`
2. 点击保存后，进入到该节点的状态页面
3. 参考下面的启动命令来启动 Docker 容器
    * 注意替换 IP 为你的服务器地址，不能使用127.0.0.1或者 localhost
    * secret 可以从节点状态页面找到

```
docker run -u root --rm jenkins/slave:4.0.1-1-alpine java -jar /usr/share/jenkins/agent.jar -jnlpUrl http://192.168.31.239:8080/computer/jnlp/slave-agent.jnlp -secret ad36ea3aff1fea65a803f32e7020bd6c6b5866db9f587fb2079d308661691911 -workDir "/tmp"
```

如果希望了解更多这种代理节点的话，可以参考[官方源码](https://github.com/jenkinsci/docker-slave)。
