---
id: '3-upsert-kafka'
title: 'Upsert Kafka'
sidebar_position: 3
---

## 介绍

支持：

* Scan Source: Unbounded 
* Sink: Streaming Upsert Mode

Upsert Kafka 连接器支持以 upsert 方式从 Kafka topic 中读取数据并将数据写入 Kafka topic。

作为 source，upsert-kafka 连接器生产 `changelog` 流，其中每条数据记录代表一个更新或删除事件。
更准确地说，如果有这个 key，则数据记录中的 value 被解释为同一 key 的最后一个 value 的 **UPDATE**，如果不存在相应的 key，则该更新被视为 **INSERT**。
用表来类比，changelog 流中的数据记录被解释为 **UPSERT**，也称为 **INSERT/UPDATE**，因为任何具有相同 key 的现有行都会被覆盖。
另外，value 为空的消息将会被视作为 **DELETE** 消息。

作为 sink，upsert-kafka 连接器可以消费 `changelog` 流。
它会将 **INSERT/UPDATE_AFTER** 数据作为正常的 Kafka 消息写入，并将 **DELETE** 数据以 value 为空的 Kafka 消息写入（表示对应 key 的消息被删除）。
Flink 将根据主键列的值对数据进行分区，从而保证主键上的消息有序，因此同一主键上的更新/删除消息将落在同一分区中。

## 依赖

为了使用Upsert Kafka连接器，以下依赖项需要在使用自动化构建工具(如Maven或SBT)的项目和SQL客户端导入。

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-kafka_2.11</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己所使用的 kafka 和 scala 版本。

## 完整示例

下面的示例展示了如何创建和使用 Upsert Kafka 表：

```sql
CREATE TABLE pageviews_per_region (
    user_region STRING,
    pv BIGINT,
    uv BIGINT,
PRIMARY KEY (user_region) NOT ENFORCED -- 定义主键，主键字段可以有多个，这些字段共同组成key的字段
) WITH (
    'connector' = 'upsert-kafka',
    'topic' = 'pageviews_per_region',
    'properties.bootstrap.servers' = '...',
    'key.format' = 'avro',
    'value.format' = 'avro'
);

CREATE TABLE pageviews (
    user_id BIGINT,
    page_id BIGINT,
    view_time TIMESTAMP,
    user_region STRING,
    WATERMARK FOR viewtime AS view_time - INTERVAL '2' SECOND
) WITH (
    'connector' = 'kafka',
    'topic' = 'page_views',
    'properties.bootstrap.servers' = '...',
    'format' = 'json'
);

-- 计算 pv、uv 并插入到 upsert-kafka sink
INSERT INTO pageviews_per_region
SELECT
    user_region,
    COUNT(*),
    COUNT(DISTINCT user_id)
FROM pageviews
GROUP BY user_region;
```

注意确保在 DDL 中定义主键。

## 可用的元数据

查看[常规kafka连接器](2-kafka)以获取可以用元数据信息。

## 连接器参数

