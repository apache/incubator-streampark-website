---
slug: streampark-flink-with-paimon-in-ziru
title: 自如基于 Apache StreamPark™ + Paimon 实现数据一键入湖最佳实践
tags: [StreamPark, 生产实践]
---

![](/blog/ziru/new_cover.png)

**导读**：本文主要介绍了自如 MySQL 数据迁移至 Hive 的架构升级演进，原有架构涉及到的组件众多，链路复杂，遇到很多挑战，在使用 StreamPark + Paimon 这套组合方案后有效地解决了数据集成中遇到的困境和挑战，分享了 StreamPark + Paimon 在实际应用中具体的实践方案，以及这套新秀组合方案带来的优势和收益。

StreamPark: https://github.com/apache/streampark

Paimon: https://github.com/apache/paimon

欢迎关注、Star、Fork，参与贡献 

供稿单位｜北京自如信息科技有限公司

文章作者｜刘涛、梁研生、魏林子

文章整理｜杨林伟

内容校对｜潘月鹏

<!-- truncate -->

## **1.数据集成业务背景**  

自如租房业务的数据集成场景主要来源于各业务线的 MySQL 表同步到 Hive 表的需求。这一需求包含了每天同步的 MySQL 业务表数量超过 4400 个，以及超过 8000 多个的 Hive ETL 加工任务，每天新产生数据量有 50T，而且这些数字还在不断增长。根据数据的新鲜度需求分为低新鲜度（T+1 day）和高新鲜度（T+10 minutes）两种，每天同步调度 4000 多个低新鲜度数据表，以及每天同步调度 400 多个高新鲜度数据表，用以确保数据的及时性和准确性。

自如的数据集成方案根据业务使用场景主要可分为两种：

- **低新鲜度**：低新鲜度对数据的时效性要求是 **T+1day**  , 每日定时凌晨 00:00 采用 Hive jdbc handler 进行 MySQL 数据的全量拉取至 Hive，其基本流程如下图所示：

  ![](/blog/ziru/low_freshness.png)

- **高新鲜度**：此场景中要求数据实效性是 **T+10minutes**，我们复用了低新鲜度场景的快照拉取方法来实现全量数据的获取，并且初始化至 MySQL，同步利用 Canal 解析日志收集到 Kafka，然后使用 Flink 读取 kafka 中的数据并写入到 HDFS，最后用 Airflow 进行调度以合并增量数据至 Hive，其基本逻辑如下所示：

  ![](/blog/ziru/high_freshness.png)

然而，当前架构存在着多方面的挑战和压力。首先是运维成本高昂，其次是计算压力、存储压力和网络压力都非常大。另外，虽然系统运行时间从 0:00 到 1:00 期间资源利用不充分，但其他时间段却面临着资源不足的情况。对此自如决定更新数据集成架构以提高系统的效率和稳定性。

## **2.遇到的挑战**

在上述的两种场景中，我们在数据集成过程中遇到了以下挑战：

- **网络带宽超负荷问题**：由于拉取任务达到 **4000+**，过多的镜像全量数据拉取对数据库网络带宽产生了巨大压力。

- **资源利用率低效**：上游数据从 MySQL 同步到 ODS 层表后，下游的加工表才能启动，导致在 0:00 到 1:00 之间，Hadoop 集群的 CPU 和内存资源并未得到充分利用。

- **维护成本高昂**：当数据库表结构发生改变时，需要同步修改 Airflow 脚本。否则，会出现不完整的字段，引起线上数据异常问题。

- **问题排查困难**：数据链路较长，当出现数据异常时，问题排查成本较高，问题可能出现在 Canal、Kafka、Flink、Airflow 调度中的任何一个环节，导致问题恢复时间长。

- **Flink 作业难以统一管理**：Flink 本身没有提供很好的部署和开发能力，在 Flink 任务数量增多后，管理和维护的时间成本也随之上升。

为了解决上述问题，我们经过一系列调研后，决定采用 “**StreamPark+Paimon**” 的策略，那么选择它们的原因是什么呢？我们可以先看看它们的特性。

