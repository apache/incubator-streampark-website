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

该方式适用于入门学习、熟悉功能特性，容器重启后配置会失效，下方可以配置Mysql、Pgsql进行持久化
#### 部署

```sh
wget https://raw.githubusercontent.com/apache/incubator-streampark/dev/deploy/docker/docker-compose.yaml
wget https://raw.githubusercontent.com/apache/incubator-streampark/dev/deploy/docker/.env
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
```sh
wget https://raw.githubusercontent.com/apache/incubator-streampark/dev/deploy/docker/docker-compose.yaml
wget https://raw.githubusercontent.com/apache/incubator-streampark/dev/deploy/docker/mysql/.env
vim .env
```

需要先在mysql先创建streampark数据库，然后手动执行对应的schema和data里面对应数据源的sql

然后修改对应的连接信息
```sh
SPRING_PROFILES_ACTIVE=mysql
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/streampark?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=streampark
```

```sh
docker-compose up -d
```
### 沿用已有的 Pgsql 服务
```html
wget https://raw.githubusercontent.com/apache/incubator-streampark/dev/deploy/docker/docker-compose.yaml
wget https://raw.githubusercontent.com/apache/incubator-streampark/dev/deploy/docker/pgsql/.env
vim .env
```
修改对应的连接信息
```sh
SPRING_PROFILES_ACTIVE=pgsql
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/streampark?stringtype=unspecified
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=streampark
```
```sh
docker-compose up -d
```

## 基于源码构建镜像进行StreamPark部署
```sh
git clone https://github.com/apache/incubator-streampark.git
cd incubator-streampark/deploy/docker
vim docker-compose.yaml
```

```sh
    build:
      context: ../..
      dockerfile: deploy/docker/Dockerfile
#   image: ${HUB}:${TAG}
```
![](/doc/image/streampark_source_generation_image.png)

```sh
cd ../..
./build.sh
```
![](/doc/image/streampark_build.png)

## docker-compse配置

docker-compose.yaml会引用env文件的配置，修改后的配置如下：

```yaml
version: '3.8'
services:
  ## streampark-console容器
  streampark-console:
    ## streampark的镜像
    image: apache/streampark:latest
    ## streampark的镜像启动命令
    command: ${
   RUN_COMMAND}
    ports:
      - 10000:10000
    ## 环境配置文件
    env_file: .env
    environment:
      ## 声明环境变量
      HADOOP_HOME: ${
   HADOOP_HOME}
    volumes:
      - flink:/streampark/flink/${
   FLINK}
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/hosts:/etc/hosts:ro
      - ~/.kube:/root/.kube:ro
    privileged: true
    restart: unless-stopped
    networks:
      - streampark

  ## flink-jobmanager容器
  flink-jobmanager:
    image: ${
   FLINK_IMAGE}
    ports:
      - "8081:8081"
    command: jobmanager
    volumes:
      - flink:/opt/flink
    env_file: .env
    restart: unless-stopped
    privileged: true
    networks:
      - streampark

  ## streampark-taskmanager容器
  flink-taskmanager:
    image: ${
   FLINK_IMAGE}
    depends_on:
      - flink-jobmanager
    command: taskmanager
    deploy:
      replicas: 1
    env_file: .env
    restart: unless-stopped
    privileged: true
    networks:
      - streampark

networks:
  streampark:
    driver: bridge

volumes:
  flink:
```

最后，执行启动命令：

```sh
cd deploy/docker
docker-compose up -d
```

可以使用docker ps来查看是否安装成功，显示如下信息，表示安装成功：

![](/doc/image/streampark_docker_ps.png)

## 上传配置至容器

在前面的env文件，声明了HADOOP_HOME，对应的目录为“/streampark/hadoop”，所以需要上传hadoop安装包下的/etc/hadoop至/streampark/hadoop目录，命令如下：

```sh
## 上传hadoop资源
docker cp etc整个目录 streampark-docker_streampark-console_1:/streampark/hadoop
## 进入容器
docker exec -it streampark-docker_streampark-console_1 bash
## 查看
ls
```

![](/doc/image/streampark_docker_ls_hadoop.png)

同时，其它配置文件，如maven的settings.xml文件也是以同样的方式上传。