---
id: 'deployment'
title: '平台部署'
sidebar_position: 1
---

import { ClientEnvs } from '../components/TableData.jsx';

StreamX 总体组件栈架构如下， 由 streamx-core 和 streamx-console 两个大的部分组成 , streamx-console 是一个非常重要的模块, 定位是一个**综合实时数据平台**，**流式数仓平台**, **低代码 ( Low Code )**, **Flink & Spark 任务托管平台**，可以较好的管理 Flink 任务，集成了项目编译、发布、参数配置、启动、savepoint，火焰图 ( flame graph )，Flink SQL，监控等诸多功能于一体，大大简化了 Flink 任务的日常操作和维护，融合了诸多最佳实践。其最终目标是打造成一个实时数仓，流批一体的一站式大数据解决方案

![Streamx Archite](/doc/image/streamx_archite.png)

streamx-console 提供了开箱即用的安装包，安装之前对环境有些要求，具体要求如下：

## 环境要求

<ClientEnvs></ClientEnvs>

:::tip 注意
当前StreamX 1.2.1之前(包含)的版本,只支持`scala 2.11`,切忌使用`flink`时要检查对应的`scala`版本
:::


目前 StreamX 对 Flink 的任务发布，同时支持 `Flink on YARN` 和 `Flink on Kubernetes` 两种模式。

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

使用 `Flink on Kubernetes`，需要额外部署/或使用已经存在的 Kubernetes 集群，请参考条目： [**StreamX Flink-K8s 集成支持**](../flink-k8s/1-deployment.md)。

## 编译 & 部署

