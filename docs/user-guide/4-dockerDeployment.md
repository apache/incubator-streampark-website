---
id: 'docker-deployment'
title: 'Docker Quick Tutorial'
sidebar_position: 4
---

This tutorial uses the docker method to deploy StreamPark via Docker.
## Prepare
    Docker 1.13.1+
    Docker Compose 1.28.0+
### Installing docker

To start the service with docker, you need to install [docker](https://www.docker.com/) first

### Installing docker-compose

To start the service with docker-compose, you need to install [docker-compose](https://docs.docker.com/compose/install/) first
## Rapid StreamPark Deployment

### StreamPark deployment based on h2 and docker-compose
```
wget https://github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
docker-compose up -d
```

Once the service is started, StreamPark can be accessed through http://localhost:10000 and also through http://localhost:8081 to access Flink. Accessing the StreamPark link will redirect you to the login page, where the default user and password for StreamPark are admin and streamx respectively. To learn more about the operation, please refer to the user manual for a quick start.

### Use existing Mysql services
This approach is suitable for enterprise production, where you can quickly deploy strempark based on docker and associate it with an online database

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

## Login System

Once the service is started, StreamPark can be accessed through http://localhost:10000 and also through http://localhost:8081访问Flink
After accessing the StreamPark link you will be redirected to the login page, the default user and password for StreamPark are admin and streampark respectively. To learn more about the operation please refer to the user manual for a quick start

## Setting up Flink Home on StreamPark Web Ui
```
streampark/flink/flink1.14.5/
```
![](/doc/image/streamx_flinkhome.png)
