---
id: 'alert-conf-en'
title: 'alarm configuration'
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

at present `StreamX` Supports configuring a variety of alarm methods, mainly including the following:

*   **E-mail**:E-mail notification
*   **DingTalk**:DingTalk custom group robot
*   **Wechat**:Wechat custom group robot
*   **Lark**:Lark custom group robot

there，A variety of alarm forms can be combined arbitrarily, and message notification can be sent.

:::info FUTURE PLAN
1. `SMS notification` and `webhook callback notification` will be supported in the future
2. Feedback test alarm exception information to the front-end page
:::

New alarm configuration Click `StreamX -> Setting` on the left, and then select `Alert Setting` to enter the alarm information configuration.
![alert_add_setting.png](/doc/image/alert/alert_add_setting.png)

Click `Add New` to add alarm configuration: 1. For the alarm configuration to be added, add an easily distinguishable alarm name; 2. Select the corresponding `AlertType`, then configure the corresponding configuration item.

![alert_add_example.png](/doc/image/alert/alert_add_example.png)

The configuration content required for each different alarm type is as follows:

### E-mail

First, select the alarm type as `E-mail`;
After that, enter `Alert Email` and click `Submit` to save.
![alert_add_dingtalk.png](/doc/image/alert/alert_add_email.png)

Configuration items :
1.   `Alert Email`:<font color='red'>`Required`</font>.Email address for email notification, multiple email addresses are separated by commas `,`.


:::info warn
To use the email alert notification method, you must first configure the system email sending information in `Setting -> System Setting -> Sender Email Setting`.
![alert_conf_mail_sender.png](/doc/image/alert/alert_conf_mail_sender.png)
The above uses the `163` mailbox for testing, which kind of mailbox to use, please configure it according to your actual situation.
:::


### DingTalk
Select the alarm type as `Ding Talk`.

Enter the robot `DingTalk Token` and other configuration items, then click `Submit` to save.
![alert_add_ding_talk.png](/doc/image/alert/alert_add_ding_talk.png)

**Configuration item:**

1.   `DingTalk Url`:`OPTIONAL` .It is used to expose to, and there is a unified forwarding address used within the company. Default use `https://oapi.dingtalk.com/robot/send?access_token=` ，Then assemble the `Token` and the corresponding `Secret` to verify the signature and send it.
2.   `DingTalk Token`:<font color='red'>`REQUIRED`</font>.The default address of the group robot, intercept the content after `access_token=`.
3.   `DingTalk User`:`OPTIONAL` .Use `mobile phone number` to remind the corresponding users in the group, multiple mobile phone numbers are separated by English half-width commas `,`.
4.   `At All User`:`OPTIONAL` .After opening, the alarm message will be @all in the group.
5.   `Secret Enable`:`OPTIONAL` .If you enable the robot to request `encrypted signature verification`, you need to configure it, and you need to configure the `Secret Token` signature verification key information.

:::info Dingding group robot create
Please refer to `钉钉官方文档` https://open.dingtalk.com/document/group/custom-robot-access Perform robot application and configuration

:::

### Wechat(企微)
First, select the alarm type as `Wechat`.

Second, enter the bot `WeChat token` and click `Submit` to save.
![alert_add_wecom.png](/doc/image/alert/alert_add_wecom.png)
**Configuration item :**

1.   `WeChat token`:<font color='red'>`REQUIRED`</font>.It is the default address of the group robot, intercept the content after `key=`.

:::info WeChat group robot create
Please refer to `WeChat Official Document` https://developer.work.weixin.qq.com/document/path/91770 Perform robot application and configuration

:::

### Lark
First, select the alarm type as `Lark`.

Second, enter the robot `Lark Token` and other configuration items, then click `Submit` to save.
![alert_add_lark.png](/doc/image/alert/alert_add_lark.png)

**Configuration item :**

1.   `Lark Token`:<font color='red'>`REQUIRED`</font>.The default address of the group robot, intercept the content after `hook`.
2.   `At All User`:`OPTIONAL`  .After opening, the alarm message will be @all  in the group.
3.   `Secret Enable`:`OPTIONAL`  .If you enable the robot to request `encrypted signature verification`, you need to configure it, and you need to configure the `Lark Secret Token` signature verification key information.

:::info Feishu Group Robot Create
Please refer to `Lark Official Documents` https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/bot-v3/bot-overviewPerform robot application and configuration

:::

## Test Alarm Configuration
In order to ensure that the configured alarm configuration information takes effect, it is necessary to perform a message notification test, that is, click the `bell` icon on the right side of the corresponding configuration information, which is the alarm test.
![alert_send_test.png](/doc/image/alert/alert_send_test.png)

测试发送成功后返回如下:
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
点击相应报警配置信息的右侧 `编辑` 图标，即为修改相对应的配置信息.同样修改后，点击 `Submit` 进行保存.
![alert_edit.png](/doc/image/alert/alert_edit.png)

## Use alarm configuration
When the `application` task is created and modified, the `Fault Alert Template` can directly select the configured alarm information.

![alert_application_example.png](/doc/image/alert/alert_application_example.png)

## Delete alarm configuration
Click the `trash can` icon on the right side of the corresponding alarm configuration information to delete the corresponding configuration information.
![alert_conf_delete.png](/doc/image/alert/alert_conf_delete.png)

After the deletion is successful, the information is displayed:
![alert_delete_success.png](/doc/image/alert/alert_delete_success.png)

:::danger warn
To delete the alarm information configuration item, you need to ensure that no `application` has been configured and bound to the alarm configuration item.
:::



