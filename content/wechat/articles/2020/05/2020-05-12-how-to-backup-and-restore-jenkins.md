---
title: 手把手教会你 Jenkins 备份与恢复  
description: 手把手教你如何完成 Jenkins 备份和恢复  
date: 2020-05-12  
author: oleksii_y  
translator: walker0921  
poster: jenkins.png  
original: https://medium.com/@_oleksii_/how-to-backup-and-restore-jenkins-complete-guide-62fc2f99b457  
tags:  
- Jenkins  
- CI/CD  

---

![cover](jenkins.png)
##  前言

Jenkins 是一个 Java 语言编写的开源工具，结合持续集成与持续交付相关技术的运用可提升软件开发过程的自动化水平。 

Jenkins 从最开始安装到权限设置，插件安装，任务维护等是一个费力的工程，因此定期备份数据的重要性不言而喻。

在本文中，我们将手把手演示如何备份并恢复 Jenkins。

##  备份操作指引

##### Step1：创建一个新的任务

这里推荐自由风格任务类型，即 Freestyle project

![create-backup-job](create-backup-job.png)

##### Step2：源码管理选择 None

![source-code-management](source-code-management.png)

##### Step3：设置任务执行时间

选择 “Build Periodically”，然后可以根据需要设置备份时间和频率

![build-triggers](build-triggers.png)

例如，25 12 * * * 会在每天白天 12:25 运行任务


##### Step4：Build 模块添加 “Execute Shell”

在 Build 模块选择 Execute Shell，添加以下脚本内容

![backup-shell](backup-shell.png)

为方便读者直接使用，脚本内容如下：

```
  #!/bin/bash  
  #  Jenkins Configuraitons Directory  
  cd $JENKINS_HOME  
    
  #  Add general configurations, job configurations, and user content  
  git add -- *.xml jobs/*/*.xml userContent/* ansible/*  
    
  #  only add user configurations if they exist  
  if [ -d users ]; then  
  user_configs=`ls users/*/config.xml`  
    
  if [ -n "$user_configs" ]; then  
  git add $user_configs  
  fi  
  fi  
    
  # mark as deleted anything that's been, well, deleted  
  to_remove=`git status | grep "deleted" | awk '{print $3}'`  
    
  if [ -n "$to_remove" ]; then  
  git rm --ignore-unmatch $to_remove  
  fi  
    
  git commit -m "Automated Jenkins commit"  
  
  git push -q -u origin master  
```


##### Step5：保存以上设置

![save](save.png)

##### Step6：初始化本地 git 仓库

我们现在已经添加了一个备份所有 Jenkins 数据的任务，所有的备份数据将会存储到服务端的 /var/lib/jenkins 目录。

假如目前有一个用户名为 jenkins，进入此目录，执行以下命令

```cd /var/lib/jenkins && git init```

##### Step7：本地仓库关联 GitHub 

```git remote add origin git@github.com:username/new_repo```
    
##### Step8：测试备份任务是否生效

Jenkins 任务主页，点击 Build now 按键。如果看到以下输出，说明备份任务已成功创建并生效。

![console-output](console-output.png)

##  数据恢复操作指引

##### Step1：清空 Jenkins 主目录

```cd /var/lib/jenkins && rm -rf * ```
 
##### Step2：Jenkins 主目录初始化成 git 仓库

```cd /var/lib/jenkins && git init```

##### Step3：递归清除未纳入版本控制的文件

```git clean -df```

##### Step4：添加新的远程仓库地址

```git remote add origin git@github.com:username/new_repo```

##### Step5：从 GitHub pull 备份数据

```git pull origin master```

##### Step6. 以 root 账户重启 Jenkins

```service jenkins restart```

至此，数据已完全恢复。