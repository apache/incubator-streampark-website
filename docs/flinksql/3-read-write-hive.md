---
id: '3-read-write-hive'
title: 'Read Write Hive'
sidebar_position: 3
---

## 概述

Apache Hive 已经成为了数据仓库生态系统中的核心。它不仅仅是一个用于大数据分析和ETL场景的SQL引擎，同样也是一个数据管理平台，可用于发现，定义，和演化数据。

Flink 与 Hive 的集成包含两个层面。

一是利用了 Hive 的 `MetaStore` 作为持久化的 `Catalog`，用户可通过`HiveCatalog`将不同会话中的 Flink 元数据存储到 `Hive Metastore` 中。
例如，用户可以使用`HiveCatalog`将`Kafka`表或 `Elasticsearch` 表存储在 `Hive Metastore` 中，并后续在 SQL 查询中重新使用它们。

二是利用 Flink 来读写 Hive 表。

`HiveCatalog`的设计提供了与 Hive 良好的兼容性，用户可以"开箱即用"的访问其已有的 Hive 数仓。不需要修改现有的 `Hive Metastore`，也不需要更改表的数据位置或分区。

强烈建议用户使用 Blink planner 与 Hive 集成。

### 支持的Hive版本

Flink 支持以下的 Hive 版本。

* 1.0
    * 1.0.0
    * 1.0.1
* 1.1
    * 1.1.0
    * 1.1.1
* 1.2
    * 1.2.0
    * 1.2.1
    * 1.2.2
* 2.0
    * 2.0.0
    * 2.0.1
* 2.1
    * 2.1.0
    * 2.1.1
* 2.2
    * 2.2.0
    * 2.3
* 2.3.0
    * 2.3.1
    * 2.3.2
    * 2.3.3
    * 2.3.4
    * 2.3.5
    * 2.3.6
* 3.1
    * 3.1.0
    * 3.1.1
    * 3.1.2

注意，某些功能是否可用取决于使用的 Hive 版本，这些限制不是由 Flink 所引起的：

* Hive 内置函数在使用 `Hive-1.2.0` 及更高版本时支持。
* 列约束，也就是 `PRIMARY KEY` 和 `NOT NULL`，在使用 `Hive-3.1.0` 及更高版本时支持。
* 更改表的统计信息，在使用 `Hive-1.2.0` 及更高版本时支持。
* DATE列统计信息，在使用 `Hive-1.2.0` 及更高版时支持。
* 使用 `Hive-2.0.x` 版本时不支持写入 `ORC` 表。

#### 依赖项

要与 Hive 集成，需要在 Flink 下的 `/lib` 目录中添加一些额外的依赖包，以便通过 Table API 或 SQL Client 与 Hive 进行交互。
也可以将这些依赖项放在专用文件夹中，并分别使用 Table API 程序或 SQL Client 的-C或-l选项将它们添加到 `classpath` 中。

Apache Hive 是基于 Hadoop 之上构建的，因此需要通过设置`HADOOP_CLASSPATH`环境变量来配置`hadoop`的依赖项：

```shell
export HADOOP_CLASSPATH=`hadoop classpath`
```

有两种添加 Hive 依赖项的方法。第一种是使用 Flink 提供的 Hive Jar 包。可以根据使用的 Metastore 版本来选择对应的 Hive jar。第二个方式是分别添加每个所需的 jar 包。
如果使用的 Hive 版本尚未在此处列出，则第二种方法会更适合。

注意：**建议优先使用 Flink 提供的 Hive jar 包**。仅在 Flink 提供的 Hive jar 不满足需求时，再考虑使用分开添加 jar 包的方式。

**使用 Flink 提供的 Hive jar**

下表列出了所有可用的 Hive jar。您可以选择一个并放在 Flink 发行版的 `/lib` 目录中。

| hive版本        | maven依赖                        | 
|:--------------|:-------------------------------|
| 1.0.0 - 1.2.2 | flink-sql-connector-hive-1.2.2 | 
| 2.0.0 - 2.2.0 | flink-sql-connector-hive-2.2.0 | 
| 2.3.0 - 2.3.6 | flink-sql-connector-hive-2.3.6 | 
| 3.0.0 - 3.1.2 | flink-sql-connector-hive-3.1.2 |

上面所有的依赖都可以在中央仓库中找到。

**用户定义的依赖项**

