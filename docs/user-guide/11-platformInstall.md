# Introduction
## Purpose and Scope
> This document aims to assist users in installing and initially configuring Apache StreamPark.

## Target Audience
> Intended for system developers and operators who need to deploy Apache StreamPark in their systems.

# System Requirements
> Reference: [https://streampark.apache.org/docs/user-guide/deployment#environmental-requirements](https://streampark.apache.org/docs/user-guide/deployment#environmental-requirements)

## Hardware Requirements
> - This document uses Linux: 3.10.0-957.el7.x86_6

![1_hardware_requirement](/doc/image/install/1_hardware_requirement.png)
## Software Requirements
Notes:  

1. **For installing StreamPark alone, Hadoop can be ignored.**
2. If using yarn application mode for executing Flink jobs, Hadoop is required.
> - JDK : 1.8+                            
> - MySQL : 5.6+                      
> - Flink : 1.12.0+                    
> - Hadoop : 2.7.0+                 
> - StreamPark :  2.0.0+            

Software versions used in this document:
> - **JDK: 1.8.0_181**
> - **MySQL: 5.7.26**
> - **Flink :  1.14.3-scala_2.12**
> - **Hadoop : 3.2.1**

Main component dependencies:
![2_main_components_dep](/doc/image/install/2_main_components_dep.png)
# Pre-installation Preparation
> JDK, MYSQL, HADOOP need to be installed by users themselves.

## Download & Configure Flink
> Download Flink

```bash
cd /usr/local
wget https://archive.apache.org/dist/flink/flink-1.14.3/flink-1.14.3-bin-scala_2.12.tgz
```
> Unzip

```bash
tar -zxvf flink-1.14.3-bin-scala_2.12.tgz
```
> Rename

```bash
mv flink-1.14.3 flink
```

> Configure Flink environment variables

```bash
# Set environment variables (vim ~/.bashrc), add the following content
export FLINK_HOME=/usr/local/flink
export PATH=$FLINK_HOME/bin:$PATH

# Apply environment variable configuration
source ~/.bashrc 

# Test (If it shows: 'Version: 1.14.3, Commit ID: 98997ea', it means configuration is successful)
flink -v

```
![3_flink_home](/doc/image/install/3_flink_home.png)
## Introduce MySQL Dependency Package
> Reason: **Due to incompatibility between Apache 2.0 license and Mysql Jdbc driver license, users need to download the driver jar package themselves and place it in $STREAMPARK_HOME/lib, 8.x version recommended.**
> Driver package version: mysql-connector-java-8.0.28.jar

```bash
cp mysql-connector-java-8.0.28.jar /usr/local/streampark/lib
```
![4_mysql_dep](/doc/image/install/4_mysql_dep.png)
## Download StreamPark
> Download URL: [https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz](https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz)

> Upload [apache-streampark_2.12-2.0.0-incubating-bin.tar.gz](https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz) to the server /usr/local path

![5_streampark_install_pkg](/doc/image/install/5_streampark_install_pkg.png)
> Unzip

```bash
tar -zxvf apache-streampark_2.12-2.0.0-incubating-bin.tar.gz
```
![6_unpkg](/doc/image/install/6_unpkg.png)

# Installation
## Initialize System Data
> **Purpose: Create databases (tables) dependent on StreamPark component deployment, and pre-initialize the data required for its operation (e.g., web page menus, user information), to facilitate subsequent operations.**

### View Execution of SteamPark Metadata SQL File
> Explanation:
> - StreamPark supports MySQL, PostgreSQL, H2
> - This document uses MySQL as an example; the PostgreSQL process is basically the same

> Database creation script: /usr/local/apache-st

reampark_2.12-2.0.0-incubating-bin/script/schema/mysql-schema.sql

![7_mysql_schema_file](/doc/image/install/7_mysql_schema_file.png)
> Database creation script: /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/data/mysql-data.sql

![8_mysql_data_file](/doc/image/install/8_mysql_data_file.png)


### Connect to MySQL Database & Execute Initialization Script
```bash
source /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/schema/mysql-schema.sql
```
![9_import_streampark_schema_file](/doc/image/install/9_import_streampark_schema_file.png)
```bash
source source /usr/local/apache-streampark_2.12-2.0.0-incubating-bin/script/data/mysql-data.sql
```
![10_import_streampark_data_file](/doc/image/install/10_import_streampark_data_file.png)

### View Execution Results
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

## StreamPark Configuration
> Purpose: Configure the data sources needed for startup.
> Configuration file location: /usr/local/streampark/conf

![14_streampark_conf_files](/doc/image/install/14_streampark_conf_files.png)
### Configure MySQL Data Source
```bash
vim application-mysql.yml
```
> **The database IP/port in username, password, url need to be changed to the user's own environment information**

```bash
spring:
  datasource:
    username: Database username
    password: Database user password
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://Database IP address:Database port number/streampark?useSSL=false&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8
```
### Configure Application Port, HDFS Storage, Application Access Password, etc.
```bash
vim application.yml
```
> **Key configuration items:**
> 1. **server.port     # 【Important】Default web access port 10000, can be changed if there is a conflict (e.g., hive service)**
> 2. knife4j.basic.enable    #  true means allowing access to Swagger API page
> 3. knife4j.basic.password    #  Password required for accessing Swagger API page, enhancing interface security
> 4. **spring.profiles.activemysql  # 【Important】Indicates which data source the system uses, this document uses mysql **
> 5. **workspace.remote # Configure workspace information**
> 6. **hadoop-user-name # If using hadoop, this user needs to have permission to operate hdfs, otherwise an “org.apache.hadoop.security.AccessControlException: Permission denied” exception will be reported**
> 7. ldap.password # The system login page offers two login modes: User password and ldap. Here you can configure ldap password

> Main configuration example:

![15_application_yml_server_port](/doc/image/install/15_application_yml_server_port.png)
> If the flink job jar is too large, it may fail to upload, so consider modifying (max-file-size and max-request-size); of course, other factors in the actual environment should be considered: nginx restrictions, etc.

![16_application_yml_spring_profile_active](/doc/image/install/16_application_yml_spring_profile_active.png)
> Supports Knox configuration, some users have privately deployed Hadoop environments, accessible through Knox
> workspace: Configure workspace information (e.g., savepoint and checkpoint storage paths)

![17_application_yml_streampark_workspace](/doc/image/install/17_application_yml_streampark_workspace.png)
> ldap

![18_application_yml_ldap](/doc/image/install/18_application_yml_ldap.png)

### 【Optional】Configuring Kerberos
> Background: Enterprise-level Hadoop cluster environments have set security access mechanisms, such as Kerberos. StreamPark can also be configured with Kerberos, allowing Flink to authenticate through Kerberos and submit jobs to the Hadoop cluster.

> **Modifications are as follows:**
> 1. **security.kerberos.login.enable=true**
> 2. **security.kerberos.login.principal=Actual principal**
> 3. **security.kerberos.login.krb5=/etc/krb5.conf**
> 4. **security.kerberos.login.keytab=Actual keytab file**
> 5. **java.security.krb5.conf=/etc/krb5.conf**

![19_kerberos_yml_config](/doc/image/install/19_kerberos_yml_config.png)
## Starting StreamPark
## Enter the StreamPark Installation Path on the Server
```bash
cd /usr/local/streampark/
```
![20_enter_streampark_dir](/doc/image/install/20_enter_streampark_dir.png)
## Start the StreamPark Service
```bash
./bin/startup.sh
```
![21_start_streampark_service](/doc/image/install/21_start_streampark_service.png)
> Check the startup logs
> Purpose: To confirm there are no error messages

```bash
tail -100f log/streampark.out
```
![22_check_service_starting_log](/doc/image/install/22_check_service_starting_log.png)
# Verifying the Installation
```bash
# If the page opens normally, it indicates a successful deployment.
http://Deployed streampark service IP or domain:10000/
admin/streampark
```
## Normal Access to the Page
![23_visit_streampark_web](/doc/image/install/23_visit_streampark_web.png)
## System Logs in Normally
![24_streampark_web_index_page](/doc/image/install/24_streampark_web_index_page.png)
## 

# Common Issues
## Cannot load driver class: com.mysql.cj.jdbc.Driver
> Reason: Missing MySQL driver package, refer to “3.2. Introducing MySQL Dependency Package”

![25_lack_mysql_driver_err](/doc/image/install/25_lack_mysql_driver_err.png)
# Reference Resources
> [https://streampark.apache.org/docs/user-guide/deployment/](https://streampark.apache.org/docs/user-guide/deployment/)

