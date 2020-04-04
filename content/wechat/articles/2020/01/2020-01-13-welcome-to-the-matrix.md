---
title: "欢迎使用流水线指令-矩阵"
date: 2019-12-29
description: "介绍了声明式流水线中 `matrix` 指令的使用方法，并介绍了 `matrix` 指令在pipeline中的句式"
author: Liam Newman
poster: "cover.jpg"
translator: 0N0thing  
original: "https://jenkins.io/blog/2019/11/22/welcome-to-the-matrix/"
tags: 
- Jenkins  
- pipeline  
---

![cover](cover.jpg)

我经常发现自己需要在一堆不同的配置上执行相同的操作。到目前为止，意味着我需要在流水线上的同一阶段制作多个副本。当我需要修改时，必须在整个流水线的多个地方做相同的修改。对于一个更大型的流水线来说，即便维护很少的配置也会变得困难。
声明式流水线1.5.0-beta1（可以从[ Jenkins 实验性更新中心](https://updates.jenkins.io/experimental/)获取）添加了一个新的  `matrix` 部分，该部分能让我一次指定一个阶段列表，然后在多个配置上并行运行同一列表。让我们来看一看！
## 单一配置流水线
开始我会使用一个带有构建和测试阶段的简单流水线。我使用 `echo` 步骤作为构建和测试行为的占位符。

*Jenkinsfile*
```
pipeline {
	agent none
    stages {
        stage('BuildAndTest') {
            agent any
            stages {
                stage('Build') {
                    steps {
                        echo 'Do Build'
                    }
                }
                stage('Test') {
                    steps {
                        echo 'Do Test'
                    }
                }
            }
        }
    }
}
```  
## 多平台与浏览器的流水线
我更喜欢在多系统以及浏览器结合的情况下执行我的构建和测试。新的 `metrix` 指令能让我定义一个 `axes` 的集合。每个 `axis` 有一个 `name` 以及包含了一个或多个 `values` 的列表。当流水线运行的时候，Jenkins 会将这些托管过来并将每个“轴”上所有可能值的组合运行在我的阶段内。一个“矩阵”上所有的元素都是并行运行的（只受限于可用的节点数量）。
我的“矩阵”有两个“轴”： `PLATFORM` 和 `BROWSER` 。`PLATFORM` 有三个值 `BROWSER` 有四个值，所以我的阶段会运行12个不同的组合。我已经修改了我的 `echo` 步骤用来使用每个元素中“轴”的值。

*Jenkinsfile*
 ```
pipeline {
    agent none
    stages {
        stage('BuildAndTest') {
            matrix {
                agent any
                axes {
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'windows', 'mac'
                    }
                    axis {
                        name 'BROWSER'
                        values 'firefox', 'chrome', 'safari', 'edge'
                    }
                }
                stages {
                    stage('Build') {
                        steps {
                            echo "Do Build for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                    stage('Test') {
                        steps {
                            echo "Do Test for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```   
*日志输出（部分内容）*

```
...
[Pipeline] stage
[Pipeline] { (BuildAndTest)
[Pipeline] parallel
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'safari')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'safari')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'safari')
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'edge') (hide)
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'edge')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'edge')
...
Do Build for linux - safari
Do Build for linux - firefox
Do Build for windows - firefox
Do Test for linux - firefox
Do Build for mac - firefox
Do Build for linux - chrome
Do Test for windows - firefox
...
```  
## 排除无效的组合
现在我已经创建一个基本的“矩阵”了，我注意到我有一些无效的组合。  Edge 浏览器只在 Windows 系统上运行以及没有 Linux 版本的 Safari。
我可以使用 `exclude` 命令去掉我的“矩阵”中无效的元素。每个 `exclude` 含有一个或多个带有 `name` 和 `values` 的 `axis` 指令。一个 `exclude` 中的 `axis` 指令会生成一组组合（类似于生成“矩阵”中的元素）。“矩阵”中的元素匹配一个 `exclude` 中所有需要从“矩阵”中移出的值。如果我有不止一个 `exclude` 指令，每个都将分别评估来移除元素。
当需要处理一个长的排除列表时，我可以使用 `notValues` 而不是 `values` 去指定“轴”中我们**不想**排除的值。是的，这有点双重否定的意思，所以会有一点困惑。我只会在我真正想用的时候才会用它。
下面的流水线示例，我排除了 `linux, safari` 的组合同样我排除了**除了** `windows` 之外的其他平台 和 `edge` 浏览器的组合。
**重要**
本流水线使用两个“轴”，但是**没有**使用 `axis` 指令数量的限制。
同样，在这个流水线里每个 `exclude` 指定这两个“轴”的值，但是这不是必须的。如果我们想只在“linux”元素中运行，我们需要使用以下的 `exclude` ：

```
exclude {
    axis {
        name 'PLATFORM'
        notValues 'linux'
    }
}
```  

```
pipeline {
    agent none
    stages {
        stage('BuildAndTest') {
            matrix {
                agent any
                axes {
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'windows', 'mac'
                    }
                    axis {
                        name 'BROWSER'
                        values 'firefox', 'chrome', 'safari', 'edge'
                    }
                }
                excludes {
                    exclude {
                        axis {
                            name 'PLATFORM'
                            values 'linux'
                        }
                        axis {
                            name 'BROWSER'
                            values 'safari'
                        }
                    }
                    exclude {
                        axis {
                            name 'PLATFORM'
                            notValues 'windows'
                        }
                        axis {
                            name 'BROWSER'
                            values 'edge'
                        }
                    }
                }
                stages {
                    stage('Build') {
                        steps {
                            echo "Do Build for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                    stage('Test') {
                        steps {
                            echo "Do Test for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```  
*日志输出（部分内容）*
```
...
[Pipeline] stage
[Pipeline] { (BuildAndTest)
[Pipeline] parallel
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'safari')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'safari')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'edge')
...
Do Build for linux - firefox
...
```  
## 运行时控制元素行为
在 `matrix` 指令中同样我可以添加“每个-元素”指令。这些相同的指令我可以添加到一个 `stage` 中让我可以控制“矩阵”中每一个元素的行为。这些指令可以从它们的元素的“轴”中获取值作为输入，允许我自定义每一个元素的行为以匹配它的“轴”的值。
在我的 Jenkins 服务器中我已经配置了各个节点并为各个节点配置了系统名称的标签（“linux-agent”，“windows-agent”，和“mac-agent” ）。为了在正确的操作系统上运行“矩阵”中的元素，我配置了 Groovy 字符模板为元素配置标签。
```
matrix {
    axes { ... }
    excludes { ... }
    agent {
        label "${PLATFORM}-agent"
    }
    stages { ... }
    // ...
}
```  
有时我通过 Jenkins 的网页手动运行流水线任务。当我这样做时，我能够只选择一个运行的平台。 `axis` 和 `exclude` 指令定义了一个组成“矩阵”的一组静态的元素。这一组合的集合在运行开始之前就被创建出来，也早于任何的参数获取。也就意味着我不能在任务已经开始后从“矩阵”上添加或者移除元素。
另一方面，“每个-元素”指令，在运行时会被评估。我可以使用“每个-元素” `metrix` 中的 `when` 指令来控制“矩阵”中哪个元素会被执行。我添加了一个带有平台列表的 `choice` 字段，以及在 `when` 指令添加了判断，这样会确定是所有的平台都执行还是只执行我指定的平台的元素。
```
pipeline {
    parameters {
        choice(name: 'PLATFORM_FILTER', choices: ['all', 'linux', 'windows', 'mac'], description: 'Run on specific platform')
    }
    agent none
    stages {
        stage('BuildAndTest') {
            matrix {
                agent {
                    label "${PLATFORM}-agent"
                }
                when { anyOf {
                    expression { params.PLATFORM_FILTER == 'all' }
                    expression { params.PLATFORM_FILTER == env.PLATFORM }
                } }
                axes {
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'windows', 'mac'
                    }
                    axis {
                        name 'BROWSER'
                        values 'firefox', 'chrome', 'safari', 'edge'
                    }
                }
                excludes {
                    exclude {
                        axis {
                            name 'PLATFORM'
                            values 'linux'
                        }
                        axis {
                            name 'BROWSER'
                            values 'safari'
                        }
                    }
                    exclude {
                        axis {
                            name 'PLATFORM'
                            notValues 'windows'
                        }
                        axis {
                            name 'BROWSER'
                            values 'edge'
                        }
                    }
                }
                stages {
                    stage('Build') {
                        steps {
                            echo "Do Build for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                    stage('Test') {
                        steps {
                            echo "Do Test for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```  
如果我从 Jenkins 的 UI 页面上运行流水线设置 `PLATFORM_FILTER` 字段为 `mac` ，我会得到如下的输出：

*日志输出（部分内容 - PLATFORM_FILTER = 'mac'）*
```
...
[Pipeline] stage
[Pipeline] { (BuildAndTest)
[Pipeline] parallel
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'firefox')
[Pipeline] { (Branch: Matrix - OS = 'linux', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'chrome')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'safari')
[Pipeline] { (Branch: Matrix - OS = 'mac', BROWSER = 'safari')
[Pipeline] { (Branch: Matrix - OS = 'windows', BROWSER = 'edge')
...
Stage "Matrix - OS = 'linux', BROWSER = 'chrome'" skipped due to when conditional
Stage "Matrix - OS = 'linux', BROWSER = 'firefox'" skipped due to when conditional
...
Do Build for mac - firefox
Do Build for mac - chrome
Do Build for mac - safari
...
Stage "Matrix - OS = 'windows', BROWSER = 'chrome'" skipped due to when conditional
Stage "Matrix - OS = 'windows', BROWSER = 'edge'" skipped due to when conditional
...
Do Test for mac - safari
Do Test for mac - firefox
Do Test for mac - chrome
```  
**重要**
在[ DevOps World | Jenkins World 2019](https://www.cloudbees.com/devops-world/lisbon) “[声明式流水线2019：知识点，技巧，以及接下来的事情](https://sched.co/UeQe)”中与我一起参与。我会回顾过去的一年有哪些加入到了流水线（包括“矩阵”）以及探讨一些关于流水线下一步走向的想法。

## 结论
这篇博客里面，我们已经看到了怎样使用 `matrix` 指令来构成简洁但又强大的声明式流水线。同样的一个不带有 `matrix` 的流水线会容易一些，但会消耗更多的时间同样也会更难理解和维护。
## 链接
- [Jenkins 实验性更新中心](https://updates.jenkins.io/experimental/)
- [使用 Jenkins 实验性更新中心](https://jenkins.io/doc/developer/publishing/releasing-experimental-updates/#using-the-experimental-update-center)
