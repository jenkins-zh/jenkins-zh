---
title: "Docker安装Jenkins基础环境 "
weight: 10
#pre: "<b> </b>"
chapter: true
draft: false
date: 2018-12-29T11:02:05+06:00
lastmod: 2020-01-05T10:42:26+06:00
# search related keywords
keywords: ["Docker安装Jenkins基础环境"]
---




### 0.整体架构

![images](../images/20.png)





### 1.Jenkins-Master

前往DockerHub下载Jenkins长期支持版本镜像。

![](../images/02.png)





https://github.com/jenkinsci/docker   dockerfile



查看官方的镜像历史(获取Jenkins相关信息)

```
ARG http_port=8080
ARG agent_port=50000
ARG JENKINS_HOME=/var/jenkins_home
ARG REF=/usr/share/jenkins/ref
ENV JENKINS_HOME=/var/jenkins_home
ENV JENKINS_SLAVE_AGENT_PORT=50000
```

启动Jenkins

```shell
docker run --name jenkins -itd \
       -p 8081:8080 \
       -p 50000:50000 \
       -v ~/jenkins:/var/jenkins_home \
       jenkins/jenkins:lts
docker logs -f jenkins  #查看日志并获取初始化密码
```



安装向导

![images](../images/00.png)



![images](../images/01.png)



我想很多同学遇到过插件下载导致Jenkins安装失败的情况，为了解决这个问题我们可以通过配置插件源解决。



编辑 hudson.model.UpdateCenter.xml，这个文件是用于设置插件的更新源地址。只需要替换其中的URL。

```
<?xml version='1.1' encoding='UTF-8'?>
<sites>
  <site>
    <id>default</id>
    <url>https://updates.jenkins-zh.cn/update-center.json</url>
  </site>
</sites>
```



默认的Jenkins证书是国外官方源证书，这里切换了新的源所以需要添加新的证书。 接下来更改证书。从github中获取证书文件，保存到${JENKINS_HOME}/war/WEB-INF/update-center-rootCAs/ 目录中。注意文件命名要一致。

https://github.com/jenkins-zh/docker-zh/blob/master/mirror-adapter.crt

```
ZeyangdeMacBook-Pro:jenkins zeyang$ cd war/WEB-INF/update-center-rootCAs/
ZeyangdeMacBook-Pro:update-center-rootCAs zeyang$ ls
jenkins-update-center-root-ca		jenkins-update-center-root-ca-2.txt
jenkins-update-center-root-ca-2		jenkins-update-center-root-ca.txt
ZeyangdeMacBook-Pro:update-center-rootCAs zeyang$ rm -fr *
ZeyangdeMacBook-Pro:update-center-rootCAs zeyang$ vim mirror-adapter.crt
ZeyangdeMacBook-Pro:update-center-rootCAs zeyang$ ls
mirror-adapter.crt

a
```



使用Docker命令重启Jenkins，重新配置安装向导。你会发现Jenkins插件安装的很快。

```
docker restart jenkins
```



创建一个admin用户

![images](../images/03.png)



![image](../images/04.png)



![images](../images/05.png)



----



### 2.Docker安装Jenkins Slave节点(静态)

首先我们在Jenkins的节点管理中，添加节点。输入节点的名称和类型。

![image](../images/06.png)



配置节点信息：自定义目录  启动方式： java web 。

![images](../images/07.png)

获取JNLP方式运行slave所需要的秘钥信息。

![images](../images/08.png)

```shell
java -jar agent.jar \
     -jnlpUrl http://127.0.0.1:8081/computer/build01/slave-agent.jnlp \
     -secret dcc50b0650c1deb806f1e9b855527b83c57df1fd6363ca6e2f814b0b1d273c54 \
     -workDir "/home/jenkins"
```



获取jnlp slave的docker镜像 https://hub.docker.com/r/jenkins/jnlp-slave

```shell
docker pull jenkins/jnlp-slave:alpine

docker run -itd jenkins/jnlp-slave:alpine -url http://192.168.43.30:8081 dcc50b0650c1deb806f1e9b855527b83c57df1fd6363ca6e2f814b0b1d273c54 build01
```



启动slave测试，出现以下日志表示成功连接。这个部分容易出现问题，原因很可能是因为网络权限导致的。

