---
id: '2-set'
title: 'set'
sidebar_position: 2
---

## 介绍

SET语句用于修改配置或列出配置。

## 语法

```sql
SET ('key' = 'value')
```

如果没有指定键和值，则只打印所有属性。否则，使用指定的键值对设置属性值。

## 案例

```sql
Flink SQL> SET 'table.local-time-zone' = 'Europe/Berlin';
[INFO] Session property has been set.

Flink SQL> SET;
'table.local-time-zone' = 'Europe/Berlin'
```