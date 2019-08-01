---
type: tutorial
title: 在 Jenkins 中配置邮件服务器
toc: true
author: linuxsuren
editors:
- linuxsuren
references:
- name: mailer 插件
  link: https://plugins.jenkins.io/mailer
- name: Email 扩展插件
  link: https://plugins.jenkins.io/email-ext
---

我们需要在`系统管理》系统设置`中配置邮件服务器的信息。

在`邮件通知`区域，给出类似如下的配置：

|配置项|样例值|说明|
|---|---|---|
|SMTP服务器|smtp.exmail.qq.com||
|用户默认邮件后缀|@jenkins-zh.cn||
|SMTP服务器|smtp.exmail.qq.com||
|用户名|demo@jenkins-zh.cn||
|密码|demo||
|使用SSL协议|||
|SMTP端口|465||
|Reply-To Address|demo@jenkins-zh.cn||
|字符集|UTF-8||

## 腾讯企业邮箱
上面给出的例子就是腾讯企业邮箱的配置，对于密码部分，我们需要生成客户端密码。

## 流水线
当我们通过上面的步骤，将邮件服务器配置成功后，就可以使用类似如下的流水线步骤来发送邮件了。

`mail bcc: '', body: 'Here is the content.', cc: 'demo@jenkins-zh.cn', from: '', replyTo: '', subject: 'subject', to: 'demo@jenkins-zh.cn'`
