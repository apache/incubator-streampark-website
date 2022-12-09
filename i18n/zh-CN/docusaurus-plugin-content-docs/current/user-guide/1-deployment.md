---
id: 'deployment'
title: '平台部署'
sidebar_position: 1
---

import { ClientEnvs } from '../components/TableData.jsx';

StreamPark 总体组件栈架构如下， 由 streampark-core 和 streampark-console 两个大的部分组成 , streampark-console 是一个非常重要的模块, 定位是一个**综合实时数据平台**，**流式数仓平台**, **低代码 ( Low Code )**, **Flink & Spark 任务托管平台**，可以较好的管理 Flink 任务，集成了项目编译、发布、参数配置、启动、savepoint，火焰图 ( flame graph )，Flink SQL，监控等诸多功能于一体，大大简化了 Flink 任务的日常操作和维护，融合了诸多最佳实践。其最终目标是打造成一个实时数仓，流批一体的一站式大数据解决方案

![StreamPark Archite](/doc/image/streampark_archite.png)

streampark-console 提供了开箱即用的安装包，安装之前对环境有些要求，具体要求如下：

## 环境要求

<ClientEnvs></ClientEnvs>

:::tip 注意
StreamPark 1.2.2之前(包含)的版本,只支持`scala 2.11`,切忌使用`flink`时要检查对应的`scala`版本
1.2.3之后(包含)的版本,支持 `scala 2.11` 和 `scala 2.12` 两个版本
:::


目前 StreamPark 对 Flink 的任务发布，同时支持 `Flink on YARN` 和 `Flink on Kubernetes` 两种模式。

### Hadoop
使用 `Flink on YARN`，需要部署的集群安装并配置 Hadoop的相关环境变量，如你是基于 CDH 安装的 hadoop 环境，
相关环境变量可以参考如下配置:

```shell
export HADOOP_HOME=/opt/cloudera/parcels/CDH/lib/hadoop #hadoop 安装目录
export HADOOP_CONF_DIR=/etc/hadoop/conf
export HIVE_HOME=$HADOOP_HOME/../hive
export HBASE_HOME=$HADOOP_HOME/../hbase
export HADOOP_HDFS_HOME=$HADOOP_HOME/../hadoop-hdfs
export HADOOP_MAPRED_HOME=$HADOOP_HOME/../hadoop-mapreduce
export HADOOP_YARN_HOME=$HADOOP_HOME/../hadoop-yarn
```

### Kubernetes

使用 `Flink on Kubernetes`，需要额外部署/或使用已经存在的 Kubernetes 集群，请参考条目： [**StreamPark Flink-K8s 集成支持**](../flink-k8s/1-deployment.md)。

## 编译 & 部署

