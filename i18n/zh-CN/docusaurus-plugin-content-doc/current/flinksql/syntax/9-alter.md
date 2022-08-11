---
id: '9-alter'
title: 'alter'
sidebar_position: 9
---

## 介绍

ALTER语句用于修改Catalog中已注册的表/视图/函数定义。

Flink SQL目前支持以下ALTER语句：

* ALTER TABLE
* ALTER VIEW（从1.14.x开始支持）
* ALTER DATABASE
* ALTER FUNCTION

### ALTER TABLE

重命名表

```sql
ALTER TABLE [catalog_name.][db_name.]table_name RENAME TO new_table_name
```

将给定的表名重命名为另一个新表名。 设置或更改表属性:

```sql
ALTER TABLE [catalog_name.][db_name.]table_name SET (key1=val1, key2=val2, ...)
```

给指定的表设置一个或多个属性。如果表中已经设置了特定的属性，则用新值覆盖旧值。

### ALTER VIEW

从1.14.x开始支持。

```sql
ALTER VIEW [catalog_name.][db_name.]view_name RENAME TO new_view_name
```

将之前 catalog 和 database 下的视图重名为新的名称。

```sql
ALTER VIEW [catalog_name.][db_name.]view_name AS new_query_expression
```

改变视图之前的查询定义为新的查询。

### ALTER DATABASE

```sql
ALTER DATABASE [catalog_name.]db_name SET (key1=val1, key2=val2, ...)
```

给指定的数据库设置一个或多个属性。如果数据库中已经设置了特定的属性，则使用新值覆盖旧值。

### ALTER FUNCTION

```sql
ALTER [TEMPORARY|TEMPORARY SYSTEM] FUNCTION [IF EXISTS] [catalog_name.][db_name.]function_name AS identifier [LANGUAGE JAVA|SCALA|PYTHON]
```

使用新的标识符和可选的语言标记更改catalog函数。如果函数在catalog中不存在，则抛出异常。如果语言标记是JAVA/SCALA，则标识符是UDF的完整类路径。关于Java/Scala UDF的实现，请参考用户[自定义函数](../../../../../../docs/flinksql/udf)。  

**TEMPORARY** 

更改具有catalog和数据库名称空间的临时catalog函数，并重写catalog函数。  

**TEMPORARY SYSTEM**  

更改没有名称空间的临时系统函数并覆盖内置函数。 

**IF EXISTS** 

如果函数不存在，什么也不会发生。  

**LANGUAGE JAVA|SCALA|PYTHON**  

用于指示flink运行时如何执行该函数的语言标记。目前只支持JAVA、SCALA和PYTHON，函数默认语言为JAVA。