---
title: "在 Kubernetes 上使用 Jenkins "
description: "Jenkins 是一个功能强大的自动化和 CI/CD 工具，可以成为 Kubernetes 流水线的重要组成部分"
date: 2019-07-29
tags: 
- plugins
- pipeline 
- Kubernetes
- ci
- cd
keywords:
- Jenkins Kubernetes
- Kubernetes
- Jenkins
author:   Juan Ignacio Giro
original: https://dzone.com/articles/leveraging-jenkins-on-kubernetes
translator: baobeizuoshoubuli
toc: true  
poster: "./2019-07-29-leveraging-jenkins-on-kubernetes/sea.jpg"
---

![sea](sea.jpg)  

​有几种方法可以在 DevOps 环境中管理您的云基础架构。 DevOps 是一种鼓励快速流动的应用程序开发以及促进 IT 团队开发、测试、发布过程无缝无缝衔接的方法。

Jenkins 通过自动化将持续集成（CI）和持续交付（CD）无缝集成到开发流程中来优化工作流程。 

可以使用 Kubernetes 中的 Jenkins pod 部署这些技术， Jenkins pod 可以根据团队的具体需求进行扩展。 

## CI/CD 流水线

Jenkins 是 CI/CD 的同义词，它是自动化开发、部署应用程序和微服务的完美工具，目前是市场上最流行的自动化工具。 Jenkins 拥有1000多个插件，可以轻松地与其他系统（包括 Kubernetes ）集成。插件不仅提供多系统集成，而且显著增强了 Jenkins 的能力，使 Jenkins 能够帮助您构建和部署几乎任何类型的项目。我们在[另一篇文章](https://caylent.com/jenkins-plugins/)中介绍了生活中最需要的20个 Jenkins 插件。 

​由于 Jenkins 和 Kubernetes 的原生兼容性，设置自己的 CI/CD 流水线非常容易。与基于 VM 的部署相比，在 Kubernetes 上部署 Jenkins 优势更明显。例如，获得按需拥有特定于 Jenkins slaves (代理)项目的能力，而不是让一个 vm 池空闲等待任务。它将使用 master-agent  体系结构来完全自动化微服务的创建和部署以及测试和部署所需的环境。 

​可以使用 [Helm](https://github.com/helm/helm)、[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) 或 GUIs 部署 Jenkins ，以便将新的 pods 部署到集群中。安装后，下一步是为 [K8s](https://plugins.jenkins.io/kubernetes) 配置 Jenkins 插件。我们需要配置系统设置，例如，代理在哪里找到 Jenkins master ，代理将使用的 Docker 镜像等。当然，将 Jenkins 配置为与 CI/CD 工作流一起工作也是至关重要的，包括设置测试和部署参数以及要如何设置 Jenkins 控制的集群。一旦 Jenkins 启动并运行，就可以实现一个完全自动化的连续交付环境。 

## 在 Jenkins 中设置一个流水线

​让 Jenkins 启动只是一个开始，下一步是在 Jenkins 内配置 CI/CD 流水线。 你可以先运行 `minikube service Jenkins` ，然后使用其 Web UI 访问 Jenkins。

​然后，您可以选择安装必要的插件。 根据您要创建的流水线，您可能需要下载并安装合适的插件，以实现流水线自动化以及更好的管理。必须使用 [Kubernetes 插件](https://plugins.jenkins.io/kubernetes)。

​另一个值得讨论的插件是 [Kubernetes Continuous Deploy 插件](https://plugins.jenkins.io/kubernetes-cd)，它专门为处理流水线的持续交付设计的。 该插件将处理为测试创建新的 pods 以及测试和部署之间的转换。

​配置完所有插件后，重新启动 Jenkins。 Jenkins 提供的一个很好的功能能够自动执行这些手动更改，因此下次您配置 CI/CD 系统（例如，在基础结构迁移的情况下）时，不必再次通过手动更改。 您只需接收一个具有与以前相同配置和插件的实例。嵌入到 Jenkins Docker 镜像和 Jenkins 配置文件 config.xml 中的脚本 install_plugins.sh 实现了这一功能。

​现在，您可以继续创建您的第一个流水线，为它分配凭据，并开始在流水线内部进行开发。记住， Jenkins 并不总是从本地存储中提取代码；您需要在第一次配置时手动发出推送请求。

​创建第一个流水线，然后您可以通过优化 minikube 立即运行新应用程序。在大多数 CI/CD 工作流中，手动推送请求实际上很方便，因为现在您可以通过流水线更好地控制想要推送的代码。 

## 在不同的情况下推动变化

​当您打开应用程序代码并对其进行更改时， Jenkins 不会立即更新部署包。相反，您必须提交更改并等待 Jenkins 提取这些更改（取决于代码签出的配置方式），然后才能执行其他操作。

​在 Jenkins 用户界面上，有一个 Build now 命令用于运行新的构建。构建完成后，下次使用 Minikube 运行应用程序时，您将看到所做的更改。 Jenkins 流水线的配置方式使该工具非常有用。 

​例如，您可以使用 Jenkins 来支持多团队开发。 Jenkins 流水线作为代码运行，这意味着具有正确凭据的任何用户都可以提交更改并执行流水线中内置的流程。 

​它也非常通用。 如果服务器突然崩溃，流水线及其中的进程将自动恢复。 Jenkins 永远不会失去对它管理的集群的控制权，因此您可以使用 Jenkins完全消除对 CI / CD 环境的手动配置的需要。 

​我个人最喜欢的是 Jenkins 管理多个流水线的方式，管理员可以清楚地查看系统中的所有流水线。再加上暂停和恢复流水线的能力，管理微服务和大型项目的开发使用 Jenkins 非常有帮助。 

​另外的伟大的插件是[流水线](https://github.com/jenkinsci/pipeline-plugin)和[多分支流水线](https://plugins.jenkins.io/workflow-multibranch)，它帮助我们可视化 CI/CD 流。它允许在 repo 中定义一个 jenkins 文件，包括我们希望 jenkins 执行的所有步骤。不需要从 GUI 进行手动配置（可能只保留给管理员），并且允许开发人员灵活地控制给定项目/分支的流程。由于它在 Github 中，因此它也可以与任何其他应用程序库一起进行版本控制。

## Jenkins 和 Kubernetes

​让我们回到我们的主要观点：在 Kubernetes 上使用 Jenkins 。从 Jenkins 工具的工作方式来看，很容易看出这种自动化度量如何完美地补充了 Kubernetes 。一旦配置了插件，每次触发新的构建/任务， Jenkins 都会在 K8s 中创建一个 Pod （通过设计用于执行该工作的按需代理）。一旦完成， Pod 将被销毁，从而避免了有固定的代理池等待任务执行的需要。如您所见， Kubernetes 为每个开发团队提供了强大的 CI/CD 基础架构，而 Jenkins 则大大简化了对该环境的管理。 

​这种组合能够在不同的情况下改进 [CI/CD 工作流](https://dzone.com/articles/learn-how-to-setup-a-cicd-pipeline-from-scratch)，包括在更大的开发项目中。如果你考虑到大量 Jenkins 插件的可用性，包括 [Kubernetes 流水线](https://plugins.jenkins.io/kubernetes-pipeline-steps)、[凭据](https://plugins.jenkins.io/kubernetes-credentials)以及目前已经可用的更多插件，您就会知道您有一个强大的 CI/CD 工具可以使用。甚至有能力将流水线中的非安装工作和材料工作分开；没道理不爱它？  

这篇文章最初发表在[这里](https://caylent.com/leveraging-jenkins-on-kubernetes/)。 