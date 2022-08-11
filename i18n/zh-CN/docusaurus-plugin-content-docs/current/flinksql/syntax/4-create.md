---
id: '4-create'
title: 'create'
sidebar_position: 4
---

## 介绍

CREATE 语句用于将 `表`/`视图`/`函数` 注册到当前或指定的 Catalog 中。已注册的`表`/`视图`/`函数`可以在SQL查询中使用。

Flink SQL目前支持以下CREATE语句：

* CREATE TABLE
* CREATE CATALOG
* CREATE DATABASE
* CREATE VIEW
* CREATE FUNCTION

## CREATE TABLE

语法概述：

```sql
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] [catalog_name.][db_name.]table_name
(
{ <physical_column_definition> | <metadata_column_definition> | <computed_column_definition> }[ , ...n]
[ <watermark_definition> ]
[ <table_constraint> ][ , ...n]
)
[COMMENT table_comment]
[PARTITIONED BY (partition_column_name1, partition_column_name2, ...)]
WITH (key1=val1, key2=val2, ...)
[ LIKE source_table [( <like_options> )] ]

<physical_column_definition>:
column_name column_type [ <column_constraint> ] [COMMENT column_comment]

<column_constraint>:
[CONSTRAINT constraint_name] PRIMARY KEY NOT ENFORCED

<table_constraint>:
[CONSTRAINT constraint_name] PRIMARY KEY (column_name, ...) NOT ENFORCED

<metadata_column_definition>:
column_name column_type METADATA [ FROM metadata_key ] [ VIRTUAL ]

<computed_column_definition>:
column_name AS computed_column_expression [COMMENT column_comment]

<watermark_definition>:
WATERMARK FOR rowtime_column_name AS watermark_strategy_expression

<source_table>:
[catalog_name.][db_name.]table_name

<like_options>:
{
{ INCLUDING | EXCLUDING } { ALL | CONSTRAINTS | PARTITIONS }
| { INCLUDING | EXCLUDING | OVERWRITING } { GENERATED | OPTIONS | WATERMARKS }
}[, ...]
```

上面的语句创建了一个带有给定名称的表。如果catalog中已经存在同名的表，则会引发异常。

### Columns（字段）

#### Physical / Regular Columns（物理/常规列）

物理列是数据库中已知的常规列。它们定义物理数据中字段的名称、类型和顺序。因此，物理列表示从外部系统读取和写入的有效负载。

连接器和格式转化使用这些列(按照定义的顺序)来配置自己。其他类型的列可以在物理列之间声明，但不会影响最终的物理模式。

下面的语句创建了一个只有常规列的表：

```sql
CREATE TABLE MyTable (
    `user_id` BIGINT,
    `name` STRING
) WITH (
...
);
```

#### Metadata Columns（元数据列）

元数据列是SQL标准的扩展，允许访问连接器和/或表中每一行的特定字段。元数据列由metadata关键字表示。例如，元数据列可以用来读取和写入Kafka记录的时间戳，以进行基于时间的操作。

[连接器](../../../../../../docs/flinksql/connector)和[格式](../../../../../../docs/flinksql/format)文档列出了每个组件的可用元数据字段。在表的模式中声明元数据列是可选的。

下面的语句创建了一个表，其中包含引用元数据timestamp的附加元数据列：

```sql
CREATE TABLE MyTable (
    `user_id` BIGINT,
    `name` STRING,
    `record_time` TIMESTAMP_LTZ(3) METADATA FROM 'timestamp' -- 读取和写入kafka记录的时间戳
) WITH (
    'connector' = 'kafka'
...
);
```

每个元数据字段都由基于字符串的键标识，并具有文档化的数据类型。例如，Kafka连接器暴露了一个元数据字段，该字段由键timestamp和数据类型TIMESTAMP_LTZ(3)标识，可以用于读写记录。

在上面的例子中，元数据列record_time成为表模式的一部分，可以像普通列一样进行转换和存储：

```sql
INSERT INTO MyTable SELECT user_id, name, record_time + INTERVAL '1' SECOND FROM MyTable;
```

为了方便起见，如果将列名直接用于标识元数据，则可以省略FROM子句：

```sql
CREATE TABLE MyTable (
    `user_id` BIGINT,
    `name` STRING,
    `timestamp` TIMESTAMP_LTZ(3) METADATA -- 使用列名作为元数据键
) WITH (
    'connector' = 'kafka'
...
);
```

