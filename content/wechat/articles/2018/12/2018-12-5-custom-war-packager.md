---
title: Custom WAR Packager
description: 打造你自己的 Jenkins！了解自定义 WAR/Docker Packager
tags:
- tools
- docker
- jenkins-x
- cloud-native
author: oleg_nenashev
translator: linuxsuren
share:
- AlaudaCloud
- linuxpk
---

我打算给 Jenkins 管理员和开发者介绍一个新的工具 
[Custom WAR Packager](https://github.com/jenkinsci/custom-war-packager)。该工具可以打包 Jenkins 的自定义 WAR 发行版、
[Docker 镜像](https://github.com/jenkinsci/docker)和 
[Jenkinsfile Runner](https://github.com/jenkinsci/jenkinsfile-runner) 包。
它可以打包 Jenkins、插件以及配置为开箱即用的发行版。
`Custom WAR Packager` 是我们在博客 
A Cloud Native Jenkins(/blog/2018/09/12/speaker-blog-a-cloud-native-jenkins/) 中介绍过的无状态 `Jenkins master` 工具链的一部分。这个工具链已经在 [Jenkins X][jenkins-x] 中被使用，用于构建 serverless 镜像(https://github.com/jenkins-x/jenkins-x-serverless)。

在这篇文章中，我将会介绍几种 `Custom WAR Packager` 常见的使用场景。

== 历史

正如 Jenkins 本身一样，`Custom WAR Packager` 开始于一个小的开发工具。在 Jenkins 内运行集成测试很长时间以来都是一个难题。
对此，我们有三个主要的框架：
    [Jenkins Test Harness](https://github.com/jenkinsci/jenkins-test-harness),
    [Acceptance Test Harness](https://github.com/jenkinsci/acceptance-test-harness),
    和 [Plugin Compatibility Tester](https://github.com/jenkinsci/plugin-compat-tester).
这些框架都需要一个 Jenkins WAR 文件来运行测试。但是假如你想在类似 AWS 一样的自定义环境中进行 Jenkins 测试呢？
或者，你希望基于 [Pluggable Storage](/sigs/cloud-native/pluggable-storage/) 的环境也可以复用 Jenkins 流水线测试，来确保没有回归缺陷？

这并不是一个无意义的问题。Jenkins 项目中有重大的活动正在进行：云原生 Jenkins、Jenkins Evergreen 以及 Jenkins X。
这些都需要很多集成测试来保障持续部署流程。为了复用已有的框架，我们需要打包一个自带配置的 WAR 文件，使得可以在已有的框架中运行集成测试。
这正是 Custom WAR Packager 于 2018年4月 创建的原因。到 2018年9月，它相继支持了 Docker 镜像和 Jenkinsfile Runner，
后者由 [Kohsuke Kawaguchi](https://github.com/kohsuke/) 创建并由 [Nicolas de Loof](https://github.com/ndeloof)
完善。

== 包含的内容？

Custom WAR Packager 是一个工具，可以作为命令行、Maven 插件或者 Docker 来用。
它从用户那获取配置和包。所有内容都由一个 YAML 配置文件管理：

image::/images/post-images/2018-10-16-cwp/cwp_flow.png[Custom WAR Packager 构建流程]

它支持多种输入类型。插件列表可以来自 YAML,`pom.xml` 或一个 BOM(jep:309[] 提出的 Bill of Materials) 文件。
Custom WAR Packager 不仅支持发布版本，还可以构建部署到 
[增量仓库](/blog/2018/05/15/incremental-deployment/) (Jenkins 核心及插件的 CD 流程 - jep:305[])，
甚至直接从 Git 或指定目录中构建。它允许构建的包来自任何源，而无需等待官方的发版。
构建过程也非常快，因为，插件已经通过 `Commit ID` 缓存到了本地的 Maven 仓库中。

Custom WAR Packager 还支持下面的配置选项：

** [Jenkins 配置即代码][casc-repo] 的 YAMl 文件
** [Groovy Hooks][groovy-hooks] （例如：预配置的 init hooks）
** 系统属性

== WAR 打包

每当这个库构建时会打包出来一个 WAR 文件。
通常，Custom WAR Packager 会根据下面对 Jenkins 核心和 JCasC 的配置把所有内容打包的一个 WAR 文件中。

样例配置：

```yaml
bundle:
  groupId: "io.jenkins.tools.war-packager.demo"
  artifactId: "blogpost-demo"
  vendor: "Jenkins project"
  description: "Just a demo for the blogpost"
war:
  groupId: "org.jenkins-ci.main"
  artifactId: "jenkins-war"
  source:
    version: 2.138.2
plugins:
  - groupId: "io.jenkins"
    artifactId: "configuration-as-code"
    source:
      # Common release
      version: 1.0-rc2
  - groupId: "io.jenkins"
    artifactId: "artifact-manager-s3"
    source:
      # Incrementals
      version: 1.2-rc259.c9d60bf2f88c
  - groupId: "org.jenkins-ci.plugins.workflow"
    artifactId: "workflow-job"
    source:
      # Git
      git: https://github.com/jglick/workflow-job-plugin.git
      commit: 18d78f305a4526af9cdf3a7b68eb9caf97c7cfbc
  # etc.
systemProperties:
    jenkins.model.Jenkins.slaveAgentPort: "9000"
    jenkins.model.Jenkins.slaveAgentPortEnforce: "true"
groovyHooks:
  - type: "init"
    id: "initScripts"
    source:
      dir: src/main/groovy
casc:
  - id: "jcasc"
    source:
      dir: casc.yml
```

== Docker 打包

为了打包 Docker，Custom WAR Packager 使用官方的 Docker 镜像 [jenkins/jenkins][jenkins-image]
或同样格式的其他镜像。构建中，WAR 文件会被该工具所替换。这也就意味着镜像的 **所有** 特色在该自定义构建中都可用：
`plugins.txt`, Java 选项, Groovy hooks 等等。

```yaml

## ...
## WAR configuration from above
## ...

buildSettings:
  docker:
    build: true
    # Base image
    base: "jenkins/jenkins:2.138.2"
    # Tag to set for the produced image
    tag: "jenkins/custom-war-packager-casc-demo"
```

例如：[示例][custom-war-packager-demo]
展示了打包带有将构建日志存储到 Elasticsearch 的 Docker 镜像。
尽管这些已经作为了 jep:207[] 和 jep:210[] 的一部分，你还是可以查看这个示例，了解该 Docker 镜像是如何配置、连接到 Elasicsearch、
然后启动外部的日志存储，而不需要改变日志的界面。一个 Docker Compose 文件对于运行整个集群是必要的。

== Jenkinsfile Runner 打包

这可能是 Jenkinsfile Runner 最有意思的模式。
三月份，在开发者列表中 [宣布](https://groups.google.com/d/msg/jenkinsci-dev/gjz3CDhi-kk/1mwi_oa0AQAJ)了
一个新的项目 [Jenkinsfile Runner][jenkinsfile-runner-repo]。
大体的思路是，支持在单一 master 上只运行一次并打印输出到控制台的 Jenkins 流水线。
Jenkinsfile Runner 作为命令或一个 Docker 镜像来运行。
虽然只推荐 Docker 的形式，但是 Custom WAR Packager 都能够生成。
有了 Jenkinsfile Runner 你可以像下面的方式来运行流水线：

```sh
docker run --rm -v $PWD/Jenkinsfile:/workspace/Jenkinsfile acmeorg/jenkinsfile-runner
```

当我们开始在云原生特别兴趣小组（Cloud Native SIG）中开始研究无状态（也就是“一次”）时，
有一个想法就是使用 Custom WAR Packager 和其他已有的工具（Jenkinsfile Runner, Jenkins Configuration as Code 等）来实现。
也许只是替换 Jenkinsfile Runner 中的 Jenkins 核心的 JAR 以及插件，但这还不够。
为了高效，Jenkinsfile Runner 镜像应该启动的 *很快*。在这个实现中，我们使用了 Jenkins 和 Jenkinsfile Runner 一些实验性的选项，
包括：类加载预缓存、插件解压等等。有了这些后，Jenkins 使用 configuration-as-code 和几十个插件可以在几秒钟内启动。

那么，如何构建自定义 Jenkinsfile Runner 镜像呢？尽管现在还没有发布，我们继续实现上面提到的内容。

```yaml
##...
## WAR Configuration from above
##...

buildSettings:
  jenkinsfileRunner:
    source:
      groupId: "io.jenkins"
      artifactId: "jenkinsfile-runner"
      build:
        noCache: true
      source:
        git: https://github.com/jenkinsci/jenkinsfile-runner.git
        commit: 8ff9b1e9a097e629c5fbffca9a3d69750097ecc4
    docker:
      base: "jenkins/jenkins:2.138.2"
      tag: "onenashev/cwp-jenkinsfile-runner-demo"
      build: true
```

你可以从 [这里][jenkinsfile-runner]
找到用 Custom WAR Packager 打包 Jenkinsfile Runner 的例子。

== 更多

还有很多其他的特色没有在本文中提到。例如：它还可以修改 Maven 构建配置或增加、替换 Jenkins 核心中的库（例如：Remoting）。
请查看 [Custom WAR Packager 文档][custom-war-packager-doc]
获取更多信息。这个库中还有很多示例。

如果你有兴趣对这个库做贡献，请创建 PR 并抄送 [@oleg-nenashev][oleg-nenashev]
和 [Raul Arabaolaza][raul-arabaolaza]，第二位维护者正在研究 Jenkins 自动化测试流程。

== 下一步？

还有很多值得改进的地方可以让这个工具更加高效：

* 增加对插件依赖传递的检查以便在构建过程中发现冲突
* 允许在 YAML 配置文件中设置各种系统属性和 Java 选项
* 改进 Jenkinsfile Runner 的性能
* 集成到 Jenkins 集成测试流程中，(查看 Jenkins 流水线库中的 [essentialsTest()][essentialsTest])

还有很多其他的任务需要在 Custom WAR Packager 中实现，但是，现在它已经能够让 Jenkins 用户构建他们自己的发行版。

[jenkins-x]: https://jenkins-x.io
[casc-repo]: https://github.com/jenkinsci/configuration-as-code-plugin
[groovy-hooks]: https://wiki.jenkins.io/display/JENKINS/Groovy+Hook+Script
[jenkins-image]: https://hub.docker.com/r/jenkins/jenkins/
[custom-war-packager-demo]: https://github.com/jenkinsci/custom-war-packager/tree/master/demo/external-logging-elasticsearch
[jenkinsfile-runner]: https://github.com/jenkinsci/custom-war-packager/tree/master/demo/jenkinsfile-runner
[jenkinsfile-runner-repo]: https://github.com/jenkinsci/jenkinsfile-runner
[custom-war-packager-doc]: https://github.com/jenkinsci/custom-war-packager/blob/master/README.md
[oleg-nenashev]: https://github.com/oleg-nenashev/
[raul-arabaolaza]: https://github.com/raul-arabaolaza
[essentialsTest]: https://github.com/jenkins-infra/pipeline-library/blob/master/vars/essentialsTest.groovy