---
title: "KubeSphere DevOps 初体验，内置 Jenkins 引擎"
description: "基于 Kubernetes 安装 KubeSphere 并开启 DevOps 系统"
date: 2020-06-30
tags:
- jenkins
- kubesphere
- devops
- open source
author: FeynmanZhou
poster: "https://pek3b.qingstor.com/kubesphere-docs/png/20200628225840.png"
---

## 初识 KubeSphere

KubeSphere 是在 Kubernetes 之上构建的以应用为中心的多租户容器平台，提供全栈的 IT 自动化运维的能力，简化企业的 DevOps 工作流。KubeSphere 提供了运维友好的向导式操作界面，帮助企业快速构建一个强大和功能丰富的容器云平台。KubeSphere 支持部署在任何基础设施环境，提供在线与离线安装，支持一键升级与扩容集群，并且各功能组件支持模块化和可插拔的安装。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628233746.png)

## 解读 KubeSphere DevOps

KubeSphere DevOps 作为 KubeSphere 容器平台的一个可插拔功能组件，内置了 Jenkins 作为在 Kubernetes 之上的 CI/CD 引擎。借助 Jenkins 丰富的插件体系和易于进行扩展开发的特性，帮助 DevOps 团队在一个统一的平台中，打通开发、测试、构建、部署、监控、日志与通知等流程。KubeSphere 为 DevOps 团队打造了以容器为载体的端到端的应用交付平台，实现从应用开发、持续集成、单元测试、制品构建到应用的生产交付，所有的流程都是一个完整的闭环。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628225840.png)

KubeSphere DevOps 充分利用和释放 Kubernetes 动态扩展的能力。例如，KubeSphere 在内置的 DevOps 系统使用了 Jenkins Kubernetes 的动态 Agent，这样的方案相较于传统虚拟机上的 Jenkins 要更加灵活敏捷。同时，在 KubeSphere DevOps 中内置了常用的 Agent 类型，例如 Maven、Node.js、Go 等，并且还支持自定义与扩展的 Agent 类型。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628172418.png)

除了基于 Jenkins 引擎打造的 CI/CD 流水线，KubeSphere 还为业务开发者提供了自动化打包部署的工具集。业务开发者即使还没有深入了解 Docker 与 Kubernetes 的机制，也可以借助 KubeSphere 内置的自动化 CD 工具，如 Binary to Image 和 Source to Image。用户只需要提交一个仓库地址，或上传 JAR/WAR/Binary 等二进制文件，即可快速将制品打包成 Docker 镜像并发布到镜像仓库，最终将服务自动发布至 Kubernetes 中，无需编写一行 Dockerfile。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628225803.png)

关于 KubeSphere DevOps 更多的介绍，可以参考 KubeSphere 官网（`https://kubesphere.io/devops/`）获得更进一步的了解。

## 在 Kubernetes 安装 KubeSphere 开启 DevOps 组件

以下步骤将基于 Kubernetes 集群演示如何安装 KubeSphere v2.1.1，并开启 KubeSphere DevOps 组件。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628233230.png)

## 前提条件

> - 已有 Kubernetes 集群，并且 `Kubernetes` 版本： `1.15.x ≤ K8s version ≤ 1.17.x`。若没有 K8s 环境可参考文档（`https://kubesphere.com.cn/docs/zh-CN/installation/all-in-one/`）在 Linux 环境安装；
> - 集群能够访问外网，若无外网请参考 **在 Kubernetes 离线安装 KubeSphere**，地址 `https://kubesphere.com.cn/docs/installation/install-on-k8s-airgapped/`

## 安装 Helm 和 Tiller

> 提示：若集群已有 Helm 和 Tiller，可跳过本节操作。

1. 从 Helm 的 GitHub `https://github.com/helm/helm/releases/tag/v2.16.3` 下载 `helm-v2.16.3-linux-amd64.tar.gz`。

2. 上传到服务器，解压移动 Helm、Tiller 到 `/usr/local/bin/`：

```
[root@k8s-node1 linux-amd64]# cp helm /usr/local/bin/
[root@k8s-node1 linux-amd64]# cp tiller /usr/local/bin/
```

3. 验证 Helm 的安装：

```
helm help
```

4. 创建权限：

创建一个新的文件 `helm_rbac.yaml`，内容如下：

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

5. 然后使用 kubectl 使其创建生效。

```
[root@k8s-node1 k8s]# kubectl apply -f helm_rbac.yaml
serviceaccount/tiller created
clusterrolebinding.rbac.authorization.k8s.io/tiller created
```

6. 初始化 Helm，这里用的国内的镜像源。

```
helm init --service-account=tiller --tiller-image=registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.3 --history-max 300
```

7. 验证 Helm Tiller。如果状态是 `ImagePullBackOff`，表示镜像未拉取成功，需要手动拉取。

```
kubectl -n kube-system get pods|grep tiller
```

8. 检查 Tiller 是否部署到 Kubernetes：

```
[root@k8s-node1 local]# kubectl get pod -n kube-system -l app=helm
NAME                             READY   STATUS    RESTARTS   AGE
tiller-deploy-7b76b656b5-m4k2x   1/1     Running   0          94s
```

## 安装持久化存储与 StorageClass

> 提示：
> - 若您的集群已有持久化存储与 StorageClass，可跳过本小节
> - OpenEBS 将使用 LocalPV 作为存储卷，仅建议用作开发测试环境，生产环境建议使用如 Ceph、GlusterFS 等独立的分布式存储服务
> - 安装之前，请确保 master 节点没有 Taints (待安装完 KubeSphere 之后再添加 Taints)

