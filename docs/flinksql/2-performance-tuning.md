---
id: '2-performance-tuning'
title: 'Performance Tuning'
sidebar_position: 2
---

## 介绍

SQL是数据分析中使用最广泛的语言。Flink的Table API和SQL使用户可以用更少的时间和精力去开发高效的流分析应用程序。
此外，Flink Table API和SQL都被进行了有效的优化，集成了大量查询优化和算子优化实现。但是并不是所有的优化都是默认启用的，所以对于某些查询任务，可以通过开启一些配置来提高性能。

下面我们将介绍一些有用的优化选项和流聚合的内部结构，这些配置在某些情况下会带来很大的性能优化。

下面提到的流聚合优化现在都支持分组聚合和窗口TVF聚合。

## MiniBatch聚合

默认情况下，分组聚合算子会逐个处理输入记录，即：

1. 从`state`状态读取`累加器`
2. 将记录`累加/撤回`到`累加器`
3. 将`累加器`写`回状态`
4. 下一个记录将从(1)再次进行处理。

这种处理模式可能会增加`StateBackend`的开销(特别是`RocksDB StateBackend`)。此外，生产中常见的数据倾斜会使问题更加严重，使任务更容易处于反压状态。

`MiniBatch`微批处理聚合的核心思想是将大量输入缓存到聚合算子内部的缓冲区中。当输入记录集合被触发进行处理时，每个key只需要访问一次状态。这可以显著减少状态开销并获得更好的吞吐量。
但这可能会增加一些延迟，因为它会先缓冲一些记录而不是立即处理它们。这是吞吐量和延迟之间的权衡。

下图解释了MiniBatch处理聚合如何减少状态操作。

![img.png](/doc/image/flinksql/mini-batch.png)

解释：上面是一个记录读取一次状态，写入一次状态。下面是多个相同key的记录缓存之后，访问一次状态，写入一次状态。

默认情况下，分组聚合会禁用`MiniBatch`优化。
为了启用此优化，需要设置**table.exec.mini-batch.enabled**、**table.exec.mini-batch.allow-latency**、**table.exec.mini-batch.size**。
详情请参阅[查询配置](1-query-config)页面。

无论上述配置如何，窗口TVF聚合始终启用MiniBatch优化。窗口TVF聚合缓冲区记录在托管内存中，而不是JVM堆中，因此没有过载GC或OOM问题的风险。

下面的示例展示如何启用这些选项。

```sql
set 'table.exec.mini-batch.enabled' = 'true';       -- 启用mini-batch
set 'table.exec.mini-batch.allow-latency' = '5 s';  -- 使用5s时间去缓存输入记录
set 'table.exec.mini-batch.size' = '5000';          -- 每个聚合算子任务最多可以缓存的最大记录数量
```

## Local-Global

`local-global`算法通过将分组聚合分为两个阶段来解决数据倾斜问题，即先在上游进行局部聚合，然后在下游进行全局聚合，类似于`MapReduce`中的`Combine + Reduce`模式。例如有以下SQL：

```sql
SELECT color, sum(id)
FROM T
GROUP BY color;
```

数据流中的记录可能是倾斜的，因此一些聚合算子的实例必须处理比其他实例多得多的记录，这就导致了热点问题。
本地聚合可以在上游先将具有相同键的一定数量的输入积累到单个累加器中，全局聚合将只接收少量的累加器，而不是大量的原始输入。
这可以显著降低网络shuffle和状态访问的成本。本地聚合每次累积的输入记录数量基于微批聚合的时间间隔。这意味着本地聚合依赖于启用微批聚合。

下图显示本地-全局聚合如何提高性能。

![img.png](/doc/image/flinksql/local-global-agg.png)

解释：左边聚合，聚合算子会收集所有输入，因此上面的聚合算子收到很多原始记录，造成了热点问题。
右边聚合，上游的本地聚合会先将输入在进行和聚合算子相同的操作，将输入根据key来进行聚合，下游的聚合算子只需要接收上游本地聚合之后的累加器即可，因此可以显著减少下游聚合算子的输入数据量。

下面的示例说明如何启用本地-全局聚合。

```sql
set 'table.exec.mini-batch.enabled' = 'true';           -- 本地-全局聚合依赖于开启微批聚合
set 'table.exec.mini-batch.allow-latency' = '5 s';      -- 使用5s时间去缓存输入记录
set 'table.exec.mini-batch.size' = '5000';              -- 每个聚合算子任务最多可以缓存的最大记录数量
set 'table.optimizer.agg-phase-strategy' = 'TWO_PHASE'; -- 启用两阶段聚合策略，比如：本地-全局聚合
```

## 切分DISTINCT聚合

本地-全局优化对于一般聚合(`SUM`、`COUNT`、`MAX`、`MIN`、`AVG`)的数据倾斜是有效的，但在处理`distinct聚合`时性能并不理想。