你可以直接下载编译好的[**发行包**](https://github.com/streamxhub/streamx/releases)(推荐),也可以选择手动编译安装，手动编译安装步骤如下:


### 环境要求

- Maven 3.6+
- npm 7.11.2 ( https://nodejs.org/en/ )
- JDK 1.8+

### 编译打包

streamx的编译在1.2.1前后发生了一些变化,我们分别看看具体变化和编译步骤:

#### 1.2.1之前版本

streamx 1.2.1(不含1.2.1)之前的版本默认将**前后端混合打包**,最终生成一个dist包,开箱即用,以减少用户的学习和使用成本:


```bash
git clone https://github.com/streamxhub/streamx.git
cd streamx
mvn clean install -DskipTests -Denv=prod
```
:::danger 特别注意
注意参数 <span style={{color:'red'}}>**-Denv=prod**</span>
:::

#### 1.2.1之后版本

在streamx 1.2.1(包含)及之后的版本除了**混合打包**之外我们还提供了**独立打包**模式,供用户选择,这种方式打出来的包,更适合前后端分离项目的线上部署.

##### 混合打包


```bash
git clone https://github.com/streamxhub/streamx.git
cd streamx
mvn clean install -DskipTests -Pwebapp
```

:::danger 特别注意
注意参数 <span style={{color:'red'}}>**-Pwebapp**</span>
:::

##### 独立打包

###### 1. 后端编译

```bash
git clone https://github.com/streamxhub/streamx.git
cd streamx
mvn clean install -DskipTests
```

###### 2. 前端打包

- 2.1 修改base api

在前后端独立编译部署的项目里,前端项目需要知道后端服务的base api,才能前后端协同工作. 因此在编译之前我们需要指定下后端服务的base api,修改 streamx-console-webapp/.env.production 里的`VUE_APP_BASE_API`即可

```bash 
vi streamx/streamx-console/streamx-console-webapp/.env.production
```

- 2.2 编译

```bash
git clone https://github.com/streamxhub/streamx.git
cd streamx/streamx-console/streamx-console-webapp
npm install
npm run build
```

:::danger 特别注意

注意每个不同版本编译的时候携带的参数

:::


### 部署后端

安装完成之后就看到最终的工程文件，位于 `streamx/streamx-console/streamx-console-service/target/streamx-console-service-${version}-bin.tar.gz`,解包后安装目录如下

```textmate
.
streamx-console-service-1.2.1
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
│    ├── streamx-jvm-profiler-1.0.0.jar       //jvm-profiler,火焰图相关功能 ( 内部使用，用户无需关注 )
│    └── streamx-flink-sqlclient-1.0.0.jar    //Flink SQl 提交相关功能 ( 内部使用，用户无需关注 )
├── script                                   
│     ├── final                               // 完整的ddl建表sql
│     ├── upgrade                             // 每个版本升级部分的sql(只记录从上个版本到本次版本的sql变化)
├── logs                                      //程序 log 目录
                                             
├── temp                                      //内部使用到的临时路径，不要删除
```

##### 初始化表结构

在 1.2.1之前的版本安装过程中不需要手动做数据初始化，只需要设置好数据库信息即可，会自动完成建表和数据初始化等一些列操作, 1.2.1(包含)之后的版本里不在自动建表和升级,需要用户手动执行ddl进行初始化操作,ddl说明如下:

```textmate
├── script
│     ├── final                 // 完整的ddl建表sql
│     ├── upgrade               // 每个版本升级部分的sql(只记录从上个版本到本次版本的sql变化)
```

##### 修改配置
安装解包已完成，接下来准备数据相关的工作

###### 新建数据库 `streamx`
确保在部署机可以连接的 mysql 里新建数据库 `streamx`

###### 修改连接信息
进入到 `conf` 下，修改 `conf/application.yml`,找到 datasource 这一项，找到 mysql 的配置，修改成对应的信息即可，如下

```yaml
datasource:
  dynamic:
    # 是否开启 SQL 日志输出，生产环境建议关闭，有性能损耗
    p6spy: false
    hikari:
      connection-timeout: 30000
      max-lifetime: 1800000
      max-pool-size: 15
      min-idle: 5
      connection-test-query: select 1
      pool-name: HikariCP-DS-POOL
    # 配置默认数据源
    primary: primary
    datasource:
      # 数据源-1，名称为 primary
      primary:
        username: $user
        password: $password
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc: mysql://$host:$port/streamx?useUnicode=true&characterEncoding=UTF-8&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
```

###### 修改workspace
进入到 `conf` 下，修改 `conf/application.yml`,找到 datasource 这一项，找到 mysql 的配置，修改成对应的信息即可，如下

```yaml
streamx:
  # HADOOP_USER_NAME
  hadoop-user-name: hdfs
  # 本地的工作空间,用于存放项目源码,构建的目录等.
  workspace:
    local: /opt/streamx_workspace # 替换一个有权限的目录,否则项目无法启动
    remote: hdfs:///streamx   # support hdfs:///streamx/ 、 /streamx 、hdfs://host:ip/streamx/
```

##### 启动后端

进入到 `bin` 下直接执行 startup.sh 即可启动项目，默认端口是**10000**,如果没啥意外则会启动成功

```bash
cd streamx-console-service-1.0.0/bin
bash startup.sh
```
相关的日志会输出到**streamx-console-service-1.0.0/logs/streamx.out** 里

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
将streamx-console-webapp/dist 整个目录 copy至服务器的部署目录,如: `/home/www/streamx`

###### 2. 将streamx.js文件copy到项目部署目录
将streamx/streamx-console/streamx-console-webapp/streamx.js copy 至 `/home/www/streamx`

###### 3. 修改服务端口
用户可以自行指定前端服务的端口地址, 修改 /home/www/streamx/streamx.js文件, 找到 `serverPort` 修改即可,默认如下:

```
  const serverPort = 1000 
```

4. 启动服务

```shell
   pm2 start streamx.js
```

关于 pm2的更多使用请参考[官网](https://pm2.keymetrics.io/)

### 登录系统

经过以上步骤,就算部署完成,可直接登录进入系统

![StreamX Login](/doc/image/streamx_login.jpeg)

:::tip 提示
默认密码: <strong> admin / streamx </strong>
:::

## 系统配置

进入系统之后，第一件要做的事情就是修改系统配置，在菜单/StreamX/Setting 下，操作界面如下:

![StreamX Settings](/doc/image/streamx_settings.png)

主要配置项分为以下几类

<div class="counter">

-   Flink Home
-   Maven Home
-   StreamX Env
-   Email

</div>

### Flink Home
这里配置全局的 Flink Home,此处是系统唯一指定 Flink 环境的地方，会作用于所有的作业

:::info 提示
特别提示: 最低支持的 Flink 版本为 1.12.0, 之后的版本都支持
:::

### Maven Home

指定 maven Home, 目前暂不支持，下个版本实现

### StreamX Env

- StreamX Webapp address 
  这里配置 StreamX Console 的 web url 访问地址，主要火焰图功能会用到，具体任务会将收集到的信息通过此处暴露的 url 发送 http 请求到系统，进行收集展示
- StreamX Console Workspace 
  配置系统的工作空间，用于存放项目源码，编译后的项目等(该配置为1.2.0之前的版本里的配置项)

### Email

Alert Email 相关的配置是配置发送者邮件的信息，具体配置请查阅相关邮箱资料和文档进行配置
