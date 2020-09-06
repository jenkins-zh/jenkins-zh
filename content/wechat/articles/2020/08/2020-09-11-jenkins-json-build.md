---
title: "Jenkins Json Build"
description: "使用JSON配置文件驱动Jenkins构建"
date: 2020-09-11
keywords:
- Jenkins
- Jenkins Shared Libraries
author: sunweisheng
poster: "jenkins-json-build-logo.png"
---

![logo-image](jenkins-json-build-logo.png)

## 项目背景

我所在的组织项目数量众多，使用的语言和框架也很多，比如Java、ReactNative、C# .NET、Android、iOS等，部署环境也是多种多样比如Tomcat、K8S、IIS、客户端应用是局域网内企业证书安装等，我们没有专门的配置管理员或构建部署专员，都是开发人员自己在Jenkins中写构建脚本，每个项目都有自己的构建脚本（Scripted Pipelines），但类型相同的项目比如都是Java或都是.NET项目之间，构建脚本其实都很类似，都是靠几个已存在的构建脚本改写出来的，其实开发人员对编写Jenkins构建脚本了解也不多，另外因为没有规则和约束，更没有代码复用的机制，构建部署工作很混乱和难以管理。

## 项目解决的问题

在上述情况下我们开发了[Jenkins-Json-Build](https://github.com/gyyx/jenkins-json-build)项目,该项目适合于有一些编程经验的人员在不需要了解Jenkins构建脚本如何编写的情况下，通过简单的配置Json文件，就可以轻松完成一个项目的获取源码、单元测试、代码检查、编译构建、部署等步骤，实现一个典型的CI过程，又因为此项目使用了Jenkins共享类库（Shared Libraries）机制，构建脚本复用率得到了大幅度提高，并且开发人员可以方便的扩展更多的功能，满足不同构建部署场景的需要，此项目非常适合那些开发人员自己管理构建部署的团队，通过Jenkins-Json-Build项目组织对构建部署过程进行了统一的管理和监督，又让每个项目有足够的灵活性和自主权满足各自项目构建部署的特殊性。

## 一个Java项目构建示例

### 构建服务器上需要安装的软件

构建服务器上需要安装Java、Maven和Sonar-Scanner（此项可选）。

* [JAVA安装](https://github.com/sunweisheng/Kvm/blob/master/Install-Java-18.md)
* [Maven安装](https://github.com/sunweisheng/Jenkins/blob/master/Install-Maven.md)
* [Sonar-Scanner](https://github.com/sunweisheng/Jenkins/blob/master/Install-SonarQube-8.3.md)

### 构建需要依赖的Jenkins插件

* JUnit
* JaCoCo

### Jenkinsfile文件内容

因为采用pipeline script from SCM构建方式，所以用Declarative Pipeline方式在Jenkinsfile中编写构建脚本：

```groovy
@Library('shared-library') _

pipeline {
  agent any
  parameters { //定义构建参数
    choice choices: ['-'], description: '请选择部署方式', name: 'deploy-choice'
  }
  stages {
    stage('初始化') {
      steps {
        script{
          //加载源码仓库根目录下的jenkins-project.json构建配置文件
          runWrapper.loadJSON('/jenkins-project.json')
          runWrapper.runSteps('初始化')
        }
      }
    }
    stage('单元测试') {
      steps {
        script{
          //执行单元测试步骤
          runWrapper.runSteps('单元测试')
        }
      }
    }
    stage('代码检查') {
      steps {
        script{
          //执行代码检查步骤，比如SonarQube
          runWrapper.runSteps('代码检查')
        }
      }
    }
    stage('编译构建') {
      steps {
        script{
          //执行编译步骤
          runWrapper.runSteps('编译构建')
        }
      }
    }
    stage('部署') {
      steps {
        script{
          //根据选择的部署方式执行部署步骤
          runWrapper.runStepForEnv('部署','deploy-choice')
        }
      }
    }
  }
}
```

上述Jenkinsfile文件可用于所有类型的项目构建，实际使用的时候一般还会用到以下三个Jenkins插件：

* [Agent Server Parameter Plugin 用于选择构建的Agent服务器](https://github.com/jenkinsci/agent-server-parameter-plugin)
* [Custom Checkbox Parameter Plugin 用于选择子项目进行构建多用于微服务项目](https://github.com/jenkinsci/custom-checkbox-parameter-plugin)
* [Git Parameter 用于现在分支构建](https://github.com/jenkinsci/git-parameter-plugin)

### JSON配置文件内容

```json
{
  "初始化": {
    "检查Java环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "java version \"1.8.0_211\"",
      "Script": {
        "输出Java版本": "java -version 2>&1"
      }
    },
    "检查Maven环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "Apache Maven 3.6.3",
      "Script": {
        "输出Maven版本": "mvn -v"
      }
    },
    "检查SonarScanner环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "SonarScanner 4.4.0.2170",
      "Script": {
        "输出SonarScanner版本": "sonar-scanner -v"
      }
    },
    "绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    }
  },
  "单元测试": {
    "执行Maven单元测试脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "Maven单元测试": "cd ${PROJECT_PATH};mvn clean test"
      }
    },
    "执行JUnit插件": {
      "Type": "JUNIT_PLUG_IN",
      "JunitReportPath": "**/${PROJECT_DIR}/**/target/**/TEST-*.xml"
    },
    "执行Jacoco插件": {
      "Type": "JACOCO_PLUG_IN",
      "classPattern":"${PROJECT_PATH}/target/classes",
      "InclusionPattern":"${PROJECT_PATH}/**",
      "LineCoverage":"95",
      "InstructionCoverage":"0",
      "MethodCoverage":"100",
      "BranchCoverage":"95",
      "ClassCoverage":"100",
      "ComplexityCoverage":"0"
    }
  },
  "代码检查": {
    "执行SQ代码扫描": {
      "Type": "SONAR_QUBE"
    }
  },
  "编译构建": {
    "执行Maven构建": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "Maven构建": "cd ${PROJECT_PATH};mvn clean package -U -DskipTests"
      }
    }
  },
  "部署": {
    "模拟部署脚本-1": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "拷贝文件": "echo 模拟拷贝文件"
      }
    },
    "模拟部署脚本-2": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "HTTP传输文件": "echo HTTP传输文件"
      }
    }
  }
}
```

说明：

```json
"检查Java环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "java version \"1.8.0_211\"",
      "Script": {
        "输出Java版本": "java -version 2>&1"
      }
```

该类型的节点不是必须的（但看几年前写的配置文件时很有用，对需要的构建环境一目了然），目的是检查构建服务器是否具备需要的构建环境，在命令的标准输出内未含有Success-IndexOf节点定义的字符串则执行失败，对应的另一个节点名称是Fail-IndexOf，标准输出如果含有Fail-IndexOf定义的字符串则执行失败，两者选择其一使用。

```json
"绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    }
```

将部署节点（Steps）内的具体构建步骤（Step）列表，绑定到名为deploy-choice的下拉菜单构建参数上。

```json
"执行JUnit插件": {
      "Type": "JUNIT_PLUG_IN",
      "JunitReportPath": "**/${PROJECT_DIR}/**/target/**/TEST-*.xml"
    }
```

使用Jenkins的JUnit插件生成Junit和TestNG的测试报告。

```json
"执行Jacoco插件": {
      "Type": "JACOCO_PLUG_IN",
      "classPattern":"${PROJECT_PATH}/target/classes",
      "InclusionPattern":"${PROJECT_PATH}/**",
      "LineCoverage":"95",
      "InstructionCoverage":"0",
      "MethodCoverage":"100",
      "BranchCoverage":"95",
      "ClassCoverage":"100",
      "ComplexityCoverage":"0"
    }
```

使用Jenkins的Jacoco插件检查单元测试覆盖度。

```json
"代码检查": {
    "执行SQ代码扫描": {
      "Type": "SONAR_QUBE"
    }
  }
```

执行SonarQube代码检查，需要在项目根目录下要创建sonar-project.properties配置文件，以Java项目的配置文件为例：

```conf
# must be unique in a given SonarQube instance
sonar.projectKey=Jenkins:Test-Java-Build

sonar.projectVersion=1.0

# Path is relative to the sonar-project.properties file. Defaults to .
sonar.sources=src
sonar.sourceEncoding=UTF-8
sonar.java.binaries=./target/classes
```

```json
"执行Maven构建": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "Maven构建": "cd ${PROJECT_PATH};mvn clean package -U -DskipTests"
      }
    }
```

该节点就是执行命令，这里具体构建命令是用mvn clean package -U -DskipTests命令完成的。

经过上述配置文件的执行，我们可以很简单的完成所有的构建步骤：

![project doc image](docs/images/jenkins-json-build-04.png)

这里篇幅有限，更多内容请到项目仓库查看比如：

* 构建JS项目
* 构建ReactNative项目
* 构建Android项目
* 构建iOS项目
* 构建.NET项目
* 构建多个子项目
* 构建成功和失败处理
* 在K8S内创建Pod进行构建

## 欢迎大家去关注、交流更多的关于Jenkins构建的问题和经验

项目地址：[Jenkins Json Build](https://github.com/gyyx/jenkins-json-build)
个人邮箱：sunweisheng@live.cn
