---
id: '11-orc'
title: 'Orc'
sidebar_position: 11
---

## 说明

支持：

* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

[Apache Orc Format](https://orc.apache.org/) 允许读写 ORC 数据。

## 依赖

为了使用ORC格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-orc_2.11</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 和 scala 版本。

## 使用Orc格式

下面是一个用 Filesystem connector 和 Orc format 创建表的例子

```sql
CREATE TABLE user_behavior (
    user_id BIGINT,
    item_id BIGINT,
    category_id BIGINT,
    behavior STRING,
    ts TIMESTAMP(3),
    dt STRING
) PARTITIONED BY (dt) WITH (
    'connector' = 'filesystem',
    'path' = '/tmp/user_behavior',
    'format' = 'orc'
)
```

## Format 参数

| 参数     | 	是否必选 | 	默认值	   | 类型       | 	描述                      |
|:-------|:------|:--------|:---------|:-------------------------|
| format | 	必选   | 	(none) | 	String	 | 指定要使用的格式，这里应该是 **orc** 。 |

Orc 格式也支持来源于 Table properties 的表属性。 举个例子，你可以设置 `orc.compress=SNAPPY` 来允许spappy压缩。

## 数据类型映射

Orc 格式类型的映射和 Apache Hive 是兼容的。下面的表格列出了 Flink 类型的数据和 Orc 类型的数据的映射关系。

| Flink 数据类型                        | 	Orc 物理类型 | 	Orc 逻辑类型  |
|:----------------------------------|:----------|:-----------|
| CHAR	                             | bytes	    | CHAR       |
| VARCHAR	                          | bytes	    | VARCHAR    |
| STRING                            | 	bytes    | 	STRING    |
| BOOLEAN                           | 	long	    | BOOLEAN    |
| BYTES                             | 	bytes	   | BINARY     |
| DECIMAL	                          | decimal   | 	DECIMAL   |
| TINYINT	                          | long	     | BYTE       |
| SMALLINT                          | 	long	    | SHORT      |
| INT	                              | long      | 	INT       |
| BIGINT                            | 	long     | 	LONG      |
| FLOAT	                            | double    | 	FLOAT     |
| DOUBLE	                           | double    | 	DOUBLE    |
| DATE	                             | long	     | DATE       |
| TIMESTAMP	                        | timestamp | 	TIMESTAMP |
| **从 flink-1.14.x 开始支持**<br/>ARRAY | 	-	       | LIST       |
| **从 flink-1.14.x 开始支持**<br/>MAP   | 	-	       | MAP        |
| **从 flink-1.14.x 开始支持**<br/>ROW   | 	-	       | STRUCT     |


**flink-1.13.x**：复合数据类型：Array、Map、Row还不支持。  
**flink-1.14.x**：开始支持复合数据类型。