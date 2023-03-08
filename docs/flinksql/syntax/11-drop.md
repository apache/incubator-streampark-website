---
id: '11-drop'
title: 'drop'
sidebar_position: 11
---

## 介绍

DROP语句用于从当前或指定的Catalog中删除已注册的表/视图/函数。 Flink SQL目前支持以下DROP语句：

* DROP CATALOG（从1.14.x开始支持）
* DROP TABLE
* DROP DATABASE
* DROP VIEW
* DROP FUNCTION

### DROP CATALOG

**从1.14.x开始支持**。

```sql
DROP CATALOG [IF EXISTS] catalog_name
```

删除指定的 catalog。

**IF EXISTS**

如果该 catalog 不存在，则什么也不会发生。

### DROP TABLE

```sql
DROP [TEMPORARY] TABLE [IF EXISTS] [catalog_name.][db_name.]table_name
```

删除指定表名的表。如果要删除的表不存在，则抛出异常。

**TEMPORARY**

删除具有目录和数据库名称空间的临时表。

**IF EXISTS**

如果该表不存在，则什么也不会发生。

### DROP DATABASE

```sql
DROP DATABASE [IF EXISTS] [catalog_name.]db_name [ (RESTRICT | CASCADE) ]
```

删除给定数据库名称的数据库。如果要删除的数据库不存在，则抛出异常。

**IF EXISTS**

如果数据库不存在，则什么也不会发生。

**RESTRICT**

删除非空数据库将触发异常。默认启用。

**CASCADE**

删除非空数据库时也会删除所有相关的表和函数。

### DROP VIEW

```sql
DROP [TEMPORARY] VIEW  [IF EXISTS] [catalog_name.][db_name.]view_name
```

删除具有目录和数据库名称空间的视图。如果要删除的视图不存在，则抛出异常。

**TEMPORARY**

删除具有目录和数据库名称空间的临时视图。

**IF EXISTS**

如果视图不存在，则什么也不会发生。Flink不通过CASCADE/RESTRICT关键字维护视图的依赖关系，当前的方式是当用户试图在视图的底层表被删除的情况下使用视图时抛出延迟错误消息。

### DROP FUNCTION

```sql
DROP [TEMPORARY|TEMPORARY SYSTEM] FUNCTION [IF EXISTS] [catalog_name.][db_name.]function_name
```

删除具有目录和数据库名称空间的目录函数。如果要删除的函数不存在，则抛出异常。

**TEMPORARY**

删除具有目录和数据库名称空间的临时目录函数。

**TEMPORARY SYSTEM**

删除没有命名空间的临时系统函数。

**IF EXISTS**

如果函数不存在，什么也不会发生。