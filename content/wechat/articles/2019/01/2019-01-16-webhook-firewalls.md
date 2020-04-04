---
title: "在安全防火墙内通过 WebHook 触发构建"
description: "谁说局域网里就不能带 GitHub 的 WebHook 玩？"
tags:
- jenkins
- webhooks
- security
author: michaelneale
translator: linuxsuren
toc: true
share:
- linuxpk
---

在这篇文章中，我将向大家展示，如何让运行在防火墙内的 Jenkins 依然可以实时地收到 GitHub 的 WebHook。当然，你也可以把这个方法应用到如 BitBucket、 DockerHub 或任何可以推送 WebHook 的其他服务中。但是，下面的步骤仅适用于托管在 GitHub 上的项目。

# 什么是 WebHook

简单地描述下什么是 WebHook：事件消息（通常是 JSON，也可以是其他的）由服务端以 HTTP(S) 协议发送到监听的客户端。

{{< img "/images/2019-01-07-webhook-firewalls/webhooks.png" >}}

事件流自左到右，Jenkins 会监听类似 `/github-webhook/` 或 `/dockerhub-webhook/` 等路径上的 HTTP 请求，唤醒并执行一些任务。

GitHub 或 BitBucket 可能会报告一个新的提交或 PR，DockerHub 报告一个上游的镜像发生了变更。这些事情的共同之处在于，它们会推送给 Jenkins，并期待可以推送成功（例如：可以访问到 Jenkins）。在网络是开放的情况下时，例如 GitHub 企业版 或 Jenkins 在监听公网时，这是可以正常工作的。

# 内网环境

当有东西挡在中间时，也就是防火墙：

{{< img "/images/2019-01-07-webhook-firewalls/firewalls.png" >}}

（_按照行业标准，所有防火墙都必须能起到屏障的作用。因此，无论如何，请不要在你的组织内搞破坏_）

当你在笔记本电脑上运行 Jenkins 并希望从 GitHub 接收 WebHook 时，这也是一样的。可能是为了测试你的设置，也可能是为了在 Mac 上运行 iOS 版本构建，又或者是部分网络没有暴露在互联网中，这都是合理的。 除非你的笔记本电脑可以让整个互联网访问到（这当然不太可能），或者你的网络配置得恰到好处，否则网络连接将无法流动，此时 WebHook是不可用的。

没关系，我们可以退而求其次，使用轮询变更的方式。只是这样很糟糕。你会用尽 API 配额，还无法实时地获取变更，这真的不是一个好方法。

# 问题可能也是机会

我们可以解决这个问题，但也可以把这个视为一个机会。有的东西在互联网中不可访问，或者以某些默认的方法锁定是一个特色，不是一个 Bug。你可以很大程度上减少你的攻击面，同时可以进行深度防护：

{{< img "/images/2019-01-07-webhook-firewalls/exposed.png" >}}

# 一个 WebHook 转发服务

输入 link:https://smee.io/[Smee] 这个很容易记住的名字。这是一个由 GitHub 提供的 link:https://github.com/probot/smee[开源软件项目]，还能以服务的方式托管在 GitHub 上。这可以为你捕获并转发 WebHook。我会用一个图来给你解释它。

{{< img "/images/2019-01-07-webhook-firewalls/forwarding.png" >}}

GitHub 把一个事件（该场景下是通过 HTTPS/json）推送给 Smee.io（也就是圆圈标记的部分，暴露在互联网上并能被 GitHub 访问到），而 Jenkins 通过一个客户端使用一个向外的连接订阅 Smee 。注意箭头的方向：Jenkins 只有一个向外的连接。

这一点很重要，只要防火墙允许向外访问就可以工作（像 NAT 以及其他网络通常就是这样的）。如果 Jenkins 无法访问外部的任何服务，那么，本文也就当然不会有什么帮助了（但是这通常不会出现的）。

# 设置

步骤1:首先，访问 https://smee.io/ 并点击 “Start a new channel”:

{{< img "/images/2019-01-07-webhook-firewalls/smee.png" >}}

你会得到一个唯一的 URL（你应该拷贝出来以便后续使用）：

{{< img "/images/2019-01-07-webhook-firewalls/config1.png" >}}

然后，在你运行 Jenkins 的地方安装 smee 客户端：

`npm install --global smee-client`

（这让 smee 命令行客户端可以接收并转发 WebHook）。

现在，启动 smee 客户端并指向你的 Jenkins。在该案例中，我的 Jenkins 运行在 8080 端口（这是默认的，如果在你的笔记本上运行的话，根据需要修改端口和 smee 地址）：

`smee --url https://smee.io/GSm1B40sRfBvSjYS --path /github-webhook/ --port 8080`

这样的话，会连接 smee 服务并转发 WebHook 到 /github-webhook/（最后的斜线很重要，不要丢了）。当运行起来，你将会从日志里看到，它已经连接并转发 WebHook。只要你希望能收到 WebHook 就需要保持该命令的运行。

下一步，你需要配置一个使用 GitHub 的流水线。这里我从头开始配置。如果你已经有了一个的话，可以跳过：

{{< img "/images/2019-01-07-webhook-firewalls/newpipeline.png" >}}

我选择 GitHub 作为代码仓库：

{{< img "/images/2019-01-07-webhook-firewalls/choice.png" >}}

然后，选择你的仓库。这将会设置好来准备接收来自 GitHub 的 WebHook（如果你已经有了流水线，并使用 GitHub 作为 SCM 源，那么也是可以的）。

最后一步，是告诉 GitHub 为那个仓库（或组织也可以）发送 WebHook 事件给 Smee（最终会由 Jenkins 接收到）。

选择你的 GitHub 仓库设置选项卡，并点击 “add webhook”：

{{< img "/images/2019-01-07-webhook-firewalls/addwebhook.png" >}}

然后，配置 WebHook：

* 粘贴从上面步骤中拷贝的 smee 的 URL 
* 选择 `application/json` 作为内容类型
* 选择 `send everything`（你可以选择你想要的事件，但我只是处于简单这么做）。
* 点击 Add Webhook（或 update）

它看起来应该像这样：

{{< img "/images/2019-01-07-webhook-firewalls/config2.png" >}}

好，现在 WebHook 应该可以了。你可以在你的仓库中添加一个变更，并稍后检查构建状态：

{{< img "/images/2019-01-07-webhook-firewalls/running.png" >}}

祝你好运！
