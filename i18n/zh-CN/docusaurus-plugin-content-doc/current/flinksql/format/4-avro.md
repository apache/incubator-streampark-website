---
id: '4-avro'
title: 'AVRO'
sidebar_position: 4
---

## 说明

支持：

* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

Apache Avro格式允许基于Avro schema读写Avro格式的数据。目前，Avro schema派生于表schema。

## 依赖

为了使用Avro格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-sql-avro</artifactId>
    <version>1.13.0</version>
</dependency> 
```

注意自己所使用的 flink 的版本。

## 使用AVRO格式

下面是一个使用Kafka连接器和Avro格式创建表的例子。

```sql
CREATE TABLE user_behavior (
    user_id BIGINT,
    item_id BIGINT,
    category_id BIGINT,
    behavior STRING,
    ts TIMESTAMP(3)
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_behavior',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'format' = 'avro'
)
```

## Format参数

| 选项         | 要求  | 是否可以被转发<br/>*从 flink-1.15.x 开始支持* | 默认值    | 类型     | 描述                                                                                     |
|:-----------|:----|:----------------------------------|:-------|:-------|:---------------------------------------------------------------------------------------|
| format     | 必选  | 否                                 | (none) | String | 指定使用哪种格式，这儿应该是 **avro** 。                                                              |
| avro.codec | 可选  | 是                                 | (none) | String | 只用于`Filesystem`文件系统，指定avro的压缩格式。默认没有压缩。可用的枚举有：**deflate**、**snappy**、**bzip2**、**xz**。 |

## 数据类型匹配

目前，Avro schema总是派生于表schema。目前还不支持直接显式定义Avro schema。下表列出了从Flink类型到Avro类型的类型映射。

| Flink SQL 类型                                | Avro 类型 | Avro 逻辑类型        |
|:--------------------------------------------|:--------|:-----------------|
| CHAR / VARCHAR / STRING                     | string  ||
| BOOLEAN                                     | boolean ||
| BINARY / VARBINARY                          | bytes   ||
| DECIMAL                                     | fixed   | decimal          |
| TINYINT                                     | int     ||
| SMALLINT                                    | int     ||
| INT                                         | int     ||
| BIGINT                                      | long    ||
| FLOAT                                       | float   ||
| DOUBLE                                      | double  ||
| DATE                                        | int     | date             |
| TIME                                        | int     | time-millis      |
| TIMESTAMP                                   | long    | timestamp-millis |
| ARRAY                                       | array   ||
| MAP<br/>(key 必须是 string/char/varchar 类型)    | map     ||
| MULTISET<br/>(元素必须是 string/char/varchar 类型) | map     ||
| ROW                                         | record  ||

除了上面列出的类型外，Flink还支持读写可空类型。Flink将可为空的类型映射到Avro联合(某值，null)，其中某值是从Flink类型转换而来的Avro类型。  

有关Avro类型的更多信息，可以参考[Avro规范](https://avro.apache.org/docs/current/spec.html)。