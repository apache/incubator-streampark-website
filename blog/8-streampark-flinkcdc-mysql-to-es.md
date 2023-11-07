---
slug: streampark-flinkcdc-mysql-to-es
title: StreamPark部署及执行flink-cdc任务同步mysql数据到es的实践
tags: [StreamPark, 生产实践, FlinkSQL, FlinkCDC]
---

# StreamPark部署及执行flink-cdc任务同步mysql数据到es的实践

**摘要：**本文「 StreamPark部署及执行flink-cdc任务同步mysql数据到es的实践 」作者是滇约出行Java开发工程师Java大飞哥，主要内容为：

1. Apache StreamPark是什么？
2. 介绍
3. 相关连接
4. 部署
5. cdc实践
6. 资料
7. streampark官方提供的最新的二进制试用包
8. 总结

## **1. Apache StreamPark是什么？**

Apache StreamPark是流处理极速开发框架，流批一体 & 湖仓一体的云原生平台，一站式流处理计算平台。

## **2. 介绍**

### **2.1 特性**

![](/blog/dianyue/characteristic.png)

特性中的简单易用和文档详尽这两点我也是深有体会的，部署一点都不简单，照着官方文档都不一定能搞出来，下面部署环节慢慢来吐槽吧。

### **2.2 架构**

![](/blog/dianyue/architecture.png)

### **2.3 Zeppelin和StreamPark的对比**

之前我们写 Flink SQL 基本上都是使用 Java 包装 SQL，打 jar 包，提交到 S3 平台上。通过命令行方式提交代码，但这种方式始终不友好，流程繁琐，开发和运维成本太大。我们希望能够进一步简化流程，将 Flink TableEnvironment 抽象出来，有平台负责初始化、打包运行 Flink 任务，实现 Flink 应用程序的构建、测试和部署自动化。

这是个开源兴起的时代，我们自然而然的将目光投向开源领域中：在一众开源项目中，经过对比各个项目综合评估发现 Zeppelin 和 StreamPark 这两个项目对 Flink 的支持较为完善，都宣称支持 Flink on K8s ，最终进入到我们的目标选择范围中，以下是两者在 K8s 相关支持的简单比较。

![](/blog/dianyue/comparison_between_zeppelin_and_streamPark.png)

## **3. 相关连接**
```shell
ApacheStreamPark官方文档
    https://streampark.apache.org/zh-CN/
flink1.14.4官网
    https://nightlies.apache.org/flink/flink-docs-release-1.14/zh
streampark2.1.0的gitHub地址
    https://github.com/apache/incubator-streampark/tree/release-2.1.0
本地调试启动,编译指南
    https://z87p7jn1yv.feishu.cn/docx/X4UfdZ8cdoeK8ExQ7sUc1UHknps
多业务聚合查询设计思路与实践
    https://mp.weixin.qq.com/s/N1TqaLaqGCDRH9jnmhvlzg
```
## **4. 部署**

官方提供的在源码文件的docker-compose.yam里面的镜像是apache/streampark:latest，但是这个镜像根本用不了，之前用这个和官方提供的那几个镜像2.1.0和2.1.0，这两个镜像版本可以在dockerHub的官网上搜索到，为啥用不了呢？因为我在部署的时候用的最新的镜像，然后将源码包中的脚本文件拉下来在本地数据库里面streampark库里面执行了，然后使用官网给的镜像部署yaml后，发现容器一直在重启，然后我就看了下容器的日志，发现有关于数据库的表字段确实的报错，然后我就很是好奇和纳闷，就将确实的子段在表里面补全了，然后重启后可以启动起来，但是还是用不了，然后我就联系到官方，才得知他们的最新的镜像apache/streampark:latest里里面的jar包使用的是开发分支的开发版本，所以才有用不了的问题，官方在源码版本、镜像版本和sql版本这方面做的对应关系上还是做的不够的，这个也是让使用者很头疼的一个问题，明明是按照官网的文档来搞的，为啥都搞不通？所以说上面的特性中的易用性和文档详尽可以说是值得让人吐槽了。

那如何解决呢？

给官方反馈了这个问题，但是官方建议使用源码构建部署，然后我突发奇想，我自己构建一个二进制的源码包，然后在构建一个镜像试一下看看给的行，于是乎就就进行了漫长的尝试之路。

### **4.1 二进制包编译构建**

编译构建二进制可执行包，使用自己构建的二进制包构建Docker镜像，需要准备一台Linux的服务或者是虚拟机，可以正常上网即可，在该台机子上需要事先安装Git(拉取源码文件)，Maven和java环境（JDK1.8），我采用的是是上传的源码包：incubator-streampark-2.1.0.tar.gz，然后解压源码包：
```shell
    tar -zxvf incubator-streampark-2.1.0.tar.gz
```
解压到服务器上，然后进入到解压路径里面：

![](/blog/dianyue/decompression_path.png)

执行：
```shell
    ./build.sh
```
![](/blog/dianyue/compile.png)

