---
id: 'docker-deployment'
title: 'Docker 快速使用教程'
sidebar_position: 4
---

本教程使用docker-compose方式通过 Docker 完成StreamPark的部署。
## 前置条件
    Docker 1.13.1+
    Docker Compose 1.28.0+
## 使用 docker-compose 启动服务

使用 docker-compose 启动服务，需要先安装 [docker-compose](https://docs.docker.com/compose/install/)，链接适用于 Mac，Linux，Windows。

安装完成 docker-compose 后我们需要修改部分配置以便能更好体验 StreamPark 服务，我们需要配置不少于 4GB 的内存：

    Mac：点击 Docker Desktop -> Preferences -> Resources -> Memory 调整内存大小
    Windows Docker Desktop：
        Hyper-V 模式：点击 Docker Desktop -> Settings -> Resources -> Memory 调整内存大小
        WSL 2 模式 模式：参考 WSL 2 utility VM 调整内存大小

完成配置后，我们可以从下载页面获取StreamPark文件的源包，并确保您获得正确的版本。下载软件包后，您可以运行以下命令。

### 1.通过 mvn 构建
```
./build.sh
```
![](/doc/image/streamx_build.png)
注意：Flink的Scala版本和StreamPark的Scala版本需要保持一致，本次构建请选择Scala 2.12。

### 2.执行 Docker Compose 构建命令
```
cd deploy/docker
docker-compose up -d
```
![](/doc/image/streamx_docker-compose.png)
### 3.登陆系统

服务启动后，可以通过 http://localhost:10000 访问 StreamPark，同时也可以通过 http://localhost:8081访问Flink。访问StreamPark链接后会跳转到登陆页面，StreamPark 默认的用户和密码分别为 admin 和 streamx。想要了解更多操作请参考用户手册快速上手。

### 4.在 StreamPark Web Ui 上设置 Flink Home
```
/streamx/flink/flink1.14.5/
```
![](/doc/image/streamx_flinkhome.png)
### 5.启动远程会话集群

进入StreamPark web ui点击Setting->Flink Cluster 创建一个remote (standalone)模式的集群。
![](/doc/image/remote.png)
tips：mac电脑获取flink的真实ip地址,可以通过ifconfig。

### 6.完成以上步骤，进行Flink任务提交

在StreamPark web ui点击Application->Add New 创建一个remote (standalone)模式提交。
![](/doc/image/remoteSubmission.png)
