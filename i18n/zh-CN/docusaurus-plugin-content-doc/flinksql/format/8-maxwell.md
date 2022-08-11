---
id: '8-maxwell'
title: 'Maxwell'
sidebar_position: 8
---

## 说明

支持：

* Changelog-Data-Capture Format CDC
* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

Maxwell是一个CDC (Changelog变更数据捕捉)工具，可以实时从MySQL流到Kafka, Kinesis和其他流连接器。Maxwell为变更日志提供了统一的数据格式，并支持使用 JSON 序列化消息。

Flink支持将Maxwell JSON消息解释为`INSERT/UPDATE/DELETE`消息到Flink SQL系统中。在许多情况下，这个特性是很有用的，例如

* 将增量数据从数据库同步到其他系统
* 日志审计
* 数据库的实时物化视图
* 关联维度数据库的变更历史，等等

Flink还支持将Flink SQL中的`INSERT/UPDATE/DELETE`消息编码为`Maxwell JSON`消息，并发送到Kafka等外部系统。
但是，目前Flink还不能将`UPDATE_BEFORE`和`UPDATE_AFTER`合并成一个单独的`UPDATE`消息。因此，Flink将`UPDATE_BEFORE`和`UDPATE_AFTER`编码为`DELETE`和`INSERT` Maxwell消息。

## 依赖

为了使用Maxwell格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-json</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 版本。