```
ZeyangdeMacBook-Pro:jenkins zeyang$ docker run -it jenkins/jnlp-slave:alpine -url http://192.168.1.101:8081 dcc50b0650c1deb806f1e9b855527b83c57df1fd6363ca6e2f814b0b1d273c54 build01
Mar 03, 2020 5:20:01 AM hudson.remoting.jnlp.Main createEngine
INFO: Setting up agent: build01
Mar 03, 2020 5:20:01 AM hudson.remoting.jnlp.Main$CuiListener <init>
INFO: Jenkins agent is running in headless mode.
Mar 03, 2020 5:20:01 AM hudson.remoting.Engine startEngine
INFO: Using Remoting version: 4.0.1
Mar 03, 2020 5:20:01 AM hudson.remoting.Engine startEngine
WARNING: No Working Directory. Using the legacy JAR Cache location: /home/jenkins/.jenkins/cache/jars
Mar 03, 2020 5:20:01 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Locating server among [http://192.168.1.101:8081]
Mar 03, 2020 5:20:01 AM org.jenkinsci.remoting.engine.JnlpAgentEndpointResolver resolve
INFO: Remoting server accepts the following protocols: [JNLP4-connect, Ping]
Mar 03, 2020 5:20:01 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Agent discovery successful
  Agent address: 192.168.1.101
  Agent port:    50000
  Identity:      12:76:ae:50:52:fa:50:f9:b4:f0:29:be:72:09:eb:68
Mar 03, 2020 5:20:01 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Handshaking
Mar 03, 2020 5:20:01 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Connecting to 192.168.1.101:50000
Mar 03, 2020 5:20:01 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Trying protocol: JNLP4-connect
Mar 03, 2020 5:20:02 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Remote identity confirmed: 12:76:ae:50:52:fa:50:f9:b4:f0:29:be:72:09:eb:68
Mar 03, 2020 5:20:04 AM hudson.remoting.jnlp.Main$CuiListener status
INFO: Connected
```

查看效果

![images](../images/09.png)



----





### 3. 基于Docker配置Jenkins Slave节点(动态)

docker插件： https://plugins.jenkins.io/docker-plugin/

项目地址： https://github.com/jenkinsci/docker-plugin



对与Jenkins动态slave的配置，其实就是Jenkins调用Docker的接口完成的。我们需要开启Docker远程访问。我的机器是Mac遇到很多坑，顺便学习下Mac下docker的不同配置方式。哈哈~

docker 开启API远程访问 (mac) 参考文档： https://juejin.im/entry/5bdf04b06fb9a049e41223f1

```
docker pull bobrik/socat
docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 2376:2375 bobrik/socat TCP4-LISTEN:2375,fork,reuseaddr UNIX-CONNECT:/var/run/docker.sock
```

---



如果你的docker环境是使用的centos系统，可以做如下配置。编辑/usr/lib/systemd/system/docker.service 

```
[Service]
Type=notify
# the default is not to use systemd for cgroups because the delegate issues still
# exists and systemd currently does not support the cgroup feature set required
# for containers run by docker
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix://var/run/docker.sock
```


```
systemctl daemon-reload
systemctl restart docker
```



---



当我们把上面的配置完成后，可以通过Curl命令进行基本的测试API。出现一下信息表示成功开启。

```
#curl -XGET http://127.0.0.1:2376/version

{"Platform":{"Name":"Docker Engine - Community"},"Components":[{"Name":"Engine","Version":"19.03.5","Details":{"ApiVersion":"1.40","Arch":"amd64","BuildTime":"2019-11-13T07:29:19.000000000+00:00","Experimental":"false","GitCommit":"633a0ea","GoVersion":"go1.12.12","KernelVersion":"4.19.76-linuxkit","MinAPIVersion":"1.12","Os":"linux"}},{"Name":"containerd","Version":"v1.2.10","Details":{"GitCommit":"b34a5c8af56e510852c35414db4c1f4fa6172339"}},{"Name":"runc","Version":"1.0.0-rc8+dev","Details":{"GitCommit":"3e425f80a8c931f88e6d94a8c831b9d5aa481657"}},{"Name":"docker-init","Version":"0.18.0","Details":{"GitCommit":"fec3683"}}],"Version":"19.03.5","ApiVersion":"1.40","MinAPIVersion":"1.12","GitCommit":"633a0ea","GoVersion":"go1.12.12","Os":"linux","Arch":"amd64","KernelVersion":"4.19.76-linuxkit","BuildTime":"2019-11-13T07:29:19.000000000+00:00"}
```