编译构建会去下载很多的pom依赖，所以需要经过漫长的等待，如果你的网络速度够快的话，估计也挺快的，然后编译构建完成后会在当前目录下看到一个dist的目录，里面就生成了一个二进制的可执行部署的源码包了：apache-streampark_2.12-2.1.0-incubating-bin.tar.gz，这里源码编译构建就构建好了，下面构建镜像需要用到这个包。

### **4.2 镜像构建**

需要将Dockerfile文件和apache-streampark_2.12-2.1.0-incubating-bin.tar.gz放在同一个路径下（目录下）然后执行构建命令

Dockerfile文件
```dockerfile
FROM alpine:3.16 as deps-stage
COPY . /
WORKDIR /
RUN tar zxvf apache-streampark_2.12-2.1.0-incubating-bin.tar.gz \
&& mv apache-streampark_2.12-2.1.0-incubating-bin streampark
 
FROM docker:dind
WORKDIR /streampark
COPY --from=deps-stage /streampark /streampark

ENV NODE_VERSION=16.1.0
ENV NPM_VERSION=7.11.2
    
RUN apk add openjdk8 ; \ # 这里会报错,在windows环境用;在linux上使用&&
apk add maven ; \
apk add wget ; \
apk add vim ; \
apk add bash; \
apk add curl
    
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV MAVEN_HOME=/usr/share/java/maven-3
ENV PATH $JAVA_HOME/bin:$PATH
ENV PATH $MAVEN_HOME/bin:$PATH

RUN wget "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
&& tar zxvf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
&& rm "node-v$NODE_VERSION-linux-x64.tar.gz" \
&& ln -s /usr/local/bin/node /usr/local/bin/nodejs \
&& curl -LO https://dl.k8s.io/release/v1.23.0/bin/linux/amd64/kubectl \
&& install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

RUN mkdir -p ~/.kube

EXPOSE 10000
```
构建命令：
```shell
    docker build -f Dockerfile -t my_streampark:2.1.0 .
    #推送阿里云镜像仓库(略)
```
这里给大家提供了我自己构建的镜像如下：
```shell
    registry.cn-hangzhou.aliyuncs.com/bigfei/zlf:streampark2.1.0
```
### **4.3 初始化sql**

![](/blog/dianyue/initialize_sql_directory.png)

执行的过程会碰到两个错误：
```shell
    -- 1.Unknown column !launch' in 't flink_app'
    alter table "t flink_app'
    -- drop index"inx state": 2.注释这个一行
    -- 这个是在2.1.0的版本里面的flink_app这个表里面缺少的字段和索引,可以或略,或者是在表里加上launch字段,不影响我我们下面部署2.1.0来使用这个库里的sql数据的
```
streampark库如下：

![](/blog/dianyue/streampark_library.png)

可以使用资料里面的：streampark.sql，是我执行了官方的那个sql后将streampark库导出来的一个脚本，用我给的这个也是没有问题的。

### **4.4 部署**
#### **4.4.1 Docker-compose.yaml部署脚本**

```shell
version: '2.1'
services:
streampark-console:
  image: my_streampark:2.1.0
  command: ${RUN_COMMAND}
  ports:
    - 10000:10000
  env_file: .env
  volumes:
    - flink:/streampark/flink/${FLINK}
    - /var/run/docker.sock:/var/run/docker.sock
    - /etc/hosts:/etc/hosts:ro
    - ~/.kube:/root/.kube:ro
  privileged: true
  restart: unless-stopped
   
jobmanager:
  image: apache/flink:1.14.4-scala_2.12-java8
  command: "jobmanager.sh start-foreground"
  ports:
    - 8081:8081
  volumes:
    - ./conf:/opt/flink/conf
    - /tmp/flink-checkpoints-directory:/tmp/flink-checkpoints-directory
    - /tmp/flink-savepoints-directory:/tmp/flink-savepoints-directory
  environment:
    - JOB_MANAGER_RPC_ADDRESS=jobmanager
taskmanager:
  image: apache/flink:1.14.4-scala_2.12-java8
  depends_on:
    - jobmanager
  command: "taskmanager.sh start-foreground"
  volumes:
    - ./conf:/opt/flink/conf
    - /tmp/flink-checkpoints-directory:/tmp/flink-checkpoints-directory
    - /tmp/flink-savepoints-directory:/tmp/flink-savepoints-directory
  environment:
    - JOB_MANAGER_RPC_ADDRESS=jobmanager

volumes:
flink:
```
这个文件是我把flink的部署和streampark的部署合并修改了下，注意不要使用streampark官网的那种方式，搞了一个桥接的网络，否则有可能导致容器间的网络不通。

#### **4.4.2 配置文件准备**

deplay文件夹下：

![](/blog/dianyue/deploy_folder.png)

conf文件夹如下：

![](/blog/dianyue/conf_folder.png)

需要修改.env和conf里面的application.yaml文件里面streampark数据库相关的连接信息，这个application可以自己搞个目录挂载到容器的如下路径：

![](/blog/dianyue/container_path.png)

把官方的那个拿出来改一改然后挂载，我这个好像是没有生效的，

