---
id: 'use'
title: 'use'
sidebar_position: 6
---

## 介绍

USE语句用于设置当前数据库或catalog，或更改模块的解析顺序和启用状态。

## USE CATALOG

```sql
USE CATALOG catalog_name
```

设置当前catalog。所有未显式指定catalog的后续命令都将使用此catalog。 \
如果提供的catalog不存在，则抛出异常。默认当前catalog为default_catalog。

## USE MODULES

```sql
USE MODULES module_name1[, module_name2, ...]
```

按照声明的顺序设置已启用的模块。所有后续命令将解析启用模块中的元数据(函数/用户定义类型/规则等)，并遵循声明顺序。 \
模块在加载时被默认使用。如果没有使用USE modules语句，加载的模块将被禁用。默认加载和启用的模块是core。如果使用了该语句启动模块，则不在该语句中的模块都将被禁用。

## USE

```sql
USE [catalog_name.]database_name
```

设置当前数据库。所有未显式指定数据库的后续命令都将使用此数据库。如果提供的数据库不存在，则抛出异常。默认的当前数据库是default_database。