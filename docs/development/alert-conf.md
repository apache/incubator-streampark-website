---
id: 'alert-conf'
title: 'Alert configuration'
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`StreamPark` supports a variety of alerts, mainly as follows：

* **E-mail**: Mail notification
* **DingTalk**: DingTalk Custom Group Robot
* **WeChat**: Enterprise WeChat Custom Group Robot
* **Lark**: Feishu Custom Group Robot

StreamPark support any combination of alerts

:::info Future plan

1. `SMS notification` and `webhook callback` notification will be supported in the future
   1Test exception will be fed back to the front-end page
   :::

## Added alert configuration

`Click StreamPark` -> Setting on the left, then click `Alert Setting` to enter the alert configuration.
![alert_add_setting.png](/doc/image/alert/alert_add_setting.png)

Click `Add New` to add alert configuration:

1.Name alert will be added
2.Choose `AlertType`, then configure the corresponding configuration item.

![alert_add_example.png](/doc/image/alert/alert_add_example.png)

The configuration content of different alert types is as follows:

### E-mail

Firstly, choose `E-mail` as the alert type.
Then, enter `Alert Email` and click `Submit`.
![alert_add_dingtalk.png](/doc/image/alert/alert_add_email.png)

**Configuration instructions：**

1. `Alert Email`：<font color='red'>`Required`</font>, The email address of the email notification. Multiple email
   addresses need to separate by commas ’ ,’.

:::info
To use the email alarm notification method,please configure system mail sending
information: `Setting -> System Setting -> Sender Email Setting`
![alert_conf_mail_sender.png](/doc/image/alert/alert_conf_mail_sender.png)
Above is configured using 163 mailboxes.Please fill in the specific email address according to your actual situation.
:::

### DingTalk

Firstly, choose `DingTalk` as the alert type.

Then, Enter robot `DingTalk Tokens` and other configurations, click `Submit`.
![alert_add_ding_talk.png](/doc/image/alert/alert_add_ding_talk.png)

**Configuration description：**

1. `DingTalk Url`：`optional` .It is used to expose to a unified forwarding address within the company. By
   default, `https://oapi.dingtalk.com/robot/send?access_token=` is used, and then the `Token` and the
   corresponding `Secret` are assembled for verification and sent.
2. `DingTalk Token`：<font color='red'>`Required`</font>.It is the default address of the group robot, and intercepts the
   content after `access_token=.`
3. `DingTalk User`：`optional` .Use the `mobile phone number` to remind the corresponding users in the group. Multiple
   mobile phone numbers should be separated by commas ’ ,’ .
4. `At All User`：`optional` .After it is turned on, the alarm message will be @ everyone in the group.
5. `Secret Enable`：`optional` .If `encryption signature verification` is enabled, the `Secret Token` signature
   verification key information needs to be configured.


:::info DingTalk robot application
Please refer to [DingTalk official documentation](https://open.dingtalk.com/document/group/custom-robot-access) for robot application and configuration

:::

### Wechat

Firstly, choose `Wechat` as the alert type.

Then, Enter robot `WeChat token`, click `Submit`.
![alert_add_wecom.png](/doc/image/alert/alert_add_wecom.png)
**Configuration description：**

1. `WeChat token`：<font color='red'>`required`</font>.It is the default address of the group robot, and intercepts the content after `key=`

:::info Wechat robot application
Please refer to the [WeChat official] (https://developer.work.weixin.qq.com/document/path/91770) for robot application and configuration

:::

### Lark

Firstly, choose `Lark` as the alert type.

Then, Enter robot `Lark Tokens` and other configurations, click `Submit`.
![alert_add_lark.png](/doc/image/alert/alert_add_lark.png)

**Configuration description：**

1. `Lark Token`：<font color='red'>`Required`</font>.1. It is the default address of the group robot, intercept the content behind `/hook/`.
2. `At All User`：`optional` .2.After it is turned on, the alarm message will be @ everyone in the group.
3. `Secret Enable`：`optional` .3.If `encryption signature verification` is enabled, the `Secret Token` signature verification key information needs to be configured.

:::info Lark robot application
Please refer to the [official Lark official](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/bot-v3/bot-overview ) for robot application and configuration

:::

## Alert Test

To ensure that the alert configuration information takes effect, we encourage to perform a message notification test——click the `bell button` on the right side of the corresponding configuration information
![alert_send_test.png](/doc/image/alert/alert_send_test.png)

If the test is sent successfully, the return is as follows:
![alert_send_test_success.png](/doc/image/alert/alert_send_test_success.png)

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

## Modify alert configuration:

Click the `edit button` to the right of the corresponding alarm configuration information to modify the corresponding configuration information. click `Submit` to save.
![alert_edit.png](/doc/image/alert/alert_edit.png)

## Use alert configuration

When the `application` task is created and modified, configured alert could be selected in the `Fault Alert Template`.

![alert_application_example.png](/doc/image/alert/alert_application_example.png)

## Delete alert configuration:

Click the `trash can button` on the right side of the corresponding alarm configuration information to delete the corresponding configuration information。
![alert_conf_delete.png](/doc/image/alert/alert_conf_delete.png)

This information will be shown after the deletion is successful:
![alert_delete_success.png](/doc/image/alert/alert_delete_success.png)

:::danger warn
The alert configuration plans to delete  should be ensured that not used in any application configuration
:::



