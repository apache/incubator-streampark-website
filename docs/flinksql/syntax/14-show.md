---
id: '14-show'
title: 'show'
sidebar_position: 14
---

## 介绍

`SHOW`语句用于列出所有`catalog`，或在当前`catalog`，列出所有数据库中所有`表`/`视图`/`字段`，或列出当前`catalog`和当前数据库，或显示当前`catalog`和数据库，
或列出当前catalog和当前的数据库的所有函数包括系统函数和用户自定义的函数。或只列出当前catalog和当前数据库中用户自定义的函数，或列出启用的模块名，或列出当前会话中为启用状态的所有已加载模块。

SHOW CREATE 语句被用于打印 DDL 语句，目前， SHOW CREATE 语句值能用于打印给定表或试图的 DDL 语句。 Flink SQL目前支持以下SHOW语句：

* SHOW CATALOGS
* SHOW CURRENT CATALOG
* SHOW DATABASES
* SHOW CURRENT DATABASE
* SHOW TABLES
* SHOW CREATE TABLE（从1.14.x开始支持）
* SHOW COLUMNS（从1.15.x开始支持）
* SHOW VIEWS
* SHOW CREATE VIEW（从1.15.x开始支持）
* SHOW FUNCTIONS
* SHOW MODULES

## SHOW CATALOGS

```sql
SHOW CATALOGS
```

显示所有catalog。

## SHOW CURRENT CATALOG

```sql
SHOW CURRENT CATALOG
```

展示当前catalog。

## SHOW DATABASES

```sql
SHOW DATABASES
```

展示当前catalog里的所有数据库。

## SHOW CURRENT DATABASE

```sql
SHOW CURRENT DATABASE
```

展示当前数据库。

## SHOW TABLES

### flink-1.13.x

```sql
SHOW TABLES
```

展示当前catalog和当前数据库中的所有表。

### flink-1.15.x

```sql
SHOW TABLES [ ( FROM | IN ) [catalog_name.]database_name ] [ [NOT] LIKE <sql_like_pattern> ]
```

展示可选的指定数据库中的所有表。如果没有指定数据库，则返回当前数据库的表。另外，该语句可以通过一个可选的匹配表达式对表进行过滤。

LIKE：展示通过 like 关键字指定名称的表，like 语法和 <sql_like_pahhern> 类似。LIKE 关键字的语法和 MySQL 方言一样：

* `%` 匹配任意个数的字符，包括零个字符， `\%` 匹配一个 `%` 符号。
* `_` 只匹配一个字符， `\_` 匹配一个 _ 符号。

#### SHOW TABLES案例

从1.15.x开始支持。

假设名为 catalog1 的 catalog 下的 db1 数据库并且包含以下表：

* person
* dim

当前会话中的数据库包含以下表：

* fights
* orders

展示给定数据库下的所有表：

```sql
show tables from db1;
-- show tables from catalog1.db1;
-- show tables in db1;
-- show tables in catalog1.db1;
+------------+
| table name |
+------------+
|        dim |
|     person |
+------------+
2 rows in set
```

通过给定的 sql 匹配，展示给定数据库下的表：

```sql
show tables from db1 like '%n';
-- show tables from catalog1.db1 like '%n';
-- show tables in db1 like '%n';
-- show tables in catalog1.db1 like '%n';
+------------+
| table name |
+------------+
| person |
+------------+
1 row in set
```

通过给定的 sql 匹配，展示给定数据库下不符合 sql 匹配的表：

```sql
show tables from db1 not like '%n';
-- show tables from catalog1.db1 not like '%n';
-- show tables in db1 not like '%n';
-- show tables in catalog1.db1 not like '%n';
+------------+
| table name |
+------------+
| dim |
+------------+
1 row in set
```

展示当前数据库下的所有表：

```sql
show tables;
+------------+
| table name |
+------------+
| items |
| orders |
+------------+
2 rows in set
```

## SHOW CREATE TABLE

从1.14.x开始支持。

```sql
SHOW CREATE TABLE
```

展示指定表的建表语句。

另外：当前的 SHOW CREATE TABLE 语句只支持展示通过 flink SQL DDL 创建的表。

## SHOW COLUMNS

从1.15.x开始支持。

```sql
SHOW COLUMNS ( FROM | IN ) [[catalog_name.]database.]<table_name> [ [NOT] LIKE <sql_like_pattern>]
```

通过给定的表情和可选的 like 语句展示表的字段信息。

LIKE：展示通过 like 关键字指定名称的表的字段信息，like 语法和 <sql_like_pahhern> 类似。

