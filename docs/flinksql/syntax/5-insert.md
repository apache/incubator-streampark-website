---
id: '5-insert'
title: 'insert'
sidebar_position: 5
---

## 介绍

NSERT语句用于向表中添加行数据。

## 通过select查询Insert数据

select查询结果可以通过使用insert子句插入到表中。

### 语法

```sql
INSERT { INTO | OVERWRITE } [catalog_name.][db_name.]table_name [PARTITION part_spec] [column_list] select_statement
part_spec:
    (part_col_name1=val1 [, part_col_name2=val2, ...])
column_list:
    (col_name1 [, column_name2, ...])
```

**OVERWRITE**  
INSERT OVERWRITE将覆盖表或分区中的任何现有数据。否则（INTO），将追加新的数据。  

**PARTITION**  
PARTITION子句指定插入语句的静态分区列。

**COLUMN LIST**  
现在有表T(a INT, b INT, c INT)， flink支持

```sql
INSERT INTO T(c, b) SELECT x, y FROM S
```

查询的数据列‘x’将被写入列‘c’，查询的数据列‘y’将被写入列‘b’，并且列‘a’被设置为NULL（需保证列‘z’是可以为空的）。

overwrite 和 partition 关键字经常用于写入 hive 。

### 案例

```sql
-- 创建一个分区表
CREATE TABLE country_page_view (user STRING, cnt INT, date STRING, country STRING)
PARTITIONED BY (date, country)
WITH (...)

-- 向静态分区(date='2019-8-30', country='China')追加数据行
INSERT INTO country_page_view PARTITION (date='2019-8-30', country='China')
SELECT user, cnt FROM page_view_source;

-- 向分区(date, country)追加数据行，静态data分区值为“2019-8-30”，country为动态分区，该分区值通过每行对应字段值动态获取
INSERT INTO country_page_view PARTITION (date='2019-8-30')
SELECT user, cnt, country FROM page_view_source;

-- 向静态分区(date='2019-8-30', country='China')覆盖数据
INSERT OVERWRITE country_page_view PARTITION (date='2019-8-30', country='China')
SELECT user, cnt FROM page_view_source;

-- 向分区(date, country)覆盖数据行，静态data分区值为“2019-8-30”，country为动态分区，该分区值通过每行对应字段值动态获取
INSERT OVERWRITE country_page_view PARTITION (date='2019-8-30')
SELECT user, cnt, country FROM page_view_source;

-- 向静态分区(date='2019-8-30', country='China')追加数据行，cnt字段值被设置为NULL
INSERT INTO country_page_view PARTITION (date='2019-8-30', country='China') (user)
SELECT user FROM page_view_source;
```

## Insert values into tables

可以使用INSERT…VALUES语句将数据直接从SQL插入到表中。

### 语法

```sql
INSERT { INTO | OVERWRITE } [catalog_name.][db_name.]table_name VALUES values_row [, values_row ...]
values_row:
    : (val1 [, val2, ...])
```

**OVERWRITE**  
INSERT OVERWRITE将覆盖表中任何现有数据。否则，将追加新的数据。

### 案例

```sql
CREATE TABLE students (name STRING, age INT, gpa DECIMAL(3, 2)) WITH (...);
INSERT INTO students
VALUES ('fred flintstone', 35, 1.28), ('barney rubble', 32, 2.32);
```

## 运行多个insert

基于平台内部的开发方式，目前支持一个 flink 任务中同时运行多个 insert 语句，即在页面的 sql 输入框中输入多个 insert 语句，只会启动一个 flink 任务。

运行的多个 insert 任务，在 flink UI 界面中，会体现出多个运行图。当然，如果你的多个 insert 语句读取了同一张表，或者是写入了同一张表，flink 则会对其优化，最后生成一张运行图。