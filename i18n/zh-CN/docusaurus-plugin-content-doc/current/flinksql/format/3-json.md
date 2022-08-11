---
id: '3-json'
title: 'JSON'
sidebar_position: 3
---

## 说明

支持：

* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

JSON格式允许基于JSON schema读写JSON格式的数据。目前，JSON schema派生于表schema。

JSON format 支持仅追加流，除非是你使用的连接器明确支持 `retract流` 和/或 `upsert流`，比如 `Upsert Kafka` 连接器。
如果你需要将数据写入 `retract流` 和/或 `upsert流`，建议你使用 CDC format，比如 `Debezium JSON` 和 `Cannal JSON`。

## 依赖

为了使用Json格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-json</artifactId>
    <version>1.13.0</version>
</dependency> 
```

注意自己使用的 flink 版本。

## 使用JSON格式

下面是一个使用Kafka连接器和JSON格式创建表的示例。

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
    'format' = 'json',
    'json.fail-on-missing-field' = 'false',
    'json.ignore-parse-errors' = 'true'
)
```

## Format参数

| 选项                                  | 要求  | 是否可以被转发<br/>*从 flink-1.15.x 开始支持* | 默认值    | 类型      | 描述                                                                                                                                                                                                                                                                                    |
|:------------------------------------|:----|:----------------------------------|:-------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| format                              | 必选  | 否                                 | (none) | String  | 指定使用哪种格式，这儿必须是 **json** 。                                                                                                                                                                                                                                                             |
| json.fail-on-missing-field          | 可选  | 否                                 | false  | Boolean | 如果丢失了schema中指定的属性，是否发生失败。                                                                                                                                                                                                                                                             |
| json.ignore-parse-errors            | 可选  | 否                                 | false  | Boolean | 如果转化错误，直接跳过该属性和行，而不是发生失败。该类型的错误，属性会被设置为**null**。                                                                                                                                                                                                                                      |
| json.timestamp-format.standard      | 可选  | 是                                 | 'SQL'  | String  | 声明输入和输出的时间戳格式。当前支持的格式为**SQL** 以及 **ISO-8601**。<br/>可选参数 **SQL** 将会以 **yyyy-MM-dd HH:mm:ss.s{precision}** 的格式解析时间戳, 例如 **2020-12-30 12:13:14.123** ，且会以相同的格式输出。<br/>可选参数 **ISO-8601** 将会以 **yyyy-MM-ddTHH:mm:ss.s{precision}** 的格式解析输入时间戳, 例如 **2020-12-30T12:13:14.123** ，且会以相同的格式输出。 |
| json.map-null-key.mode              | 可选  | 是                                 | 'FAIL' | String  | 指定匹配数据时序列化键为null的处理模式。目前支持：**FAIL**、**DROP**、**LITERAL**。<br/>**FAIL**：遇到null键匹配时抛出异常。<br/>**DROP**：遇到null键匹配时丢弃数据。<br/>**LITERAL**：替换null键为字符串字面量。字符串字面量通过 **json.map-null-key.literal** 选项定义。                                                                                       |
| json.map-null-key.literal           | 可选  | 是                                 | 'null' | String  | 当设置 **json.map-null-key.mode** 选项为 **LITERAL** 时，指定代替null键的字符串字面量。<br/>如果设置为 **null** ，则表的schema字段名null就会和实际JSON数据中的 null 键进行匹配；<br/>如果设置为 **null-key** ，则表的schema字段名null-key就会和实际JSON数据中的 null 键进行匹配。                                                                                |
| json.encode.decimal-as-plain-number | 可选  | 是                                 | false  | Boolean | 编码所有的数字为普通数字而不是科学计数法数字。<br/>默认情况改下，数据可能会使用科学计数法，比如：`0.000000027`会被默认编码为`2.7E-8`。如果设置这个选项为`true`，则会编码为`0.000000027`。                                                                                                                                                                   |

## 数据类型匹配

目前，JSON schema总是派生于表schema。目前还不支持直接显式定义JSON schema。

Flink JSON格式使用`jackson databind API`解析和生成JSON字符串。

下表列出了从Flink类型到JSON类型的类型映射。

| Flink SQL type                 | JSON type                      |
|:-------------------------------|:-------------------------------|
| CHAR / VARCHAR / STRING        | string                         |
| BOOLEAN                        | boolean                        |
| BINARY / VARBINARY             | base64 编码的字符串                  |
| DECIMAL                        | number                         |
| TINYINT                        | number                         |
| SMALLINT                       | number                         |
| INT                            | number                         |
| BIGINT                         | number                         |
| FLOAT                          | number                         |
| DOUBLE                         | number                         |
| DATE                           | date 格式的字符串                    |
| TIME                           | time 格式的字符串                    |
| TIMESTAMP                      | date-time 格式的字符串               |
| TIMESTAMP_WITH_LOCAL_TIME_ZONE | date-time 格式的字符串，使用 **UTC** 时区 |
| INTERVAL                       | number                         |
| ARRAY                          | array                          |
| MAP / MULTISET                 | object                         |
| ROW                            | object                         |