你可以直接下载编译好的[**发行包**](https://github.com/apache/incubator-streampark/releases)(推荐),也可以选择手动编译安装，手动编译安装步骤如下:


### 环境要求

- Maven 3.6+
- npm 7.11.2 ( https://nodejs.org/en/ )
- pnpm (npm install -g pnpm)
- JDK 1.8+

### 编译打包


#### 自动打包

从 StreamPark 1.2.3+ 版本开始,提供了自动编译的脚本 `build.sh`, 执行运行该脚本按照要求进行下一步选择即可完成编译, 若 StreamPark 1.2.3 之前的版本可以跳过,直接看手动打包部分文档即可

<video src="http://assets.streamxhub.com/streamx-build.mp4" controls="controls" width="100%" height="100%"></video>

```shell

./build.sh

```

#### 手动打包

在 StreamPark 从 1.2.1 及之后的版本支持**混合打包** 和 **独立打包** 两种模式,供用户选择, 手动打包部署的话,需要注意每种打包方式的具体操作:

##### 混合打包

```bash
git clone git@github.com:apache/incubator-streampark.git streampark
cd streampark
mvn clean install -DskipTests -Dscala.version=2.11.12 -Dscala.binary.version=2.11 -Pwebapp
```

:::danger 特别注意
前后端混合打包模式下<span style={{color:'red'}}>**-Pwebapp**</span> 该参数必带
:::

##### 独立打包

###### 1. 后端编译

```bash
git clone git@github.com:apache/incubator-streampark.git streampark
cd streampark
mvn clean install -Dscala.version=2.11.12 -Dscala.binary.version=2.11 -DskipTests
```

###### 2. 前端打包

- 2.1 修改base api

在前后端独立编译部署的项目里,前端项目需要知道后端服务的base api,才能前后端协同工作. 因此在编译之前我们需要指定下后端服务的base api,修改 streampark-console-webapp/.env.production 里的`VUE_APP_BASE_API`即可

```bash
vi streampark/streampark-console/streampark-console-webapp/.env.production
```

- 2.2 编译

```bash
git clone https://github.com/apache/incubator-streampark.git streampark
cd streampark/streampark-console/streampark-console-webapp
npm install
npm run build
```

:::danger 特别注意

注意每个不同版本编译的时候携带的参数,
在 StreamPark 1.2.3(包含)之后的版本里, 其中 `-Dscala.version` 和 `-Dscala.binary.version` 参数 必带

Scala 2.11 编译, 相关 scala 版本指定信息如下:
```
-Dscala.version=2.11.12 -Dscala.binary.version=2.11
```
Scala 2.12 编译, 相关 scala 版本指定信息如下:
```
-Dscala.version=2.12.7 -Dscala.binary.version=2.12
```

:::


### 部署后端

安装完成之后就看到最终的工程文件，位于 `streampark/streampark-console/streampark-console-service/target/streampark-console-service-${version}-bin.tar.gz`,解包后安装目录如下

```textmate
.
streampark-console-service-1.2.1
├── bin
│    ├── flame-graph
│    ├──   └── *.py                           //火焰图相关功能脚本 ( 内部使用，用户无需关注 )
│    ├── startup.sh                           //启动脚本
│    ├── setclasspath.sh                      //java 环境变量相关的脚本 ( 内部使用，用户无需关注 )
│    ├── shutdown.sh                          //停止脚本
│    ├── yaml.sh                              //内部使用解析 yaml 参数的脚本 ( 内部使用，用户无需关注 )
├── conf
│    ├── application.yaml                     //项目的配置文件 ( 注意不要改动名称 )
│    ├── flink-application.template           //flink 配置模板 ( 内部使用，用户无需关注 )
│    ├── logback-spring.xml                   //logback
│    └── ...
├── lib
│    └── *.jar                                //项目的 jar 包
├── plugins
│    ├── streampark-jvm-profiler-1.0.0.jar       //jvm-profiler,火焰图相关功能 ( 内部使用，用户无需关注 )
│    └── streampark-flink-sqlclient-1.0.0.jar    //Flink SQl 提交相关功能 ( 内部使用，用户无需关注 )
├── script
│     ├── schema                               // 完整的ddl建表sql
│     ├── data                               // 完整的dml插入数据sql
│     ├── upgrade                             // 每个版本升级部分的sql(只记录从上个版本到本次版本的sql变化)
├── logs                                      //程序 log 目录

├── temp                                      //内部使用到的临时路径，不要删除
```

##### 初始化表结构

在 1.2.1之前的版本安装过程中不需要手动做数据初始化，只需要设置好数据库信息即可，会自动完成建表和数据初始化等一些列操作, 1.2.1(包含)之后的版本里不在自动建表和升级,需要用户手动执行ddl进行初始化操作,ddl说明如下:

```textmate
├── script
│     ├── schema                               // 完整的ddl建表sql
│     ├── data                               // 完整的dml插入数据sql
│     ├── upgrade                             // 每个版本升级部分的sql(只记录从上个版本到本次版本的sql变化)
```

执行schema文件夹中的sql来初始化表结构

##### 初始化表数据

在 1.2.1之前的版本安装过程中不需要手动做数据初始化，只需要设置好数据库信息即可，会自动完成建表和数据初始化等一些列操作, 1.2.1(包含)之后的版本里不在自动建表和升级,需要用户手动执行ddl进行初始化操作,ddl说明如下:

```textmate
├── script
│     ├── schema                               // 完整的ddl建表sql
│     ├── data                               // 完整的dml插入数据sql
│     ├── upgrade                             // 每个版本升级部分的sql(只记录从上个版本到本次版本的sql变化)
```

以下 sql 语句请使用 mysql 服务的 root 用户进行操作。

```sql
create database if not exists `streampark` character set utf8mb4 collate utf8mb4_general_ci;
create user 'streampark'@'%' IDENTIFIED WITH mysql_native_password by 'streampark';
grant ALL PRIVILEGES ON streampark.* to 'streampark'@'%';
flush privileges;
```

之后可使用 streampark 用户依次执行 schema 和 data 文件夹中的 sql 文件内容来建表以及初始化表数据。

##### 修改配置
安装解包已完成，接下来准备数据相关的工作

###### 修改连接信息
进入到 `conf` 下，修改 `conf/application.yml`,找到 spring 这一项，找到 profiles.active 的配置，修改成对应的信息即可，如下

```yaml
spring:
  profiles.active: mysql #[h2,pgsql,mysql]
  application.name: StreamPark
  devtools.restart.enabled: false
  mvc.pathmatch.matching-strategy: ant_path_matcher
  servlet:
    multipart:
      enabled: true
      max-file-size: 500MB
      max-request-size: 500MB
  aop.proxy-target-class: true
  messages.encoding: utf-8
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
  main:
    allow-circular-references: true
    banner-mode: off
```
 
在修改完 `conf/application.yml` 后, 还需要修改 `config/application-mysql.yml` 中的数据库连接信息:

**Tips: 由于Apache 2.0许可与Mysql Jdbc驱动许可的不兼容，用户需要自行下载驱动jar包并放在 $STREAMPARK_HOME/lib 中**

```yaml
spring:
  datasource:
    username: root
    password: xxxx
    driver-class-name: com.mysql.cj.jdbc.Driver   # 如果你使用的是 mysql-5.x，则此处的驱动名称应该是：com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/streampark?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
```

###### 修改workspace
进入到 `conf` 下，修改 `conf/application.yml`,找到 streampark 这一项，找到 workspace 的配置，修改成一个用户有权限的目录

```yaml
streampark:
  # HADOOP_USER_NAME 如果是on yarn模式( yarn-prejob | yarn-application | yarn-session)则需要配置 hadoop-user-name
  hadoop-user-name: hdfs
  # 本地的工作空间,用于存放项目源码,构建的目录等.
  workspace:
    local: /opt/streampark_workspace # 本地的一个工作空间目录(很重要),用户可自行更改目录,建议单独放到其他地方,用于存放项目源码,构建的目录等.
    remote: hdfs:///streampark   # support hdfs:///streampark/ 、 /streampark 、hdfs://host:ip/streampark/
```

##### 启动后端

进入到 `bin` 下直接执行 startup.sh 即可启动项目，默认端口是**10000**,如果没啥意外则会启动成功

```bash
cd streampark-console-service-1.0.0/bin
bash startup.sh
```
相关的日志会输出到**streampark-console-service-1.0.0/logs/streampark.out** 里

:::info 提示

前后端混合打包模式,只启动后端服务即可完成所有的部署, 打开浏览器 输入**http://$host:10000**  即可登录

:::

### 部署前端

##### 环境准备

全局安装 nodejs 和 pm2
```
yum install -y nodejs
npm install -g pm2
```

##### 发布

###### 1. 将dist copy到部署服务器
将streampark-console-webapp/dist 整个目录 copy至服务器的部署目录,如: `/home/www/streampark`,拷贝后的目录层级是/home/www/streampark/dist

###### 2. 将streampark.js文件copy到项目部署目录
将streampark/streampark-console/streampark-console-webapp/streampark.js copy 至 `/home/www/streampark`

###### 3. 修改服务端口
用户可以自行指定前端服务的端口地址, 修改 /home/www/streampark/streampark.js文件, 找到 `serverPort` 修改即可,默认如下:

```
  const serverPort = 1000
```

4. 启动服务

```shell
   pm2 start streampark.js
```

关于 pm2的更多使用请参考[官网](https://pm2.keymetrics.io/)

### 登录系统

经过以上步骤,就算部署完成,可直接登录进入系统

![StreamPark Login](/doc/image/streampark_login.jpeg)

:::tip 提示
默认密码: <strong> admin / streampark </strong>
:::

## 系统配置

进入系统之后，第一件要做的事情就是修改系统配置，在菜单/StreamPark/Setting 下，操作界面如下:

![StreamPark Settings](/doc/image/streampark_settings.png)

主要配置项分为以下几类

<div class="counter">

-   Flink Home
-   Maven Home
-   StreamPark Env
-   Email

</div>

### Flink Home
这里配置全局的 Flink Home,此处是系统唯一指定 Flink 环境的地方，会作用于所有的作业

:::info 提示
特别提示: 最低支持的 Flink 版本为 1.12.0, 之后的版本都支持
:::

### Maven Home

指定 maven Home, 目前暂不支持，下个版本实现

### StreamPark Env

- StreamPark Webapp address
  这里配置 StreamPark Console 的 web url 访问地址，主要火焰图功能会用到，具体任务会将收集到的信息通过此处暴露的 url 发送 http 请求到系统，进行收集展示
- StreamPark Console Workspace
  配置系统的工作空间，用于存放项目源码，编译后的项目等(该配置为1.2.0之前的版本里的配置项)

### Email

Alert Email 相关的配置是配置发送者邮件的信息，具体配置请查阅相关邮箱资料和文档进行配置
