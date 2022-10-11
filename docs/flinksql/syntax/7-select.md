---
id: '7-select'
title: 'select'
sidebar_position: 7
---

## 介绍

`select语句`主要是从表中查询数据，然后将数据插入到其他表中。直接在页面中查看`select`的结果，目前平台还不支持。

单个反斜杠`\`就可以作为转义字符使用，在`select`查询中可以直接使用。

## 无表查询示例

```sql
SELECT supplier_id, rating, COUNT(*) AS total
FROM
    (VALUES
        ('supplier1', 'product1', 4),
        ('supplier1', 'product2', 3),
        ('supplier2', 'product3', 3),
        ('supplier2', 'product4', 4)
    ) AS Products(supplier_id, product_id, rating)
GROUP BY supplier_id, rating
;
```

可以将该查询结果作为临时视图，也可以作为子表使用，在测试自定义函数中会非常有用。

比如将查询的结果直接插入表：

```sql
insert into mysql_table
SELECT supplier_id, rating, COUNT(*) AS total
FROM
    (VALUES
        ('supplier1', 'product1', 4),
        ('supplier1', 'product2', 3),
        ('supplier2', 'product3', 3),
        ('supplier2', 'product4', 4)
    ) AS Products(supplier_id, product_id, rating)
GROUP BY supplier_id, rating
;
```

## SQL提示

在流批处理任务中均可使用。

`SQL提示`可以与`select`语句一起使用，以改变运行时的配置。

**在使用`sql提示`之前，需要通过`SET`语句启用动态表选项，也就是设置`table.dynamic-table-options.enabled`为`true`。**

注：在1.13.x中，该配置默认为`false`，从`1.14.x`开始，该配置默认为 `true`。

### 动态表操作

动态表（可以认为是任何表，虚拟表或者是`hive`中的表都可以）允许使用`SQL提示`在`select`查询中动态指定或覆盖表的选项配置，并且这种指定只会在当前的`select`语句中起作用。

#### 语法

`flink sql`采用了oracle风格的sql提示语法，如下所示：

```sql
table_path /*+ OPTIONS(key=val [, key=val]*) */
key:
    stringLiteralval:
    stringLiteral
```

#### 案例

```sql
CREATE TABLE kafka_table1 (id BIGINT, name STRING, age INT) WITH (...);
CREATE TABLE kafka_table2 (id BIGINT, name STRING, age INT) WITH (...);
-- 在查询中覆盖表选项
select id, name from kafka_table1 /*+ OPTIONS('scan.startup.mode'='earliest-offset') */;
-- 在join时覆盖表选项
select * from
    kafka_table1 /*+ OPTIONS('scan.startup.mode'='earliest-offset') */ t1
    join
    kafka_table2 /*+ OPTIONS('scan.startup.mode'='earliest-offset') */ t2
    on t1.id = t2.id;
-- 覆盖insert的目标表选项
insert into kafka_table1 /*+ OPTIONS('sink.partitioner'='round-robin') */ 
select * from kafka_table2;
-- 通过 sql 提示指定的选项，如果和建表时通过 with 指定的选项重复的，sql 提示指定的选项会将其覆盖
```

## WITH子句

在流批处理任务中均可使用。

WITH提供了一种编写辅助语句的方法，以便在更大的查询中使用。这些语句通常称为公共表表达式(Common Table Expression, CTE)，可以认为它们定义了仅用于一个查询的临时视图。

语法：

```sql
WITH <with_item_definition> [ , ... ]
SELECT ... FROM ...;

<with_item_defintion>:
    with_item_name (column_name[, ...n]) AS ( <select_query> )
```

使用案例：

```sql
WITH orders_with_total AS (
    SELECT order_id, price + tax AS total
    FROM Orders
)
SELECT order_id, SUM(total)
FROM orders_with_total
GROUP BY order_id;
```

上面的`with`子句定义了`orders_with_total`，并且在`group by`子句中使用了它。

## SELECT和WHERE

在流批模式任务中均可使用。

SELECT语句的一般语法为：

```sql
SELECT select_list FROM table_expression [ WHERE boolean_expression ];
```

table_expression可以引用任何数据源。它可以是一个现有表、视图或VALUES子句、多个现有表的连接结果或一个子查询。假设该表在catalog中可用，下面的语句将从Orders中读取所有行。

```sql
SELECT * FROM Orders;
```

select_list中的`*`号表示查询将会解析所有列。但是，在生产中不鼓励使用。相反，select_list可以指定手动可用列，或者使用可用列进行计算。入Orders表有名为order_id、price和tax的列，则可以编写以下查询:

```sql
SELECT order_id, price + tax FROM Orders
```

查询也可以通过VALUES子句使用内联数据。每个元组对应一行，可以提供一个别名来为每个列分配名称：

```sql
SELECT order_id, price FROM (VALUES (1, 2.0), (2, 3.1))  AS t (order_id, price);
```

可以根据WHERE子句筛选数据：

```sql
SELECT price + tax FROM Orders WHERE id = 10;
```

此外，可以在单行的列上调用内置和用户自定义的标量函数。用户自定义函数在使用前必须在目录中注册：

```sql
SELECT PRETTY_PRINT(order_id) FROM Orders;
```

## SELECT DISTINCT

在流批模式任务中均可使用。

如果指定了SELECT DISTINCT，则会从结果集中删除所有重复的行(每组重复的行保留一行)：

```sql
SELECT DISTINCT id FROM Orders;
```

对于流式查询，计算查询结果所需的状态可能会无限增长。状态大小取决于不同的数据行数量。可以提供具有适当状态生存时间(TTL)的[查询配置](../1-query-config)，以防止状态存储过大。  
注意，这可能会影响查询结果的正确性。详细信息请参见[查询配置](../1-query-config)。

## 窗口表值函数TVF

只支持流式任务。

`Windows`是处理无限流的核心，`Windows`将流分成有限大小的桶，我们可以在桶上面进行计算。

Apache Flink提供了几个窗口表值函数(TVF)来将表中的元素划分为到窗口中以供用户进行处理，包括:

* Tumble windows （滚动窗口）
* Hop windows （滑动窗口）
* Cumulate windows （累计窗口）
* Session windows（会话窗口）(即将支持，目前1.13、1.14、1.15均未支持)

### 窗口函数

Apache Flink提供了3个内置的窗口TVFs：`TUMBLE`、`HOP`和`CUMULATE`。窗口TVF的返回值是一个新的关系，它包括原来关系的所有列，以及另外3列， 名为`window_start`，`window_end`
，`window_time`来表示分配的窗口。

`window_time`字段是窗口TVF执行之后的一个时间属性，可以在后续基于时间的操作中使用。window_time的值总是等于window_end - 1ms。

#### TUMBLE

滚动窗口函数将每个元素分配给指定大小的窗口,滚动窗口的大小是固定的，并且不会重叠。假设指定了一个大小为5分钟的滚动窗口，在这种情况下，Flink将计算当前窗口，并每5分钟启动一个新窗口，如下图所示。

![img.png](/doc/image/flinksql/tumble-window.png)

TUMBLE函数根据时间属性列为表的每一行分配一个窗口。TUMBLE的返回值是一个新的关系，它包括原来表的所有列以及另外3列“window_start”，“window_end”，“window_time”来表示分配的窗口。

原表中的原始时间字段将是窗口TVF函数之后的常规时间列。TUMBLE函数需要三个参数:

```sql
-- 1.13.x
TUMBLE(TABLE data, DESCRIPTOR(timecol), size)
-- 从1.14.x开始，增加了一个可选的参数
TUMBLE(TABLE data, DESCRIPTOR(timecol), size [, offset ])
```

* data：表名，该表必须有一列类型为时间戳，也就是`TIMESTAMP`类型。
* timecol：列名，表示该列数据映射到滚动窗口。
* size：指定滚动窗口的窗口大小。
* offset：从1.14.x开始支持，可选参数，用于指定窗口开始移动的offset，也就是指定产生窗口的时间点。
  比如窗口时间为5分钟，指定开始移动的 offset 为1分钟，则触发的窗口如下：[1分钟, 6分钟)、[6分钟, 11分钟)、...。

下面是一个对Bid表的调用示例：

```sql
-- 表必须有时间字段，比如下表中的 `bidtime` 字段。
Flink SQL> desc Bid;
+-------------+------------------------+------+-----+--------+---------------------------------+
|        name |                   type | null | key | extras |                       watermark |
+-------------+------------------------+------+-----+--------+---------------------------------+
|     bidtime | TIMESTAMP(3) *ROWTIME* | true |     |        | `bidtime` - INTERVAL '1' SECOND |
|       price |         DECIMAL(10, 2) | true |     |        |                                 |
|        item |                 STRING | true |     |        |                                 |
+-------------+------------------------+------+-----+--------+---------------------------------+

Flink SQL> SELECT * FROM Bid;
+------------------+-------+------+
|          bidtime | price | item |
+------------------+-------+------+
| 2020-04-15 08:05 |  4.00 | C    |
| 2020-04-15 08:07 |  2.00 | A    |
| 2020-04-15 08:09 |  5.00 | D    |
| 2020-04-15 08:11 |  3.00 | B    |
| 2020-04-15 08:13 |  1.00 | E    |
| 2020-04-15 08:17 |  6.00 | F    |
+------------------+-------+------+

-- 注意：目前flink不支持单独使用表值窗口函数，表值窗口函数应该和聚合操作一起使用，这个示例只是展示语法以及通过表值函数产生数据
SELECT * 
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
    );
-- 或者是和参数名称一起使用。注意：DATA参数必须是第一个
SELECT * 
FROM 
    TABLE(
        TUMBLE(
            DATA => TABLE Bid,
            TIMECOL => DESCRIPTOR(bidtime),
            SIZE => INTERVAL '10' MINUTES
        )
    );
