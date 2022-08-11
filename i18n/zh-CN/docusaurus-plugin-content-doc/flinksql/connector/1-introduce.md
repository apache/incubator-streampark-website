---
id: '1-introduce'
title: '简介'
sidebar_position: 1
---

## 介绍

Flink的Table API和SQL程序可以连接到其他外部系统，用于读写批处理表和流处理表。
表source提供对存储在外部系统(如数据库、键值存储、消息队列或文件系统)中数据的访问。表sink向外部存储系统发送数据。根据source和sink的类型，它们支持不同的格式，如**CSV**、**Avro**、**Parquet**或**ORC**。

本节描述如何使用内置的连接器在Flink中注册表source和表sink。注册source或sink后，可以通过表API和SQL语句访问它。

如果你实现自己的自定义表source或sink，请查看自定义source和sink连接器页面。

## 支持的连接器

Flink内置各种连接器。下表列出了所有可用的连接器。

| Name	                       | Version	                                                                                                                                        | Source                                 | 	Sink                       |
|:----------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------|:----------------------------|
| Filesystem	                 | 	                                                                                                                                               | Bounded and Unbounded Scan, Lookup	    | Streaming Sink, Batch Sink  |
| Elasticsearch               | 	6.x & 7.x	                                                                                                                                     | Not supported                          | 	Streaming Sink, Batch Sink |
| Apache Kafka                | 	0.10+	                                                                                                                                         | Unbounded Scan	                        | Streaming Sink, Batch Sink  |
| Amazon Kinesis Data Streams | 		Unbounded Scan                                                                                                                                | 	Streaming Sink                        |                             |
| JDBC	                       | 	Bounded Scan, Lookup	                                                                                                                          | Streaming Sink, Batch Sink             |                             |
| Apache HBase                | 	1.4.x & 2.2.x	                                                                                                                                 | Bounded Scan, Lookup	                  | Streaming Sink, Batch Sink  |
| Apache Hive	                | [Supported Versions](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/connectors/table/hive/overview/#supported-hive-versions) | 	Unbounded Scan, Bounded Scan, Lookup	 | Streaming Sink, Batch Sink  |

## 使用连接器

Flink支持使用`SQL CREATE TABLE`语句来注册表。可以定义表名、表schema和用于连接外部系统的表选项。

有关创建表的更多信息，请参阅[语法](../syntax/4-create)部分。

下面的代码展示了如何连接到Kafka来读写JSON格式记录的完整示例。

```sql
CREATE TABLE MyUserTable (
    -- 声明表的schema
    `user` BIGINT,
    `message` STRING,
    `rowtime` TIMESTAMP(3) METADATA FROM 'timestamp',    -- 使用元数据字段来访问kafka数据的timestamp时间戳
    `proctime` AS PROCTIME(),    -- 使用计算列来定义处理时间属性
    WATERMARK FOR `rowtime` AS `rowtime` - INTERVAL '5' SECOND    -- 使用WATERMARK语句定义rowtime属性
) WITH (
    -- 定义连接的外部系统属性
    'connector' = 'kafka',
    'topic' = 'topic_name',
    'scan.startup.mode' = 'earliest-offset',
    'properties.bootstrap.servers' = 'localhost:9092',
    'format' = 'json'   -- 声明这个外部系统使用format
);
```

所需的连接属性被转换为基于字符串的键值对。工厂将基于工厂标识符(本例中是kafka和json)从键值对中创建配置好的表source、表sink和相应的format格式。
在为每个组件搜索一个匹配的工厂时，会考虑所有可以通过Java的服务提供者接口(SPI)找到的工厂。

如果找不到任何工厂或找到了多个与给定属性匹配的工厂，则将抛出一个异常，并提供有关可以使用的工厂和受支持属性的附加信息。

## schema匹配

SQL `CREATE TABLE`语句的body子句定义了物理列、约束、水印的名称和类型。Flink不保存数据，因此schema定义仅声明如何将物理列从外部系统映射到Flink。
映射可能不是按名称一一对应的，这取决于格式和连接器的实现。例如，MySQL数据库表是按字段名(不区分大小写)映射的，CSV文件系统是按字段顺序映射的(字段名可以是任意的)。这些规则将根据对应的连接器来解析。

下面的示例展示了一个简单的schema，其中没有时间属性、输入/输出到表列的一对一字段映射。

```sql
CREATE TABLE MyTable (
    MyField1 INT,
    MyField2 STRING,
    MyField3 BOOLEAN
) WITH (
    ...
)
```

### 元数据

一些连接器和格式公开了附加的元数据字段，可以在物理列后面的元数据列中访问这些字段。有关元数据列的更多信息，请参阅[CREATE TABLE](../syntax/4-create)部分。

### 主键

主键约束表明表中的一列或一组列是唯一的，并且它们不包含NULL值。主键唯一地标识表中的一行。

source表的主键用于优化元数据信息。sink表的主键通常用于插入更新数据。

SQL标准指定主键约束可以是`ENFORCED`的，也可以是`NOT ENFORCED`的。这将控制是否对传入/传出数据执行约束检查。
Flink本身并不拥有数据，因此唯一支持的模式是**NOT ENFORCED**模式。确保查询执行的主键强制约束由用户实现。

```sql
CREATE TABLE MyTable (
    MyField1 INT,
    MyField2 STRING,
    MyField3 BOOLEAN,
    PRIMARY KEY (MyField1, MyField2) NOT ENFORCED  -- 根据字段定义主键列
) WITH (
    ...
)
```

### 时间属性

在处理无界流表时，时间属性是必不可少的。因此，`proctime`和`rowtime`属性都可以定义为schema的一部分。

有关Flink中的时间处理(尤其是事件时间)的更多信息，建议参阅[事件时间](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/dev/table/concepts/time_attributes/)部分。

#### 处理时间属性

为了在模式中声明`proctime`属性，可以使用计算列语法声明一个由`proctime()`内置函数生成的计算列。计算列是不存储在物理数据中的虚拟列。

```sql
CREATE TABLE MyTable (
    MyField1 INT,
    MyField2 STRING,
    MyField3 BOOLEAN
    MyField4 AS PROCTIME() -- 定义一个处理时间属性列
) WITH (
    ...
)
```

#### rowtime时间属性

为了控制表的事件时间行为，Flink提供了预定义的时间戳提取器和水印策略。

有关在DDL中定义时间属性的更多信息，请参阅[CREATE TABLE](../syntax/4-create)语句。

支持以下时间戳提取器：

```sql
-- 使用已存在的TIMESTAMP(3)类型的字段作为事件时间属性
CREATE TABLE MyTable (
    ts_field TIMESTAMP(3),
    WATERMARK FOR ts_field AS ...
) WITH (
    ...
)

-- 使用系统函数、UDF、表达式来提取期望的TIMESTAMP(3)类型的事件时间属性
CREATE TABLE MyTable (
    log_ts STRING,
    ts_field AS TO_TIMESTAMP(log_ts),
    WATERMARK FOR ts_field AS ...
) WITH (
    ...
)
```

支持的水印策略如下：

```sql
-- 为严格升序的事件时间属性设置水印策略。发出到目前为止观察到的最大时间戳水印。时间戳大于最大时间戳的行不属于延迟。
CREATE TABLE MyTable (
    ts_field TIMESTAMP(3),
    WATERMARK FOR ts_field AS ts_field
) WITH (
    ...
)

-- 设置升序事件时间属性的水印策略。发出到目前为止观察到的最大时间戳减去1的水印。时间戳大于或等于最大时间戳的行不属于延迟。
CREATE TABLE MyTable (
    ts_field TIMESTAMP(3),
    WATERMARK FOR ts_field AS ts_field - INTERVAL '0.001' SECOND
) WITH (
    ...
)

-- 为事件时间属性设置水印策略，这些事件时间属性在有限的时间间隔内是无序的。发出的水印是观察到的最大时间戳减去指定的延迟，例如2秒。
CREATE TABLE MyTable (
    ts_field TIMESTAMP(3),
    WATERMARK FOR ts_field AS ts_field - INTERVAL '2' SECOND
) WITH (
    ...
)
```

一定要同时声明时间戳和水印。触发基于时间的操作需要水印。

### SQL字段类型

请参阅[数据类型](../4-data-type)章节，了解如何在SQL中声明类型。