---



#### Jenkins配置

我们需要安装插件 `Docker plugin`



##### 方式1： 启动镜像进行构建(无需连接master)

```
dockerNode(dockerHost: 'tcp://192.168.43.30:2376', image: 'jenkins/jnlp-slave:alpine') {
    // some block
    sh "sleep 50"
}
```





----



##### 方式2： 使用CLoud

配置云： 系统设置 -> CLoud-> Docker

![images](../images/10.png)





#### Docker Cloud details

- Docker Host URI  Docker主机信息(需要开启Docker配置)
  - tcp://192.168.1.101:2376  
  - unix:///var/run/docker.sock
- Connection Timeout  连接超时时间
- Read Timeout  读操作超时时间  （调大些，容易出现超时的情况）
- Enabled  是否启用？默认否
- Error Duration 错误的持续时间 默认300 5分钟

- Container Cap 容器数量 负值或零，或2147483647都意味着“无限制” ,默认值100。



![images](../images/12.png)



---



#### Docker Agent templates

- Labels 节点标签
- Enabled 是否启动 默认否
- Name 节点名称
- Docker Image 镜像标签
- Remote File System Root  远程文件系统根目录
- 用法 自定义指定项目运行
- Connect method 连接方式
  - JNLP 推荐
    - User  运行用户
    - Jenkins URL jenkins地址
    - Idle timeout 空闲时间多少秒后杀死slave
  - SSH
  - Docker Container
- Pull strategy 镜像下载策略
- Pull timeout 镜像下载超时时间  单位秒
- Instance Capacity 实例数量

![images](../images/11.png)



---



测试

```

node("jenkins-agent"){
    echo "Hello world!"
    sh "sleep 20"
    
}
```



插件日志

