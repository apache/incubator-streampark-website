---
id: 'deployment'
title: 'Platform deployment'
sidebar_position: 1
---

import { ClientEnvs } from '../components/TableData.jsx';

The overall component stack structure of StreamPark is as follows. It consists of two major parts: streampark-core and streampark-console. streampark-console is a very important module, positioned as a **integrated real-time data platform**, ** streaming data warehouse Platform**, **Low Code**, **Flink & Spark task hosting platform**, can better manage Flink tasks, integrate project compilation, publishing, parameter configuration, startup, savepoint, flame graph ( flame graph ), Flink SQL, monitoring and many other functions are integrated into one, which greatly simplifies the daily operation and maintenance of Flink tasks and integrates many best practices. Its ultimate goal is to create a one-stop big data solution that integrates real-time data warehouses and batches

![StreamPark Archite](/doc/image/streampark_archite.png)

streampark-console provides an out-of-the-box installation package. Before installation, there are some requirements for the environment. The specific requirements are as follows:

## Environmental requirements

<ClientEnvs></ClientEnvs>

:::tip Notice
The versions before (including) StreamPark 1.2.2 only support `scala 2.11`. Do not check the corresponding `scala` version when using `flink`
Versions after (including) 1.2.3, support both `scala 2.11` and `scala 2.12` versions
:::


At present, StreamPark has released tasks for Flink, and supports both `Flink on YARN` and `Flink on Kubernetes` modes.

### Hadoop
To use `Flink on YARN`, you need to install and configure Hadoop-related environment variables in the deployed cluster. For example, if you installed the hadoop environment based on CDH,
Related environment variables can refer to the following configuration:

```shell
export HADOOP_HOME=/opt/cloudera/parcels/CDH/lib/hadoop #hadoop installation manual
export HADOOP_CONF_DIR=/etc/hadoop/conf
export HIVE_HOME=$HADOOP_HOME/../hive
export HBASE_HOME=$HADOOP_HOME/../hbase
export HADOOP_HDFS_HOME=$HADOOP_HOME/../hadoop-hdfs
export HADOOP_MAPRED_HOME=$HADOOP_HOME/../hadoop-mapreduce
export HADOOP_YARN_HOME=$HADOOP_HOME/../hadoop-yarn
```

### Kubernetes

Using `Flink on Kubernetes` requires additional deployment/or use of an existing Kubernetes cluster, please refer to the entry: [**StreamPark Flink-K8s Integration Support**](../flink-k8s/1-deployment.md).

## Build & Deploy

