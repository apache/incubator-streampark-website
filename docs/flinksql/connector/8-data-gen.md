---
id: '8-data-gen'
title: 'DataGen'
sidebar_position: 8
---

## 介绍

支持：

* Scan Source: Bounded 
* Scan Source: UnBounded

DataGen连接器允许通基内存的数据生成来创建表，这对于本地查询，而不是外部系统查询来说是非常有用的，比如kafka。表可以包含`Computed Column syntax`字段计算语法，以支持更灵活的数据生成。

DataGen是内建连接器，无需添加额外依赖。

## 使用

默认情况下，DataGen表将创建无限数量的数据行，并且每个字段都是随机值。对于可变大小的类型，比如**char/varchar/string/array/map/multiset**，可以指定他们的长度。另外也可以通过指定总行数，来创建一个有界表。

flink也提供了序列化生成器，用户可以指定序列的开始和结束之。如果表的某个字段为序列类型，则表将会成为有界表，当第一个字段值生成到他对应的结束值时数据生成结束。

时间类型通常为本地机器的当前系统时间。

```sql
CREATE TABLE Orders (
    order_number BIGINT,
    price        DECIMAL(32,2),
    buyer        ROW<first_name STRING, last_name STRING>,
    order_time   TIMESTAMP(3)
) WITH (
  'connector' = 'datagen'
)
```

通常情况下，数据生成连接器和`LINK`子句一起使用来模拟物理表。

```sql
CREATE TABLE Orders (
    order_number BIGINT,
    price        DECIMAL(32,2),
    buyer        ROW<first_name STRING, last_name STRING>,
    order_time   TIMESTAMP(3)
) WITH (...)

-- 创建一个模拟表
CREATE TEMPORARY TABLE GenOrders
WITH (
    'connector' = 'datagen',
    'number-of-rows' = '10'
)
LIKE Orders (EXCLUDING ALL)
```

## 数据类型

| 类型	                     | 支持的生成器             | 	备注                                                                                                    |
|:------------------------|:-------------------|:-------------------------------------------------------------------------------------------------------|
| BOOLEAN	                | random             | 	                                                                                                      |
| CHAR                    | 	random / sequence | 	                                                                                                      |
| VARCHAR	                | random / sequence  | 	                                                                                                      |
| STRING	                 | random / sequence  | 	                                                                                                      |
| DECIMAL	                | random / sequence  | 	                                                                                                      |
| TINYINT	                | random / sequence  | 	                                                                                                      |
| SMALLINT	               | random / sequence  | 	                                                                                                      |
| INT	                    | random / sequence  | 	                                                                                                      |
| BIGINT	                 | random / sequence  | 	                                                                                                      |
| FLOAT	                  | random / sequence  | 	                                                                                                      |
| DOUBLE	                 | random / sequence  | 	                                                                                                      |
| DATE	                   | random             | 	通常为本地机器的日期。                                                                                           |
| TIME	                   | random             | 	通常为本地机器的时间。                                                                                           |
| TIMESTAMP	              | random             | 	**flink-1.13.x**：通常为本地机器的时间戳。<br/>**flink-1.5.x**：解析为本地机器时间戳过去一段时间的时间戳，最大可以过去的时间可以通过 `max-past` 选项配置。 |
| TIMESTAMP_LTZ	          | random             | 	**flink-1.13.x**：通常为本地机器的时间戳。<br/>**flink-1.5.x**：解析为本地机器时间戳过去一段时间的时间戳，最大可以过去的时间可以通过 `max-past` 选项配置。 |
| INTERVAL YEAR TO MONTH	 | random             | 	                                                                                                      |
| INTERVAL DAY TO MONTH	  | random             | 	                                                                                                      |
| ROW	                    | random             | 	通过随机子属性值生成一个row类型字段值。                                                                                 |
| ARRAY	                  | random             | 	通过随机`entry`生成一个数组。                                                                                    |
| MAP	                    | random             | 	通过随机`entry`生成一个`map`表。                                                                                |
| MULTISET	               | random	            | 通过随机`entry`生成一个`multiset`。                                                                             |

## 连接器选项

| Option                                         | 	是否必须 | 	默认值	      | 类型               | 	描述                                                         |
|:-----------------------------------------------|:------|:-----------|:-----------------|:------------------------------------------------------------|
| connector	                                     | 必须    | 	(none)	   | String           | 	指定使用那个连接器，这儿应该是：**datagen**。                               |
| rows-per-second	                               | 可选    | 	10000	    | Long             | 	指定每秒生成的行数以控制发射频率。                                          |
| number-of-rows                                 | 	可选   | 	(none)	   | Long	            | 发射的数据总行数。默认情况下，表是无界的。                                       |
| fields.#.kind                                  | 	可选	  | random	    | String	          | 该**#**字段的生成器，可以是**sequence**或**random**。                    |
| fields.#.min                                   | 	可选	  | (该类型最小值)   | 	(Type of field) | 	随机生成器的最小值，指针对于数字类型。                                        |
| fields.#.max	                                  | 可选    | 	(该类型最大值)	 | (Type of field)  | 	随机生成器的最大值，只针对于数字类型。                                        |
| **从 flink-1.15.x：开始支持**<br/>fields.#.max-past	 | 可选    | 	0	        | Duration         | 	时间戳随机生成器可以过去的最大时间，只用于 **timestamp** 类型。                    |
| fields.#.length	                               | 可选    | 	100	      | Integer	         | 生成 **char/varchar/string/array/map/multiset** 可变长度类型的大小或长度。 |
| fields.#.start                                 | 	可选   | 	(none)    | 	(Type of field) | 	序列生成器的开始值。                                                 |
| fields.#.end	                                  | 可选    | 	(none)	   | (Type of field)  | 	序列生成器的结束值。                                                 |

注：上面选项中的 **#** ，在实际使用时，要替换为创建的表的某个字段名称，表示对这个字段设置属性。