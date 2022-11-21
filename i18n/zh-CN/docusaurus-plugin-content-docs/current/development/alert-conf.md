---
id: 'alert-conf'
title: '报警配置'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

目前 `StreamPark` 中支持配置多种报警方式，主要有以下几种：

*   **E-mail**：邮件通知
*   **DingTalk**：钉钉自定义群机器人
*   **Wechat**：企业微信自定义群机器人
*   **Lark**：飞书自定义群机器人

并且，可以任意组合多种报警形式，进行消息通知发送。

:::info 未来规划
1. `SMS 短信通知` 和 `webhook 回调通知` 将会在后续支持
2. 将测试报警异常信息反馈给前端页面
:::

## 新增报警配置
点击左侧 `StreamPark -> Setting`，然后选择`Alert Setting` 进入报警信息配置。
![alert_add_setting.png](/doc/image/alert/alert_add_setting.png)

点击 `Add New` 进行报警新增配置：

1.   为需要增加的报警配置，添加一个容易区别的报警名称；
2.   选择相对应的 `AlertType`，则要配置相对应的配置项。

![alert_add_example.png](/doc/image/alert/alert_add_example.png)

具体每种不同的报警类型所需要的配置内容如下：

### E-mail(邮件)

首先，选择报警类型为 `E-mail`；

之后，输入`Alert Email`，而后点击 `Submit` 保存。
![alert_add_dingtalk.png](/doc/image/alert/alert_add_email.png)

**配置项说明：**

1.   `Alert Email`：<font color='red'>`必填项`</font>。邮件通知的邮箱地址，多个邮箱地址用英文半角逗号 `,` 分隔开。


:::info 注意
使用邮件报警通知方式，必须先在 `Setting -> System Setting -> Sender Email Setting` 中配置系统邮件发送信息。
![alert_conf_mail_sender.png](/doc/image/alert/alert_conf_mail_sender.png)
以上使用 `163` 邮箱进行测试，具体使用那种邮箱，请依据个人实际情况进行配置。
:::


### DingTalk(钉钉)
首先，选择报警类型为 `Ding Talk`。

之后，输入机器人 `DingTalk Token`  和其余配置项，而后点击 `Submit` 保存。
![alert_add_ding_talk.png](/doc/image/alert/alert_add_ding_talk.png)

**配置项说明：**

1.   `DingTalk Url`：`选填项` 。是用来暴露给，公司内部有统一的转发地址使用。默认使用 `https://oapi.dingtalk.com/robot/send?access_token=` ，然后拼装 `Token` 和相应的 `Secret` 验签进行发送。
2.   `DingTalk Token`：<font color='red'>`必填项`</font>。为群机器人默认地址，截取 `access_token=` 后面内容。
3.   `DingTalk User`：`选填项` 。使用 `手机号` 进行群内相应用户提醒，多个手机号使用英文半角逗号 `,` 分隔开。
4.   `At All User`：选填项 。开启后，报警消息会@群内所有人。
5.   `Secret Enable`：选填项 。如果开启机器人请求 `加密验签`，则需要配置，并且需要配置 `Secret Token` 验签密钥信息。

:::info 钉钉群机器人申请
请参考 `钉钉官方文档` https://open.dingtalk.com/document/group/custom-robot-access 进行机器人申请和配置

:::

### Wechat(企微)
首先，选择报警类型为 `Wechat`。

之后，输入机器人 `WeChat token`，而后点击 `Submit` 保存。
![alert_add_wecom.png](/doc/image/alert/alert_add_wecom.png)
**配置项说明：**

1.   `WeChat token`：<font color='red'>`必填项`</font>。为群机器人默认地址，截取 `key=` 后面内容。

:::info 企微群机器人申请
请参考 `企业微信官方文档` https://developer.work.weixin.qq.com/document/path/91770 进行机器人申请和配置

:::

### Lark(飞书)
首先，选择报警类型为 `Lark`。

之后，输入机器人 `Lark Token`  和其余配置项，而后点击 `Submit` 保存。
![alert_add_lark.png](/doc/image/alert/alert_add_lark.png)

**配置项说明：**

1.   `Lark Token`：<font color='red'>`必填项`</font>。为群机器人默认地址，截取 `/hook/` 后面内容。
2.   `At All User`：选填项 。开启后，报警消息会@群内所有人。
3.   `Secret Enable`：选填项 。如果开启机器人请求 `加密验签`，则需要配置，并且需要配置 `Lark Secret Token` 验签密钥信息。

:::info 飞书群机器人申请
请参考 `飞书官方文档` https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/bot-v3/bot-overview 进行机器人申请和配置

:::

## 测试报警配置
为保证配置的报警配置信息生效，需要对其进行消息通知测试，即点击相对应的配置信息的右侧 `铃铛` 图标，即为报警测试。
![alert_send_test.png](/doc/image/alert/alert_send_test.png)

测试发送成功后返回如下：
![alert_send_test_success.png](/doc/image/alert/alert_send_test_success.png)

测试报警通知内容如下:
<Tabs>
<TabItem value="E-mail" label="E-mail" default>

![alert_test_email.png](/doc/image/alert/alert_test_email.png)
</TabItem>

<TabItem value="Ding Talk" label="Ding Talk">

![alert_test_ding_talk.png](/doc/image/alert/alert_test_ding_talk.png)
</TabItem>

<TabItem value="Wechat" label="Wechat">

![alert_test_wechat.png](/doc/image/alert/alert_test_wechat.png)
</TabItem>

<TabItem value="Lark" label="Lark">

![alert_test_lark.png](/doc/image/alert/alert_test_lark.png)
</TabItem>
</Tabs>

## 修改报警配置
点击相应报警配置信息的右侧 `编辑` 图标，即为修改相对应的配置信息。同样修改后，点击 `Submit` 进行保存。
![alert_edit.png](/doc/image/alert/alert_edit.png)

## 使用报警配置
在 `application` 任务创建和修改时，`Fault Alert Template` 直接选择配置好的报警信息即可。

![alert_application_example.png](/doc/image/alert/alert_application_example.png)

## 删除报警配置
点击相应报警配置信息的右侧 `垃圾桶` 图标，即为删除相对应的配置信息。
![alert_conf_delete.png](/doc/image/alert/alert_conf_delete.png)

删除成功后，显示信息：
![alert_delete_success.png](/doc/image/alert/alert_delete_success.png)

:::danger 注意
删除报警信息配置项，需要确保没有 `application` 已经配置绑定了该报警配置项。
:::



