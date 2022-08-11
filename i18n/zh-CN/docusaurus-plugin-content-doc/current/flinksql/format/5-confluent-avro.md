---
id: '5-confluent-avro'
title: 'Confluent Avro'
sidebar_position: 5
---

## 说明

支持：

* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

Avro Schema Registry(avro-confluent)格式允许你读取被`io.confluent.kafka.serializers.KafkaAvroSerializer`序列化的记录，
并写入可以被`io.confluent.kafka.serializers.KafkaAvroDeserializer`反序列化读取的记录。

当读取(反序列化)这种格式的数据时，根据数据中的schema版本id从配置的`Confluent schema Registry`中获取Avro写入schema，同时从表schema推断读取schema。

当用这种格式写入(序列化)一条数据时，Avro schema将从表schema推断出用于检索的schema id：

* flink-1.13.x：主要通过**avro-confluent.schema-registry.subject**配置的主题名进行查找。
* flink-1.14.x：主要通过**avro-confluent.subject**配置的主题名进行查找。

Avro Schema Registry格式只能与`Apache Kafka SQL`连接器或`Upsert Kafka SQL`连接器结合使用。

## 依赖
为了使用Avro Schema Registry格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-avro-confluent-registry</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 版本。

## 使用Avro-Confluent格式

使用原始UTF-8字符串作为Kafka键以及在Schema Registry中注册的Avro记录作为Kafka值注册的表：

**flink-1.13.x：**

```sql
CREATE TABLE user_created (
    -- -- 一个映射到kafka原生UTF-8字符串key的字段
    the_kafka_key STRING,
    -- 一些Avro属性字段作为kafka value
    id STRING,
    name STRING,
    email STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_events_example1',
    'properties.bootstrap.servers' = 'localhost:9092',
    -- UTF-8字符串作为kafka key，使用“the_kafka_key”表字段
    'key.format' = 'raw',
    'key.fields' = 'the_kafka_key',
    'value.format' = 'avro-confluent',
    'value.avro-confluent.schema-registry.url' = 'http://localhost:8082',
    'value.fields-include' = 'EXCEPT_KEY'
)
```

**flink-1.14.x：**

```sql
CREATE TABLE user_created (
    -- -- 一个映射到kafka原生UTF-8字符串key的字段
    the_kafka_key STRING,
    -- 一些Avro属性字段作为kafka value
    id STRING,
    name STRING,
    email STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_events_example1',
    'properties.bootstrap.servers' = 'localhost:9092',
    -- UTF-8字符串作为kafka key，使用“the_kafka_key”表字段
    'key.format' = 'raw',
    'key.fields' = 'the_kafka_key',
    'value.format' = 'avro-confluent',
    'value.avro-confluent.url' = 'http://localhost:8082',
    'value.fields-include' = 'EXCEPT_KEY'
)
```

我们可以如下方式将数据写入kafka表：

```sql
INSERT INTO user_created
SELECT
    -- 赋值user id字段值作为kafka key
    id as the_kafka_key,
    -- 所有字段值
    id, name, email
FROM some_table
```

Kafka键和值都在Schema Registry中注册为Avro record：

**flink-1.13.x：**

```sql
CREATE TABLE user_created (
    -- 一个映射到“id” avro属性字段作为kafka key
    kafka_key_id STRING,
    -- 一些映射到avro属性字段作为kafka value
    id STRING,
    name STRING,
    email STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_events_example2',
    'properties.bootstrap.servers' = 'localhost:9092',
    -- 注意:由于哈希分区的存在，Kafka key上下文中的schema演化几乎不可能向后或向前兼容。
    'key.format' = 'avro-confluent',
    'key.avro-confluent.schema-registry.url' = 'http://localhost:8082',
    -- 在这个例子中，我们希望Kafka key和value的Avro类型都包含字段'id' => 在与Kafka key字段相关联的表字段名前添加一个前缀，以避免冲突
    'key.fields-prefix' = 'kafka_key_',
    'value.format' = 'avro-confluent',
    'value.avro-confluent.schema-registry.url' = 'http://localhost:8082',
    'value.fields-include' = 'EXCEPT_KEY',
    -- 从flink 1.13版本开始，subject有默认值，尽管可以被覆盖
    'key.avro-confluent.schema-registry.subject' = 'user_events_example2-key2',
    'value.avro-confluent.schema-registry.subject' = 'user_events_example2-value2'
)
```

