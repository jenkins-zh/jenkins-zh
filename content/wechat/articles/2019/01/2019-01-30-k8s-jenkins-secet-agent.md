---
title: "Jenkins 和 Kubernetes -云上的神秘代理"
description: "运行在 K8S 上的 Jenkins 动态节点"
tags:
- jenkinsworld
- jenkinsworld2018
- cloud-native
- kubernetes
author: devmandy
translator: yuzp1996
toc: true
shared_by:
- AlaudaCloud
- k8schina
---

最近我们构建和部署服务的方式与原来相比简直就是突飞猛进，像那种笨拙的、单一的、用于构建单体式应用程序的方式已经是过去式了。我们努力了这么久，终于达到了现在的效果。现在的应用为了提供更好的拓展性和可维护性，都会去拆解成各种相互依赖小、解耦性强的微服务，这些服务有各自的依赖和进度。如果你想去构建你所负责的服务，那么从一开始，就应该使用 CI/CD 的方式；当然，如果你走上了这条路， Jenkins 就是你的良师益友。


如果你是做微服务的话，那让我们在开始之前先花些时间想一想。如果你只在 Jenkins 上构建单体式应用程序，那你肯定每天都会运行很多 Jenkins job, 而且还要不厌其烦地运行很多次。所以，我们应该好好想清楚怎么样来做出一些改变来适应这种事情。其实只需要付出一些努力，Jenkins 就可以帮我们很好地解决这种事情。

### 我的 Jenkins 的进阶之路


作为一个 Devops 从业者，我遇到的最大问题是如何管理并优化自己的 Jenkins agent 结构。如果只是用 Jenkins 玩玩，实验性地跑一些流水线，那根本不用考虑 agent 的事情。如果你每天要跑成百上千条流水线的话，那考虑怎么去做优化就是一件非常非常重要的事情了。在 Jenkins 进阶之路中，我也尝试了各种不同的方式来寻找最好的 Jenkins agent 的使用方式。相信如果你也和我一样经历过，那下面这些事情你一定会很熟悉喽。

下面是我在这些年中使用 Jenkins 的各个阶段.