相关资料会在文末分享的。

#### **4.4.3 flink启动配置**

flink官网内存配置
```shell
https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/deployment/memory/mem_setup_tm/
```

#### **4.4.4 streampark启动配置**

flink-conf.yaml文件配置
```shell
jobmanager.rpc.address: jobmanager
blob.server.port: 6124
query.server.port: 6125

state.backend: filesystem
state.checkpoints.dir: file:///tmp/flink-checkpoints-directory
state.savepoints.dir: file:///tmp/flink-savepoints-directory

heartbeat.interval: 1000
heartbeat.timeout: 5000

rest.flamegraph.enabled: true
web.backpressure.refresh-interval: 10000

classloader.resolve-order: parent-first

taskmanager.memory.managed.fraction: 0.1
taskmanager.memory.process.size: 2048m

jobmanager.memory.process.size: 7072m
```

#### **4.4.5 遇到的问题**

由于我之前搞的flink部署有点问题，使用了桥接网络，导致直接使用flink的sql-client.sh执行之前的cdc失败了，报了如下的错误：

```shell
java.net,UnknownHostException: jobmanager: Temporary failure in name resolution
```

![](/blog/dianyue/cdc_failed.png)

然后我就把部署文件改成上面那种方式，后面把之前启动的容器全部删除，重新部署后就可以正常执行了。
之前还遇到一个错误就是在cdc实践的时候会遇到的问题，streampark提交启动了cdc任务，但是flink的jobs里面这个任务执行失败了：

![](/blog/dianyue/flink_failed.png)

```shell
java.util.concurrent.CompletionException: java.util.concurrent.Completiotion: org.apache.flink.runtime.jobmanager.schedulerloResourceAvailableException: Could not acquire the minimurrequired resources.
```
```shell
这个问题是之前flink采用桥接网络搭建的有问题,导致jobmanager启动不起来,使用上面正确的启动方式和flink-conf.yaml里面的配置,对taskmanager和jobmanager的资源配置和内存配置如下:

```properties
taskmanager.memory.managed.fraction: 0.1 
taskmanager.memory.process.size: 2048m 
jobmanager.memory.process.size: 7072m


请根据官网先关flink的内存参数来设置,资源尽量给大点,然后把之前有问题的容器删除重新启动后,三个容器都正常启动了.