**flink-1.14.x：**

```sql
CREATE TABLE user_created (
    -- 一个映射到“id” avro属性字段作为kafka key
    kafka_key_id STRING,
    -- 一些映射到avro属性字段作为kafka value
    id STRING,
    name STRING,
    email STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_events_example2',
    'properties.bootstrap.servers' = 'localhost:9092',
    -- 注意:由于哈希分区的存在，Kafka key上下文中的schema演化几乎不可能向后或向前兼容。
    'key.format' = 'avro-confluent',
    'key.avro-confluent.url' = 'http://localhost:8082',
    -- 在这个例子中，我们希望Kafka key和value的Avro类型都包含字段'id' => 在与Kafka key字段相关联的表字段名前添加一个前缀，以避免冲突
    'key.fields-prefix' = 'kafka_key_',
    'value.format' = 'avro-confluent',
    'value.avro-confluent.url' = 'http://localhost:8082',
    'value.fields-include' = 'EXCEPT_KEY',
    -- 从flink 1.13版本开始，subject有默认值，尽管可以被覆盖
    'key.avro-confluent.subject' = 'user_events_example2-key2',
    'value.avro-confluent.subject' = 'user_events_example2-value2'
)
```

使用upsert-kafka连接器的表示例，其中Kafka value在Schema Registry中注册为Avro记录：

**flink-1.13.x：**

```sql
CREATE TABLE user_created (
    -- 一个映射到kafka原生UTF-8字符串key的字段
    kafka_key_id STRING,
    -- 一些映射到avro属性的字段作为kafka value
    id STRING,
    name STRING,
    email STRING,
    -- upsert-kafka连接器要求有一个主键来定义upsert行为
    PRIMARY KEY (kafka_key_id) NOT ENFORCED

) WITH (
    'connector' = 'upsert-kafka',
    'topic' = 'user_events_example3',
    'properties.bootstrap.servers' = 'localhost:9092',
    -- UTF-8字符串作为kafka key
    -- 在这个案例中不指定'key.fields'，因为它由表的主键指定
    'key.format' = 'raw',
    -- In this example, we want the Avro types of both the Kafka key and value to contain the field 'id'
    -- 在这个例子中，我们希望Kafka key和value的Avro类型都包含字段'id' => 在与Kafka key字段相关联的表字段名前添加一个前缀，以避免冲突
    'key.fields-prefix' = 'kafka_key_',
    'value.format' = 'avro-confluent',
    'value.avro-confluent.schema-registry.url' = 'http://localhost:8082',
    'value.fields-include' = 'EXCEPT_KEY'
)
```

**flink-1.14.x：**

```sql
CREATE TABLE user_created (
    -- 一个映射到kafka原生UTF-8字符串key的字段
    kafka_key_id STRING,
    -- 一些映射到avro属性的字段作为kafka value
    id STRING,
    name STRING,
    email STRING,
    -- upsert-kafka连接器要求有一个主键来定义upsert行为
    PRIMARY KEY (kafka_key_id) NOT ENFORCED

) WITH (
    'connector' = 'upsert-kafka',
    'topic' = 'user_events_example3',
    'properties.bootstrap.servers' = 'localhost:9092',
    -- UTF-8字符串作为kafka key
    -- 在这个案例中不指定'key.fields'，因为它由表的主键指定
    'key.format' = 'raw',
    -- In this example, we want the Avro types of both the Kafka key and value to contain the field 'id'
    -- 在这个例子中，我们希望Kafka key和value的Avro类型都包含字段'id' => 在与Kafka key字段相关联的表字段名前添加一个前缀，以避免冲突
    'key.fields-prefix' = 'kafka_key_',
    'value.format' = 'avro-confluent',
    'value.avro-confluent.url' = 'http://localhost:8082',
    'value.fields-include' = 'EXCEPT_KEY'
)
```