| 参数                           | 	是否必选 | 	默认值    | 	数据类型     | 	描述                                                                                                                                                                                                                                                                                   |
|:-----------------------------|:------|:--------|:----------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| connector                    | 	必选   | 	(none) | 	String   | 	指定要使用的连接器，Upsert Kafka 连接器使用：**upsert-kafka**。                                                                                                                                                                                                                                       |
| topic                        | 	必选   | 	(none) | 	String   | 	用于读取和写入的 Kafka topic 名称。                                                                                                                                                                                                                                                             |
| properties.bootstrap.servers | 	必选   | 	(none) | 	String   | 	以逗号分隔的 Kafka brokers 列表。                                                                                                                                                                                                                                                             |
| properties.*                 | 	可选   | 	(none) | 	String   | 	该选项可以传递任意的 Kafka 参数。选项的后缀名必须匹配定义在 Kafka 参数文档中的参数名。 Flink 会自动移除 选项名中的 `properties.` 前缀，并将转换后的键名以及值传入 KafkaClient。 例如，你可以通过设置 **'properties.allow.auto.create.topics' = 'false'** 来禁止自动创建 topic。 但是，某些选项，例如`key.deserializer` 和 `value.deserializer` 是不允许通过该方式传递参数，因为 Flink 会重写这些参数的值。 |
| key.format                   | 	必选   | 	(none) | 	String   | 	用于对 Kafka 消息中 key 部分序列化和反序列化的格式。key 字段由 `PRIMARY KEY` 语法指定。支持的格式包括 **csv**、**json**、**avro**。请参考格式页面以获取更多详细信息和格式参数。                                                                                                                                                                  |
| key.fields-prefix            | 	可选   | 	(none) | 	String   | 	为所有消息键（Key）格式字段指定自定义前缀，以避免与消息体（Value）格式字段重名。默认情况下前缀为空。 如果定义了前缀，表结构和配置项 `key.fields` 都需要使用带前缀的名称。 当构建消息键格式字段时，前缀会被移除，消息键格式将会使用无前缀的名称。请注意该配置项要求必须将 `value.fields-include` 配置为 **EXCEPT_KEY**。比如，key字段和value字段重名，就需要配置该参数以区分哪个字段属于key，哪个字段属于value。                                      |
| value.format                 | 	必选   | 	(none) | 	String   | 	用于对 Kafka 消息中 value 部分序列化和反序列化的格式。支持的格式包括 **csv**、**json**、**avro**。请参考格式页面以获取更多详细信息和格式参数。                                                                                                                                                                                           |
| value.fields-include         | 	必选   | 	'ALL'  | 	String   | 	控制哪些字段应该出现在 value 中。可取值：<br/>**ALL**：消息的 value 部分将包含 schema 中所有的字段，包括定义为主键的字段。<br/>**EXCEPT_KEY**：记录的 value 部分包含 schema 的所有字段，定义为主键的字段除外。                                                                                                                                            |
| sink.parallelism             | 	可选   | 	(none) | 	Integer  | 	定义 upsert-kafka sink 算子的并行度。默认情况下，由框架确定并行度，与上游链接算子的并行度保持一致。                                                                                                                                                                                                                          |
| sink.buffer-flush.max-rows	  | 可选    | 	0      | 	Integer  | 	缓存刷新前，最多能缓存多少条记录。当 sink 收到很多同 key 上的更新时，缓存将保留同 key 的最后一条记录，因此 sink 缓存能帮助减少发往 Kafka topic 的数据量，以及避免发送不必要的删除消息。可以通过设置为 **0** 来禁用它。默认不开启。注意，如果要开启 sink 缓存，需要同时设置 `sink.buffer-flush.max-rows` 和 `sink.buffer-flush.interval` 两个选项为大于零的值。                                                |
| sink.buffer-flush.interval	  | 可选    | 	0      | 	Duration | 	缓存刷新的间隔时间，超过该时间后异步线程将刷新缓存数据。当 sink 收到很多同 key 上的更新时，缓存将保留同 key 的最后一条记录，因此 sink 缓存能帮助减少发往 Kafka topic 的数据量，以及避免发送不必要的删除消息。 可以通过设置为 **0** 来禁用它。默认不开启。注意，如果要开启 sink 缓存，需要同时设置 `sink.buffer-flush.max-rows` 和 `sink.buffer-flush.interval` 两个选项为大于零的值。                                    |

## 特性

### 键（key）和值（value）的格式

查看常规kafka连接器以获取键和值的格式的详细信息。注意，该连接器要求必须同时指定键和值的格式，键字段通过主键 `PRIMARY KEY` 约束语法派生。

下面的例子展示如何同时指定和配置键和值的格式。格式选项通过`key`或者`value`为前缀来作为格式的选项标识符。

```sql
CREATE TABLE KafkaTable (
    `ts` TIMESTAMP(3) METADATA FROM 'timestamp',
    `user_id` BIGINT,
    `item_id` BIGINT,
    `behavior` STRING,
    PRIMARY KEY (`user_id`) NOT ENFORCED
) WITH (
    'connector' = 'upsert-kafka',
    ...
    
    'key.format' = 'json',
    'key.json.ignore-parse-errors' = 'true',
    
    'value.format' = 'json',
    'value.json.fail-on-missing-field' = 'false',
    'value.fields-include' = 'EXCEPT_KEY'
)
```

### 主键约束

Upsert Kafka 始终以 upsert 方式工作，并且需要在 DDL 中定义主键。
在具有相同主键值的消息按序存储在同一个分区的前提下，在 changelog source 定义主键，意味着在物化后的 changelog 上主键具有唯一性。定义的主键将决定哪些字段出现在 Kafka 消息的 key 中。

### 一致性保证

默认情况下，如果启用 checkpoint，Upsert Kafka sink 会保证至少一次将数据插入 Kafka topic。
这意味着，Flink 可以将具有相同 key 的重复记录写入 Kafka topic。
但由于该连接器以 upsert 的模式工作，该连接器作为 source 读入时，可以确保具有相同主键值下仅最后一条消息会生效。因此，upsert-kafka 连接器可以像 HBase sink 一样实现幂等写入。

### 为每个分区生成相应的 watermark

Flink 支持根据 Upsert Kafka 的每个分区的数据特性发送相应的 watermark。
当使用这个特性的时候，watermark 是在 Kafka consumer 内部生成的。合并每个分区生成的 watermark 的方式和 stream shuffle 的方式是一致的。
数据源产生的 watermark 是取决于该 consumer 负责的所有分区中当前最小的 watermark。
如果该 consumer 负责的部分分区是闲置的，则整体的 watermark 并不会前进。在这种情况下，可以通过设置合适的 `table.exec.source.idle-timeout` 来缓解这个问题。

如想获得更多细节，请查阅 [Kafka 水印策略](https://ci.apache.org/projects/flink/flink-docs-release-1.13/zh/docs/dev/datastream/event-time/generating_watermarks/#watermark-strategies-and-the-kafka-connector).

## 数据类型映射

Upsert Kafka 用字节存储消息的 key 和 value，因此没有 schema 或数据类型。
消息按格式进行序列化和反序列化，例如：**csv**、**json**、**avro**。因此数据类型映射表由指定的格式确定。请参考格式页面以获取更多详细信息。