---
title: "Java 应用使用 Docker 的入门指南：建立一个 CI/CD 流水线"
description: "本文是容器化现有 Java 应用以及使用 Jenkins 建立一个端到端部署流水线的指南"
date: 2019-04-10
tags:
- cd
- ci
- docker
- jenkins
- pipeline
author: Ravi Sankar
translator: donhui
original: https://dzone.com/articles/getting-started-with-docker-for-java-applications
---

Docker 已经非常出名并且更多的组织正在转向基于 Docker 的应用开发和部署。这里有一个关于如何容器化现有 Java Web 应用以及使用 Jenkins 为它建立一个端到端部署流水线的快速指南。

为此我使用了非常著名的基于 Spring 的宠物商店应用，它代表了一个很好的示例，因为大多数应用都遵循类似的体系结构。

## 步骤
1. 构建宠物商店应用。
2. 运行一次 Sonar 质量检查。
3. 使用该 Web 应用准备 Docker 镜像。
4. 运行容器以及执行集成测试。
5. 如果所有测试成功，推送该镜像到一个 dockerhub 账户。

所有的代码都在[这里](https://github.com/RavisankarCts/spring-framework-petclinic.git)。

这里是可用于以上步骤的 Jenkins 流水线代码：

![pipeline.png](pipeline.png)

```yaml
node {
    stage 'checkout'
    git 'https://gitlab.com/RavisankarCts/hello-world.git'
    stage 'build'
    sh 'mvn clean install'
    stage('Results - 1') {
         junit '**/target/surefire-reports/TEST-*.xml'
         archive 'target/*.jar'
        }
    stage 'bake image'
    docker.withRegistry('https://registry.hub.docker.com','docker-hub-credentials') {
        def image = docker.build("ravisankar/ravisankardevops:${env.BUILD_TAG}",'.')
        stage 'test image'
        image.withRun('-p 8888:8888') {springboot ->
        sh 'while ! httping -qc1 http://localhost:8888/info; do sleep 1; done'
        git 'https://github.com/RavisankarCts/petclinicacceptance.git'
        sh 'mvn clean verify'
        }
        stage('Results') {
         junit '**/target/surefire-reports/TEST-*.xml'
         archive 'target/*.jar'
        }
        stage 'push image'
        image.push()
    }
}
```

最初的步骤只是检出代码并运行构建。有趣的部分从这个步骤开始，它使用 dockerhub 凭证在 Docker 上下文中运行。

```yaml
step 3 'bake image'
docker.withRegistry('https://registry.hub.docker.com','docker-hub-credentials')
```

![docker-hub-credentials.png](docker-hub-credentials.png)

这个步骤构建 Docker 镜像。Docker build 命令将 dockerhub 仓库名称和 tag 名称作为一个参数，而构建位置作为另一个参数。

```yaml
def image = docker.build("dockerhub registry name":"tag name",'location of docker file')
def image = docker.build("ravisankar/ravisankardevops:${env.BUILD_TAG}",'.')
```

这里使用 Dockerfile 来构建 Docker 镜像。 Dockerfile 的内容如下：

```yaml
FROM tomcat:8
ADD target/*.war /usr/local/tomcat/webapps
```

下一步是运行镜像并执行测试：

```yaml
stage 'test image'
        image.withRun('-p 8888:8888') { springboot ->
        sh 'while ! httping -qc1 http://localhost:8888/info; do sleep 1; done'
        git 'https://github.com/RavisankarCts/petclinicacceptance.git'
        sh 'mvn clean verify'
}
```

withRun 步骤用来帮你运行你刚才构建的 Docker 镜像并暴露应用可以暴露的端口。我有另一个测试代码库，它被构建和执行，将对正在运行的镜像运行测试。

最后一步是推送该镜像到一个 dockerhub registry 或者你的组织建立的任何内部 registry 。

![docker-hub.png](docker-hub.png)

```yaml
stage('Results') {
         junit '**/target/surefire-reports/TEST-*.xml'
         archive 'target/*.jar'
        }
        stage 'push image'
        image.push()
```