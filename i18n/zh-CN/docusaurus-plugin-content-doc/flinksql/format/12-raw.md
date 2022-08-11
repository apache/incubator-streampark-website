---
id: '12-raw'
title: 'Raw'
sidebar_position: 12
---

## 说明

支持：

* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

Raw format 允许读写原始（基于字节）数据作为**单个列**的值。

注意: 这种格式会将 `null` 值编码成 `byte[]` 类型的 `null`，因此在 upsert-kafka 中使用时可能会有限制，因为 upsert-kafka 将 null 值视为删除消息（在key上删除）。
因此，如果该字段可能有 null 值，我们建议避免使用 upsert-kafka 连接器和 raw format 作为 value.format。

Raw format 连接器是内置的，不需要添加额外的连接器依赖。

## 使用Raw格式

比如在 Kafka 中有以下原始日志数据，希望使用 Flink SQL 读取和分析此类数据。

```csv
47.29.201.179 - - [28/Feb/2019:13:17:10 +0000] "GET /?p=1 HTTP/2.0" 200 5316 "https://domain.com/?p=1" "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36" "2.75"
```

下面的代码创建了一张表，使用 raw format 以 UTF-8 编码的形式从中读取（也可以写入）底层的 Kafka topic 主题数据为字符串：

```sql
CREATE TABLE nginx_log (
    log STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'nginx_log',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'format' = 'raw'
)
```

将原始数据读取为纯字符串，之后使用用户自定义函数将其分为多个字段进行进一步分析。例如示例中的 my_split。

```sql
SELECT t.hostname, t.datetime, t.url, t.browser, ...
FROM
    (
    SELECT my_split(log) as t FROM nginx_log
    )
;
```

相对应的，也可以将一个字符串类型的列以 UTF-8 编码的形式写入 Kafka topic。

## Format 参数

| 参数              | 	是否必选 | 	默认值        | 	类型      | 	描述                                                                                                                               |
|:----------------|:------|:------------|:---------|:----------------------------------------------------------------------------------------------------------------------------------|
| format          | 	必选   | 	(none)     | 	String	 | 指定要使用的格式, 这里应该是 **raw**。                                                                                                          |
| raw.charset     | 	可选   | 	UTF-8      | 	String	 | 指定字符集来编码文本字符串。                                                                                                                    |
| raw.endianness	 | 可选    | 	big-endian | 	String  | 	指定字节序来编码数字值的字节。有效值为 **big-endian** 和 **little-endian** 。更多细节可查阅[字节序](https://zh.wikipedia.org/wiki/%E5%AD%97%E8%8A%82%E5%BA%8F)。 |

## 数据类型映射

下表详细说明了这种格式支持的 SQL 类型，包括用于编码和解码的序列化类和反序列化类的详细信息。

| Flink SQL 类型               | 	值                                                                            |
|:---------------------------|:------------------------------------------------------------------------------|
| CHAR / VARCHAR / STRING    | 	UTF-8（默认）编码的文本字符串。<br/>编码字符集可以通过 `raw.charset` 进行配置。                         |
| BINARY / VARBINARY / BYTES | 	字节序列本身。                                                                      |
| BOOLEAN                    | 	表示布尔值的单个字节，0表示 false, 1 表示 true。                                             |
| TINYINT                    | 	有符号数字值的单个字节。                                                                 |
| SMALLINT                   | 	采用`big-endian`（默认）编码的两个字节。<br/>字节序可以通过 `raw.endianness` 配置。                  |
| INT                        | 	采用 `big-endian` （默认）编码的四个字节。<br/>字节序可以通过 `raw.endianness` 配置。                |
| BIGINT                     | 	采用 `big-endian` （默认）编码的八个字节。<br/>字节序可以通过 `raw.endianness` 配置。                |
| FLOAT                      | 	采用 `IEEE 754` 格式和 `big-endian` （默认）编码的四个字节。<br/>字节序可以通过 `raw.endianness` 配置。 |
| DOUBLE                     | 	采用 `IEEE 754` 格式和 `big-endian `（默认）编码的八个字节。<br/>字节序可以通过 `raw.endianness` 配置。 |
| RAW                        | 	通过 RAW 类型的底层 `TypeSerializer` 序列化的字节序列。                                      |