## Format参数

| 选项	                                                                                                 | 要求	  | 是否可以被转发<br/>从 flink-1.15.x 开始支持 | 	默认值	    | 类型       | 	描述                                                                                                                                                                                    |
|:----------------------------------------------------------------------------------------------------|:-----|:--------------------------------|:---------|:---------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| format                                                                                              | 	必选  | 	否                              | 	(none)  | 	String  | 	指定使用哪种模式，这儿应该是 **avro-confluent**                                                                                                                                                     |
| avro-confluent.basic-auth.credentials-source	                                                       | 可选   | 	是	                             | (none)   | 	String	 | schema注册的基础认证证书资                                                                                                                                                                       |
| avro-confluent.basic-auth.user-info	                                                                | 可选   | 	是                              | 	(none)  | 	String	 | schema注册的基础认证用户信息                                                                                                                                                                      |
| avro-confluent.bearer-auth.credentials-source	                                                      | 可选   | 	是                              | 	(none)  | 	String	 | schema注册的持有者认证证书源                                                                                                                                                                      |
| avro-confluent.bearer-auth.token	                                                                   | 可选	  | 是                               | 	(none)	 | String	  | schema注册的持有者认证令牌 token 源                                                                                                                                                               |
| **从 flink-1.14.x 开始支持**<br/>avro-confluent.properties	                                              | 可选   | 	是                              | 	(node)  | 	Map     | 	转发到下面 schema 注册的属性 map 表，这对于没有通过Flink配置选项正式公开的选项很有用，但是 Flink 选项拥有更高的优先级。                                                                                                              |
| avro-confluent.ssl.keystore.location	                                                               | 可选	  | 是	                              | (none)	  | String	  | SSL秘钥库文件存储位置                                                                                                                                                                           |
| avro-confluent.ssl.keystore.password	                                                               | 可选	  | 是	                              | (none)	  | String	  | SSL秘钥库密码                                                                                                                                                                               |
| avro-confluent.ssl.truststore.location                                                              | 	可选	 | 是	                              | (none)	  | String	  | SSL truststore的文件存储位置                                                                                                                                                                  |
| avro-confluent.ssl.truststore.password	                                                             | 可选   | 	是	                             | (none)	  | String	  | SSL truststore的密码                                                                                                                                                                      |
| **flink-1.13.x**：avro-confluent.schema-registry.subject<br/>**flink-1.14.x**：avro-confluent.subject | 	可选  | 	是                              | 	(none)	 | String   | 	Confluent模式注册中心主题，在该主题下注册此格式在序列化期间使用的schema。默认情况下，`kafka` 和 `upsert-kafka` 连接器使用 `<topic_name>-value` 或 `<topic_name>-key` 作为默认主题名。但对于其他连接器(例如: `filesystem` )，当用作接收器时，subject选项是必需的。 |
| **flink-1.13.x**：avro-confluent.schema-registry.url<br/>**flink-1.14.x**：avro-confluent.url         | 	必选  | 	是                              | 	(none)  | 	String  | 	用于获取/注册Confluent Schema Registry schema的URL                                                                                                                                           | 

## 数据类型匹配

目前，Apache Flink总是使用表schema在反序列化期间派生Avro读取schema，在序列化期间派生Avro写入schema。

目前还不支持直接显式定义Avro模式。
Avro和Flink数据类型之间的映射请参见[Apache Avro Format](https://ci.apache.org/projects/flink/flink-docs-release-1.13/docs/connectors/table/formats/avro/#data-type-mapping)。

除了上面列出的类型外，Flink还支持读写可空类型。Flink将可为空的类型映射到Avro联合(某值，null)，其中某值是从Flink类型转换而来的Avro类型。

有关Avro类型的更多信息，可以参考[Avro规范](https://avro.apache.org/docs/current/spec.html)。