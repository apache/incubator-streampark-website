---
id: 'docker-deployment'
title: 'Docker 快速使用教程'
sidebar_position: 4
---

本教程使用 Docker 完成StreamPark的部署。
## 前置条件

    Docker 1.13.1+
    Docker Compose 1.28.0+

### 安装docker
使用 docker 启动服务，需要先安装 [docker](https://www.docker.com/)

### 安装docker-compose
使用 docker-compose 启动服务，需要先安装 [docker-compose](https://docs.docker.com/compose/install/)

## 快速StreamPark部署

### 基于h2和docker-compose进行StreamPark部署
该方式适用于入门学习、熟悉功能特性
```
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
docker-compose up -d
```
服务启动后，可以通过 http://localhost:10000 访问 StreamPark，同时也可以通过 http://localhost:8081访问Flink。访问StreamPark链接后会跳转到登陆页面，StreamPark 默认的用户和密码分别为 admin 和 streamx。想要了解更多操作请参考用户手册快速上手。
![](/doc/image/streamx_docker-compose.png)
该部署方式会自动给你启动一个flink-session集群供你去进行flink任务使用，同时也会挂载本地docker服务以及~/.kube来用于k8s模式的任务提交

### 沿用已有的 Mysql 服务
该方式适用于企业生产，你可以基于docker快速部署strempark并将其和线上数据库进行关联
```
docker run -d --name streampark \
    -e DATABASE="mysql" \
    -e SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/<DATABASE>" \
    -e SPRING_DATASOURCE_USERNAME="<USER>" \
    -e SPRING_DATASOURCE_PASSWORD="<PASSWORD>" \
    -p 10000:10000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /etc/hosts:/etc/hosts \
    -v ~/.kube:/root/.kube \
    --net host \
    -d apache/incubator-streampark:"${STREAMPARK_VERSION}" /bin/sh -c "wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-8.0.30.tar.gz && tar -zxvf mysql-connector-java-8.0.30.tar.gz && cp mysql-connector-java-8.0.30/mysql-connector-java-8.0.30.jar lib && bash bin/startup.sh"
```

## 登陆系统

服务启动后，可以通过 http://localhost:10000 访问 StreamPark，同时也可以通过 http://localhost:8081访问Flink
访问StreamPark链接后会跳转到登陆页面，StreamPark 默认的用户和密码分别为 admin 和 streampark。想要了解更多操作请参考用户手册快速上手

## 在 StreamPark Web Ui 上设置 Flink Home
```
streampark/flink/flink1.14.5/
```
![](/doc/image/streamx_flinkhome.png)