注意:关于如何用Maxwell JSON同步changelog流到Kafka主题，请参考[Maxwell文档](http://maxwells-daemon.io/quickstart/)。

## 使用Maxwell格式

Maxwell为changelog流提供了统一的格式，下面是一个简单的例子，用于从JSON格式的MySQL products表中获取更新操作。

```json
{
  "database": "test",
  "table": "e",
  "type": "insert",
  "ts": 1477053217,
  "xid": 23396,
  "commit": true,
  "position": "master.000006:800911",
  "server_id": 23042,
  "thread_id": 108,
  "primary_key": [
    1,
    "2016-10-21 05:33:37.523000"
  ],
  "primary_key_columns": [
    "id",
    "c"
  ],
  "data": {
    "id": 111,
    "name": "scooter",
    "description": "Big 2-wheel scooter",
    "weight": 5.15
  },
  "old": {
    "weight": 5.18
  }
}
```

注意:关于每个字段的含义，请参考[Maxwell文档](http://maxwells-daemon.io/quickstart/)。

MySQL products表有4列id, name, description 和weight)。
上面的JSON消息是products表上的更新更改事件，其中id = 111行的weight值从`5.18`更改为`5.15`。
假设这个消息同步到Kafka主题products_binlog，则可以使用下面的DDL来消费这个主题并解释变化事件。

```sql
CREATE TABLE topic_products (
    -- schema和MySQL的"products"表完全一致
    id BIGINT,
    name STRING,
    description STRING,
    weight DECIMAL(10, 2)
) WITH (
    'connector' = 'kafka',
    'topic' = 'products_binlog',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'format' = 'maxwell-json'
)
```

将主题注册为Flink表之后，就可以将Maxwell消息作为更改日志源使用了。

```sql
-- 关于MySQL "products" 表的实时物化视图
-- 计算相同产品的最新平均重量
SELECT name, AVG(weight) FROM topic_products GROUP BY name;

-- 将 MySQL "products" 表的所有数据和增量更改同步到 Elasticsearch "products" 索引以供将来搜索
INSERT INTO elasticsearch_products
SELECT * FROM topic_products;
```

## 可用元数据

**从 flink-1.14.x 开始支持。**

下面的 format 元数据可以在表定义的**只读虚拟（VIRTUAL）列**中使用。

注意：只有在对应的连接器可以传递 format 元数据时，format 元数据属性才可用。目前，只有 kafka 连接器可以暴露元数据属性到他的 value format。

| Key	                 | 数据类型                   | 	描述                                                    |
|:---------------------|:-----------------------|:-------------------------------------------------------|
| database	            | STRING NULL	           | 原始数据库名称，如果可用，则对应于 Maxwell 数据中的`database`字段。            |
| table	               | STRING NULL	           | 原始数据库表名称，如果可用，则对应于 Maxwell 数据中的`table`字段。              |
| primary-key-columns	 | `ARRAY<STRING> NULL`   | 	主键名称数组，如果可用，则对应于 Maxwell 数据中的`primary_key_columns`属性。 |
| ingestion-timestamp	 | TIMESTAMP_LTZ(3) NULL	 | 连接器处理事件的时间戳。如果可用，则对应于 Maxwell 数据中的 `ts` 属性。            |

下面的案例展示如果访问 kafka 中 Maxwell 元数据属性：

```sql
CREATE TABLE KafkaTable (
    origin_database STRING METADATA FROM 'value.database' VIRTUAL,
    origin_table STRING METADATA FROM 'value.table' VIRTUAL,
    origin_primary_key_columns ARRAY<STRING> METADATA FROM 'value.primary-key-columns' VIRTUAL,
    origin_ts TIMESTAMP(3) METADATA FROM 'value.ingestion-timestamp' VIRTUAL,
    user_id BIGINT,
    item_id BIGINT,
    behavior STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_behavior',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'scan.startup.mode' = 'earliest-offset',
    'value.format' = 'maxwell-json'
);
```

## Format参数

| 选项                                          | 	要求  | 	默认     | 	类型      | 	描述                                                                                                                                                                                                                                                                          |
|:--------------------------------------------|:-----|:--------|:---------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| format                                      | 	必选	 | (none)	 | String	  | 指定要使用的格式，此处应为 **maxwell-json** 。                                                                                                                                                                                                                                             |
| maxwell-json.ignore-parse-errors	           | 可选   | 	false	 | Boolean  | 	当解析异常时，是跳过当前字段或行，还是抛出错误失败（默认为 false，即抛出错误失败）。如果忽略字段的解析异常，则会将该字段值设置为null。                                                                                                                                                                                                    |
| maxwell-json.timestamp-format.standard	     | 可选   | 	'SQL'  | 	String	 | 指定输入和输出时间戳格式。当前支持的值是 **SQL** 和 **ISO-8601**。<br/> **SQL**：将解析 **yyyy-MM-dd HH:mm:ss.s{precision}** 格式的输入时间戳，例如 '**2020-12-30 12:13:14.123**'，并以相同格式输出时间戳。<br/> **ISO-8601**：将解析 **yyyy-MM-ddTHH:mm:ss.s{precision}** 格式的输入时间戳，例如 '**2020-12-30T12:13:14.123**'，并以相同的格式输出时间戳。 |
| maxwell-json.map-null-key.mode	             | 可选   | 	'FAIL' | 	String  | 	指定处理 Map 中 key 值为空的方法. 当前支持的值有 **FAIL**, **DROP** 和 **LITERAL**。<br/> **FAIL**：如果遇到 Map 中 key 值为空的数据，将抛出异常。<br/>**DROP**：将丢弃 Map 中 key 值为空的数据项。<br/>**LITERAL**： 将使用字符串常量来替换 Map 中的空 key 值。字符串常量的值由 **canal-json.map-null-key.literal** 定义。                                 |
| maxwell-json.map-null-key.literal           | 	可选  | 	'null' | 	String  | 	当 **canal-json.map-null-key.mode** 是 **LITERAL** 的时候，指定字符串常量替换 Map 中的空 key 值。                                                                                                                                                                                               |
| maxwell-json.encode.decimal-as-plain-number | 	可选  | 	false	 | Boolean  | 	将所有 DECIMAL 类型的数据保持原状，不使用科学计数法表示。例：`0.000000027` 默认会表示为 `2.7E-8`。当此选项设为 true 时，则会表示为 `0.000000027`。                                                                                                                                                                         |