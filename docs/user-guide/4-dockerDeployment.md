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

#### Deployment

```html
wget https://raw.github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
wget https://raw.github.com/apache/incubator-streampark/blob/dev/deploy/docker/.env
docker-compose up -d
```

Once the service is started, StreamPark can be accessed through http://localhost:10000 and also through http://localhost:8081 to access Flink. Accessing the StreamPark link will redirect you to the login page, where the default user and password for StreamPark are admin and streampark respectively. To learn more about the operation, please refer to the user manual for a quick start.

#### Configure flink home

![](/doc/image/streampark_flinkhome.png)

#### Configure flink-session cluster

![](/doc/image/remote.png)

Note:When configuring the flink-sessin cluster address, the ip address is not localhost, but the host network ip, which can be obtained through ifconfig

#### Submit a task

![](/doc/image/remoteSubmission.png)

### Use existing Mysql services
This approach is suitable for enterprise production, where you can quickly deploy strempark based on docker and associate it with an online database
Note: The diversity of deployment support is maintained through the .env configuration file, make sure there is one and only one .env file in the directory

```html
wget https://raw.github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
wget https://raw.github.com/apache/incubator-streampark/blob/dev/deploy/docker/mysql/.env
vim .env
```
Modify the corresponding connection information
```html
SPRING_PROFILES_ACTIVE=mysql
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/streampark?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=streampark
```

```
docker-compose up -d
```
### Use existing Pgsql services
```html
wget https://raw.github.com/apache/incubator-streampark/blob/dev/deploy/docker/docker-compose.yaml
wget https://raw.github.com/apache/incubator-streampark/blob/dev/deploy/docker/pgsql/.env
vim .env
```
Modify the corresponding connection information
```html
SPRING_PROFILES_ACTIVE=pgsql
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/streampark?stringtype=unspecified
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=streampark
```
```
docker-compose up -d
```

## Build images based on source code for StreamPark deployment
```
git clone https://github.com/apache/incubator-streampark.git
cd incubator-streampark/deploy/docker
vim docker-compose
```

```html
    build:
      context: ../..
      dockerfile: deploy/docker/console/Dockerfile
#    image: ${HUB}:${TAG}
```

```
docker-compose up -d
```