LIKE 关键字的语法和 MySQL 方言一样：

* `%` 匹配任意个数的字符，包括零个字符， `\%` 匹配一个 `%` 符号。
* `_` 只匹配一个字符， `\_` 匹配一个 _ 符号。

### SHOW COLUMNS案例

**从1.15.x开始支持。**

假设名为 catalog1 的 catalog 下的 database1 数据库下的 orders 表有如下结构：

```sql
+---------+-----------------------------+-------+-----------+---------------+----------------------------+
|    name |                        type |  null |       key |        extras |                  watermark |
+---------+-----------------------------+-------+-----------+---------------+----------------------------+
|    user |                      BIGINT | false | PRI(user) |               |                            |
| product |                 VARCHAR(32) |  true |           |               |                            |
|  amount |                         INT |  true |           |               |                            |
|      ts |      TIMESTAMP(3) *ROWTIME* |  true |           |               | `ts` - INTERVAL '1' SECOND |
|   ptime | TIMESTAMP_LTZ(3) *PROCTIME* | false |           | AS PROCTIME() |                            |
+---------+-----------------------------+-------+-----------+---------------+----------------------------+
```

展示给定表的所有字段：

```sql
show columns from orders;
-- show columns from database1.orders;
-- show columns from catalog1.database1.orders;
-- show columns in orders;
-- show columns in database1.orders;
-- show columns in catalog1.database1.orders;
+---------+-----------------------------+-------+-----------+---------------+----------------------------+
|    name |                        type |  null |       key |        extras |                  watermark |
+---------+-----------------------------+-------+-----------+---------------+----------------------------+
|    user |                      BIGINT | false | PRI(user) |               |                            |
| product |                 VARCHAR(32) |  true |           |               |                            |
|  amount |                         INT |  true |           |               |                            |
|      ts |      TIMESTAMP(3) *ROWTIME* |  true |           |               | `ts` - INTERVAL '1' SECOND |
|   ptime | TIMESTAMP_LTZ(3) *PROCTIME* | false |           | AS PROCTIME() |                            |
+---------+-----------------------------+-------+-----------+---------------+----------------------------+
5 rows in set
```

展示表中符合给定 sql 匹配的字段信息：

```sql
show columns from orders like '%r';
-- show columns from database1.orders like '%r';
-- show columns from catalog1.database1.orders like '%r';
-- show columns in orders like '%r';
-- show columns in database1.orders like '%r';
-- show columns in catalog1.database1.orders like '%r';
+------+--------+-------+-----------+--------+-----------+
| name |   type |  null |       key | extras | watermark |
+------+--------+-------+-----------+--------+-----------+
| user | BIGINT | false | PRI(user) |        |           |
+------+--------+-------+-----------+--------+-----------+
1 row in set
```

展示表中不符合给定 sql 匹配的字段信息：

```sql
show columns from orders not like '%_r';
-- show columns from database1.orders not like '%_r';
-- show columns from catalog1.database1.orders not like '%_r';
-- show columns in orders not like '%_r';
-- show columns in database1.orders not like '%_r';
-- show columns in catalog1.database1.orders not like '%_r';
+---------+-----------------------------+-------+-----+---------------+----------------------------+
|    name |                        type |  null | key |        extras |                  watermark |
+---------+-----------------------------+-------+-----+---------------+----------------------------+
| product |                 VARCHAR(32) |  true |     |               |                            |
|  amount |                         INT |  true |     |               |                            |
|      ts |      TIMESTAMP(3) *ROWTIME* |  true |     |               | `ts` - INTERVAL '1' SECOND |
|   ptime | TIMESTAMP_LTZ(3) *PROCTIME* | false |     | AS PROCTIME() |                            |
+---------+-----------------------------+-------+-----+---------------+----------------------------+
4 rows in set
```

## SHOW VIEWS

```sql
SHOW VIEWS
```

展示当前catalog和当前数据库中的所有视图。

## SHOW CREATE VIEW

从1.15.x开始支持。

```sql
SHOW CREATE VIEW [catalog_name.][db_name.]view_name
```

展示给定视图的创建语句。

## SHOW FUNCTIONS

```sql
SHOW [USER] FUNCTIONS
```

展示当前catalog和当前数据库中的所有系统和自定义函数。

**USER**

值展示当前catalog和当前数据库中的所有自定义函数。

## SHOW MODULES

```sql
SHOW [FULL] MODULES
```

按解析顺序显示所有启用的模块名称。

**FULL**

按照顺序显示所有启用状态的已加载模块。