为方便起见，如果列的数据类型与元数据字段的数据类型不同，可以显式指示强制类型转换，不过要求这两种数据类型是兼容的。

```sql
CREATE TABLE MyTable (
    `user_id` BIGINT,
    `name` STRING,
    `timestamp` BIGINT METADATA -- 转化timestamp类型为BIGINT
) WITH (
'connector' = 'kafka'
...
);
```

默认情况下，planner计划器会假定元数据列可以同时用于读写。然而在许多情况下，外部系统提供的元数据字段用于只读比可写更多。因此，可以使用VIRTUAL关键字将元数据列排除在持久化之外。

```sql
CREATE TABLE MyTable (
    `timestamp` BIGINT METADATA, -- query-to-sink schema的一部分
    `offset` BIGINT METADATA VIRTUAL, -- 不是query-to-sink schema的一部分
    `user_id` BIGINT,
    `name` STRING,
) WITH (
    'connector' = 'kafka'
...
```

);

在上面的示例中，偏移量是一个只读元数据列，并从query-to-sink schema中排除。因此，source-to-query模式(用于SELECT)和query-to-sink(用于INSERT INTO)模式不同:

```sql
source-to-query schema:
MyTable(`timestamp` BIGINT, `offset` BIGINT, `user_id` BIGINT, `name` STRING)
query-to-sink schema:
MyTable(`timestamp` BIGINT, `user_id` BIGINT, `name` STRING)
```

#### Computed Columns（计算列）

计算列是使用语法column_name AS computed_column_expression生成的虚拟列。

计算列可以引用同一表中声明的其他列的表达式，可以访问物理列和元数据列。列本身并不物理地存储在表中，列的数据类型通过给定的表达式自动派生，不需要手动声明。

计划器会将计算列转换为常规投影。对于优化或水印策略下推，计算列的实际计算可能会跨算子进行，并执行多次，或者在给定查询不需要的情况下跳过。例如，计算列可以定义为：

```sql
CREATE TABLE MyTable (
    `user_id` BIGINT,
    `price` DOUBLE,
    `quantity` DOUBLE,
    `cost` AS price * quanitity, -- 执行表达式并接收查询结果
) WITH (
    'connector' = 'kafka'
    ...
);
```

表达式可以是列、常量或函数的任意组合。表达式不能包含子查询。

计算列通常在Flink中用于在CREATE TABLE语句中定义时间属性。

* 可以通过proc AS PROCTIME()使用系统的PROCTIME()函数轻松定义处理时间属性。
* 事件时间属性timestamp可以在水印声明之前进行预处理。例如，如果原始字段不是TIMESTAMP(3)类型或嵌套在JSON字符串中，则可以使用计算列。

与虚拟元数据列类似，计算列被排除在持久化之外。因此，计算列不能是INSERT INTO语句的目标列。因此，source-to-query模式(用于SELECT)和query-to-sink(用于INSERT - INTO)模式不同：

```sql
source-to-query schema:
MyTable(`user_id` BIGINT, `price` DOUBLE, `quantity` DOUBLE, `cost` DOUBLE)
query-to-sink schema:
MyTable(`user_id` BIGINT, `price` DOUBLE, `quantity` DOUBLE)
```

### WATERMARK

WATERMARK子句用于定义表的事件时间属性，其形式为WATERMARK FOR rowtime_column_name AS watermark_strategy_expression。

* rowtime_column_name定义一个列，该列被标记为表的事件时间属性。该列必须为TIMESTAMP(3)类型，并且是模式中的顶级列。它可以是一个计算列。
* watermark_strategy_expression定义了水印生成策略。它允许任意非查询表达式(包括计算列)来计算水印。表达式返回类型必须为TIMESTAMP(3)，表示从Epoch开始的时间戳。

返回的水印只有在非空且其值大于先前发出的本地水印时才会发出(以保持升序水印的规定)。框架会对每条记录执行水印生成表达式。框架将周期性地发出生成的最大水印。 

如果当前水印与前一个相同，或为空，或返回的水印值小于上次发出的水印值，则不会发出新的水印。水印通过`pipeline.auto-watermark-interval`配置的时间间隔发出。 

如果水印间隔为0ms，弱生成的水印不为空且大于上次发出的水印，则每条记录都发出一次水印。

当使用事件时间语义时，表必须包含事件时间属性和水印策略。

Flink提供了几种常用的水印策略：