```
## **5. cdc实践**

### **5.1 确定flink是否正常**

flink首页正常启动在没有任务执行的时候可以看到slot的数据量：

![](/blog/dianyue/slot.png)

正常启动taskManagers里面可以看到task的信息：

![](/blog/dianyue/taskmanagers.png)

![](/blog/dianyue/task.png)

job-manager的信息：

![](/blog/dianyue/job_manager.png)

### **5.2 streampark管理端配置**

streampark的默认的用户名和密码是：admin/streampark

#### **5.2.1 flink-home配置**

![](/blog/dianyue/flink_home.png)

#### **5.2.2 flink-cluster配置**

![](/blog/dianyue/flink_cluster.png)

#### **5.2.3 新增cdc-sql和上传jar或添加依赖**

![](/blog/dianyue/jar.png)

flink的job-manager节点和task-manager节点的/opt/flink/lib节点下我都传了上面那几个jar包了，然后用这个streampark来管理你只要把你任务用到的jar的上或者是把jar的maven依赖填上去，然后任务在大包的时候会将这个这些依赖全部打包到任务的jar包中，最后提交给flink去执行，这种是不是更加的方便快捷高效的管理任务了呢。

### **5.3 cdc执行成功实例**

cdc相关的请看

#### **5.3.1 需求**

最近接到一个需求，需要给客服部做一个把多个业务系统的的数据聚合到es里面做统一的搜索，一期需要把各个业务侧的订单数据同步到es中做聚合搜索，这个需求如果用传统的思维会在各个业务侧写一个xxl-job的定时任务，然后向es的各个业务索引中全量、增量的同步数据，这种传统的方案来说，不断需要各个业务侧写大量的业务代码，并且数据的时效性不高，做不到业务测试的业务侧的订单表的数据修改后，es的业务索引中的数据能立马也同步成最新的数据，如果有数据思维的话，这种需求能不写业务代码搞定就不要写业务代码，但是在传统的开发中采用的传统思维就会去写大量的业务代码，各个业务侧一套代码，由于各个业务侧的开发的水平参差不齐，维护成本高，代码质量层次不齐，时效性不高，还容易写出一些奇奇怪怪的坑，所以该设计一个什么样的方案呢？

#### **5.3.2 方案**

方案灵感来源于如下两篇文章：

基于 Flink CDC 构建 MySQL 和 Postgres 的 Streaming ETL

基于 Flink CDC 实现海量数据的实时同步和转换

#### **5.3.3 方案架构图**

![](/blog/dianyue/solution_architecture_diagram.png)

该方案使用flink-cdc对mysql的log-bin做监听做全量、增量和实时的数据同步，那来看下常见的cdc的方案的对比：

![](/blog/dianyue/cdcs_plan.png)

#### **5.3.4 选用flink-cdc的原因**

1）架构是分布式的，避免了单点故障，提升了计算数据处理的效率。

2）支持全量、增量和实时的数据同步，避免了业务侧写各种各样的同步数据的业务代码。

3）生态丰富、易用、功能强大，社区活跃。

4）数据采集、计算、统计、打宽、转换等强大的功能，可以使用编程式的方式跑jar任务，也可以使用flink-sql强大的sql功能做数据提取统计分析这种实时的事情，同时可以和大数据生态结合使用，也可以单独使用解决业务开发的痛点问题。

5）flink-cdc2.x版本以上做了重大的更新，支持无锁化（不像1.x是有锁的，一个不小心就会锁数据的表）、并发性能更高，所以2.x以上的版本就不用担心这个锁表的问题了。

#### **5.3.5 环境准备**

首先需要准备一个mysql的数据库，flink集群或者是单机和一个es集群或者es单机，本文都是采用Docker-Desktop来搭建的。

版本如下：

mysql5.7.16

es7.14.0

flink1.14.0

#### **5.3.5 开启mysql的log-bin**

Mysql5.7.x镜像开启log-bin失效及解决
```shell
https://mp.weixin.qq.com/s?__biz=Mzg2Mzg0NjEwOA==&mid=2247484493&idx=2&sn=8411c17e47951c8829d8313b74ad0fd3&scene=21#wechat_redirect
```

#### **5.3.6 es集群搭建**

Docker部署ES集群、kibana、RabbitMq和chrome安装elasticsearch-head插件
```shell
https://mp.weixin.qq.com/s?__biz=Mzg2Mzg0NjEwOA==&mid=2247484493&idx=1&sn=1a20b0f8119de3104b500b8b0d01d9a3&scene=21#wechat_redirect
```

#### **5.3.7 flink1.14.0环境搭建**

本文使用flink1.14.0搭建的环境，所以你也可以使用官方最新的稳定版本，可以使用flink1.17.0,flink的每个版本的差异还是有点大的，每个版本的写法都会有点不太一样，这个还有的注意下的。

使用官方提供的docker-compose的部署文件做了修改：

![](/blog/dianyue/docker_compose.png)

部署文件docker-compose.yaml：

```shell
version: "2.1"
services:
jobmanager:
  image: apache/flink:1.14.4-scala_2.12-java8
  command: "jobmanager.sh start-foreground"
  ports:
    - 8081:8081
  volumes:
    - ./conf:/opt/flink/conf
    - /tmp/flink-checkpoints-directory:/tmp/flink-checkpoints-directory
    - /tmp/flink-savepoints-directory:/tmp/flink-savepoints-directory
  environment:
    - JOB_MANAGER_RPC_ADDRESS=jobmanager
taskmanager:
  image: apache/flink:1.14.4-scala_2.12-java8
  depends_on:
    - jobmanager
  command: "taskmanager.sh start-foreground"
  volumes:
    - ./conf:/opt/flink/conf
    - /tmp/flink-checkpoints-directory:/tmp/flink-checkpoints-directory
    - /tmp/flink-savepoints-directory:/tmp/flink-savepoints-directory
  environment:
    - JOB_MANAGER_RPC_ADDRESS=jobmanager
```

这里只部署了jobmanager、taskmanager没有要zookeeper和kafka

修改配置文件：flink-conf.yaml
在该配置文件中加入如下配置：
```shell
classloader.resolve-order: parent-first
```

如果不加这个配置会到导致在flink的节点上执行sql-client.sh的窗口执行sql任务的时候会报错：

![](/blog/dianyue/report_error.png)

这里也是一个大坑，这里也是请教的大佬才搞定的。

部署命令：
```shell
git clone https://github.com/apache/flink-playgrounds.git
cd flink-playgrounds/operations-playground
docker-compose builddocker-compose up -d
# 强制全部重新创建会重新拉取镜像会很慢
docker-compose up --force-recreate -d
# 指定docker-compose文件后重新部署,只会重新部署新增的容器，不会全部删除后创建
docker-compose -f docker-compose.yaml up -d
```

#### **5.3.8 创建mysql的flink用户并授权**

![](/blog/dianyue/authorize.png)

#### **5.3.9 准备sql**

cdc任务的sql:
```shell
Flink SQL> SET execution.checkpointing.interval = 3s; # 首先，开启 checkpoint，每隔3秒做一次 checkpoint,在执行如下sql前先执行该sql,设置保存点，每3s执行一次同步

-- Flink SQL
Flink SQL> CREATE TABLE products (
  id INT,
  name STRING,
  description STRING,
   PRIMARY KEY (id) NOT ENFORCED
 ) WITH (
    'connector' = 'mysql-cdc',
    'hostname' = 'xxxx',
    'port' = '3306',
    'username' = 'flink',
    'password' = '123456',
    'database-name' = 'mydb',
    'table-name' = 'products'
 );
 
