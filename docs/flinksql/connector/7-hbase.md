---
id: '7-hbase'
title: 'Hbase'
sidebar_position: 7
---

## 介绍

支持：

* Scan Source: Bounded 
* Lookup Source: Sync Mode 
* Sink: Batch 
* Sink: Streaming Upsert Mode

HBase 连接器支持读取和写入 HBase 集群。本文档介绍如何使用 HBase 连接器基于 HBase 进行 SQL 查询。

HBase 连接器在 `upsert` 模式下运行，可以使用 `DDL` 中定义的主键与外部系统交换更新操作消息。但是主键只能基于 HBase 的 `rowkey` 字段定义。如果没有声明主键，HBase 连接器默认取 `rowkey` 作为主键。

## 依赖

为了使用HBase连接器，要求下面的依赖添加到通过自动构建工具（比如maven和SBT）构建的项目中，或者是SQL的客户端。

**1.4.x**

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-hbase-1.4_2.11</artifactId>
    <version>1.13.2</version>
</dependency>
```

**2.2.x**	

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-hbase-2.2_2.11</artifactId>
    <version>1.13.2</version>
</dependency>
```

注意自己使用的 flink 和 scala 版本。

## 如何使用 HBase 表

所有 HBase 表的列簇必须定义为 `ROW` 类型，字段名对应列簇名（`column family`），嵌套的字段名对应列限定符名（`column qualifier`）。
用户只需在表结构中声明查询中使用的列簇和列限定符。
除了 `ROW` 类型的列，剩下的原子数据类型字段（比如，`STRING`, `BIGINT`）将被识别为 HBase 的 `rowkey`，一张表中只能声明一个 `rowkey`。`rowkey` 字段的名字可以是任意的，如果是保留关键字，需要用反引号。

```sql
-- 在 Flink SQL 中注册 HBase 表 "mytable"
CREATE TABLE hTable (
 rowkey INT,
 family1 ROW<q1 INT>,
 family2 ROW<q2 STRING, q3 BIGINT>,
 family3 ROW<q4 DOUBLE, q5 BOOLEAN, q6 STRING>,
 PRIMARY KEY (rowkey) NOT ENFORCED
) WITH (
 'connector' = 'hbase-1.4',
 'table-name' = 'mytable',
 'zookeeper.quorum' = 'localhost:2181'
);

-- 用 ROW(...) 构造函数构造列簇，并往 HBase 表写数据。
-- 假设 "T" 的表结构是 [rowkey, f1q1, f2q2, f2q3, f3q4, f3q5, f3q6]
INSERT INTO hTable
SELECT rowkey, ROW(f1q1), ROW(f2q2, f2q3), ROW(f3q4, f3q5, f3q6) FROM T;

-- 从 HBase 表扫描数据
SELECT rowkey, family1, family3.q4, family3.q6 FROM hTable;

-- temporal join HBase 表，将 HBase 表作为维表
SELECT * FROM myTopic
LEFT JOIN hTable FOR SYSTEM_TIME AS OF myTopic.proctime
ON myTopic.key = hTable.rowkey;
```

## 连接器参数

