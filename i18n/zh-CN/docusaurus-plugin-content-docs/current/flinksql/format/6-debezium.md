---
id: '6-debezium'
title: 'Debezium'
sidebar_position: 6
---

## 说明

支持：

* Changelog-Data-Capture CDC
* Format Format: Serialization 序列化格式
* Schema Format: Deserialization Schema 反序列化格式

Debezium 是一个 CDC（Changelog Data Capture，变更数据捕获）工具，可以把来自 `MySQL`、`PostgreSQL`、`Oracle`、`Microsoft SQL Server`
和许多其他数据库的更改实时流传输到 Kafka 中。
Debezium 为变更日志提供了统一的格式结构，并支持使用 `JSON` 和 `Apache Avro` 序列化消息。

Flink 支持将 `Debezium JSON` 和 `Avro` 消息解析为 `INSERT / UPDATE / DELETE` 消息到 Flink SQL 系统中。在很多情况下，这个特性非常有用，例如

* 将增量数据从数据库同步到其他系统
* 日志审计
* 数据库的实时物化视图
* 关联维度数据库的变更历史，等等

Flink 还支持将 Flink SQL 中的 `INSERT / UPDATE / DELETE` 消息编码为 `Debezium` 格式的 `JSON` 或 `Avro` 消息，输出到 Kafka 等存储中。
但需要注意的是，目前 Flink 还不支持将 `UPDATE_BEFORE` 和 `UPDATE_AFTER` 合并为一条 `UPDATE` 消息。
因此，Flink 将 `UPDATE_BEFORE` 和 `UPDATE_AFTER` 分别编码为 `DELETE` 和 `INSERT` 类型的 `Debezium` 消息。

## 依赖

**Debezium Avro**

为了使用Debezium格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-avro-confluent-registry</artifactId>
    <version>1.13.0</version>
</dependency>
```

**Debezium Json**

为了使用Debezium格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-json</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 版本。

注意: 请参考 [Debezium](https://debezium.io/documentation/reference/1.3/index.html) 文档，
了解如何设置 Debezium Kafka Connect 用来将变更日志同步到 Kafka 主题。

## 使用 Debezium Format

Debezium 为变更日志提供了统一的格式，下面是一个 JSON 格式的从 MySQL product 表捕获的更新操作的简单示例：

```json
{
  "before": {
    "id": 111,
    "name": "scooter",
    "description": "Big 2-wheel scooter",
    "weight": 5.18
  },
  "after": {
    "id": 111,
    "name": "scooter",
    "description": "Big 2-wheel scooter",
    "weight": 5.15
  },
  "source": {
    ...
  },
  "op": "u",
  "ts_ms": 1589362330904,
  "transaction": null
}
```

注意: 参考 [Debezium 文档](https://debezium.io/documentation/reference/1.3/index.html)，了解每个字段的含义。

MySQL product表有4列（id、name、description、weight）。上面的 JSON 消息是 products 表上的一条更新事件，
其中 id = 111 的行的 weight 值从 5.18 更改为 5.15。假设此消息已同步到 Kafka 主题 products_binlog 中，则可以使用以下 DDL 来读取此主题并解析更改事件。

```sql
CREATE TABLE topic_products (
    -- schema 与 MySQL 的 products 表完全相同
    id BIGINT,
    name STRING,
    description STRING,
    weight DECIMAL(10, 2)
) WITH (
    'connector' = 'kafka',
    'topic' = 'products_binlog',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    -- 使用 'debezium-json' format 来解析 Debezium 的 JSON 消息
    -- 如果 Debezium 用 Avro 编码消息，请使用 'debezium-avro-confluent'
    'format' = 'debezium-json'  -- 如果 Debezium 用 Avro 编码消息，请使用 'debezium-avro-confluent'
)
```

在某些情况下，用户在设置 Debezium Kafka Connect 时，可能会开启 Kafka 的配置 **value.converter.schemas.enable** ，用来在消息体中包含 schema 信息。
然后，Debezium JSON 消息可能如下所示：

```json
{
  "schema": {
    ...
  },
  "payload": {
    "before": {
      "id": 111,
      "name": "scooter",
      "description": "Big 2-wheel scooter",
      "weight": 5.18
    },
    "after": {
      "id": 111,
      "name": "scooter",
      "description": "Big 2-wheel scooter",
      "weight": 5.15
    },
    "source": {
      ...
    },
    "op": "u",
    "ts_ms": 1589362330904,
    "transaction": null
  }
}
```

为了解析这类消息，需要在上述 DDL WITH 子句中添加选项 **'debezium-json.schema-include' = 'true'**（默认为 false）。
建议不要包含 schema 的描述，因为这样会使消息变得非常冗长，并降低解析性能。

在将主题注册为 Flink 表之后，可以将 Debezium 消息用作变更日志源。

```sql
-- MySQL "products" 的实时物化视图
-- 计算相同产品的最新平均重量
SELECT name, AVG(weight) FROM topic_products GROUP BY name;