+------------------+-------+------+------------------+------------------+-------------------------+
|          bidtime | price | item |     window_start |       window_end |            window_time  |
+------------------+-------+------+------------------+------------------+-------------------------+
| 2020-04-15 08:05 |  4.00 | C    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:07 |  2.00 | A    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:09 |  5.00 | D    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
| 2020-04-15 08:17 |  6.00 | F    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
+------------------+-------+------+------------------+------------------+-------------------------+
```

从上面的结果可以看到，原始表的6行数据被分配到3个窗口中，每个滚动窗口是时间间隔为10分钟，窗口时间window_time为对应窗口结束时间-1ms。

```sql
-- 在滚动窗口表上执行聚合函数
SELECT window_start, window_end, SUM(price)
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end;
+------------------+------------------+-------+
|     window_start |       window_end | price |
+------------------+------------------+-------+
| 2020-04-15 08:00 | 2020-04-15 08:10 | 11.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | 10.00 |
+------------------+------------------+-------+
```

注意:为了更好地理解窗口的行为，我们简化了时间戳值的显示，不显示秒后面的零。
如果时间类型是timestamp(3)，在Flink SQL Client中，2020-04-15 08:05应该显示为2020-04-15 08:05:00.000。

#### HOP

HOP函数将元素分配给固定长度的窗口。和`TUMBLE`窗口功能一样，窗口的大小由窗口大小参数来配置，另一个窗口滑动参数控制跳跃窗口启动的频率，类似于 `stream api` 中的滑动窗口。

因此，如果滑动小于窗口大小，跳跃窗口就会重叠。在本例中，元素被分配给多个窗口。跳跃窗口也被称为“滑动窗口”。

例如，10分钟大小的窗口，滑动5分钟。这样，每5分钟就会得到一个窗口，窗口包含在最近10分钟内到达的事件，如下图所示。

![img.png](/doc/image/flinksql/hop-window.png)

HOP函数窗口会覆盖指定大小区间内的数据行，并根据时间属性列移动。

HOP的返回值是一个新的关系，它包括原来关系的所有列，以及“window_start”、“window_end”、“window_time”来表示指定的窗口。原表的原始的时间属性列“timecol”将是执行TVF后的常规时间戳列。

HOP接受四个必需的参数：

```sql
-- 1.13.x
HOP(TABLE data, DESCRIPTOR(timecol), slide, size)
-- 从1.14.x开始，增加了一个可选的参数
HOP(TABLE data, DESCRIPTOR(timecol), slide, size [, offset ])
```

* data：表名，该表必须有一列类型为时间戳，也就是`TIMESTAMP`类型。
* timecol：列名，表示该列数据映射到滑动窗口。
* slide：滑动时间，指定连续滑动窗口之间的间隔时间。
* size：指定滑动窗口的窗口大小。
* offset：从1.14.x开始支持，可选参数，用于指定窗口开始移动的offset，也就是指定产生窗口的时间点。
  比如窗口时间为5分钟，指定开始移动的 offset 为1分钟，则触发的窗口如下：[1分钟, 6分钟)、[6分钟, 11分钟)、...。

下面是一个对Bid表的调用示例：

```sql
-- 注意：目前flink不支持单独使用表值窗口函数，表值窗口函数应该和聚合操作一起使用，这个示例只是展示语法以及通过表值函数产生数据
SELECT * 
    FROM TABLE(
        HOP(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '5' MINUTES, INTERVAL '10' MINUTES)
    );
-- 或者是和参数名称一起使用。注意：DATA参数必须是第一个
SELECT * 
FROM TABLE(
    HOP(
        DATA => TABLE Bid,
        TIMECOL => DESCRIPTOR(bidtime),
        SLIDE => INTERVAL '5' MINUTES,
        SIZE => INTERVAL '10' MINUTES
    )
);
+------------------+-------+------+------------------+------------------+-------------------------+
|          bidtime | price | item |     window_start |       window_end |           window_time   |
+------------------+-------+------+------------------+------------------+-------------------------+
| 2020-04-15 08:05 |  4.00 | C    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:05 |  4.00 | C    | 2020-04-15 08:05 | 2020-04-15 08:15 | 2020-04-15 08:14:59.999 |
| 2020-04-15 08:07 |  2.00 | A    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:07 |  2.00 | A    | 2020-04-15 08:05 | 2020-04-15 08:15 | 2020-04-15 08:14:59.999 |
| 2020-04-15 08:09 |  5.00 | D    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:09 |  5.00 | D    | 2020-04-15 08:05 | 2020-04-15 08:15 | 2020-04-15 08:14:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:05 | 2020-04-15 08:15 | 2020-04-15 08:14:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:05 | 2020-04-15 08:15 | 2020-04-15 08:14:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
| 2020-04-15 08:17 |  6.00 | F    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
| 2020-04-15 08:17 |  6.00 | F    | 2020-04-15 08:15 | 2020-04-15 08:25 | 2020-04-15 08:24:59.999 |
+------------------+-------+------+------------------+------------------+-------------------------+
```

从上面的结果可以看出，由于窗口有重叠，所有很多数据都属于两个窗口。

```sql
-- 在滑动窗口表上运行聚合函数
SELECT window_start, window_end, SUM(price)
FROM 
    TABLE(
        HOP(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '5' MINUTES, INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end;
+------------------+------------------+-------+
|     window_start |       window_end | price |
+------------------+------------------+-------+
| 2020-04-15 08:00 | 2020-04-15 08:10 | 11.00 |
| 2020-04-15 08:05 | 2020-04-15 08:15 | 15.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | 10.00 |
| 2020-04-15 08:15 | 2020-04-15 08:25 |  6.00 |
+------------------+------------------+-------+
```

#### CUMULATE

累积窗口，或者叫做渐进式窗口，在某些情况下是非常有用的，例如在固定的窗口间隔内早期触发滚动窗口。

例如，仪表板显示当天的实时总UV数，需要从每天的00:00开始到累计每分钟的UV值，10:00的UV值表示00:00到10:00的UV总数，这就可以通过累积窗口轻松有效地实现。

CUMULATE函数将元素分配给窗口，这些窗口在初始步长间隔内覆盖行数据，并且每一步都会扩展到一个更多的步长(保持窗口开始时间为固定值)，直到最大窗口大小。

可以把CUMULATE函数看作是先应用具有最大窗口大小的TUMBLE窗口，然后把每个滚动窗口分成几个窗口，每个窗口的开始和结束都有相同的步长差。所以累积窗口有重叠，而且没有固定的大小。

例如有一个累积窗口，1小时的步长和1天的最大大小，将获得窗口:[00:00,01:00)，[00:00,02:00)，[00:00,03:00)，…，[00:00,24:00)，每天都如此。

![img.png](/doc/image/flinksql/cumulative-window-diagram.png)

累积窗口基于时间属性列分配窗口。CUMULATE的返回值是一个新的关系，它包括原来关系的所有列，另外还有3列，分别是“window_start”、“window_end”、“window_time”，表示指定的窗口。

原始的时间属性“timecol”将是窗口TVF之后的常规时间戳列。

CUMULATE接受四个必需的参数。

```sql
-- 1.13.x
CUMULATE(TABLE data, DESCRIPTOR(timecol), step, size)
-- 从1.14.x开始，增加了一个可选的参数
CUMULATE(TABLE data, DESCRIPTOR(timecol), step, size [, offset ])
```

* data：表名，该表必须有一列类型为时间戳，也就是`TIMESTAMP`类型。
* timecol：列名，表示该列数据映射到累计窗口。
* step：步长，指定连续累积窗口结束时间之间增加的窗口大小的时间间隔。
* size：指定累积窗口的窗口大小。大小必须是步长的整数倍。
* offset：从1.14.x开始支持，可选参数，用于指定窗口开始移动的offset，也就是指定产生窗口的时间点。
  比如窗口时间为5分钟，指定开始移动的 offset 为1分钟，则触发的窗口如下：[1分钟, 6分钟)、[6分钟, 11分钟)、...。

下面是一个对Bid表的调用示例：

```sql
-- 注意：目前flink不支持单独使用表值窗口函数，表值窗口函数应该和聚合操作一起使用，这个示例只是展示语法以及通过表值函数产生数据
SELECT * 
FROM 
    TABLE(
        CUMULATE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '2' MINUTES, INTERVAL '10' MINUTES)
    );
-- 或者是和参数名称一起使用。注意：DATA参数必须是第一个
SELECT * 
FROM 
    TABLE(
        CUMULATE(
            DATA => TABLE Bid,
            TIMECOL => DESCRIPTOR(bidtime),
            STEP => INTERVAL '2' MINUTES,
            SIZE => INTERVAL '10' MINUTES
        )
    );
+------------------+-------+------+------------------+------------------+-------------------------+
|          bidtime | price | item |     window_start |       window_end |            window_time  |
+------------------+-------+------+------------------+------------------+-------------------------+
| 2020-04-15 08:05 |  4.00 | C    | 2020-04-15 08:00 | 2020-04-15 08:06 | 2020-04-15 08:05:59.999 |
| 2020-04-15 08:05 |  4.00 | C    | 2020-04-15 08:00 | 2020-04-15 08:08 | 2020-04-15 08:07:59.999 |
| 2020-04-15 08:05 |  4.00 | C    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:07 |  2.00 | A    | 2020-04-15 08:00 | 2020-04-15 08:08 | 2020-04-15 08:07:59.999 |
| 2020-04-15 08:07 |  2.00 | A    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:09 |  5.00 | D    | 2020-04-15 08:00 | 2020-04-15 08:10 | 2020-04-15 08:09:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:10 | 2020-04-15 08:12 | 2020-04-15 08:11:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:10 | 2020-04-15 08:14 | 2020-04-15 08:13:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:10 | 2020-04-15 08:16 | 2020-04-15 08:15:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:10 | 2020-04-15 08:18 | 2020-04-15 08:17:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:10 | 2020-04-15 08:14 | 2020-04-15 08:13:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:10 | 2020-04-15 08:16 | 2020-04-15 08:15:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:10 | 2020-04-15 08:18 | 2020-04-15 08:17:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
| 2020-04-15 08:17 |  6.00 | F    | 2020-04-15 08:10 | 2020-04-15 08:18 | 2020-04-15 08:17:59.999 |
| 2020-04-15 08:17 |  6.00 | F    | 2020-04-15 08:10 | 2020-04-15 08:20 | 2020-04-15 08:19:59.999 |
+------------------+-------+------+------------------+------------------+-------------------------+

-- 在窗口表上运行聚合函数
SELECT window_start, window_end, SUM(price)
FROM
    TABLE(
        CUMULATE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '2' MINUTES, INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end;
+------------------+------------------+-------+
|     window_start |       window_end | price |
+------------------+------------------+-------+
| 2020-04-15 08:00 | 2020-04-15 08:06 |  4.00 |
| 2020-04-15 08:00 | 2020-04-15 08:08 |  6.00 |
| 2020-04-15 08:00 | 2020-04-15 08:10 | 11.00 |
| 2020-04-15 08:10 | 2020-04-15 08:12 |  3.00 |
| 2020-04-15 08:10 | 2020-04-15 08:14 |  4.00 |
| 2020-04-15 08:10 | 2020-04-15 08:16 |  4.00 |
| 2020-04-15 08:10 | 2020-04-15 08:18 | 10.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | 10.00 |
+------------------+------------------+-------+
```

### Window Offset

从1.14.x开始支持。

offset 是一个可选参数，该参数可以被用于更改窗口的分配，该参数的值应该是一个正数或者是负数。

默认的 window offset 为0。如果设置不同的 offset 值，则同一条数据可能会被分配到不同的窗口。

下面列出的是时间戳为 2021-06-30 00:00:04 的数据将被分配到哪个以10分钟为窗口大小的窗口：

* 如果 offset 值为 `-16 MINUTE`，数据将会被分配给 [2021-06-29 23:54:00, 2021-06-30 00:04:00) 窗口。
* 如果 offset 值为 `-6 MINUTE`，数据将会被分配给 [2021-06-29 23:54:00, 2021-06-30 00:04:00) 窗口。
* 如果 offset 值为 `-4 MINUTE`，数据将会被分配给 [2021-06-29 23:56:00, 2021-06-30 00:06:00) 窗口。
* 如果 offset 值为 `0`，数据将会被分配给 [2021-06-30 00:00:00, 2021-06-30 00:10:00) 窗口。
* 如果 offset 值为 `4 MINUTE`，数据将会被分配给 [2021-06-29 23:54:00, 2021-06-30 00:04:00) 窗口。
* 如果 offset 值为 `6 MINUTE`，数据将会被分配给 [2021-06-29 23:56:00, 2021-06-30 00:06:00) 窗口。
* 如果 offset 值为 `16 MINUTE`，数据将会被分配给 [2021-06-29 23:56:00, 2021-06-30 00:06:00) 窗口。

通过上述案例可以看到，有些窗口 offset 参数值可能会得到相同的窗口分配。

比如： -16 MINUTE, -6 MINUTE 和4 MINUTE ，对于 10 MINUTE 大小的窗口，会得到相同滚动窗口。

注意：窗口的 offset 只用于改变窗口的分配，而不会影响水印。

下面是一个在滚动窗口中使用 offset 的 sql 案例：

```sql
-- 注意：目前 flink 不支持直接使用窗口表值函数。
-- 窗口表值函数应该被用于聚合操作，下面的例子只是用于展示语法以及表值函数产生的数据。
Flink SQL> SELECT *
FROM
    TABLE(
    TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES, INTERVAL '1' MINUTES)
    );
-- 或者指定参数名称
-- 注意：DATA 参数必须放在最开始
Flink SQL> SELECT *
FROM 
    TABLE(
        TUMBLE(
            DATA => TABLE Bid,
            TIMECOL => DESCRIPTOR(bidtime),
            SIZE => INTERVAL '10' MINUTES,
            OFFSET => INTERVAL '1' MINUTES
        )
    );
+------------------+-------+------+------------------+------------------+-------------------------+
|          bidtime | price | item |     window_start |       window_end |            window_time  |
+------------------+-------+------+------------------+------------------+-------------------------+
| 2020-04-15 08:05 |  4.00 | C    | 2020-04-15 08:01 | 2020-04-15 08:11 | 2020-04-15 08:10:59.999 |
| 2020-04-15 08:07 |  2.00 | A    | 2020-04-15 08:01 | 2020-04-15 08:11 | 2020-04-15 08:10:59.999 |
| 2020-04-15 08:09 |  5.00 | D    | 2020-04-15 08:01 | 2020-04-15 08:11 | 2020-04-15 08:10:59.999 |
| 2020-04-15 08:11 |  3.00 | B    | 2020-04-15 08:11 | 2020-04-15 08:21 | 2020-04-15 08:20:59.999 |
| 2020-04-15 08:13 |  1.00 | E    | 2020-04-15 08:11 | 2020-04-15 08:21 | 2020-04-15 08:20:59.999 |
| 2020-04-15 08:17 |  6.00 | F    | 2020-04-15 08:11 | 2020-04-15 08:21 | 2020-04-15 08:20:59.999 |
+------------------+-------+------+------------------+------------------+-------------------------+

-- 在滚动窗口结果表上使用聚合函数
Flink SQL> SELECT window_start, window_end, SUM(price)
FROM
    TABLE(
            TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES, INTERVAL '1' MINUTES)
    )
