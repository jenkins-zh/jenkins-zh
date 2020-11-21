---
type: tutorial
title: 标签的使用
author: linuxsuren
---

标签（label）指的是 Jenkins 节点（node）的一个字段（或属性）。标签对节点本身没有任何实际的意义，只是一个普通的信息。

我们下面要讲的，是 Jenkins 的节点调度器如何利用标签来调度节点。通过标签而不是节点名称来调度，是一种解耦的方法。
换句话说，只需要把流水线运行在特定的操作系统、语言环境或者包含特定工具的节点上即可。

## 表达式
这里的表达式和编程语言的逻辑表达式相似，也支持或、与、非以及表达式的组合。下面，我们通过几个例子来学习下。

假定，有如下的几个节点，以及标签设置：

| 节点名称 | 标签 |
|---|---|
| node-1 | linux golang golang-1.3 |
| node-2 | windows golang golang-1.4 |
| node-3 | linux golang golang-1.2 mem-high |
| node-4 | linux java mem-high |

* golang
* golang && linux
* golang-1.3 ||  golang-1.4


下面给出一个流水线使用标签的例子：
```
pipeline {
    agent {
        label 'golang && linux'
    }
    stages {
        stage('test') {
            steps {
                sh 'echo hello'
            }
        }
    }
}
```

## 最佳实践
理论上，Jenkins 节点的标签可以是任意的可见字符来表示，但建议标签的命名是有迹可循的。

我推荐，把节点相关的环境信息作为标签的名称，例如：操作系统、工具及其版本。不推荐的命名包括：IP 地址、数字序号。

下面，给出一个推荐的列表（如果您有其他推荐的，请下面留言）：

| 类型 | 示例 |
|---|---|
| 操作系统 | linux windows macos |
| 语言环境| python golang java nodejs |
| 计算资源 | mem-high cpu-3 disk-high |
| 其他 | docker kubectl |
