---
title: Jenkins 对审计日志的支持
description: "Outreachy 实习生提供了 Jenkins 对审计日志的支持"
date: 2019-02-13
tags:
- community
- outreachy
- outreachy2018
author: jvz
translator: linuxsuren
---

今年是 Jenkins 项目首次参与 [Outreachy](https://www.outreachy.org/). Outreachy 是一个类似于 Google Summer of Code (GSoC) 的项目，
实习生有偿地为开源项目工作。
关键的不同之处在于，Outreachy 面向那些在他们国家的技术行业中受到歧视或偏见的小众群体。
当我了解到这个项目后，由于它的包容性与社区建设与我的理念相符就立即自愿作为导师来参与。
我很高兴地说，Jenkins 项目和我的雇主 [CloudBees](https://www.cloudbees.com) 对此非常支持。

基于我们之前在 GSoC 上指导学生的付出，今年我们已经加入 Outreachy 并指导了两个实习生。
在 Outreachy 的这次活动中，我们的实习生 [David Olorundare](https://github.com/davidolorundare) 和 [LathaGunasekar](https://github.com/Lathaguna) 将与我一起研发 [Jenkins 对审计日志的支持](https://github.com/jenkinsci/audit-log-plugin)。
我很高兴欢迎 David 和 Latha, 并期待他们能在软件工程专业和对开源社区的贡献上都有所收获。
请继续关注后续博客对他们的介绍。

该审计日志支持项目在 Jenkins 和 [Apache Log4j](https://logging.apache.org/log4j/2.x/) 之间形成了一个新的链接，这给予我们的实习生学习
更多有关开源治理和认识新朋友的机会。
作为奖金，该项目旨在为支持高级的业务检测提供便利，例如：在认证事件中检测潜在的入侵尝试。
我们也会编写一个 [JEP](https://github.com/jenkinsci/jep) 来描述由插件提供的审计日志 API,以及其他插件如何定义并记录除 Jenkins 核心以外插件的审计事件。

我期待我们将会一起完成了不起的作品，而且我希望在将来能够帮助更多的 Outreachy 实习生！