例如，如果我们想要分析今天有多少独立用户登录。我们可能会进行以下查询：

```sql
SELECT day, COUNT(DISTINCT user_id)
FROM T
GROUP BY day;
```

`COUNT DISTINCT`不擅长于减少记录，如果`DISTINCT`键(即user_id)的值是稀疏的，即使启用了`本地-全局`优化，也没有多大帮助。
因为累加器仍然包含几乎所有的原始记录，全局聚合将成为瓶颈(大多数重量级累加器都由一个任务处理，即在同一天)。

`切分distinct聚合优化`的思想是将不同的聚合(例如COUNT(distinct col))分解为两个层次。第一个聚合按`分组键`和附加的`bucket`总数进行`shuffle`。
`bucket键`使用`HASH_CODE(distinct_key) % BUCKET_NUM`计算。默认情况下，`BUCKET_NUM`是`1024`
，可以通过`table.optimizer.distinct-agg.split.bucket-num`配置。
第二个聚合按原始分组键进行`shuffle`，并使用`SUM`聚合来自不同`bucket`的`COUNT DISTINCT`值。因为相同的distinct字段值只会在相同的bucket中计算，所以转换是等价的。
`bucket键`作为一个额外的分组键，分担分组键中热点的负担。bucket键使任务具有可伸缩性，以解决distinct聚合中的数据倾斜/热点问题。

拆分不同的聚合后，上面的查询将被自动重写为下面的查询：

```sql
SELECT day, SUM(cnt)
FROM (
    SELECT day, COUNT(DISTINCT user_id) as cnt
    FROM T
    GROUP BY day, MOD(HASH_CODE(user_id), 1024)
    )
GROUP BY day;
```

下图显示分割distinct聚合如何提高性能(假设颜色代表天数，字母代表user_id)。

![img.png](/doc/image/flinksql/split-distinct.png)

解释：左图聚合，本地聚合会先对相同键进行聚合，以减少数据量，全局聚合的一个算子也还是会收到所有他所应该聚合的所有同一天的累加器。
右图聚合，`agg1`设置`bucket`为4，然后将`map`的输入值通过天的`hash`和`bucket`取余，放到不同的`agg1`并行度，`agg1`接收到数据后，进行聚合。
`agg2`只需要接收每个`agg1`里不同颜色中`user_id`的数量即可（一个颜色中有两个user_id，就传递数字2），然后对接收到的数量进行累加即可。

注意：上例只是一个简单的示例。除此之外，Flink还支持分割更复杂的聚合查询，例如，`多个distinct聚合`具有`不同的distinct键`(例如COUNT(distinct a)， SUM(distinct b))，
与其他非不同的聚合(例如`SUM`, `MAX`, `MIN`, `COUNT`)一起使用。

目前，分割优化不支持包含用户自定义的`AggregateFunction`的聚合。

下面的示例演示如何启用分割distinct聚合优化。

```sql
set 'table.optimizer.distinct-agg.split.enabled' = 'true'   -- 启用distinct聚合分割
```

## 在DISTINCT上使用FILTER改进

在某些情况下，用户可能需要计算来自不同维度的UV(唯一访问者)的数量，例如来自Android的UV，来自iPhone的UV，来自Web的UV和总UV。很多用户会选择`CASE WHEN`来实现这个需求，例如：

```sql
SELECT
    day,
    COUNT(DISTINCT user_id) AS total_uv,
    COUNT(DISTINCT CASE WHEN flag IN ('android', 'iphone') THEN user_id ELSE NULL END) AS app_uv,
    COUNT(DISTINCT CASE WHEN flag IN ('wap', 'other') THEN user_id ELSE NULL END) AS web_uv
FROM T
GROUP BY day;
```

建议使用`FILTER语法`而不是`CASE WHEN`。因为`FILTER`更符合SQL标准，且能获得更大的性能优化。`FILTER`是用于聚合函数的修饰符，用于限制聚合中使用的值。将上面的示例替换为`FILTER`修饰符，如下所示：

```sql
SELECT
    day,
    COUNT(DISTINCT user_id) AS total_uv,
    COUNT(DISTINCT user_id) FILTER (WHERE flag IN ('android', 'iphone')) AS app_uv,
    COUNT(DISTINCT user_id) FILTER (WHERE flag IN ('wap', 'other')) AS web_uv
FROM T
GROUP BY day
```

Flink SQL优化器可以识别相同`distinct`键上的不同筛选器参数。例如，在上面的示例中，所有三个`COUNT DISTINCT`都在`user_id`列上。
这样，Flink就可以只使用一个共享状态实例而不是三个状态实例来减少状态访问次数和状态大小。在某些任务中可以获得显著的性能优化。