GROUP BY window_start, window_end;
+------------------+------------------+-------+
|     window_start |       window_end | price |
+------------------+------------------+-------+
| 2020-04-15 08:01 | 2020-04-15 08:11 | 11.00 |
| 2020-04-15 08:11 | 2020-04-15 08:21 | 10.00 |
+------------------+------------------+-------+
```

注意：为了更好的理解窗口的行为，我们简单的展示了 `timestamp` 类型的值，并没有展示后面的0。  
比如 `2020-04-15 08:05` ，如果类型为 `TIMESTAMP(3)`， 准确来说，在 sql client 中应该被展示为 `2020-04-15 08:05:00.000`。

## 窗口聚合

### 窗口表值函数TVF聚合

只支持流式任务。

在group by子句中定义的窗口聚合函数可以使用通过窗口表值聚合函数的结果表中的“window_start”和“window_end”列。
就像使用常规GROUP BY子句的查询一样，使用GROUP BY窗口聚合的查询会给每个组计算出单个结果行。

```sql
SELECT ...
FROM <windowed_table> -- 接受通过窗口表值函数TVF生成的表
GROUP BY window_start, window_end, ...
```

与连续流表上的其他聚合不同，窗口聚合不发出中间结果，而只发出最终结果，即窗口结束之后的总聚合。此外，当不再需要时，窗口聚合会清除所有中间状态。

#### 窗口表值函数TVF

Flink支持TUMBLE、HOP和CUMULATE类型的窗口聚合，它们可以定义在事件时间或处理时间属性上。

下面是一些TUMBLE、HOP和CUMULATE窗口聚合的例子。

```sql
-- 表必须有时间属性列，比如下面表中的`bidtime`列。
Flink SQL> desc Bid;
+-------------+------------------------+------+-----+--------+---------------------------------+
|        name |                   type | null | key | extras |                       watermark |
+-------------+------------------------+------+-----+--------+---------------------------------+
|     bidtime | TIMESTAMP(3) *ROWTIME* | true |     |        | `bidtime` - INTERVAL '1' SECOND |
|       price |         DECIMAL(10, 2) | true |     |        |                                 |
|        item |                 STRING | true |     |        |                                 |
| supplier_id |                 STRING | true |     |        |                                 |
+-------------+------------------------+------+-----+--------+---------------------------------+

Flink SQL> SELECT * FROM Bid;
+------------------+-------+------+-------------+
|          bidtime | price | item | supplier_id |
+------------------+-------+------+-------------+
| 2020-04-15 08:05 | 4.00  | C    | supplier1   |
| 2020-04-15 08:07 | 2.00  | A    | supplier1   |
| 2020-04-15 08:09 | 5.00  | D    | supplier2   |
| 2020-04-15 08:11 | 3.00  | B    | supplier2   |
| 2020-04-15 08:13 | 1.00  | E    | supplier1   |
| 2020-04-15 08:17 | 6.00  | F    | supplier2   |
+------------------+-------+------+-------------+

-- 滚动窗口聚合
SELECT window_start, window_end, SUM(price)
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end;
+------------------+------------------+-------+
|     window_start |       window_end | price |
+------------------+------------------+-------+
| 2020-04-15 08:00 | 2020-04-15 08:10 | 11.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | 10.00 |
+------------------+------------------+-------+

-- 滑动窗口聚合
SELECT window_start, window_end, SUM(price)
FROM 
    TABLE(
        HOP(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '5' MINUTES, INTERVAL '10' MINUTES))
GROUP BY window_start, window_end;
+------------------+------------------+-------+
|     window_start |       window_end | price |
+------------------+------------------+-------+
| 2020-04-15 08:00 | 2020-04-15 08:10 | 11.00 |
| 2020-04-15 08:05 | 2020-04-15 08:15 | 15.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | 10.00 |
| 2020-04-15 08:15 | 2020-04-15 08:25 | 6.00  |
+------------------+------------------+-------+

-- 累计窗口聚合
SELECT window_start, window_end, SUM(price)
FROM 
    TABLE(
        CUMULATE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '2' MINUTES, INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end;
+------------------+------------------+-------+
|     window_start |       window_end | price |
+------------------+------------------+-------+
| 2020-04-15 08:00 | 2020-04-15 08:06 | 4.00  |
| 2020-04-15 08:00 | 2020-04-15 08:08 | 6.00  |
| 2020-04-15 08:00 | 2020-04-15 08:10 | 11.00 |
| 2020-04-15 08:10 | 2020-04-15 08:12 | 3.00  |
| 2020-04-15 08:10 | 2020-04-15 08:14 | 4.00  |
| 2020-04-15 08:10 | 2020-04-15 08:16 | 4.00  |
| 2020-04-15 08:10 | 2020-04-15 08:18 | 10.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | 10.00 |
+------------------+------------------+-------+
```

注意:为了更好地理解窗口的行为，我们简化了时间戳值的显示，以不显示秒小数点后面的零，
例如，如果类型是timestamp(3)，在Flink SQL Client中，2020-04-15 08:05应该显示为2020-04-15 08:05:00.000。

#### GROUPING SETS

窗口聚合也支持GROUPING SETS语法。GROUPING SETS允许进行比标准GROUP BY更复杂的分组操作。行按每个指定的分组集单独分组，并为每个分组计算聚合，就像简单的group by子句一样。

带有GROUPING SETS的窗口聚合要求window_start和window_end列必须在GROUP BY子句中，但不能在GROUPING SETS子句中。

```sql
SELECT window_start, window_end, supplier_id, SUM(price) as price
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end, GROUPING SETS ((supplier_id), ());
+------------------+------------------+-------------+-------+
|     window_start |       window_end | supplier_id | price |
+------------------+------------------+-------------+-------+
| 2020-04-15 08:00 | 2020-04-15 08:10 |      (NULL) | 11.00 |
| 2020-04-15 08:00 | 2020-04-15 08:10 |   supplier2 |  5.00 |
| 2020-04-15 08:00 | 2020-04-15 08:10 |   supplier1 |  6.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 |      (NULL) | 10.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 |   supplier2 |  9.00 |
| 2020-04-15 08:10 | 2020-04-15 08:20 |   supplier1 |  1.00 |
+------------------+------------------+-------------+-------+
```

GROUPING SETS的每个子列表可以指定零个或多个列或表达式，并且解释方式与直接写在GROUP BY子句相同。空分组集意味着将所有行聚合为单个组，即使没有输入行，该组也会输出。

对于GROUPING SETS中的子集，如果没有指定任何数据列或表达式，将会使用NULL值来代替，表示对窗口时间内的全量数据进行聚合。

##### ROLLUP

ROLLUP是一种用于指定通用分组集类型的简写符号。它表示给定的表达式列表，前缀列表和空列表。

前缀列表：也就是说，子列表是指定的所有字段，然后每次去掉最后面一个字段而生成的表达式列表，示例如下：

```sql
rollup(s1, s2, s3)
s1, s2, s3
s1, s2, null
s1, null, null
null, null, null
```

带有ROLLUP的窗口聚合要求window_start和window_end列必须在GROUP BY子句中，而不是在ROLLUP子句中。

例如，下面的查询与上面的查询等价。

```sql
SELECT window_start, window_end, supplier_id, SUM(price) as price
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end, ROLLUP (supplier_id);
```

##### CUBE

CUBE是一种用于指定公共分组集类型的简写符号。它表示给定的列表及其所有可能的子集，包括空列表。

使用CUBE的窗口聚合要求window_start和window_end列必须在GROUP BY子句中，而不是在CUBE子句中。

例如，下面两个查询是等价的。

```sql
SELECT window_start, window_end, item, supplier_id, SUM(price) as price
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end, CUBE (supplier_id, item);
------------------------------------------------------------------------------
SELECT window_start, window_end, item, supplier_id, SUM(price) as price
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end,
GROUPING SETS (
    (supplier_id, item),
    (supplier_id      ),
    (             item),
    (                 )
)
```

#### select分组窗口开始结束时间

可以使用分组的window_start和window_end列来作为组窗口的开始和结束时间戳。

#### 层叠窗口聚合

window_start和window_end列是常规的时间戳列，而不是时间属性。因此，它们不能在随后的基于时间的操作中用作时间属性。为了传播时间属性，需要在GROUP BY子句中添加window_time列。

window_time是窗口表值函数TVF产生的第三列，它是指定窗口的时间属性，比窗口结束时间早1毫秒。将window_time添加到GROUP BY子句中，使得window_time也成为可以选择的时间列。

然后，查询就可以将此列用于后续基于时间的操作，例如层叠窗口聚合和窗口TopN。

下面代码显示了层叠窗口聚合用法，其中第一个窗口聚合函数传播第二个窗口聚合的时间属性。

```sql
-- 对每个supplier_id进行5分钟的滚动窗口计算
CREATE VIEW window1 AS
SELECT window_start, window_end, window_time as rowtime, SUM(price) as partial_price
FROM 
    TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '5' MINUTES)
    )
