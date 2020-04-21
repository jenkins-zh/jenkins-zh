---
title: 使用 kind 和 Docker 启动本地的 Kubernetes  
date: 2020-04-29  
description: 介绍了 kind 这款工具，并且通过例子讲解了怎样通过 kind 在你本地的机器上部署应用到 Kubernetes  集群  
author: Youichi Fujimoto  
poster: cover.jpg  
translator: 0N0thing  
original: https://itnext.io/starting-local-kubernetes-using-kind-and-docker-c6089acfc1c0  
tags: 
- Kubernetes  
- Kind  
- Docker   
- WordPress  
- MySQL  
---

![cover](cover.jpg)

## 介绍
你曾经花过一整天时间尝试入门 Kubernetes 吗？多亏最近新出现的一些工具，你可以不用再为此大费周章了。

这篇文章中，我将向你展示使用 kind 在单个 Docker 容器中启动一个集群的步骤。

## 什么是 kind？
*kind 是一款使用 Docker 容器  “nodes” 运行 Kubernetes 集群的工具。*
*https://kind.sigs.k8s.io/*

介绍看起来没有描述信息，但是很明显能知道是源于 “Kubernetes IN Docker”。该工具具备了跨平台友好的优势即便你使用的是 Windows 版本的 Docker。当然了，缺点就是它的可追溯性比较差。

## 安装 kind
因为 kind 是 `go` 语言实现的，请确保安装了最新版本的 `golang`。根据[开发者文档](https://kind.sigs.k8s.io/docs/contributing/getting-started/)，推荐使用 `go1.11.5` 及以上版本。为了安装 kind，请运行这些命令（可能需要运行一段时间）

```
go get -u sigs.k8s.io/kind  
kind create cluster
```

然后确认 “kind” 集群是可用的。

```
kind get clusters
```

## 设置 kuberctl
同样的，使用 [Homebrew](https://brew.sh/) 或者 [Chocolatey](https://chocolatey.org/) 安装最新版本的 `kubernetes-cli`。最新版本的 Docker 包含了 Kubernetes 的功能，但使用的是老版本的 `kubectl`。

运行该命令检查它的版本号。

```
kubectl version
```

请确保显示 `GitVersion: "v1.14.1"` 或更高版本。

如果你发现通过 Docker 运行的 `kubectl`，试着使用 `brew link` 或对环境变量重新排序。

一旦 `kubectl` 和 kind 安装就绪，打开 bash 控制台运行这些命令。

```
export KUBECONFIG=”$(kind get kubeconfig-path)”  
kubectl cluster-info
```

如果 kind 正确的配置了，会显示一些信息出来。现在你就可以继续开始下面的工作了。耶！

## 部署第一个应用程序
我们需要部署什么到集群上呢？一个很好的选择就是 Wordpress 因为它包括 MySQL 和 PHP 应用程序。

幸运的是，有一个官方的入门介绍并且描述的非常棒。我们可以尝试使用刚才创建的 kind 集群来操作里面的大多数步骤。

https://kubernetes.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/

首先，从这个页面上下载 `mysql-deployment.yaml` 和 `wordpress-deployment.yaml`。

运行两个 `cat` 命令创建 `kustomization.yaml`。一旦这些 `yaml` 文件准备好之后，将文件按照下面显示的那样放到相应的目录里面。

```
k8s-wp/  
kustomization.yaml  
mysql-deployment.yaml  
wordpress-deployment.yaml
```

然后应用到你的集群当中。

```
cd k8s-wp  
kubectl apply -k ./
```

如果命令成功执行你会看到如下的输出。

```
secret/mysql-pass-7tt4f27774 created  
service/wordpress-mysql created  
service/wordpress created  
deployment.apps/wordpress-mysql created  
deployment.apps/wordpress created  
persistentvolumeclaim/mysql-pv-claim created  
persistentvolumeclaim/wp-pv-claim created
```

让我们输入这些命令检查下集群的状态:

```
kubectl get secrets  
kubectl get pvc  
kubectl get pods  
kubectl get services wordpress
```

等待所有的 pod 变成 `Running` 状态。

然后，运行这个命令来获取服务。

```
kubectl port-forward svc/wordpress 8080:80
```

然后打开http://localhost:8080/

![wordpress-page](wordpress-page.png)

瞧！

如果你想查看数据库，检查你的pod，像这样运行一个命令，然后打开你的客户端应用。

```
kubectl port-forward wordpress-mysql-bc9864c58-ffh4c 3306:3306
```

## 结论
kind 对 minikube 来说是一个好的选择因为它只使用单个 Docker 容器。

通过跟集成到 Kubernetes 1.14 的 Kustomze 结合使用，在你本地的机器上尝试使用 Kubernetes 会更加简单。
