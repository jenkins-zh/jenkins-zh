该目录下，保存 Jenkins 社区相关的活动内容。文件格式为 Markdown，包含的头信息（字段）包括如下：

* type 活动类型，目前只支持 `meetup`（必需）
* city 活动举办地（必需）
* hostDate 活动时间（必需）
* year 活动所属年份，用于按年度分开展示（必需）
* poster 活动海报（必需）
* topic 活动主题
* speakers 分享人，数组格式
* sponsors 赞助商（公司、社区等），数组格式
* abstract 活动简介
* agenda 活动日程
    * time 时间
    * item 事项
* status 活动状态

# 发起活动

希望发起活动的人或者组织，请按照如上格式写入一个 Markdown 文件中，并打开一个 Pull Request 到该仓库，等待审核。

# 分享人

对某个活动感兴趣的同学，请在目录 `content/speaker` 下以 JSON 格式增加自己的个人信息，文件名为 GitHub 账户 ID。然后在您感兴趣的活动中的 `speakers` 下添加您的 ID。

# 赞助

如果您所在的企业、出版社、社区等对某个活动感兴趣，打算给 Jenkins 开源社区活动一定的赞助，请参考“分享人”的流程添加自己的信息。