GROUP BY supplier_id, window_start, window_end, window_time;

-- 在上面的窗口结果基础上进行10分钟的窗口滚动计算
SELECT window_start, window_end, SUM(partial_price) as total_price
FROM 
    TABLE(
        TUMBLE(TABLE window1, DESCRIPTOR(rowtime), INTERVAL '10' MINUTES)
    )
GROUP BY window_start, window_end;
```

## 分组聚合

可用于流批任务。

像大多数数据系统一样，Apache Flink支持聚合函数：内置的和用户定义的。用户定义函数在使用前必须在catalog中注册。

聚合函数通过多个输入行计算单个结果。例如，在一组行数据上计算COUNT、SUM、AVG(平均)、MAX(最大)和MIN(最小)的聚合。

```sql
SELECT COUNT(*) FROM Orders;
```

flink的流查询是永远不会终止的连续查询。该查询会根据输入表的新数据来更新结果表。对于上面的查询，每次在Orders表中插入新行时，Flink都会输出一个更新的计数。

Apache Flink支持用于聚合数据的标准GROUP BY子句。

```sql
SELECT COUNT(*)
FROM Orders
GROUP BY order_id;
```

对于流式查询，计算查询结果所需的状态可能会无限增长。状态大小取决于组的数量以及聚合函数的数量和类型。可以配置查询的状态生存时间(TTL)，以防止状态大小过大。但这可能会影响查询结果的正确性。  
详细信息请参见[查询配置](../1-query-config)。

Apache Flink为Group Aggregation提供了一系列性能调优方法，请参阅更多的[性能调优](../2-performance-tuning)。

### DISTINCT聚合

有些聚合需要在调用聚合函数之前删除重复值。下面的示例计算Orders表中不同order_ids的数量，而不是总行数。

```sql
SELECT COUNT(DISTINCT order_id) FROM Orders;
```

对于流式查询，计算查询结果所需的状态可能无限增长。状态大小主要取决于不同的行数和组维护的时间，短时间的窗口组聚合不是问题。可以配置查询的状态生存时间(TTL)，以防止状态大小过大。  
注意，这可能会影响查询结果的正确性。详细信息请参见[查询配置](../1-query-config)。

### GROUPING SETS

grouping sets可以执行比标准GROUP BY更复杂的分组操作。行数据按每个分组集单独分组，并为每个分组计算聚合函数，就像简单的group by子句一样。

```sql
SELECT supplier_id, rating, COUNT(*) AS total
FROM 
    (VALUES
        ('supplier1', 'product1', 4),
        ('supplier1', 'product2', 3),
        ('supplier2', 'product3', 3),
        ('supplier2', 'product4', 4)
    )
AS Products(supplier_id, product_id, rating)
GROUP BY GROUPING SETS ((supplier_id, rating), (supplier_id), ());
+-------------+--------+-------+
| supplier_id | rating | total |
+-------------+--------+-------+
|   supplier1 |      4 |     1 |
|   supplier1 | (NULL) |     2 |
|      (NULL) | (NULL) |     4 |
|   supplier1 |      3 |     1 |
|   supplier2 |      3 |     1 |
|   supplier2 | (NULL) |     2 |
|   supplier2 |      4 |     1 |
+-------------+--------+-------+
```

GROUPING SETS的每个子列表可以指定零个或多个列或表达式，并且其解释方式与直接在GROUP BY子句中使用相同。空分组集意味着将所有行聚合为单个组，即使没有输入行，该组也会输出。

对于分组中集中未出现的列或表达式，会使用NULL进行替换，如上图所示。

对于流式查询，计算查询结果所需的状态可能无限增长。状态大小取决于组集的数量和聚合函数的类型。可以配置查询的状态生存时间(TTL)，以防止状态大小过大。注意，这可能会影响查询结果的正确性。  
详细信息请参见[查询配置](../1-query-config)。

#### ROLLUP

ROLLUP是一种用于指定通用分组集类型的简单用法。它表示给定的表达式列表、前缀列表、空列表。 例如，下面的查询与上面的查询等价。

```sql
SELECT supplier_id, rating, COUNT(*)
FROM 
    (VALUES
        ('supplier1', 'product1', 4),
        ('supplier1', 'product2', 3),
        ('supplier2', 'product3', 3),
        ('supplier2', 'product4', 4)
    )
AS Products(supplier_id, product_id, rating)
GROUP BY ROLLUP (supplier_id, rating);
```

#### CUBE

CUBE是一种用于指定公共分组集类型的简单用法。它表示给定的列表及其所有可能的子集。例如，下面两个查询是等价的。

```sql
SELECT supplier_id, rating, product_id, COUNT(*)
FROM 
    (VALUES
        ('supplier1', 'product1', 4),
        ('supplier1', 'product2', 3),
        ('supplier2', 'product3', 3),
        ('supplier2', 'product4', 4)
    )
AS Products(supplier_id, product_id, rating)
GROUP BY CUBE (supplier_id, rating, product_id);
--------------------------------------------------------------------------
SELECT supplier_id, rating, product_id, COUNT(*)
FROM 
    (VALUES
        ('supplier1', 'product1', 4),
        ('supplier1', 'product2', 3),
        ('supplier2', 'product3', 3),
        ('supplier2', 'product4', 4)
    )
AS Products(supplier_id, product_id, rating)
GROUP BY GROUPING SET (
        ( supplier_id, product_id, rating ),
        ( supplier_id, product_id         ),
        ( supplier_id,             rating ),
        ( supplier_id                     ),
        (              product_id, rating ),
        (              product_id         ),
        (                          rating ),
        (                                 )
    );
```

### HAVING

HAVING消除不满足条件的组行。HAVING不同于WHERE:WHERE在GROUP BY之前过滤单独的行，而HAVING过滤GROUP BY创建的组行。HAVING条件引用的每个列必须是分组列中的列，以及聚合函数结果。

```sql
SELECT SUM(amount)
FROM Orders
GROUP BY users
HAVING SUM(amount) > 50;
```

HAVING的存在会将查询转换为分组查询，即使没有GROUP BY子句。这与查询包含聚合函数但没有GROUP BY子句时发生的情况相同。

查询会将所有选定的行组成一个组，SELECT列表和HAVING子句只能从聚合函数中引用列。如果HAVING条件为真，这样的查询将产生一行结果，如果不为真，则产生零行结果。

## OVER聚合

流批处理任务均可使用。

OVER聚合会对输入的每一行有序数据计算聚合值。与GROUP BY聚合相比，OVER聚合不会将每个组的结果行数减少到一行。相反，OVER聚合为每个输入行生成一个聚合值。

下面的查询会为每个订单计算在当前订单之前一小时内收到的相同产品的所有订单的总和。

```sql
SELECT order_id, order_time, amount, 
    SUM(amount) OVER (
        PARTITION BY product
        ORDER BY order_time
        RANGE BETWEEN INTERVAL '1' HOUR PRECEDING AND CURRENT ROW
    ) AS one_hour_prod_amount_sum
FROM Orders
;
```

OVER窗口的语法结构如下：

```sql
SELECT
    agg_func(agg_col) OVER (
        [PARTITION BY col1[, col2, ...]]
        ORDER BY time_col
        range_definition
    ),
    ...
FROM ...
```

可以在SELECT子句中定义多个OVER窗口聚合。但是，对于流查询，由于当前的限制，所有聚合的OVER窗口必须是相同的。

### ORDER BY

OVER窗口定义在一个有序的行序列上。由于表数据没有固定的顺序，因此order by子句是强制的。对于流式查询，Flink目前只支持以升序时间属性列顺序定义的窗口。

### PARTITION BY

可以在分区表上定义OVER窗口。如果存在PARTITION BY子句，则只在每个输入行所在分区的行上计算聚合。

### Range定义

范围定义指定聚合中包含多少行。这个范围是用BETWEEN子句定义的，它定义了下边界和上边界。边界之间的所有行都会包含在聚合中。Flink只支持CURRENT ROW作为上边界。

有两个选项可以定义范围，ROWS间隔和range间隔。

**RANGE intervals**

RANGE间隔是在ORDER BY列的值上定义的，在Flink中，需要该列类型为时间属性。下面的RANGE间隔定义函数：聚合中包含时间为当前行30分钟的所有行。

```sql
RANGE BETWEEN INTERVAL '30' MINUTE PRECEDING AND CURRENT ROW
```

**ROW intervals**

ROWS间隔是一个基于计数的间隔。它确切地定义了聚合中包含的数据行数。下面的ROWS间隔定义函数：当前行和当前行之前的10行(总共11行)包含在聚合中。

```sql
ROWS BETWEEN 10 PRECEDING AND CURRENT ROW
```

### WINDOW子句

WINDOW子句可用于在SELECT子句之外定义OVER窗口。它可以使查询更具可读性，也允许我们的多个聚合重用同一个窗口定义。

```sql
SELECT order_id, order_time, amount,
    SUM(amount) OVER w AS sum_amount,
    AVG(amount) OVER w AS avg_amount
FROM Orders
    WINDOW w AS (
        PARTITION BY product
        ORDER BY order_time
        RANGE BETWEEN INTERVAL '1' HOUR PRECEDING AND CURRENT ROW
    )