Flink SQL> CREATE TABLE orders (
  order_id INT,
  order_date TIMESTAMP(0),
  customer_name STRING,
  price DECIMAL(10, 5),
  product_id INT,
  order_status BOOLEAN,
  PRIMARY KEY (order_id) NOT ENFORCED
) WITH (
   'connector' = 'mysql-cdc',
    'hostname' = 'ip',
    'port' = '3306',
    'username' = 'flink',
    'password' = '123456',
    'database-name' = 'mydb',
    'table-name' = 'orders'
);

# 最后，创建 enriched_orders 表， 用来将关联后的订单数据写入 Elasticsearch 中
-- Flink SQL
Flink SQL> CREATE TABLE enriched_orders (
  order_id INT,
  order_date TIMESTAMP(0),
  customer_name STRING,
  price DECIMAL(10, 5),
  product_id INT,
  order_status BOOLEAN,
  product_name STRING,
  product_description STRING,
  PRIMARY KEY (order_id) NOT ENFORCED
) WITH (
    'connector' = 'elasticsearch-7',
    'hosts' = 'http://ip:port',
    'index' = 'enriched_orders'
);

#关联订单数据并且将其写入 Elasticsearch 中使用 Flink SQL 将订单表 order 与 商品表 products，物流信息表 shipments 关联，并将关联后的订单信息写入 Elasticsearch 中
-- Flink SQL
Flink SQL> INSERT INTO enriched_orders
SELECT o.*, p.name, p.description
FROM orders AS o
LEFT JOIN products AS p ON o.product_id = p.id;
```

jdbc任务sql:

```shell
# JDBC跑批
-- Flink SQL                  
Flink SQL> SET execution.checkpointing.interval = 3s; # 首先，开启 checkpoint，每隔3秒做一次 checkpoint

-- Flink SQL
Flink SQL> CREATE TABLE products (
  id INT,
  name STRING,
  description STRING,
   PRIMARY KEY (id) NOT ENFORCED
 ) WITH (
   'connector' = 'jdbc',
   'url' = 'jdbc:mysql://ip:3306/mydb',
   'table-name' = 'products',
'username' = 'flink',
   'password' = '123456'
 );

Flink SQL> CREATE TABLE orders (
  order_id INT,
  order_date TIMESTAMP(0),
  customer_name STRING,
  price DECIMAL(10, 5),
  product_id INT,
  order_status BOOLEAN,
  PRIMARY KEY (order_id) NOT ENFORCED
) WITH (
  'connector' = 'jdbc',
   'url' = 'jdbc:mysql://ip:3306/mydb',
   'table-name' = 'orders',
'username' = 'flink',
   'password' = '123456'
);

-- Flink SQL
Flink SQL> CREATE TABLE enriched_orders (
  order_id INT,
  order_date TIMESTAMP(0),
  customer_name STRING,
  price DECIMAL(10, 5),
  product_id INT,
  order_status BOOLEAN,
  product_name STRING,
  product_description STRING,
  PRIMARY KEY (order_id) NOT ENFORCED
) WITH (
    'connector' = 'elasticsearch-7',
    'hosts' = 'http://ip:port',
    'index' = 'enriched_orders'
);

# 关联订单数据并且将其写入 Elasticsearch 中使用 Flink SQL 将订单表 order 与 商品表 products，物流信息表 shipments 关联，并将关联后的订单信息写入 Elasticsearch 中
-- Flink SQL
Flink SQL> INSERT INTO enriched_orders
SELECT o.*, p.name, p.description
FROM orders AS o
LEFT JOIN products AS p ON o.product_id = p.id;
```

这里需要注意的是jdbc的sql任务和cdc-sql的任务最大的区别是：jdbc的sql任务执行一次就完结掉了，而cdc-sql的任务是一直在running，之前由于这里搞成jdbc的sql的方式了，然后去修改数据里面的数据，新增、修改和删除发现不会增量和实时同步，只会全量同步，最后是请教了一个大佬才茅塞顿开的，然后换成了cdc的方式就可以了。

#### **5.3.10 准备jar包**

![](/blog/dianyue/prepare_jar_package.png)

jar包需要拷贝的执行的节点上的如下目录里面：

![](/blog/dianyue/execution_node.png)

上传jar包然后重启集群的容器。

#### **5.3.11 mysql数据库中需要准备products、orders两张表**

![](/blog/dianyue/preparation_sheet.png)

sql如下：

```shell
-- MySQL
CREATE DATABASE mydb;
USE mydb;
CREATE TABLE products (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description VARCHAR(512)
);
ALTER TABLE products AUTO_INCREMENT = 101;

INSERT INTO products
VALUES (default,"scooter","Small 2-wheel scooter"),
      (default,"car battery","12V car battery"),
      (default,"12-pack drill bits","12-pack of drill bits with sizes ranging from #40 to #3"),
      (default,"hammer","12oz carpenter's hammer"),
      (default,"hammer","14oz carpenter's hammer"),
      (default,"hammer","16oz carpenter's hammer"),
      (default,"rocks","box of assorted rocks"),
      (default,"jacket","water resistent black wind breaker"),
      (default,"spare tire","24 inch spare tire");

