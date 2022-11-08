---
id: 'quick-start'
title: 'Quick start'
sidebar_position: 2
---

## How to use

The installation of the one-stop platform `streampark-console` has been introduced in detail in the previous chapter. In this chapter, let's see how to quickly deploy and run a job with `streampark-console`. The official structure and specification) and projects developed with `streampark` are well supported. Let's use `streampark-quickstart` to quickly start the journey of `streampark-console`

`streampark-quickstart` is a sample program for developing Flink by StreamPark. For details, please refer to:

- Github: [https://github.com/apache/incubator-streampark-quickstart.git](https://github.com/apache/streampark-quickstart.git)
- Gitee: [https://gitee.com/mirrors_apache/incubator-streampark-quickstart.git](https://gitee.com/mirrors_apache/incubator-streampark-quickstart.git)

### Deploy DataStream tasks

The following example demonstrates how to deploy a DataStream application

<video src="http://assets.streamxhub.com/datastream.mp4" controls="controls" width="100%" height="100%"></video>

### Deploy the FlinkSql task

The following example demonstrates how to deploy a FlinkSql application

<video src="http://assets.streamxhub.com//flinksql.mp4" controls="controls" width="100%" height="100%"></video>

- The flink sql used in the project demonstration is as follows

```sql
CREATE TABLE user_log (
    user_id VARCHAR,
    item_id VARCHAR,
    category_id VARCHAR,
    behavior VARCHAR,
    ts TIMESTAMP(3)
 ) WITH (
'connector.type' = 'kafka', -- Using the kafka connector
'connector.version' = 'universal',  -- kafka version, universal supports versions above 0.11
'connector.topic' = 'user_behavior',  -- kafka topic
'connector.properties.bootstrap.servers'='kafka-1:9092,kafka-2:9092,kafka-3:9092',
'connector.startup-mode' = 'earliest-offset', -- Read from start offset
'update-mode' = 'append',
'format.type' = 'json',  -- The data source format is json
'format.derive-schema' = 'true' -- Determine json parsing rules from DDL schema
 );

CREATE TABLE pvuv_sink (
    dt VARCHAR,
    pv BIGINT,
    uv BIGINT
 ) WITH (
'connector.type' = 'jdbc', -- using jdbc connector
'connector.url' = 'jdbc:mysql://test-mysql:3306/test', -- jdbc url
'connector.table' = 'pvuv_sink', -- Table Name
'connector.username' = 'root', -- username
'connector.password' = '123456', --password
'connector.write.flush.max-rows' = '1' -- Default 5000, changed to 1 for demonstration
 );

INSERT INTO pvuv_sink
SELECT
  DATE_FORMAT(ts, 'yyyy-MM-dd HH:00') dt,
  COUNT(*) AS pv,
  COUNT(DISTINCT user_id) AS uv
FROM user_log
GROUP BY DATE_FORMAT(ts, 'yyyy-MM-dd HH:00');
```

-   The maven dependencies are used as follows

```xml

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.48</version>
</dependency>

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-sql-connector-kafka_2.11</artifactId>
    <version>1.12.0</version>
</dependency>

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-jdbc_2.11</artifactId>
    <version>1.12.0</version>
</dependency>

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-json</artifactId>
    <version>1.12.0</version>
</dependency>

```

-   The data sent by Kafka simulation is as follows

```json

{"user_id": "543462", "item_id":"1715", "category_id": "1464116", "behavior": "pv", "ts":"2021-02-01T01:00:00Z"}
{"user_id": "662867", "item_id":"2244074","category_id":"1575622","behavior": "pv", "ts":"2021-02-01T01:00:00Z"}
{"user_id": "662867", "item_id":"2244074","category_id":"1575622","behavior": "pv", "ts":"2021-02-01T01:00:00Z"}
{"user_id": "662867", "item_id":"2244074","category_id":"1575622","behavior": "learning flink", "ts":"2021-02-01T01:00:00Z"}

```

### Task start process

The task startup flow chart is as follows

<center>
<img src="/doc/image/streampark_start.png"/><br></br>
<strong>streampark-console submit task process</strong>
</center>

Regarding the concept of the project, `Development Mode`, `savepoint`, `NoteBook`, custom jar management, task release, task recovery, parameter configuration, parameter comparison, multi-version management and more tutorials and documents will be continuously updated. ..

