---
title: "在 Kubernetes 中通过 Apache Kafka 插件远程处理 Kafka 启动程序"
description: "在 Kubernetes 中通过 Apache Kafka 插件远程处理 Kafka 启动程序"
date: 2019-11-08
original: "https://jenkins.io/blog/2019/07/11/remoting-kafka-kubernetes-phase-1/"
tags:
- kafka kubernetes helm
keywords:
- Remoting kafka kubernetes
author:  Long Nguyen
translator: wenjunzhangp
poster: “./2019-11-08-remoting-over-apache-kafka-plugin-with-kafka-launcher-in-kubernetes/cover.jpg”
---

![cover](cover.jpg)

我是越南 FPT 大学的 Long Nguyen ，我的 Google Summer of Code 2019 项目是 [Remoting over Apache Kafka with Kubernetes features](https://jenkins.io/projects/gsoc/2019/remoting-over-apache-kafka-docker-k8s-features/) 。这是我第一次为 Jenkins 做贡献，我非常兴奋地宣布在第一阶段已经完成的功能。

## 项目介绍

当前版本的 [Remoting over Apache Kafka plugin](https://github.com/jenkinsci/remoting-kafka-plugin) 远程处理需要用户手动配置整个系统，包括 zookeeper 、 kafka 和远程处理代理。它也不支持动态代理配置，因此很难实现具有伸缩性的扩展。我的项目旨在解决两个问题：
1. 提供 Apache-Kafka 集群的现成解决方案。
2.  Kubernetes 集群中的动态代理配置。

## 当前状态

* 支持凭据的 Kubernetes 连接器。
*  Kubernetes 功能中的 ApacheKafka 预配功能已完全实现。
*  Helm chart 部分实现。

##  Kubernetes 中的 Apache-Kafka 配置

此功能是 2.0 版本的一部分，因此尚未正式发布。您可以通过使用 [Experimental Update Center](https://jenkins.io/doc/developer/publishing/releasing-experimental-updates/) 更新到 2.0.0-alpha 版本或直接从 master 分支构建来尝试该功能：

```
git clone https://github.com/jenkinsci/remoting-kafka-plugin.git
cd remoting-kafka-plugin/plugin
mvn hpi:run
```

在全局配置页面上，用户可以输入 Kubernetes 服务器信息和凭据。然后他们只需点击一个按钮就可以启动 ApacheKafka 。

![kafka-provisioning-kubernetes-ui](kafka-provisioning-kubernetes-ui.png)

当用户点击 `Start Kafka on Kubernetes` 按钮时， Jenkins 将根据信息创建一个 Kubernetes 客户机，然后从 `resources` 中应用 zookeeper 和 kafka yaml 规范文件。

![kafka-provisioning-kubernetes-architecture](kafka-provisioning-kubernetes-architecture.png)

## Helm Chart

 Apache-Kafka 插件上远程处理的 Helm 图表基于 [stable/jenkins](https://github.com/helm/charts/tree/master/stable/jenkins) 图表和 [incubator/kafka](https://github.com/helm/charts/tree/master/incubator/kafka) 图表。截至目前，该图表仍在[开发中](https://github.com/jenkinsci/remoting-kafka-plugin/pull/62)，因为它仍在等待第 2 阶段的 Cloud API 实现。但是，您可以使用一个独立的远程 Kafka 代理查看演示图表：

```
git clone -b demo-helm-phase-1 https://github.com/longngn/remoting-kafka-plugin.git
cd remoting-kafka-plugin
K8S_NODE=<your Kubernetes node IP> ./helm/jenkins-remoting-kafka/do.sh start
```

命令 `do.sh start` 将执行以下步骤：
* 安装图表（与 Jenkins 和 Kafka 一起使用）。
* 通过应用下面的 JCasC 在 Jenkins master 上启动一台 Kafka 计算机。
```
jenkins:
  nodes:
    - permanent:
        name: "test"
        remoteFS: "/home/jenkins"
        launcher:
          kafka: {}
```
* 启动单个 Remoting Kafka Agent pod 。
您可以通过运行 `kubectl` 来检查图表状态，例如:
```
$ kubectl get all -n demo-helm
NAME                                    READY   STATUS    RESTARTS   AGE
pod/demo-jenkins-998bcdfd4-tjmjs        2/2     Running   0          6m30s
pod/demo-jenkins-remoting-kafka-agent   1/1     Running   0          4m10s
pod/demo-kafka-0                        1/1     Running   0          6m30s
pod/demo-zookeeper-0                    1/1     Running   0          6m30s

NAME                              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
service/demo-0-external           NodePort    10.106.254.187   <none>        19092:31090/TCP              6m30s
service/demo-jenkins              NodePort    10.101.84.33     <none>        8080:31465/TCP               6m31s
service/demo-jenkins-agent        ClusterIP   10.97.169.65     <none>        50000/TCP                    6m31s
service/demo-kafka                ClusterIP   10.106.248.10    <none>        9092/TCP                     6m30s
service/demo-kafka-headless       ClusterIP   None             <none>        9092/TCP                     6m30s
service/demo-zookeeper            ClusterIP   10.109.222.63    <none>        2181/TCP                     6m30s
service/demo-zookeeper-headless   ClusterIP   None             <none>        2181/TCP,3888/TCP,2888/TCP   6m31s

NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/demo-jenkins   1/1     1            1           6m30s

NAME                                     DESIRED   CURRENT   READY   AGE
replicaset.apps/demo-jenkins-998bcdfd4   1         1         1       6m30s

NAME                              READY   AGE
statefulset.apps/demo-kafka       1/1     6m30s
statefulset.apps/demo-zookeeper   1/1     6m30s
```

## 下一阶段计划

* 实施 Cloud API 来配置 Remoting Kafka Agent 。（[JENKINS-57668](https://issues.jenkins-ci.org/browse/JENKINS-57668)）
* 将 Cloud API 实施与 Helm 图表集成。（[JENKINS-58288](https://issues.jenkins-ci.org/browse/JENKINS-58288)）
* 单元测试和集成测试。
* 发布版本 2.0 和地址反馈。（[JENKINS-58289](https://issues.jenkins-ci.org/browse/JENKINS-58289)）

## 链接

* [第一阶段演示视频](https://youtu.be/MDs0Vr7gnnA?t=2601)
* [第一阶段演示幻灯片](https://docs.google.com/presentation/d/1yIPwwL7P051XaSE2EOJYAtbVsd6YvGvvKp9QcJE4J1Y/edit?usp=sharing)
* [Remoting over Apache Kafka plugin](https://github.com/jenkinsci/remoting-kafka-plugin)
* [项目页面](https://jenkins.io/projects/gsoc/2019/remoting-over-apache-kafka-docker-k8s-features/)
* [Gitter Channel](https://gitter.im/jenkinsci/remoting)