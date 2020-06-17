---
title: "基于Docker的pipeline流水线 "
weight: 20
#pre: "<b> </b>"
chapter: true
draft: false
date: 2018-12-29T11:02:05+06:00
lastmod: 2020-01-05T10:42:26+06:00
# search related keywords
keywords: ["基于Docker的pipeline流水线"]
---






### 0. 整体架构

![images](../images/19.png)



### 1. 准备工作

配置JenkinsMaster挂载Docker

```shell
docker run --name jenkins -itd \
       -p 8081:8080 \
       -p 50000:50000 \
       -v ~/jenkins:/var/jenkins_home \
       -v /var/run/docker.sock:/var/run/docker.sock \
       -v /usr/local/bin/docker:/usr/bin/docker \
       jenkins/jenkins:lts
```



解决权限问题/以root用户运行

```shell
docker exec -it -u root jenkins bash
usermod -aG root jenkins

id jenkins
uid=1000(jenkins) gid=1000(jenkins) groups=1000(jenkins),0(root),1(daemon)
```



https://medium.com/swlh/getting-permission-denied-error-when-pulling-a-docker-image-in-jenkins-docker-container-on-mac-b335af02ebca

----



### 2. 测试流水线

```groovy
pipeline {
    agent {
        docker { 
            image 'maven:3.6.3-jdk-8' 
            args '-v $HOME/.m2:/root/.m2'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn -v'
            }
        }
    }
}
```

```
Started by user admin
Replayed #40
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/test
[Pipeline] {
[Pipeline] isUnix
[Pipeline] sh
+ docker inspect -f . maven:3.6.3-jdk-8
.
[Pipeline] withDockerContainer
Jenkins seems to be running inside container 5373edddcdadb63df5e5c6ed7f6149719ad749536242f10c06cbceca511a9898
$ docker run -t -d -u 1000:1000 -w /var/jenkins_home/workspace/test --volumes-from 5373edddcdadb63df5e5c6ed7f6149719ad749536242f10c06cbceca511a9898 -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** maven:3.6.3-jdk-8 cat
$ docker top 01102f26f8957fc7c46d0f9d1118e38316e313707357cdc5332c7d62836e1df2 -eo pid,comm
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Test)
[Pipeline] sh
+ mvn -v
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: /usr/share/maven
Java version: 1.8.0_242, vendor: Oracle Corporation, runtime: /usr/local/openjdk-8/jre
Default locale: en, platform encoding: UTF-8
OS name: "linux", version: "4.19.76-linuxkit", arch: "amd64", family: "unix"
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
$ docker stop --time=1 01102f26f8957fc7c46d0f9d1118e38316e313707357cdc5332c7d62836e1df2
$ docker rm -f 01102f26f8957fc7c46d0f9d1118e38316e313707357cdc5332c7d62836e1df2
[Pipeline] // withDockerContainer
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS

```



### 3. 前后端未分离项目

对于代码库中既包含前端项目又包含后端项目的配置。可以启动多个容器。

```groovy
pipeline {
    agent none
    stages {
        stage('ServiceBuild') {
            agent {
                docker { 
                    image 'maven:3.6.3-jdk-8' 
                    args '-v $HOME/.m2:/root/.m2'
                }
            }
            steps {
                sh 'mvn -v  && sleep 15'
            }
        }
      
        stage('WebBuild') {
            agent {
                docker { 
                    image 'node:7-alpine' 
                    args '-v $HOME/.npm:/root/.npm'
                }
            }
            steps {
                sh 'node -v  && sleep 15'
            }
        }
    }
}
```



### 4. 前端项目流水线

初始化前端项目

```
ZeyangdeMacBook-Pro:demo zeyang$ vue-init webpack test

? Project name test
? Project description A Vue.js project
? Author adminuser <2560350642@qq.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recom
mended) npm


ZeyangdeMacBook-Pro:~ zeyang$ cp -r demo/* jenkins/workspace/test/
ZeyangdeMacBook-Pro:~ zeyang$ cd jenkins/workspace/test
ZeyangdeMacBook-Pro:test zeyang$ ls
README.md		index.html		package.json
build			node_modules		src
config			package-lock.json	static
ZeyangdeMacBook-Pro:test zeyang$
```



编写jenkinsfile

```groovy
pipeline {
    agent none
    stages {
        stage('WebBuild') {
            agent {
                docker { 
                    image 'node:10.19.0-alpine' 
                    args '-u 0:0 -v /var/jenkins_home/.npm:/root/.npm'
                }
            }
            steps {
                sh """
                    id 
                    ls /root/.npm

                    #npm config set unsafe-perm=true
                    npm config list
                    npm config set cache  /root/.npm
                    #npm config set registry https://registry.npm.taobao.org
                    npm config list
                    ls 
                    cd demo && npm install  --unsafe-perm=true && npm run build  && ls -l dist/ && sleep 15 
                """
            }
        }
    }
}
```



```groovy
pipeline {
   agent {node {label "master"}}
    stages {
        stage('WebBuild') {
            steps {
                script {
                    docker.image('node:10.19.0-alpine').inside('-u 0:0 -v /var/jenkins_home/.npm:/root/.npm') {
                
                
                        sh """
                            id 
                            ls /root/.npm

                            ls /root/ -a
                            npm config set unsafe-perm=true
                            npm config list
                            npm config set cache  /root/.npm
                            #npm config set registry https://registry.npm.taobao.org
                            npm config list
                            ls 
                            cd demo && npm install  --unsafe-perm=true && npm run build  && ls -l dist/ && sleep 15 
                        """
                    }
                }
            }
        }
    }
}
```



### 5. FAQ

1. npm构建权限问题：使用root用户构建。设置容器运行用户 -u 0:0

2. npm打包慢问题： 

   2.1 挂载缓存卷 -v /var/jenkins_home/.npm:/root/.npm

   2.2 设置淘宝源 npm config set registry https://registry.npm.taobao.org



----





