---
title: 致广大Jenkins 中文社区的感谢信  
description: 致广大Jenkins 中文社区的感谢信  
date: 2020-05-16  
author: zhouyou  
translator: walker0921  
poster: cover.png  

---

![cover](cover.png)

故事要从 2020/5/12 社区公众号发布的文章 [手把手教会你 Jenkins 备份与恢复](https://mp.weixin.qq.com/s?__biz=Mzg2MzAwNzU3Nw==&mid=2247484860&idx=1&sn=f3e385a9d6bdf9892d4a488d34e148da&chksm=ce7e638af909ea9c42cdaebb0df6a5eb396bf014bfa1b0e2fd840c27b56ab9a8f9184006c4c3&scene=21#wechat_redirect) 说起。 

##### 1-先从故事本身说起

5月12日，公众号发布了一篇有关 Jenkins 备份与恢复的文章，其中分享了以下一段备份 Shell 脚本：

```
#!/bin/bash  
# Jenkins Configuraitons Directory  
cd $JENKINS_HOME  

# Add general configurations, job configurations, and user content  
git add -- *.xml jobs/*/*.xml userContent/* ansible/*  

# only add user configurations if they exist  
if [ -d users ]; then  
    user_configs=`ls users/*/config.xml`  

    if [ -n "$user_configs" ]; then  
        git add $user_configs  
    fi  
fi  

# mark as deleted anything that's been, well, deleted  
to_remove=`git status | grep "deleted" | awk '{print $3}'`  

if [ -n "$toremove" ]; then  
    git rm --ignore-unmatch $toremove  
fi  

git commit -m "Automated Jenkins commit"  

git push -q -u origin master  

```

文章格式核对完成后，便在公众号上发布了。

##### 2-火眼金睛出现了

5月13日，微信公众号有一昵称为"奋斗”的小伙伴给我们留言，指出了文中的一处错误：

![error-message](error-message.png)

我们仔细核对后，发现脚本确实存在错误，并立马修改为正确的版本，目前修改后的文章已发布。
对“奋斗”小伙伴的反馈再次表示感谢！

##### 3-故事引发的几点感想

1.由于我们在发布文章时检查不够细致导致发布文章有误，给各位带来的困惑，在此对各位社区关注者表示歉意。
2.我们相信，还有很多小伙伴一直密切关注着 Jenkins 中文社区的发展及动态，欢迎每一位关注社区的人来监督并提出宝贵意见。

# 关于我们

我们是由Jenkins国内爱好者、贡献者自发组建的一个技术社区，致力于共同推广以及完善 CI/CD 技术的学习使用和落地。

我们尊重每一位技术人的梦想，真诚的欢迎每一位对Jenkins、CI/CD 或开源社区感兴趣的小伙伴加入我们，共同推广以及完善 CI/CD 技术的学习试用和落地。