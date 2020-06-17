---
title: Docker容器集成
weight: 60
---


 

1. Docker安装Jenkins基础环境
   1. 整体架构
   2. Jenkins-Master
   3. Docker安装Jenkins Slave节点(静态)
   4. 基于Docker配置Jenkins Slave节点(动态)
      1. 方式1： 启动镜像进行构建(无需连接master)
      2. 方式2： 使用CLoud
         1. Docker Cloud details
         2. Docker Agent templates
   5. FAQ
2. 基于Docker的pipeline流水线
   1. 整体架构
   2. 准备工作
   3. 测试流水线
   4. 前后端未分离项目
   5. 前端项目流水线
   6. FAQ
3. 应用镜像生命周期管理
   1. 分支开发策略
   2. 镜像管理规范
      1. 命名规范
      2. 镜像清理策略
   3. 构建应用镜像
      1. 编写应用Dockerfile
      2.  配置流水线构建镜像
      3. 上传镜像
   4. 镜像清理
4. 使用Groovy代码初始化Docker配置
   1. 解析官方提供的groovy代码
   2. 实例： 添加一个 JNLP类型的Docker Cloud配置



---





## 准备工作

### 安装Docker

- MAC系统
  - 下载地址：http://mirrors.aliyun.com/docker-toolbox/mac/docker-for-mac/stable/
- windows系统
  - 下载地址：http://mirrors.aliyun.com/docker-toolbox/windows/docker-for-windows/stable/
- Linux系统

```
yum -y install docker-ce 
systemctl start docker 
systemctl enable docker 
```

### 镜像仓库

- https://hub.docker.com/



---