1. 所有的构建都在 master 节点上跑，在这个节点上运行所有的组件.
(我给这个阶段起了个可爱的名字， Hello Jenkins)
2. 创建一个 Jenkins EC2 代理，并且在这个代理上运行所有的构建，怎么说呢， 就是大而全，这个节点什么都能做。如果需要同时做多条任务，那就把这个大而全的节点克隆一份。 
(这个阶段我起的名字是  Monster Agent.)
3. 为每种服务创建不同的 Jenkins EC2 的节点
(这个阶段我起的名字叫做 Snowflake Agent.)
4. 在容器中运行流水线的所有步骤。 打个比方，在 Jenkins 中使用 [Docker Plugin](https://wiki.jenkins.io/display/JENKINS/Docker+Plugin) 这个插件将代理挂载到容器中，或者使用 multi-stage Dockerfiles 把所有构建，测试打包的流程都封装起来。这两种方法都是很好的容器抽象化的开端，并且允许您轻松地将制品从一个容器复制到另一个容器。当然了，每一种方法都是需要访问 Docker engine 的。为了让我的 Jenkins 代理能够正常工作，现在我用以下几种方式来管理 docker host
* 在我的 Jenkins 主容器中运行一个Docker engine - Docker in Docker (DinD)
* 把主机上的 Docker socket 挂载到我的容器中来，让我的容器能够以 sidecar 的方式运行。
* 为 Jenkins 主服务器配置单个外部 EC2 Docker 主机，以用于在容器中启动构建
* 使用 EC2 插件和包含 Docker Engine 的 AMI 动态启动代理，然后运行多阶段 Dockerfile 中的所有步骤


以上这些阶段各有利弊，但都是为了让我们从管理 Jenkins 节点中解放出来。不过，最近我又进阶到了另外一个阶段：Jenkins on Kubernetes.

一旦你在 Jenkins 中把构建节点和 job 都容器化了的话，迁移工作平台将变的十分简单易行。在这里郑重声明一下，在我用这个方法之前我一直没有接触过 Kubernetes，一次也没有。也就是说，在 Google Cloud Platform（GCP）GKE 中创建 Kubernetes 集群，使用 [Helm](https://helm.sh/) Chart启动 Jenkins master ,并在 Kubernetes 集群中的 Jenkins 代理中运行构建是非常简单的。

### 流水线脚本中启动 K8s 中的代理

这篇文章就是为了向大家说明，如何配置 Jenkins 才能使流水线脚本能够在 K8s 集群中启动 Jenkins 节点。首先你要先安装 [Kubernetes plugin](https://plugins.jenkins.io/kubernetes) 这个插件。有意思的是，当我用 Helm chart 来安装我的 Jenkins 时，安装好的 Jenkins 里面已经有了这个插件。还有一个前提，是你启动的 Jenkins 节点要和你的 Jenkins master 在同一个 K8s 集群里。

一旦在 K8s 中运行了你的 Jenkins master 节点，那只需要再简单地配置几步，就能启动一个小构建啦。


### 配置 Jenkins Master

为了保证 Jenkins 能够访问 K8s 集群的资源，首先你需要按照以下步骤创建一些凭据：

1. 进入 Jenkins 的 UI 界面，点击左边导航栏里的凭据链接
2. 点击 Stores scoped to Jenkins 列表下 global 中的 Add credentials (将鼠标悬停在链接旁边即可看到箭头)
3. 点击添加凭证
4. 写好 Kubernetes Service Account
5. 将范围设置为全局
6. 点击 OK 按钮

这样之后 Jenkins 就可以使用这个凭据去访问 K8s 的资源啦


### 在 Jenkins Master 中配置云

下一步就是在 Jenkins 中设置云的配置

1. 进入 Jenkins UI 界面，点击 系统管理 → 系统设置
2. 进入管理界面后查找 『云』，一般在下面，然后点击 『新增一个云』，选择 kubernetes 类型
3. 然后这些是必填的参数
* *Name*: 这个自定义， 默认的是`kubernetes`
* *Kubernetes URL*: `https://kubernetes.default`- 这个一般是从你的 service account 自动配置的
* *Kubernetes Namespace*: 一般是 `default`  除非你要在一个特殊的命名空间 ，否则不要动他
* *Credentials*: 选择上一步你创建的凭据
* *Jenkins URL*: `http://<your_jenkins_hostname>:8080`
* *Jenkins tunnel*: `<your_jenkins_hostname>:5555` - 这就是用来和 Jenkins 启动的 agent 进行交互的端口


![Jenkins Evergreen](https://jenkins.io/zh/images/post-images/2018-09-14-kubernetes-jenkins/image1.png)

你看，只需要几个参数就能在 K8s 集群中启动一些节点了，当然你的环境有需要的话，你也可以做一些其他的调整

现在你已经可以通过定义一些 pod 来让 Jenkins master 访问 K8s 集群了。pod其实是 K8s 中的概念，在一个 pod 中里面会有一个或者多个容器，它们共享网络还有存储，然后我们可以在这个 pod 中执行一些构建工作。每一个 Jenkins 节点都是作为 K8s pod 来启动的。这个 pod 里面经常都会包含一个默认的 JNLP 的容器，还有一些你在 pod 模板中定义的容器。现在有至少两种方法来定义你的 pod template。

### 通过 Jenkins UI 配置一个 pod template

1. 还是老地方  Manage Jenkins → Configure Systems
2. 还是老地方  找到之前配置 Jenkins K8s 的地方
3. 点击 Add Pod Template button 选择 Kubernetes Pod Template 
4. 输入下面的值

* *Name*:`自定义`
* *Namespace*: `default`-除非你想换个你在上一步自定义的命名空间
* *Labels*: `自定义` - 这个将用来匹配你在 jenkinsfile 中的 label 值
* *Usage*: 如果你想让这个 pod 作为默认节点的话，就选择 "Use this node as much as possible"， 如果选择 "Only build jobs with label matching expressions matching this node" 的话 那就是只有在 Jenkins 脚本中定义的label匹配的构建才能使用这个节点
* *The name of the pod template to inherit from*: - 这个可以置空. 现在还用不到
* *Containers*: 你想在这个 pod 中启动的容器，在下面会有详细的介绍
* *EnvVars*: 你想在 pod 中注入的环境变量 下面会有接受
* *Volumes*: 你想在 pod 中挂载的任何一种的卷

![Jenkins Evergreen](https://jenkins.io/zh/images/post-images/2018-09-14-kubernetes-jenkins/image2.png)

需要记住，在一个 pod 中会有不止一个容器，它们都是同生共死的。如果你是用 Helm chart 安装 Jenkins 的话，pod 中就会包含 JNLP 这个容器，这个容器也是 Jenkins agent 中必须包含的。然而为了完成更多的服务的构建，你还需要添加一些其他工具链的容器。


### 添加容器模板

1. 进入 Jenkins UI 界面，回到上一步创建 pod template 的地方
2. 点击 Add Container 按钮， 选择 Container Template
3. 输入下面的值
* *Name*:`自定义`
* *Docker image*: 根据你自己的需求来写，比如你在构建一个用 go 写的应用，那你就可以输入 `golang:1.11-alpine3.8`
* *Label*: 表明要用在流水线脚本中引用此容器模板的标签字符串
* *Always pull image*: - 如果你想让 pod 启动的时候都去拉取镜像 那就选择这个

![Container Template](https://jenkins.io/zh/images/post-images/2018-09-14-kubernetes-jenkins/image3.png)


你可以保留其他参数的默认值，但是你可以看到该插件可以对你的 pod 以及在其中运行的各个容器进行很详细地控制。你可以通过此插件设置在 Kubernetes pod 配置中的任何值。你还可以通过输入原始 YAML 来注入配置数据。你无需因选项过多而分心，选择配置它们中得一小部分就可以获得工作环境啦。



您可以单击容器模板中的“添加环境变量”按钮，将环境变量注入特定容器，也可以单击模板中的“添加环境变量”按钮，将环境变量注入所有的容器。
以下环境变量会自动注入默认的 JNLP 容器，来保障它能自动连接到 Jenkins 主服务器：

* `JENKINS_URL`: Jenkins 网页界面网址
* `JENKINS_JNLP_URL`: Jenkins 特定 slave 中 jnlp 的 url
* `JENKINS_SECRET`: 身份验证的密钥
* `JENKINS_NAME`: Jenkins 代理的名称

如果单击“添加卷”按钮，您将看到几个用于添加卷的选项,在这里我使用 Host Path Volume 选项将 docker socket 安装在 pod 中。然后，我可以运行安装了 Docker 客户端的容器，并且来构建和推送 Docker 镜像。

此时，我们为 Kubernetes 集群创建了一个云配置，并定义了一个由一个或多个容器组成的 pod。现在，我们如何使用它来运行 Jenkins 工作？
很简单，只需要我们在 Jenkins 流水线脚本中通过标签引用 pod 和容器就可以了。
本文中的示例是使用脚本流水线，当然您可以使用声明式流水线语法实现相同的结果：

```
node('test-pod') {
    stage('Checkout') {
        checkout scm
    }
    stage('Build'){
        container('go-agent') {
            // This is where we build our code.
        }
    }
}
```

###  用 jenkinsfile 来实现相同的功能
通过 UI 配置插件现在看起来是很不错的。但是有一个明显的问题是，配置不能像源代码一样能够进行版本控制和存储。幸运的是，您可以直接在 Jenkinsfile 中创建整个 pod 定义。哈哈，在 Jenkinsfile 中有什么你不能做的???

可以将 UI 或 YAML 定义中可用的任何配置参数添加到 `podTemplate` 和 `containerTemplate` 部分。
在下面的示例中，我已经定义了一个包含两个容器模板的 pod。
pod 标签将会用于节点，表示我们想要启动此 pod 的实例。
直接在节点内定义但没有在容器块中定义的任何步骤，都可以在默认的 JNLP 容器中运行。


容器块用于表示该容器块内的步骤应在具有给定标签的容器内运行。我已经定义了一个标签为 `golang` 的容器模板，我将用它来构建 Go 可执行文件，我最终将其打包成 Docker 镜像。在 `volumes` 中，我已经指出我想要挂载主机的 Docker 套接字，但我仍然需要 Docker 客户端使用 Docker API 与它进行交互。因此，我已经定义了一个标签为 `docker` 的容器模板，该模板使用安装了 Docker 客户端的镜像。

```
podTemplate(
    name: 'test-pod',
    label: 'test-pod',
    containers: [
        containerTemplate(name: 'golang', image: 'golang:1.9.4-alpine3.7'),
        containerTemplate(name: 'docker', image:'trion/jenkins-docker-client'),
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock',
        hostPath: '/var/run/docker.sock',
    ],
    {
        //node = the pod label
        node('test-pod'){
            //container = the container label
            stage('Build'){
                container('golang'){
                    // This is where we build our code.
                }
            }
            stage('Build Docker Image'){
                container(‘docker’){
                    // This is where we build the Docker image
                }
            }
        }
    })
```

在我的基于 Docker 的流水线脚本中，我构建了 Docker 镜像并将它们推送到了 Docker 仓库，对我来说，能够复制这些配置信息非常重要。完成后，我已准备好使用 `gcloud`（Google Cloud SDK）构建我的镜像，并将该镜像推送到 Google Container Registry，以便部署到我的 K8s 群集。

为此，我使用 gcloud 镜像指定了一个容器模板，并将我的 docker 命令更改为 gcloud 命令。
就这么简单！

```
podTemplate(
    name: 'test-pod',
    label: 'test-pod',
    containers: [
        containerTemplate(name: 'golang', image: 'golang:1.9.4-alpine3.7'),
        containerTemplate(name: 'gcloud', image:'gcr.io/cloud-builders/gcloud'),
    ],
    {
        //node = the pod label
        node('test-pod'){
            //container = the container label
            stage('Build'){
                container('golang'){
                    // This is where we build our code.
                }
            }
            stage('Build Docker Image'){
                container(‘gcloud’){
                    //This is where we build and push our Docker image.
                }
            }
        }
    })
```

在 Kubernetes 上运行 Jenkins master、 Jenkins 代理，构建和部署示例应用程序其实只花了我几个小时。但这之后，我花了一个周末的时间才深入了解了平台。如果你学得够快，我相信你在几天内就可以完全掌握并且灵活运用这个平台了。


