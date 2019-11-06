---
type: tutorial
title: 配置即代码
author: linuxsuren
toc: true
---

[Jenkins Configuration as Code Plugin ](https://github.com/jenkinsci/configuration-as-code-plugin) 允许用户将系统配置等 Jenkins 的配置信息写入到一个 YAML 文件中。这样，可以极大地方便将团队中使用的 Jenkins 配置进行标准化，易于传播、便于快速搭建开箱即用的 Jenkins 服务。

借助这个插件，我们几乎不再需要通过人工在 UI 界面上点击的方式来配置 Jenkins 服务。而且，绝大部分其他插件几乎（甚至）不需要做任何调整，就可以与该插件兼容。

## 配置文件加载流程

|类型||描述|
|---|---|---|
|文件|`$JENKINS_HOME/war/WEB-INF/jenkins.yaml`|单一文件|
|目录|`$JENKINS_HOME/war/WEB-INF/jenkins.yaml.d`|加载该目录下所有以 `yml,yaml,YAML,YML` 为后缀的文件|
|系统属性|`casc.jenkins.config`||
|环境变量|`CASC_JENKINS_CONFIG`||
|系统配置|无 UI 配置||
|文件|`$JENKINS_HOME/jenkins.yaml`|查找顺序为：系统属性->环境变量->系统配置->该文件，这个配置文件，只加载先找到的|

## 资源加载协议

支持的 URI 协议包括：`https`, `http`, `file`

如果不在上面协议的范围内的话，则尝试以文件（或目录）的方式加载。

## 多配置文件

从上面可以看出来，`CASC` 是支持同时加载多个配置文件的。那么，如果多个配置文件中有相同字段的话，是怎么处理的呢？

* 数组：合并
* 相同字段：报错

## Restful API

导出配置 `curl -X POST -u admin:112e74ac1ded9b9af4854e594405819df9  http://localhost:8080/configuration-as-code/export`

查看 Schema `curl -X POST -u admin:112e74ac1ded9b9af4854e594405819df9 http://localhost:8080/configuration-as-code/schema`

重新加载配置 `curl -X POST -u admin:112e74ac1ded9b9af4854e594405819df9 http://localhost:8080/configuration-as-code/reload`

从请求中应用配置 `curl -X POST -u admin:112e74ac1ded9b9af4854e594405819df9 http://localhost:8080/configuration-as-code/apply`
