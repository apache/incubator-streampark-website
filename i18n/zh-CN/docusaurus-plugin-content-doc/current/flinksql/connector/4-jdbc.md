---
id: '4-jdbc'
title: 'JDBC'
sidebar_position: 4
---

## 介绍

支持：

* Scan Source: Bounded 
* Lookup Source: Sync Mode 
* Sink: Batch Sink: 
* Streaming Append & Upsert Mode

JDBC 连接器允许使用 JDBC 驱动向任意类型的关系型数据库读取或者写入数据。本文档描述了针对关系型数据库如何通过建立 JDBC 连接器来执行 SQL 查询。

如果在 DDL 中定义了主键，则JDBC sink 将以 upsert 模式与外部系统交换 **UPDATE/DELETE** 消息；否则，它将以 append 模式与外部系统交换消息且不支持消费 **UPDATE/DELETE** 消息。

## 依赖

为了使用JDBC连接器，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-jdbc_2.11</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 和 scala 版本。

JDBC 连接器并不是发布版的一部分，需要自己手动添加依赖。

在连接到具体数据库时，也需要对应的驱动依赖，目前支持的驱动如下：

| Driver                        | 	Group Id                | 	Artifact Id	         | JAR                                                                       |
|:------------------------------|:-------------------------|:----------------------|:--------------------------------------------------------------------------|
| MySQL	                        | mysql	                   | mysql-connector-java	 | [下载](https://repo.maven.apache.org/maven2/mysql/mysql-connector-java/)    |
| 从flink-1.15.x开始支持<br/>Oracle	 | com.oracle.database.jdbc | 	ojdbc8               | 	[下载](https://mvnrepository.com/artifact/com.oracle.database.jdbc/ojdbc8) |
| PostgreSQL                    | 	org.postgresql          | 	postgresql	          | [下载](https://jdbc.postgresql.org/download.html)                           |
| Derby	                        | org.apache.derby         | 	derby	               | [下载](http://db.apache.org/derby/derby_downloads.html)                     |

当前，JDBC 连接器和驱动不在 Flink 二进制发布包中，请参阅这里了解在集群上执行时何连接它们。

## 创建 JDBC 表

JDBC table 可以按如下定义：

```sql
-- 在 Flink SQL 中注册一张 MySQL 表 'users'
CREATE TABLE MyUserTable (
    id BIGINT,
    name STRING,
    age INT,
    status BOOLEAN,
    PRIMARY KEY (id) NOT ENFORCED
) WITH (
    'connector' = 'jdbc',
    'url' = 'jdbc:mysql://localhost:3306/mydatabase',
    'table-name' = 'users'
);

-- 从另一张表 "T" 将数据写入到 JDBC 表中
INSERT INTO MyUserTable
SELECT id, name, age, status FROM T;

-- 查看 JDBC 表中的数据
SELECT id, name, age, status FROM MyUserTable;

-- JDBC 表在时态表关联中作为维表
SELECT * FROM myTopic
LEFT JOIN MyUserTable FOR SYSTEM_TIME AS OF myTopic.proctime
ON myTopic.key = MyUserTable.id;
```

## 连接器参数

| 参数	                                                         | 要求  | 	从 flink-1.15.x 开始支持<br/>是否可传递 | 	默认值     | 	类型        | 	描述                                                                                                                                      |
|:------------------------------------------------------------|:----|:-------------------------------|:---------|:-----------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| connector                                                   | 	必填 | 	否                             | 	(none)	 | String	    | 指定使用什么类型的连接器，这里应该是**jdbc**。                                                                                                              |
| url	                                                        | 必填  | 	是	                            | (none)	  | String	    | JDBC 数据库 **url**。                                                                                                                        |
| table-name	                                                 | 必填  | 	是	                            | (none)	  | String	    | 连接到 JDBC 表的名称。                                                                                                                           |
| driver	                                                     | 可选  | 	是	                            | (none)	  | String	    | 用于连接到此 URL 的 JDBC 驱动类名，如果不设置，将自动从 URL 中推导。                                                                                               |
| username	                                                   | 可选  | 	是	                            | (none)	  | String	    | JDBC 用户名。如果指定了 `username` 和 `password` 中的任一参数，则两者必须都被指定。                                                                                 |
| password	                                                   | 可选	 | 是	                             | (none)   | 	String    | 	JDBC 密码。                                                                                                                                |
| connection.max-retry-timeout	                               | 可选  | 	是	                            | 60s	     | Duration	  | 最大重试超时时间，以秒为单位且不应该小于 **1** 秒。                                                                                                            |
| scan.partition.column	                                      | 可选  | 	否	                            | (none)   | 	String	   | 用于将输入数据进行分区的列名。请参阅下面的分区扫描部分了解更多详情。                                                                                                       |
| scan.partition.num	                                         | 可选  | 	否	                            | (none)	  | Integer	   | 分区数。                                                                                                                                     |
| scan.partition.lower-bound                                  | 	可选 | 	否	                            | (none)	  | Integer	   | 第一个分区的最小值。                                                                                                                               |
| scan.partition.upper-bound	                                 | 可选  | 	否	                            | (none)	  | Integer	   | 最后一个分区的最大值。                                                                                                                              |
| scan.fetch-size	                                            | 可选  | 	是	                            | 0	       | Integer	   | 每次循环读取时应该从数据库中获取的行数。如果指定的值为 **0**，则该配置项会被忽略。                                                                                             |
| scan.auto-commit	                                           | 可选	 | 是	                             | true	    | Boolean	   | 在 JDBC 驱动程序上设置 `auto-commit` 标志， 它决定了每个语句是否在事务中自动提交。有些 JDBC 驱动程序，特别是 Postgres，可能需要将此设置为 false 以便流化结果。                                    |
| lookup.cache.max-rows	                                      | 可选  | 	是	                            | (none)	  | Integer	   | lookup cache 的最大行数，若超过该值，则最老的行记录将会过期。 默认情况下，lookup cache 是未开启的。请参阅下面的 Lookup Cache 部分了解更多详情。                                             |
| lookup.cache.ttl	                                           | 可选	 | 是	                             | (none)   | 	Duration	 | lookup cache 中每一行记录的最大存活时间，若超过该时间，则最老的行记录将会过期。 默认情况下，lookup cache 是未开启的。请参阅下面的 Lookup Cache 部分了解更多详情。                                    |
| **从flink-1.15.x开始支持**<br/>lookup.cache.caching-missing-key	 | 可选  | 	是                             | 	true	   | Boolean	   | 是否缓存未命中的 key ，默认为 **true** 。                                                                                                             |
| lookup.max-retries	                                         | 可选	 | 是	                             | 3	       | Integer    | 	查询数据库失败的最大重试时间。                                                                                                                         |
| sink.buffer-flush.max-rows	                                 | 可选	 | 是	                             | 100	     | Integer	   | flush 前缓存记录的最大值，可以设置为 **0** 来禁用它。                                                                                                        |
| sink.buffer-flush.interval	                                 | 可选  | 	是                             | 	1s      | 	Duration	 | flush 间隔时间，超过该时间后异步线程将 flush 数据。可以设置为 **0** 来禁用它。注意, 为了完全异步地处理缓存的 flush 事件，可以将 `sink.buffer-flush.max-rows` 设置为 **0** 并配置适当的 flush 时间间隔。 |
| sink.max-retries	                                           | 可选	 | 是	                             | 3	       | Integer	   | 写入记录到数据库失败后的最大重试次数。                                                                                                                      |
| sink.parallelism	                                           | 可选	 | 否	                             | (none)	  | Integer	   | 用于定义 JDBC sink 算子的并行度。默认情况下，并行度是由框架决定：使用与上游链式算子相同的并行度。                                                                                   |

## 特性

### 键处理

当写入数据到外部数据库时，Flink 会使用 DDL 中定义的主键。如果定义了主键，则连接器将以 `upsert` 模式工作，否则连接器将以 `append` 模式工作。

在 `upsert` 模式下，Flink 将根据主键判断是插入新行还是更新已存在的行，这种方式可以确保幂等性。
为了确保输出结果是符合预期的，推荐为表定义主键并且确保主键是底层数据库中表的唯一键或主键。
在 append 模式下，Flink 会把所有记录解释为 **INSERT** 消息，如果违反了底层数据库中主键或者唯一约束，**INSERT** 插入可能会失败。

有关 `PRIMARY KEY` 语法的更多详细信息，请参见 [CREATE TABLE DDL](https://ci.apache.org/projects/flink/flink-docs-release-1.13/zh/docs/dev/table/sql/create/#create-table)。

### 分区扫描

为了在并行 Source task 实例中加速读取数据，Flink 为 JDBC table 提供了分区扫描的特性。

如果下述分区扫描参数中的任一项被指定，则下述所有的分区扫描参数必须都被指定。
这些参数描述了在多个 task 并行读取数据时如何对表进行分区。 **scan.partition.column** 必须是相关表中的数字、日期或时间戳列。
注意，**scan.partition.lower-bound** 和 **scan.partition.upper-bound** 用于决定分区的起始位置和结束位置，以过滤表中的数据。
如果是批处理作业，也可以在提交 flink 作业之前获取最大值和最小值。

* scan.partition.column：用于进行分区的列名。
* scan.partition.num：分区数。
* scan.partition.lower-bound：第一个分区的最小值。
* scan.partition.upper-bound：最后一个分区的最大值。

**注意**

最大值和最小值设置，对于数据库中的时间和日期字段，该值应该使用毫秒值，而不是字符串。

flink会根据分区数对整个分区范围进行切分，然后将切分后的所有区间分配给所有source并行度。
flink生成的查询sql语句最后面会添加 **where** 分区字段过滤条件，使用 **between** 关键字。

### Lookup Cache

JDBC 连接器可以在时态表关联中作为一个可 lookup 的 source (又称为维表)，当前只支持同步的查找模式。

默认情况下，lookup cache 是未启用的，可以通过设置 `lookup.cache.max-rows` 和 `lookup.cache.ttl` 参数来启用。

lookup cache 的主要目的是用于提高时态表关联 JDBC 连接器的性能。
默认情况下，lookup cache 不开启，所以所有请求都会发送到外部数据库。当 lookup cache 被启用时，每个进程（即 TaskManager）将维护一个缓存。
Flink 将优先查找缓存，只有当缓存未查找到时才向外部数据库发送请求，并使用返回的数据更新缓存。
当缓存命中最大缓存行 `lookup.cache.max-rows` 或当行超过最大存活时间 `lookup.cache.ttl` 时，缓存中最老的行将被设置为已过期。
缓存中的记录可能不是最新的，用户可以将 `lookup.cache.ttl` 设置为一个更小的值以获得更新的刷新数据，但这可能会增加发送到数据库的请求数。所以要做好吞吐量和正确性之间的平衡。

**flink-1.15.x**：默认情况下，flink 会缓存主键查询为空的结果，你可以设置参数 `lookup.cache.caching-missing-key` 为 **false** 来改变这个行为。

### 幂等写入

如果在 DDL 中定义了主键，JDBC sink 将使用 **upsert** 语义而不是普通的 **INSERT** 语义。upsert 语义指的是如果数据主键值在数据库中已存在，则更新现有行；如果不存在，则插入新行，这种方式确保了幂等性。

如果出现故障，Flink 作业会从上次成功的 checkpoint 恢复并重新处理，但这可能导致在恢复过程中重复处理消息。强烈推荐使用 **upsert** 模式，因为如果需要重复处理记录，它有助于避免违反数据库主键约束和产生重复数据。

除了故障恢复场景外，数据源（kafka topic）也可能随着时间的推移自然地包含多个具有相同主键的记录，这使得 **upsert** 模式是符合用户期待的。

**upsert** 没有标准的语法，下表描述了不同数据库的 DML 语法：

| Database                     | 	Upsert Grammar                                                                                                               |
|:-----------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| MySQL                        | 	INSERT .. ON DUPLICATE KEY UPDATE ..                                                                                         |
| 从flink-1.15.x开始支持<br/>Oracle | 	MERGE INTO .. USING (..) ON (..)<br/>WHEN MATCHED THEN UPDATE SET (..)<br/>WHEN NOT MATCHED THEN INSERT (..)<br/>VALUES (..) |
| PostgreSQL                   | 	INSERT .. ON CONFLICT .. DO UPDATE SET ..                                                                                    |

### Postgres 数据库作为 Catalog

注意，该特性只支持到 **flink-1.14.x** ，在 **flink-1.15.x** 中，将 `postgre` 和 `mysql` 合并到一起实现了。

JdbcCatalog 允许用户通过 JDBC 协议将 Flink 连接到关系数据库。

目前，PostgresCatalog 是 JDBC Catalog 的唯一实现，PostgresCatalog 只支持有限的 Catalog 方法，包括：

```java
// Postgres Catalog 支持的方法
PostgresCatalog.databaseExists(String databaseName)
PostgresCatalog.listDatabases()
PostgresCatalog.getDatabase(String databaseName)
PostgresCatalog.listTables(String databaseName)
PostgresCatalog.getTable(ObjectPath tablePath)
PostgresCatalog.tableExists(ObjectPath tablePath)
```

其他的 Catalog 方法现在还是不支持的。

#### PostgresCatalog 的使用

请参阅 [Dependencies](https://ci.apache.org/projects/flink/flink-docs-release-1.13/zh/docs/connectors/table/jdbc/#dependencies) 部分了解如何配置 JDBC 连接器和 Postgres 驱动。

Postgres catalog 支持以下参数:

* name：必填，catalog 的名称。
* default-database：必填，默认要连接的数据库。
* username：必填，Postgres 账户的用户名。
* password：必填，账户的密码。
* base-url：必填，应该符合 `jdbc:postgresql://<ip>:<port>` 的格式，同时这里不应该包含数据库名。

**SQL**

```sql
CREATE CATALOG mypg WITH(
    'type' = 'jdbc',
    'default-database' = '...',
    'username' = '...',
    'password' = '...',
    'base-url' = '...'
);

USE CATALOG mypg;
```

#### PostgresSQL 元空间映射

除了数据库之外，postgresSQL 还有一个额外的命名空间 `schema`。一个 Postgres 实例可以拥有多个数据库，每个数据库可以拥有多个 schema，其中一个 schema 默认名为 `public`，每个 schema 可以包含多张表。 
在 Flink 中，当查询由 Postgres catalog 注册的表时，用户可以使用 `schema_name.table_name` 或只写 `table_name`，其中 `schema_name` 是可选的，默认值为 `public`。

因此，Flink Catalog 和 Postgres 之间的元空间映射如下：

| Flink Catalog 元空间结构      | 	Postgres 元空间结构           |
|:-------------------------|:--------------------------|
| catalog 名称 (只能在flink中定义) | 	N/A                      |
| database 名称              | 	database 名称              |
| table 名称                 | 	[schema_name.]table_name |

Flink 中的 Postgres 表的完整路径应该是： 
```sql
<catalog>.<db>.`<schema.table>`
```
如果指定了 schema，请注意需要转义`<schema.table>`，也就是使用转义字符 **`** 将其括起来。

这里提供了一些访问 Postgres 表的例子：

```sql
-- 扫描 'public' schema（即默认 schema）中的 'test_table' 表，schema 名称可以省略
SELECT * FROM mypg.mydb.test_table;
SELECT * FROM mydb.test_table;
SELECT * FROM test_table;

-- 扫描 'custom_schema' schema 中的 'test_table2' 表，
-- 自定义 schema 不能省略，并且必须与表一起转义。
SELECT * FROM mypg.mydb.`custom_schema.test_table2`
SELECT * FROM mydb.`custom_schema.test_table2`;
SELECT * FROM `custom_schema.test_table2`;
```

### JDBC Catalog

**从 flink-1.15.x 开始支持，并且将 postgre 和 mysql 合并到了一起实现。**

JdbcCatalog 允许用户使用 flink 通过 JDBC 协议去连接关系型数据库。

目前已经有两个 JDBC catalog 的实现，**Postgres Catalog** 和 **MySQL Catalog** 。他们支持下面的 catalog 函数，其他函数目前还不支持。

```java
// Postgres 和 MySQL Catalog 支持的函数
databaseExists(String databaseName);
listDatabases();
getDatabase(String databaseName);
listTables(String databaseName);
getTable(ObjectPath tablePath);
tableExists(ObjectPath tablePath);
```

其他的 catalog 函数目前还不支持。

#### 使用 JDBC catalog

该章节描述怎么创建并使用 Postgres Catalog 或 MySQL Catalog 。怎么添加 JDBC 连接器和相关的驱动，请参考上面的依赖章节。

JDBC catalog 支持下面的选项配置：

* name：必选，catalog的名称。
* default-database：必选，连快将诶的默认数据库。
* username：必选，Postgres/MySQL 账户的用户名。
* password：必选，账户的密码。
* base-url：必选，不要包含数据库名称。
  * 对于 Postgres Catalog ，该参数应该为：`jdbc:postgresql://<ip>:<port>`
  * 对于 MySQL Catalog ，该参数应该为：`jdbc:mysql://<ip>:<port>`

**SQL：**

```sql
CREATE CATALOG my_catalog WITH(
    'type' = 'jdbc',
    'default-database' = '...',
    'username' = '...',
    'password' = '...',
    'base-url' = '...'
);

USE CATALOG my_catalog;
```

#### JDBC Catalog for PostgreSQL

PostgreSQL 元空间映射。

PostgreSQL 基于数据库有一个额外的命名空间作为 schema 。一个 Postgres 示例可以有多个数据库，每个数据可以有多个 schema ，默认的 schema 名为 **public** ，每个 schema 可以有多张表。
在 flink 中，当查询注册到 Postgres catalog 中的表时，用户可以使用 **schema_name.table_name** 或者是只使用 **table_name** 。schema_name 是可选的，默认为 **public** 。

在 flink catalog 和 Postgres 之间的元空间映射如下：

| Flink Catalog 元空间结构	          | Postgres 元空间结构           |
|:------------------------------|:-------------------------|
| catalog name (只能在 flink 中定义)	 | N/A                      |
| database name                 | 	database name           |
| table name	                   | [schema_name.]table_name |

Flink 中的 Postgres 表的完整路径应该是：
```sql
<catalog>.<db>.`<schema.table>`
```
如果指定了 schema，请注意需要转义`<schema.table>`，也就是使用转义字符 **`** 将其括起来。

下面是一些访问 Postgres 表的案例：

```sql
-- 浏览名为 'public' 的 schema 下的 'test_table' 表，使用默认的 schema，schema 名称可以被省略。
SELECT * FROM mypg.mydb.test_table;
SELECT * FROM mydb.test_table;
SELECT * FROM test_table;

-- 浏览名为 'custom_schema' 的 schema 下的 'test_table2' 表，自定义 schema 不能被省略，而且必须和表一起被转义。
SELECT * FROM mypg.mydb.`custom_schema.test_table2`
SELECT * FROM mydb.`custom_schema.test_table2`;
SELECT * FROM `custom_schema.test_table2`;
```

#### JDBC Catalog for MySQL

MySQL 元空间映射。

MySQL 实例中的数据库和注册到 MySQL catalog 中的数据库有相同的映射级别。一个 MySQL 实例可以有多个数据库，每个数据库可以有多张表。
在 flink 中，当查询注册到 MySQL catalog 中的表时，用户可以使用 **database.table_name** 或者只指定 **table_name** 。默认的数据库名为创建 MySQL Catalog 时指定的默认数据库。

flink Catalog 和 MySQL Catalog 之间的元空间映射关系如下：

| Flink Catalog Metaspace Structure | 	MySQL Metaspace Structure |
|:----------------------------------|:---------------------------|
| catalog name (只能在 flink 中定义)	     | N/A                        |
| database name                     | 	database name             |
| table name                        | 	table_name                |

flink 中的 MySQL 表的完全路径应该为：
```
`<catalog>`.`<db>`.`<table>`
```

下面是一些访问 MySQL 表的案例：

```sql
-- 浏览 'test_table' 表，默认数据库为 'mydb'
SELECT * FROM mysql_catalog.mydb.test_table;
SELECT * FROM mydb.test_table;
SELECT * FROM test_table;

-- 浏览指定数据库下的 'test_table' 表。
SELECT * FROM mysql_catalog.given_database.test_table2;
SELECT * FROM given_database.test_table2;
```

## 数据类型映射

Flink 支持连接到多个使用方言（dialect）的数据库，如 **MySQL**、**PostgresSQL**、**Derby** 等。
其中，Derby 通常是用于测试目的。下表列出了从关系数据库数据类型到 Flink SQL 数据类型的类型映射，映射表可以使得在 Flink 中定义 JDBC 表更加简单。


| MySQL type                              | 	PostgreSQL type	                                                          | Flink SQL type                     |
|:----------------------------------------|:---------------------------------------------------------------------------|:-----------------------------------|
| TINYINT	                                || 	TINYINT                                                                   |     |
| SMALLINT<br/>TINYINT UNSIGNED           | SMALLINT<br/>INT2<br/>SMALLSERIAL<br/>SERIAL2	                             | SMALLINT                           |
| INT<br/>MEDIUMINT<br/>SMALLINT UNSIGNED | 	INTEGER<br/>SERIAL                                                        | 	INT                               |
| BIGINT<br/>INT UNSIGNED	                | BIGINT<br/>BIGSERIAL	                                                      | BIGINT                             |
| BIGINT UNSIGNED                         || 		DECIMAL(20, 0)                                                           |     |
| BIGINT	                                 | BIGINT                                                                     | 	BIGINT                            |
| FLOAT                                   | 	REAL<br/>FLOAT4	                                                          | FLOAT                              |
| DOUBLE<br/>DOUBLE PRECISION             | 	FLOAT8<br/>DOUBLE PRECISION	                                              | DOUBLE                             |
| NUMERIC(p, s)<br/>DECIMAL(p, s)	        | NUMERIC(p, s)<br/>DECIMAL(p, s)	                                           | DECIMAL(p, s)                      |
| BOOLEAN<br/>TINYINT(1)	                 | BOOLEAN	                                                                   | BOOLEAN                            |
| DATE	                                   | DATE	                                                                      | DATE                               |
| TIME [(p)]                              | 	TIME [(p)] [WITHOUT TIMEZONE]	                                            | TIME [(p)] [WITHOUT TIMEZONE]      |
| DATETIME [(p)]	                         | TIMESTAMP [(p)] [WITHOUT TIMEZONE]	                                        | TIMESTAMP [(p)] [WITHOUT TIMEZONE] |                               |
| CHAR(n)<br/><br/>VARCHAR(n)<br/>TEXT	   | CHAR(n)<br/>CHARACTER(n)<br/>VARCHAR(n)<br/>CHARACTER VARYING(n)<br/>TEXT	 | STRING                             |
| BINARY<br/>VARBINARY<br/>BLOB           | 	BYTEA	                                                                    | BYTES                              |
| 	                                       | ARRAY                                                                      | 	ARRAY                             |                                    |