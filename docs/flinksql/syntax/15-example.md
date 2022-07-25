---
id: 'example'
title: '使用案例'
sidebar_position: 15
---

## 介绍

本章节主要说明各类型`flink sql`的先后编写执行顺序，另外简单写一些实际可用的案例。

## 编写顺序

1. **set**，非必须
    1. 该语句主要是设置本次提交任务环境的一些参数，因此必须写到所有语句的开头，在其他语句执行之前必须先设置参数，之后的语句执行才能使用到设置好的参数。
    2. **特殊设置**：`sql 方言`，默认情况下，flink 使用的是自己的方言，但如果想要迁移之前一些`hive sql`语句，可能想直接使用`flink sql`引擎直接执行语句，以减少迁移的成本。
       此时就可以将设置`sql方言`的`set`语句放到`insert`语句之前，而不是放到最开头。 倘若是直接将设置`sql方言`的`set`语句放到最开头，则下面的建表、创建函数之类的语句可能会出错。
2. **crate**，非必须
    1. 如果需要用到 hive ，比如读写 hive 表，或者是将创建的虚拟表的信息放到 hive 元数据，就需要有创建 hive catalog 的语句。
    2. 创建虚拟表来连接外部系统。
    3. 其他，这些是非必须的
        1. 创建自定义函数。
        2. 创建数据库。
        3. 创建视图
3. **load**，非必须
    1. 如果想要用到 hive 模块，比如使用 hive 的一些函数，则需要加载 hive 模块，加载完 hive 模块之后，平台就自动拥有了 hive 和 core(flink) 这两个模块，默认解析顺序为`core->hive`。
4. **use**
    1. 创建了 hive 的 catalog 之后，必须写 `use catalog` 语句来使用创建的 hive catalog，否则无法连接 hive 元数据。
    2. 加载了 hive 模块之后，可以通过 `use modules hive, core` 语句来调整模块解析顺序。
5. **insert**，必须
    1. 必须有`insert`语句来触发整个`flink sql`任务的提交运行。

## 实际案例

### kafka -> kafka

```sql
-- 设置一些参数
set 'table.local-time-zone' = 'GMT+08:00';


-- 创建连接 kafka 的虚拟表作为 source
CREATE TABLE source_kafka1(
    `id` int COMMENT '',
    `name` string COMMENT '',
    `age` int COMMENT ''
) WITH (
    'connector' = 'kafka',
    'topic' = 'source1',
    'properties.bootstrap.servers' = 'node01:9092,node02:9092,node03:9092',
    'properties.group.id' = 'test',
    'scan.startup.mode' = 'latest-offset',
    'format' = 'csv',
    'csv.field-delimiter' = ' ',
    'csv.ignore-parse-errors' = 'true',
    'csv.allow-comments' = 'true'
)
;


-- 创建连接 kafka 的虚拟表作为 sink
create table sink_kafka1(
    `id` int COMMENT '',
    `name` string COMMENT '',
    `age` int COMMENT ''
) with (
    'connector' = 'kafka',
    'topic' = 'sink1',
    'properties.bootstrap.servers' = 'node01:9092,node02:9092,node03:9092',
    'format' = 'csv'
)
;


-- 真正要执行的任务
insert into sink_kafka1
select id, concat(name, '_sink') as name, age * 10 as age
from source_kafka1
;
```

运行之后，flink UI 界面如下

![img.png](/doc/image/flinksql/example_kafka_to_kafka.png)

在 soruce 端的 kafka 输入以下数据

![img.png](/doc/image/flinksql/example_kafka_to_kafka_source_data.png)

则可以看到 sink 端的 kafka 接收到以下数据

![img.png](/doc/image/flinksql/example_kafka_to_kafka_sink_data.png)

### kafka -> hive

hive 表信息

```sql
CREATE TABLE `test.test`(
    `id` int, 
    `name` string, 
    `age` int
)
PARTITIONED BY (`dt` string)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 'hdfs://hadoopCluster/user/hive/warehouse/test.db/test'
TBLPROPERTIES (
    'transient_lastDdlTime'='1657268267'
)
```

flink sql 语句