You can directly download the compiled [**release package**](https://github.com/apache/streampark/releases) (recommended), or you can choose to manually compile and install. The manual compilation and installation steps are as follows:


### Environmental requirements

- Maven 3.6+
- npm 7.11.2 ( https://nodejs.org/en/ )
- pnpm (npm install -g pnpm)
- JDK 1.8+

### Compile and package


#### Automatic packaging

Starting from StreamPark 1.2.3+, an automatic compilation script `build.sh` is provided. Execute and run the script and select the next step as required to complete the compilation. If the version before StreamPark 1.2.3 can be skipped, see directly Manually package some documents
<video src="http://assets.streamxhub.com/streamx-build.mp4" controls="controls" width="100%" height="100%"></video>

```shell

./build.sh

```

#### Manual packaging

From 1.2.1 and later versions, StreamPark supports **mixed packaging** and **independent packaging** two modes for users to choose. If you manually package and deploy, you need to pay attention to the specific operations of each packaging method:

##### mixed packaging

```bash
git clone git@github.com:apache/incubator-streampark.git streampark
cd streampark
mvn clean install -DskipTests -Dscala.version=2.11.12 -Dscala.binary.version=2.11 -Pwebapp
```

:::danger special attention
<span style={{color:'red'}}>**-Pwebapp**</span> This parameter is required in front-end and back-end mixed packaging mode
:::

##### Independent packaging

###### 1. Backend compilation

```bash
git clone git@github.com:apache/incubator-streampark.git streampark
cd streampark
mvn clean install -Dscala.version=2.12.8 -Dscala.binary.version=2.12
```

###### 2. Front-end packaging

- 2.1 Modify base api

In a project where the front-end and back-end are independently compiled and deployed, the front-end project needs to know the base api of the back-end service so that the front-end and back-end can work together. Therefore, before compiling, we need to specify the base api of the back-end service and modify streampark-console-webapp/. `VUE_APP_BASE_API` in env.production can

```bash
vi streampark/streampark-console/streampark-console-webapp/.env.production
```

- 2.2 Compile

```bash
git clone git@github.com:apache/incubator-streampark.git streampark
cd streampark/streampark-console/streampark-console-webapp
npm install
npm run build
```

:::danger pay attention

Pay attention to the parameters carried when each different version is compiled,
In versions after StreamPark 1.2.3 (included), the `-Dscala.version` and `-Dscala.binary.version` parameters are required

Scala 2.11 is compiled, and the relevant scala version specification information is as follows:
```
-Dscala.version=2.11.12 -Dscala.binary.version=2.11
```
Scala 2.12 is compiled, and the relevant scala version specification information is as follows:
```
-Dscala.version=2.12.7 -Dscala.binary.version=2.12
```

:::


### Deploy backend

After the installation is complete, you will see the final project file, located in `streampark/streampark-console/streampark-console-service/target/streampark-console-service-${version}-bin.tar.gz`, the installation directory after unpacking as follows

```textmate
.
streampark-console-service-1.2.1
├── bin
│    ├── flame-graph
│    ├──   └── *.py                           //Flame graph related function script (internal use, users do not need to pay attention)
│    ├── startup.sh                           //startup script
│    ├── setclasspath.sh                      //Scripts related to java environment variables (internal use, users do not need to pay attention)
│    ├── shutdown.sh                          //stop script
│    ├── yaml.sh                              //Internally uses a script that parses yaml parameters (for internal use, users don't need to pay attention)
├── conf
│    ├── application.yaml                     //Project configuration file (be careful not to change the name)
│    ├── flink-application.template           //flink configuration template (for internal use, users don't need to pay attention)
│    ├── logback-spring.xml                   //logback
│    └── ...
├── lib
│    └── *.jar                                //Project jar package
├── plugins
│    ├── streampark-jvm-profiler-1.0.0.jar       //jvm-profiler, flame graph related functions (internal use, users do not need to pay attention)
│    └── streampark-flink-sqlclient-1.0.0.jar    //Flink SQl submit related functions (for internal use, users do not need to pay attention)
├── script
│     ├── schema                               // Complete ddl build table sql
│     ├── data                               // The data sql of tables
│     ├── upgrade                             // The sql of the upgrade part of each version (only the sql changes from the previous version to this version are recorded)
├── logs                                      //program log directory

├── temp                                      //Temporary path used internally, do not delete
```

##### Initialize table structure

In the installation process of versions before 1.2.1, there is no need to manually initialize data, just set the database information, and some column operations such as table creation and data initialization will be automatically completed. Versions after 1.2.1 (included) are not included. Automatic table creation and upgrade requires the user to manually execute ddl for initialization. The ddl description is as follows:

```textmate
├── script
│     ├── schema                               // Complete ddl build table sql
│     ├── data                               // The data sql of tables
│     ├── upgrade                             // The sql of the upgrade part of each version (only the sql changes from the previous version to this version are recorded)
```

Execute the sql files that in `schema` folder to initialize the table structure

##### Initialize table data

In the installation process of versions before 1.2.1, there is no need to manually initialize data, just set the database information, and some column operations such as table creation and data initialization will be automatically completed. Versions after 1.2.1 (included) are not included. Automatic table creation and upgrade requires the user to manually execute ddl for initialization. The ddl description is as follows:

```textmate
├── script
│     ├── schema                               // Complete ddl build table sql
│     ├── data                               // The data sql of tables
│     ├── upgrade                             // The sql of the upgrade part of each version (only the sql changes from the previous version to this version are recorded)
```

Use the `root` user of the mysql service to perform the following sql statements.

```sql
create database if not exists `streampark` character set utf8mb4 collate utf8mb4_general_ci;
create user 'streampark'@'%' IDENTIFIED WITH mysql_native_password by 'streampark';
grant ALL PRIVILEGES ON streampark.* to 'streampark'@'%';
flush privileges;
```

The `streampark` user can then execute sql file's content in the `schema` and `data` folders in turn to create the table and initialize the table data.

##### Modify the configuration
The installation and unpacking have been completed, and the next step is to prepare the data-related work

###### Create a new database `streampark`
Make sure to create a new database `streampark` in mysql that the deployment machine can connect to

###### Modify connection information
Go to `conf`, modify `conf/application.yml`, find the spring item, find the profiles.active configuration, and modify it to the corresponding information, as follows

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

After modify `conf/application.yml`, then modify the `config/application-mysql.yml` to change the config information of database as follows:

**Tips: Because of license incompatibility between Apache project and mysql jdbc driver, so you should download mysql jdbc driver by yourself and put it in $STREAMPARK_HOME/lib**

```yaml
spring:
  datasource:
    username: root
    password: xxxx
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/streampark?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
```

###### Modify workspace
Go to `conf`, modify `conf/application.yml`, find the item streampark, find the workspace configuration, and change it to a directory that the user has permission to.

```yaml
streampark:
  # HADOOP_USER_NAME If it is on yarn mode ( yarn-prejob | yarn-application | yarn-session), you need to configure hadoop-user-name
  hadoop-user-name: hdfs
  # Local workspace, used to store project source code, build directory, etc.
  workspace:
    local: /opt/streampark_workspace # A local workspace directory (very important), users can change the directory by themselves, it is recommended to put it in other places separately to store the project source code, the built directory, etc.
    remote: hdfs:///streampark   # support hdfs:///streampark/ 、 /streampark 、hdfs://host:ip/streampark/
```

##### Start the backend

Enter `bin` and directly execute startup.sh to start the project. The default port is **10000**, if there is no accident, it will start successfully

```bash
cd streampark-console-service-1.0.0/bin
bash startup.sh
```
Relevant logs will be output to **streampark-console-service-1.0.0/logs/streampark.out**

:::info hint

Front-end and back-end mixed packaging mode, only start the back-end service to complete all the deployment, open the browser and enter **http://$host:10000** to log in

:::

### Deploy frontend

##### Environmental preparation

Install nodejs and pm2 globally
```
yum install -y nodejs
npm install -g pm2
```

##### Release

###### 1. Copy the dist to the deployment server
Copy the entire directory of streampark-console-webapp/dist to the deployment directory of the server, such as: `/home/www/streampark`, the copied directory level is /home/www/streampark/dist

###### 2. Copy the streampark.js file to the project deployment directory
Copy streampark/streampark-console/streampark-console-webapp/streampark.js to `/home/www/streampark`

###### 3. Modify the service port
Users can specify the port address of the front-end service by themselves, modify the /home/www/streampark/streampark.js file, and find `serverPort` to modify, the default is as follows:

```
  const serverPort = 1000
```

4. Start the service

```shell
   pm2 start streampark.js
```

For more information about pm2, please refer to [Official Website](https://pm2.keymetrics.io/)

### log in system

After the above steps, even if the deployment is completed, you can directly log in to the system

![StreamPark Login](/doc/image/streampark_login.jpeg)

:::tip hint
Default password: <strong> admin / streampark </strong>
:::

## System Configuration

After entering the system, the first thing to do is to modify the system configuration. Under the menu/StreamPark/Setting, the operation interface is as follows:

![StreamPark Settings](/doc/image/streampark_settings.png)

The main configuration items are divided into the following categories

<div class="counter">

-   Flink Home
-   Maven Home
-   StreamPark Env
-   Email

</div>

### Flink Home
The global Flink Home is configured here. This is the only place in the system to specify the Flink environment, which will apply to all jobs.

:::info hint
Special Note: The minimum supported Flink version is 1.12.0, and later versions are supported
:::

### Maven Home

Specify maven Home, currently not supported, the next version will be implemented

### StreamPark Env

- StreamPark Webapp address
  The web url access address of the StreamPark Console is configured here. The main flame graph function will be used. The specific task will send http requests to the system through the url exposed here for collection and display.
- StreamPark Console Workspace
  The workspace of the configuration system is used to store the source code of the project, the compiled project, etc. (this configuration is the configuration item in the version before 1.2.0)

### Email

The configuration related to Alert Email is to configure the information of the sender's email. For the specific configuration, please refer to the relevant mailbox information and documents for configuration.