### **Paimon 的核心特性**

**在经过对 Apache Hudi / Iceberg / Paimon 几个数据湖框架的调研和综合评估之后，我们决定使用 Apache Paimon**，Apache Paimon 是一项流式数据湖存储技术，可以为用户提供高吞吐低延时的数据摄入，流式订阅和实时查询能力，支持使用 Flink 和 Spark 构建实时 Lakehouse 架构，支持批/流数据处理操作，创新性地将 Lake 格式与 LSM 结构相结合，将实时流式更新引入 Lake 架构中，具有以下优点：

- **统一的批处理和流处理**：Paimon 支持批量写入、批量读取和流式操作，提供了灵活的数据处理方式。

- **数据湖功能**：作为数据湖存储系统，Paimon 具有低成本、高可靠性和可扩展的元数据等特性。

- **丰富的合并引擎**：Paimon 提供了多种合并引擎，可以根据需求选择保留最新数据、进行局部更新或进行聚合操作。

- **自动生成变更日志**：Paimon 支持多种 Changelog 生产者，能够自动生成正确完整的变更日志，简化流式任务分析。

- **丰富的表类型**：Paimon 支持主键表和仅追加表，以及多种表类型，如内部表、外部表、分区表和临时表。

- **支持表结构变更同步**：当数据源表结构发生变化时，Paimon 能自动识别并同步这些变化。

Paimon 可以结合 Apache Spark 来使用，我们场景是 Paimon 结合 Flink 的方式，这样一来 “**如何管理 4000+个 Flink 数据同步作业**” 将会是我们面临的新问题。在全面调研了相关项目，经过各项维度综合评估后，**我们决定采用 StreamPark**，那么为什么选择 StremaPark 呢？

### **StreamPark 的核心特性**

Apache StreamPark 是一个流处理开发管理框架，提供了一套快捷的API 用来开发 Flink/Spark 作业，此外还提供了一个一站式的流处理作业开发管理平台，从流处理作业开发到上线全生命周期都做了支持，StreamPark 主要包含下面这些核心特点：

- **流处理应用开发框架**：基于 StreamPark，开发者可以轻松构建和管理流处理应用程序，更好地利用  Apache Flink 去编写流处理应用程序。

- **完善的作为管理能力**：StreamPark 提供一站式流任务开发管理平台，支持了 Flink / Spark 从应用开发到调试、部署、运维等全生命周期的能力支持，让 Flink / Spark 作业变得简单。

- **完成度高**：StreamPark 支持了 Flink 多版本，可以做到一个平台灵活切换，同时支持 Flink 所的部署模式，有效解决了 Flink on YARN / K8s 部署过于繁琐的问题，通过自动化流程，简化了任务的构建、测试和部署流程，并提高了开发效率。

- **丰富的管理 API**：StreamPark 提供了作业操作的 API，包括作业创建、拷贝、构建、部署、基于 checkpoint/savepoint 的停止和启动等功能，使外部系统调用 Apache Flink 任务变得易于实现。

## **3. StreamPark + Paimon 实践**

接下来，我们将继续分享自如是如何基于 **StreamPark + Paimon** 进行架构优化改造的，我们先看架构升级前后的对比。

### **3.1 架构升级前**

数据集成模块在改造之前的系统交互流程如下：

![](/blog/ziru/system_interaction_process.png)

**Step1**（用户发起接入申请）：首先用户在数据接入平台选择一个表，然后点击申请接入按钮：

![](/blog/ziru/data_access_platform.png)

**Step2**（发起OA系统审批流程）：OA 系统接收到接入申请，会发起工作流审批，如审批失败会驳回申请，审批通过才会继续下一步。

**Step3**（数据接入平台处理审批通过事件）：数据接入平台调用 Canal 接口部署 Canal 任务，将表中的 Binlog 数据传入 Kafka ：

![](/blog/ziru/canal_job.png)

