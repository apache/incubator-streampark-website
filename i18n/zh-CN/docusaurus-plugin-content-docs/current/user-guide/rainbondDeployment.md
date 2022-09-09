---
id: 'rainbond-deployment'
title: '基于 Rainbond 快速部署 StreamPark'
sidebar_position: 5
---

当前文档描述如何通过云原生应用管理平台 [Rainbond](https://www.rainbond.com/docs/) 一键安装 StreamPark，这种方式适合给不太了解 Kubernetes、容器化等复杂技术的用户使用，降低了在 Kubernetes 中部署 StreamPark 的门槛。

## 前提

* 部署好的 Rainbond 云原生应用管理平台：例如 [快速体验版本](https://www.rainbond.com/docs/quick-start/quick-install/?channel=apollo)

## 1. StreamPark 部署

1. 选择左侧的 **应用市场** 标签页，在页面中切换到 **开源应用商店** 标签页，搜索关键词 **StreamPark** 即可找到 StreamPark 应用。

![](https://static.goodrain.com/wechat/streamx/1.png)



2. 点击 StreamPark 右侧的 **安装** 可以进入安装页面，填写简单的信息之后，点击 **确定** 即可开始安装，页面自动跳转到拓扑视图。

![](https://static.goodrain.com/wechat/streamx/2.png)

参数说明：

| 选择项   | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| 团队名称 | 用户自建的工作空间，以命名空间隔离                           |
| 集群名称 | 选择 StreamPark 被部署到哪一个 K8s 集群                         |
| 选择应用 | 选择 StreamPark 被部署到哪一个应用，应用中包含有若干有关联的组件 |
| 应用版本 | 选择 StreamPark 的版本，目前可选版本为 1.2.4                    |



## 2. Apache Flink 部署

1. 选择左侧的 **应用市场** 标签页，在页面中切换到 **开源应用商店** 标签页，搜索关键词 **Flink** 即可找到 Flink 应用。
2. 点击 Flink 右侧的 **安装** 可以进入安装页面，填写简单的信息之后，点击 **确定** 即可开始安装，页面自动跳转到拓扑视图。

![](https://static.goodrain.com/wechat/streamx/3.png)



## 3. 访问 StreamPark 和 Flink

服务启动后，可以点击 "访问" 按钮访问 StreamPark，同时也可以访问Flink。StreamPark 默认的用户和密码分别为 `admin` 和 `streamx`

![](https://static.goodrain.com/wechat/streamx/4.png)

## 4. 在 StreamPark Web Ui 上设置 Flink Home

Setting -> Link Home -> Add New

```
/streamx/flink/
```

## 5. 启动远程会话集群

首先在 Rainbond 拓扑图页面将 StreamPark 连接到 JobManager，进入编排模式 -> 拖拉拽添加依赖

![](https://static.goodrain.com/wechat/streamx/5.png)

进入StreamX web ui 点击 Setting -> Flink Cluster -> Add New 创建一个 `remote (standalone)` 模式的集群。

Address 填写：

```
http://127.0.0.1:8081
```

## 更多特性

### 1. 持续开发 StreamPark

如修改了源码需要更新 StreamPark，可在 StreamPark 组件 -> 构建源，更改构建源为 `源码` 或 `镜像`

![](https://static.goodrain.com/wechat/streamx/6.png)



### 扩展 TaskManager 实例

进入 TaskManager 组件 -> 伸缩，扩展 TaskManager 实例数量。

