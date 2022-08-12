---
id: 'rainbond-deployment'
title: 'Rainbond Quick Deployment'
sidebar_position: 5
---

Current document description How do I install StreamX using [Rainbond](https://www.rainbond.com/docs/) cloud native application management platform, This approach is suitable for users who are not familiar with complex technologies such as Kubernetes and containerization, Lowered the threshold to deploy StreamX in Kubernetes.

## Prepare

* Deployment Rainbond cloud native application management platform, Ref: [Rainbond Quick Install](https://www.rainbond.com/docs/quick-start/quick-install)

## 1. StreamX Deployment

1. Select the **Application Market** tab on the left, Switch to the **Open Source App Store** TAB on the page, Search for the keyword **StreamX** to find StreamX apps.

![](https://static.goodrain.com/wechat/streamx/1.png)



2. Click **Install** on the right of StreamX to go to the installation page, After filling in the basic information, Click **OK** to start the installation, The page automatically jumps to the topology view.

![](https://static.goodrain.com/wechat/streamx/2.png)

Parameter Description:

| Options   | Description                                                 |
| -------- | ------------------------------------------------------------ |
| Team Name | User workspace, Isolate by namespace                           |
| Cluster Name | Choose which Kubernetes cluster StreamX is deployed to                         |
| Select Application | Choose which application StreamX is deployed to |
| Application Version | Select the version of StreamX, Currently available version is 1.2.4                    |



## 2. Apache Flink Deployment

1. Select the **Application Market** tab on the left, Switch to the **Open Source App Store** TAB on the page, Search for the keyword **Flink** to find Flink apps.
2. Click **Install** on the right of Flink to go to the installation page, After filling in the basic information, Click **OK** to start the installation, The page automatically jumps to the topology view.

![](https://static.goodrain.com/wechat/streamx/3.png)



## 3. Access StreamX and Flink

After the service starts, StreamX can be accessed by clicking the Access button, Also have access to Flink. The default user and password for StreamX are `admin` and `streamx`

![](https://static.goodrain.com/wechat/streamx/4.png)

## 4. Set Flink Home On StreamX Web Ui

Setting -> Link Home -> Add New

```
/streamx/flink/
```

## 5. Start Remote Session Cluster

Start by connecting StreamX to JobManager on the Rainbond topology page, Enter choreography mode -> Drag and drop to add dependencies.

![](https://static.goodrain.com/wechat/streamx/5.png)

StreamX web ui click Setting -> Flink Cluster -> Add New Create a `remote (standalone)` mode cluster.

Address fill in:

```
http://127.0.0.1:8081
```

## More Features

### 1. Continuous Development StreamX

If you modify the source code, you need to update StreamX, StreamX Components -> build source, change the build source to `source code` 或 `image` 

![](https://static.goodrain.com/wechat/streamx/6.png)



### TaskManager Scaling Instance

TaskManager Component -> scaling, Set TaskManager instance number to 3 or more.

