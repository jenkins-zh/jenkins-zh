---
title: 容器PaaS平台集成
weight: 45
---

{{% notice tip %}}
您好，本章我们主要讲述Jenkins与需求管理平台Jira集成。这篇文章是我根据我们当前团队的情况进行定制的，可能有些内容与大家不太一样。重点是告诉大家如何实现集成？关于细节问题可自由定制。 在这里要告诉大家的是思路。
{{% /notice %}}



### 目录

+ [部署jenkins](#部署jenkins)
+ [静态slave](#静态slave)
+ [动态slave](#动态slave)

---

当前我做实验的集群是 v1.17.0。

### 部署jenkins

下载github仓库中的yml文件进行部署
文件地址： https://github.com/zeyangli/devops-on-k8s/blob/master/jenkins.yml
创建命令： kubectl create –f jenkins.yml


创建一个`Deployment`部署jenkins, 保留1个副本。 使用镜像`jenkins/jenkins:2.211`，开放端口30080,开发slave通信端口30081。volume以hostPath方式挂载到了容器中`JENKINS_HOME`。

```
kind: Deployment
apiVersion: apps/v1
metadata:
  labels:
    k8s-app: jenkins
  name: jenkins
  namespace: devops
spec:
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: jenkins
  template:
    metadata:
      labels:
        k8s-app: jenkins
      namespace: devops
      name: jenkins
    spec:
      hostAliases:
      - ip: "192.168.1.200"
        hostnames:
          - "updates.jenkins-ci.org"
      containers:
        - name: jenkins
          image: jenkins/jenkins:2.211
          imagePullPolicy: Always
          ports:
            - containerPort: 30080
              name: web
              protocol: TCP
            - containerPort: 30081
              name: agent
              protocol: TCP
          resources:
            limits:
              cpu: 1000m
              memory: 2Gi
            requests:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /login
              port: 30080
            initialDelaySeconds: 60
            timeoutSeconds: 5
            failureThreshold: 12
          readinessProbe:
            httpGet:
              path: /login
              port: 30080
            initialDelaySeconds: 60
            timeoutSeconds: 5
            failureThreshold: 12
          volumeMounts:
            - name: jenkins-home
              mountPath: /var/lib/jenkins
          env:
            - name: JENKINS_HOME
              value: /var/lib/jenkins
            - name: JENKINS_OPTS 
              value: --httpPort=30080
            - name: JENKINS_SLAVE_AGENT_PORT
              value: "30081"
      volumes:
        - name: jenkins-home
          hostPath: 
            path: /data/devops/jenkins
            type: Directory
      serviceAccountName: jenkins
```

创建一个service，使用nodePort方式暴露端口

```
---
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: jenkins
  name: jenkins
  namespace: devops
spec:
  type: NodePort
  ports:
    - name: web
      port: 30080
      targetPort: 30080
      nodePort: 30080
    - name: slave
      port: 30081
      targetPort: 30081
      nodePort: 30081
  selector:
    k8s-app: jenkins
```

创建RBAC，授权。

```
---
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    k8s-app: jenkins
  name: jenkins
  namespace: devops

---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
 name: jenkins
 namespace: devops
rules:
 - apiGroups: [""]
   resources: ["pods","configmaps","namespaces"]
   verbs: ["create","delete","get","list","patch","update","watch"]
 - apiGroups: [""]
   resources: ["pods/exec"]
   verbs: ["create","delete","get","list","patch","update","watch"]
 - apiGroups: [""]
   resources: ["pods/log"]
   verbs: ["get","list","watch"]
 - apiGroups: [""]
   resources: ["secrets"]
   verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
 name: jenkins
 namespace: devops
roleRef:
 apiGroup: rbac.authorization.k8s.io
 kind: Role
 name: jenkins
subjects:
 - kind: ServiceAccount
   name: jenkins
   namespace: devops
```


### 静态slave
静态slave是在Kubernetes中创建一个固定的pod运行，跟之前我们用VM主机添加agent是一样的。
首先我们登陆Jenkins，创建一个agent，然后获取secret信息。
![images](images/01.png)

我们创建一个`Deployment`部署slave。在这里使用的镜像是`jenkinsci/jnlp-slave:3.36-1`，我在这里挂载了Docker和kubectl方便在pod中构建镜像和使用kubectl命令。挂载本地的一个目录用于workspace。 定义了环境变量`JENKINS_URL,JENKINS_SECRET,JENKINS_AGENT_NAME,JENKINS_AGENT_WORKDIR`。

```
---
kind: Deployment
apiVersion: apps/v1
metadata:
  labels:
    k8s-app: jenkinsagent
  name: jenkinsagent
  namespace: devops
spec:
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: jenkinsagent
  template:
    metadata:
      labels:
        k8s-app: jenkinsagent
      namespace: devops
      name: jenkinsagent
    spec:
      containers:
        - name: jenkinsagent
          image: jenkinsci/jnlp-slave:3.36-1
          securityContext:
            privileged: true
          imagePullPolicy: IfNotPresent
          resources:
            limits:
              cpu: 1000m
              memory: 2Gi
            requests:
              cpu: 500m
              memory: 512Mi
          volumeMounts:
            - name: jenkinsagent-workdir
              mountPath: /home/jenkins/workspace
            - name: buildtools
              mountPath: /home/jenkins/buildtools
            - name: dockersock
              mountPath: "/var/run/docker.sock"
            - name: dockercmd
              mountPath: /usr/bin/docker
            - name: kubectlconfig
              mountPath: /home/jenkins/.kube/config
            - name: kubectlcmd
              mountPath: /usr/bin/kubectl
          env:
            - name: JENKINS_URL
              value: http://192.168.1.200:30080
            - name: JENKINS_SECRET
              value: 5639cac0bf16bf15735d44bc435793417365f4dfa8fc72fb12737f3787091ae8
            - name: JENKINS_AGENT_NAME
              value: build01
            - name: JENKINS_AGENT_WORKDIR
              value: /home/jenkins/workspace
      volumes:
        - name: jenkinsagent-workdir
          hostPath: 
            path: /data/devops/jenkins/workspace
            type: Directory
        - name: buildtools
          hostPath: 
            path: /usr/local/buildtools
            type: Directory
        - name: kubectlconfig
          hostPath: 
            path: /root/.kube/config
        - name: kubectlcmd
          hostPath: 
            path: /usr/bin/kubectl
        - name: dockersock
          hostPath: 
            path: /var/run/docker.sock
        - name: dockercmd
          hostPath: 
            path: /usr/bin/docker
```


### 动态slave
安装kubernetes插件（安装完成后最好重启一下）。配置插件信息  系统设置 -> 最后面 Cloud ->增加一个云。


**制作Kubernetes证书**

* 进入集群服务器 .kube/config
* 复制config文件中的certificate-authority-data内容，生成base64文件  ca.crt
* 复制config文件中的client-certificate-data内容，生成base64文件 client.crt
* 复制config文件中的client-key-data内容，生成base64文件 client.key
   - echo zzzzzzzzz | base64 –d > client.key

* 生成证书（会输入密码需要记住后面jenkins需要配置）
  - openssl pkcs12 -export -out cert.pfx -inkey client.key -in client.crt -certfile ca.crt
* 下载证书 cert.pfx


**Jenkins新建凭据** 

新建凭据 证书类型  上传刚刚下载的证书。并输入证书密码
![images](images/02.png)



将ca.crt 内容复制到 服务证书key 选择证书凭据 测试连接
![images](images/03.png)

**编写Jenkinsfile测试**

文件地址： https://github.com/zeyangli/devops-on-k8s/blob/master/jenkinsfile/jenkinsslave.jenkinsfile

关于Jenkinsfile的写法还有一种使用`podtemplate`感觉只是对`yaml`做了包装，学习成本高于原生yaml。所以这里直接使用了`yaml`定义的。

```
pipeline{
    agent{
        kubernetes{
            label "test01"
            cloud 'kubernetes'
            yaml '''
---
kind: Pod
apiVersion: v1
metadata:
  labels:
    k8s-app: jenkinsagent
  name: jenkinsagent
  namespace: devops
spec:
containers:
  - name: jenkinsagent
    image: jenkinsci/jnlp-slave:3.36-1
    imagePullPolicy: IfNotPresent
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 512Mi
    volumeMounts:
      - name: jenkinsagent-workdir
        mountPath: /home/jenkins/workspace
      - name: buildtools
        mountPath: /home/jenkins/buildtools
    env:
      - name: JENKINS_AGENT_WORKDIR
        value: /home/jenkins/workspace
volumes:
  - name: jenkinsagent-workdir
    hostPath:
      path: /data/devops/jenkins/workspace
      type: Directory
  - name: buildtools
    hostPath:
      path: /usr/local/buildtools
      type: Directory
'''
        }
    }


    stages{
        stage("test"){
          steps{
            script{
              sh "sleep 30"
            }
          }
        }
    }
}

```

赶快运行一下吧！ 相信你已经成功了。

---