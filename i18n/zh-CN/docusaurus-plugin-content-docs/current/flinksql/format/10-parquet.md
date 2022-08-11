---
id: '10-parquet'
title: 'Parquet'
sidebar_position: 10
---

## 说明

支持：

* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

[Apache Parquet](https://parquet.apache.org/) 格式允许读写 Parquet 数据.

## 依赖

为了使用Parquet格式，使用自动化构建工具(如Maven或SBT)的项目和使用SQL JAR包的SQL Client都需要以下依赖项。

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-parquet_2.11</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 和 scala 版本。

## 使用Parquet格式

以下为用 Filesystem 连接器和 Parquet 格式创建表的示例：

```sql
CREATE TABLE user_behavior (
user_id BIGINT,
    item_id BIGINT,
    category_id BIGINT,
    behavior STRING,
    ts TIMESTAMP(3),
    dt STRING
) PARTITIONED BY (dt) WITH (
    'connector' = 'filesystem',
    'path' = '/tmp/user_behavior',
    'format' = 'parquet'
)
```

## Format 参数

| 参数                   | 	是否必须	 | 默认值      | 	类型      | 	描述                                                                                     |
|:---------------------|:-------|:---------|:---------|:----------------------------------------------------------------------------------------|
| format               | 	必选    | 	(none)	 | String	  | 指定使用的格式，此处应为 **parquet** 。                                                              |
| parquet.utc-timezone | 	可选    | 	false	  | Boolean	 | 使用 UTC 时区或本地时区在纪元时间和 LocalDateTime 之间进行转换。Hive 0.x/1.x/2.x 使用本地时区，但 Hive 3.x 使用 UTC 时区。 |

Parquet 格式也支持 `ParquetOutputFormat` 的配置。 例如, 可以配置 `parquet.compression=GZIP` 来开启 gzip 压缩。

## 数据类型映射

目前，Parquet 格式类型映射与 Apache Hive 兼容，但与 Apache Spark 有所不同：

* Timestamp：不参考精度，直接映射 timestamp 类型至 int96。
* Decimal：根据精度，映射 decimal 类型至固定长度字节的数组。

下表列举了 Flink 中的数据类型与 JSON 中的数据类型的映射关系。

| Flink 数据类型                        | 	Parquet 类型           | 	Parquet 逻辑类型 |
|:----------------------------------|:----------------------|:--------------|
| CHAR / VARCHAR / STRING           | 	BINARY	              | UTF8          |
| BOOLEAN	                          | BOOLEAN               | 	             |
| BINARY / VARBINARY                | 	BINARY               | 	             |
| DECIMAL                           | 	FIXED_LEN_BYTE_ARRAY | DECIMAL       |
| TINYINT                           | 	INT32                | 	INT_8        |
| SMALLINT                          | 	INT32	               | INT_16        |
| INT                               | 	INT32                | 	             |
| BIGINT                            | 	INT64                | 	             |
| FLOAT                             | 	FLOAT                | 	             |
| DOUBLE                            | 	DOUBLE               | 	             |
| DATE                              | 	INT32	               | DATE          |
| TIME                              | 	INT32	               | TIME_MILLIS   |
| TIMESTAMP                         | 	INT96                | 	             |
| **从 flink-1.15.x 开始支持**<br/>ARRAY | 	                     | 	LIST         |
| **从 flink-1.15.x 开始支持**<br/>MAP   | 	                     | 	MAP          |
| **从 flink-1.15.x 开始支持**<br/>ROW   | 	                     | 	STRUCT       |

注意

**flink-1.13.x**：暂不支持复合数据类型（Array、Map 与 Row）。
**flink-1.15.x**：复合数据类型（Array、Map 与 Row）只支持写，还不支持读。