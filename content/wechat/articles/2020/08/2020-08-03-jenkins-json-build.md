---
title: "Jenkins Json Build"
description: "使用JSON配置文件驱动Jenkins构建"
date: 2020-08-25
keywords:
- Jenkins
- Jenkins Shared Libraries
author: sunweisheng@live.cn
poster: "jenkins-json-build-logo.png"
---

![logo-image](jenkins-json-build-logo.png)

此项目是依靠Jenkins共享类库（Shared Libraries）机制，使用JSON配置文件驱动构建过程，以便于使开发人员不必编写大量的Jenkins构建脚本并且在众多项目中抽象复用Jenkins构建脚本的执行过程，此类库非常适合管理构建项目数量众多并且构建种类繁杂的工作场景，可以依靠一个或几个构建模版配合每个项目中的json构建配置文件，实现既统一管理又灵活多变的软件项目构建管理方案。

* [共享类库源码](https://github.com/sunweisheng/jenkins-json-build/tree/master/shared-library)
* [示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example)

## 内容列表

1. [准备工作](#准备工作)
1. [创建Jenkins流水线任务](#创建Jenkins流水线任务)
1. [Json文档格式及运行方式](#json文档格式及运行方式)
1. [Json中的变量](#json中的变量)
1. [统一的构建脚本](#统一的构建脚本)
1. [构建Java项目](#构建Java项目)
1. [构建JS项目](#构建JS项目)
1. [构建ReactNative项目](#构建ReactNative项目)
1. [构建Android项目](#构建Android项目)
1. [构建iOS项目](#构建iOS项目)
1. [构建.NET项目](#构建NET项目)
1. [构建多个子项目](#构建多个子项目)
1. [构建成功和失败处理](#构建成功和失败处理)
1. [在K8S内创建Pod进行构建](#在K8S内创建Pod进行构建)
1. [最简构建脚本](#最简构建脚本)

## 准备工作

1. [安装Jenkins](https://github.com/sunweisheng/Jenkins/blob/master/Install-Jenkins.md)
1. [了解Jenkins共享类库](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
1. [安装 Gitlab](https://github.com/sunweisheng/Kvm/blob/master/Install-Gitlab.md)
1. [安装Git客户端](https://git-scm.com/downloads)
1. [了解共享类库项目构成](https://github.com/sunweisheng/Jenkins/blob/master/Global-Shared-Library.md)【非必须】

## 创建Jenkins流水线任务

### 依赖插件

* [Pipeline Utility Steps](https://github.com/jenkinsci/pipeline-utility-steps-plugin)

### 新建流水线

在Jenkins系统中新建一个流水线任务：
![project doc image](jenkins-json-build-01.png)
创建完成后：

* 将任务配置的定义修改为pipeline script from SCM
* SCM修改为Git，Repository URL修改为项目仓库地址
* 取消最下面的轻量级检出复选框（因为以后会和Git Parameter插件冲突）
* Additional Behaviours中选择高级的克隆行为，将克隆和拉取操作的超市时间（分钟）设定为10分钟（因为有的项目比较大首次克隆会比较慢）

![project doc image](jenkins-json-build-02.png)
最后保存退出。

### 项目目录中需要的文件

项目目录下需要两个文件，Jenkinsfile和jenkins-project.json，可以从[【示例文件】](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/json-structure)获得，其中Jenkinsfile是Jenkins在获得项目源码之后自动执行的构建脚本文件，jenkins-project.json是本项目需要的构建配置文件（jenkins-project.json是默认的json构建配置文件名称也可以在脚本中修改为其他文件名称）。

### 配置共享类库

在系统配置中需要对共享类库进行设置，共享类库设置如下：shared-library是共享类库的名字，以后在构建脚本中会用到，项目仓库中是共享类库的仓库地址。
![project doc image](jenkins-json-build-03.png)
将本项中shared-library目录下的resources、src、vars三个目录（[类库源码](https://github.com/sunweisheng/jenkins-json-build/tree/master/shared-library)）拷贝到共享类库的仓库中。

### 运行流水线任务

新建流水线任务完成后，点击立即构建，完成构建过程：
![project doc image](jenkins-json-build-04.png)

## Json文档格式及运行方式

上述示例中构建分为5个阶段：初始化、代码检查、单元测试、编译构建、部署，构建脚本如下（以下是Declarative方式，也可转换为Scripted方式）：

```groovy
@Library('shared-library') _

pipeline {
	agent any
	stages {
		stage('初始化') {
			steps {
				script{
					runWrapper.loadJSON('/jenkins-project.json')
					runWrapper.runSteps('初始化')
				}
			}
		}
		stage('代码检查') {
			steps {
				script{
					runWrapper.runSteps('代码检查')
				}
			}
		}
		stage('单元测试') {
			steps {
				script{
					runWrapper.runSteps('单元测试')
				}
			}
		}
		stage('编译构建') {
			steps {
				script{
					runWrapper.runSteps('编译构建')
				}
			}
		}
		stage('部署') {
			steps {
				script{
					runWrapper.runSteps('部署')
				}
			}
		}
	}
}
```

具体构建时执行的步骤是在项目仓库根目录下的jenkins-project.json文件中定义：

```json
{
  "初始化": {
    "执行脚本": {
      "Type": "COMMAND_STDOUT",
      "Script": {
        "脚本-1": "echo 初始化脚本-1",
        "脚本-2": "echo 初始化脚本-2"
      }
    }
  },
  "代码检查": {
    "执行脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "脚本-1": "echo 代码检查脚本-1",
        "脚本-2": "echo 代码检查脚本-2"
      }
    }
  },
  "单元测试": {
    "执行脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "脚本-1": "echo 单元测试脚本-1",
        "脚本-2": "echo 单元测试脚本-2"
      }
    }
  },
  "编译构建": {
    "执行脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "脚本-1": "echo 编译构建脚本-1",
        "脚本-2": "echo 编译构建脚本-2"
      }
    }
  },
  "部署": {
    "执行脚本": {
      "Type": "COMMAND_STATUS_FOR",
      "For": "1,2,3",
      "ScriptTemplate": "echo 编译构建脚本-${loop-command-for}"
    }
  }
}
```

定义构建具体步骤的json配置文件中，节点名字大多数情况下可以随意定义（除GlobalVariable节点和RuntimeVariable节点），重点是第一层级的节点代表要执行构建步骤的步骤集合（Steps），上述示例中第一层节点对应着Jenkinsfile文件中定义的stage中的steps，使用runWrapper.runSteps()方法执行其中的具体构建步骤（当然在Jenkinsfile中一个steps括号内执行多次runSteps()也是可以的）。

在Steps中可以定义一个或多个具体的构建步骤（Step）节点，每一个Step节点内需要有一个Type节点来声明执行步骤的操作类型，共享类库通过识别Type确定执行方式，上述出现的三个Type是：

* COMMAND_STDOUT：执行命令行脚本并输出脚本的标准输出内容
* COMMAND_STATUS：执行命令行脚本并输出脚本的返回值（0代表成功，非0代表失败）
* COMMAND_STATUS_FOR：循环创建需要执行的脚本然后用COMMAND_STATUS方式执行

其实任何类型的构建步骤节点都可以包含Script子节点，并且Script子节点中可以包含多条命令。

查看构建日志：

```text
开始执行[/root/.jenkins/workspace/Test-Jenkins-Json-Build/jenkins-project.json]的[初始化]
开始执行[初始化]的[执行脚本]
开始执行[脚本-1]的[echo 初始化脚本-1]命令
bash: no job control in this shell
执行完成[初始化脚本-1]
开始执行[脚本-2]的[echo 初始化脚本-2]命令
bash: no job control in this shell
执行完成[初始化脚本-2]
执行[执行脚本]完成
执行[初始化]完成
开始执行[/root/.jenkins/workspace/Test-Jenkins-Json-Build/jenkins-project.json]的[代码检查]
开始执行[代码检查]的[执行脚本]
开始执行[脚本-1]的[echo 代码检查脚本-1]命令
bash: no job control in this shell
代码检查脚本-1
执行完成[0]
开始执行[脚本-2]的[echo 代码检查脚本-2]命令
bash: no job control in this shell
代码检查脚本-2
执行完成[0]
执行[执行脚本]完成
执行[代码检查]完成
开始执行[/root/.jenkins/workspace/Test-Jenkins-Json-Build/jenkins-project.json]的[单元测试]
[Pipeline] echo
开始执行[单元测试]的[执行脚本]
开始执行[脚本-1]的[echo 单元测试脚本-1]命令
bash: no job control in this shell
单元测试脚本-1
执行完成[0]
开始执行[脚本-2]的[echo 单元测试脚本-2]命令
bash: no job control in this shell
单元测试脚本-2
执行完成[0]
执行[执行脚本]完成
执行[单元测试]完成
开始执行[/root/.jenkins/workspace/Test-Jenkins-Json-Build/jenkins-project.json]的[编译构建]
开始执行[编译构建]的[执行脚本]
开始执行[脚本-1]的[echo 编译构建脚本-1]命令
bash: no job control in this shell
编译构建脚本-1
执行完成[0]
开始执行[脚本-2]的[echo 编译构建脚本-2]命令
bash: no job control in this shell
编译构建脚本-2
执行完成[0]
执行[执行脚本]完成
执行[编译构建]完成
开始执行[/root/.jenkins/workspace/Test-Jenkins-Json-Build/jenkins-project.json]的[部署]
开始执行[部署]的[执行脚本]
开始执行[For-1]的[echo 编译构建脚本-1]命令
bash: no job control in this shell
编译构建脚本-1
执行完成[0]
开始执行[For-2]的[echo 编译构建脚本-2]命令
bash: no job control in this shell
编译构建脚本-2
执行完成[0]
开始执行[For-3]的[echo 编译构建脚本-3]命令
bash: no job control in this shell
编译构建脚本-3
执行完成[0]
执行[执行脚本]完成
执行[部署]完成
Finished: SUCCESS
```

从日志中可以看出构建步骤的执行是按照jenkins-project.json的节点定义进行的，所以同一个Jenkinsfile脚本会根据每个项目内不同的jenkins-project.json文件执行不同的构建内容。

（PS：因为在执行脚本前都添加了#!/bin/bash -il命令，目的是加载/etc/profile定义的环境变量，所以每个命令脚本执行时都会有一个bash: no job control in this shell提示，虽然不影响执行但这个问题如果有解决方案请告诉我）

## json中的变量

为了在json中方便配置构建步骤节点，本项目允许在json文档中定义变量并使用变量简化配置内容（因为实际工作中会有大量重复的配置信息）。变量的作用域概念与编写程序一致：就近原则，GlobalVariable节点定义的变量作用域是整个文档，但在每个节点内可以用Variable节点定义多个局部变量，如果Variable变量名称和GlobalVariable定义的变量名称相同，局部变量则会覆盖GlobalVariable定义的全局变量（就近原则），并且Variable定义的局部变量离开定义的节点后则无效，另外定义变量和使用变量有先后顺序，如果在使用之前文档没有定义该变量则变量无效，在定义变量之后使用变量才是正确的，定义变量和引用变量示例：

```json
//定义变量
//在GlobalVariable节点或Variable节点内
"变量名": "变量值"

//使用变量
//在定义变量之后任何节点的内容中都可以引用变量
"节点名称": "${变量名称}"
```

在文档中可使用Jenkins的env全局变量，比如BUILD_NUMBER、JOB_NAME、JENKINS_URL等，也可以在运行时使用json配置文件中的RuntimeVariable节点定义自己的env变量，还可以直接用GlobalVariable和Variable节点直接在文档中定义全局和局部变量，上述变量加载的顺序是：文档首先加载Jenkins的env全局变量（含构建参数变量）、然后是RuntimeVariable节点定义的变量、然后是GlobalVariable节点定义的变量、最后是Variable节点定义的变量，按照上述变量加载顺序，变量加载后就能使用，其中Jenkins的env全局变量会隐式的加载到文档的全局变量中不用声明即可使用，以下是定义变量和使用变量的示例([示例文件](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/json-variable))：

Jenkinsfile文件内容：

```groovy
@Library('shared-library') _

pipeline {
	parameters { //定义构建参数
        choice choices: ['部署全部'], description: '请选择部署方式', name: 'deploy-choice'
    }
	agent any
	stages {
		stage('输出变量值') {
			steps {
				script{
					runWrapper.loadJSON('/jenkins-project.json')
					runWrapper.runSteps('测试变量')
				}
			}
		}
	}
}
```

jenkins-project.json文件内容:

```json
{
  "RuntimeVariable": {
    //Deploy_Choice是构建参数
    "JENKINS_PARAMS_DEPLOY": "echo ${deploy-choice}",
    //BUILD_URL是Jenkins的env全局变量
    "JENKINS_BUILD_URL": "echo ${BUILD_URL}",
    //会执行pwd命令获取当前目录
    "SCRIPT_PWD": "pwd",
    //执行脚本获取git commit的信息
    "SCM_CHANGE_TITLE": "git --no-pager show -s --format=\"%s\" -n 1"
  },
  "GlobalVariable": {
    //使用RuntimeVariable的JENKINS_PARAMS_DEPLOY变量值
    "GV_PARAMS_DEPLOY": "${JENKINS_PARAMS_DEPLOY}",
    //使用RuntimeVariable的JENKINS_BUILD_URL变量值
    "GV_BUILD_URL": "${JENKINS_BUILD_URL}",
    //定义一个全局的健值对变量
    "GV_VAR": "gv_var_value",
    //定义一个全局的健值对变量
    "TEMP_VAR": "temp_var_value"
  },
  "测试变量": {
    "输出RuntimeVariable变量脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "输出JENKINS_PARAMS_DEPLOY": "echo ${JENKINS_PARAMS_DEPLOY}",
        "输出JENKINS_BUILD_URL": "echo ${JENKINS_BUILD_URL}",
        "输出SCRIPT_PWD": "echo ${SCRIPT_PWD}",
        "输出SCM_CHANGE_TITLE": "echo ${SCM_CHANGE_TITLE}"
      }
    },
    "输出GlobalVariable变量脚本": {
      "Type": "COMMAND_STATUS",
      "Variable": {
        //覆盖GlobalVariable的TEMP_VAR变量值
        "TEMP_VAR": "variable_value",
        //定义一个局部变量
        "Local_Variable": "Local_Variable"
      },
      "Script": {
        "输出GV_PARAMS_DEPLOY": "echo ${GV_PARAMS_DEPLOY}",
        "输出GV_BUILD_URL": "echo ${GV_BUILD_URL}",
        "输出GV_VAR": "echo ${GV_VAR}",
        "输出TEMP_VAR": "echo ${TEMP_VAR}",
        "输出Local_Variable": "echo ${Local_Variable}"
      }
    }
  }
}
```

构建日志：

```text
开始执行[测试变量]的[输出RuntimeVariable变量脚本]
开始执行[输出JENKINS_PARAMS_DEPLOY]的[echo 部署全部]命令
bash: no job control in this shell
部署全部
执行完成[0]
开始执行[输出JENKINS_BUILD_URL]的[echo http://192.168.0.15:8081/job/Test-Jenkins-Json-Build/11/]命令
bash: no job control in this shell
http://192.168.0.15:8081/job/Test-Jenkins-Json-Build/11/
执行完成[0]
开始执行[输出SCRIPT_PWD]的[echo /root/.jenkins/workspace/Test-Jenkins-Json-Build]命令
bash: no job control in this shell
/root/.jenkins/workspace/Test-Jenkins-Json-Build
执行完成[0]
开始执行[输出SCM_CHANGE_TITLE]的[echo test]命令
bash: no job control in this shell
test
执行完成[0]
执行[输出RuntimeVariable变量脚本]完成

开始执行[测试变量]的[输出GlobalVariable变量脚本]
开始执行[输出GV_PARAMS_DEPLOY]的[echo 部署全部]命令
bash: no job control in this shell
部署全部
执行完成[0]
开始执行[输出GV_BUILD_URL]的[echo http://192.168.0.15:8081/job/Test-Jenkins-Json-Build/11/]命令
bash: no job control in this shell
http://192.168.0.15:8081/job/Test-Jenkins-Json-Build/11/
执行完成[0]
开始执行[输出GV_VAR]的[echo gv_var_value]命令
bash: no job control in this shell
gv_var_value
执行完成[0]
开始执行[输出TEMP_VAR]的[echo variable_value]命令
bash: no job control in this shell
variable_value
执行完成[0]
开始执行[输出Local_Variable]的[echo Local_Variable]命令
bash: no job control in this shell
Local_Variable
执行完成[0]
执行[输出GlobalVariable变量脚本]完成
执行[测试变量]完成
Finished: SUCCESS
```

JENKINS_PARAMS_DEPLOY变量值在执行第二次构建时才能获取到，因为添加构建参数的脚本在Jenkinsfile中，第一次执行时实际上构建任务还没有该构建参数，另外，在RuntimeVariable定义变量是不能和GlobalVariable一样直接用简单的健值对方式赋值，因为在RuntimeVariable定义的变量都需要通过HTTP、读取文件、执行命令脚本这三种方式其中的一种方式获得变量值，所以需要用echo命令来进行赋值。

如果在RuntimeVariable节点中定义的是通过HTTP或读取文件的方式获得一个Json文档，那么可以在URL或文件路径后面写@path[\节点名称\节点名称]来检索节点路径获得节点的值内容，比如：

```json
//JAVA_BUILD_JSON变量的值是“java -version 2>&1”
"JAVA_BUILD_JSON": "./src/main/jenkins/com/bluersw/jenkins/libraries/json/java-build.json@path[\\初始化\\检查Java环境\\Script\\输出Java版本]"
```

Json文档中隐式声明(不用声明直接使用)的变量有：

```text
BUILD_DISPLAY_NAME:#28
BUILD_ID:28
BUILD_NUMBER:28
BUILD_TAG:jenkins-Test-Jenkins-Json-Build-28
BUILD_URL:http://ops.gydev.cn:8080/job/Test-Jenkins-Json-Build/28/
CLASSPATH:
deploy-choice:模拟部署脚本-1
HUDSON_HOME:/root/.jenkins
HUDSON_SERVER_COOKIE:04f54204dabc2b46
HUDSON_URL:http://ops.gydev.cn:8080/
JENKINS_HOME:/root/.jenkins
JENKINS_SERVER_COOKIE:04f54204dabc2b46
JENKINS_URL:http://ops.gydev.cn:8080/
JOB_BASE_NAME:Test-Jenkins-Json-Build
JOB_DISPLAY_URL:http://ops.gydev.cn:8080/job/Test-Jenkins-Json-Build/display/redirect
JOB_NAME:Test-Jenkins-Json-Build
JOB_URL:http://ops.gydev.cn:8080/job/Test-Jenkins-Json-Build/
library.shared-library.version:V2
RUN_ARTIFACTS_DISPLAY_URL:http://ops.gydev.cn:8080/job/Test-Jenkins-Json-Build/28/display/redirect?page=artifacts
RUN_CHANGES_DISPLAY_URL:http://ops.gydev.cn:8080/job/Test-Jenkins-Json-Build/28/display/redirect?page=changes
RUN_DISPLAY_URL:http://ops.gydev.cn:8080/job/Test-Jenkins-Json-Build/28/display/redirect
RUN_TESTS_DISPLAY_URL:http://ops.gydev.cn:8080/job/Test-Jenkins-Json-Build/28/display/redirect?page=tests

REAL_USER_NAME:(执行构建账号的UserName)
WORKSPACE:/root/.jenkins/workspace/Test-Jenkins-Json-Build
PROJECT_PATH:/root/.jenkins/workspace/Test-Jenkins-Json-Build/
PROJECT_DIR:
```

特别说明：

* json配置文件放在项目根目录下
* PROJECT_PATH是距离加载的Json配置文件最近的目录路径
* PROJECT_DIR是仓库根目录和Json配置文件目录之间的第一层目录的路径，所以如果仓库根目录就是项目根目录PROJECT_DIR是''
* WORKSPACE是仓库的根目录路径

## 统一的构建脚本

可以编写一个或几个统一的构建脚本给所有项目使用，这样可以方便开发人员使用和维护，比如如下典型的构建脚本(Jenkinsfile)：

```groovy
@Library('shared-library') _

pipeline {
	agent { label params['agent-name'] }
	parameters { //定义构建参数
		choice choices: ['-'], description: '请选择部署方式', name: 'deploy-choice'
		agentParameter name:'agent-name'
		checkboxParameter name:'project-list', format:'YAML', uri:'https://raw.githubusercontent.com/sunweisheng/jenkins-json-build/master/example/microservice-build/project-list.yaml'
	}
	stages {
		stage('初始化') {
			steps {
				script{
					runWrapper.loadJSON(params['project-list'])
					runWrapper.runSteps('初始化')
				}
			}
		}
		stage('单元测试') {
			steps {
				script{
					runWrapper.runSteps('单元测试')
				}
			}
		}
		stage('代码检查') {
			steps {
				script{
					runWrapper.runSteps('代码检查')
				}
			}
		}
		stage('编译构建') {
			steps {
				script{
					runWrapper.runSteps('编译构建')
				}
			}
		}
		stage('部署') {
			steps {
				script{
					runWrapper.runStepForEnv('部署','deploy-choice')
				}
			}
		}
	}
}
```

上述构建过程分为初始化（一般初始化内含加载构建配置文件、检查构建环境、构建参数的值绑定等内容）、单元测试、代码检查（代码规范）、编译、部署共5个大步骤，适合大多数项目，其中有两个配合使用的Jenkins插件：

* [Agent Server Parameter Plugin](https://github.com/jenkinsci/agent-server-parameter-plugin)
* [Custom Checkbox Parameter Plugin](https://github.com/jenkinsci/custom-checkbox-parameter-plugin)

Agent Server Parameter Plugin插件用于选择构建服务器（Jenkins Agent Node），Custom Checkbox Parameter Plugin用于选择仓库根目录下的子项目实现选择性的构建子项目（如果没有子项目可以不使用此插件），
一般情况下还会使用[Git Parameter](https://github.com/jenkinsci/git-parameter-plugin)插件一起使用，Git Parameter插件用于选择分支进行源码获取。

定义一个下拉菜单方式的构建参数：

```groovy
//选择某个部署步骤而不是执行所有的部署步骤
choice choices: ['-'], description: '请选择部署方式', name: 'deploy-choice'
```

绑定下拉菜单方式构建参数的值：

```json
"绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    }
```

根据选择的值执行对应名称的构建步骤：

```groovy
runWrapper.runStepForEnv('部署','deploy-choice')
```

runWrapper.runStepForEnv()方法是根据某个全局变量的值来执行Steps中对应名称的构建步骤，在Jenkinsfile中定义了一个下拉菜单用于选择部署方式，在Json配置文件中会配置为其绑定一个Steps内的步骤列表，这样配合runStepForEnv()方法就能达到选择步骤执行的目的。

后面介绍的示例项目都是用统一的Jenkinsfile构建脚本执行，但项目内的json构建配置文件的内容不同，所以构建的内容也不相同。

## 构建Java项目

[示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/java-build)

### 需要安装的软件

构建服务器上需要安装Java、Maven和Sonar-Scanner。

* [JAVA安装](https://github.com/sunweisheng/Kvm/blob/master/Install-Java-18.md)
* [Maven安装](https://github.com/sunweisheng/Jenkins/blob/master/Install-Maven.md)
* [Sonar-Scanner](https://github.com/sunweisheng/Jenkins/blob/master/Install-SonarQube-8.3.md)

### 构建Java项目依赖的插件

* JUnit
* JaCoCo

### Java构建的配置文件内容

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

## 构建JS项目

[示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/js-build)

### 构建JS项目需要安装的软件

[安装 Nodejs](https://github.com/sunweisheng/Jenkins/blob/master/Install-Nodejs.md)

### JS构建配置文件内容

```json
{
  "初始化": {
    "检查Nodejs环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "v12.18.3",
      "Script": {
        "输出Node版本": "node -v"
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
    },
    "gulp组件全局安装": {
      "Type": "COMMAND_STATUS_IF",
      "TestScript": "gulp -v",
      "NotExpect": "0",
      "Script": {
        "安装gulp-cli": "npm install --g gulp-cli",
        "安装gulp": "npm install -g gulp"
      }
    },
    "jsdoc组件全局安装": {
      "Type": "COMMAND_STATUS_IF",
      "TestScript": "jsdoc -v",
      "NotExpect": "0",
      "Script": {
        "安装jsdoc": "npm install -g jsdoc"
      }
    },
    "jest组件全局安装": {
      "Type": "COMMAND_STATUS_IF",
      "TestScript": "jest -v",
      "NotExpect": "0",
      "Script": {
        "安装jest": "npm install -g jest"
      }
    }
  },
  "单元测试": {
    "执行单元测试脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "npm安装": "cd ${PROJECT_PATH};npm i",
        "运行单元测试":"cd ${PROJECT_PATH};npm test"
      }
    },
    "分析单元测试覆盖率": {
      "Type": "JEST_COVERAGE_ANALYSIS",
      "Statements":"100",
      "Branches":"100",
      "Functions":"100",
      "Lines":"100"
    }
  },
  "代码检查": {
    "执行SQ代码扫描": {
      "Type": "SONAR_QUBE"
    }
  },
  "编译构建": {
    "执行JS构建": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "构建": "cd ${PROJECT_PATH}; jsdoc -c jsdoc.json; gulp"
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
"gulp组件全局安装": {
      "Type": "COMMAND_STATUS_IF",
      "TestScript": "gulp -v",
      "NotExpect": "0",
      "Script": {
        "安装gulp-cli": "npm install --g gulp-cli",
        "安装gulp": "npm install -g gulp"
      }
    }
```

类型是COMMAND_STATUS_IF的节点代表TestScript的执行结果（COMMAND_STATUS方式执行），如果和NotExpect或Expect节点内容进行比对，结果为真则执行Script节点内的脚本，否则不执行。

```json
"分析单元测试覆盖率": {
      "Type": "JEST_COVERAGE_ANALYSIS",
      "Statements":"100",
      "Branches":"100",
      "Functions":"100",
      "Lines":"100"
    }
```

该节点是利用jest产生的单元测试报告分析单元测试覆盖率，如果不符合设置的标准会中断构建进程。

## 构建ReactNative项目

* [构建Android版本示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/rn-android-build)
* [构建iOS版本示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/rn-ios-build)

### 构建RN项目需要安装的软件

[安装 Nodejs](https://github.com/sunweisheng/Jenkins/blob/master/Install-Nodejs.md)
[搭建 React Native环境](https://reactnative.cn/docs/getting-started.html)

### RN构建Android版本配置文件内容

```json
{
  "初始化": {
    "检查Nodejs环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "v11.6.0",
      "Script": {
        "输出Node版本": "node -v"
      }
    },
    "检查SonarScanner环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "SonarQube Scanner 4.0.0.1744",
      "Script": {
        "输出SonarScanner版本": "sonar-scanner -v"
      }
    },
    "检查react-native-cli环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "react-native-cli: 2.0.1",
      "Script": {
        "输出react-native-cli版本": "react-native -version"
      }
    },
    "绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    },
    "jest组件全局安装": {
      "Type": "COMMAND_STATUS_IF",
      "TestScript": "jest -v",
      "NotExpect": "0",
      "Script": {
        "安装jest": "npm install -g jest"
      }
    }
  },
  "单元测试": {
    "执行单元测试脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "更新库":"cd ${PROJECT_PATH};npm install",
        "运行单元测试":"cd ${PROJECT_PATH};npm test"
      }
    },
    "分析单元测试覆盖率": {
      "Type": "JEST_COVERAGE_ANALYSIS",
      "Statements":"100",
      "Branches":"100",
      "Functions":"100",
      "Lines":"100"
    }
  },
  "代码检查": {
    "执行SQ代码扫描": {
      "Type": "SONAR_QUBE"
    }
  },
  "编译构建": {
    "执行RN-Android构建": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "构建脚本": "cd ${PROJECT_PATH}/android/;./gradlew assembleRelease --stacktrace"
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

### RN构建iOS版本配置文件内容

```json
{
  "初始化": {
    "检查Nodejs环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "v11.6.0",
      "Script": {
        "输出Node版本": "node -v"
      }
    },
    "检查SonarScanner环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "SonarQube Scanner 4.0.0.1744",
      "Script": {
        "输出SonarScanner版本": "sonar-scanner -v"
      }
    },
    "检查ruby环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "ruby 2.6",
      "Script": {
        "输出ruby版本": "ruby -v"
      }
    },
    "检查react-native-cli环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "react-native-cli: 2.0.1",
      "Script": {
        "输出react-native-cli版本": "react-native -version"
      }
    },
    "检查Xcode环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "Xcode 11.1",
      "Script": {
        "输出Xcode版本": "xcodebuild -version"
      }
    },
    "绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    },
    "jest组件全局安装": {
      "Type": "COMMAND_STATUS_IF",
      "TestScript": "jest -v",
      "NotExpect": "0",
      "Script": {
        "安装jest": "npm install -g jest"
      }
    },
    "获取钥匙串权限": {
      "Type": "COMMAND_STATUS_WITH_CREDENTIALS",
      "CredentialsId": "iOS_admin_passwd",
      "Script": {
        "获取权限": "cd ${PROJECT_PATH};security set-key-partition-list -S apple-tool:,apple: -s -k $password login.keychain"
      }
    }
  },
  "单元测试": {
    "执行单元测试脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "更新库":"cd ${PROJECT_PATH};npm install",
        "运行单元测试":"cd ${PROJECT_PATH};npm test"
      }
    },
    "分析单元测试覆盖率": {
      "Type": "JEST_COVERAGE_ANALYSIS",
      "Statements":"100",
      "Branches":"100",
      "Functions":"100",
      "Lines":"100"
    }
  },
  "代码检查": {
    "执行SQ代码扫描": {
      "Type": "SONAR_QUBE"
    }
  },
  "编译构建": {
    "执行RN-iOS构建": {
      "Type": "COMMAND_STATUS",
      "Variable": {
        "ProjectName": "TestRnBuild",
        "PlistPath": "${PROJECT_PATH}/ios/test-rn-build.plist"
      },
      "Script": {
        "安装CocoaPods依赖库": "cd ${PROJECT_PATH}/ios;pod install --verbose --no-repo-update",
        "清理build目录": "cd ${PROJECT_PATH}/ios;rm -rf build",
        "打包": "export LC_ALL=en_US.UTF-8;cd ${PROJECT_PATH}/ios/;xcodebuild -workspace ${ProjectName}.xcworkspace -scheme ${ProjectName} -configuration Release -archivePath build/${ProjectName}.xcarchive -UseModernBuildSystem=YES -allowProvisioningUpdates archive; xcodebuild -exportArchive -archivePath build/${ProjectName}.xcarchive -exportPath build -exportOptionsPlist ${PlistPath}"
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
"获取钥匙串权限": {
      "Type": "COMMAND_STATUS_WITH_CREDENTIALS",
      "CredentialsId": "iOS_admin_passwd",
      "Script": {
        "获取权限": "cd ${PROJECT_PATH};security set-key-partition-list -S apple-tool:,apple: -s -k $password login.keychain"
      }
    }
```

该节点是用于带有用户名和密码的命令脚本，CredentialsId是Jenkins中存储的凭证名称（目前只能使用usernamePassword凭证），在命令中\$password代表密码，\$username代表用户名，Script子节点内可以含有多条语句。

## 构建Android项目

[构建Android示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/android-build)

### 构建Android(Java)项目配置文件内容

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
    "检查SonarScanner环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "SonarQube Scanner 4.0.0.1744",
      "Script": {
        "输出SonarScanner版本": "sonar-scanner -v"
      }
    },
    "检查Android SDK环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "Android Debug Bridge version 1.0.41",
      "Script": {
        "输出Android SDK版本": "adb --version"
      }
    },
    "检查Gradle环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "Gradle 5",
      "Script": {
        "输出Gradle版本": "gradle -v"
      }
    },
    "检查Android 模拟器": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "输出Android 模拟器": "device=`adb devices -l | grep -E \"^[0-9a-z-]{8}.*device\"|wc -l` \n (($device!=0))"
      }
    },
    "绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    }
  },
  "单元测试": {
    "执行单元测试脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "执行清理":"cd ${PROJECT_PATH}/;./gradlew clean",
        "执行单元测试":"cd ${PROJECT_PATH}/;./gradlew jacocoTestReport --stacktrace"
      }
    },
    "执行JUnit插件": {
      "Type": "JUNIT_PLUG_IN",
      "JunitReportPath": "**/${PROJECT_DIR}/**/build/outputs/androidTest-results/connected/*.xml"
    },
    "执行Jacoco插件": {
      "Type": "JACOCO_PLUG_IN",
      "classPattern":"${PROJECT_PATH}app/build/intermediates/javac/debug/classes/",
      "execPattern":"**/${PROJECT_PATH}app/build/outputs/**/*.ec",
      "FailPrompt":"FAILURE",
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
    "执行构建": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "执行构建": "cd ${PROJECT_PATH}/;./gradlew assembleRelease --stacktrace"
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

## 构建iOS项目

[构建iOS示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/ios-build)

### 构建iOS项目需要安装的软件

```shell
# 安装 OCLint (homebrew当前可用最高版本为0.13版本)
brew install xctool
brew install Caskroom/cask/oclint

# 安装 xcpretty
gem install xcpretty

#安装pods
sudo gem install cocoa pods
```

### 构建iOS项目配置文件内容

```json
{
  "GlobalVariable": {
    "ProjectName": "CICD-ObjectC-Test",
    "TestDeviceID": "1BE7CA48-97D8-4D04-88C5-A14971AFE737"
  },
  "初始化": {
    "检查SonarScanner环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "SonarQube Scanner 4.0.0.1744",
      "Script": {
        "输出SonarScanner版本": "sonar-scanner -v"
      }
    },
    "检查Xcode环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "Xcode 11",
      "Script": {
        "输出Xcode版本": "xcodebuild -version"
      }
    },
    "检查OCLint环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "OCLint version 0.13.",
      "Script": {
        "输出OCLint版本": "oclint -version"
      }
    },
    "检查xcpretty环境": {
      "Type": "COMMAND_STDOUT",
      "Success-IndexOf": "0.3.0",
      "Script": {
        "输出xcpretty版本": "xcpretty -v"
      }
    },
    "绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    },
    "获取钥匙串权限": {
      "Type": "COMMAND_STATUS_WITH_CREDENTIALS",
      "CredentialsId": "iOS_admin_passwd",
      "Script": {
        "获取权限": "cd ${PROJECT_PATH};security set-key-partition-list -S apple-tool:,apple: -s -k $password login.keychain"
      }
    }
  },
  "单元测试": {
    "执行单元测试脚本": {
      "Type": "COMMAND_STATUS",
      "Variable": {
        "TestDevice": "platform=iOS Simulator,id=${TestDeviceID}"
      },
      "Script": {
        "运行单元测试": "export LC_ALL=en_US.UTF-8;cd ${PROJECT_PATH}/;xcodebuild -scheme ${ProjectName} -destination '${TestDevice}' -workspace ${ProjectName}.xcworkspace test | tee xcodebuild.log | xcpretty -t -r html -r junit"
      }
    },
    "执行JUnit插件": {
      "Type": "JUNIT_PLUG_IN",
      "JunitReportPath": "**/${PROJECT_DIR}/**/build/reports/*.xml"
    },
    "分析单元测试覆盖率": {
      "Type": "LLVM_COV_COVERAGE_ANALYSIS",
      "XcodePathScript":"Xcode-select --print-path",
      "llvm-covCommand":"/Toolchains/XcodeDefault.xctoolchain/usr/bin/llvm-cov export -format=text --summary-only -instr-profile ",
      "XcodeBuildLogPath":"${PROJECT_PATH}/xcodebuild.log",
      "TestDeviceID":"${TestDeviceID}",
      "APPName":"${ProjectName}",
      "FileNameContains":"Presenter",
      "Functions":"100",
      "Instantiations":"0",
      "Lines":"95",
      "Regions":"95"
    }
  },
  "代码检查": {
    "清理和准备数据": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "清理build目录": "cd ${PROJECT_PATH};rm -rf build",
        "Xcode构建清理": "cd ${PROJECT_PATH}; xcodebuild clean",
        "删除文件": "cd ${PROJECT_PATH};rm -rf compile_commands.json;rm -rf xcodebuild.log;rm -rf compile_commands.json;rm -rf sonar-reports",
        "创建目录": "cd ${PROJECT_PATH};mkdir sonar-reports",
        "采集并格式化xcodebuild日志": "export LC_ALL=en_US.UTF-8;cd ${PROJECT_PATH}; xcodebuild -scheme ${ProjectName} -workspace ${ProjectName}.xcworkspace -configuration Release clean build | tee xcodebuild.log | xcpretty -r json-compilation-database --output compile_commands.json",
        "OLint处理": "cd ${PROJECT_PATH}; oclint-json-compilation-database -- -max-priority-1 10000 -max-priority-2 10000 -max-priority-3 10000 -rc LONG_LINE=150 -report-type pmd -o ./sonar-reports/oclint.xml"
      }
    },
    "执行SQ代码扫描": {
      "Type": "SONAR_QUBE"
    }
  },
  "编译构建": {
    "执行iOS构建": {
      "Type": "COMMAND_STATUS",
      "Variable": {
        "PlistPath": "${PROJECT_PATH}CICDTestApp.plist"
      },
      "Script": {
        "清理构建环境": "xcodebuild -workspace ${ProjectName}.xcworkspace -scheme CICD-ObjectC-Test clean",
        "执行构建": "cd ${PROJECT_PATH};xcodebuild -workspace ${ProjectName}.xcworkspace -scheme ${ProjectName} -configuration Debug -archivePath build/${ProjectName}.xcarchive archive",
        "导出ipa": "cd ${PROJECT_PATH};xcodebuild -exportArchive -archivePath build/${ProjectName}.xcarchive -exportPath build -exportOptionsPlist ${PlistPath}"
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
"分析单元测试覆盖率": {
      "Type": "LLVM_COV_COVERAGE_ANALYSIS",
      "XcodePathScript":"Xcode-select --print-path",
      "llvm-covCommand":"/Toolchains/XcodeDefault.xctoolchain/usr/bin/llvm-cov export -format=text --summary-only -instr-profile ",
      "XcodeBuildLogPath":"${PROJECT_PATH}/xcodebuild.log",
      "TestDeviceID":"${TestDeviceID}",
      "APPName":"${ProjectName}",
      "FileNameContains":"Presenter",
      "Functions":"100",
      "Instantiations":"0",
      "Lines":"95",
      "Regions":"95"
    }
```

LLVM_COV_COVERAGE_ANALYSIS节点使用llvm-cov分析单元测试覆盖率，FileNameContains节点是定义要被统计的类文件名的关键字，文件名含有关键字的类文件会被计算在覆盖率统计中，这主要为了实现计算某一层代码的单元测试覆盖率。

## 构建NET项目

[示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/net-build)

构建.NET项目需要在Windows操作系统中安装VS2013或更高版本，先用VS2013或更高版本打开项目后用Nuget获取需要引用的包(这些包比较大没有放在示例项目中)，Nuget成功之后再构建.NET项目。

### .NET项目构建配置文件内容

```json
{
  "GlobalVariable": {
    "MSBuildBinDir": "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\MSBuild\\Current\\Bin"
  },
  "初始化": {
    "检查MSBuild环境": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "输出MSBuild版本": "\"${MSBuildBinDir}\\MSBuild.exe\" -version"
      }
    },
    "检查SonarScanner环境": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "输出SonarScanner版本": "SonarScanner.MSBuild.exe /?"
      }
    },
    "绑定构建参数": {
      "Type": "BUILD_PARAMETER_DROP_DOWN_MENU",
      "StepsName": "部署",
      "ParamName": "deploy-choice"
    }
  },
  "单元测试": {
    "执行单元测试脚本": {
      "Type": "COMMAND_STATUS",
      "Script": {
        "运行单元测试": "cd ${PROJECT_PATH}\\ && MSBuild  My.msbuild /t:GenerateCoverageHtmlReport"
      }
    },
    "分析单元测试覆盖率": {
      "Type": "MSBUILD_COVERAGE_ANALYSIS",
      "ReportDir": "${PROJECT_PATH}\\Cover\\",
      "Lines": "0"
    }
  },
  "代码检查": {
    "执行SQ代码扫描": {
      "Type": "SONAR_QUBE",
      "Variable": {
        "project_key": "Jenkins:WinBuild",
        "project_name": "Jenkins:WinBuild",
        "project_version": "1.0"
      },
      "ReportTaskPath": "${PROJECT_PATH}\\.sonarqube\\out\\.sonar\\report-task.txt",
      "?ScannerScript": "SonarScanner加日志参数 /d:sonar.verbose=true",
      "ScannerScript": "cd ${PROJECT_PATH}\\ && SonarScanner.MSBuild.exe begin /k:\"${project_key}\" /n:\"${project_name}\" /v:\"${project_version}\"  && \"${MSBuildBinDir}\\MSBuild.exe\" /t:Rebuild  /p:VisualStudioVersion=12.0  && SonarScanner.MSBuild.exe end",
      "Gate": "NONE"
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

首先构建.NET项目依靠MSBuild工具，该工具有自己的构建配置文件，[MSBuild工具配置文件示例](https://github.com/sunweisheng/jenkins-json-build/blob/master/example/net-build/My.msbuild)，该配置文件定义了大部分构建过程。

MSBUILD_COVERAGE_ANALYSIS类型节点是根据MSBuild工具生成的单元测试报告，计算单元测试覆盖度，目前只能计算代码行覆盖率，另外在Windows环境下SonarQube代码扫描指令和在Linux下区别很大，需要对应的调整SonarQube扫描节点的属性。

## 构建多个子项目

[构建多个子项目示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/microservice-build)

一次构建多个子项目可用于构建微服务类型的项目，因为一个微服务项目其代码仓库中含有多个互相独立的子项目，也可用于前后端在一个代码仓库的项目，比如一个Java服务器端项目，一个JS前端项目同在一个代码仓库内。

Jenkinsfile和json构建配置文件没有任何不同，只是存放的目录层级不同：

![project doc image](jenkins-json-build-05.png)

使用[Custom Checkbox Parameter Plugin](https://github.com/jenkinsci/custom-checkbox-parameter-plugin)插件可以方便的选择子项目进行构建。

## 构建成功和失败处理

Jenkinsfile是Declarative语法，在post声明中可以对构建的成功和失败进行相应的处理。[示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/post-send-email)

### 依赖的Jenkins插件

* [Email Extension Template](https://github.com/jenkinsci/emailext-template-plugin)
* [Rich Text Publisher](https://github.com/jenkinsci/rich-text-publisher-plugin)

### 构建异常处理示例

以下是一个构建异常处理方案：

```groovy
@Library('shared-library') _

pipeline {
  agent any
  stages {
    stage('处理过程1') {
      steps {
        script{
          Exception ex
          runWrapper.loadJSON('/jenkins-project.json')
          }
        }
      }
    stage('处理过程2') {
      steps {
        script{
          println('处理过程2')
          try{
              throw new Exception('模拟异常')
          }catch(Exception e){
              ex = e
              throw e
          }
        }
      }
    }
    stage('处理过程3') {
      steps {
        script{
          println('处理过程3')
          }
        }
      }
    }
  post {
    failure {
      script{
        runWrapper.postFailure(ex)
      }
    }
    success{
      script{
        runWrapper.postSuccess()
      }
    }
  }
}
```

说明：

runWrapper.postFailure(ex)方法用于处理构建失败的情况，runWrapper.postSuccess()用于处理成功的情况，它们都会发送邮件，邮件接收者和抄送者的地址在json构建配置文件中设置：

```json
{
  "GlobalVariable": {
    "Email-TO": "sunweisheng@live.cn",
    "Email-CC": "sunweisheng@live.cn"
  }
}
```

GlobalVariable中定义的Email-TO(接收者)和Email-CC(抄送者)，用于发送邮件时使用，多个接收者或抄送者时，用","号分隔。

## 在K8S内创建Pod进行构建

[示例项目](https://github.com/sunweisheng/jenkins-json-build/tree/master/example/k8s-build)

此方式是在Kubernetes集群内创建临时的Pod，该Pod就是Jenkins Agent的构建服务器，构建部署结束后Pod被Kubernetes回收销毁，此方案需要配置Jenkins的Kubernetes使用环境：

* [Jenkins的kubernetes-plugin使用方法](https://github.com/sunweisheng/Jenkins/blob/master/Jenkins-Kubernetes.md)
* [Jenkins在Pod中实现Docker in Docker并用kubectl进行部署](https://github.com/sunweisheng/Jenkins/blob/master/Docker-In-Docker-Kubectl.md)
* [Kubernetes配置文件示例](https://github.com/sunweisheng/Kubernetes/blob/master/Kubernetes-Configuration.md)

### 依赖Jenkins插件

[Kubernetes plugin for Jenkins](https://github.com/jenkinsci/kubernetes-plugin)

### Pod模版和Jenkinsfile

在仓库根目录下创建KubernetesPod.yaml（Pod模版），该文件内的Docker镜像需要符合项目构建的要求，比如安装了Java、Maven等，示例：

```yaml
apiVersion: "v1"
kind: "Pod"
metadata:
spec:
  containers:
    - name: "docker-build"
      image: "repo.bluersw.com:8083/bluersw/centos-7-docker-kubectl:2.0"
      command:
        - "cat"
      tty: true
      volumeMounts:
        - mountPath: "/etc/docker/daemon.json"
          name: "volume-0"
          readOnly: false
        - mountPath: "/root/.docker/config.json"
          name: "volume-1"
          readOnly: false
        - mountPath: "/var/lib/kubelet/pki"
          name: "volume-2"
          readOnly: false
        - mountPath: "/var/run/docker.sock"
          name: "volume-3"
          readOnly: false
        - mountPath: "/root/.kube"
          name: "volume-4"
          readOnly: false
      workingDir: "/home/jenkins/agent"
  securityContext:
    runAsGroup: 0
    runAsUser: 0
  volumes:
    - hostPath:
        path: "/etc/docker/daemon.json"
      name: "volume-0"
    - hostPath:
        path: "/root/.docker/config.json"
      name: "volume-1"
    - hostPath:
        path: "/var/lib/kubelet/pki"
      name: "volume-2"
    - hostPath:
        path: "/var/run/docker.sock"
      name: "volume-3"
    - hostPath:
        path: "/root/.kube"
      name: "volume-4"
```

挂载了很多目录是为了实现Docker In Docker和在Pod使用kubectl命令部署K8S资源。

在Jenkinsfile中会加载此yaml文件创建构建项目的临时Pod：

```groovy
@Library('shared-library') _

pipeline {
  agent {
    kubernetes {
      yamlFile 'KubernetesPod.yaml'
    }
  }
  stages {
    stage('初始化') {
      steps {
        container('jnlp') {
          println('jnlp:' + pwd())
        }
        container('docker-build'){
          script{
            runWrapper.loadJSON('/jenkins-project.json')
            runWrapper.runSteps('初始化')
            runWrapper.printEnvVars()
          }
        }
      }
    }
    stage('单元测试') {
      steps {
        container('docker-build'){
          script{
            runWrapper.runSteps('单元测试')
          }
        }
      }
    }
    stage('代码检查') {
      steps {
        container('docker-build'){
          script{
            runWrapper.runSteps('代码检查')
          }
        }
      }
    }
    stage('编译构建') {
      steps {
        container('docker-build'){
          script{
            runWrapper.runSteps('编译构建')
          }
        }
      }
    }
    stage('部署') {
      steps {
        container('docker-build'){
          script{
            runWrapper.runSteps('部署')
          }
        }
      }
    }
  }
}
```

说明：

container用于切换不同的容器环境（一个Pod中可以由多个容器，Docker也是一样），但工作目录不变，container('jnlp')是Jenkins用于执行Agent程序和Git程序的容器由Jenkins自动创建，container('docker-build')是自定义的容器在KubernetesPod.yaml中定义。

## 最简构建脚本

如果项目内的json配置文件的构建步骤是按照：初始化、单元测试、代码检查、编译构建、部署这5个步骤集合编写的，那么可以使用以下语句最大化的简化Jenkinsfile构建脚本：

使用Jenkins的Agent服务器进行单项目构建：

```groovy
@Library('shared-library') _

singleAgentBuild()
```

使用Jenkins的Agent服务器进行多项目构建：

```groovy
@Library('shared-library') _

multipleAgentBuild('子项目列表的yaml文档或json文档的URL')
```

使用Kubernetes的Pod进行单项目构建：

```groovy
@Library('shared-library') _

singleK8SBuild()
```

使用Kubernetes的Pod进行多项目构建：

```groovy
@Library('shared-library') _

multipleK8SBuild('子项目列表的yaml文档或json文档的URL')
```

这些方法都在共享类库的vars目录中定义，可以根据需要直接修改。
