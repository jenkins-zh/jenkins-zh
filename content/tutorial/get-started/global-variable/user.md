---
type: tutorial
title: 全局变量中获取用户信息
author: linuxsuren
---

Jenkins 的流水线可以是自动触发，也可以有某个用户手动触发。如果我们希望能够或者触发某条流水线的用户信息时，可以参考下面给出的例子：

```
pipeline {
    agent any

    stages {
        stage('clone') {
            steps {
                script {
                    echo currentBuild.getBuildCauses().toString()
                }
            }
        }
    }
}
```

参考的输出内容如下：
```
[{"_class":"hudson.model.Cause$UserIdCause","shortDescription":"Started by user escape-hatch-admin","userId":"escape-hatch-admin","userName":"escape-hatch-admin"}]
```

如果只想通过上面给的例子拿到用户信息的话，读者只需要遍历上面的数组，找到 `_class` 为 `hudson.model.Cause$UserIdCause` 的元素，就能拿到用户名和用户ID了。

## 原理

Jenkins 流水线（包括其他类型的任务）在触发时，会将被触发的原因记录到 `Cause` 中，而且，这个 `Cause` 可能会有多个。如果我们想要记录更多个性化的触发原因的话，可以使用 Jenkins 提供的扩展点。
