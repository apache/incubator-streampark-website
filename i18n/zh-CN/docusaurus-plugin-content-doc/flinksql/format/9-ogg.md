---
id: '9-ogg'
title: 'Ogg'
sidebar_position: 9
---

## 说明

**从 flink-1.15.x 开始支持。**

支持：

* Changelog-Data-Capture Format CDC
* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

[Oracle GoldenGate](https://www.oracle.com/integration/goldengate/)（简称 ogg）
是一个提供实时数据转化平台的管理服务，使用复制的方式保证数据高可用以及实时分析。
消费者可以设计、执行功能、并且监控他们的数据副本和流式数据处理方案，而无需收集或管理计算环境。
Ogg 对 changelog 数据提供了一个 format schema ，并且提供了 JSON 格式的序列化数据。

Flink 支持在 Flink SQL 系统中解析 Ogg JSON 数据为 `INSERT/UPDATE/DELETE` 数据，在很多情况下，这个特性是非常有用的，比如：

* 从数据库同步增量数据到其他系统
* 日志审计
* 在数据库中实时物化视图
* 时态连接数据库表的变更历史等等

Flink 也支持在 Flink SQL 中编码 `INSERT/UPDATE/DELETE` 消息为 `Ogg JSON` 消息，并且发射到其他系统，比如 kafka 。
然而，Flink 目前还不能合并 `UPDATE_BEFORE` 和 `UPDATE_AFTER` 为单个 `UPDATE` 消息。因此，Flink 会将 `UPDATE_BEFORE` 和 `UPDATE_AFTER` 编码为 `DELETE` 和 `INSERT` Ogg 消息。

## 依赖

**Ogg Json**

为了使用Ogg 格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-json</artifactId>
    <version>1.15.0</version>
</dependency>
```

注意自己的 flink 版本。

注：请参考 [Ogg Kafka 处理](https://docs.oracle.com/en/middleware/goldengate/big-data/19.1/gadbd/using-kafka-handler.html) 文档
来了解怎么设置 Ogg Kafka 处理器来同步 changelog 数据到 kafka 主题。

## 使用 Ogg 格式

Ogg 对 changelog 提供了统一的 format，下面是一个简单的案例，展示了从 Oracle PRODUCTS 表中捕捉更新操作数据为 JSON 格式：

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
  "op_type": "U",
  "op_ts": "2020-05-13 15:40:06.000000",
  "current_ts": "2020-05-13 15:40:07.000000",
  "primary_keys": [
    "id"
  ],
  "pos": "00000000000000000000143",
  "table": "PRODUCTS"
}
```

注：请参考 [Debezium 文档](https://debezium.io/documentation/reference/1.3/connectors/oracle.html#oracle-events)来了解每个属性的含义。

Oracle PRODUCTS 表有4个字段 (id, name, description, weight)，上面的 JSON 数据是 PRODUCTS 表的一个更新变更事件，
id 为 111 的 weight 值从 `5.18` 变成了 `5.15`。假设这个数据同步到了 kafka 的 products_ogg 主题，然后我们就可以使用下面的 DDL 语句消费这个主题，并解析这个变更事件。

```sql
CREATE TABLE topic_products (
    -- schema和 oracle 的 "products" 表是完全相同的
    id BIGINT,
    name STRING,
    description STRING,
    weight DECIMAL(10, 2)
) WITH (
    'connector' = 'kafka',
    'topic' = 'products_ogg',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'format' = 'ogg-json'
)
```

将主题注册为 flink 表之后，就可以将 Ogg 消息作为 changelog source 来消费了。

```sql
-- Oracle "PRODUCTS" 表的实时物化视图，该视图计算了镶贴工产品最新的平均重量
SELECT name, AVG(weight)
FROM topic_products
GROUP BY name;

-- 同步 Oracle "PRODUCTS" 表的所有数据和增量变更数据到 Elasticsearch 的 "products" 索引中，以便将来进行搜索
INSERT INTO elasticsearch_products
SELECT *
FROM topic_products;
```

## 可用元数据

下面的元数据可以暴露到表定义的**只读虚拟（VIRTUAL）字段**中。

注意：只有在对应的连接器可以传递 format 元数据时，format 元数据属性才可用。目前，只有 kafka 连接器可以暴露元数据属性到他的 value format。

| Key	                | 数据类型	                   | 描述                                                                       |
|:--------------------|:------------------------|:-------------------------------------------------------------------------|
| table	              | STRING NULL	            | 表的全限定名称。表的权限名称格式为：`CATALOG NAME.SCHEMA NAME.TABLE NAME`                  |
| primary-keys        | 	`ARRAY<STRING> NULL`	  | 源表主键字段名称数组，如果 `includePrimaryKeys` 配置设置为 true ，则主键属性值只包含在 JSON 格式的输出数据中。 |
| ingestion-timestamp | 	TIMESTAMP_LTZ(6) NULL	 | 连接器处理事件的时间戳，对应 Ogg 数据中的 `current_ts` 属性。                                 |
| event-timestamp	    | TIMESTAMP_LTZ(6) NULL	  | source 系统创建事件的时间戳，对应于 Ogg 数据中的 `op_ts` 属性。                               |

下面的案例展示如何访问 kafka 中 Ogg 元数据属性：

```sql
CREATE TABLE KafkaTable (
    origin_ts TIMESTAMP(3) METADATA FROM 'value.ingestion-timestamp' VIRTUAL,
    event_time TIMESTAMP(3) METADATA FROM 'value.event-timestamp' VIRTUAL,
    origin_table STRING METADATA FROM 'value.table' VIRTUAL,
    primary_keys ARRAY<STRING> METADATA FROM 'value.primary-keys' VIRTUAL,
    user_id BIGINT,
    item_id BIGINT,
    behavior STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_behavior',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'scan.startup.mode' = 'earliest-offset',
    'value.format' = 'ogg-json'
);
```

## Format 参数

| 参数	                                | 要求	  | 默认值	     | 类型	       | 描述                                                                                                                                                                                                                                                      |
|:-----------------------------------|:-----|:---------|:----------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| format	                            | 必选   | 	(none)	 | String	   | 指定使用的 format ，这儿应该为：**ogg-json**                                                                                                                                                                                                                        |
| ogg-json.ignore-parse-errors       | 	可选	 | false    | 	Boolean	 | 跳过转化失败的属性和行而不是失败，如果遇到错误，属性值将被设置为 `null`。                                                                                                                                                                                                                |
| ogg-json.timestamp-format.standard | 	可选  | 	'SQL'   | 	String	  | 指定输入和输出时间戳的格式，目前支持的值为：**SQL** 、 **ISO-8601** 。<br/>**SQL**：转化时间戳为 **yyyy-MM-dd HH:mm:ss.s{precision}** 格式，比如： '**2020-12-30 12:13:14.123**'。<br/>**ISO-8601**：转化时间戳为 **yyyy-MM-ddTHH:mm:ss.s{precision}** 格式，比如：'**2020-12-30T12:13:14.123**'。          |
| ogg-json.map-null-key.mode	        | 可选   | 	'FAIL'	 | String	   | 指定 map 类型数据遇到 key 值为 null 时的处理方式。目前支持的值为：**FAIL**、**DROP**、**LITERAL** 。<br/>**FAIL**：遇到 map 数据中的 key 为 null 时抛出异常。<br/>**DROP**：删除 map 数据中的 key 为 null 的 entry。<br/>**LITERAL**：替换 key 为 null 值的字符串字面量。字符串字面量值通过 `ogg-json.map-null-key.literal` 选项定义。 |
| ogg-json.map-null-key.literal      | 	可选  | 	'null'  | 	String	  | 指定当 `ogg-json.map-null-key.mode` 选项值为 **LITERAL** 时，要替换为的字符串字面量值。                                                                                                                                                                                       |

## 数据类型映射

目前，Ogg 格式使用 JSON 格式来序列化和反序列化。
请参考 [JSON 格式](https://nightlies.apache.org/flink/flink-docs-release-1.15/docs/connectors/table/formats/json/#data-type-mapping)文档来获取更多有关数据类型映射的细节。