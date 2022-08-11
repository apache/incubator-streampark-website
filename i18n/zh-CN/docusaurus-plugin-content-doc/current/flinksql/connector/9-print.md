---
id: '9-print'
title: 'Print'
sidebar_position: 9
---

## 介绍

支持：

* Sink

Print 连接器允许将每一行写入标准输出流或者标准错误流。

设计目的：

* 简单的流作业测试。
* 对生产调试带来极大便利。

四种 format 选项：

| 打印内容	      | 条件 1	        | 条件 2              |
|:-----------|:-------------|:------------------|
| 标识符:任务 ID> | 输出数据         | 	需要提供前缀打印标识符      |	parallelism > 1|
| 标识符>       | 输出数据	        | 需要提供前缀打印标识符       |	parallelism == 1|
| 任务 ID>     | 输出数据	        | 不需要提供前缀打印标识符	     |parallelism > 1|
| 输出数据	      | 不需要提供前缀打印标识符 | 	parallelism == 1 |

输出字符串格式为 **$row_kind(f0,f1,f2…)**，row_kind是一个 `RowKind` 类型的短字符串，例如：**+I(1,1)** 。

Print 连接器是内置的。

注意：在任务运行时使用 Print Sinks 打印记录，需要注意观察任务日志。

## 创建Print表

```sql
CREATE TABLE print_table (
    f0 INT,
    f1 INT,
    f2 STRING,
    f3 DOUBLE
) WITH (
    'connector' = 'print'
)
```

也可以通过 `LIKE` 子句 基于已有表的结构去创建新表。

```sql
CREATE TABLE print_table WITH ('connector' = 'print')
LIKE source_table (EXCLUDING ALL)
```

## 连接器参数 

| 参数	               | 是否必选 | 	默认值	    | 数据类型     | 	描述                                                |
|:------------------|:-----|:---------|:---------|:---------------------------------------------------|
| connector         | 	必选  | 	(none)	 | String   | 	指定要使用的连接器，此处应为 **print** 。                        |
| print-identifier	 | 可选	  | (none)	  | String	  | 配置一个标识符作为输出数据的前缀。                                  |
| standard-error	   | 可选	  | false	   | Boolean	 | 如果 format 需要打印为标准错误而不是标准输出，则为 **True** 。           |
| sink.parallelism	 | 可选   | 	(none)	 | Integer  | 	为 Print sink 算子定义并行度。默认情况下，并行度由框架决定，和链在一起的上游算子一致。 |