**Step4**（Flink 任务部署）：人工使用 Flink Session Submit UI 部署 Flink 模板作业，负责解析 Kafka 中的 Binlog 变化数据，并将数据写入 HDFS，同时映射成 Hive 外部增量表：

![](/blog/ziru/flink_job.png)

**Step5**（Airflow调度初始化表）：创建 Hive 映射增量表和全量表并用 Airflow 调度完成首次初始化:

![](/blog/ziru/first_initialization.png)

**Step6**（数据合并到 Hive 全量表）：配置调度通过 Hive Merge 方式将 Hive 外部增量表的数据合并到 Hive 全量表中

![](/blog/ziru/data_merging.png)

### **3.2 架构升级后**

改造后的系统交互流程图如下：

![](/blog/ziru/after_the_transformation.png)

对比改造前和改造后的交互流程图，可以看出前两个步骤的流程（表接入申请与审批）是一样的，只是审批通过之后的事件**监听处理方式**的差异。

- **改造前**：调用 Canal 接口去部署Canal 任务（旧的逻辑）；

- **改造后**：调用 StreamPark 的 API 接口完成 Flink Paimon 的任务部署。

接下来看看使用 Paimon 来完成数据的集成的。

### **3.3 Paimon 实现一键入 Hive**

在 Apache Paimon 0.5 版本后，提供了 CDC 数据集成能力，通过官方提供的 paimon-action jar 可以很方便的将 MySQL、Kafka、Mongo 等中的数据实时摄入到 Paimon 中，我们正在使用的是 paimon-flink-action ，采用了 **mysql-sync-database（整库同步）**，并通过“**—including_tables**” 参数选择要同步的表。这种同步模式有效地节省了大量资源开销，相比每个表启动一个 Flink 任务而言，避免了资源的大量浪费。

paimon-flink-action 提供了自动创建 Paimon 表的功能，并支持 Schema Evolution（例如，当 MySQL 表字段发生变化时，Paimon 表会相应变化，无需额外操作）。整个操作流程高效而顺畅，解决了原始架构因添加字段而产生的不必要运维成本，paimon-action 具体使用如下，更多请参考Paimon 官网文档。

```shell
<FLINK_HOME>/bin/flink run \
    /path/to/paimon-flink-action-0.8-SNAPSHOT.jar \
    mysql_sync_table
    --warehouse <warehouse-path> \
    --database <database-name> \
    --table <table-name> \
    [--partition_keys <partition_keys>] \
    [--primary_keys <primary-keys>] \
    [--type_mapping <option1,option2...>] \
    [--computed_column <'column-name=expr-name(args[, ...])'> [--computed_column ...]] \
    [--metadata_column <metadata-column>] \
    [--mysql_conf <mysql-cdc-source-conf> [--mysql_conf <mysql-cdc-source-conf> ...]] \
    [--catalog_conf <paimon-catalog-conf> [--catalog_conf <paimon-catalog-conf> ...]] \
    [--table_conf <paimon-table-sink-conf> [--table_conf <paimon-table-sink-conf> ...]]
```

引入 Paimon 后缩短了整个数据接入链路，消除了对 Canal、Kafka、Airflow 的依赖，使得 MySQL 直接以分钟级速度与 Hive 对接，整体环境清爽高效。此外，Paimon 完全兼容 Hive 端数据读取，转换成本极低，对原始架构脚本的使用也具备良好的兼容性，Paimon 还支持 Tag 功能，可以视为轻量级的快照，大幅降低了存储成本。

### **3.4 StreamPark + Paimon 落地实践**

StreamPark 在 2.1.2 版本中更好的支持了 JAR 类型的作业，使得 Paimon 类型的数据集成作业更简单了，下面的示例，演示了如何使用 StreamPark 快速开发 Paimon 数据迁移类型的作业：

//视频链接 (StreamPark 部署 Paimon 数据集成作业示例 )

