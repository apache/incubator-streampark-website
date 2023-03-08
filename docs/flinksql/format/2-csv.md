---
id: '2-csv'
title: 'CSV'
sidebar_position: 2
---

## 说明

支持：

* Format: Serialization Schema 序列化格式
* Format: Deserialization Schema 反序列化格式

CSV格式允许基于CSV schema读写CSV格式的数据。目前，CSV schema来源于表schema定义。

## 依赖

为了使用CSV格式，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-csv</artifactId>
    <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 版本。

## 使用CSV格式

```sql
CREATE TABLE user_behavior (
    user_id BIGINT,
    item_id BIGINT,
    category_id BIGINT,
    behavior STRING,
    ts TIMESTAMP(3)
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_behavior',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'format' = 'csv',
    'csv.ignore-parse-errors' = 'true',
    'csv.allow-comments' = 'true'
)
```

## Format参数

| 选项                          | 要求  | 是否可以被转发<br/>*从 flink-1.15.x 开始支持* | 默认值    | 类型      | 描述                                                                                                                                              |
|:----------------------------|:----|:----------------------------------|:-------|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------|
| format                      | 必选  | 否                                 | (none) | String  | 指定使用哪种格式，这儿应该是 **csv** 。                                                                                                                        |
| csv.field-delimiter         | 可选  | 是                                 | ,      | String  | 字段值分隔符号（默认为英文逗号**,**），必须是单个字符。<br/>可以使用反斜杠来指定特殊字符，比如**\t**代表制表符。<br/>也可以在纯SQL中使用unicode编码来指定，比如：**'csv.field-delimiter' = U&'\0001'**，表示0x01字符。 |
| csv.disable-quote-character | 可选  | 是                                 | false  | Boolean | 禁用用于封闭字段值的引号符号（默认为**false**）。如果为true，必须设置**csv.quote-character**选项。                                                                             |
| csv.quote-character         | 可选  | 是                                 | "      | String  | 封闭字段值的引号符号（默认为英文双引号**"**）。                                                                                                                      |
| csv.allow-comments          | 可选  | 是                                 | false  | Boolean | 忽略以**#**开头的注释行（默认禁用）。如果启动用，确认同时忽略转换错误，以允许出现空行数据。                                                                                                |
| csv.ignore-parse-errors     | 可选  | 否                                 | false  | Boolean | 跳过转换错误的属性和数据行，而不是失败。如果出现错误，字段值将设置为**null**。                                                                                                     |
| csv.array-element-delimiter | 可选  | 是                                 | ;      | String  | 数组元素分隔符号（默认为英文分号**;**）。                                                                                                                         |
| csv.escape-character        | 可选  | 是                                 | (none) | String  | 用于转义字段值的转移符号（默认禁用）。                                                                                                                             |
| csv.null-literal            | 可选  | 是                                 | (none) | String  | 将null字符串作为NULL赋给对应字段值（默认禁用）。                                                                                                                    |



## 数据类型匹配

目前，CSV schema总是派生于表schema。目前还不支持直接显式定义CSV schema。

Flink CSV格式使用`jackson databind API`解析和生成CSV字符串。

Flink类型到CSV类型的类型映射如下表所示。

| Flink SQL type          | CSV type         |
|:------------------------|:-----------------|
| CHAR / VARCHAR / STRING | string           |
| BOOLEAN                 | boolean          |
| BINARY / VARBINARY      | base64 编码的字符串    |
| DECIMAL                 | number           |
| TINYINT                 | number           |
| SMALLINT                | number           |
| INT                     | number           |
| BIGINT                  | number           |
| FLOAT                   | number           |
| DOUBLE                  | number           |
| DATE                    | date 格式的字符串      |
| TIME                    | time 格式的字符串      |
| TIMESTAMP               | date-time 格式的字符串 |
| INTERVAL                | number           |
| ARRAY                   | array            |
| ROW                     | object           |