```

## Join

可同时用于流批处理任务。Flink SQL支持对动态表执行复杂而灵活的连接操作。有几种不同类型的连接来支持需要的各种查询。

**默认情况下，表的连接顺序并不会优化查询效率。表是按照在FROM子句中指定的顺序连接的。通过先列出更新频率最低的表，然后列出更新频率最高的表，可以调整连接查询的性能。**

确保以不会产生交叉连接(笛卡尔积)的顺序指定表即可，交叉连接不受支持，而且会导致查询失败。

### 常规Join

常规连接是最通用的连接类型，其中任何新记录或对连接任意一侧的更改都会影响整个连接结果。例如，左表产生一条新记录，当产品id在右表可以找到时，它将与右表所有以前和将来的记录进行连接。

```sql
SELECT * FROM Orders
INNER JOIN Product
ON Orders.productId = Product.id;
```

对于流查询，常规连接的语法是最灵活的，可以使用任何类型的更新(插入、更新、删除)输入表。然而，该操作具有重要的含义：它要求连接输入的两张表永远在Flink中保持state状态。

因此，计算查询结果所需的状态可能会无限增长，这取决于所有输入表和中间连接结果的不同输入行数。可以适当配置查询的状态生存时间(TTL)，以防止状态大小过大。  
注意，这可能会影响查询结果的正确性。详细信息请参见[查询配置](../1-query-config)。

对于流查询，计算查询结果所需的状态可能会无限增长，这取决于聚合的类型和不同分组键的数量。请提供具有有效保留间隔的[查询配置](../1-query-config)，以防止状态大小过大。

#### INNER等值连接

返回受连接条件限制的简单笛卡尔积。目前只支持等值连接，即至少具有一个具有相等谓词的连接条件的连接。不支持任意交叉或theta连接。

```sql
SELECT *
FROM Orders
INNER JOIN Product
ON Orders.product_id = Product.id;
```

#### OUTER等值连接

返回限定的笛卡尔积中的所有行(即，传递其连接条件的所有合并行)，加上连接条件与另一个表的任何行不匹配的外表中每一行的一个副本。

Flink支持左、右和全外连接。目前，只支持等值连接，即至少具有一个具有相等谓词的连接条件的连接。不支持任意交叉或theta连接。

```sql
SELECT *
FROM Orders
LEFT JOIN Product
ON Orders.product_id = Product.id;
--------------------------------------------------------------
SELECT *
FROM Orders
RIGHT JOIN Product
ON Orders.product_id = Product.id;
--------------------------------------------------------------
SELECT *
FROM Orders
FULL OUTER JOIN Product
ON Orders.product_id = Product.id;
```

### Interval Join

返回受连接条件和时间约束限制的简单笛卡尔积。Interval Join需要至少一个等连接谓词和一个连接条件来限制双方的时间。

两个适当的范围谓词就可以定义这样的条件，比如：<、<=、>=、>、BETWEEN或单个相等谓词，都可以用于比较两个输入表的相同类型的时间属性(处理时间或事件时间)。

例如，如果在收到订单4小时后发货，则此查询将会把所有订单与其相应的发货关联起来。

```sql
SELECT *
FROM Orders o, Shipments s
WHERE o.id = s.order_id
    AND o.order_time BETWEEN s.ship_time - INTERVAL '4' HOUR AND s.ship_time;
```

以下谓词是有效的Interval Join条件的示例：

```sql
ltime = rtime
ltime >= rtime AND ltime < rtime + INTERVAL '10' MINUTE
ltime BETWEEN rtime - INTERVAL '10' SECOND AND rtime + INTERVAL '5' SECOND
```

流式连接查询与常规连接相比，Interval Join只支持带有时间属性的仅追加表。由于时间属性是准单调递增的，Flink可以在不影响结果正确性的情况下将旧值从其状态中移除。

### Temporal Join

时态表是随着时间变化的表，在 flink 中也成为了动态表。时态表中的行在一个或多个时间周期内存在，所有Flink表都是时态的(动态的)。

时态表包含一个或多个版本表的快照，是一个可以追踪变更历史表（比如：数据库变更历史，包含所有的快照），或者是变化的维表（比如：包含最新快照的数据库表）。

#### Event Time Temporal Join

时态连接允许对版本化表进行连接，这意味着可以通过更改元数据来丰富表信息，并在某个时间点检索它的值。

时态连接取任意表(左输入/探查侧)，并将每一行与版本控制表(右输入/构建侧)中相应行的相关版本关联起来。Flink使用`FOR SYSTEM_TIME AS of`的SQL语法根据SQL:2011标准执行这个操作。时态连接的语法如下：

```sql
SELECT [column_list]
FROM table1 [AS <alias1>]
[LEFT] JOIN table2 FOR SYSTEM_TIME AS OF table1.{ proctime | rowtime } [AS <alias2>]
ON table1.column-name1 = table2.column-name1;
```

使用事件时间属性(即rowtime属性)，可以检索键在过去某个时刻的值。这允许在一个共同的时间点来连接两张表。版本化表将存储自最后一个水印以来所有版本的数据(按时间标识)。

例如，假设我们有一个订单表，每个订单的价格以不同的货币表示。要将此表适当地规范化为单一货币(如美元)，每个订单都需要与下单时的适当货币转换汇率连接起来。

```sql
-- 创建一个订单表，这是个标准的仅追加表。
CREATE TABLE orders (
    order_id STRING,
    price DECIMAL(32,2),
    currency STRING,
    order_time TIMESTAMP(3),
    WATERMARK FOR order_time AS order_time
) WITH (/* ... */);

-- 定义一个版本化表来存储货币转化率。这个表可以通过CDC定义，比如Debezium、压缩的kafka主题，或者是任何其他的方式定义版本化表。
CREATE TABLE currency_rates (
    currency STRING,
    conversion_rate DECIMAL(32, 2),
    update_time TIMESTAMP(3) METADATA FROM `values.source.timestamp` VIRTUAL
    WATERMARK FOR update_time AS update_time
) WITH (
    'connector' = 'upsert-kafka',
/* ... */
);

SELECT
    order_id,
    price,
    currency,
    conversion_rate,
    order_time,
FROM orders
LEFT JOIN currency_rates FOR SYSTEM_TIME AS OF orders.order_time
ON orders.currency = currency_rates.currency;
order_id  price  currency  conversion_rate  order_time
========  =====  ========  ===============  =========
o_001     11.11  EUR       1.14             12:00:00
o_002     12.51  EUR       1.10             12:06:00

```

注意：事件时间时态连接是由左右两边的水印触发的，连接的两张表都必须正确地设置水印。

注意：事件时间时态连接需要有包含主键的等值连接条件，例如，product_changelog表的主键P.product_id被约束在条件O.product_id = P.product_id中。

与常规连接相比，尽管构建端（右表）发生了更改，但前面的时态表结果并不会受到影响。与间隔连接（Interval Join）相比，时态表连接没有定义连接记录的时间窗口。

间隔连接包含时间窗口，时间窗口内的左右表数据都会进行连接。探测端（左表）记录总是在time属性指定的时间与构建端对应时间的数据进行连接。

因此，构建端的行可能是任意旧的。随着时间的推移，不再需要的记录版本(对于给定的主键)将从状态中删除。

#### Processing Time Temporal Join

处理时间时态表连接使用处理时间属性将行与外部版本表中键对应的最新版本数据进行关联。

根据定义，使用处理时间属性，连接将始终返回给定键的最新值。可以将查询表看作简单的HashMap<K, V>
，它存储了来自构建端的所有记录。这种连接的强大之处是，当不能在Flink中将表具体化为动态表时，它允许Flink直接针对外部系统工作。

下面的处理时间时态表连接示例显示了一个只追加的表订单，它与LatestRates表连接。LatestRates是一个维表(例如HBase表)，存储最新的比例。

在10:15,10:30,10:52,LatestRates的内容如下:

```sql
10:15> SELECT * FROM LatestRates;

currency   rate
======== ======
US Dollar   102
Euro        114
Yen           1

10:30> SELECT * FROM LatestRates;

currency   rate
======== ======
US Dollar   102
Euro        114
Yen           1

10:52> SELECT * FROM LatestRates;

currency   rate
======== ======
US Dollar   102
Euro        116     <==== changed from 114 to 116
Yen           1
```

10:15和10:30的LatestRates的内容是相等的。欧元汇率在10:52从114变到了116。

订单是一个仅追加表，表示给定金额和给定货币的支付数据。例如，在10:15有一个2欧元的订单。

```sql
SELECT * FROM Orders;

amount currency
====== =========
     2 Euro             <== arrived at time 10:15
     1 US Dollar        <== arrived at time 10:30
     2 Euro             <== arrived at time 10:52
```

根据这些表，来将所有订单转换为相同的货币。

```sql
amount currency     rate   amount*rate
====== ========= ======= ============
     2 Euro          114          228    <== arrived at time 10:15
     1 US Dollar     102          102    <== arrived at time 10:30
     2 Euro          116          232    <== arrived at time 10:52
```

在时态表连接的帮助下，我们可以在SQL中进行这样一个查询：

```sql
SELECT
o.amount, o.currency, r.rate, o.amount * r.rate
FROM Orders AS o
JOIN LatestRates FOR SYSTEM_TIME AS OF o.proctime AS r
ON r.currency = o.currency;
```

探测端（左表）中的每条记录都将与构建端表（右表）的当前版本记录进行连接。在上例中，使用了处理时间概念，因此在执行操作时，新添加的记录总是与最新版本的LatestRates表数据连接。

处理时间的结果是不确定的。处理时间时态连接最常使用外部表(即维度表)作为构建端（右表）。

与常规连接相比，尽管构建端（右表）发生了更改，前面的时态表结果也不会受到影响。与间隔连接相比，时态表连接没有定义记录连接的时间窗口，也就是说，旧行不会进行状态存储。

### Lookup Join

Lookup Join通常使用从外部系统查询的数据来丰富表。连接要求一个表具有处理时间属性，另一个表由lookup source连接器支持。

查找连接使用上面的Processing Time Temporal join语法，并使用查找源连接器支持表。

下面的示例显示了指定Lookup Join的语法。

```sql
-- Customers通过JDBC连接器创建，并且可以被用于lookup joins
CREATE TEMPORARY TABLE Customers (
    id INT,
    name STRING,
    country STRING,
    zip STRING
) WITH (
    'connector' = 'jdbc',
    'url' = 'jdbc:mysql://mysqlhost:3306/customerdb',
    'table-name' = 'customers'
);

