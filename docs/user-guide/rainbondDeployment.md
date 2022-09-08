---
id: 'rainbond-deployment'
title: 'Rainbond Quick Deployment'
sidebar_position: 5
---

Current document description How do I install StreamPark using [Rainbond](https://www.rainbond.com/docs/) cloud native application management platform, This approach is suitable for users who are not familiar with complex technologies such as Kubernetes and containerization, Lowered the threshold to deploy StreamPark in Kubernetes.

## Prepare

* Deployment Rainbond cloud native application management platform, Ref: [Rainbond Quick Install](https://www.rainbond.com/docs/quick-start/quick-install)

## 1. StreamPark Deployment

1. Select the **Application Market** tab on the left, Switch to the **Open Source App Store** TAB on the page, Search for the keyword **StreamPark** to find StreamPark apps.

![](https://static.goodrain.com/wechat/streamx/1.png)



2. Click **Install** on the right of StreamPark to go to the installation page, After filling in the basic information, Click **OK** to start the installation, The page automatically jumps to the topology view.

![](https://static.goodrain.com/wechat/streamx/2.png)

Parameter Description:

| Options   | Description                                                 |
| -------- | ------------------------------------------------------------ |
| Team Name | User workspace, Isolate by namespace                           |
| Cluster Name | Choose which Kubernetes cluster StreamPark is deployed to                         |
| Select Application | Choose which application StreamPark is deployed to |
| Application Version | Select the version of StreamPark, Currently available version is 1.2.4                    |



## 2. Apache Flink Deployment

1. Select the **Application Market** tab on the left, Switch to the **Open Source App Store** TAB on the page, Search for the keyword **Flink** to find Flink apps.
2. Click **Install** on the right of Flink to go to the installation page, After filling in the basic information, Click **OK** to start the installation, The page automatically jumps to the topology view.

![](https://static.goodrain.com/wechat/streamx/3.png)



## 3. Access StreamPark and Flink

After the service starts, StreamPark can be accessed by clicking the Access button, Also have access to Flink. The default user and password for StreamPark are `admin` and `streamx`

![](https://static.goodrain.com/wechat/streamx/4.png)

## 4. Set Flink Home On StreamPark Web Ui

Setting -> Link Home -> Add New

```
/streamx/flink/
```

## 5. Start Remote Session Cluster

Start by connecting StreamPark to JobManager on the Rainbond topology page, Enter choreography mode -> Drag and drop to add dependencies.

![](https://static.goodrain.com/wechat/streamx/5.png)

StreamPark web ui click Setting -> Flink Cluster -> Add New Create a `remote (standalone)` mode cluster.

Address fill in:

```
http://127.0.0.1:8081
```

## More Features

### 1. Continuous Development StreamPark

If you modify the source code, you need to update StreamPark, StreamPark Components -> build source, change the build source to `source code` 或 `image`

![](https://static.goodrain.com/wechat/streamx/6.png)



### TaskManager Scaling Instance

TaskManager Component -> scaling, Set TaskManager instance number to 3 or more.

