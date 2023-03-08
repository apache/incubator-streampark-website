---
id: '1-introduce'
title: 'Introduction'
sidebar_position: 1
---

## 所有格式

Flink提供了一组可以与表连接器一起使用的表格式。表格式是一种存储格式，定义如何将二进制数据映射到表字段。

Flink支持以下格式：

| 格式             | 连接器                                                                                |
|:---------------|:-----------------------------------------------------------------------------------|
| CSV            | Apache Kafka, Upsert Kafka, Amazon Kinesis Data Streams, Filesystem                |
| JSON           | Apache Kafka, Upsert Kafka, Amazon Kinesis Data Streams, Filesystem, Elasticsearch |
| Apache Avro    | Apache Kafka, Upsert Kafka, Amazon Kinesis Data Streams, Filesystem                |
| Confluent Avro | Apache Kafka, Upsert Kafka                                                         |
| Debezium CDC   | Apache Kafka, Filesystem                                                           |
| Canal CDC      | Apache Kafka, Filesystem                                                           |
| Maxwell CDC    | Apache Kafka, Filesystem                                                           |
| OGG CDC        | Apache Kafka, Filesystem（从 flink-1.15.x 开始支持）                                      |
| Apache Parquet | Filesystem                                                                         |
| Apache ORC     | Filesystem                                                                         |
| Raw            | Apache Kafka, Upsert Kafka, Amazon Kinesis Data Streams, Filesystem                |