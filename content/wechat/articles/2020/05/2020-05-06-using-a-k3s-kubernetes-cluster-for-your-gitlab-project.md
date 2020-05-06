---
title: 为你的 GitLab 项目使用 k3s Kubernetes 集群  
date: 2020-05-06  
description: 通过介绍以及实际操作展示了使用轻量的经过 Kubernetes 认证的 k3s 是如何集成到 GitLab 项目上的  
author: Luc Juggery  
poster: cover.jpg  
translator: 0N0thing  
original: https://medium.com/better-programming/using-a-k3s-kubernetes-cluster-for-your-gitlab-project-b0b035c291a9  
tags:
- Kubernetes  
- Programming  
- DevOps  
- Data Science  
- Software Development  
---

![cover](cover.jpg)

## TL;DR
k3s 是一个轻量级的 Kubernetes 发行版（小于 40 MB），它非常容易安装，仅需要 512 MB 的 RAM。对 IoT 设备、边缘计算以及运行 CI 任务来说均是一个完美的选择。这篇文章中，我将创建一个 k3s 集群然后向你们展示怎样将它集成到一个 GitLab 项目中。

## 关于 k3s
[k3s](https://k3s.io/) 是一款由 [Rancher Labs](https://rancher.com/) 开发的轻量级的 Kubernetes 发行版。

它作为 Kubernetes 认证的发行版使用最低的系统要求:

- Linux 3.10+
- 每个服务器 521 MB ram
- 每个节点 75 MB ram
- 200 MB 磁盘空间
- x86_64，ARMv7，ARM64

这使得 k3s 非常适合 IoT 相关的事物。

## 在 GitLab 创建一个项目
在安装 k3s 之前，我们先在 GitLab 上创建一个名为 *api* 的新项目。

![create-gitlab-project](create-gitlab-project.png)

创建完成后，我们进入到 *Operation* > *Kubernetes* 菜单。

![kubernetes-menu](kubernetes-menu.png)

这里我们有两种选择:

- 我们可以在 GKE（Google Kubernetes Engine）上创建一个 Kubernetes 集群。
- 我们可以导入一个已存在的 Kubernetes 集群的配置（不管在哪里创建的）。

**注意:** 最新版本的 GitLab，新集群只能在 GKE 中创建。[GitLab](https://medium.com/u/68f5136d3254?source=post_page-----b0b035c291a9----------------------)，有没有允许在其他 Kubernetes 提供商（AKS、EKS、DOKS...）创建集群的计划呢？:)

![create-cluster-on-GKE](create-cluster-on-GKE.png)

我们选择*添加现有集群*标签栏。

![add-existing-cluster](add-existing-cluster.png)

从这里我们能看到，我们需要填写几个栏位的配置信息提供给需要集成的集群。让我们保持这个页面为打开状态然后先创建一个  Kubernetes 集群。

## 创建 k3s 集群
我们将要基于 k3s 初始化一个 Kubernetes。为什么是 k3s 呢？因为我想展示一下设置它有多简单。:)简单起见，我们只设置一个单节点集群。

我已经配置了一个名为 *node1* 的 Ubuntu 18.04 的服务器。当我们在主机上启动一个 shell 程序后，我们仅需要运行如下命令安装 k3s，一个 Kubernetes 认证的集群。真的！

```
root@node1:~ $ curl -sfL [https://get.k3s.io](https://get.k3s.io/) | sh -
```

上面的命令跟快速安装 Docker 有些相似: `curl [https://get.docker.com](https://get.docker.com/) | sh`

安装完成后（真的非常快），用来连接集群的配置文件会在 /etc/rancher/k3s/k3s.yaml 中获取到。

```
**root@node1:~ $ cat /etc/rancher/k3s/k3s.yaml  
**apiVersion: v1  
clusters:  
- cluster:  
certificate-authority-data: LS0tL...tCg==  
server: https://localhost:6443  
name: default  
contexts:  
- context:  
cluster: default  
user: default  
name: default  
current-context: default  
kind: Config  
preferences: {}  
users:  
- name: default  
user:  
password: 48f4b...4b4e7  
username: admin
```

本地的 kubectl 自动配置为试用该配置。

```
$ kubectl get nodes  
NAME STATUS ROLES AGE VERSION  
node1 Ready master 3m v1.14.5-k3s.1
```

注意: 当我们参照文章最后的[快速入门](https://k3s.io/)添加额外的节点将会非常容易。它仅仅是从主节点 */var/lib/rancher/k3s/server/node-token* 获取一个令牌然后使用下面的命令加入到其他的节点:

```
$ curl -sfL [https://get.k3s.io](https://get.k3s.io/) | K3S_URL=https://myserver:6443 K3S_TOKEN=XXX sh -
```

## 集成到 GitLab
现在我们要收集将 k3s 集群集成到我们的 GitLab 项目中的所有信息。

- 集群名称

我们给它命名为 *k3s*。

- API Server 的 URL

在配置文件中，API Server 指定 https://localhost:6443。为了从外部获取，我们需要提供 *node1* 的外部 IP 地址。

- 集群的 CA 认证

为了提供集群到 GitLab 的 CA 认证，我们需要对配置中指定的证书进行解码（它以 base 64编码的）。

```
$ kubectl config view --raw \  
-o=jsonpath='{.clusters[0].cluster.certificate-authority-data}' \  
| base64 --decode
```

- Service 令牌

获取标识令牌的过程包含了几步。首先需要创建一个 `ServiceAccount` 并为其提供 `cluster-admin` 角色。可以通过下面的命令实现这个操作:

```
$ cat <<EOF | kubectl apply -f -  
apiVersion: v1  
kind: ServiceAccount  
metadata:  
name: gitlab-admin  
namespace: kube-system  
---
apiVersion: rbac.authorization.k8s.io/v1beta1  
kind: ClusterRoleBinding  
metadata:  
name: gitlab-admin  
roleRef:  
apiGroup: rbac.authorization.k8s.io  
kind: ClusterRole  
name: cluster-admin  
subjects:  
- kind: ServiceAccount  
name: gitlab-admin  
namespace: kube-system  
EOF
```

服务账号创建好之后，我们将检索 `secret` 类型关联的资源:

```
$ SECRET=$(kubectl -n kube-system get secret | grep gitlab-admin | awk '{print $1}')
```

下一步就是提取与密码相关联的的 JWT 令牌:

```
$ TOKEN=$(kubectl -n kube-system get secret $SECRET -o jsonpath='{.data.token}' | base64 --decode)  
$ echo $TOKEN
```

全部配置好之后，我们将收集起来的所有信息填入到 GitLab *添加已有集群* 表格中:

![add-existing-cluster-with-all-information](add-existing-cluster-with-all-information.png)

集群集成进来之后，我们可以直接从 web 页面安装 helm（Kubernetes 包管理工具）。

![instal-helm](instal-helm.png)

![instal-helm-2](instal-helm-2.png)

现在我们可以通过命令行检查一下 `tiller` 守护进程（helm 的服务器端组件）是否运行。

```
$ kubectl get deploy --all-namespaces | grep tiller
NAMESPACE NAME READY UP-TO-DATE AVAILABLE AGE  
gitlab-managed-apps tiller-deploy 1/1 1 1 67s
```

集群准备就绪，最重要的是，GitLab 的 web 页面允许一键安装其他组件:

- Ingress Controller 用来公开集群中运行的服务

- Cert-Manager 用来同 Let's Encrypt 配合管理 TLS 证书

- Prometheus 用来监控集群中运行的应用程序

- Knative 用来部署 Serveless 工作负载

- 等等。

![additional-components](additional-components.png)

## 总结

这篇文章中，我们看到了怎样创建 k3s 集群以及将它集成到 GitLab 项目。当然，该步骤同样适用于其他任何 Kubernetes 集群。

我们可以添加资源到项目中:

- 源码

- Dockerfile 指定了怎样通过代码创建一个 Docker 镜像

- Kubernetes 资源例如 Deployment，Service，...

- 一个 *gitlab-ci.yaml* 文件定义了 CI 流水线以及应用程序是怎样被部署和测试相关的 Kubernetes 集群

你或许会发现[上一篇文章](https://medium.com/better-programming/even-the-smallest-side-project-deserves-its-k8s-cluster-3fc6f8a65e13)很有用。它提供了另外的内容就是关于怎样创建 CI/CD 流水线。

你会为你的 GitLab 项目集成 Kubernetes 吗？