-- 将 MySQL "products" 表的所有数据和增量更改同步到
-- Elasticsearch "products" 索引，供将来查找
INSERT INTO elasticsearch_products
SELECT * FROM topic_products;
```

## 可用的元数据

以下format元数据可以在表定义中作为**只读虚拟(VIRTUAL)列**。

注意：只有在对应的连接器可以传递 format 元数据时，format 元数据属性才可用。目前，只有 kafka 连接器可以暴露元数据属性到他的 value format。

| 键                   | 数据类型                     | 描述                                                    |
|:--------------------|:-------------------------|:------------------------------------------------------|
| schema              | STRING NULL              | payload中JSON格式的schema。如果Debezium数据中不包含schema，则返回NULL。 |
| ingestion-timestamp | TIMESTAMP_LTZ(3) NULL    | 连接器处理时间的时间戳。和Debezium数据中的`ts_ms`属性一致。                 |
| source.timestamp    | TIMESTAMP_LTZ(3)  NULL   | source系统创建事件的时间戳。和Debezium数据中的`source.ts_ms`属性一致。     |
| source.database     | STRING NULL              | 原始数据库名称。和Debezium数据中的`source.db`属性一致。                 |
| source.schema       | STRING NULL              | 原始数据库的schema。和Debezium数据中的`source.schema`属性一致。        |
| source.table        | STRING NULL              | 原始数据库表名。和Debezium数据中的 `source.collection` 属性一致。       |
| source.properties   | MAP<STRING, STRING> NULL | source源的属性表。和Debezium数据中的`source`属性一致。                |

下面的例子展示了如何在Kafka中访问Debezium元数据字段：

```sql
CREATE TABLE KafkaTable (
    origin_ts TIMESTAMP(3) METADATA FROM 'value.ingestion-timestamp' VIRTUAL,
    event_time TIMESTAMP(3) METADATA FROM 'value.source.timestamp' VIRTUAL,
    origin_database STRING METADATA FROM 'value.source.database' VIRTUAL,
    origin_schema STRING METADATA FROM 'value.source.schema' VIRTUAL,
    origin_table STRING METADATA FROM 'value.source.table' VIRTUAL,
    origin_properties MAP<STRING, STRING> METADATA FROM 'value.source.properties' VIRTUAL,
    user_id BIGINT,
    item_id BIGINT,
    behavior STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_behavior',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'scan.startup.mode' = 'earliest-offset',
    'value.format' = 'debezium-json'
);
```

## format参数

Flink 提供了 `debezium-avro-confluent` 和 `debezium-json` 两种 format 来解析 Debezium 生成的 JSON 格式和 Avro 格式的消息。 
请使用 `debezium-avro-confluent` 来解析 Debezium 的 `Avro` 消息，使用 `debezium-json` 来解析 Debezium 的 `JSON` 消息。

**Debezium Avro**

| 参数                                                                                                                    | 是否必选 | 默认值    | 类型     | 描述                                                                                                                                                                                |
|:----------------------------------------------------------------------------------------------------------------------|:-----|:-------|:-------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| format                                                                                                                | 必选   | (none) | String | 指定使用哪个format，这儿应该是 **debezium-avro-confluent** 。                                                                                                                                  |
| debezium-avro-confluent.basic-auth.credentials-source                                                                 | 可选   | (none) | String | Basic auth credentials source for Schema Registry                                                                                                                                 |
| debezium-avro-confluent.basic-auth.user-info                                                                          | 可选   | (none) | String | Basic auth user info for schema registry                                                                                                                                          |
| debezium-avro-confluent.bearer-auth.credentials-source                                                                | 可选   | (none) | String | Bearer auth credentials source for Schema Registry                                                                                                                                |
| debezium-avro-confluent.bearer-auth.token                                                                             | 可选   | (none) | String | Bearer auth token for Schema Registry                                                                                                                                             |
| **从 flink-1.14.x 开始支持**<br/>debezium-avro-confluent.properties                                                        | 可选   | (none) | Map    | 转发到下面 schema 注册的属性 map 表，这对于没有通过Flink配置选项正式公开的选项很有用，但是 Flink 选项拥有更高的优先级。                                                                                                          |
| debezium-avro-confluent.ssl.keystore.location                                                                         | 可选   | (none) | String | Location / File of SSL keystore                                                                                                                                                   |
| debezium-avro-confluent.ssl.keystore.password                                                                         | 可选   | (none) | String | Password for SSL keystore                                                                                                                                                         |
| debezium-avro-confluent.ssl.truststore.location                                                                       | 可选   | (none) | String | Location / File of SSL truststore                                                                                                                                                 |
| debezium-avro-confluent.ssl.truststore.password                                                                       | 可选   | (none) | String | Password for SSL truststore                                                                                                                                                       |
| **flink-1.13.x**：debezium-avro-confluent.schema-registry.subject<br/>**flink-1.14.x**：debezium-avro-confluent.subject | 可选   | (none) | String | Confluent模式注册中心主题，在该主题下注册此格式在序列化期间使用的schema。<br/>默认情况下，`kafka`和`upsert-kafka`连接器使用`<topic_name>-value`或`<topic_name>-key`作为默认主题名。但对于其他连接器(例如:`filesystem`)，当用作接收器时，subject选项是必需的。 |
| **flink-1.14.x**：debezium-avro-confluent.schema-registry.url<br/>**flink-1.14.x**：debezium-avro-confluent.url         | 必选   | (none) | String | Confluent Schema Registry 获取/注册 schema 的URL.                                                                                                                                      |

**Debezium Json**

| 参数                                           | 是否必选 | 默认值    | 类型      | 描述                                                                                                                                                                                                                                                                                          |
|:---------------------------------------------|:-----|:-------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| format                                       | 必选   | (none) | String  | 指定要使用的格式，此处应为 **debezium-json** 。                                                                                                                                                                                                                                                           |
| debezium-json.schema-include                 | 可选   | false  | Boolean | 设置 Debezium Kafka Connect 时，用户可以启用 Kafka 配置 `value.converter.schemas.enable` 以在消息中包含 schema。此选项表明 Debezium JSON 消息是否包含 schema。                                                                                                                                                              |
| debezium-json.ignore-parse-errors            | 可选   | false  | Boolean | 当解析异常时，是跳过当前字段或行，还是抛出错误失败（默认为**false**，即抛出错误失败）。如果忽略字段的解析异常，则会将该字段值设置为null。                                                                                                                                                                                                                 |
| debezium-json.timestamp-format.standard      | 可选   | 'SQL'  | String  | 声明输入和输出的时间戳格式。当前支持的格式为 **SQL** 以及 '**ISO-8601**'。<br/>可选参数 **SQL** 将会以 **yyyy-MM-dd HH:mm:ss.s{precision}** 的格式解析时间戳, 例如 '**2020-12-30 12:13:14.123**'，且会以相同的格式输出。<br/>可选参数 **ISO-8601** 将会以 **yyyy-MM-ddTHH:mm:ss.s{precision}** 的格式解析输入时间戳, 例如 '**2020-12-30T12:13:14.123**' ，且会以相同的格式输出。 |
| debezium-json.map-null-key.mode              | 选填   | 'FAIL' | String  | 指定处理 Map 中 key 值为空的方法. 当前支持的值有 **FAIL** , **DROP** 和 **LITERAL** 。<br/> **FAIL** 如果遇到 Map 中 key 值为空的数据，将抛出异常。<br/> **DROP** 将丢弃 Map 中 key 值为空的数据项。<br/> **LITERAL** 将使用字符串常量来替换 Map 中的空 key 值。<br/>字符串常量的值由 **debezium-json.map-null-key.literal** 定义。                                      |
| debezium-json.map-null-key.literal           | 选填   | 'null' | String  | 当 'debezium-json.map-null-key.mode' 是 LITERAL 的时候，指定字符串常量替换 Map中的空 key 值。                                                                                                                                                                                                                   |
| debezium-json.encode.decimal-as-plain-number | 选填   | false  | Boolean | 将所有 DECIMAL 类型的数据保持原状，不使用科学计数法表示。例：`0.000000027` 默认会表示为 `2.7E-8`。当此选项设为 **true** 时，则会表示为 `0.000000027`。                                                                                                                                                                                     |