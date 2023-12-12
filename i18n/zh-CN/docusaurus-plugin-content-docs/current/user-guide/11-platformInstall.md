# 引言
## 目的和范围
> 本文档旨在帮助用户完成 Apache StreamPark 的安装和初步配置

## 目标受众
> 面向需要在其系统中部署 Apache StreamPark 的系统开发和运维人员

# 系统要求
> 参考：[https://streampark.apache.org/docs/user-guide/deployment#environmental-requirements](https://streampark.apache.org/docs/user-guide/deployment#environmental-requirements)

## 硬件要求
> - 本文档使用Linux：3.10.0-957.el7.x86_6

![1_hardware_requirement](/doc/image/install/1_hardware_requirement.png)
## 软件要求
Notes:  

1. **单纯安装StreamPark，可忽略hadoop**
2. 若采用 yarn application 模式 执行flink作业，需要hadoop
> - JDK : 1.8+                            
> - MySQL : 5.6+                      
> - Flink : 1.12.0+                    
> - Hadoop : 2.7.0+                 
> - StreamPark :  2.0.0+            

本文档采用的软件版本信息
> - **JDK：1.8.0_181**
> - **MySQL: 5.7.26**
> - **Flink :  1.14.3-scala_2.12**
> - **Hadoop : 3.2.1**

主要组件依赖关系:
![2_main_components_dep](/doc/image/install/2_main_components_dep.png)
# 安装前准备
> JDK、MYSQL、HADOOP需用户自行查阅资料安装。

## 下载&&配置flink
> 下载flink

```bash
cd /usr/local
wget https://archive.apache.org/dist/flink/flink-1.14.3/flink-1.14.3-bin-scala_2.12.tgz
```
> 解压

```bash
tar -zxvf flink-1.14.3-bin-scala_2.12.tgz
```
> 重命名

```bash
mv flink-1.14.3 flink
```

> 配置flink环境变量

```bash
# 配置环境变量(vim ~/.bashrc)，加入以下内容
export FLINK_HOME=/usr/local/flink
export PATH=$FLINK_HOME/bin:$PATH

# 生效环境变量配置
source ~/.bashrc 

# 测试(出现:'Version: 1.14.3, Commit ID: 98997ea',则说明配置成功)
flink -v

```
![3_flink_home](/doc/image/install/3_flink_home.png)
## 引入MySQL依赖包
> 原因：**由于Apache 2.0许可与Mysql Jdbc驱动许可的不兼容，用户需要自行下载驱动jar包并放在 $STREAMPARK_HOME/lib 中,推荐使用8.x版本。**
> 驱动包版本：mysql-connector-java-8.0.28.jar

```bash
cp mysql-connector-java-8.0.28.jar /usr/local/streampark/lib
```
![4_mysql_dep](/doc/image/install/4_mysql_dep.png)
## 下载StreamPark
> 下载URL:[https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz](https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz)

> 上传 [apache-streampark_2.12-2.0.0-incubating-bin.tar.gz](https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz) 至 服务器 /usr/local 路径

![5_streampark_install_pkg](/doc/image/install/5_streampark_install_pkg.png)
> 解压

```bash
tar -zxvf apache-streampark_2.12-2.0.0-incubating-bin.tar.gz
```
![6_unpkg](/doc/image/install/6_unpkg.png)

# 安装
## 初始化系统数据
> **目的：创建StreamPark组件部署依赖的数据库(表)，同时将其运行需要的数据提前初始化(比如：web页面的菜单、用户等信息)，便于后续操作。**

### 查看执行SteamPark元数据SQL文件
> 说明：
> - StreamPark支持MySQL、PostgreSQL、H2
> - 本次以MySQL为例，PostgreSQL流程基本一致

> 数据库创建脚本： /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/schema/mysql-schema.sql

![7_mysql_schema_file](/doc/image/install/7_mysql_schema_file.png)
> 数据库创建脚本： /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/data/mysql-data.sql

![8_mysql_data_file](/doc/image/install/8_mysql_data_file.png)


### 连接MySQL数据库 && 执行初始化脚本
```bash
source /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/schema/mysql-schema.sql
```
![9_import_streampark_schema_file](/doc/image/install/9_import_streampark_schema_file.png)
```bash
source source /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/data/mysql-data.sql
```
![10_import_streampark_data_file](/doc/image/install/10_import_streampark_data_file.png)
```bash
source source /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/data/mysql-data.sql
```
![10_import_streampark_data_file](/doc/image/install/10_import_streampark_data_file.png)

### 查看执行结果
```bash
show databases;
```
![11_show_streampark_database](/doc/image/install/11_show_streampark_database.png)
```bash
use streampark;
```
![12_use_streampark_db](/doc/image/install/12_use_streampark_db.png)
```bash
show tables; 
```
![13_show_streampark_db_tables](/doc/image/install/13_show_streampark_db_tables.png)

## StreamPark配置
> 目的：配置启动需要的数据源。
> 配置文件所在路径：/usr/local/streampark/conf

![14_streampark_conf_files](/doc/image/install/14_streampark_conf_files.png)
### 配置mysql数据源
```bash
vim application-mysql.yml
```
> **username、password、url中的数据库IP/端口号  需要改成用户自己环境的信息**

```bash
spring:
  datasource:
    username: 数据库用户名
    password: 数据库用户密码
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://数据库IP地址:数据库端口号/streampark?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
```
### 配置应用端口、hdfs存储、应用访问密码等
```bash
vim application.yml
```
> **主要的配置项：**
> 1. **server.port     # 【重要】默认的web访问端口号10000，如果有冲突(如: hive服务)可以更改**
> 2. knife4j.basic.enable    #  true表示允许访问页面 Swagger API
> 3. knife4j.basic.password    #  访问页面 Swagger API 时需要密码，这样可以提高接口安全性  
> 4. **spring.profiles.activemysql  # 【重要】表示系统采用何种数据源，本文档采用mysql **
> 5. **workspace.remote # 配置工作空间信息**
> 6. **hadoop-user-name # 如果使用hadoop，该处用户需要保证有操作hdfs的权限，否则会报“org.apache.hadoop.security.AccessControlException: Permission denied”异常**
> 7. ldap.password # 系统登陆页面提供了2种登录模式： 用户密码 和 ldap。这里可以配置ldap密码

> 主要配置示例：

![15_application_yml_server_port](/doc/image/install/15_application_yml_server_port.png)
> 上传flink job jar 如果过大，可能会导致上传失败，因此可以考虑修改(max-file-size和max-request-size)这两个参数；当然，实际环境还要考虑其他因素：nginx限制等。

![16_application_yml_spring_profile_active](/doc/image/install/16_application_yml_spring_profile_active.png)
> 支持knox配置，有些用户环境私有部署hadoop，可通过knox访问yarn web
> workspace: 配置工作空间信息(比如：savepoint和checkpoint存储路径等)

![17_application_yml_streampark_workspace](/doc/image/install/17_application_yml_streampark_workspace.png)
> ldap

![18_application_yml_ldap](/doc/image/install/18_application_yml_ldap.png)

### 【可选】配置kerberos
> 背景：企业级hadoop集群环境都有设置安全访问机制，比如kerberos。StreamPark也可配置kerberos，使得flink可通过kerberos认证，向hadoop集群提交作业。

> **修改项如下:**
> 1. **security.kerberos.login.enable=true**
> 2. **security.kerberos.login.principal=实际的principal**
> 3. **security.kerberos.login.krb5=/etc/krb5.conf**
> 4. **security.kerberos.login.keytab=实际的keytab文件**
> 5. **java.security.krb5.conf=/etc/krb5.conf**

![19_kerberos_yml_config](/doc/image/install/19_kerberos_yml_config.png)
## 启动StreamPark
## 进入服务器StreamPark安装路径
```bash
cd /usr/local/streampark/
```
![20_enter_streampark_dir](/doc/image/install/20_enter_streampark_dir.png)
## 启动StreamPark服务
```bash
./bin/startup.sh
```
![21_start_streampark_service](/doc/image/install/21_start_streampark_service.png)
> 查看启动日志
> 目的：确认无报错信息

```bash
tail -100f log/streampark.out
```
![22_check_service_starting_log](/doc/image/install/22_check_service_starting_log.png)
# 验证安装
```bash
# 页面正常打开，则说明部署成功。
http://部署streampark服务IP或域名:10000/
admin/streampark
```
## 页面正常访问
![23_visit_streampark_web](/doc/image/install/23_visit_streampark_web.png)
## 系统正常登录
![24_streampark_web_index_page](/doc/image/install/24_streampark_web_index_page.png)
## 

# 常见问题
## Cannot load driver class: com.mysql.cj.jdbc.Driver
> 原因：缺少mysql驱动包，参见 “3.2. 引入MySQL依赖包”

![25_lack_mysql_driver_err](/doc/image/install/25_lack_mysql_driver_err.png)
# 参考资源
> [https://streampark.apache.org/docs/user-guide/deployment/](https://streampark.apache.org/docs/user-guide/deployment/)

