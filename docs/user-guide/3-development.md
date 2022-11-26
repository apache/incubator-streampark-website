---
id: 'development'
title: 'Develop Environment'
sidebar_position: 3
---

> [StreamPark](https://github.com/apache/incubator-streampark. follows the Apache license 2.0, it will be a long-term active project. Welcome to submit [PR](https://github.org.apache.streampark.pulls) Or [ISSUE](https://github.org.apache.streampark.issues/new/choose). If you like, please give a [star](https://github.org.apache.streampark.stargazers), your support is our greatest motivation. This project has been concerned and recognized by many friends since it was open source. Some friends are using it. They come from finance, data analysis, Internet of vehicles, smart advertising, real estate and other companies, and There are even some friends from the first-line big factories.
StreamPark community is a very open, mutual assistance and respect for talents. We also welcome more developers to join us and contribute together, not only for the code, but also for the use of documents, experience reports, questions and answers.

More and more developers are not satisfied with the simple installation and use, and need to be further researched or expanded based on its source code, which requires further in-depth understanding of StreamPark. This chapter specifically describes how to build a development environment for the `streampark-console` streaming batch integration platform locally. For convenience of explanation, the `streampark-console` mentioned in this article refers to the `streampark-console platform`.

StreamPark console has realized the decoupling of Flink runtime since version 1.2.0, That is, **it is not mandatory to rely on Hadoop or kubernetes environment** and can install Hadoop or kubernetes according to your actual needs.

## Install Hadoop (optional，YARN Runtime)

You can install Hadoop locally or use the existing Hadoop environment, but the following conditions are required:

- Install and configure `Hadoop` and `yarn`
- Configured `HADOOP_HOME` and `HADOOP_CONF_ DIR` environment variable
- `Hadoop` and `yarn` are running normally

### Install Hadoop environment locally

As for how to install the Hadoop environment locally, you can refer to the relevant information by yourself, and there will not be too much explanation here.

### Use existing Hadoop cluster

It is recommended to use the existing Hadoop cluster (test environment). If you use the existing Hadoop cluster, you need to copy the following configuration to the development machine

- Copy the `core-site.xml`, `hdfs-site.xml` and `yarn-site.xml` files to the development machine.
- If Kerberos authentication is enabled, you need to copy the `keytab` file and `krb5.conf` to the development machine.

To ensure that the local machine can connect to the cluster, you need to set the host addresses of the `core-site.xml`、`hdfs-site.xml` and `yarn-site.xml` to the development machine

## Install kubernetes (optional, k8s runtime)

If you are developing locally, you can use minikube or kubesphere to quickly install kubernetes environment, Of course, it is more recommended to choose the existing k8s cluster facilities. In addition, Tencent cloud tke and Alibaba cloud ack with time billing is also a good choice for qulckly develop.

For additional configuration requirements, please refer to: [**streampark flink-k8s integration support**](../flink-k8s/1-deployment.md)

## Install Flink (optional, Standalone Runtime)

Download Flink from the official website, and configure FLINK_HOME
```shell
wget https://mirrors.bfsu.edu.cn/apache/flink/flink-1.13.1/flink-1.13.1-bin-scala_2.11.tgz
tar xzf flink-1.13.1-bin-scala_2.11.tgz /opt/
cd /opt/flink-1.13.1
```

Start local Flink cluster
```
./bin/start-cluster.sh
```


## Install maven

```shell
cd ~
wget https://dlcdn.apache.org/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz
tar -xzvf apache-maven-3.8.6-bin.tar.gz
ln -s /root/apache-maven-3.8.6/bin/mvn /usr/bin/mvn
```

## Install MySQL

MySQL is used in `console`, you can install MySQL or directly use the existing mysql. Please refer to the installation and configuration of MySQL by yourself. There is no more explanation here.

## Install Nodejs

The front-end part of `console` is developed with nodejs. You can download and install the latest nodejs.

## Install and configure StreamPark

If all the above preparations are ready, you can install and configure the `streampark-console`. The `streampark-console` is a frontend and backend separated project. In order to facilitate the final packaging and deployment of the project and reduce the user's use and learning costs, the front end and back end mixed packaging and deployment mode is used. However, it is recommended to use the front end and back end separated mode for development and debugging at the development stage. The specific steps are as follows:

### Backend deployment and configuration

The backend of `streampark-console` is developed by springboot and mybatis, and verified by JWT. Let's take a look at the specific process of backend installation and deployment.

#### Backend compilation

Firstly, download the `streampark` project and compile it.

```shell
git clone git@github.com:apache/incubator-streampark.git streampark
cd streampark
mvn clean install -Dscala.version=2.12.8 -Dscala.binary.version=2.12 -DskipTests -Pwebapp
```

#### Backend decompression

After the compilation, the installation package location is `streampark/streampark-console/streampark-console-service/target/streampark-console-service-${version}-bin.tar.gz`, The directory structure after decompressing is as follows:

```textmate
.
streampark-console-service-${version}
├── bin
│    ├── flame-graph
│    ├──   └── *.py
│    ├── startup.sh
│    ├── setclasspath.sh
│    ├── shutdown.sh
│    ├── yaml.sh
├── conf
│    ├── application.yaml
│    ├── flink-application.template
│    ├── logback-spring.xml
│    └── ...
├── lib
│    └── *.jar
├── plugins
│    ├── streampark-jvm-profiler-1.0.0.jar
│    └── streampark-flink-sqlclient-1.0.0.jar
├── logs
├── temp
```
Copy the unpacked directory to other directories to prevent it from being cleaned up the next time `mvn clean` is executed. For example, if it is placed in `/opt/streampark/`, the full path of the file is `/opt/streampark/streampark-console-service-${version}`, This path will be used later and there is no space in the path.

#### Backend configuration

Git clone streampark source code, then open it with IntelliJ idea, and modify JDBC connection information of `datasource` in the `resources/application.yml`, Please refer to [modify configuration](http://www.streamxhub.com/zh/doc/console/deploy/#%E4%BF%AE%E6%94%B9%E9%85%8D%E7%BD%AE) in the installation and deployment chapter.

<img src="/doc/image/streampark_conf.jpg" />

If the target cluster you want to connect to has Kerberos authentication enabled, you need to find the relative information under `resources/kerberos.xml`and configure it. Kerberos is off by default. To enable it, set `enable` to true, as follows:

```yml
security:
  kerberos:
    login:
      enable: false
      principal:
      krb5:
      keytab:
java:
  security:
    krb5:
      conf:
```

#### Backend startup

`StreamPark console` is a web application developed based on springboot, `org.apache.streampark.console.StreamParkConsole` is the main class. Before startup, you need to set `VM options` and `environment variables`

##### VM options

You need to set `apphome` in `VM options`, the value is the full path of the above unpacked streampark-console.

```shell
-Dapp.home=/opt/streampark/streampark-console-service-${version}
```
<br></br>
If the JDK version used by the development machine is above JDK1.8, the following parameters need to be added: <br></br>

```shell
--add-opens java.base/jdk.internal.loader=ALL-UNNAMED --add-opens jdk.zipfs/jdk.nio.zipfs=ALL-UNNAMED
```

##### Environment variables

If you use a non locally installed Hadoop cluster (test Hadoop), you need to configure `HADOOP_USER_NAME` and `HADOOP_CONF_DIR` in `Environment variables`. The value of `HADOOP_USER_NAME` is the Hadoop user name with read and write permission to HDFS. `HADOOP_CONF_DIR` is the storage location of the configuration file on the development machine. If Hadoop is installed locally, the variable does not need to be configured.

<img src="/doc/image/streampark_ideaopt.jpg" />

If everything is ready, you can start the `StreamParkConsole` main class. If it is started successfully, you will see the printing information of successful startup.

### Frontend deployment and configuration

The frontend is developed based on nodejs and Vue, so the node environment needs to be installed on the machine. The process is as follows:

#### Frontend configuration

Since it is a frontend and backend separated project, the frontend needs to know the access address of the backend (streampark console) in order to work together. Therefore, the Vue needs to be changed_ APP_ BASE_ The value of API variable is located in:

![web config](/doc/image/streampark_websetting.png)

Default configuration:

```javascript
VUE_APP_PORT = 10003
VUE_APP_BASE_API = http://localhost:10000
```

Parameter description:
* `VUE_APP_PORT`: Frontend server port
* `VUE_APP_BASE_API`: The URL address of the backend request

#### Code compile

```shell
cd streampark-console/streampark-console-webapp
npm install
```

#### Start server

```shell
cd streampark-console/streampark-console-webapp
npm run serve
```
