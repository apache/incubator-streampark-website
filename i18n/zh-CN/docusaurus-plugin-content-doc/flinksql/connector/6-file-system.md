---
id: '6-file-system'
title: 'FileSystem'
sidebar_position: 6
---

## 介绍


该连接器通过[Flink FileSystem abstraction](https://ci.apache.org/projects/flink/flink-docs-release-1.13/zh/docs/deployment/filesystems/overview/)提供对文件系统中分区文件的访问。

文件系统连接器被包含在flink中，不需要添加额外的依赖即可使用。从文件系统中读写行数据，需要相对应的定义格式。

文件系统连接器允许从本地或分布式文件系统读取或写入数据，下面是一个文件系统表的定义：

```sql
CREATE TABLE MyUserTable (
  column_name1 INT,
  column_name2 STRING,
  ...
  part_name1 INT,
  part_name2 STRING
)
PARTITIONED BY (part_name1, part_name2)
WITH (
  'connector' = 'filesystem',                   -- 必填: 指定连接器名称
  'path' = 'file:///path/to/whatever',          -- 必填: 目录路径
  'format' = '...',                             -- 必填: 文件系统连接器要求指定一个format格式化
  'partition.default-name' = '...',             -- 可选: 如果动态分区字段值为null/空字符串，则使用指定的默认分区名称
  'sink.shuffle-by-partition.enable' = '...',   --可选：在sink阶段开启对动态分区文件数据的shuffle，开启之后可以减少写出文件的数量，但是有可能造成数据倾斜。默认为false。
  ...
);
```

请确保包含了flink文件系统需要的依赖。

文件系统的流处理source：

**flink-1.13.x**：文件系统的流处理source还在开发中。未来，社区将会增加对流处理的支持，比如分区和目录监控。  
**flink-1.15.x**：文件系统的流处理source已经实现。

该文件系统连接器和以前传统的文件系统连接器有很多不同：path参数指定的是目录而不是一个文件，而且你无法获取指定路径中你声明的一个可读文件。

## 分区文件

文件系统分区支持使用标准的hive format格式，而且，它不要求分区被预注册在表的catalog中。分区通过目录结构来进行发现和推断。比如，下面基于目录的表分区将会被推断为包含日期和小时分区。

```sql
path
└── datetime=2019-08-25
    └── hour=11
        ├── part-0.parquet
        ├── part-1.parquet
    └── hour=12
        ├── part-0.parquet
└── datetime=2019-08-26
    └── hour=6
        ├── part-0.parquet
```

文件系统表同时支持插入和覆盖。查看[INSERT Statement](../syntax/5-insert)章节。当使用`insert overwrite`覆盖一个分区表时，只有相关联的分区被覆盖，而不是整张表。

## 文件format

文件系统连接器支持多种format格式：

* CSV: RFC-4180. 未压缩
* JSON: 注意，文件系统的JSON格式并不是标准的JSON文件，而是未压缩的newline delimited JSON。
* Avro: Apache Avro. 支持通过配置avro.codec来支持压缩。
* Parquet: Apache Parquet. 兼容Hive.
* Orc: Apache Orc. 兼容Hive.
* Debezium-JSON: debezium-json.
* Canal-JSON: canal-json.
* Raw: raw.

## Source 

**从 flink-1.14.x 开始支持。**

file system 连接器在单个表中可以被用于读取单个文件，或者是整个目录。

当使用目录作为 source 路径时，目录中的文件并没有定义好的读取顺序。

### 目录监控

**从 flink-1.15.x 开始支持。**

默认情况下，file system 连接器是有界的，该连接器只会读取一次配置的目录，然后关闭它。

你可以通过配置 **option source.monitor-interval** 选项配置持续的目录监控：

| Key	                    | 默认值	   | 类型        | 	描述                                                                                                                                                                                                                                                           |
|:------------------------|:-------|:----------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| source.monitor-interval | (none) | 	Duration | 	source 检查新文件的时间间隔，该数值必须大于0。每个文件都会使用他们自己的路径作为唯一标识符，并且在被发现后处理一次。已经被处理过的文件集合会在整个 source 的生命周期内被保存到 state 中，因此他们和 source state 一起被持久化到 checkpoint 和 savepoint 中。<br/>更小的时间间隔意味着文件会更快被发现，但是会对文件系统或对象存储进行更频繁的文件列出或目录遍历。如果没有配置该选项，则提供的路径将只会被扫描一次，此时该 source 将会是有界的。 |

### 可用元数据

**从 flink-1.15.x 开始支持。**

下面的连接器元数据可以通过被定义为表的元数据字段来访问，所有的元数据都是只读的。

| Key                     | 	数据类型                      | 	描述                    |
|:------------------------|:---------------------------|:-----------------------|
| file.path	              | STRING NOT NULL	           | 输入文件的路径                |
| file.name	              | STRING NOT NULL	           | 文件名称，他是距离文件路径根目录最远的元素。 |
| file.size	              | BIGINT NOT NULL	           | 文件的字节数。                |
| file.modification-time	 | TIMESTAMP_LTZ(3) NOT NULL	 | 文件的修改时间。               |

下面的代码片段展示了 `CREATE TABLE` 案例如何访问元数据属性：

```sql
CREATE TABLE MyUserTableWithFilepath (
    column_name1 INT,
    column_name2 STRING,
    `file.path` STRING NOT NULL METADATA
) WITH (
    'connector' = 'filesystem',
    'path' = 'file:///path/to/whatever',
    'format' = 'json'
)
```

## Streaming Sink

文件系统连接器基于Streaming File Sink 写入记录到文件以支持文件系统连接器流式写入。行编码格式支持**csv**和**json**。块编码格式支持**parquet**、**orc**和**avro**。

可以通过sql直接写入，插入流数据到不分区的表中。如果是分区表，可以配置分区关联操作。具体查看下面的分区提交章节。

### 滚动策略

数据通过分区目录会被切分为多个文件。每个分区将包含其对应sink子任务接收到数据之后写入的至少一个文件，正在处理的文件将会根据配置的滚动策略来关闭并成为分区中的一个文件。
文件的滚动策略基于大小、文件可以被打开的最大超时时间间隔来配置。

| Key	                                   | 默认值	   | 从 flink-1.15.x 开始支持<br/>是否可被传递 | 	类型	        | 描述                                                                                              |
|:---------------------------------------|:-------|:-------------------------------|:------------|:------------------------------------------------------------------------------------------------|
| sink.rolling-policy.file-size	         | 128MB  | 	是	                            | MemorySize	 | 滚动之前文件的最大大小。                                                                                    |
| sink.rolling-policy.rollover-interval	 | 30 min | 	是	                            | Duration	   | 被滚动之前，一个文件可以保持打开的最大时间间隔（默认为30分钟，以避免产生很多小文件）。通过 `sink.rolling-policy.check-interval` 选项来控制检查的频率。 |
| sink.rolling-policy.check-interval	    | 1 min	 | 是	                             | Duration	   | 滚动策略的检查时间间隔。该选项基于 `sink.rolling-policy.rollover-interval` 选项来控制检查文件是否可以被滚动。                     |

注：对于块格式（**parquet**、**orc**、**avro**），滚动策略将会根据checkpoint间隔来控制大小和他们的数量，checkpoint决定文件的写入完成。

注：对于行格式（**csv**、**json**），如果想查看文件是否在文件系统中存在，并且不想等待过长的时间，
则可以在连接器配置 **sink.rolling-policy.file-size** 和 **sink.rolling-policy.rollover-interval** ，
并且在flink-conf.yaml中设置 **execution.checkpointing.interval** 参数。

对于其他的格式（**avro**、**orc**），可以只在flink-conf.yaml中配置**execution.checkpointing.interval**参数。

### 文件压缩

文件系统sink支持文件压缩，该特性允许应用程序设置更小的checkpoint间隔，而不会产生很多的文件。

| Key	                  | 默认值	   | 从 flink-1.15.x 开始支持<br/>是否可被传递	 | 描述                                                                                    |
|:----------------------|:-------|:--------------------------------|:--------------------------------------------------------------------------------------|
| auto-compaction	      | false	 | 否	                              | 是否在流slink中开启自动压缩。数据将会被写入临时文件。checkpoint完成之后，通过checkpoint生成的临时文件将会被压缩。临时文件在被压缩之前是不可见的。 |
| compaction.file-size	 | (none) | 	是	                             | 压缩的目标文件大小，默认值为滚动文件大小。                                                                 |

如果开启，文件压缩将会基于目标文件大小合并多个小文件为大文件。在生产生运行文件压缩时，需要注意以下问题：

* 只有单个checkpoint中的文件可以被合并，因此，至少有和checkpoint次数相同的文件被生成。
* 文件在被合并之前是不可见的，因此文件可见时间为：**checkpoint间隔+压缩时间**。
* 如果压缩运行时间过长，则将会造成任务的反压，并且增加checkpoint的时间。

### 分区提交

通常来说，写入分区之后通知下游应用程序是非常必要的。比如：增加分区信息到hive的元数据，或者是在分区目录中写入一个 **_SUCCESS** 文件。
文件系统sink连接器提供了分区提交特性，以允许配置自定义策略。提交行为基于合并的触发器和策略。

Trigger触发器：分区提交的时间可以通过水印或处理时间来确定。

Policy策略：如何提交一个分区，内奸策略支持通过success文件和元数据提交，也可以自定义实现策略。比如触发hive的指标分区，或者是和并小文件等等。

注：分区提交只在动态分区插入时起作用。

#### 分区提交触发器

定义何时提交分区，提供分区提交触发器：

| Key	                                       | 默认值	          | 从 flink-1.15.x 开始支持<br/>是否可被传递 | 	类型	      | 描述                                                                                                                                                                                                                                                                                                                                                                                          |
|:-------------------------------------------|:--------------|:-------------------------------|:----------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| sink.partition-commit.trigger              | 	process-time | 	是	                            | String	   | 分区提交触发的类型：<br/>**process-time**：基于机器时间，既不需要分区时间提取，也不需要水印生成。一旦当前系统时间超过了分区创建时的系统时间加上指定的delay延迟就会提交分区。<br/>**partition-time**：基于分区字段值提取的时间，要求生成水印。当水印超过了分区值提取的时间加上delay延迟时提交水印。                                                                                                                                                                                                                |
| sink.partition-commit.delay	               | 0 s	          | 是	                             | Duration	 | 分区在延迟时间到达之前不会提交。如果是按天分区，则应该是**1 d**，如果是按小时分区，则应该是**1 h**。                                                                                                                                                                                                                                                                                                                                   |
| sink.partition-commit.watermark-time-zone	 | UTC           | 	是                             | 	String	  | 转换`long`类型的水印值为`TIMESTAMP`类型是使用的时区，转换之后的水印时间戳将被用于和分区时间计算，以决定分区是否应该被提交。<br/>该选项只有在 `sink.partition-commit.trigger` 选项设置为 **partition-time** 时起作用。如果该选项没有被正确配置，比如source的rowtime被定义为`TIMESTAMP_LTZ`字段，但是该选项没有配置，则用户将会延迟几小时之后看到提交的分区。<br/>默认值为**UTC**，这意味着水印需要被定义为`TIMESTAMP`字段，或者是不被定义。如果水印被定义为`TIMESTAMP_LTZ`字段，则水印时区为会话时区。该选项值可以是完全名称，比如**America/Los_Angeles**，或者是自定义的时区id，比如**GMT+08:00**。 |

有两种触发器类型：

* 第一个是分区的处理时间，既不要求分区时间提取，也不要求水印生成。该触发器根据分区的创建时间和当前系统时间触发分区提交。该触发器更常用，但不是很精确。比如，数据延迟或失败，将会导致不成熟的分区提交。
* 第二个是根据水印和从分区中提取的时间来触发分区提交。该触发器要求任务有水印生成，并且分区根据时间来划分，比如按小时或按天分区。

如果想要下游尽快看到新分区，而不管数据写入是否完成：

* **'sink.partition-commit.trigger'='process-time'**  （默认值）
* **'sink.partition-commit.delay'='0s'**  （默认值），分区一旦写入数据，将会立即提交。注：分区可能会被提交多次。

如果想要下游在数据写入完成之后看到分区，并且job任务有水印生成，则可以通过分区值来提取时间：

* **'sink.partition-commit.trigger'='partition-time'**
* **'sink.partition-commit.delay'='1h'**  （如果分区为小时分区，则使用 **1h**，取决于分区时间类型）这是提交分区更准确的方式。它将尝试在数据写入完成之后再提交分区。

如果想要下游在数据写入完成之后看到分区，但是没有水印，或者是无法从分区值提取时间：

* **'ink.partition-commit.trigger'='process-time'**  （默认值）
* **'sink.partition-commit.delay'='1h'** （如果分区为小时分区，则使用 **1h**，取决于分区时间类型）尝试准确的提交分区，但是迟到的数据或者是失败将会导致不成熟的分区提交。

迟到数据处理：支持写入分区的记录将会被写入已经提交的分区，并且该分区提交将会被再次触发。

#### 分区时间提取

时间提取器定义定分区值提取时间的方式。

| Key	                                                                     | 从 flink-1.15.x 开始支持<br/>要求	 | 从 flink-1.15.x 开始支持<br/>是否可被传递	 | 默认值	                 | 类型       | 	描述                                                                                                                                                                                                                                                                                                                                                                                                    |
|:-------------------------------------------------------------------------|:----------------------------|:--------------------------------|:---------------------|:---------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| partition.time-extractor.kind	                                           | 可选                          | 	否                              | 	default	            | String   | 	指定从分区值提取时间的提取类型。支持 **default** 和 **custom** 。默认情况下，可以配置时间戳的模式，自定义的话，应该配置提取器的class类。                                                                                                                                                                                                                                                                                                                   |
| partition.time-extractor.class                                           | 	可选                         | 	否	                             | (none)               | 	String	 | 实现了`PartitionTimeExtractor`接口的提取器类。                                                                                                                                                                                                                                                                                                                                                                    |
| partition.time-extractor.timestamp-pattern                               | 	可选                         | 	否                              | 	(none)              | 	String  | 	default 类型的分区时间提取方式允许用户指定分区字段时间戳的模式。默认支持从第一个属性匹配 **yyyy-mm-dd hh:mm:ss** 模式。如果时间戳应该从单个分区属性 **dt** 中提取，则可以配置为： **$dt** 。如果时间戳应该从多个分区属性中提取，可以使用 **year** 、 **month** 、 **day** 、 **hour** ，配置为： **$year-$month-$day $hour:00:00** 。如果时间戳可以从两个分区属性 **dt** 和 **hour** 提取，则可以配置为： **$dt $hour:00:00** 。                                                                                                    |
| **从 flink-1.15.x 开始支持**<br/>partition.time-extractor.timestamp-formatter | 	可选                         | 	否	                             | yyyy-MM-dd HH:mm:ss	 | String	  | 转化分区时间戳字符串值为时间戳对象的 `formatter` 格式，分区时间戳字符串值通过 **partition.time-extractor.timestamp-pattern** 选项来定义。比如，分区时间戳通过多个分区字段提取：**year**、**month**、**day**，你可以配置 `partition.time-extractor.timestamp-pattern` 选项为 **$year$month$day** ，然后配置 `partition.time-extractor.timestamp-formatter` 选项为 **yyyyMMdd** 。默认的 **formatter** 为：**yyyy-MM-dd HH:mm:ss**。<br/>timestamp-formatter 和 java 的 DateTimeFormatter 兼容。 |

默认提取器基于分区属性和时间戳默认组成。也可以通过实现 `PartitionTimeExtractor` 接口来完全自定义分区提取器。

```java
public class HourPartTimeExtractor implements PartitionTimeExtractor {
    @Override
    public LocalDateTime extract(List<String> keys, List<String> values) {
        String dt = values.get(0);
        String hour = values.get(1);
        return Timestamp.valueOf(dt + " " + hour + ":00:00").toLocalDateTime();
    }
}
```

#### 分区提交策略

分区提交策略定义分区提交时执行哪些操作：

* 第一个是元数据，只有hive表支持元数据策略，文件系统通过目录结构管理分区。
* 第二个是success文件，在分区对一个的目录下写一个空文件。

| Key	                                    | 从 flink-1.15.x 开始<br/>要求	 | 从 flink-1.15.x 开始支持<br/>是否可被传递	 | 类型       | 	描述                                                                                                                                                                                                                                                         |
|:----------------------------------------|:--------------------------|:--------------------------------|:---------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| sink.partition-commit.policy.kind       | 	可选	                      | 是                               | 	String  | 	指定提交分区并通知下游应用程序，该分区已经完成写入并可进行读取的策略。<br/>**metastore**：将分区写入元数据。只有hive表支持元数据策略，文件系统通过目录结构来管理分区。<br/>**success-file**：在目录中增加 **_success** 文件。这两个方式可以同时配置： **metastore,success-file** <br/>**custom**：使用策略类创建一个提交策略。<br/>支持配置多个策略：**metastore,success-file**。 |
| sink.partition-commit.policy.class	     | 可选                        | 	是                              | 	String	 | 实现了`PartitionCommitPolicy`接口的分区提交策略实现类。只在自定义custom提交策略中起作用。                                                                                                                                                                                                 |                                                                                                                                                                                                                                                             |
| sink.partition-commit.success-file.name | 	可选	                      | 是	                              | String   | 	`success-file`分区提交的文件名称，默认为： **_SUCCESS** 。                                                                                                                                                                                                                |

也可以向下面一样扩展提交策略实现：

```java
public class AnalysisCommitPolicy implements PartitionCommitPolicy {
    private HiveShell hiveShell;

    @Override
    public void commit(Context context) throws Exception {
        if (hiveShell == null) {
            hiveShell = createHiveShell(context.catalogName());
        }

        hiveShell.execute(String.format(
                "ALTER TABLE %s ADD IF NOT EXISTS PARTITION (%s = '%s') location '%s'",
                context.tableName(),
                context.partitionKeys().get(0),
                context.partitionValues().get(0),
                context.partitionPath()));
        hiveShell.execute(String.format(
                "ANALYZE TABLE %s PARTITION (%s = '%s') COMPUTE STATISTICS FOR COLUMNS",
                context.tableName(),
                context.partitionKeys().get(0),
                context.partitionValues().get(0)));
    }
}
```

## sink并行度

写入文件到外部文件系统的并行度（包括hive），可以通过表的`option`选项来配置，流模式和批模式都支持这么做。
默认情况下，slink的并行度和上游链在一起的算子并行度一致。如果配置了和上游算子不同的并行度，则写入文件算子的并行度将使用配置的并行度。

| Key	|从 flink-1.15.x 开始<br/>要求	 | 从 flink-1.15.x 开始支持<br/>是否可被传递 | 	类型 | 	描述      |
|:------------------------------|:-------------------------------|:----|:---------|
| sink.parallelism	             | 可选                             | 	否	 | Integer	 |将文件写入外部文件系统的并行度。数值应该大于0，否则将抛出异常。|

注：目前，配置sink并行度只支持上游算子为仅插入**INERT-ONLY**类型的变更日志模式，否则将抛出异常。

## 完整案例

下面的例子展示文件系统连接器如何通过流查询从kafka读取数据，然后写入文件系统，并且通过批查询从文件系统中读取写入的数据。

```sql
CREATE TABLE kafka_table (
  user_id STRING,
  order_amount DOUBLE,
  log_ts TIMESTAMP(3),
  WATERMARK FOR log_ts AS log_ts - INTERVAL '5' SECOND
) WITH (...);

CREATE TABLE fs_table (
  user_id STRING,
  order_amount DOUBLE,
  dt STRING,
  `hour` STRING
) PARTITIONED BY (dt, `hour`) WITH (
  'connector'='filesystem',
  'path'='...',
  'format'='parquet',
  'sink.partition-commit.delay'='1 h',
  'sink.partition-commit.policy.kind'='success-file'
);

-- streaming sql, insert into file system table
INSERT INTO fs_table 
SELECT 
    user_id, 
    order_amount, 
    DATE_FORMAT(log_ts, 'yyyy-MM-dd'),
    DATE_FORMAT(log_ts, 'HH') 
FROM kafka_table;

-- batch sql, select with partition pruning
SELECT * FROM fs_table WHERE dt='2020-05-20' and `hour`='12';
```

如果水印定义在`TIMESTAMP_LTZ`类型的字段上，并且被用于分区提交时间，则`sink.partition-commit.watermark-time-zone`配置必须设置为会话时间分区，否则分区提交将会晚几个小时。

```sql
CREATE TABLE kafka_table (
  user_id STRING,
  order_amount DOUBLE,
  ts BIGINT, -- 毫秒值
  ts_ltz AS TO_TIMESTAMP_LTZ(ts, 3),
  WATERMARK FOR ts_ltz AS ts_ltz - INTERVAL '5' SECOND -- 在TIMESTAMP_LTZ字段上定义水印
) WITH (...);

CREATE TABLE fs_table (
  user_id STRING,
  order_amount DOUBLE,
  dt STRING,
  `hour` STRING
) PARTITIONED BY (dt, `hour`) WITH (
  'connector'='filesystem',
  'path'='...',
  'format'='parquet',
  'partition.time-extractor.timestamp-pattern'='$dt $hour:00:00',
  'sink.partition-commit.delay'='1 h',
  'sink.partition-commit.trigger'='partition-time',
  'sink.partition-commit.watermark-time-zone'='Asia/Shanghai', -- 表名用户配置的时区为：'Asia/Shanghai'
  'sink.partition-commit.policy.kind'='success-file'
);

-- 流式sql，插入数据到文件系统
INSERT INTO fs_table 
SELECT 
    user_id, 
    order_amount, 
    DATE_FORMAT(ts_ltz, 'yyyy-MM-dd'),
    DATE_FORMAT(ts_ltz, 'HH') 
FROM kafka_table;

-- 批式sql，查询指定分区下的数据
SELECT * FROM fs_table WHERE dt='2020-05-20' and `hour`='12';
```