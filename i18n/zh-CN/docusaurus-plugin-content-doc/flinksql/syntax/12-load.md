---
id: '12-load'
title: 'load'
sidebar_position: 12
---

## 介绍

LOAD语句用于加载内置或用户自定义的模块。

## LOAD模块

语法结构：

```sql
LOAD MODULE module_name [WITH ('key1' = 'val1', 'key2' = 'val2', ...)]
```

module_name是一个简单的标识符，区分大小写。它应该与模块工厂中定义的模块类型相同，其用于模块的发现。

properties ('key1' = 'val1'， 'key2' = 'val2'，…)是一个映射，包含一组键值对(除了key 'type')，传递给发现服务相对应的模块。

## 案例代码

```sql
-- 加载 hive 模块
load module hive with ('hive-version' = '2.3.6');
-- 推荐下面这种写法，不指定 hive 的版本，由系统去自动提取。
load module hive;
```

给平台添加了 flink-connector-sql-hive 依赖之后，就相当于已经添加了 hive 模块的实现，因此可以直接去加载 hive 模块。

在 `flink sql` 中加载了`hive`模块，并且`use`了`hive`模块之后，查询语句中就可以直接去使用`hive`中的函数了。