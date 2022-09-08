---
id: 'docker-deployment'
title: 'Docker Quick Tutorial'
sidebar_position: 4
---

This tutorial uses the docker-compose method to deploy StreamPark via Docker.
## Prepare
    Docker 1.13.1+
    Docker Compose 1.28.0+
## Using docker-compose to Start Server

To start the service with docker-compose, you need to install [docker-compose](https://docs.docker.com/compose/install/)，first, the link is available for Mac, Linux, Windows.

After installing docker-compose, we need to modify some of the configurations to better experience the StreamPark service, we need to configure at least 4GB of memory.

    Mac：Click Docker Desktop -> Preferences -> Resources -> Memory modified it
    Windows Docker Desktop：
        Hyper-V mode: Click Docker Desktop -> Settings -> Resources -> Memory modified it
        WSL 2 mode: see WSL 2 utility VM for more detail.


After completing the configuration, we can get the source package of StreamPark files from the download page and make sure you get the correct version.
After downloading the package, you can run the following command.

### 1.Build via mvn
```
./build.sh
```
![](/doc/image/streamx_build.png)
Note: The Scala version of Flink and the Scala version of StreamPark need to be consistent, please choose Scala 2.12 for this build.

### 2.Execute the Docker Compose build command
```
cd deploy/docker
docker-compose up -d
```
![](/doc/image/streamx_docker-compose.png)
### 3.Login System

Once the service is started, StreamPark can be accessed through http://localhost:10000 and also through http://localhost:8081 to access Flink. Accessing the StreamPark link will redirect you to the login page, where the default user and password for StreamPark are admin and streamx respectively. To learn more about the operation, please refer to the user manual for a quick start.

### 4.Setting up Flink Home on StreamPark Web Ui
```
/streamx/flink/flink1.14.5/
```
![img.png](/doc/image/streamx_flinkhome.png)
### 5.Starting a remote session cluster

Go to StreamPark web ui and click Setting->Flink Cluster to create a remote (standalone) mode cluster.
![img.png](/doc/image/remote.png)

tips: mac computer to get the real ip address of flink, can be through ifconfig.

### 6.Complete the above steps and perform a Flink task submission

In the StreamPark web ui click Application->Add New to create a remote (standalone) mode submission.
![img.png](/doc/image/remoteSubmission.png)
