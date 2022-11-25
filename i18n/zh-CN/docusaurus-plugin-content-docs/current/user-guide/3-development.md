---
id: 'development'
title: '开发环境'
sidebar_position: 3
---

> [StreamPark](https://github.com/apache/incubator-streampark) 遵循 Apache-2.0 开源协议，将会是个长期更新的活跃项目，欢迎大家提交 [PR](https://github.com/apache/incubator-streampark/pulls) 或 [ISSUE](https://github.com/apache/incubator-streampark/issues/new/choose) 喜欢请给个 [Star](https://github.com/apache/incubator-streampark/stargazers) 您的支持是我们最大的动力。该项目自开源以来就受到不少朋友的关注和认可，表示感谢。已陆续有来自金融，数据分析，车联网，智能广告，地产等公司的朋友在使用，也不乏来自一线大厂的朋友在使用。
同时 StreamPark 社区是一个非常开放，相互协助，尊重人才的社区。我们也非常欢迎更多的开发者加入一块贡献，不只是代码的贡献，还寻求使用文档，体验报告，问答等方面的贡献。

越来越多的开发者已经不满足简单的安装使用，需要进一步研究或基于其源码二开或扩展相关功能，这就需要进一步的对 StreamPark 深入了解。 本章节具体讲讲如何在本地搭建 `streampark-console` 流批一体平台的开发环境，为了方便讲解，本文中所说的 `streampark-console` 均指 `streampark-console 平台`。

StreamPark Console 从 1.2.0 开始实现了 Flink-Runtime 的解耦，即**不强制依赖 Hadoop 或 Kubernetes 环境**，可以根据实际开发/使用需求自行安装 Hadoop 或 Kubernetes。

## 安装 Hadoop（可选，YARN Runtime）

关于 Hadoop 环境有两种方式解决，本地安装或者使用已有的 Hadoop 环境，不论采用哪种方式，以下条件是必需的：
- 安装并且配置好 `Hadoop` 和 `yarn`
- 已配置 `HADOOP_HOME` 和 `HADOOP_CONF_DIR`
- 已成功启动 `Hadoop` 和 `yarn`

### 本地安装 Hadoop 环境

关于如何在本地安装 Hadoop 环境可自行查阅相关资料，这里不作过多讲解。

### 使用已有 Hadoop 集群

推荐使用已有的 Hadoop 集群（测试环境），如使用已有 Hadoop 集群需要将以下配置拷贝到开发机器

- `core-site.xml`，`hdfs-site.xml`，`yarn-site.xml` 这三个配置文件 copy 到开发机器
- 如果开启了 kerberos 认证，需要将 `keytab` 文件和 `krb5.conf` 拷贝到开发机器

需要注意的是，`core-site.xml`, `hdfs-site.xml`, `yarn-site.xml` 需要配置这些文件中的主机地址以确保本机可以连接到集群。


## 安装 Kubernetes （可选，K8s Runtime）

本地开发可以通过 MiniKube 或 KubeSphere 等工具快速安装 Kubernetes 环境，当然更加推荐选择已有的 K8s 集群。此外按时计费的腾讯云 TKE / 阿里云 ACK 也是快速开发很好的选择。

额外配置需求请参考： [**StreamPark Flink-K8s 集成支持**](../flink-k8s/1-deployment.md)

## 安装 Flink（可选，Standalone Runtime）

从官网下载 Flink，并且配置 FLINK_HOME
```shell
wget https://mirrors.bfsu.edu.cn/apache/flink/flink-1.13.1/flink-1.13.1-bin-scala_2.11.tgz
tar xzf flink-1.13.1-bin-scala_2.11.tgz /opt/
cd /opt/flink-1.13.1
```
启动本地 Flink 集群
```
./bin/start-cluster.sh
```


## 安装 Maven

```shell
cd ~
wget https://dlcdn.apache.org/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz
tar -xzvf apache-maven-3.8.6-bin.tar.gz
ln -s /root/apache-maven-3.8.6/bin/mvn /usr/bin/mvn
```

## 安装 MySQL

`console` 用到了 MySQL，因此需要准备 MySQL 环境，你可以本地安装 MySQL，也可以直接使用已有的 MySQL。关于 MySQL 的安装配置，请自行查阅资料，这里不作过多讲解

## 安装 Nodejs

`console` 前端部分采用 nodejs 开发，需要 nodejs 环境，下载安装最新的 nodejs 即可

## 安装配置 StreamPark

如果以上准备工作都已经就绪，此时就可以安装配置 `streampark-console` 了。`streampark-console` 是前后端分离的项目，在项目最终打包部署时为了方便快捷，减少用户的使用和学习成本，使用了前后端混合打包部署模式，但在开发阶段建议使用前后端分离模式进行开发调试，具体步骤如下：

### 后端

`streampark-console` 后端采用 springBoot + mybatis 开发， JWT 权限验证。下面来看看后端安装部署具体流程

#### 编译

首先将 `StreamPark` 项目下载到本地并且编译

```shell
git clone git@github.com:apache/incubator-streampark.git streampark
cd streampark
mvn clean install -Dscala.version=2.12.8 -Dscala.binary.version=2.12 -DskipTests -Pwebapp
```

#### 解包

编译完成之后，安装包位置位于 `streampark/streampark-console/streampark-console-service/target/streampark-console-service-${version}-bin.tar.gz`，解包之后的目录如下:

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
将解包后的整个工程文件拷贝到其他目录以防止下次执行 `mvn clean` 被清理掉，如放到 `/opt/streampark/`，则此时该文件的完整路径是 `/opt/streampark/streampark-console-service-${version}`，后面会用到该路径，注意该路径中间不要存在空格

#### 配置

Git clone 下来 StreamPark 源码，然后使用 IntelliJ idea 打开，修改 `resources/application.yml` 文件中 `datasource` 的 JDBC 连接信息，具体可参考安装部署章节 [修改配置](https://streampark.apache.org/zh-CN/docs/development/config) 章节

<img src="/doc/image/streampark_conf.jpg" />

如果你要连接的目标集群开启了 kerberos 认证，则需要在 `resources/kerberos.xml` 文件中找到并配置相关信息，默认 kerberos 是关闭状态，要启用需将 `enable` 设置为 true, 如下:

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

#### 启动

`streampark-console` 是基于 springBoot 开发的 web 应用，`org.apache.streampark.console.StreamParkConsole` 为主类， 在启动主类之前，需要设置下 `VM options` 和 `Environment variables`

##### VM options

在 `VM options` 需要设置 `app.home`：值为上面解包后的 streampark-console 的完整路径:
```shell
-Dapp.home=/opt/streampark/streampark-console-service-${version}
```
<br></br>
如果开发机使用的 jdk 版本是 jdk1.8 以上版本， 则需要加上如下参数: <br></br>

```shell
--add-opens java.base/jdk.internal.loader=ALL-UNNAMED --add-opens jdk.zipfs/jdk.nio.zipfs=ALL-UNNAMED
```

##### Environment variables

如使用非本地安装的 Hadoop 集群（测试 Hadoop），`Environment variables` 中需要配置 `HADOOP_USER_NAME` 和 `HADOOP_CONF_DIR`，
`HADOOP_USER_NAME` 为具有 HDFS 读写权限的 Hadoop 用户名，`HADOOP_CONF_DIR` 为开发机上Hadoop配置文件的存放路径，如果是本地安装的 Hadoop 则不需要配置该项

<img src="/doc/image/streampark_ideaopt.jpg" />

如果一切准假就绪，就可以用 `StreamParkConsole` 主类启动项目，如果启动成功，就会看到有启动成功的信息输出

### 前端

streampark web 前端部分采用 nodejs + vue 开发，因此需要在机器上安装 node 环境，完整流程如下:

#### 配置

由于是前后端分离项目，前端需要知道后端（ streampark-console ）的访问地址，才能前后配合工作，因此需要更改 Base API ，具体位置在：
`streampark-console/streampark-console-webapp/.env.development`

![web配置](/doc/image/streampark_websetting.png)

配置默认如下:

```javascript
VUE_APP_PORT = 10003
VUE_APP_BASE_API = http://localhost:10000
```

参数说明:
* `VUE_APP_PORT`: 前端项目启动的端口
* `VUE_APP_BASE_API`: 请求后端的url地址

#### 编译代码

```shell
cd streampark-console/streampark-console-webapp
npm install
```

#### 启动服务

```shell
cd streampark-console/streampark-console-webapp
npm run serve
```