| 参数                          | 	是否必选 | 	从 flink-1.15.x 开始支持<br/>是否可传递 | 	默认值	                                         | 数据类型                                                | 	描述                                                                                                                                                                                           |
|:----------------------------|:------|:-------------------------------|:----------------------------------------------|:----------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| connector	                  | 必选    | 	否	                            | (none)	                                       | String                                              | 	指定使用的连接器, 支持的值如下 :<br/>**hbase-1.4**: 连接 HBase 1.4.x 集群<br/>**hbase-2.2**: 连接 HBase 2.2.x 集群                                                                                                 |
| table-name	                 | 必选	   | 是	                             | (none)	                                       | String	                                             | 连接的 HBase 表名。                                                                                                                                                                                 |
| zookeeper.quorum	           | 必选    | 	是	                            | (none)                                        | 	String	                                            | HBase Zookeeper quorum 信息。                                                                                                                                                                    |
| zookeeper.znode.parent	     | 可选    | 	是	                            | /hbase	                                       | String	                                             | HBase 集群的 Zookeeper 根目录。                                                                                                                                                                      |
| null-string-literal	        | 可选    | 	是	                            | null	                                         | String	                                             | 当字符串值为 `null` 时的存储形式，默认存成 `null` 字符串。HBase 的 source 和 sink 的编解码将所有数据类型（除字符串外）的 `null` 值以空字节来存储。                                                                                               |
| sink.buffer-flush.max-size	 | 可选	   | 是	                             | 2mb	                                          | MemorySize	                                         | 写入的参数选项。每次写入请求缓存行的最大大小。它能提升写入 HBase 数据库的性能，但是也可能增加延迟。设置为 **0** 关闭此选项。                                                                                                                         |
| sink.buffer-flush.max-rows	 | 可选    | 	是	                            | 1000	                                         | Integer	                                            | 写入的参数选项。 每次写入请求缓存的最大行数。它能提升写入 HBase 数据库的性能，但是也可能增加延迟。设置为 **0** 关闭此选项。                                                                                                                         |
| sink.buffer-flush.interval  | 	可选	  | 是	                             | 1s	                                           | Duration	                                           | 写入的参数选项。刷写缓存行的间隔。它能提升写入 HBase 数据库的性能，但是也可能增加延迟。设置为 **0** 关闭此选项。<br/>注意：`sink.buffer-flush.max-size` 和 `sink.buffer-flush.max-rows` 同时设置为 **0**，刷写将会异步处理整个缓存行为。                                |
| sink.parallelism	           | 可选    | 	否	                            | (none)                                        | 	Integer                                            | 	为 HBase sink operator 定义并行度。默认情况下，并行度由框架决定，和链在一起的上游算子一样。                                                                                                                                     |
| lookup.async	               | 可选	   | 否	                             | false	                                        | Boolean	                                            | 是否启用异步查找。如果为true，则进行异步查找。注意：异步方式只支持 **hbase-2.2** 连接器。                                                                                                                                        |
| lookup.cache.max-rows	      | 可选    | 	是	                            | **flink-1.13.x**：(无)<br/>**flink-1.14.x**：-1	 | **flink-1.13.x**：Integer<br/>**flink-1.14.x**：Long	 | 查找缓存的最大行数，超过这个值，最旧的行将过期。注意：`lookup.cache.max-rows` 和 `lookup.cache.ttl` 必须同时被设置。默认情况下，查找缓存是禁用的。                                                                                               |
| lookup.cache.ttl	           | 可选    | 	是	                            | **flink-1.13.x**：(无)<br/>**flink-1.14.x**：0s	 | Duration	                                           | 查找缓存中每一行的最大生存时间，在这段时间内，最老的行将过期。注意：`lookup.cache.max-rows` 和 `lookup.cache.ttl` 必须同时被设置。默认情况下，查找缓存是禁用的。                                                                                        |
| lookup.max-retries	         | 可选	   | 是	                             | 3	                                            | Integer                                             | 	查找数据库失败时的最大重试次数。                                                                                                                                                                             |
| properties.*	               | 可选    | 	否	                            | (无)	                                          | String	                                             | 可以设置任意 HBase 的配置项。后缀名必须匹配在 HBase 配置文档 中定义的配置键。<br/>Flink 将移除 `properties.` 配置键前缀并将变换后的配置键和值传入底层的 HBase 客户端。 例如设置的` 'properties.hbase.security.authentication' = 'kerberos'` 将会传递kerberos认证参数。 |

## 数据类型映射表

HBase 以字节数组存储所有数据。在读和写过程中要序列化和反序列化数据。

Flink 的 HBase 连接器利用 HBase（Hadoop) 的工具类 `org.apache.hadoop.hbase.util.Bytes` 进行字节数组和 Flink 数据类型转换。

Flink 的 HBase 连接器将所有数据类型（除字符串外）的null 值编码成空字节。对于字符串类型，null 值的字面值由`null-string-literal`选项值决定。

数据类型映射表如下：

| Flink 数据类型               | 	HBase 转换                                                           |
|:-------------------------|:--------------------------------------------------------------------|
| CHAR / VARCHAR / STRING	 | byte[] toBytes(String s)<br/>String toString(byte[] b)              |
| BOOLEAN                  | 	byte[] toBytes(boolean b)<br/>boolean toBoolean(byte[] b)          |
| BINARY / VARBINARY	      | 返回 byte[]。                                                          |
| DECIMAL	                 | byte[] toBytes(BigDecimal v)<br/> BigDecimal toBigDecimal(byte[] b) |
| TINYINT	                 | new byte[] { val }<br/>bytes[0] // 只返回第一个字节                         |
| SMALLINT                 | 	byte[] toBytes(short val)<br/>short toShort(byte[] bytes)          |
| INT	                     | byte[] toBytes(int val)<br/>int toInt(byte[] bytes)                 |
| BIGINT                   | 	byte[] toBytes(long val)<br/>long toLong(byte[] bytes)             |
| FLOAT	                   | byte[] toBytes(float val)<br/>float toFloat(byte[] bytes)           |
| DOUBLE                   | 	byte[] toBytes(double val)<br/>double toDouble(byte[] bytes)       |
| DATE                     | 	从 1970-01-01 00:00:00 UTC 开始的天数，int 值。                             |
| TIME	                    | 从 1970-01-01 00:00:00 UTC 开始天的毫秒数，int 值。                            |
| TIMESTAMP                | 	从 1970-01-01 00:00:00 UTC 开始的毫秒数，long 值。                           |
| ARRAY	                   | 不支持                                                                 |
| MAP / MULTISET           | 	不支持                                                                |
| ROW	                     | 不支持                                                                 |