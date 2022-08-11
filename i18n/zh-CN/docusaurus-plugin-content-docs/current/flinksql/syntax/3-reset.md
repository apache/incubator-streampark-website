---
id: '3-reset'
title: 'reset'
sidebar_position: 3
---

## 介绍

RESET语句用于将配置重置为默认值。

## 语法

```sql
RESET ('key')
```

如果没有指定键，则将所有属性重置为默认值。否则，将指定的键重置为默认值。

## 案例

```sql
Flink SQL> RESET 'table.planner';
[INFO] Session property has been reset.

Flink SQL> RESET;
[INFO] All session properties have been set to their default values.
```
