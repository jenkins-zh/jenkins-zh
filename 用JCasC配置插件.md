# 用JCasC配置插件

[Dheeraj Singh Jodha](https://www.jenkins.io/blog/authors/dheerajodha/)发表于2021-05-20     [Tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.jenkins.io%2F)

[jcasc](https://www.jenkins.io/node/tags/jcasc/)  [tutorial](https://www.jenkins.io/node/tags/tutorial/) [plugins](https://www.jenkins.io/node/tags/plugins/)  [yaml](https://www.jenkins.io/node/tags/yaml/])

这个博客是写给任何对用Jenkins的JCasC配置插件感兴趣的人，具体会讲解如何获得YAML格式的配置信息和如何在不通过Jenkins的UI界面的情况下更改插件的信息。

---

如果你是JCasC的新手并且想了解关于JCasC更多的内容，你可以先去看下列链接中的内容，来更好的理解JCasC。

-[JCasC Documentation](https://plugins.jenkins.io/configuration-as-code/)

-[Overview of JCasC (Video Presentation)](https://www.youtube.com/watch?v=wTzljM-EDjI)

-[Manage JCasC (DevOps World 2018)](https://www.youtube.com/watch?v=47D3H1BZi4o)

---

用JCasC配置你的第一个插件（视频Demo）

<iframe width="560" height="315" src="https://www.youtube.com/embed/YeWhqLPjvMs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## 概要

下面是大致的步骤：

1. [简要介绍jenkins.yaml文件](#简要介绍jenkins.yaml文件)

2. [在Jenkins的UI界面上配置插件](#在Jenkins的UI界面上配置插件)

3. [下载配置文件](#下载配置文件)

4. [本地更新JCasC文件](#本地更新JCasC文件)

5. [在Jenkins服务器上加载jenkins.yaml文件](#在Jenkins服务器上加载jenkins.yaml文件)

6. [在UI界面上验证](#在Jenkins服务器上加载jenkins.yaml文件)

---

<h2 id="简要介绍jenkins.yaml文件">简要介绍jenkins.yaml文件</h2>

* `jenkins.yaml`文件里有Jenkins实例的配置信息。JCasC插件用.yaml文件来配置Jenkins实例。
* `jenkins.yaml`文件的默认位置是在`$JENKINS_HOME/jenkins.yaml`，Jenkins服务器在你应用新的配置后会自动从这个位置读取配置文件。
* 按照以下步骤：`Manage Jenkins > Configuration as Code > Download Configuration`，下载你的`jenkins.yaml`文件。
* 要确保`jenkins.yaml`是在`$JENKINS_HOME/jenkins.yaml`这个路径里。
* 更改`systemMessage`的值为如下：

![更新jenkins.yaml文件](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/updating-the-jenkins-file.png)

图1. 更新jenkins.yaml文件

* 重新加载现有的配置，让systemMessage生效。

* 现在，在Dashboard页面的顶端，你可以看到更新过后的System Message

![看Dashboard上的变化](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/viewing-changes-in-jenkins-file.png)

图2. 看Dashboard上的变化

* 之后我们会用这个文件通过JCasC来配置插件。

---

<h2 id="[在Jenkins的UI界面上配置插件](#在Jenkins的UI界面上配置插件)">
    在Jenkins的UI界面上配置插件
</h2>

* 为了完成这个例子，需要安装`View Job Filters`插件。
* 现在可以通过Dashboard页面上左侧的`New View`按钮创建一个view。
* 给一个名字（例如：“testView”），把类型设置为`List View`，然后按`OK`按钮。

![创建View](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/naming-the-view.png)

图3. 创建View

* 点击`Add Job Filter`添加过滤器（filter），让我们选择`Build Duration Filter`，然后填写值（例如：“60”分钟）

![在view中添加过滤器](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/add-filters-to-view.png)

图4. 在view中添加过滤器

* 点击`Apply > Save`
* 在你的主要的`jenkins.yaml`配置文件中能看到所有的配置信息。点击`Manage Jenkins > Configuration as Code > View Configuration`可以查看`jenkins.yaml`文件。
* 在YAML文件中找到`views`部分，可以看到关于view的详细信息，

![在这里可以看到关于view（我们刚创建的）的详细信息](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/yaml-file-on-jenkins-ui.png)

图5. 在这里可以看到关于view（我们刚创建的）的详细信息

---

<h2 id="下载配置文件">下载配置文件</h2>

* 现在你已经成功通过UI界面配置好插件了，让我们来到Dashboard页面上的`Manage Jenkins`，点击`System Configuration`下的`Configuration as Code`，就可以下载配置文件。

* 现在点击`Download Configuration`将配置下载到本地。

![下载配置](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/download-config-button.png)

图6. 下载配置

---

<h2 id="本地更新JCasC文件">
    本地更新JCasC文件
</h2>

* 在下载下来的`jenkins.yaml`文件里进行一些修改，并看看UI界面上自动产生的变化。

* 作为一个例子，让我们将配置文件里的`name`的对应值改成“YoutubeDemoView”并且将`buildDurationMinutes`值设为55。

![在本地修改关于View的信息](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/yaml-file-on-local-text-editor.png)

图7. 在本地修改关于View的信息

* 保存文件

---

<h2 id="在Jenkins服务器上加载jenkins.yaml文件">在Jenkins服务器上加载jenkins.yaml文件</h2>

* 现在为了能让`jenkins.yaml`文件里的改变应用到Jenkins服务器上，点击`Reload existing configuration`按钮。

![将新的配置应用到Jenkins实例中](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/apply-new-config.png)

图8. 将新的配置应用到Jenkins实例中

---

<h2 id="在UI界面上验证">在UI界面上验证</h2>

* 通过点击左上方的Jenkins图标回到主页面。

* 你会注意到你的view的名字从“testView”变成了“YoutubeDemoView”。

* 并且`Build Duration Filter`的值从“60”变成了“55”。

* 这两个变化就是我们刚刚在本地修改`jenkins.yaml`文件中的内容

![验证变化](https://www.jenkins.io/images/post-images/2021-05-15-configure-plugins-with-jcasc/view-final-changes.png)

图9. 验证变化

恭喜你! :smile:你已经成功在“Jenkins Configuration as Code” 插件的帮助下自动配置了插件！你现在可以重复刚刚的步骤来配置更多的插件。

---

## 关于作者

![作者照片](https://www.jenkins.io/images/avatars/dheerajodha.jpg)

[Dheeraj Singh Jodha](https://www.jenkins.io/blog/authors/dheerajodha)

Dheeraj是孟买大学的维韦卡南德技术研究所的一名计算机工程的学生。他从2021年的3月开始了他在Jenkins社区的贡献之旅。他的微小贡献大部分是关于[Jenkins项目的自定义发布服务](https://github.com/jenkinsci/custom-distribution-service)。他也喜欢参与JCasC项目和写一些文档来帮助其他开发人员。

[GitHub](https://github.com/dheerajodha)    [LinkedIn](https://www.linkedin.com/in/dheeraj-singh-jodha)

