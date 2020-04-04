---
title: "回顾 2018: 革新的一年"
description: "Jenkins 创始人 KK 先生的年终总结"
tags:
- core
- community
author: kohsuke
translator: arjenzhou
share:
- linuxpk
---

临近年终，是一个思考总结、展望全局的好时机。那就让我们暂时从日常繁复的工作中停下脚步，一起来盘点 Jenkins 在 2018 这一年的得失与喜乐。

{{< img "/images/2018-256.jpg" >}}

在整个行业中，对进一步自动化的不懈追求仍在继续。我们正以前所未有的速度编写软件，与此同时，对于软件的需求似乎越来越高，我觉得越来越多的企业和高管都敏锐地意识到[软件和开发者已登基为王](https://www.ciodive.com/news/software-is-king-and-developers-are-in-high-demand/519272/)。在底层的角度，我遇到的每个团队都认为软件交付自动化是他们的“软件工厂”的关键部分，对这些团队而言，创建、管理具有不可思议的灵活性和可视性的自动化十分重要。

自诞生14年以来，Jenkins 将继续在实现这一目标上发挥重要作用，总之，[增长的步伐似乎正在加速](http://stats.jenkins.io/jenkins-stats/svg/total-jenkins.svg)。在这个发展飞快的行业里，成为这一成就的一份子着实让我感到自豪。

把 Jenkins 打造为每个人都会使用的工具，这具有很大的责任感。所以在 Jenkins 社区，我们一直都十分努力。事实上，在各个领域和层面上来说，*2018年是整个项目历史上最具有创新性的一年*。

* 随着不断发展壮大，我们亟需探索出能使更多人更好地参与其中的方法。[JEPs](https://github.com/jenkinsci/jep/) 和 [SIGs](https://jenkins.io/sigs/) 便应运而生。2018年，我们看到了这些形式得到了巨大的吸引力。经过一年的运营，我认为我们已经学到了很多东西，希望我们会在此基础上继续改进。
* 这些新的形式带来了新的协作方式。例如：[中文本地化 SIG](https://jenkins.io/sigs/chinese-localization/)运营的 [微信公众号](https://jenkins.io/sigs/chinese-localization/#wechat)和[本地化网站](https://jenkins.io/zh/)。[平台 SIG](https://jenkins.io/sigs/platform/) 在 [Java 11 support](https://jenkins.io/zh/blog/2018/12/14/java11-preview-availability/) 中也给予了不少帮助。
* 我也很高兴看到新一批领导者。由于害怕遗漏一些人，所以我不打算在此一一列出，我们在今年秋天祝贺他们中的许多人作为 [Jenkins 大使](https://flic.kr/p/2asPXx1)（请在明年[提名更多人](https://wiki.jenkins.io/display/JENKINS/Jenkins+Ambassador)!）。那些领导关键工作的人往往是那些不熟悉这些角色的人。
* 一些领导者也努力发掘新的贡献者。我们正在有意识地思考，我们哪一部分的潜在贡献者没有被发掘出来，为什么没有被发掘出来。这也是任一个企业都在做的事情。同时我们也是 [Google Summer of Code](https://jenkins.io/zh/blog/2018/10/14/gsoc2018-results/) 和 [Outreachy](https://jenkins.io/zh/blog/2018/12/10/outreachy-audit-log-plugin/) 参与者。
* 今年我们的安全流程和修复速度再次大幅提升，反映出用户对我们的信任也随之增强。例如，[我们今年推出了遥测系统](https://jenkins.io/zh/blog/2018/10/09/telemetry/)，通知我们更快地开发出更好的修复方案。

现在，社区改进的最重要的地方是我们为您使用的软件带来的影响。在这一方面，我认为我们在2018年做得不错，产生了我所谓的“[五个超级武器](https://www.youtube.com/watch?v=qE3tfS7k1VI)”

* [Jenkins X](https://jenkins-x.io/) 可能是今年最明显的创新，使得在 Kubernetes 上创建现代云应用程序变得更加容易。这也标志着 [Jenkins 社区及其使命的重大扩展](https://jenkins.io/zh/blog/2018/03/20/evolving-mission-of-jenkins/)。
* [Jenkins Configuration as Code](https://jenkins.io/projects/jcasc/) 在今年达到了一重要的里程碑 "1.0" ，并且他继续获得更大的动力。
* "Cloud Native Jenkins" 是我为[新努力作的术语](https://jenkins.io/zh/blog/2018/08/31/shifting-gears/)，把 Jenkins 转换为 Kubernetes 上大规模运行的通用 CI/CD 引擎。这里还有许多东西需要定义，但你已经可以看到如 [Serverless Jenkins](https://medium.com/@jdrawlings/serverless-jenkins-with-jenkins-x-9134cbfe6870) 这样的好东西了。
* [Evergreen](https://jenkins.io/projects/evergreen/) 是另一个需要推出的新项目，它有着雄心勃勃的主题——大量地简化了 Jenkins 的使用和操作。
* 流水线方面的努力形成了[一个新的 SIG](https://jenkins.io/sigs/pipeline-authoring/)，我期待它在2019年带来的新影响。

Jenkins 社区能够将用户可见的改变与社区的改进结合在一起，这不仅是不算秘密的秘密，也是社区不断发展的能力。
展望2019年，毫无疑问，随着我们不断地学习和实践，上述提到的事情将不断地发展、变化、融合和分裂。

所以，请在 Twitter 上关注 [@jenkinsci](https://twitter.com/jenkinsci) 和 [@jenkinsxio](https://twitter.com/jenkinsxio)，了解我们将如何发展的最新动态，加入我们的社区来共同构建震撼世界的软件。多少开源项目敢说出这种话呢？