```
2020-03-03 10:49:45.335+0000 [id=772]	INFO	c.n.j.plugins.docker.DockerCloud#provision: Asked to provision 1 slave(s) for: jenkins-agent
2020-03-03 10:49:45.349+0000 [id=772]	INFO	c.n.j.plugins.docker.DockerCloud#canAddProvisionedSlave: Provisioning 'jenkins/jnlp-slave:alpine' on 'docker'; Total containers: 0 (of 100)
2020-03-03 10:49:45.350+0000 [id=772]	INFO	c.n.j.plugins.docker.DockerCloud#provision: Will provision 'jenkins/jnlp-slave:alpine', for label: 'jenkins-agent', in cloud: 'docker'
2020-03-03 10:49:45.351+0000 [id=772]	INFO	h.s.NodeProvisioner$StandardStrategyImpl#apply: Started provisioning Image of jenkins/jnlp-slave:alpine from docker with 1 executors. Remaining excess workload: 0
2020-03-03 10:49:45.381+0000 [id=790]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Trying to run container for jenkins/jnlp-slave:alpine
2020-03-03 10:49:45.382+0000 [id=790]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Trying to run container for node jenkins-agent-00008ji9rxxyf from image: jenkins/jnlp-slave:alpine
2020-03-03 10:49:45.486+0000 [id=790]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Started container ID 8c2ccceb95d73df2e706606c280529c050bed8aea2b29f9ecb00c4e8ac00da91 for node jenkins-agent-00008ji9rxxyf from image: jenkins/jnlp-slave:alpine
2020-03-03 10:49:48.060+0000 [id=34]	INFO	hudson.slaves.NodeProvisioner#lambda$update$6: Image of jenkins/jnlp-slave:alpine provisioning successfully completed. We have now 3 computer(s)
2020-03-03 10:49:48.061+0000 [id=34]	INFO	c.n.j.plugins.docker.DockerCloud#provision: Asked to provision 1 slave(s) for: jenkins-agent
2020-03-03 10:49:48.081+0000 [id=34]	INFO	c.n.j.plugins.docker.DockerCloud#canAddProvisionedSlave: Provisioning 'jenkins/jnlp-slave:alpine' on 'docker'; Total containers: 1 (of 100)
2020-03-03 10:49:48.082+0000 [id=34]	INFO	c.n.j.plugins.docker.DockerCloud#provision: Will provision 'jenkins/jnlp-slave:alpine', for label: 'jenkins-agent', in cloud: 'docker'
2020-03-03 10:49:48.100+0000 [id=34]	INFO	h.s.NodeProvisioner$StandardStrategyImpl#apply: Started provisioning Image of jenkins/jnlp-slave:alpine from docker with 1 executors. Remaining excess workload: 0
2020-03-03 10:49:48.109+0000 [id=790]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Trying to run container for jenkins/jnlp-slave:alpine
2020-03-03 10:49:48.114+0000 [id=790]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Trying to run container for node jenkins-agent-00008jjiw9wr7 from image: jenkins/jnlp-slave:alpine
2020-03-03 10:49:48.206+0000 [id=790]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Started container ID 5cffbc190cd3b6d33ca3db6ae5a5dc663abb10ab0e5735d84f3297f6eace351d for node jenkins-agent-00008jjiw9wr7 from image: jenkins/jnlp-slave:alpine
2020-03-03 10:49:58.026+0000 [id=31]	INFO	hudson.slaves.NodeProvisioner#lambda$update$6: Image of jenkins/jnlp-slave:alpine provisioning successfully completed. We have now 4 computer(s)
2020-03-03 10:49:58.027+0000 [id=31]	INFO	c.n.j.plugins.docker.DockerCloud#provision: Asked to provision 1 slave(s) for: jenkins-agent
2020-03-03 10:49:58.062+0000 [id=31]	INFO	c.n.j.plugins.docker.DockerCloud#canAddProvisionedSlave: Provisioning 'jenkins/jnlp-slave:alpine' on 'docker'; Total containers: 2 (of 100)
2020-03-03 10:49:58.063+0000 [id=31]	INFO	c.n.j.plugins.docker.DockerCloud#provision: Will provision 'jenkins/jnlp-slave:alpine', for label: 'jenkins-agent', in cloud: 'docker'
2020-03-03 10:49:58.065+0000 [id=31]	INFO	h.s.NodeProvisioner$StandardStrategyImpl#apply: Started provisioning Image of jenkins/jnlp-slave:alpine from docker with 1 executors. Remaining excess workload: 0
2020-03-03 10:49:58.080+0000 [id=772]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Trying to run container for jenkins/jnlp-slave:alpine
2020-03-03 10:49:58.081+0000 [id=772]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Trying to run container for node jenkins-agent-00008jo4d2fzv from image: jenkins/jnlp-slave:alpine
2020-03-03 10:49:58.210+0000 [id=772]	INFO	c.n.j.p.docker.DockerTemplate#doProvisionNode: Started container ID 03f05fe37cadf74ba056c72b591cdba54c467addd29e751e76a8a70be0f82cfb for node jenkins-agent-00008jo4d2fzv from image: jenkins/jnlp-slave:alpine
```



### 4.FAQ

Read timed out需要调整Docker Cloud details -> Read Timeout  时间。

```
2020-03-03 11:20:26.925+0000 [id=1253]	SEVERE	c.n.j.p.docker.DockerCloud$1#run: Error in provisioning; template='DockerTemplate{configVersion=2, labelString='jenkins-agent', connector=io.jenkins.docker.connector.DockerComputerJNLPConnector@1216d52a, remoteFs='/home/jenkins', instanceCap=2147483647, mode=NORMAL, retentionStrategy=com.nirima.jenkins.plugins.docker.strategy.DockerOnceRetentionStrategy@2677ee78, dockerTemplateBase=DockerTemplateBase{image='jenkins/jnlp-slave:alpine', pullCredentialsId='', registry=null, dockerCommand='', hostname='', dnsHosts=[], network='', volumes=[], volumesFrom2=[], environment=[], bindPorts='', bindAllPorts=false, memoryLimit=null, memorySwap=null, cpuShares=null, shmSize=null, privileged=false, tty=false, macAddress='null', extraHosts=[], extraDockerLabels=null}, removeVolumes=false, pullStrategy=PULL_NEVER, nodeProperties=[], disabled=BySystem,3.5 sec,4 min 53 sec,Template provisioning failed.}' for cloud='docker'
java.net.SocketTimeoutException: Read timed out: No data received within 10000ms.  Perhaps the docker API (tcp://192.168.1.101:2376) is not responding normally, or perhaps you need to increase the readTimeout value.
```