```sql
-- 如果是 flink-1.13.x ，则需要手动设置该参数
set 'table.dynamic-table-options.enabled' = 'true';

-- 在需要读取hive或者是写入hive表时，必须创建hive catalog。
-- 创建catalog
create catalog hive with (
    'type' = 'hive',
    'hadoop-conf-dir' = 'path/to/conf',
    'hive-conf-dir' = 'path/to/conf'
)
;

use catalog hive;

CREATE temporary TABLE source_kafka1(
    `id` int COMMENT '',
    `name` string COMMENT '',
    `age` int COMMENT '',
    proc_time as PROCTIME()
) WITH (
    'connector' = 'kafka',
    'topic' = 'source1',
    'properties.bootstrap.servers' = 'node01:9092,node02:9092,node03:9092',
    'properties.group.id' = 'test',
    'scan.startup.mode' = 'earliest-offset',
    'format' = 'csv',
    'csv.field-delimiter' = ' ',
    'csv.ignore-parse-errors' = 'true',
    'csv.allow-comments' = 'true'
)
;

insert into test.test
-- 下面的语法是 flink sql 提示，用于在语句中使用到表时手动设置一些临时的参数
/*+
OPTIONS(
    'streaming-source.enable' = 'true',
    'streaming-source.monitor-interval' = '1 s',
    'sink.partition-commit.delay'='1 s',
    'sink.partition-commit.policy.kind'='metastore,success-file'
)
 */
select id, name, age, DATE_FORMAT(proc_time, 'yyyy-MM-dd HH:mm:ss')
from source_kafka1
;
```

之后在 source 端的 kafka 输入以下数据

![img.png](/doc/image/flinksql/example_kafka_to_hive_source_data.png)

在配置的时间过后，就可以看到 hive 中的数据了

![img.png](/doc/image/flinksql/example_kafka_to_hive_sink_data.png)

有关读写 hive 的一些配置和读写 hive 表时其数据的可见性，可以看考[读写hive](../3-read-write-hive)页面。

### hive -> hive

source，test3表信息和数据

```sql
CREATE TABLE `test.test3`(
    `col1` string, 
    `col2` string, 
    `col3` string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 'hdfs://hadoopCluster/user/hive/warehouse/test.db/test3'
TBLPROPERTIES (
    'transient_lastDdlTime'='1657266007'
)
```

![img.png](/doc/image/flinksql/example_hive_to_hive_source_data.png)

sink，test1表信息和数据

```sql
CREATE TABLE `test.test1`(
    `col1` string, 
    `col2` array<string>, 
    `col3` array<string>, 
    `col4` string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
STORED AS INPUTFORMAT 'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 'hdfs://hadoopCluster/user/hive/warehouse/test.db/test1'
TBLPROPERTIES (
    'transient_lastDdlTime'='1658289618'
)
```

![img.png](/doc/image/flinksql/example_hive_to_hive_sink_data.png)

#### 使用flink方言

```sql
set 'table.local-time-zone' = 'GMT+08:00';

-- 在需要读取hive或者是写入hive表时，必须创建hive catalog。
-- 创建catalog
create catalog hive with (
    'type' = 'hive',
    'hadoop-conf-dir' = '/path/to/conf',
    'hive-conf-dir' = '/path/to/conf'
)
;

use catalog hive;

create temporary function fetch_millisecond as 'com.baishancloud.log.function.udf.time.FetchMillisecond' language java;

-- 要使用到 hive 中的函数，需要提前加载 hive 模块
load module hive;

-- use modules 语句是非必须的，如果想要手动指定函数解析的顺序，可以写上下面的语句。
-- use modules hive, core;

insert overwrite test.test1
select col1, collect_list(col2) as col2, collect_set(col2) as col3, cast(fetch_millisecond() as string) as col4
from test.test3
group by col1
;
```

#### 使用hive方言

```sql
set 'table.local-time-zone' = 'GMT+08:00';

-- 在需要读取hive或者是写入hive表时，必须创建hive catalog。
-- 创建catalog
create catalog hive with (
    'type' = 'hive',
    'hadoop-conf-dir' = '/path/to/conf',
    'hive-conf-dir' = '/path/to/conf'
)
;

use catalog hive;

create temporary function fetch_millisecond as 'com.baishancloud.log.function.udf.time.FetchMillisecond' language java;

load module hive;

-- 由于 insert 语句是 hive 类型的 sql ，因此在执行 insert 语句之前，需要设置方言为 hive
set 'table.sql-dialect' = 'hive';

insert overwrite table test.test1
select col1, collect_list(col2) as col2, collect_set(col2) as col3, cast(fetch_millisecond() as string) as col4
from test.test3
group by col1
;

```
