---
title: "使用 YAML 文件配置 Jenkins 流水线"
description: "这也是一种自定义流水线 DSL 的方法"
tags:
- pipeline
author: Matias De Santi
translator: zacker330
toc: true
---

几年前，我们的 CTO 写了一篇关于 [使用 Jenkins 和 Docker 为 Ruby On Rails 应用提供持续集成服务](https://medium.com/wolox-driving-innovation/ruby-on-rails-continuous-integration-with-jenkins-and-docker-compose-8dfd24c3df57) 的文章。这些年，我们一直使用这个 CI 流水线解决方案，直到我们最近决定做一次升级。为什么呢？

* Jenkins 的版本过低，已经很难升级
* [Wolox](http://www.wolox.co/) 过去几年增长显著，一直面临着如何伸缩的问题
* 只有极少数人如何修复 Jenkins 服务的问题
* 配置 Jenkins 任务不是一件简单的任务，使我们的项目启动过程变慢
* 更改每个作业运行的命令也不是一件简单的任务，并且有权限更改的人并不多。 Wolox 拥有广泛的项目，语言种类繁多，使得这个问题尤为突显。

考虑到这些问题，我们开始深入研究最新版的 Jenkins，看看如何提升我们的 CI 服务。我们需要构建一个新的CI服务，至少要解决以下问题：

* 支持 Docker 构建。我们的项目依赖的一个或多个 Docker 镜像的执行（应用，数据库，Redis 等）
* 如有必要，易于配置和复制
* 易于增加新项目
* 易于修改构建步骤。工作在项目上的所有人都应该能修改它，如果他们希望执行 `npm install` 或 `yarn install`

### 安装Jenkins和Docker

安装 Jenkins 非常简单，直接从 [官方教程](https://jenkins.io/download/) 选择一种方式安装。

以下是我们在 AWS 上的安装步骤：

```shell
sudo rpm — import https://pkg.jenkins.io/debian/jenkins.io.key
sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins.io/redhat/jenkins.repo
sudo yum install java-1.8.0 -y
sudo yum remove java-1.7.0-openjdk -y
sudo yum install jenkins -y
sudo yum update -y
sudo yum install -y docker
```

###  从 GitHub 上自动添加项目

从 Github 上自动添加项目可以通过 [GitHub Branch Source](https://plugins.jenkins.io/github-branch-source) 插件实现。它能将 GitHub 的组织中符合规则的项目自动添加到 Jenkins 中。唯一的约束就是在每一个分支下都必须有一个 Jenkinsfile，用于描述如何构建项目。

### 易于修改的配置

我们之前使用 Jenkins 最痛苦的是修改项目的构建步骤。在 Jenkins 任务中，你会看到像以下代码（用于构建）：

```shell
#!/bin/bash +x
set -e

# Remove unnecessary files
echo -e "\033[34mRemoving unnecessary files...\033[0m"
rm -f log/*.log &> /dev/null || true &> /dev/null
rm -rf public/uploads/* &> /dev/null || true &> /dev/null

# Build Project
echo -e "\033[34mBuilding Project...\033[0m"
docker-compose --project-name=${JOB_NAME} build

# Prepare test database
COMMAND="bundle exec rake db:drop db:create db:migrate"
echo -e "\033[34mRunning: $COMMAND\033[0m"
docker-compose --project-name=${JOB_NAME} run  \
        -e RAILS_ENV=test web $COMMAND

# Run tests
COMMAND="bundle exec rspec spec"
echo -e "\033[34mRunning: $COMMAND\033[0m"
unbuffer docker-compose --project-name=${JOB_NAME} run web $COMMAND

# Run rubocop lint
COMMAND="bundle exec rubocop app spec -R --format simple"
echo -e "\033[34mRunning: $COMMAND\033[0m"
unbuffer docker-compose --project-name=${JOB_NAME} run -e RUBYOPT="-Ku" web $COMMAND
```

在构建步骤后，执行 Docker 构建的清理工作：

```shell
#!/bin/bash +x
docker-compose --project-name=${JOB_NAME} stop &> /dev/null || true &> /dev/null
docker-compose --project-name=${JOB_NAME} rm --force &> /dev/null || true &> /dev/null
docker stop `docker ps -a -q -f status=exited` &> /dev/null || true &> /dev/null
docker rm -v `docker ps -a -q -f status=exited` &> /dev/null || true &> /dev/null
docker rmi `docker images --filter 'dangling=true' -q --no-trunc` &> /dev/null || true &> /dev/null
```

尽管这些命令并不复杂，但是更改其中的任何命令都需要具有权限的人员来操作相应的 Jenkins 任务，并清楚知道自己需要做什么。

### Jenkinsfile的成与败

使用当前的 Jenkins 版本，我们可以利用 [Jenkins pipeline](https://jenkins.io/doc/book/pipeline/) 对我们的构建流进行建模，并保存到一个文件中。 该文件会被签入代码库。因此，任何有权访问它的人都可以修改其中的步骤。棒极了。

Jenkins 流水线还支持：

* Docker 及多个镜像可用于构建
* 使用 `withEnv` 设置环境变量，还支持很多其它内建的 [函数](https://jenkins.io/doc/pipeline/steps/workflow-basic-steps/)

这为 Wolox 提供了完美的用例。我们可以将构建配置写入到一个被检入到代码库的文件中，并且允许任务有权限访问的人修改。但是，一个简单的 Rails 项目的 Jenkinsfile 看起来却像这样：

```groovy
# sample Jenkinsfile. Might not compile
node {
    checkout scm
    withEnv(['MYTOOL_HOME=/usr/local/mytool']) {
        docker.image("postgres:9.2").withRun() { db ->
            withEnv(['DB_USERNAME=postgres', 'DB_PASSWORD=', "DB_HOST=db", "DB_PORT=5432"]) {
                docker.image("redis:X").withRun() { redis ->
                    withEnv(["REDIS_URL=redis://redis"]) {
                        docker.build(imageName, "--file .woloxci/Dockerfile .").inside("--link ${db.id}:postgres --link ${redis.id}:redis") {
                            sh "rake db:create"
                            sh "rake db:migrate"
                            sh "bundle exec rspec spec"
                        }
                    }
                }
            }
        }
    }
}
```

这样的文件不仅难以理解，还难以修改。这样的构建逻辑非常容易被破坏，如果你不熟悉 Groovy。如果你对 Jenkins 流水线是如何工作的一无所知，就更容易了。这样，修改或增加一个新的 Docker 镜像就变得不简单，也容易导致混淆。

### 通过 YAML 配置 Jenkins 流水线

就个人而言，我总是期望为 CI 配置简单的配置文件。这次我们有机会构建使用 YAML 文件配置的 CI。经过分析，我们总结出以下这样的 YAML，它已经能满足我们的需求：

```yaml
config:
  dockerfile: .woloxci/Dockerfile
  project_name: some-project-name

services:
  - postgresql
  - redis

steps:
  analysis:
    - bundle exec rubocop -R app spec --format simple
    - bundle exec rubycritic --path ./analysis --minimum-score 80 --no-browser
  setup_db:
    - bundle exec rails db:create
    - bundle exec rails db:schema:load
  test:
    - bundle exec rspec
  security:
    - bundle exec brakeman --exit-on-error
  audit:
    - bundle audit check --update

environment:
  RAILS_ENV: test
  GIT_COMMITTER_NAME: a
  GIT_COMMITTER_EMAIL: b
  LANG: C.UTF-8
```

它描述了项目基本的配置、构建过程中需要的环境变量、依赖的服务、还有构建步骤。

### Jenkinsfile + Shared Libraries = WoloxCI

经过调研 Jenkins 和流水线之后，我们发现可以通过扩展共享库（shared libraries）来实现。共享库是用 Groovy 编写的，可以导入到流水线中，并在必要时执行。

如果你细心观察以下 Jenkinsfile，你会看到代码是一个接收闭包的方法调用链，我们执行另一个方法将一个新的闭包传递给它。

```groovy
# sample Jenkinsfile. Might not compile
node {
    checkout scm
    withEnv(['MYTOOL_HOME=/usr/local/mytool']) {
        docker.image("postgres:9.2").withRun() { db ->
            withEnv(['DB_USERNAME=postgres', 'DB_PASSWORD=', "DB_HOST=db", "DB_PORT=5432"]) {
                docker.image("redis:X").withRun() { redis ->
                    withEnv(["REDIS_URL=redis://redis"]) {
                        docker.build(imageName, "--file .woloxci/Dockerfile .").inside("--link ${db.id}:postgres --link ${redis.id}:redis") {
                            sh "rake db:create"
                            sh "rake db:migrate"
                            sh "bundle exec rspec spec"
                        }
                    }
                }
            }
        }
    }
}
```

Groovy 语言足够灵活，能在在运行时创建声明式代码，这使我们能使用 YAML 来配置我们的流水线！

### Wolox-CI介绍

wolox-ci 诞生于 Jenkins 的共享库。以下是关于 [Wolox-CI](https://github.com/Wolox/wolox-ci) 的具体使用方式。

使用 wolox-ci，Jenkinsfile 被精简成：

```groovy
@Library('wolox-ci') _
node {
  checkout scm
  woloxCi('.woloxci/config.yml');
}
```

它会检出代码，然后调用 wolox-ci。共享库代码会读取到 YAML 文件，如下：

```yaml
config:
 dockerfile: .woloxci/Dockerfile
 project_name: some-project-name

services:
 - postgresql
 - redis

steps:
 analysis:
 - bundle exec rubocop -R app spec –format simple
 - bundle exec rubycritic –path ./analysis –minimum-score 80 –no-browser
 setup_db:
 - bundle exec rails db:create
 - bundle exec rails db:schema:load
 test:
 - bundle exec rspec
 security:
 - bundle exec brakeman –exit-on-error
 audit:
 - bundle audit check –update

environment:
 RAILS_ENV: test
 GIT_COMMITTER_NAME: a
 GIT_COMMITTER_EMAIL: b
 LANG: C.UTF-8
```

然后，Jenkins 就会执行你的构建任务。

共享库有一个好处是我们可以集中扩展和修改我们的共享库代码。一旦添加新代码，Jenkins 就会自动更新它，还会通知所有的任务。

由于我们有不同语言的项目，我们使用 Docker 来构建测试环境。WoloxCI 假设有一个 Dockerfile 要构建，并将在容器内运行所有指定的命令。

### config.yml 各部分介绍

#### config部分

这是 config.yml 的第一部分，用于指定基本配置，包括项目的名称，Dockerfile 的路径。Dockerfile 用于构建镜像，所有的命令都运行在该镜像的容器中。

#### Services 部分

这部分定义了哪些服务被暴露到容器中。WoloxCI 支持以下开箱即用的服务：postgresql、mssql 和 redis。你还可以指定 Docker 镜像的版本。

增加一个新的服务类型也不难。你只需要在该目录下（https://github.com/Wolox/wolox-ci/tree/development/vars）添加，然后告诉共享库该服务是如何被转换的，如https://github.com/Wolox/wolox-ci/blob/development/src/com/wolox/parser/ConfigParser.groovy#L76

#### Steps 部分

在此部分列出的命令，都会被运行在 Docker 容器中。你可以在 Jenkins 界面上看到每一步的执行结果。


{{< img "/images/pipeline/stages-ui.png" >}}

#### Environment 部分

如果构建过程需要一些环境变量，你可以在这部分指定它们。Steps 部分中描述的步骤执行过程中，Docker 容器会提供你设置好的所有环境变量。

### 总结

目前，WoloxCI 还在我们所有项目中一小部分项目进行测试。这让有权限访问它的人通过 YAML 文件更改构建步骤。这是对我们 CI 工作流程来说是一个重大改进。

Docker 使我们轻松更换编程语言，而不用对 Jenkins 安装做任何的更改。并且，当检查到 GitHub 组织中的新项目（项目中有 Jenkinsfile）时，Jenkins GitHub Branch Source 插件会自动添加新的 Jenkins 项目。

所有这些改进节约了我们维护 Jenkins 的大量时间，并使我们可以轻松扩展而无需任何额外配置。

### 译者小结

本文最大的亮点是它介绍了一种实现自定义构建语言的方式。通过 Jenkins 的共享库技术，将构建逻辑从 Jenkinsfile 中移到了 YAML 文件中。同样的，我们可以将构建逻辑移动 JSON 文件中，或者任何格式的文件中，只你的共享库能解析它，并将它转换成 Jenkins 能理解的格式。