可以在[这儿](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/connectors/table/hive/overview/#user-defined-dependencies)
找到不同Hive主版本所需要的依赖项。

## Hive Catalog

最近几年，在hadoop生态系统中，`Hive Metastore`已经成为事实上的元数据中心。很多公司都有一个`Hive Metastore`服务示例作为他们的产品来管理所有的元数据，不管这些元数据是hive，还是非hive的。

对于同时有hive和flink的部署，`HiveCatalog`可以让集群使用`Hive Metastore`来管理flink的元数据。

对于只有flink的部署，`HiveCatalog`是flink唯一开箱即用的持久化catalog。
如果不使用持久化catalog，用户使用`Flink SQL CREATE DDL`创建诸如kafka表时，必须在每个会话中重复创建元数据对象，这会浪费很多时间。
`HiveCatalog`可以通过授权用户值创建一次表和其他元数据对象来填补这个空隙，并且稍后就可以在所有会话中使用他们管理的这些元数据，也就是使用创建的诸如kafka之类的表。

在咱们的平台中使用 `flink sql` 功能，只需要创建 `hive catalog` ，然后 `use` 即可，具体参考 [create](syntax/4-create) 说明。

### 使用HiveCatalog

一旦配置成功，`HiveCatalog`就可以开箱即用。用户可以使用`DDL`来创建flink的元数据对象，并且马上就可以看到他们。

`HiveCatalog`可以处理两种类型的表：与hive兼容的表和通用表。

* hive兼容表是通过hive存储的表，他们的元数据和实际的数据都在分层存储中。因此，通过flink创建的与hive兼容的表，可以通过hive查询。
* 通用表是特定于flink处理的。当使用`HiveCatalog`创建通用表时，我们必须使用HMS（hive matestore）来持久化元数据。虽然这些表在hive可见，但这并不意味着hive可以理解这些元数据。
  因此在hive中使用这些表，会导致未定义的行为。一般只通过hive来查看这些表的schema元数据。

flink使用`is_generic`来描述一张表是hive兼容表还是通用表。当使用`HiveCatalog`创建表时，默认为通用表。如果想要创建一个hive兼容表，则需要在表的属性中显示设置`is_generic`为`false`。

就像上面描述的一样，通用表不能在hive中使用。

```sql
CREATE CATALOG myhive WITH (
    'type' = 'hive',
    'hive-conf-dir' = '/opt/hive-conf'
);

USE CATALOG myhive;
 
CREATE TABLE mykafka (
    name String,
    age Int
) WITH (
    'connector.type' = 'kafka',
    'connector.version' = 'universal',
    'connector.topic' = 'test',
    'connector.properties.bootstrap.servers' = 'localhost:9092',
    'format.type' = 'csv',
    'update-mode' = 'append'
);


DESCRIBE mykafka;
+------+--------+------+-----+--------+-----------+
| name |   type | null | key | extras | watermark |
+------+--------+------+-----+--------+-----------+
| name | STRING | TRUE |     |        |           |
|  age |    INT | TRUE |     |        |           |
+------+--------+------+-----+--------+-----------+
2 rows in set
```

通过 hive 客户端，或者是 hue 运行以下语句，可以看到如下结果：

```sql
show create table default.mykafka;

-- 下面是结果
CREATE TABLE `default.mykafka`(
)
ROW FORMAT SERDE 
    'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
STORED AS INPUTFORMAT 
    'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 
    'org.apache.hadoop.hive.ql.io.IgnoreKeyTextOutputFormat'
LOCATION
    'hdfs://hadoopCluster/user/hive/warehouse/mykafka'
TBLPROPERTIES (
    'flink.comment'='', 
    'flink.connector.properties.bootstrap.servers'='localhost:9092', 
    'flink.connector.topic'='test', 
    'flink.connector.type'='kafka', 
    'flink.connector.version'='universal', 
    'flink.format.type'='csv', 
    'flink.schema.0.data-type'='VARCHAR(2147483647)', 
    'flink.schema.0.name'='name', 
    'flink.schema.1.data-type'='INT', 
    'flink.schema.1.name'='age', 
    'flink.update-mode'='append', 
    'transient_lastDdlTime'='1658730990')
```

### 支持的类型

`HiveCatalog`支持通用表的所有flink类型。

对于hive兼容表，`HiveCatalog`需要映射flink数据类型到hive类型，就像下表描述的一样：

| Flink 数据类型    | Hive 数据类型     |
|:--------------|:--------------|
| CHAR(p)       | CHAR(p)       |
| VARCHAR(p)    | VARCHAR(p)    |
| STRING        | STRING        |
| BOOLEAN       | BOOLEAN       |
| TINYINT       | TINYINT       |
| SMALLINT      | SMALLINT      |
| INT           | INT           |
| BIGINT        | LONG          |
| FLOAT         | FLOAT         |
| DOUBLE        | DOUBLE        |
| DECIMAL(p, s) | DECIMAL(p, s) |
| DATE          | DATE          |
| TIMESTAMP(9)  | TIMESTAMP     |
| BYTES         | BINARY        |
| `ARRAY<T>`    | `LIST<T>`     |
| MAP           | MAP           |
| ROW           | STRUCT        |

对于类型映射，需要注意一些事情：

* hive的 CHAR(P)类型最大长度为255。
* hive的VARCHAR(p)类型最大长度为65535。
* hive的MAP key仅支持基本的类型，但是flink的MAP支持所有数据类型。
* hive的UNION类型目前不支持。
* 通常情况下，hive的TIMESTAMP类型精度为9，并且不支持其他精度。hive的UDF和其他的处理，可以处理精度<=9的TIMESTAMP值。
* hive不支持flink的TIMESTAMP_WITH_TIME_ZONE、TIMESTAMP_WITH_LOCAL_TIME_ZONE、MULTISET。
* 目前，flink的INTERVAL类型还不能映射到hive的INTERVAL类型。

## hive方言

从 `flink-1.11.0` 开始，在使用 Hive 方言时，Flink 允许用户用 Hive 语法来编写 SQL 语句。
通过提供与 Hive 语法的兼容性，我们旨在改善与 Hive 的互操作性，并减少用户需要在 Flink 和 Hive之间切换来执行不同语句的情况。

### 使用 Hive 方言

Flink 目前支持两种 SQL 方言: `default` 和 `hive`。你需要先切换到 Hive 方言，然后才能使用 Hive 语法编写。

注意，**可以为执行的每个语句动态切换方言，无需重新启动会话即可使用其他方言**。

下面是在 flink sql 中使用不同方言的示例：

```sql
Flink SQL> set 'table.sql-dialect'='hive''; --使用hive方言
[INFO] Session property has been set.
-- 一旦设置了 hive 方言，下面所有的语句就必须是 hive sql 的语法了，如果使用了 flink sql 的语法，将会报错。
Flink SQL> set 'table.sql-dialect'='default'; -- 使用默认方言
[INFO] Session property has been set.
```

### DDL

注意：**在对 hive 进行 DDL 操作之前，必须设置方言为 hive**。

本章节列出 Hive 方言支持的 DDL 语句，主要关注其语法。
可以参考 [Hive 文档](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL) 了解每个 DDL 语句的语义。


#### CATALOG

**Show**

```sql
SHOW CURRENT CATALOG;
```

#### DATABASE

**Show**

```sql
SHOW DATABASES;
SHOW CURRENT DATABASE;
```

**Create**

```sql
CREATE (DATABASE|SCHEMA) [IF NOT EXISTS] database_name
  [COMMENT database_comment]
  [LOCATION fs_path]
  [WITH DBPROPERTIES (property_name=property_value, ...)];
```

**Alter**

**Update Properties**

```sql
ALTER (DATABASE|SCHEMA) database_name SET DBPROPERTIES (property_name=property_value, ...);
```

**Update Owner**

```sql
ALTER (DATABASE|SCHEMA) database_name SET OWNER [USER|ROLE] user_or_role;
```

**Update Location**

```sql
ALTER (DATABASE|SCHEMA) database_name SET LOCATION fs_path;
```

**Drop**

```sql
DROP (DATABASE|SCHEMA) [IF EXISTS] database_name [RESTRICT|CASCADE];
```

**Use**

```sql
USE database_name;
```


#### TABLE

**Show**

```sql
SHOW TABLES;
```

**Create**

```sql
CREATE [EXTERNAL] TABLE [IF NOT EXISTS] table_name
  [(col_name data_type [column_constraint] [COMMENT col_comment], ... [table_constraint])]
  [COMMENT table_comment]
  [PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)]
  [
  [ROW FORMAT row_format]
  [STORED AS file_format]
  ]
  [LOCATION fs_path]
  [TBLPROPERTIES (property_name=property_value, ...)]

row_format:
  : DELIMITED [FIELDS TERMINATED BY char [ESCAPED BY char]] [COLLECTION ITEMS TERMINATED BY char]
  [MAP KEYS TERMINATED BY char] [LINES TERMINATED BY char]
  [NULL DEFINED AS char]
  | SERDE serde_name [WITH SERDEPROPERTIES (property_name=property_value, ...)]

file_format:
  : SEQUENCEFILE
  | TEXTFILE
  | RCFILE
  | ORC
  | PARQUET
  | AVRO
  | INPUTFORMAT input_format_classname OUTPUTFORMAT output_format_classname

column_constraint:
  : NOT NULL [[ENABLE|DISABLE] [VALIDATE|NOVALIDATE] [RELY|NORELY]]

table_constraint:
  : [CONSTRAINT constraint_name] PRIMARY KEY (col_name, ...) [[ENABLE|DISABLE] [VALIDATE|NOVALIDATE] [RELY|NORELY]]
```

**Alter**

**Rename**

```sql
ALTER TABLE table_name RENAME TO new_table_name;
```

**Update Properties**

```sql
ALTER TABLE table_name SET TBLPROPERTIES (property_name = property_value, property_name = property_value, ... );
```

**Update Location**

```sql
ALTER TABLE table_name [PARTITION partition_spec] SET LOCATION fs_path;
```

如果指定了 `partition_spec`，则必须是完整路径，即具有完整的分区列的值。如果指定了，该操作将作用在对应分区上而不是表上。

**Update File Format**

```sql
ALTER TABLE table_name [PARTITION partition_spec] SET FILEFORMAT file_format;
```

如果指定了 `partition_spec`，则必须是完整路径，即具有完整的分区列的值。如果指定了，该操作将作用在对应分区上而不是表上。

**Update SerDe Properties**

```sql
ALTER TABLE table_name [PARTITION partition_spec] SET SERDE serde_class_name [WITH SERDEPROPERTIES serde_properties];
ALTER TABLE table_name [PARTITION partition_spec] SET SERDEPROPERTIES serde_properties;

serde_properties:
    : (property_name = property_value, property_name = property_value, ... )
```

如果指定了 `partition_spec`，则必须是完整路径，即具有完整的分区列的值。如果指定了，该操作将作用在对应分区上而不是表上。

**Add Partitions**

```sql
ALTER TABLE table_name ADD [IF NOT EXISTS] (PARTITION partition_spec [LOCATION fs_path])+;
```

**Drop Partitions**

```sql
ALTER TABLE table_name DROP [IF EXISTS] PARTITION partition_spec[, PARTITION partition_spec, ...];
```

**Add/Replace Columns**

```sql
ALTER TABLE table_name ADD|REPLACE COLUMNS (col_name data_type [COMMENT col_comment], ...) [CASCADE|RESTRICT]
```

**Change Column**

```sql
ALTER TABLE table_name CHANGE [COLUMN] col_old_name col_new_name
    column_type [COMMENT col_comment] [FIRST|AFTER column_name] [CASCADE|RESTRICT];
```

**Drop**

```sql
DROP TABLE [IF EXISTS] table_name;
```

#### VIEW

**Create**

```sql
CREATE VIEW [IF NOT EXISTS] view_name [(column_name, ...) ]
  [COMMENT view_comment]
  [TBLPROPERTIES (property_name = property_value, ...)]
AS SELECT ...;
```

**Alter**

**Rename**

```sql
ALTER VIEW view_name RENAME TO new_view_name;
```

**Update Properties**

```sql
ALTER VIEW view_name SET TBLPROPERTIES (property_name = property_value, ... );
```

**Update As Select**

```sql
ALTER VIEW view_name AS select_statement;
```

**Drop**

```sql
DROP VIEW [IF EXISTS] view_name;
```

#### FUNCTION

**Show**

```sql
SHOW FUNCTIONS;
```

**Create**

```sql
CREATE FUNCTION function_name AS class_name;
```

**Drop**

```sql
DROP FUNCTION [IF EXISTS] function_name;
```

### DML & DQL Beta

Hive 方言支持常用的 Hive DML 和 DQL 。 下表列出了一些 Hive 方言支持的语法。

* SORT/CLUSTER/DISTRIBUTE BY
* Group By
* Join
* Union
* LATERAL VIEW
* Window Functions
* SubQueries
* CTE
* INSERT INTO dest schema
* Implicit type conversions

为了实现更好的语法和语义的兼容，强烈建议使用 `HiveModule` 并将其放在 `Module` 列表的首位，以便在函数解析时优先使用 Hive 内置函数。

**Hive 方言不再支持 Flink SQL 语法** 。 若需使用 Flink 语法，需要切换到 default 方言。

以下是一个使用 Hive 方言的示例。

```sql
Flink SQL> create catalog myhive with ('type' = 'hive', 'hive-conf-dir' = '/opt/hive-conf');
[INFO] Execute statement succeed.

Flink SQL> use catalog myhive;
[INFO] Execute statement succeed.

Flink SQL> load module hive;
[INFO] Execute statement succeed.

Flink SQL> use modules hive,core;
[INFO] Execute statement succeed.

Flink SQL> set table.sql-dialect=hive;
[INFO] Session property has been set.

Flink SQL> select explode(array(1,2,3)); -- 调用hive表函数
+-----+
| col |
+-----+
| 1 |
| 2 |
| 3 |
+-----+
3 rows in set

Flink SQL> create table tbl (key int, value string);
[INFO] Execute statement succeed.

Flink SQL> insert overwrite table tbl values (5,'e'),(1,'a'),(1,'a'),(3,'c'),(2,'b'),(3,'c'),(3,'c'),(4,'d');
[INFO] Submitting SQL update statement to the cluster...
[INFO] SQL update statement has been successfully submitted to the cluster:

Flink SQL> select * from tbl cluster by key; -- 使用cluster by
2021-04-22 16:13:57,005 INFO org.apache.hadoop.mapred.FileInputFormat                     [] - Total input paths to
process : 1
+-----+-------+
| key | value |
+-----+-------+
| 1 | a |
| 1 | a |
| 5 | e |
| 2 | b |
| 3 | c |
| 3 | c |
| 3 | c |
| 4 | d |
+-----+-------+
8 rows in set
```

### 注意

以下是使用 Hive 方言的一些注意事项。

* Hive 方言只能用于操作 Hive 对象，并要求当前 `Catalog` 是一个 `HiveCatalog` 。
* Hive 方言只支持 `db.table` 这种两级的标识符，不支持带有 `Catalog` 名字的标识符。
* 虽然所有 Hive 版本支持相同的语法，但是一些特定的功能是否可用仍取决于使用的Hive 版本。例如，更新数据库位置只在 `Hive-2.4.0` 或更高版本支持。
* 执行 `DML` 和 `DQL` 时应该使用 `HiveModule` 。
* **flink-1.15.x**：从 `Flink1.15`开始，你需要用 `/opt` 目录下的 `flink-table-planner_2.12` 替换 `/lib`
  目录下的 `flink-table-planner-loader` 来避免下面的异常，
  详细请查看[FLINK-25128](https://issues.apache.org/jira/browse/FLINK-25128)。

  ![img.png](/doc/image/flinksql/flink-dialect-exception.png)

## 读写Hive

使用`HiveCatalog`，Flink可以使用统一的流或批模式来处理Hive表。这意味着flink可以比Hive的批引擎有更好的性能，而且还可以连续的读取或写入数据到Hive表来提供数据库实时处理能力。

### 读

Flink支持从Hive中以批或流模式来读取数据。当使用批模式运行时，Flink将会对表当前时间点的数据进行查询。流式读取将会持续的监控表，并且抓取可见的新数据。Flink默认以有界流读取表。

流式读取支持消费分区表和无分区的表。对于分区表，Flink将会监控新生成的分区，并且在它们可见时马上读取。对于无分区的表，Flink将会监控目录下新生成的文件，并且读取它们。

| Key                                   | 默认值            | 类型       | 描述                                                                                                                                                                                                                                                                                                                                                                                         |
|:--------------------------------------|:---------------|:---------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| streaming-source.enable               | false          | Boolean  | 是否开启流式source。注意：请确保每个分区/文件被原子性地写入，否则读取器可能会获取到不完整的数据。                                                                                                                                                                                                                                                                                                                                       |
| streaming-source.partition.include    | all            | String   | 设置读取分区的选项，可用选项为：'**all**'和'**latest**'。<br/>'**all**'意味着读取所有分区；<br/>'**latest**' 意味着按照'`streaming-source.partition.order`'设置的分区顺序来读取最新的分区。<br/>'latest'只会在流式source的hive表作为时态表时起作用。<br/>默认值为'**all**'。<br/>在开启`streaming-source.enable`，并且设置`streaming-source.partition.include`为`latest`时，Flink支持`temporal连接`最新的hive分区数据，同时，用户可以通过配置下面的分区相关的选项来指定分区的比较顺序和数据的更新间隔。                          |
| streaming-source.monitor-interval     | None           | Duration | 持续监控分区/文件的时间间隔。<br/>注意：对于hive流式读取，默认值为'**1 m**'；对于hive流式temporal join，默认值为'**60 m**'，这是因为这儿有一个框架限制。<br/>在当前的hive流式`temporal join`实现上，TM访问hive的元数据可能会对`hive metaStore`产生很大的压力，这将会在未来改进。<br/>**注：在 flink-1.15.x中，数值应该是：'1 min'、'60 min'**。                                                                                                                                                   |
| streaming-source.partition-order      | partition-name | String   | 流式source模式下的分区顺序，支持'**create-time**'、'**partition-time**'、'**partition-name**'。<br/>'**create-time**'会比较分区/文件的创建时间，这并不是分区在hive元数据中的创建时间，而是目录/文件在文件系统中的修改时间，如果分区目录被更新了，比如往目录中增加了新的文件，这可能对数据消费造成影响。<br/>'**partition-time**'比较通过分区名称提取的时间。<br/>'**partition-name**'比较分区的字符串顺序。对于无分区表，这个值必须是'**create-time**'。<br/>默认情况下，该值为'**partition-name**'。该选项和过期的`streaming-source.consume-order`作用一样。 |
| streaming-source.consume-start-offset | None           | String   | 流式消费的起始偏移量。怎么转换和比较取决于你的设置。<br/>对于`create-time`和`partition-time`，应该是一个时间戳格式化字符串（**yyyy-[m]m-[d]d [hh:mm:ss]**）。对于`partition-name`，将会使用分区时间提取器从分区中提取时间，并且分区名称应该有时间对应的值，比如：**pt_year=2020/pt_mon=10/pt_day=01**。                                                                                                                                                                              |

SQL提示可以用于给hive表提供配置，而无需在hive元数据中更改表的定义。

```sql
SELECT * FROM hive_table /*+ 
    OPTIONS(
        'streaming-source.enable'='true', 
        'streaming-source.consume-start-offset'='2020-05-20'
    ) 
    */
;
```

注意：

* 监控策略会读取当前路径下的所有目录/文件，太多的分区可能导致性能下降。
* 流式读取无分区表要求每个文件被原子性地写入目标目录。
* 流式读取分区表要求每个分区被原子性的加入hive的元数据。否则，新增加到一个已存在的分区的数据将会被消费。
* 在Flink DDL中，流式读取不支持水印语法，这些表不能被用于窗口操作。


#### 读取hive视图

Flink支持读取Hive视图，但是会有以下限制：

* 在读取视图之前，`hive catalog`必须被设置为当前的catalog。可以通过`USE CATALOG ...`来设置。
* flink SQL和hive SQL有不同的语法，比如不同的关键字和字面量。请确保时区的查询和flink语法兼容。

#### 向量读优化

当符合下面的条件时，flink将对hive表自动使用向量读：

* 格式：ORC或Parquet。
* 非复杂数据类型，比如hive类型：List、Map、Struct、Union。


这个特性默认开启，可以通过下面的配置来禁用：

```sql
set 'table.exec.hive.fallback-mapred-reader'='true';
```

#### source并行度推断

默认情况下，flink会基于要读取的hive表对应的文件数量以及每个文件的文件块数量来推断最优的并行度。

flink允许配置并行度推断的策略，可以通过 sql 来修改下面的配置。注意：这些参数将会影响整个job中所有的source。

| Key                                          | 默认值  | 类型      | 描述                                                               |
|:---------------------------------------------|:-----|:--------|:-----------------------------------------------------------------|
| table.exec.hive.infer-source-parallelism     | true | Boolean | 如果为true，将会通过文件块数量来推断source并行度。<br/>如果为false，source的并行度将会通过配置来设置。 |
| table.exec.hive.infer-source-parallelism.max | 1000 | Integer | 设置source算子的最大并行度。                                                |

#### 加载分区分片

**从Flink-1.15.x开始支持。**

使用多线程切分 hive 的分区。可以使用 `table.exec.hive.load-partition-splits.thread-num` 来配置线程数量，默认值为**3**，配置值应该大于0.

### 时态表连接（temporal table join）

可以将hive表作为时态表，然后流就可以通过`temporal join`关联这个hive表。
请查看[temporal join](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/dev/table/sql/queries/joins/#temporal-joins)来了解更多关于`temporal join`的信息。

flink支持使用处理时间来`temporal join` hive表，处理时间`temporal join`通常会关联时态表的最新版本数据。
flink支持`temporal join`分区表和无分区表。对于分区表，flink支持自动跟踪hive表的最新分区。

注：flink目前不支持通过事件时间来`temporal join` hive表。

#### Temporal Join最新分区

对于随时间变化的分区表，可以将其作为一个无界流来读取。如果每个分区包含一个版本的完整数据，分区就可以被作为时态表的一个版本。时态表的每个版本数据对应一个分区。

对于处理时间的`temporal join`，flink会自动跟踪时态表最新的分区（版本）。最新分区（版本）通过`streaming-source.partition-order`选项定义。在flink流应用程序任务中，将hive表作为维表是最常见的案例。

注：**这个特性只支持流模式。**

下面展示一个经典的商业数据处理pipeline，维表数据来自于hive，并且底层表数据通过批处理pipeline或flink任务去每天更新一次。kafka流数据来自于实时的在线商业数据或日志，并且需要关联维表来丰富流数据。

```sql
-- 确保hive表的数据每天更新一次，每天包含最新且完整的维度数据
SET 'table.sql-dialect'='hive';
CREATE TABLE dimension_table (
    product_id STRING,
    product_name STRING,
    unit_price DECIMAL(10, 4),
    pv_count BIGINT,
    like_count BIGINT,
    comment_count BIGINT,
    update_time TIMESTAMP(3),
    update_user STRING,
    ...
)
PARTITIONED BY (pt_year STRING, pt_month STRING, pt_day STRING)
TBLPROPERTIES (
    -- 使用默认的partition-name顺序，每12小时加载一次最新分区数据（最推荐的且合适的方式）
    'streaming-source.enable' = 'true',
    'streaming-source.partition.include' = 'latest',
    'streaming-source.monitor-interval' = '12 h',
    'streaming-source.partition-order' = 'partition-name', -- 默认选项，可以忽略
    
    -- 每12小时，使用分区文件的创建时间create-time顺序加载一次最新分区
    'streaming-source.enable' = 'true',
    'streaming-source.partition.include' = 'latest',
    'streaming-source.partition-order' = 'create-time',
    'streaming-source.monitor-interval' = '12 h'
    
    -- 每12小时，使用分区时间partition-time顺序加载一次最新分区
    'streaming-source.enable' = 'true',
    'streaming-source.partition.include' = 'latest',
    'streaming-source.monitor-interval' = '12 h',
    'streaming-source.partition-order' = 'partition-time',
    'partition.time-extractor.kind' = 'default',
    'partition.time-extractor.timestamp-pattern' = '$pt_year-$pt_month-$pt_day 00:00:00'
);

SET 'table.sql-dialect'='default';
CREATE TABLE orders_table (
    order_id STRING,
    order_amount DOUBLE,
    product_id STRING,
    log_ts TIMESTAMP(3),
    proctime as PROCTIME()
) WITH (...);

-- 流模式sql，kafka时态连接temporal join一张hive维表，flink将根据'streaming-source.monitor-interval‘配置的时间间隔，从配置的最新分区自动加载数据。
SELECT * FROM orders_table AS o
JOIN dimension_table FOR SYSTEM_TIME AS OF o.proctime AS dim
ON o.product_id = dim.product_id;
```

#### temporal join最新表

对于hive表，可以将其作为有界流读取。在这种情况下，我们在某个时间点查询时，只能查询到hive表的最新版本数据。表的最新版本数据包含hive表的所有数据。

当执行关联最新hive表的查询时，hive表数据将会被缓存到slot的内存中，并且流中参与join的每条数据都会通过key来决定是否能找对对应的匹配值。
使用最新hive表作为时态表不要求任何其他的配置。作为可选项，可以通过以下属性来配置hive表数据缓存的TTL。缓存过期之后，hive表将会再次被scan以加载最新数据。

| Key                   | 默认值    | 类型       | 描述                                                                                                                                                 |
|:----------------------|:-------|:---------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| lookup.join.cache.ttl | 60 min | Duration | lookup join时缓存的TTL（比如 10min）。默认值值是60分钟。<br/>注：这个选项只在lookup有界hive表source时起作用，如果使用流hive source作为时态表，请使用`streaming-source.monitor-interval`配置数据更新的时间。 |

下面的实例展示加载hive表所有数据作为时态表：

```sql
-- 确保hive表中的数据会通过批处理pipeline每次以覆盖overwrite的形式写入
SET 'table.sql-dialect'='hive';
    CREATE TABLE dimension_table (
    product_id STRING,
    product_name STRING,
    unit_price DECIMAL(10, 4),
    pv_count BIGINT,
    like_count BIGINT,
    comment_count BIGINT,
    update_time TIMESTAMP(3),
    update_user STRING,
    ...
) TBLPROPERTIES (
    'streaming-source.enable' = 'false', -- 默认值，可以被忽略
    'streaming-source.partition.include' = 'all', -- 默认值，可以被忽略
    'lookup.join.cache.ttl' = '12 h'
);

SET 'table.sql-dialect'='default';
CREATE TABLE orders_table (
    order_id STRING,
    order_amount DOUBLE,
    product_id STRING,
    log_ts TIMESTAMP(3),
    proctime as PROCTIME()
) WITH (...);

-- 流式sql，kafka join hive维表。flink将会在缓存生存时间过期之后从dimension_table加载所有数据
SELECT * FROM orders_table AS o
JOIN dimension_table FOR SYSTEM_TIME AS OF o.proctime AS dim
ON o.product_id = dim.product_id;
```

注：

* 每个join的子任务都需要在自己的缓存中保持hive表的数据。请确保hive表的数据可以被缓存到TM任务的一个slot内存中，也就是说，每一个slot所分配的内存都能容纳hive表的所有数据。
* 建议对 `streaming-source.monitor-interval`（最新分区作为时态表）和 `lookup.join.cache.ttl`（所有分区作为时态表）设置一个很大的值，否则任务会频繁的更新和重加载数据，从而造成性能问题。
* 目前，flink是简单的加载整个hive表，而不管缓存是否需要被冲刷新。现在没有方法去比较新数据和旧数据的不同。

### 写

flink支持通过`BATCH`和`STREAMING`模式来写入数据到hive表。当运行`BATCH`模式应用程序时，flink写入hive表的数据，只能在任务完成后才能被看到。`BATCH`写入支持追加和覆盖已存在的表数据。

```sql
-- INSERT INTO将会追加表或分区数据，并且完好无损的保存已存在的数据
Flink SQL> INSERT INTO mytable SELECT 'Tom', 25;
-- INSERT OVERWRITE将会覆盖表或分区中已存在的数据
Flink SQL> INSERT OVERWRITE mytable SELECT 'Tom', 25;
数据也可以被插入常规分区：
-- 写入静态分区，直接在表后面指定分区对应的值
Flink SQL> INSERT OVERWRITE myparttable PARTITION (my_type='type_1', my_date='2019-08-08') SELECT 'Tom', 25;
-- 写入动态分区，根据分区字段的值来判断每条数据写入的分区
Flink SQL> INSERT OVERWRITE myparttable SELECT 'Tom', 25, 'type_1', '2019-08-08';
-- 插入静态分区（my_type）和动态分区（my_date）
Flink SQL> INSERT OVERWRITE myparttable PARTITION (my_type='type_1') SELECT 'Tom', 25, '2019-08-08';
```

流式写入会持续的增加新数据到hive表，并且递增的提交数据以使他们可见。用户可以通过几个配置来控制何时/怎样触发提交。`INSERT OVERWRITE`不支持流式写入。

下面的例子展示如何使用分区提交，并通过流式查询以及流式sink来从kafka读取数据并写入hive表，然后运行批查询来读取写入到hive的数据。

请查看[FileSystem](connector/6-file-system)章节来获取完整可用的配置的列表。

```sql
SET 'table.sql-dialect'='hive';
CREATE TABLE hive_table (
    user_id STRING,
    order_amount DOUBLE
) PARTITIONED BY (dt STRING, hr STRING) STORED AS parquet TBLPROPERTIES (
    'partition.time-extractor.timestamp-pattern'='$dt $hr:00:00',
    'sink.partition-commit.trigger'='partition-time',
    'sink.partition-commit.delay'='1 h',
    'sink.partition-commit.policy.kind'='metastore,success-file'
);

SET 'table.sql-dialect'='default';
CREATE TABLE kafka_table (
    user_id STRING,
    order_amount DOUBLE,
    log_ts TIMESTAMP(3),
    WATERMARK FOR log_ts AS log_ts - INTERVAL '5' SECOND -- 在TIMESTAMP列上定义水印
) WITH (...);

-- 流式sql，insert into到hive表
INSERT INTO TABLE hive_table
SELECT user_id, order_amount, DATE_FORMAT(log_ts, 'yyyy-MM-dd'), DATE_FORMAT(log_ts, 'HH')
FROM kafka_table;

-- batch sql，通过指定分区查询数据
SELECT * FROM hive_table WHERE dt='2020-05-20' and hr='12';
```

如果水印被定义在`TIMESTAMP_LTZ`字段上，并且使用`partition-time`来提交，则必须配置 `sink.partition-commit.watermark-time-zone` 指定会话的时区，否则分区将会晚几个小时提交。

```sql
SET table.sql-dialect=hive;
CREATE TABLE hive_table (
    user_id STRING,
    order_amount DOUBLE
) PARTITIONED BY (dt STRING, hr STRING) STORED AS parquet TBLPROPERTIES (
    'partition.time-extractor.timestamp-pattern'='$dt $hr:00:00',
    'sink.partition-commit.trigger'='partition-time',
    'sink.partition-commit.delay'='1 h',
    'sink.partition-commit.watermark-time-zone'='Asia/Shanghai', -- 确保用户配置的时区为Asia/Shanghai
    'sink.partition-commit.policy.kind'='metastore,success-file'
);

SET table.sql-dialect=default;
CREATE TABLE kafka_table (
    user_id STRING,
    order_amount DOUBLE,
    ts BIGINT, -- 纪元毫秒值
    ts_ltz AS TO_TIMESTAMP_LTZ(ts, 3),
    WATERMARK FOR ts_ltz AS ts_ltz - INTERVAL '5' SECOND -- 在TIMESTAMP_LTZ字段上定义水印
) WITH (...);

-- 流式sql，insert into到hive表
INSERT INTO TABLE hive_table
SELECT user_id, order_amount, DATE_FORMAT(ts_ltz, 'yyyy-MM-dd'), DATE_FORMAT(ts_ltz, 'HH')
FROM kafka_table;

-- batch sql，通过指定分区查询数据
SELECT * FROM hive_table WHERE dt='2020-05-20' and hr='12';
```

默认情况下，对于流式写入，flink只支持重命名提交者，这意味着S3文件系统不支持切好一次的流式写入。
可以通过设置下面的参数为false来恰好一次写入S3，这将会通知flink使用自己的写入器，但是这只支持写入parquet和orc文件类型。这个配置会影响任务中的所有sink。

| Key                                    | 默认值  | 类型      | 描述                                                                                                                                     |
|:---------------------------------------|:-----|:--------|:---------------------------------------------------------------------------------------------------------------------------------------|
| table.exec.hive.fallback-mapred-writer | true | Boolean | 如果该设置为 false，将使用 flink 的 native write 写入数据到 parquet 和 orc 文件；<br/>如果该设置为true，将使用 hadoop mapred 的 record writer 写入数据到 parquet 和 orc 文件。 |

### 格式

下面的文件格式已经通过了flink和hive的兼容测试：
* Text
* CSV
* SequenceFile
* ORC
* Parquet


## Hive函数

### 通过HiveModule使用hive内置函数

`HiveModul`e提供将hive的内置函数作为flink系统的内置函数的功能，可以通过flink SQL使用。
详细信息，请参考[HiveModule](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/dev/table/modules/#hivemodule)。

```sql
load module hive;
```

旧版本的hive内置函数有线程安全问题。用户需要注意。

### hive自定义函数

用户可以在flink中使用已存在的hive自定义函数。

支持的UDF类型包括：

* UDF
* GenericUDF
* GenericUDTF
* UDAF
* GenericUDAFResolver2

对于查询计划器和执行，hive的`UDF`和`GenericUDF`会被自动翻译为flink的`ScalarFunction`，hive的`GenericUDTF`被自动翻译为flink的`TableFunction`，
hive的 `UDAF` 和 `GenericUDAFResolver2` 被翻译为flink的 `AggregateFunction`。

为了使用hive自定义函数 ，用户需要：

* 设置会话当前的catalog为HiveCatalog，来支持读取包含这些函数的hive元数据。
* 将包含函数的jar加载到flink的classpath。
* 使用Blink计划器。从 flink-1.14.x 开始，就只有 Blink 计划器了。

### 使用hive自定义函数

确保下面的hive函数被注册到hive的元数据：

```java
/**
 * 测试简单的udf，注册函数名为：myudf。<br>
 * 已过期，建议使用GenericUDF
 */
public class TestHiveSimpleUDF extends UDF {

  public IntWritable evaluate(IntWritable i) {
    return new IntWritable(i.get());
  }

  public Text evaluate(Text text) {
    return new Text(text.toString());
  }
}

/**
 * 测试generic udf.注册函数名称为：mygenericudf
 */
public class TestHiveGenericUDF extends GenericUDF {

  @Override
  public ObjectInspector initialize(ObjectInspector[] arguments) throws UDFArgumentException {
    checkArgument(arguments.length == 2);
    checkArgument(arguments[1] instanceof ConstantObjectInspector);
    Object constant = ((ConstantObjectInspector) arguments[1]).getWritableConstantValue();
    checkArgument(constant instanceof IntWritable);
    checkArgument(((IntWritable) constant).get() == 1);

    if (arguments[0] instanceof IntObjectInspector || arguments[0] instanceof StringObjectInspector) {
      return arguments[0];
    } else {
      throw new RuntimeException("Not support argument: " + arguments[0]);
    }
  }

  @Override
  public Object evaluate(DeferredObject[] arguments) throws HiveException {
    return arguments[0].get();
  }

  @Override
  public String getDisplayString(String[] children) {
    return "TestHiveGenericUDF";
  }
}

/**
 * 测试split udtf。注册函数名为：mygenericudtf
 */
public class TestHiveUDTF extends GenericUDTF {

  @Override
  public StructObjectInspector initialize(ObjectInspector[] argOIs) throws UDFArgumentException {
    checkArgument(argOIs.length == 2);
    //测试常量参数
    checkArgument(argOIs[1] instanceof ConstantObjectInspector);
    Object constant = ((ConstantObjectInspector) argOIs[1]).getWritableConstantValue();
    checkArgument(constant instanceof IntWritable);
    checkArgument(((IntWritable) constant).get() == 1);

    return ObjectInspectorFactory.getStandardStructObjectInspector(
            Collections.singletonList("col1"),
            Collections.singletonList(PrimitiveObjectInspectorFactory.javaStringObjectInspector));
  }

  @Override
  public void process(Object[] args) throws HiveException {
    String str = (String) args[0];
    for (String s : str.split(",")) {
      forward(s);
      forward(s);
    }
  }

  @Override
  public void close() {
  }
}
```

通过hive CLI客户端，我们可以看到他们应被注册，也就是说，应该在使用 flink sql 之前，就将他们注册为 hive 的系统函数：

```sql
hive> show functions;
OK
......
mygenericudf
myudf
myudtf
```

然后，用户就可以在flink SQL中使用他们了：

```sql
select mygenericudf(myudf(name), 1) as a, mygenericudf(myudf(age), 1) as b, s
from mysourcetable, lateral table(myudtf(name, 1)) as T(s);
```