-- 通过customer来丰富订单信息
SELECT o.order_id, o.total, c.country, c.zip
FROM Orders AS o
JOIN Customers FOR SYSTEM_TIME AS OF o.proc_time AS c
ON o.customer_id = c.id;
```

在上面的示例中，Orders表使用来自MySQL数据库中的Customers表的数据进行数据信息扩展。通过后面处理时间属性的FOR SYSTEM_TIME AS OF子句确保在连接操作处理Orders行时，
Orders表的每一行都与那些匹配连接谓词的Customers行连接。它还防止在将来更新已连接的Customer行时更新连接结果。

Lookup Join还需要一个强制相等联接谓词，如上面示例中的o.customer_id = c.id。

### Array展开

为给定数组中的每个元素返回新行。目前还不支持WITH ORDINALITY。

```sql
SELECT order_id, t.tag
FROM Orders
CROSS JOIN UNNEST(tags) AS t (tag);
```

### 表函数

将表与表函数的结果进行连接。左表(外部表)的每一行都与对应的table函数调用产生的所有行连接。用户自定义的表函数在使用前必须注册。

#### INNER JOIN

如果左表(外部)的表函数调用返回空结果，则删除该行。

```sql
SELECT order_id, res
FROM Orders, LATERAL TABLE(table_func(order_id)) t(res);
```

#### LEFT OUTER JOIN

如果表函数调用返回空结果，则保留相应的左表数据行，并在结果中填充空值。目前，针对表的左外连接需要在ON子句中使用TRUE字面值。

```sql
SELECT order_id, res
FROM Orders
LEFT OUTER JOIN LATERAL TABLE(table_func(order_id)) t(res)
ON TRUE;
```

## window join

从 fink-1.14.x 开始支持。

只能在流式处理中使用。

window join 会将时间尺度添加到他们的 join 标准中。如此一来， window join 就会将两个流中同一个窗口内拥有两个相同 key 的元素 join 起来。
window join 的语义和 DataStream window join 的语义相同。

对于 streaming 查询，和其他的流表 join 不同， window join 不会马上发射结果数据，而是在窗口结束之后发射最终的结果。此外，在不需要保存数据时， window join 会清除所有的中间状态数据。

通常来说，window join 会和窗口表值函数一起使用。因此，基于窗口表值函数，window join 后面可以接受其他函数操作，比如窗口聚合、窗口 TopN、window join。

目前，window join 要求 join 的输入表有相同的窗口开始和相同的窗口结束。

window join 支持 INNER、LEFT、RIGHT、FULL OUTER、ANTI、SEMI JOIN。

### INNER/LEFT/RIGHT/FULL OUTER

下面的例子展示在 window join 语句中使用 INNER/LEFT/RIGHT/FULL OUTER 的语法。

```sql
SELECT ...
FROM L
[LEFT|RIGHT|FULL OUTER] JOIN R -- L 和 R 表可以是窗口表值函数产生的表
ON L.window_start = R.window_start AND L.window_end = R.window_end AND ...
```

INNER/LEFT/RIGHT/FULL OUTER WINDOW JOIN 的语法彼此是非常相似的，下面我们只给出了 FULL OUTER JOIN 的例子。

当使用 window join 时，在一个滚动窗口中，拥有相同 key 的所有元素将会 join 到一起。

下面的例子中，我们只在 window join 的滚动窗口上使用了一个滚动窗口表值函数。

通过将 join 的窗口限制在五分钟间隔，我们将会截断数据集为两个不同的窗口：[12:00, 12:05) 和 [12:05, 12:10)。L2 和 R2 行不会 join 到一起，因为他们处于不同的窗口中。

```sql
desc LeftTable;
+----------+------------------------+------+-----+--------+----------------------------------+
|     name |                   type | null | key | extras |                        watermark |
+----------+------------------------+------+-----+--------+----------------------------------+
| row_time | TIMESTAMP(3) *ROWTIME* | true |     |        | `row_time` - INTERVAL '1' SECOND |
|      num |                    INT | true |     |        |                                  |
|       id |                 STRING | true |     |        |                                  |
+----------+------------------------+------+-----+--------+----------------------------------+

SELECT * FROM LeftTable;
+------------------+-----+----+
|         row_time | num | id |
+------------------+-----+----+
| 2020-04-15 12:02 |   1 | L1 |
| 2020-04-15 12:06 |   2 | L2 |
| 2020-04-15 12:03 |   3 | L3 |
+------------------+-----+----+

desc RightTable;
+----------+------------------------+------+-----+--------+----------------------------------+
|     name |                   type | null | key | extras |                        watermark |
+----------+------------------------+------+-----+--------+----------------------------------+
| row_time | TIMESTAMP(3) *ROWTIME* | true |     |        | `row_time` - INTERVAL '1' SECOND |
|      num |                    INT | true |     |        |                                  |
|       id |                 STRING | true |     |        |                                  |
+----------+------------------------+------+-----+--------+----------------------------------+