CREATE TABLE orders (
order_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
order_date DATETIME NOT NULL,
customer_name VARCHAR(255) NOT NULL,
price DECIMAL(10, 5) NOT NULL,
product_id INTEGER NOT NULL,
order_status BOOLEAN NOT NULL -- Whether order has been placed
) AUTO_INCREMENT = 10001;

INSERT INTO orders
VALUES (default, '2020-07-30 10:08:22', 'Jark', 50.50, 102, false),
      (default, '2020-07-30 10:11:09', 'Sally', 15.00, 105, false),
      (default, '2020-07-30 12:00:30', 'Edward', 25.25, 106, false);
```
#### **5.3.12 执行sql同步数据**

![](/blog/dianyue/bin.png)

进入到/opt/flink/bin路径下，执行如下命令进入sql管理后台：

```shell
./sql-client.sh
```

![](/blog/dianyue/sql_client.png)

然后在这个界面顺序执行上面准备的cdc任务的sql，首先执行：

```shell
Flink SQL> SET execution.checkpointing.interval = 3s;
```

开启checkpoint，然后在去顺序执行建表sql和关联insert的sql将数据同步到es的索引中，

mysql-cdc的insert的任务一直在执行中的：

![](/blog/dianyue/insert.png)

es中同步的数据如下：

![](/blog/dianyue/es.png)

在mysql的mydb的数据中执行新增、修改和删除的操作，数据都可以实时更新到es的索引中。

streampark端：

streampark点击开始启任务的时候不选择savepoint了，不然flink那边会报错的

![](/blog/dianyue/streampark.png)

flink端：

![](/blog/dianyue/flink.png)

需要容器一直运行中，如果重启后之前的savepoint和chackpoint就没了,这个感觉是flink的savepoint和checkpoint的配置没有生效，还得重新研究下，如果重启了，没有之前的任务了，需要在streampark启动下flink这边就又有了。
发现一个问题就是：刚才我重新提交了，但是flink的jobmanager的时候报了这个savepoin持久化到/tmp/flink-checkpoints-directory/文件中失败了，这个有点离谱了嘛:

```shell
2023-06-14 15:48:58 2023-06-14 07:48:58,551 WARN  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Error while processing AcknowledgeCheckpoint message
2023-06-14 15:48:58 org.apache.flink.runtime.checkpoint.CheckpointException: Could not finalize the pending checkpoint 3. Failure reason: Failure to finalize checkpoint.
2023-06-14 15:48:58     at org.apache.flink.runtime.checkpoint.CheckpointCoordinator.completePendingCheckpoint(CheckpointCoordinator.java:1227) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at org.apache.flink.runtime.checkpoint.CheckpointCoordinator.receiveAcknowledgeMessage(CheckpointCoordinator.java:1100) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at org.apache.flink.runtime.scheduler.ExecutionGraphHandler.lambda$acknowledgeCheckpoint$1(ExecutionGraphHandler.java:89) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at org.apache.flink.runtime.scheduler.ExecutionGraphHandler.lambda$processCheckpointCoordinatorMessage$3(ExecutionGraphHandler.java:119) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149) [?:1.8.0_322]
2023-06-14 15:48:58     at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624) [?:1.8.0_322]
2023-06-14 15:48:58     at java.lang.Thread.run(Thread.java:750) [?:1.8.0_322]
2023-06-14 15:48:58 Caused by: java.io.IOException: Mkdirs failed to create file:/tmp/flink-checkpoints-directory/acb95418d91e34f6cce478337154dd4f/chk-3
2023-06-14 15:48:58     at org.apache.flink.core.fs.local.LocalFileSystem.create(LocalFileSystem.java:262) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at org.apache.flink.runtime.state.filesystem.FsCheckpointMetadataOutputStream.<init>(FsCheckpointMetadataOutputStream.java:65) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at org.apache.flink.runtime.state.filesystem.FsCheckpointStorageLocation.createMetadataOutputStream(FsCheckpointStorageLocation.java:109) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at org.apache.flink.runtime.checkpoint.PendingCheckpoint.finalizeCheckpoint(PendingCheckpoint.java:323) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     at org.apache.flink.runtime.checkpoint.CheckpointCoordinator.completePendingCheckpoint(CheckpointCoordinator.java:1210) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:48:58     ... 6 more
2023-06-14 15:49:01 2023-06-14 07:49:01,533 INFO  org.apache.flink.runtime.checkpoint.CheckpointCoordinator   [] - Triggering checkpoint 4 (type=CHECKPOINT) @ 1686728941531 for job acb95418d91e34f6cce478337154dd4f.
2023-06-14 15:49:01 2023-06-14 07:49:01,557 WARN  org.apache.flink.runtime.jobmaster.JobMaster                 [] - Error while processing AcknowledgeCheckpoint message
2023-06-14 15:49:01 org.apache.flink.runtime.checkpoint.CheckpointException: Could not finalize the pending checkpoint 4. Failure reason: Failure to finalize checkpoint.
2023-06-14 15:49:01     at org.apache.flink.runtime.checkpoint.CheckpointCoordinator.completePendingCheckpoint(CheckpointCoordinator.java:1227) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:49:01     at org.apache.flink.runtime.checkpoint.CheckpointCoordinator.receiveAcknowledgeMessage(CheckpointCoordinator.java:1100) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:49:01     at org.apache.flink.runtime.scheduler.ExecutionGraphHandler.lambda$acknowledgeCheckpoint$1(ExecutionGraphHandler.java:89) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:49:01     at org.apache.flink.runtime.scheduler.ExecutionGraphHandler.lambda$processCheckpointCoordinatorMessage$3(ExecutionGraphHandler.java:119) ~[flink-dist_2.12-1.14.4.jar:1.14.4]
2023-06-14 15:49:01     at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149) [?:1.8.0_322]
2023-06-14 15:49:01     at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624) [?:1.8.0_322]
2023-06-14 15:49:01     at java.lang.Thread.run(Thread.java:750) [?:1.8.0_322]
2023-06-14 15:49:01 Caused by: java.io.IOException: Mkdirs failed to create file:/tmp/flink-checkpoints-directory/acb95418d91e34f6cce478337154dd4f/chk-4
```

然后我将我wsl的/tmp路径下的flink-checkpoints-directory、flink-savepoints-directory的权限重新修改下：

![](/blog/dianyue/permissions.png)

后面我又使用如下命令给两个文件夹下所有文件授权：

```shell
[root@DESKTOP-QF29H8K tmp]# chmod -R 777 flink-savepoints-directory/
[root@DESKTOP-QF29H8K tmp]# chmod -R 777 flink-checkpoints-directory/
```

上面两种授权都试了下，但是还是报错了，这个不晓得是不是一个bug，还是我的checkpoints、savepoints有配置的有问题，这个问题我已经反馈给官方了，估计在Linux上就没有这个问题了，在windows上确实是奇葩的问题太多了。
这个问题我知道是啥问题了，是挂载的问题，如果是linux系统是没有这个问题的，但是在windows上可以使用绝对路径和相当路径来挂载，那就跟wsl里面的文件路径没有关系了哈，然后修改部署文件docker-compose-windows.yaml 如下：

```shell
version: '2.1'
services:
  streampark-console:
    image: my_streampark:2.1.0
    command: ${RUN_COMMAND}
    ports:
      - 10000:10000
    env_file: .env
    volumes:
      - flink:/streampark/flink/${FLINK}
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/hosts:/etc/hosts:ro
      - ~/.kube:/root/.kube:ro
    privileged: true
    restart: unless-stopped
    
  jobmanager:
    image: apache/flink:1.14.4-scala_2.12-java8
    command: "jobmanager.sh start-foreground"
    ports:
      - 8081:8081
    volumes:
      - ./conf:/opt/flink/conf
      - ./tmp/flink-checkpoints-directory:/tmp/flink-checkpoints-directory
      - ./tmp/flink-savepoints-directory:/tmp/flink-savepoints-directory
    environment:
      - JOB_MANAGER_RPC_ADDRESS=jobmanager
  taskmanager:
    image: apache/flink:1.14.4-scala_2.12-java8
    depends_on:
      - jobmanager
    command: "taskmanager.sh start-foreground"
    volumes:
      - ./conf:/opt/flink/conf
      - ./tmp/flink-checkpoints-directory:/tmp/flink-checkpoints-directory
      - ./tmp/flink-savepoints-directory:/tmp/flink-savepoints-directory
    environment:
      - JOB_MANAGER_RPC_ADDRESS=jobmanager