* 严格递增时间戳：**WATERMARK FOR rowtime_column AS rowtime_column**
  发出到目前为止观察到的最大时间戳的水印。时间戳大于最大时间戳的行不属于延迟。
* 升序时间戳：**WATERMARK FOR rowtime_column AS rowtime_column - INTERVAL '0.001' SECOND**
  发出到目前为止观察到的最大时间戳减去1的水印。时间戳大于或等于最大时间戳的行不属于延迟。
* 时间戳：**WATERMARK FOR rowtime_column AS rowtime_column - INTERVAL 'string' timeUnit**
  发出到目前为止观察到的最大时间戳减去指定延迟的水印，例如：WATERMARK FOR rowtime_column AS rowtime_column - INTERVAL '5' SECOND是一个延迟5秒的水印策略。

```sql
CREATE TABLE Orders (
  `user` BIGINT,
  product STRING,
  order_time TIMESTAMP(3),
  WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH ( . . . );
```

### PRIMARY KEY

主键约束是Flink用于优化的一个提示。它告诉flink，指定的表或视图的一列或一组列是唯一的，它们不包含null。主列中的任何一列都不能为空。主键唯一地标识表中的一行。

主键约束可以与列定义(列约束)一起声明，也可以作为单行声明(表约束)。只能使用这两种方式之一，如果同时定义多个主键约束，则会引发异常。

**有效性检查**  
SQL标准指定约束可以是强制的，也可以是不强制的。这将控制是否对传入/传出数据执行约束检查。Flink不保存数据，因此我们希望支持的唯一模式是not forced模式。确保查询执行的主键唯一性由用户负责。

注意:在CREATE TABLE语句中，主键约束会改变列的可空性，也就是说，一个有主键约束的列是不能为NULL的。

### PARTITIONED BY

根据指定的列对已创建的表进行分区。如果将该表用作filesystem sink，则为每个分区创建一个目录。

### WITH选项

用于创建表source/sink的表属性，属性通常用于查找和创建底层连接器。

表达式`key1=val1`的键和值都应该是字符串字面值。有关不同连接器的所有受支持的表属性，请参阅[连接器](../../../../../../docs/flinksql/connector)中的详细信息。

表名可以是三种格式:

1. catalog_name.db_name.table_name
2. db_name.table_name
3. table_name。

对于`catalog_name.db_name.Table_name`，表将被注册到catalog名为“catalog_name”，数据库名为“db_name；  
对于`db_name.Table_name`，表将注册到当前表执行环境的catalog和数据库名为“db_name”；  
对于`table_name`，表将注册到表执行环境的当前catalog和数据库中。

注意：用CREATE table语句注册的表既可以用作表source，也可以用作表sink，我们不能决定它是用作源还是用作接收器，直到它在dml语句中被引用。

### LIKE

LIKE子句是SQL特性的变体/组合。子句可用于基于现有表的定义创建表。此外，用户可以扩展原始表或排除其中的某些部分。与SQL标准相反，子句必须在CREATE语句的顶层定义。这是因为子句适用于定义的多个部分，而不仅仅适用于模式部分。

您可以使用该子句重用或覆盖某些连接器属性或向外部定义的表添加水印。例如，在Apache Hive中定义的表中添加水印。

下面为示例语句：

```sql
CREATE TABLE Orders (
  `user` BIGINT,
  product STRING,
  order_time TIMESTAMP(3)
) WITH (
  'connector' = 'kafka',
  'scan.startup.mode' = 'earliest-offset'
);

CREATE TABLE Orders_with_watermark (
  -- 增加水印定义
  WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH (
  -- 覆盖startup-mode
  'scan.startup.mode' = 'latest-offset'
)
LIKE Orders;
```

生成的表Orders_with_watermark等价于用以下语句创建的表:

```sql
CREATE TABLE Orders_with_watermark (
  `user` BIGINT,
  product STRING,
  order_time TIMESTAMP(3),
  WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH (
  'connector' = 'kafka',
  'scan.startup.mode' = 'latest-offset'
);
```

表特性的合并逻辑可以通过like选项进行控制。

可以控制合并的特性有：

* **CONSTRAINTS**：约束，比如主键和唯一键
* **GENERATED**：计算列
* **METADATA**：元数据列
* **OPTIONS**：描述连接器和格式属性的连接器选项
* **PARTITIONS**：表的分区
* **WATERMARKS**：水印声明

有三种不同的合并策略：

