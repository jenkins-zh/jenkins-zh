---
title: 禅道集成调研[扩展]
weight: 70
---


{{% notice tip %}}
您好，本章我们主要讲述Jenkins+jmeter自动化接口测试。
{{% /notice %}}






### 总体目标
在禅道中，看板上的任务完成或者切换到某个指定的状态，触发Jenkins构建。


### Jenkins配置
#### 设置项目参数化构建

![images](./images/z.png)

![images](./images/z1.png)



### 禅道系统配置
#### 禅道系统版本
![images](./images/z2.png)

#### 添加webhook
![images](./images/z3.png)

#### 配置webhook
![images](./images/z4.png)


### 测试集成

#### 更改任务状态
![images](./images/z5.png)


#### Jenkins日志
![images](./images/z6.png)



### 总结
- 在具体的实践中可以通过上图jenkins获取的参数进行逻辑判断，限制指定的状态构建。