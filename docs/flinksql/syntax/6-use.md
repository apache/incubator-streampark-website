---
id: '6-use'
title: 'use'
sidebar_position: 6
---

## 介绍

USE语句用于设置当前数据库或catalog，或更改模块的解析顺序和启用状态。

## USE CATALOG

```sql
USE CATALOG catalog_name
```

设置当前catalog。所有未显式指定catalog的后续命令都将使用此catalog。 如果提供的catalog不存在，则抛出异常。默认当前catalog为`default_catalog`。

在`flink sql`中创建了`hive catalog`，再用`use`语句使用了`hive catalog`之后，flink 就连接上了 hive 的元数据，
之后的`create`创建的非临时表，其元数据就会被保存到 hive 的元数据。

如果不想在每个`flink sql`任务中重复创建连接外部系统的虚拟表，就可以只在第一个`flink sql`任务中创建一次表，之后的`flink sql`任务就不再需要编写建表语句了，
只要有创建`hive catalog`和`use catalog hive`语句即可。

## USE MODULES

```sql
USE MODULES module_name1[, module_name2, ...]
```

按照声明的顺序设置已启用的模块。所有后续命令将解析启用模块中的元数据(函数/用户定义类型/规则等)，并遵循声明顺序。

模块在加载时被默认使用。如果没有使用USE modules语句，加载的模块将被禁用。默认加载和启用的模块是core。如果使用了该语句启动模块，则不在该语句中的模块都将被禁用。

### 案例

```sql
use hive, core;
```

表示后续使用到的函数/用户定义类型/规则等，会先按照 hive 来解析，如果 hive 解析不了的，再用 flink 来解析。

## USE

```sql
USE [catalog_name.]database_name
```

设置当前数据库。所有未显式指定数据库的后续命令都将使用此数据库。如果提供的数据库不存在，则抛出异常。默认的当前数据库是default_database。