* **INCLUDING**：包含源表的特性，有重复的表项时失败，例如，如果两个表中都存在一个具有相同键的选项。
* **EXCLUDING**：不包含源表的给定特性。
* **OVERWRITING**：包含源表的特性，用新表的属性覆盖源表的重复项，例如，如果两个表中都存在一个具有相同键的选项，则使用当前语句中的选项。

此外，如果没有定义特定的策略，可以使用`INCLUDING/EXCLUDING ALL`选项来指定使用什么策略，例如，如果你使用`EXCLUDING ALL INCLUDING WATERMARKS`，则表示只有源表中的水印会被包含。

例子：

```sql
-- 存储在filesystem中的source表
CREATE TABLE Orders_in_file (
  `user` BIGINT,
  product STRING,
  order_time_string STRING,
  order_time AS to_timestamp(order_time)
)
PARTITIONED BY (`user`)
WITH (
  'connector' = 'filesystem',
  'path' = '...'
);
-- 想存储在kafka中的对应的表
CREATE TABLE Orders_in_kafka (
-- 增加水印定义
WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH (
  'connector' = 'kafka',
  ...
)
LIKE Orders_in_file (
  -- 不包含任何东西，除了需要的水印计算列。
  -- 我们不需要分区和文件系统选项这些kafka不接受的特性。
  EXCLUDING ALL
  INCLUDING GENERATED
);
```

如果没有提供like选项，`INCLUDING ALL OVERWRITING OPTIONS` 将作为默认选项使用。 无法控制物理列归并行为。这些物理列将被合并，就像使用了`INCLUDING`策略一样。

source_table可以是复合标识符。因此，它可以是来自不同catalog或数据库的表，例如：

* my_catalog.my_db.MyTable，指定来自MyCatalog和数据库my_db的表MyTable；
* my_db.MyTable指定来自当前catalog和数据库my_db的表MyTable。

### 案例代码

```sql
-- 读取kafka
CREATE TABLE kafka_bscc_bsnet_sendmsg (
    `time` bigint COMMENT '',
    `endpoint` string NULL COMMENT '主机名',
    `P999_delay` int NULL COMMENT 'P999分位的时延',
    `msg_trace_id` string NULL COMMENT '下发消息的 id',
    `error_count` int NULL COMMENT '业务方错误机器数量'
) with (
    'connector' = 'kafka',
    'topic' = 'this-is-a-topic',
    'properties.bootstrap.servers' = 'broker1:9092,broker2:9092,broker3:9092',
    'properties.group.id' = 'flinkSql.for-test',
    'scan.startup.mode' = 'earliest-offset',
    -- 格式化配置
    'format' = 'json',
    'json.ignore-parse-errors' = 'true',
    'json.encode.decimal-as-plain-number' = 'true'
)
;
```

## CREATE CATALOG

```sql
CREATE CATALOG catalog_name WITH (
    key1=val1, key2=val2, ...
)
```

### 参数说明

| 参数               | 必选  | 默认值     | 类型     | 描述                                                                                                                                            |
|:-----------------|:----|:--------|:-------|:----------------------------------------------------------------------------------------------------------------------------------------------|
| type             | 是   | 无       | string | Catalog 的类型。 创建 HiveCatalog 时，该参数必须设置为'hive'。                                                                                                 |
| hive-conf-dir    | 否   | 无       | string | 指向包含 hive-site.xml 目录的 URI。 该 URI 必须是 Hadoop 文件系统所支持的类型。 <br/>如果指定一个相对 URI，即不包含 scheme，则默认为本地文件系统。如果该参数没有指定，我们会在 class path 下查找hive-site.xml。 |
| default-database | 否   | default | string | 当一个catalog被设为当前catalog时，所使用的默认当前database。                                                                                                     |
| hive-version     | 否   | 无       | string | HiveCatalog 能够自动检测使用的 Hive 版本。我们建议不要手动设置 Hive 版本，除非自动检测机制失败。                                                                                  |
| hadoop-conf-dir  | 否   | 无       | string | Hadoop 配置文件目录的路径。目前仅支持本地文件系统路径。我们推荐使用`HADOOP_CONF_DIR`环境变量来指定 Hadoop 配置。<br/>因此仅在环境变量不满足您的需求时再考虑使用该参数，例如当您希望为每个 HiveCatalog 单独设置 Hadoop 配置时。  |

使用给定的目录属性创建目录。如果已经存在同名的目录，则会引发异常。

