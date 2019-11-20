---
type: tutorial
title: 使用 Jenkins 构建 Android 应用
author: Sakuragi
keywords:
- Android最佳实践
- Android
- 最佳实践
---

本教程将展示 Jenkins 如何使用 Jenkins 和 Gradle 构建一个简单的 Android 应用程序.

如果你是一个对 CI/CD 概念不了解的 Android 开发者， 或者你熟悉这些概念却不知道如何使用 Jenkins 完成构建，那么本教程很适合你。你将在 Github 上获取一个简单的 Android 应用项目，并包含单元测试。

耗时: 本教程需要 20-40 分钟来完成 (假设你的机器已经满足配置要求)。


## 配置要求
对于本教程，您将需要：

- 安装有 macOS，Linux 或 Windows 操作系统的机器，并拥有以下配置：

    - 最小 256MB 内存， 推荐 512MB 以上。  

    - 10GB 硬盘空间， 用于安装 Jenkins，您的 Docker 镜像和容器。

- 安装有以下软件:

    - Docker - 在安装Jenkins页面的[安装 Docker ](https://jenkins.io/doc/book/installing/#installing-docker)章节阅读更多信息。
注意: 如果您使用 Linux，本教程假定您没有以 root 用户的身份运行 Docker 命令，而是使用单个用户帐户访问本教程中使用的其他工具。

    - Git 和 GitHub Desktop。

## 在 Docker 中运行 Jenkins
在本教程中， 将 Jenkins 作为 Docker 容器并从 [jenkinsci/blueocean Docker](https://hub.docker.com/r/jenkinsci/blueocean/) 镜像中运行。

要在 Docker 中运行 Jenkins， 请遵循下面的 macOS 和 Linux 或 Windows 相关文档说明进行操作。

你可以在 Docker 和 Installing Jenkins 页面的 [Downloading and running Jenkins in Docker](https://jenkins.io/zh/doc/book/installing#downloading-and-running-jenkins-in-docker) 部分阅读更多有关 Docker 容器和镜像概念的信息。

## 在 macOS 和 Linux 系统上
1. 打开终端窗口

2. 使用下面的 docker run 命令运行 jenkinsci/blueocean 镜像作为 Docker 中的一个容器(记住，如果本地没有镜像，这个命令会自动下载):


```
docker run \
  --rm \
  -u root \
  -p 8080:8080 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$HOME":/home \ 
  jenkinsci/blueocean
```

     ①`-v jenkins-data:/var/jenkins_home` 表示将容器中的 /var/jenkins_home 目录映射到 Docker volume ，并将其命名为 jenkins-data。如果该卷不存在， 那么 docker run 命令会自动为你创建卷。  
     
     ② `-v "$HOME":/home \` 将主机上的`$HOME` 目录 (即你的本地)映射到 (通常是 /Users/<your-username> 目录) 到容器的 /home 目录。
    

3. 继续向导

## 在 Windows 系统
1. 打开命令提示窗口。

2. 使用下面的 docker run 命令运行 jenkinsci/blueocean 镜像作为 Docker 中的一个容器(记住，如果本地没有镜像，这个命令会自动下载):


```
docker run ^
  --rm ^
  -u root ^
  -p 8080:8080 ^
  -v jenkins-data:/var/jenkins_home ^
  -v /var/run/docker.sock:/var/run/docker.sock ^
  -v "%HOMEPATH%":/home ^
  jenkinsci/blueocean
```

    对这些选项的解释， 请参考上面的 macOS 和 Linux 说明。

3. 继续安装向导。

## 访问 Jenkins/Blue Ocean Docker 容器
如果你有一些使用 Docker 的经验，希望或需要使用 docker exec 命令通过一个终端/命令提示符来访问 Jenkins/Blue Ocean Docker 容器， 你可以添加如 --name jenkins-tutorials 选项(与上面的 docker run )， 这将会给 Jenkins/Blue Ocean Docker 容器一个名字 "jenkins-tutorials"。

这意味着你可以通过 docker exec 命令访问 Jenkins/Blue Ocean 容器(通过一个单独的终端 /命令提示窗口) ，例如:

    docker exec -it jenkins-tutorials bash
    
## 安装向导
在你访问 Jenkins 之前， 你需要执行一些快速的 "一次性" 步骤。

### 解锁 Jenkins
当你第一次访问一个新的 Jenkins 实例时， 要求你使用自动生成的密码对其进行解锁。

1. 当在终端/命令提示窗口出现两组星号时， 浏览 http://localhost:8080 并等待 Unlock Jenkins 页面出现。
![image](/images/tutorial/setup-jenkins-01-unlock-jenkins-page.jpg)  

2. 再次从终端/命令提示窗口， 复制自动生成的字母数字密码(在两组星号之间)。  
![image](/images/tutorial/setup-jenkins-02-copying-initial-admin-password.png)  

3. 在 Unlock Jenkins 页面， 粘贴该密码到 Administrator password 字段并点击 Continue。

### 使用插件自定义 Jenkins
在 解锁 Jenkins 后， Customize Jenkins 页面出现。

在该页面，点击 Install suggested plugins。

安装向导显示了正在配置的 Jenkins 的进程，以及建议安装的插件。这个过程肯需要几分钟。

### 创建第一个管理员用户
最后， Jenkins 要求创建你的第一个管理员用户。

- 当 Create First Admin User 页面出现， 在相应的字段中指定你的详细消息并点击 Save and Finish。

- 当 Jenkins is ready 页面出现， 点击 Start using Jenkins。  
Notes: **该页面可能表明 Jenkins is almost ready! 如果相反， 点击 Restart。**

- 如果该页面在一分钟后没有自动刷新， 使用你的 web 浏览器手动刷新。

如果需要，登录 Jenkins ， 你就可以开始使用 Jenkins了!

### 停止和重启 Jenkins
在本教程的其余部分， 你可以通过在终端/命令提示窗口输入 Ctrl-C`停止 Jenkins/Blue Ocean Docker 容器，也可以运行上面`docker run ... 命令。

要重启Jenkins/Blue Ocean Docker 容器:

1. 在上面的 macOS，Linux 或 Windows 上运行相同的 docker run ... 命令 。  
Note: **如果有更新的话，该进程会更新 jenkinsci/blueocean Docker 镜像。**

2. 浏览`http://localhost:8080`。

3. 等待直到登录页面出现并登陆。

## Fork 和 clone GitHub 示例仓库
通过将应用程序源代码所在的示例仓库 fork 到你自己的 Github 账号中， 并 clone 到本地，你就可以获取一简单的 Android 应用程序。

1. 请确保你登陆了你的 GitHub 账户。如果你还没有 Github 账户，你可以在 GitHub 网站 免费注册一个账户。

2. 将示例仓库[ jenkins-android-sample](https://github.com/Sakuragi/jenkins-android-sample) fork 到你的账户的 Github 仓库中。

3. 将你的 GitHub 账户中的 jenkins-android-sample 仓库 clone 到你的本地机器.确保你的项目路径为：  
    - macOS 系统配置为 /Users/<your-username>/Documents/GitHub/ jenkins-android-sample 

    - Linux 系统配置为 /home/<your-username>/GitHub/ jenkins-android-sample 

    - Windows 系统配置为 C:\Users\<your-username>\Documents\GitHub\ jenkins-android-sample 

## 在 Jenkins 中创建你的流水线项目
1. 回到 Jenkins，如果有必要的话重新登录，点击 Welcome to Jenkins! 下方的 create new jobs
注意: 如果你无法看见以上内容，点击左上方的 New Item。

2. 在 Enter an item name 域中，为新的流水线项目指定名称（例如 jenkins-android-sample）。

3. 向下滚动并单击 Pipeline，然后单击页面末尾的 OK 。

4. （ 可选 ） 在下一页中，在 Description 字段中填写流水线的简要描述

5. 点击页面顶部的 Pipeline 选项卡，向下滚动到 Pipeline 部分。

6. 在 Definition 域中，选择 Pipeline script from SCM 选项。此选项指示 Jenkins 从源代码管理（SCM）仓库获取你的流水线， 这里的仓库就是你 clone 到本地的 Git 仓库。

7. 在 SCM 域中，选择 Git。

8. 在 Repository URL 域中，填写你本地仓库的 目录路径， 这是从你主机上的用户账户 home 目录映射到 Jenkins 容器的 /home 目录：
    - MacOS系统 - /home/Documents/GitHub/jenkins-android-sample
    - Linux系统 - /home/GitHub/jenkins-android-sample
    - Windows系统 - /home/Documents/GitHub/jenkins-android-sample

9. 点击 Save 保存你的流水线项目。你现在可以开始创建你的 Jenkinsfile，这些文件会被添加到你的本地仓库。

## 创建 Jenkinsfile 为初始流水线

现在我们将开始创建初始流水线，它将使用 Jenkins 中的构建你的 Android 应用程序。 你的流水线将被创建为 Jenkinsfile，它将被提交到你本地的 Git 仓库（jenkins-android-sample）。

首先，创建一个初始流水线来下载 Android 编译环境的 Docker 镜像，并将其作为 Docker 容器运行。 同时添加一个“构建”阶段到流水线中，用于协调整个过程。

1. 使用你最称手的文本编辑器或者 IDE，在你本地的  jenkins-android-sample  Git 仓库的根目录创建并保存一个名为 Jenkinsfile 的文本文件。

2. 复制以下声明式流水线代码并粘贴到 Jenkinsfile 文件中：
```
pipeline{
    agent {
        docker {
            image 'allbears/jenkins-android:1.0.1' //①
        }
    }
    stages {
        stage('Build'){
             steps {
                sh './gradlew clean && rm -rf ./app/build/' //②
                sh './gradlew assembleRelease'  //③
             }
        }

    }

}
```
    ①这里的 image 参数是用来下载 allbears/jenkins-android:1.0.1 Docker 镜像 （如果你的机器还没下载过它）并将该镜像作为单独的容器运行。你也可以用 docker pull allbears/jenkins-android:1.0.1 预先将镜像下载到你的宿主机上。

    ② 这里的 sh step 是在编译前进行一些准备动作，对你的工程环境进行清理，确保工作时，编译工程环境干净。
 
 ③这里的 sh step 运行的是一个 gradle 构建 release 包的命令。
 
3. 保存对 Jenkinsfile 的修改并且将其提交到你本地的 jenkins-android-sample Git 仓库。例如，在 jenkins-android-sample 目录下，运行以下命令：  
git add .  
继续运行  
git commit -m "Add initial Jenkinsfile"  

4. 再次回到 Jenkins，如果有必要的话重新登录，点击左侧的 Open Blue Ocean 进入 Jenkins 的 Blue Ocean 界面。

5. 在 This job has not been run 消息框中，点击 Run，然后快速点击右下角出现的 OPEN 链接， 观察 Jenkins 运行你的流水线项目。如果你不能点击 OPEN 链接，点击 Blue Ocean 主界面的一行来使用这一特性。
注意： 你可能需要几分钟时间等待第一次运行完成。在 clone 了你的本地 jenkins-android-sample Git仓库后， Jenkins 接下来做了以下动作：  

    - 将项目排入队列等待在 agent 上运行。

    - 下载 jenkins-android Docker 镜像，并且将其运行在 Docker 中的一个容器中。
  
    - 执行 assembleRelease 包构建 Release 包
    
![image](/images/tutorial/jenkins-build.jpg) 

构建成功结束后，该界面将会变成绿色的，构建后的产物将会保存在 /var/jenkins_home/workspace/jenkins-android-sample/app/build/outputs/apk/release  目录下.
![image](/images/tutorial/jenkins-buildfinished.jpg)
点击上面的`X`就可以回到主界面

## 增加单元测试阶段
1. 打开你的 Jenkinsfile 文件，编辑
2. 下面的代码加入复制到你的 Jenkinsflie 中，保存

```
       stage('UnitTest'){   ①
             steps {
                sh './gradlew test' ②
             }
        }
```
    ①这里增加了一个 UnitTest 的 stage，之后会出现在 Jenkins UI 上。

    ②这里的 sh step 运行的是一个 gradle 执行单元测试的命令，该命令执行之后会进行单元测试。  
 
最终代码如下所示：

```
pipeline{
    agent {
        docker {
            image 'allbears/jenkins-android:1.0.1'
        }
    }
    stages {
        stage('Build'){
             steps {
                sh './gradlew clean && rm -rf ./app/build/'
                sh './gradlew assembleRelease'
             }
        }
       stage('UnitTest'){  
             steps {
                sh './gradlew test'
             }
        }

    }

}
```
 
3. 保存对 Jenkinsfile 的修改并将其提交到你的本地 jenkins-android-sample Git 仓库。例如，在 jenkins-android-sample 目录下，运行以下命令：  
git stage .  
继续运行  
git commit -m "Add 'Test' stage"


4. 再次回到 Jenkins，如果有必要的话重新登录，进入 Jenkins 的 Blue Ocean 界面。
5. 点击上方的运行，然后快速点击右下方出现的 OPEN 链接， 观察 Jenkins 运行你修改过的流水线项目。 如果你不能点击 OPEN 链接，点击 Blue Ocean 主界面的 top 行来使用这一特性。
![image](/images/tutorial/jenkins-unitTest.jpg)
6. 可以看到在我们的 UI 中增加了一个 UnitTest 的阶段，点击右上方的 X 回到 Blue Ocean 主界面。

## 流水线增加交付阶段
1. 回到你的文本编辑器/IDE，打开你的 Jenkinsfile。
2. 复制以下声明式流水线代码，并粘贴到 Jenkinsfile 中 UnitTest 阶段的下方：
```
        stage('Archive') {  ①
            steps {
                archiveArtifacts artifacts: 'app/build/outputs/**/*.apk'， fingerprint: true   ②
            }
        }
```
①定义了一个名为 Deliver 的 stage，之后会出现在 Jenkins UI 上。  
②这里的 sh step 执行一个归档构建产物的操作，执行完这步操作后我们将在任务界面看见我们执行成功后的产物输出。  

最终的代码如下:

```
pipeline{
    agent {
        docker {
            image 'allbears/jenkins-android:1.0.1'
        }
    }
    stages {
        stage('Build'){
             steps {
                sh './gradlew clean && rm -rf ./app/build/'
                sh './gradlew assembleRelease'
             }
        }
       stage('UnitTest'){
             steps {
                sh './gradlew test'
             }
        }
        stage('Archive') {  
            steps {
                archiveArtifacts artifacts: 'app/build/outputs/**/*.apk'， fingerprint: true 
            }
        }
    }

}
```

3. 保存对 Jenkinsfile 的修改并将其提交到你的本地 jenkins-android-sample Git 仓库。例如，在 jenkins-android-sample 目录下，运行以下命令：  
git stage .  
继续运行  
git commit -m "Add 'Archive' stage"
4. 再次回到 Jenkins，如果有必要的话重新登录，进入 Jenkins 的 Blue Ocean 界面。
5. 点击上方的运行，然后快速点击右下方出现的 OPEN 链接， 观察 Jenkins 运行你修改过的流水线项目。 如果你不能点击 OPEN 链接，点击 Blue Ocean 主界面的 top 行来使用这一特性。
 ![image](/images/tutorial/diliver.jpg)

可以看到我们的 UI 中多了一个 Archive 阶段，构建完成后点击X关闭回到我们 Job 主界面，我们可以发现这时多了一个产物的归档下载连接。
![image](/images/tutorial/archive.jpg)

## 总结
刚刚使用 Jenkins 构建了一个简单的 Android 应用程序，覆盖编译，测试，产物输出的全过程，当然其中还有些优化点，比如我们可以将编译环境中的 Gradle 路径挂载到宿主机，避免每次运行都需要下载依赖包。