SELECT * FROM RightTable;
+------------------+-----+----+
|         row_time | num | id |
+------------------+-----+----+
| 2020-04-15 12:01 |   2 | R2 |
| 2020-04-15 12:04 |   3 | R3 |
| 2020-04-15 12:05 |   4 | R4 |
+------------------+-----+----+
SELECT L.num as L_Num, L.id as L_Id, R.num as R_Num, R.id as R_Id, L.window_start, L.window_end
FROM
  (
  SELECT * FROM TABLE(TUMBLE(TABLE LeftTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
  ) L
FULL JOIN
  (
  SELECT * FROM TABLE(TUMBLE(TABLE RightTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
  ) R
ON L.num = R.num AND L.window_start = R.window_start AND L.window_end = R.window_end;
+-------+------+-------+------+------------------+------------------+
| L_Num | L_Id | R_Num | R_Id |     window_start |       window_end |
+-------+------+-------+------+------------------+------------------+
|     1 |   L1 |  null | null | 2020-04-15 12:00 | 2020-04-15 12:05 |
|  null | null |     2 |   R2 | 2020-04-15 12:00 | 2020-04-15 12:05 |
|     3 |   L3 |     3 |   R3 | 2020-04-15 12:00 | 2020-04-15 12:05 |
|     2 |   L2 |  null | null | 2020-04-15 12:05 | 2020-04-15 12:10 |
|  null | null |     4 |   R4 | 2020-04-15 12:05 | 2020-04-15 12:10 |
+-------+------+-------+------+------------------+------------------+
```

注意：为了更好的理解窗口 join 的行为，我们简单展示了时间戳值，并没有展示后面的0。
比如，TIMESTAMP(3) 类型的数据，在 FLINK CLI 中，2020-04-15 08:05 应该被展示为 2020-04-15 08:05:00.000 。

### SEMI

在同一个窗口中，如果左表和右表至少有一行匹配，则 semi window join 会返回左表的一行记录。

```sql

SELECT *
FROM
    (
    SELECT * FROM TABLE(TUMBLE(TABLE LeftTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
    ) L
WHERE L.num IN
    (
    SELECT num
    FROM
        (   
        SELECT * FROM TABLE(TUMBLE(TABLE RightTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
        ) R
    WHERE L.window_start = R.window_start AND L.window_end = R.window_end
    );
+------------------+-----+----+------------------+------------------+-------------------------+
|         row_time | num | id |     window_start |       window_end |            window_time  |
+------------------+-----+----+------------------+------------------+-------------------------+
| 2020-04-15 12:03 |   3 | L3 | 2020-04-15 12:00 | 2020-04-15 12:05 | 2020-04-15 12:04:59.999 |
+------------------+-----+----+------------------+------------------+-------------------------+

SELECT *
FROM
    (
    SELECT * FROM TABLE(TUMBLE(TABLE LeftTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
    ) L
WHERE EXISTS
    (
    SELECT *
    FROM
        (
        SELECT * FROM TABLE(TUMBLE(TABLE RightTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
        ) R
    WHERE L.num = R.num AND L.window_start = R.window_start AND L.window_end = R.window_end
    );
+------------------+-----+----+------------------+------------------+-------------------------+
|         row_time | num | id |     window_start |       window_end |            window_time  |
+------------------+-----+----+------------------+------------------+-------------------------+
| 2020-04-15 12:03 |   3 | L3 | 2020-04-15 12:00 | 2020-04-15 12:05 | 2020-04-15 12:04:59.999 |
+------------------+-----+----+------------------+------------------+-------------------------+
```

注意：为了更好的理解窗口 join 的行为，我们简单展示了时间戳值，并没有展示后面的0。
比如，TIMESTAMP(3) 类型的数据，在 FLINK CLI 中，2020-04-15 08:05 应该被展示为 2020-04-15 08:05:00.000 。

### ANTI

anti window join 会返回同一个窗口中所有没有 join 到一起的行。

```sql

SELECT *
FROM
    (
    SELECT * FROM TABLE(TUMBLE(TABLE LeftTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
    ) L
WHERE L.num NOT IN
    (
    SELECT num
    FROM
        (   
        SELECT * FROM TABLE(TUMBLE(TABLE RightTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
        ) R
    WHERE L.window_start = R.window_start AND L.window_end = R.window_end
    );
+------------------+-----+----+------------------+------------------+-------------------------+
|         row_time | num | id |     window_start |       window_end |            window_time  |
+------------------+-----+----+------------------+------------------+-------------------------+
| 2020-04-15 12:02 |   1 | L1 | 2020-04-15 12:00 | 2020-04-15 12:05 | 2020-04-15 12:04:59.999 |
| 2020-04-15 12:06 |   2 | L2 | 2020-04-15 12:05 | 2020-04-15 12:10 | 2020-04-15 12:09:59.999 |
+------------------+-----+----+------------------+------------------+-------------------------+

SELECT *
FROM
    (
    SELECT * FROM TABLE(TUMBLE(TABLE LeftTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
    ) L
WHERE NOT EXISTS
    (
    SELECT *
    FROM
        (
        SELECT * FROM TABLE(TUMBLE(TABLE RightTable, DESCRIPTOR(row_time), INTERVAL '5' MINUTES))
        ) R
    WHERE L.num = R.num AND L.window_start = R.window_start AND L.window_end = R.window_end
    );
+------------------+-----+----+------------------+------------------+-------------------------+
|         row_time | num | id |     window_start |       window_end |            window_time  |
+------------------+-----+----+------------------+------------------+-------------------------+
| 2020-04-15 12:02 |   1 | L1 | 2020-04-15 12:00 | 2020-04-15 12:05 | 2020-04-15 12:04:59.999 |
| 2020-04-15 12:06 |   2 | L2 | 2020-04-15 12:05 | 2020-04-15 12:10 | 2020-04-15 12:09:59.999 |
+------------------+-----+----+------------------+------------------+-------------------------+
```

注意：为了更好的理解窗口 join 的行为，我们简单展示了时间戳值，并没有展示后面的0。
比如，TIMESTAMP(3) 类型的数据，在 FLINK CLI 中，2020-04-15 08:05 应该被展示为 2020-04-15 08:05:00.000 。

### 限制

#### join条件的限制

目前，window join 要求两张表拥有相同的窗口开始和窗口结束。未来，我们简化 join on 条件，如果窗口表值函数为滚动或者滑动，则只需要两张表有相同的窗口开始即可。

#### 在输入表上使用窗口TVF的限制

目前，左表和右表必须有相同的窗口表值函数。将来我们会扩展该功能，比如，有用相同窗口大小的滚动窗口 join 滑动窗口。

#### 直接在窗口TVF后使用window join的限制

目前，如果在窗口表值函数之后使用 window join ，窗口函数只能是滚动窗口、滑动窗口或者是累计窗口，而不能是会话窗口。

## 集合操作

在流批任务中均可使用。

### UNION

UNION和UNION ALL会返回两张表的所有行。UNION会对结果去重，而UNION ALL不会对结果行去重。

```sql
Flink SQL> create view t1(s) as values ('c'), ('a'), ('b'), ('b'), ('c');
Flink SQL> create view t2(s) as values ('d'), ('e'), ('a'), ('b'), ('b');
Flink SQL> (SELECT s FROM t1) UNION (SELECT s FROM t2);
+---+
| s|
+---+
| c|
| a|
| b|
| d|
| e|
+---+
Flink SQL> (SELECT s FROM t1) UNION ALL (SELECT s FROM t2);
+---+
| s|
+---+
| c|
| a|
| b|
| b|
| c|
| d|
| e|
| a|
| b|
| b|
+---+
```

### INTERSECT

交集

INTERSECT和INTERSECT ALL返回在两个表中都存在的行。INTERSECT会对结果行去重，而INTERSECT ALL不会去重。

```sql
Flink SQL> (SELECT s FROM t1) INTERSECT (SELECT s FROM t2);
+---+
| s|
+---+
| a|
| b|
+---+
Flink SQL> (SELECT s FROM t1) INTERSECT ALL (SELECT s FROM t2);
+---+
| s|
+---+
| a|
| b|
| b|
+---+
```

### EXCEPT

差集

EXCEPT和EXCEPT ALL返回在一个表中找到，但在另一个表中没有找到的行。EXCEPT会对结果去重，而EXCEPT ALL不会对结果去重。

```sql
Flink SQL> (SELECT s FROM t1) EXCEPT (SELECT s FROM t2);
+---+
| s |
+---+
| c |
+---+
Flink SQL> (SELECT s FROM t1) EXCEPT ALL (SELECT s FROM t2);
+---+
| s |
+---+
| c |
| c |
+---+
```

### IN

如果外表字段值存在于给定的子查询结果表数据，则返回true。子查询结果表必须由一列组成。此列必须具有与表达式相同的数据类型。

```sql
SELECT user, amount
FROM Orders
WHERE product IN
    (
    SELECT product
    FROM NewProducts
    )
;
```

优化器将IN条件重写为join和group操作。对于流查询，计算查询结果所需的状态可能会无限增长，这取决于不同的输入行数。  
可以通过配置合适的状态生存时间(TTL)，以防止状态大小过大。注意，这可能会影响查询结果的正确性。详细信息请参见[查询配置](../1-query-config)。

### EXISTS

```sql
SELECT user, amount
FROM Orders
WHERE product EXISTS
    (
    SELECT product
    FROM NewProducts
    )
;
```

如果子查询返回至少一行，则返回true。只有当操作可以在join和group操作中重写时才支持该语法。

优化器将EXISTS操作重写为join和group操作。对于流查询，计算查询结果所需的状态可能会无限增长，这取决于不同的输入行数。  
可以通过配置合适的状态生存时间(TTL)，以防止状态大小过大。注意，这可能会影响查询结果的正确性。详细信息请参见[查询配置](../1-query-config)。

## ORDER BY子句

在流批任务中均可使用。

ORDER BY子句会根据指定的表达式对结果行进行排序。如果根据最左边的表达式比较，两行相等，则继续根据下一个表达式对它们进行比较，以此类推。如果根据所有指定的表达式比较，它们都是相等的，则以依赖于实现的顺序返回它们。

当以流模式运行时，表的主要排序顺序必须根据时间属性进行升序进行排序。所有后续排序都可以自由选择。但是在批处理模式中没有这种限制。

```sql
SELECT *
FROM Orders
ORDER BY order_time, order_id;
```

### LIMIT子句

只能在批处理任务中使用。 LIMIT子句限制SELECT语句返回的行数。LIMIT通常与ORDER BY一起使用，以确保结果的确定性。

下面的示例返回Orders表中的前3行。

```sql
SELECT *
FROM Orders
ORDER BY orderTime
LIMIT 3;
```

## Top-N

在流批任务中均可使用。

Top-N查询返回按列排序的N个最小或最大值。最小和最大的值集都被认为是Top-N查询。top-N查询在需要只显示批处理/流表中最下面的N条或最上面的N条记录的情况下非常有用。此结果集可用于进一步分析。

Flink使用OVER窗口子句和筛选条件的组合来表示Top-N查询。通过OVER窗口PARTITION BY子句的功能，Flink还支持多组Top-N。

例如，每个类别中实时销售额最高的前五种产品。对于批处理表和流表上的SQL，都支持Top-N查询。

Top-N语句的语法如下:

```sql
SELECT [column_list]
FROM
    (
    SELECT [column_list],
        ROW_NUMBER() OVER (
            [PARTITION BY col1[, col2...]]
            ORDER BY col1 [asc|desc][, col2 [asc|desc]...]
        ) AS rownum
    FROM table_name
    )
WHERE rownum <= N [AND conditions]
```

参数说明：

* ROW_NUMBER()：根据分区中的数据行顺序，从1开始为每一行分配一个唯一的连续编号。目前，我们只支持ROW_NUMBER作为over window函数。将来，我们会支持RANK()和DENSE_RANK()。
* PARTITION BY col1[, col2...]：分区列。每个分区都有一个Top-N结果。
* ORDER BY col1 [asc|desc][, col2 [asc|desc]...]：指定排序列。不同列的排序方式可能不同。
* WHERE rownum <= N： Flink需要rownum <= N来识别这个查询是Top-N查询。N表示将保留N条最小或最大的记录。
* [AND conditions]：在where子句中可以随意添加其他条件，但其他条件只能使用AND关键字与rownum <= N组合。

注意：必须完全遵循上述模式，否则优化器将无法转换查询。

TopN查询结果为“结果更新”。Flink SQL将根据order键对输入数据流进行排序，因此如果前N条记录被更改，则更改后的记录将作为撤销/更新记录发送到下游。建议使用支持更新的存储作为Top-N查询的sink。

此外，如果top N记录需要存储在外部存储中，结果表应该具有与top-N查询相同的唯一键。

Top-N查询的唯一键是partition列和rownum列的组合。以下面的作业为例，假设product_id是ShopSales的唯一键，那么Top-N查询的唯一键是[category, rownum]和[product_id]。

下面的示例展示如何在流表上使用Top-N指定SQL查询。这是一个获得“每个类别中实时销售额最高的前五种产品”的例子。

```sql
CREATE TABLE ShopSales (
    product_id STRING,
    category STRING,
    product_name STRING,
    sales BIGINT
) WITH (...);

SELECT product_id, category, product_name, sales, row_num
FROM
    (
    SELECT product_id, category, product_name, sales,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) AS row_num
    FROM ShopSales
    )
WHERE row_num <= 5;
```

**无等级字段输出优化**

如前所述，rownum字段将作为唯一键的一个字段写入结果表，这可能会导致大量记录被写入结果表。例如，当排名9的记录(比如product-1001)被更新并将其排名升级为1时，排名1 ~9的所有记录将作为更新消息输出到结果表。

如果结果表接收的数据过多，将成为SQL作业的瓶颈。优化方法是在Top-N查询的外部SELECT子句中省略rownum字段。这是合理的，因为前N个记录的数量通常不大，因此消费者可以自己快速地对结果记录进行排序。

在上面的示例中，如果没有rownum字段，只需要将更改后的记录(product-1001)发送到下游，这可以减少对结果表的大量IO。

下面的例子展示了如何用这种方式优化上面的Top-N：

```sql
CREATE TABLE ShopSales (
    product_id STRING,
    category STRING,
    product_name STRING,
    sales BIGINT
) WITH (...);

-- 输出时省略row_num字段
SELECT product_id, category, product_name, sales
FROM
    (
    SELECT product_id, category, product_name, sales,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) AS row_num
    FROM ShopSales
    )
WHERE row_num <= 5;
```

注意在流模式下，为了将上述查询输出到外部存储并得到正确的结果，外部存储必须与Top-N查询具有相同的唯一键。在上面的查询示例中，如果product_id是查询的唯一键，那么外部表也应该将product_id作为唯一键。

## Window Top-N

**flink-1.13.x**：只能在流模式任务中使用。  
**flink-1.15.x**：可以在流批模式中使用。

Window Top-N是一个特殊的Top-N，它返回每个窗口以及其他分区键的N个最小或最大值。

对于流查询，与连续表上的常规top-N不同，窗口top-N不会发出中间结果，而只发出最终结果，即窗口末端的top-N所有记录。

此外，当不再需要时，窗口Top-N会清除所有中间状态。因此，如果用户不需要对每条记录更新结果，那么窗口Top-N查询会具有更好的性能。

**flink-1.13.x**：通常，窗口top-N与窗口聚合函数一起使用。  
**flink-1.14.x**：通常，窗口 top-N 可以在窗口表值函数上直接使用，因此，窗口 top-N 可以基于窗口表值函数和其他函数一起使用，比如：窗口聚合、窗口 topN 和窗口 join。

Window Top-N可以用与常规Top-N相同的语法定义，此外，Window Top-N要求PARTITION BY子句包含window_start和window_end列，通过Windowing TVF或窗口聚合产生。

否则，优化器将无法翻译对应的sql查询。

Window Top-N语句的语法如下所示：

```sql
SELECT [column_list]
FROM
    (
    SELECT [column_list],
        ROW_NUMBER() OVER (
            PARTITION BY window_start, window_end [, col_key1...]
            ORDER BY col1 [asc|desc][, col2 [asc|desc]...]
        ) AS rownum
    FROM table_name
    ) -- 通过windowing TVF产生表
WHERE rownum <= N [AND conditions]
```

### 在窗口聚合函数后使用窗口top-N

下面的例子展示如何计算每10分钟滚动窗口中销售额最高的前3个供应商：

```sql
-- 表必须有时间属性，比如下表中的bidtime列
Flink SQL> desc Bid;
+-------------+------------------------+------+-----+--------+---------------------------------+
|        name |                   type | null | key | extras |                       watermark |
+-------------+------------------------+------+-----+--------+---------------------------------+
|     bidtime | TIMESTAMP(3) *ROWTIME* | true |     |        | `bidtime` - INTERVAL '1' SECOND |
|       price |         DECIMAL(10, 2) | true |     |        |                                 |
|        item |                 STRING | true |     |        |                                 |
| supplier_id |                 STRING | true |     |        |                                 |
+-------------+------------------------+------+-----+--------+---------------------------------+

Flink SQL> SELECT * FROM Bid;
+------------------+-------+------+-------------+
| bidtime | price | item | supplier_id |
+------------------+-------+------+-------------+
| 2020-04-15 08:05 | 4.00 | A | supplier1 |
| 2020-04-15 08:06 | 4.00 | C | supplier2 |
| 2020-04-15 08:07 | 2.00 | G | supplier1 |
| 2020-04-15 08:08 | 2.00 | B | supplier3 |
| 2020-04-15 08:09 | 5.00 | D | supplier4 |
| 2020-04-15 08:11 | 2.00 | B | supplier3 |
| 2020-04-15 08:13 | 1.00 | E | supplier1 |
| 2020-04-15 08:15 | 3.00 | H | supplier2 |
| 2020-04-15 08:17 | 6.00 | F | supplier5 |
+------------------+-------+------+-------------+

Flink SQL> SELECT *
FROM
    (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY window_start, window_end ORDER BY price DESC) as rownum
    FROM
        (
        SELECT window_start, window_end, supplier_id, SUM(price) as price, COUNT(*) as cnt
        FROM TABLE (TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES))
        GROUP BY window_start, window_end, supplier_id
        )
    )
WHERE rownum <= 3;
+------------------+------------------+-------------+-------+-----+--------+
| window_start | window_end | supplier_id | price | cnt | rownum |
+------------------+------------------+-------------+-------+-----+--------+
| 2020-04-15 08:00 | 2020-04-15 08:10 | supplier1 | 6.00 | 2 | 1 |
| 2020-04-15 08:00 | 2020-04-15 08:10 | supplier4 | 5.00 | 1 | 2 |
| 2020-04-15 08:00 | 2020-04-15 08:10 | supplier2 | 4.00 | 1 | 3 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | supplier5 | 6.00 | 1 | 1 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | supplier2 | 3.00 | 1 | 2 |
| 2020-04-15 08:10 | 2020-04-15 08:20 | supplier3 | 2.00 | 1 | 3 |
+------------------+------------------+-------------+-------+-----+--------+
```

注意:为了更好地理解窗口的行为，我们简化了时间戳值的显示，不显示秒小数点后的零。
例如，如果类型是timestamp(3)，在Flink SQL Client中，2020-04-15 08:05应该显示为2020-04-15 08:05:00.000。

### 在窗口表值函数后使用窗口top-N

flink-1.14.x开始支持。

下面的例子展示怎么每个滚动窗口内 Top 3 的最高价格的 item。

```sql
SELECT *
FROM
    (
    SELECT bidtime, price, item, supplier_id, window_start, window_end, ROW_NUMBER() OVER (PARTITION BY window_start, window_end ORDER BY price DESC) as rownum
    FROM TABLE
        (
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES)
        )
    )
WHERE rownum <= 3;
+------------------+-------+------+-------------+------------------+------------------+--------+
|          bidtime | price | item | supplier_id |     window_start |       window_end | rownum |
+------------------+-------+------+-------------+------------------+------------------+--------+
| 2020-04-15 08:05 |  4.00 |    A |   supplier1 | 2020-04-15 08:00 | 2020-04-15 08:10 |      2 |
| 2020-04-15 08:06 |  4.00 |    C |   supplier2 | 2020-04-15 08:00 | 2020-04-15 08:10 |      3 |
| 2020-04-15 08:09 |  5.00 |    D |   supplier4 | 2020-04-15 08:00 | 2020-04-15 08:10 |      1 |
| 2020-04-15 08:11 |  2.00 |    B |   supplier3 | 2020-04-15 08:10 | 2020-04-15 08:20 |      3 |
| 2020-04-15 08:15 |  3.00 |    H |   supplier2 | 2020-04-15 08:10 | 2020-04-15 08:20 |      2 |
| 2020-04-15 08:17 |  6.00 |    F |   supplier5 | 2020-04-15 08:10 | 2020-04-15 08:20 |      1 |
+------------------+-------+------+-------------+------------------+------------------+--------+
```

注意:为了更好地理解窗口的行为，我们简化了时间戳值的显示，不显示秒小数点后的零，例如，如果类型是timestamp(3)，在Flink SQL Client中，2020-04-15 08:05应该显示为2020-04-15 08:05:
00.000。

### 限制

**flink-1.13.x**：目前，Flink只支持Window Top-N紧随Window Aggregation产生的表。在不久的将来，将支持Window TVF之后的Window Top-N。  
**flink-1.14.x、flink-1.15.x**：目前，flink只支持在滚动窗口、滑动窗口、累加窗口这三个窗口表值函数之后直接使用 window Top-N。
在不久的将来，将支持在会话窗口的窗口表值函数之后直接使用 window Top-N 。

## 去重

在流批模式中均可使用。

去重会删除在一组列上重复的行，只保留第一行或最后一行。在某些情况下，上游ETL作业并不是端到端精确一次的；当发生故障转移时，这可能会导致接收器中出现重复记录。

重复记录会影响下游分析作业(如SUM、COUNT)的正确性，因此需要在进一步分析之前进行重复数据删除。

Flink使用ROW_NUMBER()来删除重复数据，就像Top-N查询一样。理论上，重复数据删除是Top-N的一种特殊情况，其中N为1，按处理时间或事件时间排序。

重复数据删除语句的语法如下：

```sql
SELECT [column_list]
FROM
    (
    SELECT [column_list],
        ROW_NUMBER() OVER (
            [PARTITION BY col1[, col2...]]
            ORDER BY time_attr [asc|desc]
        ) AS rownum
    FROM table_name
    )
WHERE rownum = 1
```

参数说明：

* ROW_NUMBER()：为每一行分配一个唯一的连续编号，从1开始。
* PARTITION BY col1[, col2...]：指定分区列，即重复数据删除键。
* ORDER BY time_attr [asc|desc]：排序列，必须是时间属性。目前Flink支持处理时间属性和事件时间属性。按ASC排序意味着保留第一行，按DESC排序意味着保留最后一行。
* WHERE rownum = 1：Flink需要rownum = 1来识别这个查询是重复数据删除。

注意：必须完全遵循上述模式，否则优化器将无法转换查询。

以下示例展示如何在流表上使用重复数据删除的SQL语句：

```sql
CREATE TABLE Orders (
    order_time STRING,
    user STRING,
    product STRING,
    num BIGINT,
    proctime AS PROCTIME()
) WITH (...);
-- 移除重复的order_id行数据，只保留第一个接收到的行数据，因为同一个order_id不应该出现两个订单
SELECT order_id, user, product, num
FROM
    (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY proctime ASC) AS row_num
    FROM Orders
    )
WHERE row_num = 1;
```

## 窗口去重

flink-1.15.x开始支持。

窗口去重是一种特殊的去重，它会删除数据集中重复的行，保留每个窗口和分区中 key 对应的第一行或者是最后一行。

对于流式查询，和常规的流表去重不同，窗口去重并不会马上发射结果数据，而是在窗口结束时发射最终的结果。另外，窗口去重会在不需要时删除所有的中间状态数据。
因此，如果用户不需要实时使用结果数据更新每一条记录，窗口去重会有更好的性能。
通常，窗口去重会在窗口表值函数上直接使用。因此，窗口去重应该基于窗口表值函数并且和其他函数一起使用，比如：窗口聚合函数、窗口 TopN、窗口 join。

窗口去重定义和常规去重定义语法一样，具体可查看去重文档。除此之外，窗口去重要求 PARTITION BY 语句包含 window_start 和 window_end 字段。否则，优化器无法翻译该查询。

flink 使用 ROW_NUMBER() 来去掉重复数据，和窗口 Top-N 方式一样。从理论上来说，窗口去重是窗口 Top-N 的一种特殊用例，要求 N 为1，并且按照处理时间或者事件时间排序。

下例展示窗口去重语句的语法：

```sql
SELECT [column_list]
FROM
(
SELECT [column_list],
ROW_NUMBER() OVER (
PARTITION BY window_start, window_end [, col_key1...]
ORDER BY time_attr [asc|desc]
) AS rownum
FROM table_name
) -- 该关系接收窗口表值函数
WHERE (rownum = 1 | rownum <=1 | rownum < 2) [AND conditions]
```

参数说明：

* ROW_NUMBER()：给每一行分配一个唯一、特殊的数字，从1开始。
* PARTITION BY window_start, window_end [, col_key1...]：指定分区字段，包含：window_start、window_end 和其他分区 key。
* ORDER BY time_attr [asc|desc]：指定排序字段，该字段必须是时间类型。目前 flink 支持处理时间和事件时间。 Ordering by ASC 表示保留第一行，ordering by DESC
  表示保留最后一行。
* WHERE (rownum = 1 | rownum <=1 | rownum < 2)：必须有 rownum = 1 | rownum <=1 | rownum < 2 ，这是为了让优化器取失败该查询，并且将其翻译为窗口去重。

注意：sql 语句必须完全匹配上述模式，否则优化器无法将查询翻译为窗口去重。

### 案例

下例展示怎么去保留10分钟的滚动窗口的最后一行数据。

```sql
-- 表必须有时间字段，比如该表中的`bidtime`字段。
Flink SQL> DESC Bid;
+-------------+------------------------+------+-----+--------+---------------------------------+
|        name |                   type | null | key | extras |                       watermark |
+-------------+------------------------+------+-----+--------+---------------------------------+
|     bidtime | TIMESTAMP(3) *ROWTIME* | true |     |        | `bidtime` - INTERVAL '1' SECOND |
|       price |         DECIMAL(10, 2) | true |     |        |                                 |
|        item |                 STRING | true |     |        |                                 |
+-------------+------------------------+------+-----+--------+---------------------------------+

Flink SQL> SELECT * FROM Bid;
+------------------+-------+------+
|          bidtime | price | item |
+------------------+-------+------+
| 2020-04-15 08:05 |  4.00 | C    |
| 2020-04-15 08:07 |  2.00 | A    |
| 2020-04-15 08:09 |  5.00 | D    |
| 2020-04-15 08:11 |  3.00 | B    |
| 2020-04-15 08:13 |  1.00 | E    |
| 2020-04-15 08:17 |  6.00 | F    |
+------------------+-------+------+

SELECT *
FROM (
    SELECT bidtime, price, item, supplier_id, window_start, window_end,
        ROW_NUMBER() OVER (
            PARTITION BY window_start, window_end
            ORDER BY bidtime DESC
        ) AS rownum
    FROM TABLE(
        TUMBLE(TABLE Bid, DESCRIPTOR(bidtime), INTERVAL '10' MINUTES))
    )
WHERE rownum <= 1;
+------------------+-------+------+-------------+------------------+------------------+--------+
|          bidtime | price | item | supplier_id |     window_start |       window_end | rownum |
+------------------+-------+------+-------------+------------------+------------------+--------+
| 2020-04-15 08:09 |  5.00 |    D |   supplier4 | 2020-04-15 08:00 | 2020-04-15 08:10 |      1 |
| 2020-04-15 08:17 |  6.00 |    F |   supplier5 | 2020-04-15 08:10 | 2020-04-15 08:20 |      1 |
+------------------+-------+------+-------------+------------------+------------------+--------+
```

注意:为了更好地理解窗口的行为，我们简化了时间戳值的显示，不显示秒小数点后的零，
例如，如果类型是timestamp(3)，在Flink SQL Client中，2020-04-15 08:05应该显示为2020-04-15 08:05:00.000。

### 限制

#### 在窗口表值函数后直接使用窗口去重的限制

目前，如果在窗口表值函数后直接使用窗口去重，窗口表值函数必须是滚动窗口、滑动窗口或者是累计窗口，而不能是会话窗口。会话窗口将在不久的将来支持。

#### 时间字段排序键限制

目前，窗口去重要求排序键必须是事件时间，而不能是处理时间。使用处理时间进行排序，将在不久的将来支持。

## Pattern Recognition（模式识别）

对应于 streaming api 中的CEP，复杂事件处理。

由于使用较少，暂时不做整理。如果有使用的需要，可到社区反应，后续由社区补充。