volumes:
  flink:
```

重新在当前部署路径下执行部署命令：

```shell
docker-compose -f docker-compose-windows.yaml up -d
```

docker-compose 挂载目录

```shell
https://blog.csdn.net/SMILY12138/article/details/130305102
```

可以看出在当前的deplay先会自动创建一个tmp文件夹，里面会自动创建flink-checkpoints-directory、flink-savepoints-directory

![](/blog/dianyue/deplay.png)

然后上面那个错误就没有报了，就可以正常的创建写入文件到这个两个挂载的目录中了：

![](/blog/dianyue/mount_anthology.png)

这个挂载文集解决了之后，重新启动任务就会自动提示选择checkpoint了。
任务第一次启动的时候不设置savepoint，第一次就指定会找不到_meatedata报错，当停止任务的时候给一个savepoint的如下，然后重新启动就可以自动选择savepoint了：

![](/blog/dianyue/meatedata.png)

```shell
# savepoint的写法是
file:/tmp/flink-savepoints-directory
```

![](/blog/dianyue/savepoint.png)

停止执行savepoint的位置：

![](/blog/dianyue/stop_savepoint.png)

重启选择last-savepoint启动：

![](/blog/dianyue/last_savepoint.png)

由于Linux的/tmp下重启文件会被删除，所以我重新修改了docker-compose-windows.yaml 如下，这一版本也是最终的部署版本，windows环境下可以直接使用，Linux上稍微改下也是可以使用的：

```shell
version: '2.1'
services:
streampark-console:
  image: my_streampark:2.1.0
  command: ${RUN_COMMAND}
  ports:
    - 10000:10000
  env_file: .env
  volumes:
    - flink:/streampark/flink/${FLINK}
    - /var/run/docker.sock:/var/run/docker.sock
    - /etc/hosts:/etc/hosts:ro
    - ~/.kube:/root/.kube:ro
  privileged: true
  restart: unless-stopped
   
