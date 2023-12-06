# 引言
## 目的和范围
> 本文档旨在帮助用户完成 Apache StreamPark 的安装和初步配置

## 目标受众
> 面向需要在其系统中部署 Apache StreamPark 的系统开发和运维人员

# 系统要求
> 参考：[https://streampark.apache.org/docs/user-guide/deployment#environmental-requirements](https://streampark.apache.org/docs/user-guide/deployment#environmental-requirements)

## 硬件要求
> - 本文档使用Linux：3.10.0-957.el7.x86_6

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701847345981-b334422d-c586-49f3-942f-c89c6ddfa31f.png#averageHue=%230d0b09&clientId=u3a889b5e-b613-4&from=paste&height=78&id=ud32c949d&originHeight=78&originWidth=1226&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15221&status=done&style=none&taskId=u93a7dfab-31db-4b67-bfa8-d37c8cd1eb8&title=&width=1226)
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
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701849420088-78304d4d-60bd-47da-9838-410416ce3ff5.png#averageHue=%23fff9f9&clientId=u3a889b5e-b613-4&from=paste&height=425&id=Y5YGI&originHeight=425&originWidth=931&originalType=binary&ratio=1&rotation=0&showTitle=false&size=37915&status=done&style=none&taskId=ud0bb957d-3fa0-4558-9657-594bb8bfa21&title=&width=931)
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
# 【可选】删除源文件
rm -rf flink-1.14.3-bin-scala_2.12.tgz
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
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701852697827-ee94ef62-7825-4c63-8acd-81b930bf73dc.png#averageHue=%230c0908&clientId=u3a889b5e-b613-4&from=paste&height=376&id=uad6111ab&originHeight=376&originWidth=824&originalType=binary&ratio=1&rotation=0&showTitle=false&size=46534&status=done&style=none&taskId=u586190aa-0183-46b0-8c76-2f3bc8ed53e&title=&width=824)
## 引入MySQL依赖包
> 原因：**由于Apache 2.0许可与Mysql Jdbc驱动许可的不兼容，用户需要自行下载驱动jar包并放在 $STREAMPARK_HOME/lib 中,推荐使用8.x版本。**
> 驱动包版本：mysql-connector-java-8.0.28.jar

```bash
cp mysql-connector-java-8.0.28.jar /usr/local/streampark/lib
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701860095791-20d3af92-a2ad-4314-ba2d-6908d5c24d80.png#averageHue=%23130a08&clientId=u3a889b5e-b613-4&from=paste&height=116&id=u2ec05ca2&originHeight=128&originWidth=999&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15811&status=done&style=none&taskId=u7e54a2d0-1a2d-4248-b9f8-0ad1fd725e7&title=&width=908.1817984975078)
## 下载StreamPark
> 下载URL:[https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz](https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz)

> 上传 [apache-streampark_2.12-2.0.0-incubating-bin.tar.gz](https://dlcdn.apache.org/incubator/streampark/2.0.0/apache-streampark_2.12-2.0.0-incubating-bin.tar.gz) 至 服务器 /usr/local 路径

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701852976267-70920b37-a72c-463b-9d0e-b52996530129.png#averageHue=%230c0706&clientId=u3a889b5e-b613-4&from=paste&height=402&id=ucec692ee&originHeight=402&originWidth=1200&originalType=binary&ratio=1&rotation=0&showTitle=false&size=55901&status=done&style=none&taskId=ua66a79ca-5515-48ab-8abe-1bd03f2e5ca&title=&width=1200)
> 解压

```bash
tar -zxvf apache-streampark_2.12-2.0.0-incubating-bin.tar.gz
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701853003079-78ebbdf8-b7d7-4d5d-88af-f55bbafa1e4c.png#averageHue=%230d0807&clientId=u3a889b5e-b613-4&from=paste&height=97&id=ud99c63dc&originHeight=97&originWidth=1155&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16409&status=done&style=none&taskId=u2a6a3b3f-70e4-4fa9-95f1-9c2a96918b1&title=&width=1155)
> 删除源文件

```bash
rm -rf apache-streampark_2.12-2.0.0-incubating-bin.tar.gz
```
> 重命名

```bash
mv apache-streampark_2.12-2.0.0-incubating-bin/ streampark
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701853082974-a1f40c24-a5c9-4ecd-b867-ebfdeba4cbb1.png#averageHue=%230a0807&clientId=u3a889b5e-b613-4&from=paste&height=374&id=ue28f669e&originHeight=374&originWidth=1004&originalType=binary&ratio=1&rotation=0&showTitle=false&size=51062&status=done&style=none&taskId=ub4ddf3d1-a9ce-4bff-8b83-09a1d80df85&title=&width=1004)
# 安装
## 初始化系统数据
> **目的：创建StreamPark组件部署依赖的数据库(表)，同时将其运行需要的数据提前初始化(比如：web页面的菜单、用户等信息)，便于后续操作。**

### 查看执行SteamPark元数据SQL文件
> 说明：
> - StreamPark支持MySQL、PostgreSQL、H2
> - 本次以MySQL为例，PostgreSQL流程基本一致

> 数据库创建脚本： /usr/local/streampark/script/schema/mysql-schema.sql

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701854227323-af0726dc-8c4e-4dc4-84db-41440115807a.png#averageHue=%23110c0a&clientId=u3a889b5e-b613-4&from=paste&height=132&id=wp8pI&originHeight=145&originWidth=689&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16822&status=done&style=none&taskId=u0cf64780-5f39-42b3-8b70-660970e4e8e&title=&width=626.3636227875704)
> 数据库创建脚本： /usr/local/streampark/script/data/mysql-data.sql

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701854251844-193d0a03-a141-4d3e-9970-f0d0fd0351c8.png#averageHue=%23120d0b&clientId=u3a889b5e-b613-4&from=paste&height=131&id=qArlf&originHeight=144&originWidth=662&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15282&status=done&style=none&taskId=uae9efa05-df2e-4fd9-94d4-3f5da3afc36&title=&width=601.8181687741243)
> 建议：将 mysql-schema.sql、mysql-data.sql 两个文件下载到本地，便于后续直接导入执行。

### 连接MySQL数据库
> 这里使用Workbench工具，当然大家也可以选用其他的，如：Navicat等

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701853620689-01029434-2f4e-450c-8768-48328dc6db34.png#averageHue=%23385063&clientId=u3a889b5e-b613-4&from=paste&height=736&id=UEjwg&originHeight=736&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=61113&status=done&style=none&taskId=u7271f7b8-deb8-48b6-a984-2fa55adb40d&title=&width=1366)
### 导入待执行SQL脚本
> 菜单位置：File ----> Open SQL Script ...

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701854893603-c403b1e7-5ec7-4544-b4dc-002a61ab7d63.png#averageHue=%23f59e8b&clientId=u3a889b5e-b613-4&from=paste&height=632&id=u9664a7b9&originHeight=695&originWidth=1365&originalType=binary&ratio=1&rotation=0&showTitle=false&size=88764&status=done&style=none&taskId=u50bf5155-93e5-4cd7-82c6-96f2c0db4a6&title=&width=1240.9090640131112)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701854958946-bc5caf78-d702-4c53-a12f-0d90064a5739.png#averageHue=%23fdfbfa&clientId=u3a889b5e-b613-4&from=paste&height=541&id=u274be3d3&originHeight=595&originWidth=1319&originalType=binary&ratio=1&rotation=0&showTitle=false&size=68511&status=done&style=none&taskId=ub2e3810f-79d2-447f-ae70-2920ec9a49a&title=&width=1199.0908831013141)
### 执行SQL文件
> **创建数据库(表)**
> **需要执行的文件：mysql-schema.sql**

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701855028002-314c5f53-d0f5-49c0-a1d7-db20f68fe631.png#averageHue=%23fcfbfb&clientId=u3a889b5e-b613-4&from=paste&height=571&id=uea6414aa&originHeight=628&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=87901&status=done&style=none&taskId=ue02b36ec-6844-408f-a4eb-34c7c4a3dca&title=&width=1241.8181549024982)
> 查看执行结果

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701855268529-49213119-e4c5-416a-bd6b-3291c8c686e8.png#averageHue=%23ddc085&clientId=u3a889b5e-b613-4&from=paste&height=495&id=u5183533a&originHeight=544&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=101210&status=done&style=none&taskId=ue393a988-ad39-4ee8-b1ed-9f64e075efa&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701855370346-1de25bf9-8891-4b00-b0e6-996455357cae.png#averageHue=%23e3cc92&clientId=u3a889b5e-b613-4&from=paste&height=669&id=u44dc9554&originHeight=736&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=148267&status=done&style=none&taskId=u92fd533e-bbfa-4f40-9f67-5112dba1899&title=&width=1241.8181549024982)
> **初始化数据库**
> **需要执行的文件：mysql-data.sql**
> **与mysql-schema.sql文件执行操作一致，这里不再赘述。正常执行结果如下：**

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701855605885-3defd22c-9e63-40db-b3e4-bf7a1da8f50a.png#averageHue=%23d7d694&clientId=u3a889b5e-b613-4&from=paste&height=641&id=u9db5b063&originHeight=705&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=114626&status=done&style=none&taskId=u8f691b5d-1990-42dd-91f9-602e7a29709&title=&width=1241.8181549024982)
## StreamPark配置
> 目的：配置启动需要的数据源。
> 配置文件所在路径：/usr/local/streampark/conf

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701856334100-99cc10d3-0a83-4bd0-96c0-243e9a3cbcbe.png#averageHue=%23100907&clientId=u3a889b5e-b613-4&from=paste&height=260&id=YIte2&originHeight=286&originWidth=880&originalType=binary&ratio=1&rotation=0&showTitle=false&size=41533&status=done&style=none&taskId=u3edb8ec7-a658-4ae2-9fcd-b02f56648e6&title=&width=799.9999826604674)
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

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701857283920-571b2435-e69e-4ac2-a4fa-b489491efae9.png#averageHue=%23030000&clientId=u3a889b5e-b613-4&from=paste&height=178&id=u065cce33&originHeight=196&originWidth=738&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10641&status=done&style=none&taskId=uea7e60d9-01fd-4a44-ad8b-58cd12ed56c&title=&width=670.9090763675283)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701857561183-62c636ba-f0e6-46a2-95b1-ea32d4323ef6.png#averageHue=%23080101&clientId=u3a889b5e-b613-4&from=paste&height=395&id=u58794d75&originHeight=434&originWidth=1002&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56046&status=done&style=none&taskId=uc8b93250-8a8c-4279-ab67-6e4a2129b63&title=&width=910.9090711656685)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701857980299-62322091-20e6-4fea-86d9-28611d8de769.png#averageHue=%230b0201&clientId=u3a889b5e-b613-4&from=paste&height=324&id=ue4f0b436&originHeight=356&originWidth=1227&originalType=binary&ratio=1&rotation=0&showTitle=false&size=69047&status=done&style=none&taskId=u4afed263-17f9-4254-b8ef-045fd922912&title=&width=1115.4545212777198)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701858114128-2c07d81c-f34c-4b17-912c-2a977c8c93c4.png#averageHue=%23030201&clientId=u3a889b5e-b613-4&from=paste&height=261&id=u04780140&originHeight=287&originWidth=990&originalType=binary&ratio=1&rotation=0&showTitle=false&size=31471&status=done&style=none&taskId=ucce6d642-8282-4136-847a-e7adba92aab&title=&width=899.9999804930258)
### 【可选】配置kerberos
> 背景：企业级hadoop集群环境都有设置安全访问机制，比如kerberos。StreamPark也可配置kerberos，使得flink可通过kerberos认证，向hadoop集群提交作业。

> **修改项如下:**
> 1. **security.kerberos.login.enable=true**
> 2. **security.kerberos.login.principal=实际的principal**
> 3. **security.kerberos.login.krb5=/etc/krb5.conf**
> 4. **security.kerberos.login.keytab=实际的keytab文件**
> 5. **java.security.krb5.conf=/etc/krb5.conf**

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701858690475-55c5273c-6dd4-44a0-b2f4-fadc37c005af.png#averageHue=%23000000&clientId=u3a889b5e-b613-4&from=paste&height=274&id=u2df08a99&originHeight=301&originWidth=618&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14479&status=done&style=none&taskId=u76dbb8ef-1018-4792-a81b-49385d286af&title=&width=561.8181696411009)
## 启动StreamPark
## 进入服务器StreamPark安装路径
```bash
cd /usr/local/streampark/
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701855769777-ed4a32bc-319e-48fc-a951-92eef08f81cf.png#averageHue=%23120e0c&clientId=u3a889b5e-b613-4&from=paste&height=365&id=u4a2109ab&originHeight=401&originWidth=717&originalType=binary&ratio=1&rotation=0&showTitle=false&size=50414&status=done&style=none&taskId=uae8d66d6-1b87-4d0a-a2f9-a0f3ed9177c&title=&width=651.8181676904035)
## 启动StreamPark服务
```bash
./bin/startup.sh
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701855795683-9d7a0a00-a41c-4d80-8a77-a85fe9a2d2a6.png#averageHue=%23030202&clientId=u3a889b5e-b613-4&from=paste&height=482&id=u7043739c&originHeight=530&originWidth=1208&originalType=binary&ratio=1&rotation=0&showTitle=false&size=62577&status=done&style=none&taskId=ua0d1f749-8ed6-48ed-8f00-c7a4e93895f&title=&width=1098.1817943793687)
> 查看启动日志
> 目的：确认无报错信息

```bash
tail -100f log/streampark.out
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701860300946-adde5510-2860-489f-a012-7897fdb6f287.png#averageHue=%230a0808&clientId=u3a889b5e-b613-4&from=paste&height=500&id=u0ba38384&originHeight=550&originWidth=1243&originalType=binary&ratio=1&rotation=0&showTitle=false&size=61565&status=done&style=none&taskId=u41364442-bd84-4ede-9a89-376d5b4640e&title=&width=1129.9999755079102)
# 验证安装
```bash
# 页面正常打开，则说明部署成功。
http://部署streampark服务IP或域名:10000/
admin/streampark
```
## 页面正常访问
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701860392675-6042a1ee-17f8-410b-a2ad-a321bd19858d.png#averageHue=%231869c4&clientId=u3a889b5e-b613-4&from=paste&height=669&id=u8f4883e0&originHeight=736&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=422882&status=done&style=none&taskId=u0c31b488-eee7-4a22-a9ba-78d8805e985&title=&width=1241.8181549024982)
## 系统正常登录
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701860431036-dbf6d5a1-f833-408b-a813-7d0d176d1747.png#averageHue=%23add2a1&clientId=u3a889b5e-b613-4&from=paste&height=669&id=uc97529f7&originHeight=736&originWidth=1366&originalType=binary&ratio=1&rotation=0&showTitle=false&size=108162&status=done&style=none&taskId=ud9476ff7-10f4-4a05-98d6-e08e3b20ab4&title=&width=1241.8181549024982)
## 

# 常见问题
## Cannot load driver class: com.mysql.cj.jdbc.Driver
> 原因：缺少mysql驱动包，参见 “3.2. 引入MySQL依赖包”

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701859323956-e0b235b9-0fa9-4876-8199-4132667678ea.png#averageHue=%23181513&clientId=u3a889b5e-b613-4&from=paste&height=344&id=ue9ca77e9&originHeight=378&originWidth=1221&originalType=binary&ratio=1&rotation=0&showTitle=false&size=71859&status=done&style=none&taskId=u9cc19c77-311d-4985-a320-22cc55f881a&title=&width=1109.9999759413984)
# 参考资源
> [https://streampark.apache.org/docs/user-guide/deployment/](https://streampark.apache.org/docs/user-guide/deployment/)

