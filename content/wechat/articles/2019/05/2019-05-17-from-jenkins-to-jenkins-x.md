---
title: "从 Jenkins 到 Jenkins X"
description: "这是一个关于 dailymotion 从 Jenkins 到 Jenkins X 的旅程，我们遇到的问题，以及我们是如何解决它们的故事"
date: 2019-05-17
tags:
- jenkins
- jenkins x
- kubernetes
- devops
- ci
- cd
author: Vincent Behar
translator: donhui
original: https://medium.com/dailymotion/from-jenkins-to-jenkins-x-604b6cde0ce3
poster: “./2019-05-20-from-jenkins-to-jenkins-x/journey.jpeg”
---

![journey](journey.jpeg)

这是一个关于 dailymotion 从 Jenkins 到 Jenkins X 的旅程，我们遇到的问题，以及我们是如何解决它们的故事。

## 我们的上下文
在 [dailymotion](https://www.dailymotion.com/) ，我们坚信 devops 最佳实践，并且在 Kubernetes 投入了大量投资。
我们的部分产品已经部署在 Kubernetes 上，但并不是全部。
因此，当迁移我们的广告技术平台的时候，我们想要完全采用“ Kubernetes 式”——或者云原生，以追随技术趋势！
这意味着要重新定义整个 CI/CD 流水线，从静态/永久环境迁移，转向动态按需分配环境。
我们的目标是**授权给我们的开发人员**，**缩短我们的上线时间**以及**降低我们的运营成本**。

对于新的 CI/CD 平台我们的初始需求是:
- **尽可能避免从零开始**：我们的开发人员已经习惯使用 Jenkins 和声明式流水线，并且它们可以很好地满足我们当前的需求。
- **以公有云基础设施为目标**——Google 云平台和 Kubernetes 集群
- **与 [gitops](https://www.weave.works/technologies/gitops/) 方法论兼容**——因为我们喜欢版本控制、同行评审和自动化

在 CI/CD 生态系统中有相当多的参与者，但是只有一个符合我们的需求，Jenkins X ，它基于 Jenkins 和 Kubernetes ，原生支持预览环境和 gitops

## Kubernetes 之上的 Jenkins
Jenkins X 的设置相当简单，并且[在他们的官方网站上已经有很好的文档](https://jenkins-x.io/zh/getting-started/create-cluster/)（译注：译者曾对 Jenkins X 文档中文本地化做了一些贡献，同时也期待更多的人参与以完善中文文档）。
由于我们已经使用了 Google Kubernetes Engine (GKE)，所以 `jx` 命令行工具自己创建了所有东西，包括 Kubernetes 集群。
这里有一个小小的*哇哦效果*，在几分钟内获得一个完整的工作系统是非常令人印象深刻的。

Jenkins X 提供了很多[快速入门和模板](https://github.com/jenkins-x-buildpacks)来增加*哇哦效果*，
然而，在 dailymotion ，我们已经有了带有 Jenkins 流水线的仓库，我们想要重用它们。
我们决定以"艰难的方式"做事情，并重构我们的声明式流水线，使它们与 Jenkins X 兼容。

实际上，这一部分并不针对 Jenkins X ，而是基于 [Kubernetes 插件](https://github.com/jenkinsci/kubernetes-plugin)在 Kubernetes 上运行 Jenkins 。
如果您习惯使用“经典的” Jenkins ，即在裸金属或虚拟机上运行静态代理，那么这里的主要更改是，每次构建都将在自己的短暂的 pod 上执行。
流水线的每个步骤都可以指定应该在 pod 的哪个容器上执行。
[在插件的源代码中有一些流水线的例子](https://github.com/jenkinsci/kubernetes-plugin/tree/master/examples)。
在这里，我们的"挑战"是定义容器的粒度，以及它们将包含哪些工具：需要足够的容器，以便我们可以在不同流水线之间重用它们的镜像，但也不能太多，以控制维护量——我们不想花时间重新构建容器镜像。

以前，我们通常在 Docker 容器中运行大多数流水线步骤，当我们需要自定义步骤时，我们在运行中的流水线中构建它，就在运行它之前。
虽然它比较慢，但是易于维护，因为所有内容都是在源代码中定义的。
例如，升级 Go 运行时的版本可以在一个 pull-request 中完成。
因此，要预先构建容器镜像听起来像是给现有设置增加了更多的复杂性。
它还有几个优点：仓库之间的重复更少，构建速度更快，并且不会因为某些第三方托管平台宕机而出现更多构建错误。

## 在 Kubernetes 上构建镜像
这些天将给我们带来一个有趣的话题：在 Kubernetes 集群中构建容器镜像。

![build-image](build-image.jpeg)

Jenkins X 附带了一组"构建打包"，使用 "Docker in Docker" 从容器内部构建镜像。
但是随着新的容器运行时的到来，Kubernetes 推出了它的[容器运行时接口( CRI )](https://kubernetes.io/docs/setup/cri/)，我们想要探索其他的选择。
[Kaniko](https://github.com/GoogleContainerTools/kaniko) 是最成熟的解决方案，符合我们的需求/技术栈。
我们很兴奋……

……直到我们遇到两个问题：
- 第一个问题对我们来说是一个阻塞问题:[多阶段构建](https://docs.docker.com/develop/develop-images/multistage-build/)不起作用。
多亏了谷歌，我们很快发现我们不是唯一受到影响的人，而且目前还没有解决办法。
然而，Kaniko 是用 Go 开发的，而我们是 Go 开发人员，所以……为什么不看看源代码呢?
事实证明，一旦我们理解了问题的根本原因，[修复就很容易了](https://github.com/GoogleContainerTools/kaniko/pull/369)。
Kaniko 维护者是很愿意帮忙的，并且快速地合并了修复，所以一天之后一个被修复的 Kaniko 镜像就已经可用了。
- 第二个问题是，我们不能使用同一个 Kaniko 容器构建两个不同的镜像。
这是因为 Jenkins 并没有按照预期的方式使用 Kaniko ——因为我们需要先启动容器，然后再运行构建。
这一次，我们找到了一个针对谷歌的解决方案：声明我们所需要的尽可能多的 Kaniko 容器来构建镜像，但是我们不喜欢它。
所以回到源代码，再一次，一旦我们理解了根本原因，[修复就很容易了](https://github.com/GoogleContainerTools/kaniko/pull/370)。

我们测试了一些解决方案来为 CI 流水线构建定制的"工具"镜像，
最后，我们选择使用一个单个仓库，每个分支对应一个 `Dockerfile` 和镜像。
因为我们将源代码托管在 Github 上，并且使用 Jenkins Github 插件来构建我们的仓库，
所以它可以构建我们所有的分支，并为 webhook 事件上的新分支创建新的任务，这使得管理起来很容易。
每个分支都有自己的 Jenkinsfile 声明式流水线，使用 Kaniko 构建镜像，并将其推入我们的容器注册中心。
这对于快速添加新镜像或编辑现有的镜像非常有用，因为我们知道 Jenkins 会处理好所有的事情。

## 声明所需资源的重要性
![containers](containers.jpeg)

我们在之前的 Jenkins 平台中遇到的一个主要问题来自静态的代理/执行器，在高峰时间有时构建队列很长。
Kubernetes 之上的 Jenkins 使这个问题很容易解决，主要是在 Kubernetes 集群上运行时，它能支持[集群自动伸缩](https://github.com/kubernetes/autoscaler)。
集群将根据当前负载简单地添加或删除节点。
但这是基于所请求的资源，而不是基于所观察到的使用的资源。
这意味着，作为开发人员，我们的工作是在构建 pod 模板中定义[所需的资源](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)( CPU 和内存)。
然后 Kubernetes 调度程序将使用此信息找到一个匹配的节点来运行 pod ——或者它可能决定创建一个新的节点。
这真是太好了，因为我们不再有长构建队列。
但相反，我们需要谨慎地定义我们所需资源的恰当数量，并在更新流水线时更新它们。
由于资源是在容器级别定义的，而不是在 pod 级别定义的，所以处理起来有点复杂。
但是我们不关心限制，只关心请求。
pod 的请求只是所有容器请求的相加。
因此，我们只是将整个 pod 的资源请求写在第一个容器上——或者 jnlp 容器上——它是默认的容器。
下面是我们使用的一个 Jenkinsfile 的例子， 也是我们如何声明请求的资源的例子:
```yaml
pipeline {
    agent {
        kubernetes {
            label 'xxx-builder'
            yaml """
kind: Pod
metadata:
  name: xxx-builder
spec:
  containers:
  - name: jnlp
```

## Jenkins X 上的预览环境
现在我们已经拥有了所有的工具，并且能够为我们的应用程序构建一个镜像，
我们准备下一步：将它部署到"预览环境"！

![preview](preview.jpeg)

Jenkins X 通过重用现有的工具——主要是 Helm ，使得部署预览环境变得很容易，
只要你遵循一些约定，例如用于镜像标签的值的名称。
最好是从"包"中提供的  Helm charts 复制/粘贴。
如果你不熟悉 Helm ，它基本上是一个 Kubernetes 应用程序包管理器。
每个应用程序都打包为一个 "chart" ，然后可以通过使用 helm 命令行工具作为一个 "release" 被部署。
预览环境是通过使用 jx 命令行工具进行部署的，该工具负责部署 Helm chart ，并以评论的形式，将所公开服务的 URL 添加到 Github pull-request 中。
这一切都非常好，而且对于我们第一个使用纯 http 的 POC 来说很有效。
但现在是2018年（译注：作者是在2018年写的这篇文章），没有人再使用 http 了。
让我们加密吧！
多亏了 cert-manager，当在 kubernetes 中创建 ingress 资源时，我们可以自动为我们的新域名获得一个 SSL 证书。
我们试图在我们的设置中启用 `tls-acme` 标志——与 cert-manager 进行绑定，但是它不起作用。
这给了我们一个机会来看看 Jenkins X 的源代码——它也是用 Go 开发的。
[稍作修复之后](https://github.com/jenkins-x/jx/pull/2129)都好了，
现在我们可以使用 [let's encrypt](https://letsencrypt.org/) 提供的自动化证书来享受安全的预览环境。

我们在预览环境中遇到的另一个问题与上述环境的清理有关。
每个打开一个 pull-request ，就创建一个预览环境，因此在 pull-request 被合并或关闭时应该删除预览环境。
这由 Jenkins X 设置的 Kubernetes 任务来处理，它删除了预览环境所使用的名称空间。
问题是这个任务不会删除 Helm release ——所以，比如如果您运行 helm list，您仍然会看到一个很大的旧的预览环境列表。
对于这个问题，我们决定改变使用 Helm 部署预览环境的方式。
Jenkins X 团队已经[写过关于 Helm 和 Tiller ( Helm 的服务器端组件)的这些问题](https://jenkins-x.io/news/helm-without-tiller/)，
因此，我们决定使用 `helmTemplate` 特性标志，只使用 Helm 作为模板渲染引擎，并使用 `kubectl` 处理生成的资源。
这样，我们就不会用临时预览环境"污染" Helm releases 列表。

## Gitops 应用到 Jenkins X
在初始化 POC 的某个阶段，我们对我们的设置和流水线感到满意，并希望将我们的 POC 平台转变为准生产的平台。
第一步是安装 SAML 插件以设置 OKTA 集成——以允许内部用户登录。
它运行得很好，几天后，我注意到我们的 OKTA 集成已经不再存在了。
我正忙着做其他事情，所以我只是问我的同事他是否做了一些改变，然后继续做其他事情。
但几天后再次发生时，我开始调查。
我注意到的第一件事是 Jenkins Pod 最近重新启动过。
但是我们有一个持久化的存储，我们的任务仍然在那里，所以是时候仔细看看了！
事实证明，[用于安装 Jenkins 的 Helm chart](https://github.com/jenkins-x/charts/tree/jenkins/stable/jenkins) 有一个启动脚本，
它从 Kubernetes `configmap` 重置了 Jenkins 配置。
当然，我们不能像在虚拟机上管理 Jenkins 那样管理在 Kubernetes 中运行的 Jenkins ！

因此，我们没有手动编辑 `configmap` ，而是后退一步，查看全局。
这个 `configmap` 本身由 [jenkins-x-platform](https://github.com/jenkins-x/jenkins-x-platform) 管理，
因此升级平台将重置我们的自定义更改。
我们需要将我们的"定制"存储在安全的地方并跟踪我们的更改。
我们可以用 Jenkins X 的方式，用一个 umbrella chart 来安装/配置一切，
但是这种方法有一些缺点：它不支持 "secret" ——
我们将一些敏感的值存储在我们的 Git 仓库中——
它"隐藏"了所有的 sub-charts 。
所以，如果我们列出所有已安装的 Helm releases ，我们将只看到一个。
但是还有其他基于 Helm 的工具，它们更对 Gitops 更友好。
[Helmfile](https://github.com/roboll/helmfile) 就是其中之一，它通过 [helm secrets 插件](https://github.com/futuresimple/helm-secrets)和 [sops](https://github.com/mozilla/sops)为 secrets 提供了原生支持。
我现在不会详细介绍我们的设置，但别担心，这将是我下一篇博客文章的主题！

## 迁移
![sunset](sunset.jpeg)

我们故事的另一个有趣的部分是从 Jenkins 到 Jenkins X 的实际迁移。
以及我们如何使用两个构建系统处理仓库。
首先，我们设置新的 Jenkins 来只构建 "jenkinsx" 分支，
并且更新了旧的 Jenkins 的配置来构建除 "jenkinsx" 分支之外的所有分支。
我们计划在 "jenkinsx" 分支中准备新的流水线，并将其合并以进行迁移。
对于我们的初始化 POC ，它工作得很好，但是当我们开始使用预览环境时，
我们必须创建新的 PR ，而这些 PR 不是基于新的 Jenkins 构建的，因为分支限制。
因此，我们选择在这两个 Jenkins 实例上构建一切，
但对于旧的 Jenkins 使用 `Jenkinsfile` 文件名，对于新的 Jenkins 使用 `Jenkinsxfile` 文件名。
迁移之后，我们将更新此配置并重命名文件，但这是值得的，
因为它使我们能够在两个系统之间进行平滑的转换，并且每个项目都可以自己迁移，而不会影响其他项目。

## 我们的目的地
所以，Jenkins X 为大家准备好了吗？老实说，我不这么认为。
并非所有功能和所支持的平台—— Git 托管平台或 Kubernetes 托管平台——都足够稳定。
但是，如果您准备投入足够的时间来深入研究，并选择适合您的使用场景的稳定特性和平台，
那么您将能够使用 CI/CD 等所需的一切来改进您的流水线。
这将缩短您的上线时间，降低您的成本，如果您对测试也很认真，那么请对您的软件质量充满信心。

一开始，我们说这是我们从 Jenkins 到 Jenkins X 的旅程。但我们的旅程并未结束，我们还在旅行中。
部分原因是我们的目标仍在移动：Jenkins X 仍处于大的发展阶段，而且它本身正在朝着 Serverless 的方向前进，
目前正在使用 [Knative 构建](https://github.com/knative/build) 的路上。
它的目的地是[云原生 Jenkins ](https://jenkins.io/blog/2018/08/31/shifting-gears/)。
它还没有准备好，但是您已经可以预览它的外观了。

我们的旅程还将继续，因为我们不希望它结束。
我们现在的目的地并不是我们的最终目的地，而是我们不断进化的一个步骤。
这就是我们喜欢 Jenkins X 的原因：因为它遵循相同的模式。
那么，你在等待什么来开始你自己的旅程呢？

![sea-and-canoe](sea-and-canoe.jpeg)

> 译注：译者曾对 Jenkins X 文档中文本地化做了一些贡献，同时也期待更多的人在 Jenkins X 旅程中，
> 能够参与到 [Jenkins 中文社区](https://jenkins-zh.cn/about/)以完善 Jenkins X 的中文文档。