1. 确认 master 节点是否有 Taint，如下看到 master 节点有 Taint。

```
$ kubectl describe node master | grep Taint
Taints:             node-role.kubernetes.io/master:NoSchedule
```

2. 去掉 master 节点的 Taint：

```
$ kubectl taint nodes master node-role.kubernetes.io/master:NoSchedule-
```

3. 创建 OpenEBS 的 namespace，OpenEBS 相关资源将创建在这个 namespace 下：

```
$ kubectl create ns openebs
```

4. 安装 OpenEBS

```
helm init

helm install --namespace openebs --name openebs stable/openebs --version 1.5.0
```

5. 安装 OpenEBS 后将自动创建 4 个 StorageClass，查看创建的 StorageClass：

```
$ kubectl get sc
NAME                        PROVISIONER                                                AGE
openebs-device              openebs.io/local                                           10h
openebs-hostpath            openebs.io/local                                           10h
openebs-jiva-default        openebs.io/provisioner-iscsi                               10h
openebs-snapshot-promoter   volumesnapshot.external-storage.k8s.io/snapshot-promoter   10h
```

6. 如下将 `openebs-hostpath` 设置为 **默认的 StorageClass**：

```
$ kubectl patch storageclass openebs-hostpath -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
storageclass.storage.k8s.io/openebs-hostpath patched
```

7. 至此，OpenEBS 的 LocalPV 已作为默认的存储类型创建成功。可以通过命令 `kubectl get pod -n openebs` 来查看 OpenEBS 相关 Pod 的状态，若 Pod 的状态都是 running，则说明存储安装成功。

## kubectl 安装 KubeSphere

当 Kubernetes 集群满足前提条件，实际上安装 KubeSphere 的步骤非常简单，仅一条命令。根据集群资源情况，使用 kubectl 安装 KubeSphere。

## 最小化安装 KubeSphere

若集群可用 CPU > 1 Core 且可用内存 > 2 G，可以使用以下命令最小化安装 KubeSphere：

```yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

> 提示：若您的服务器提示无法访问 GitHub，可将 `kubesphere-minimal.yaml` 从 GitHub 地址 `https://github.com/kubesphere/ks-installer/` 拷贝文件保存到本地作为本地的静态文件，再参考上述命令进行安装。

## 验证与访问

1. 查看滚动刷新的安装日志，请耐心等待安装成功。

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

> 说明：安装过程中若遇到问题，也可以通过以上日志命令来排查问题。

2. 通过 `kubectl get pod --all-namespaces` 查看 KubeSphere 相关 namespace 下所有 Pod 状态是否为 Running。确认 Pod 都正常运行后，可使用 `IP:30880` 访问 KubeSphere UI 界面，默认的集群管理员账号为 `admin/P@88w0rd`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191020153911.png)

3. 登录控制台首页，查看集群状态。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628233341.png)

## 开启 KubeSphere DevOps 的安装

1. 通过修改 ks-installer 的 ConfigMap 可以选装可插拔的功能组件，执行以下命令开启 KubeSphere DevOps 系统：

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
devops:
      enabled: True
      jenkinsMemoryLim: 2Gi
      jenkinsMemoryReq: 1500Mi
      jenkinsVolumeSize: 8Gi
      jenkinsJavaOpts_Xms: 512m
      jenkinsJavaOpts_Xmx: 512m
      jenkinsJavaOpts_MaxRAM: 2g
      sonarqube:
        enabled: True
```

2. 保存退出，安装任务将自动在后台执行。等待几分钟，若看到 ks-installer 日志返回安装成功的日志，即可通过以下命令来验证 KubeSphere DevOps 系统下相关 Pod 与 Job 的状态：

```
kubectl get pod -n kubesphere-devops-system
```

3. 若 Pod 状态都是 Running，并且在 KubeSphere 控制台的服务组件看到 DevOps 相关服务都是 **健康** 状态，说明 KubeSphere DevOps 系统已成功开启安装。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628232202.png)

可参考如下文档进一步上手 KubeSphere DevOps 系统的功能：

> - `Binary-to-Image：` 将 WAR、JAR、Binary 这一类的制品快速打包成 Docker 镜像，并发布到镜像仓库中，最终将服务自动发布至 Kubernetes，参考文档 **https://kubesphere.com.cn/docs/zh-CN/quick-start/b2i-war**；
> - `Source-to-Image：` 无需写 Dockerfile，仅输入源代码地址即可自动打包成可运行程序到 Docker 镜像的工具，方便构建镜像发布至镜像仓库和 Kubernetes，参考文档 **https://kubesphere.com.cn/docs/zh-CN/quick-start/source-to-image**
> - `图形化构建流水线：` 通过图形化编辑的界面构建流水线，无需写 Jenkinsfile，交互友好，参考文档 **https://kubesphere.com.cn/docs/zh-CN/quick-start/jenkinsfile-out-of-scm**
> - `基于 Jenkinsfile 构建流水线：` 基于项目仓库中已有的 Jenkinsfile 快速构建流水线，参考文档 **https://kubesphere.com.cn/docs/zh-CN/quick-start/devops-online**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628235151.png)

## 活动预告

KubeSphere 将在七月份重磅发布 v3.0！欢迎大家关注和报名参加 **6 月 30 日 （本周二下午 14:00）** 的 KubeSphere 线上发布会的直播，提前知晓 v3.0 的重大更新。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200628075312.png)
