---
id: '10-explain'
title: 'explain'
sidebar_position: 10
---

## 介绍

EXPLAIN语句用于解释SELECT或INSERT语句的逻辑和优化的查询计划。

## 语法

flink-1.13.x：

```sql
EXPLAIN PLAN FOR <query_statement_or_insert_statement>
```

flink-1.14.x：

```sql
EXPLAIN [([ExplainDetail[, ExplainDetail]*]) | PLAN FOR] <query_statement_or_insert_statement>
```

## 案例

```sql
Flink SQL> CREATE TABLE MyTable1 (`count` bigint, word VARCHAR(256)) WITH (''connector'' = ''datagen'');
[INFO] Table has been created.

Flink SQL> CREATE TABLE MyTable2 (`count` bigint, word VARCHAR(256)) WITH (''connector'' = ''datagen'');
[INFO] Table has been created.

Flink SQL> EXPLAIN PLAN FOR SELECT `count`, word FROM MyTable1 WHERE word LIKE ''F%''
> UNION ALL
> SELECT `count`, word FROM MyTable2;
-- 下面的语法从1.14.x开始支持
Flink SQL> EXPLAIN ESTIMATED_COST, CHANGELOG_MODE, JSON_EXECUTION_PLAN SELECT `count`, word FROM MyTable1
> WHERE word LIKE ''F%''
> UNION ALL
> SELECT `count`, word FROM MyTable2;
```

## 结果

### EXPLAIN PLAN

```sql
== Abstract Syntax Tree ==
LogicalUnion(all=[true])
:- LogicalProject(count=[$0], word=[$1])
:  +- LogicalFilter(condition=[LIKE($1, _UTF-16LE'F%')])
:     +- LogicalTableScan(table=[[default_catalog, default_database, MyTable1]])
+- LogicalProject(count=[$0], word=[$1])
   +- LogicalTableScan(table=[[default_catalog, default_database, MyTable2]])

== Optimized Physical Plan ==
Union(all=[true], union=[count, word])
:- Calc(select=[count, word], where=[LIKE(word, _UTF-16LE'F%')])
:  +- TableSourceScan(table=[[default_catalog, default_database, MyTable1]], fields=[count, word])
+- TableSourceScan(table=[[default_catalog, default_database, MyTable2]], fields=[count, word])

== Optimized Execution Plan ==
Union(all=[true], union=[count, word])
:- Calc(select=[count, word], where=[LIKE(word, _UTF-16LE'F%')])
:  +- TableSourceScan(table=[[default_catalog, default_database, MyTable1]], fields=[count, word])
+- TableSourceScan(table=[[default_catalog, default_database, MyTable2]], fields=[count, word])
```

### EXPLAIN PLAN WITH DETAILS

```sql
== Abstract Syntax Tree ==
LogicalUnion(all=[true])
:- LogicalProject(count=[$0], word=[$1])
:  +- LogicalFilter(condition=[LIKE($1, _UTF-16LE'F%')])
:     +- LogicalTableScan(table=[[default_catalog, default_database, MyTable1]])
+- LogicalProject(count=[$0], word=[$1])
   +- LogicalTableScan(table=[[default_catalog, default_database, MyTable2]])

== Optimized Physical Plan ==
Union(all=[true], union=[count, word], changelogMode=[I]): rowcount = 1.05E8, cumulative cost = {3.1E8 rows, 3.05E8 cpu, 4.0E9 io, 0.0 network, 0.0 memory}
:- Calc(select=[count, word], where=[LIKE(word, _UTF-16LE'F%')], changelogMode=[I]): rowcount = 5000000.0, cumulative cost = {1.05E8 rows, 1.0E8 cpu, 2.0E9 io, 0.0 network, 0.0 memory}
:  +- TableSourceScan(table=[[default_catalog, default_database, MyTable1]], fields=[count, word], changelogMode=[I]): rowcount = 1.0E8, cumulative cost = {1.0E8 rows, 1.0E8 cpu, 2.0E9 io, 0.0 network, 0.0 memory}
+- TableSourceScan(table=[[default_catalog, default_database, MyTable2]], fields=[count, word], changelogMode=[I]): rowcount = 1.0E8, cumulative cost = {1.0E8 rows, 1.0E8 cpu, 2.0E9 io, 0.0 network, 0.0 memory}

== Optimized Execution Plan ==
Union(all=[true], union=[count, word])
:- Calc(select=[count, word], where=[LIKE(word, _UTF-16LE'F%')])
:  +- TableSourceScan(table=[[default_catalog, default_database, MyTable1]], fields=[count, word])
+- TableSourceScan(table=[[default_catalog, default_database, MyTable2]], fields=[count, word])

== Physical Execution Plan ==
{
  "nodes" : [ {
    "id" : 37,
    "type" : "Source: TableSourceScan(table=[[default_catalog, default_database, MyTable1]], fields=[count, word])",
    "pact" : "Data Source",
    "contents" : "Source: TableSourceScan(table=[[default_catalog, default_database, MyTable1]], fields=[count, word])",
    "parallelism" : 1
  }, {
    "id" : 38,
    "type" : "Calc(select=[count, word], where=[LIKE(word, _UTF-16LE'F%')])",
    "pact" : "Operator",
    "contents" : "Calc(select=[count, word], where=[LIKE(word, _UTF-16LE'F%')])",
    "parallelism" : 1,
    "predecessors" : [ {
      "id" : 37,
      "ship_strategy" : "FORWARD",
      "side" : "second"
    } ]
  }, {
    "id" : 39,
    "type" : "Source: TableSourceScan(table=[[default_catalog, default_database, MyTable2]], fields=[count, word])",
    "pact" : "Data Source",
    "contents" : "Source: TableSourceScan(table=[[default_catalog, default_database, MyTable2]], fields=[count, word])",
    "parallelism" : 1
  } ]
```

## Explain细节

从flink-1.14.x开始支持。

打印语句包含指定explain细节的 plan 信息。

* **ESTIMATED_COST**：估计成本，生成优化器估计的物理节点的成本信息，
  比如：TableSourceScan(..., cumulative cost ={1.0E8 rows, 1.0E8 cpu, 2.4E9 io, 0.0 network, 0.0 memory})。
* **CHANGELOG_MODE**：为每个物理节点生成变更日志模式，比如：GroupAggregate(..., changelogMode=[I,UA,D])。
* **JSON_EXECUTION_PLAN**：生成json格式的程序执行计划。