**WITH选择**  
用于指定与此目录相关的额外信息的目录属性。表达式key1=val1的键和值都应该是字符串字面值。

**注意，key和value都应该使用英文单引号括起来。**

### 案例代码

```sql
create catalog hive with (
    'type' = 'hive',
    'hadoop-conf-dir' = '/path/to/dir',
    'hive-conf-dir' = '/path/to/dir'
)
;
```

如果用户使用的是内存类型的 catalog ，也就是说没有创建 hive catalog ，则默认的 catalog 名称为`default_catalog`，默认的 database 名称为`default_database`。

在建表时，如果没有单独指定表所属的 catalog 和 database ，则使用上述默认的 catalog 和 database。

建议在建表时，不要指定 catalog 和 database 名称，这样比较方便。

如果用户使用的是 hive 类型的 catalog，也就是用户创建了 hive catalog ，并且使用了创建的 hive catalog（use catalog hive;），
则默认的 catalog 名称为创建的 hive catalog 名称。

比如上面的案例代码，catalog 名称就是`hive`，默认的 database 名称为 default。之后新建的表（非临时表），运行时将会出现在 hive 元数据中。

之后通过 HUE 等连接 hive 的工具，就可以通过`show catete table table_name`语句查看 flink 建表的元信息。

**线上最佳实践**

1. 建议建表时，不指定 catalog 和 database 名称，以减少后续查询 sql 的便捷性。
2. 如果使用了 hive catalog，则建表时，建议创建临时表，这样做有两点好处
    1. 避免任务重启时出现`标已存在`的错误，当然可以添加`if not exist`来避免。
    2. sql 代码中有建表语句，方便随时查看表的字段等信息。
3. 不过在使用了 hive catalog的情况下，建表时创建了非临时表，在开发其他任务时，就可以不用编写建表语句了。

## CREATE DATABASE

```sql
CREATE DATABASE [IF NOT EXISTS] [catalog_name.]db_name
[COMMENT database_comment]
WITH (key1=val1, key2=val2, ...)
```

使用给定的数据库属性创建数据库。如果目录中已经存在同名的数据库，则会引发异常。

**IF NOT EXISTS**  
如果数据库已经存在，则不会发生任何事情。

**WITH OPTIONS**  
用于指定与此数据库相关的额外信息的数据库属性。表达式key1=val1的键和值都应该是字符串字面值。

## CREATE VIEW

```sql
CREATE [TEMPORARY] VIEW [IF NOT EXISTS] [catalog_name.][db_name.]view_name
[( columnName [, columnName ]* )] [COMMENT view_comment]
AS query_expression
```

使用给定的查询表达式创建视图。如果 catalog 中已经存在同名的视图，则会抛出异常。

**TEMPORARY**  
创建具有目录和数据库名称空间并覆盖视图的临时视图。

**IF NOT EXISTS**  
如果视图已经存在，则不会发生任何事情。

创建视图，可以将负责的查询 sql 进行拆分，以获取更好的阅读体验。

## CREATE FUNCTION

```sql
CREATE [TEMPORARY|TEMPORARY SYSTEM] FUNCTION [IF NOT EXISTS] [catalog_name.][db_name.]function_name AS identifier [LANGUAGE JAVA|SCALA|PYTHON]
```

创建一个函数，该函数具有带有标识符和可选语言标记的catalog和数据库名称空间。如果目录中已经存在同名的函数，则会引发异常。

如果语言标记是JAVA/SCALA，则标识符是UDF的完整类路径。关于Java/Scala UDF的实现，请参考用户[自定义函数](../../../../../../docs/flinksql/udf)。

如果语言标记是PYTHON，则标识符是UDF的完全限定名，例如pyflink.table.tests.test_udf.add。

有关Python UDF的实现，请参阅官网，这里暂不列出。

**TEMPORARY**  
创建具有catalog和数据库名称空间并覆盖编目函数的临时编目函数。

**TEMPORARY SYSTEM**  
创建没有命名空间并覆盖内置函数的临时系统函数。

**IF NOT EXISTS**  
如果函数已经存在，则什么也不会发生。

**LANGUAGE JAVA|SCALA|PYTHON**  
用于指导Flink运行时如何执行该函数的语言标记。目前只支持JAVA、SCALA和PYTHON，函数默认语言为JAVA。

### 案例代码

```sql
create temporary function fetch_millisecond as 'cn.com.log.function.udf.time.FetchMillisecond' language java;
```