jobmanager:
  image: apache/flink:1.14.4-scala_2.12-java8
  command: "jobmanager.sh start-foreground"
  ports:
    - 8081:8081
  volumes:
    - ./webUpDir:/usr/local/flink/upload
    - ./webTepDir:/usr/local/flink/tmpdir
    - ./conf:/opt/flink/conf
    - ./tmp/flink-checkpoints-directory:/usr/local/flink/flink-checkpoints-directory
    - ./tmp/flink-savepoints-directory:/usr/local/flink/flink-savepoints-directory
  environment:
    - JOB_MANAGER_RPC_ADDRESS=jobmanager
taskmanager:
  image: apache/flink:1.14.4-scala_2.12-java8
  depends_on:
    - jobmanager
  command: "taskmanager.sh start-foreground"
  volumes:
    - ./webUpDir:/usr/local/flink/upload
    - ./webTepDir:/usr/local/flink/tmpdir
    - ./conf:/opt/flink/conf
    - ./tmp/flink-checkpoints-directory:/usr/local/flink/flink-checkpoints-directory
    - ./tmp/flink-savepoints-directory:/usr/local/flink/flink-savepoints-directory
  environment:
    - JOB_MANAGER_RPC_ADDRESS=jobmanager
    
volumes:
flink:
```

flink-conf.yaml新增两个配置：

```shell
jobmanager.rpc.address: jobmanager
blob.server.port: 6124
query.server.port: 6125

state.backend: filesystem
state.checkpoints.dir: file:///tmp/flink-checkpoints-directory
state.savepoints.dir: file:///tmp/flink-savepoints-directory

heartbeat.interval: 1000
heartbeat.timeout: 5000

rest.flamegraph.enabled: true
web.backpressure.refresh-interval: 10000

classloader.resolve-order: parent-first

taskmanager.memory.managed.fraction: 0.1 
taskmanager.memory.process.size: 2048m 

jobmanager.memory.process.size: 7072m
# 新增两个配置
web.upload.dir: /usr/local/flink/upload
web.tmpdir: /usr/local/flink/tmpdir
```

这两个配置用于配置flink的webui端上传或者临时文件做一个持久化（或者通过http的方式）提交任务的jar，streampark提交的cdc的任务会构架一个jar包然后调用flink的接口给flink上传一个jar包来执行这个任务，所以这个任务的包需要做一个持久化：
两参数的官方位置

```shell
https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/deployment/config/
```

![](/blog/dianyue/flink-docs.png)

Flink standalone集群问题记录

```shell
https://blog.csdn.net/LeoGanlin/article/details/124692129
```

![](/blog/dianyue/question.png)

webTepDir:

![](/blog/dianyue/webtepdir.png)

webUpDir:

![](/blog/dianyue/webupdir.png)

解决了savepoint和checkpoint的挂载问题和重启后flink的jar任务丢失，然后我们先停止三个容器，然后重新启动后，看flink里面的jar包任务还在的，streampark的界面的任务也是正常执行的，然后去验证cdc，去mysql客户端新增、修改和删除关联数据，在es中也是可以实时同步的；savepoint和checkpoint持久化可以使用fliesystem挂载到本机目录，或者是使用hdfs、oss、S3等等，官方都有文档说明的。

![](/blog/dianyue/run_tasks.png)

## **6. 资料**

```shell
链接:https://pan.baidu.com/s/1ajAAcjsMOxYR9-uQW0jzmw
提取码:c3nv
```

资料包内容：

![](/blog/dianyue/packet_content.png)

部署文件夹：

![](/blog/dianyue/deployment_folder.png)

## **7. streampark官方提供的最新的二进制试用包**

![](/blog/dianyue/trial_package.png)

试用版streampark二进制安装包:

```shell
apache-streampark 2.11: 链接:https://pan.baidu.com/s/1O_YSE-7Jqb4O2A3H9lHT3A 提取码：7cm6

apache-streampark 2.12: 链接:https://pan.baidu.com/s/1pRqMXP1PbZcgSJ5Dt1g68A 提取码：ce00
```

官方虽然给我们重新搞了两个二进制试用包，不推荐使用最新的包，因为有想不到的bug和踩不完的坑，尝鲜使用下也是可以的。

## **8. 总结**

到此我的分享就结束了，在实践的过程中也遇到了很多的问题，同时在解决问题的过程中也有很多的收获，也结识了一些大佬，在和大佬交流的过程中也得到了一些启发和学到了一些东西，希望我的分享能给你带来帮助.