诚然 StreamPark 在 2.1.2 版本之后已经特别针对 Paimon 数据集成类作业做了支持，但是这种手动创建作业，输入作业参数的方式还是不满足我们的实际需求，我们需要更灵活的作业创建，可以通过调用 API 的方式快速完成作业创建、启动... 经过我们的调研发现 StreamPark 已经完整的开放了作业的各项操作 API，如作业的复制、创建、部署、启动、停止等，这样一来，我们通过定时调度就可以非常方便和 StreamPark 组合，来快速完成作业的开发和运行，具体方式如下：

**Step1**：首先，会调用api copy 模版接口，并传入参数，相关截图如下：

![](/blog/ziru/api_copy.png)

这样该作业就快速创建完成，参数会通过 copy 接口传入，具体参数如下：

![](/blog/ziru/parameter.png)

**Step2**：接着，调用api构建作业镜像：

![](/blog/ziru/job_mirroring.png)

**Step3**：继续调用api启动作业：

![](/blog/ziru/start_the_job.png)

最后，任务启动成功后，可以在 StreamPark 平台看到任务的相关状态信息以及整体任务的资源概况：

![](/blog/ziru/resource_overview.png)

并可以点击Application Name 调度Flink Web UI：

![](/blog/ziru/flink_ui.png)

最后可以直接在 Hive 端查询 Paimon 表，获取所需的数据，其中 Paimon 表是经过 Flink 处理的、延时较低的数据同步目标表。Hue 中 Hive 查询 Paimon 表截图如下

![](/blog/ziru/hive_query_paimon.png)

通过以上步骤，业务方可以方便地发起接入申请，经过审批流程后，通过 StreamPark 创建部署 Flink 作业，数据通过 Flink 作业入  Paimon 表，使用户能够轻松地在 Hive 端进行查询操作，整个流程简化了用户操作，提高了数据接入的效率和可维护性。

## **4. 带来的收益**

自如通过使用 Paimon 和 StreamPark ，带来了如下优势和效益：

- **网络资源和数据库压力优化**：通过直接从 Paimon 表获取数据快照，解决了凌晨从业务数据库拉取数据导致的网络资源紧张和数据库压力过大问题，同时降低了数据存储成本。

- **作业管理接口提升效率**：使用 StreamPark 的作业管理接口轻松解决了手动部署 Flink 任务的问题，消除了人员依赖时间导致任务不及时部署的情况，提高了效率，同时减少了沟通成本，提升了 Flink 作业的管理效率。

- **降低开发、维护成本**：解决了之前方案链路长导致的维护成本高和问题定位慢的问题，同时解决了字段变化导致的字段不一致问题，实现了数据接入的流批统一，降低了开发和维护的成本。

- **降低了数据集成调度资源和计算资源的使用成本**：不再依赖外部调度系统进行增量数据的合并，减少了调度资源的使用。也不再依赖 Hive 资源进行合并操作，降低了合并增量数据对 Hive 计算资源的花销成本。

## **5. 结语与期望**

我们衷心地感谢 **Apache StreamPark** 社区在我们使用 StreamPark API 时提供的无私帮助。他们专业的服务精神和以用户为本的态度，使我们得以更加高效、流畅地运用这一强大框架。作为一套卓越的框架，StreamPark 不但拥有出色的功能，而且能支持一系列如任务复制、创建、部署、启动、停止以及状态监控的操作，并在简化 Flink 任务的管理与维护方面显著地发挥了其价值。

同时，对 **Apache Paimon** 社区在自如 MySQL 入 Paimon 测试阶段给予我们的耐心与专业指导表示感谢，这是我们能够顺利完成测试的重要支持。Paimon 作为一项富有潜力的项目，无论是在功能实现还是团队协作方面，都展现了非凡的素质。

最后，我们对 Apache StreamPark 和 Apache Paimon 的未来之路满怀期待和信心，坚信它们能在未来会成为 Apache 的优秀项目。它们卓越的功能和和睦的社区合作模式，都为其在开源社区的成熟之路打下了坚实的基础。我们期待 StreamPark 和 Paimon 社区能一如既往地保持专业态度和良好的团队协作精神，不断推进项目发展，成为近年来新晋 Apache 项目的典范，以便对更广大的开发者社区产生更大的影响。

