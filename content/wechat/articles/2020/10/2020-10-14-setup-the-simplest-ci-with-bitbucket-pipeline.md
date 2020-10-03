---
title: "使用 Bitbucket 流水线创建最简单的 CI"  
date: 2020-10-14  
description: "具体讲解了怎样使用 Bitbucket 构建一个简单的 CI 流水线"  
author: Ferenc Almasi  
translator: 0N0thing  
original: https://medium.com/swlh/setup-the-simplest-ci-with-bitbucket-pipelines-7989e934e700  
poster: cover.jpg  
tags:  
- Continuous Integration  
- Frontend  
- Web Development  
- Pipeline
- Ci
---

![cover](cover.jpg)

最近我写了一篇关于 [CI 和 CD](https://www.webtips.dev/ci-vs-cd) 之间核心区别的文章，我觉得是时候把这些理论运用到实际当中了。

在我印象中我参与开发的所有项目使用的源码控制平台都是使用的 Artlassian 的 [Bitbucket](https://bitbucket.org/product/)。对于想要寻找一款免费、UI 整洁、能够为追踪你的代码提供了所有必要功能的版本控制系统来说，它是一个再棒不过的选择了。

除了所有版本控制系统提供的基本功能以外，Bitbucket 添加了一些扩展比如集成了 CI/CD 功能，可以让我们推送代码之后将变更更准确的部署上去。

好处就是不需要额外的工具了，只需要 Bitbucket 以及 JavaScript。

## 配置 Bitbucket

仓库设置完成后，剩下需要完成的工作就是在配置你的仓库允许使用 Pipelines。滚动到 `PIPELINE` 部分点击 **Settings**。你会看到如下所示配置:

![pipeline-configuration](pipeline-configuration.png)

点击切换开关，你会得到一个配置 `bitbucket-pipelines.yml` 文件的选项。这个文件将会告诉 Bitbucket 在代码推送到仓库后需要执行哪些命令。点击 “Configure bitbucket-pipeline.yml” 按钮会指引你转到 **Pipeline** 菜单:

![pipeline-menu](pipeline-menu.png)

这里你可以选择多种语言模板。我们这里最感兴趣的就是 JavaScript 的。我们可以使用它作为基础然后依据我们自己的喜好进行修改。

## 修改配置文件

修改模板以及添加一些另外的步骤，我们得到如下文件:

```
image: node:10.15.3

pipelines:

    default:

        - step:

            name: Deploy

            caches:

                - node

            script:

                - npm install

                - npm run build

                - npm run test

                - npm run deploy
```

我们将每一行进行拆分，看看都做了哪些事情:

- 我们在配置文件里面使用 `node: 10.15.3` 作为 docker 镜像。这里你可以自定义 docker 镜像。

- 下一步，我们为 `default` 部分定义了一个步骤，这部分包括所有定义的代码分支，也就是说如果我们触发了推送动作，它将自动触发流水线。

- 我们可以使用 `step` 关键词定义步骤。这里我们为其指定一个“*Deploy*” 名称，并告诉它在 `caches` 关键字内部缓存节点。

- 最后，在 `scripts` 关键词内，将会指定一些我们想要执行的命令。首先安装依赖、构建项目、运行测试、最后部署到我们的站点。

为了确保有效，将配置文件放到你的项目的根目录上提交到仓库里面。

## 配置部署脚本

最终的步骤里，我们调用 `npm run deploy`，它是在我们的 `package.json` 中定义的，使用下面命令运行一个 JavaScript 文件: `node tools/deploy.js` 这个文件。这个文件将会处理我们组件的部署工作:

```
const FtpDeploy = require('ftp-deploy');

const ftpDeploy = new FtpDeploy();

const config = {

	user: process.env.FTP_USERNAME,

	password: process.env.FTP_PASSWORD,

	host: process.env.FTP_HOST,

	localRoot: __dirname + '/../dist/',

	remoteRoot: process.env.FTP_REMOTE_PATH,

	include: ['*']

};

ftpDeploy.deploy(config, (error) => {

	if (error) {

		console.log(error);

	} else {

		console.log('deployed successfully');

	}

});
```

正如你所看到的，我使用了一个名为 [ftp-deploy](https://www.npmjs.com/package/ftp-deploy) 的包，你可以使用 `npm i ftp-deploy` 安装它。我们在 line:1 导入它，在 line:4 为其创建一个配置对象。

配置对象里面包括创建一个 FTP 连接所需要的所有字段。为了避免在代码中存储凭据，我们从环境变量中传递这些值。这些变量从 Bitbucket 中获取。你可以在 `PIPELINE` 的 **Repository variables** 处定义它们。

![repository-variables](repository-variables.png)

设置部署脚本使用的环境变量名以及它们的值。选中 **Secured** 将会永久隐藏这些值。

回到配置部分，`localRoot` 的值用来告诉 `ftpDeploy` 需要拷贝哪一个目录。使用 `__dirname` 参数指向的是部署脚本的目录。我的项目配置如下所示: 

![project-configuration](project-configuration.png)

这里印证了我为什么在例子中返回上一级目录使用的是 `/../`。

另一方面，`remoteRoot` 指向了 FTP 服务器的一个目录。最后，使用 `include` 我们可以定义哪些文件需要拷贝。使用星号说明我们将复制 dist 目录下的所有文件。

然后我们在 `ftpDeploy` 调用 `deploy` 然后传给我们的配置对象和一个回调函数。本例这里有一个错误，我们将其日志打印出来了。除此之外，这个部署是成功的。

## 总结

我们可以在 **Pipeline** 菜单下监控部署情况。你会注意到开始的一个新的构建名称是我们在 `bitbucket-pipelines.yml` 文件中事先定义好的。

将变更推送到远程仓库自动触发部署操作，如果你的部署文件正确配置了--*当然你运行的测试也通过了*--流水线会显示绿色然后本地推送的变更几秒内就会应用到产品中。✅

![deploy](deploy.png)
