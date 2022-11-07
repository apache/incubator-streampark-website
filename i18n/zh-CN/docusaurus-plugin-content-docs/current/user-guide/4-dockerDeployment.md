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
#### 部署

```html
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/.env
docker-compose up -d
```
服务启动后，可以通过 http://localhost:10000 访问 StreamPark，同时也可以通过 http://localhost:8081访问Flink。访问StreamPark链接后会跳转到登陆页面，StreamPark 默认的用户和密码分别为 admin 和 streampark。想要了解更多操作请参考用户手册快速上手。
![](/doc/image/streampark_docker-compose.png)
该部署方式会自动给你启动一个flink-session集群供你去进行flink任务使用，同时也会挂载本地docker服务以及~/.kube来用于k8s模式的任务提交

#### 配置flink home

![](/doc/image/streampark_flinkhome.png)

#### 配置session集群

![](/doc/image/remote.png)

注意：在配置flink-sessin集群地址时，填写的ip地址不是localhost，而是宿主机网络ip，该ip地址可以通过ifconfig来进行获取

#### 提交任务

![](/doc/image/remoteSubmission.png)


### 沿用已有的 Mysql 服务
该方式适用于企业生产，你可以基于docker快速部署strempark并将其和线上数据库进行关联
注意：部署支持的多样性是通过.env这个配置文件来进行维护的，要保证目录下有且仅有一个.env文件
```
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/mysql/.env
vim .env
```
修改对应的连接信息
```html
SPRING_PROFILES_ACTIVE=mysql
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/streampark?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=streampark
```

```html
docker-compose up -d
```
### 沿用已有的 Pgsql 服务
```html
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/pgsql/.env
vim .env
```
修改对应的连接信息
```html
SPRING_PROFILES_ACTIVE=pgsql
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/streampark?stringtype=unspecified
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=streampark
```
```html
docker-compose up -d
```

## 基于源码构建镜像进行StreamPark部署
```html
git clone https://github.com/apache/incubator-streampark.git
cd incubator-streampark/deploy/docker
vim docker-compose.yaml
```

```html
    build:
      context: ../..
      dockerfile: deploy/docker/console/Dockerfile
#   image: ${HUB}:${TAG}
```
![](/doc/image/streampark_source_generation_image.png)

```html
cd ../..
./build.sh
```
![](/doc/image/streampark_build.png)

```html
cd deploy/docker
docker-compose up -d
```