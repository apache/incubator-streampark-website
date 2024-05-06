---
slug: streampark-usercase-changan
title: 长安汽车从自研平台到Apache StreamPark™ 的升级实践
tags: [StreamPark, 生产实践]
---

![](/blog/changan/cover.png)

**导读**：长安汽车是中国汽车四大集群阵营企业之一，随着业务发展和数智化的推进，对数据的实效性要求越来越高，Flink 作业越来越多，长安汽车原本开发了一套流应用平台，用来满足开发人员对于 Flink 作业管理和运维工作的基础需求，但是在实际使用中面临诸多挑战和困境，最终使用 Apache StreamPark 来作为一站式实时计算平台，有效解决了之前面临的诸多困境，StreamPark 提供的解决方案简化了整个开发流程，在 Flink 作业开发部署上节省了很多时间，走出了作业运维管理的泥沼，显著地提升了效率。

供稿单位｜长安智能化研究院云平台开发所

编辑校对｜潘月鹏

<!-- truncate -->

重庆长安汽车股份有限公司（简称“长安汽车”）成立于 1996 年 10 月 31 日，是中国汽车四大集团阵营企业，拥有 161 年历史底蕴，现在旗下包括长安启源、深蓝汽车、阿维塔、长安引力、长安凯程等自主品牌以及长安福特、长安马自达等合资品牌。

近些年随着汽车销量的不断增加与智能化程度的不断提升，车辆每天将产生千亿级别的 CAN 数据，清洗处理后的数据也在 50 亿级别，面对如此庞大且持续膨胀的数据规模，如何从海量数据中快速提取挖掘有价值的信息，为研发、生产、销售等部门提供数据支持，成为当前亟需解决的问题。

## **1.实时计算面临的挑战**

长安汽车数据的存储与分析处理主要由云上和云下两部分构成，云上指的是我们部署在腾讯云服务器上的大数据集群，CDH 搭建，用于存储热数据；云下是部署在本地机房的 CDP 集群，从云上拉取同步数据，进行存储和分析。**Flink 在长安汽车实时计算中一直扮演着重要的角色，长安汽车开发了一套流应用平台，来满足开发人员对于 Flink 作业管理和运维工作的基础需求**。但是在实际使用中，流应用平台存在以下四各方面问题：

①**功能单一**: 只提供部署功能，无用户权限管理、团队管理、角色管理、项目管理，无法满足项目、团队管理需求。

②**易用性不足**: SQL 编写无提示、日志浏览不便、不支持调试、无错误检测、无版本管理、无配置中心等。

③**可扩展性较差**: 不支持在线扩容 Flink 集群、新增或更换 Flink 版本，新增 Flink Connectors、CDC 等。

④**可维护性较差**: 无日志查看、无版本管理、无配置中心等。

## **2.为什么用 StreamPark**

我们针对Flink 作业面临的困境，决定先从开源领域寻求解决方案，因此我们全面调研了Apache StreamPark、Dxxky、strxxing-xx-web等开源项目，**从核心能力、稳定性、易用性、可扩展性、可维护性、操作体验等多个维度进行了全方位的评估对比，并结合当前我们的流作业开发需求以及我司的大数据平台后续规划，发现 Apache StreamPark 是最符合我们当前需求的产品。因此采用 StreamPark 作为我们的流计算平台**，StreamPark 有以下优势：

### **完善的基础管理能力**

StreamPark 解决了我们已有的流应用平台无用户权限管理、团队管理、角色管理、项目管理、团队管理等问题。

① StreamPark 平台提供了用户权限管理功能。这些功能可以确保用户只能访问其所需的数据和资源，并限制其对系统或作业的修改权限。对于企业级用户而言，这种管理功能非常必要，因为它有助于保护企业的数据安全、维护系统稳定性，并确保作业的顺利运行。通过合理地设置和管理用户权限，企业可以更好地控制数据访问和操作，从而降低风险并提高工作效率。

![](/blog/changan/capability.png)

### **一站式流处理平台**

StreamPark 解决了流应用平台易用性不足，SQL 编写无提示、日志浏览不方便、无错误检测、无版本管理、无配置中心等问题。

① StreamPark 具备完善的 SQL 校验功能，实现了自动 build/push 镜像，使用自定义类加载器，**通过 Child-first 加载方式解决了 YARN 和 K8s 两种运行模式、支持了自由切换 Flink 版本等特性。**

② StreamPark 提供了作业监控和日志管理的功能，**可以帮助用户实时监控作业的运行状态，查看作业的日志信息，以及进行故障排除**。使得用户可以快速发现和解决作业运行中的问题。

### **可扩展性强**

StreamPark 解决了流应用平台可扩展性差，不支持在线扩容 Flink集群、新增或更换 Flink 版本、Flink Connectors 不足等问题。

① StreamPark 设计具有良好的可扩展性和灵活性，**可以支持大规模的 Flink on Yarn 作业运行，它能够与现有的 Yarn 集群无缝集成**，并可以根据需要进行定制和扩展。此外，StreamPark 还提供了多种配置选项和功能扩展点，以满足用户多样化的需求。

② **StreamPark 具备 Flink 作业开发所需的整套工具**。在 StreamPark 中，对于编写代码的 Flink 作业，它提供了一种更优秀的解决方案，将程序配置进行了标准化，简化了编程模型，同时还提供了一系列连接器，显著降低了 DataStream 开发的难度。

![](/blog/changan/connectors.png)

除了上述优点外，**StreamPark 还能妥善管理作业的整个生命周期，包括作业的开发、部署、运营以及问题诊断等环节，使开发人员能够专注于业务本身，无需过多关注 Flink 作业的管理和运维问题**。StreamPark 的作业开发管理模块大致可以分为三个部分：作业管理基础功能、Jar 作业管理和 FlinkSQL 作业管理。

![](/blog/changan/job_management.png)

## **3.StreamPark落地实践**

为了使 StreamPark 在日常生产实践中与我们的需求更加契合，我们对其进行了一定的适应性改造：

### **适应性改造**

#### **告警信息改造**

长安汽车针对 StreamPark 的一些特性进行了适应性改造，比如针对 StreamPark 的告警不仅支持邮件、飞书、钉钉和企业微信推送，还支持将告警信息按照重要程度进行分类，推送到不同的告警群与相关个人，方便相关运维人员及时捕捉重要告警信息，快速响应。

![](/blog/changan/alarm_information.png)

#### **Nocos 配置管理支持**

为解决 Flink 应用的配置信息写死在 Jar 包中，给开发、测试、运维带来的不便，我们将 Nacos 与 StreamPark 平台进行集成，带来了如下优势：

① 配置集中管理，通过 StreamPark，开发人员可以集中管理所有 Flink 应用配置信息，实现配置的集中管理和更新，避免了在多个平台间进行切换和重复操作。同时加强了配置管理的安全性，对访问和修改配置的操作进行权限控制，防止未经授权的访问和修改。

② 配置动态更新，StreamPark 与 Nacos 的集成使得 Flink 应用能够及时获取最新的配置信息，实现配置的动态更新，避免了修改 Flink 配置信息后需要重新编译、发布、重启等繁琐流程，提高了系统的灵活性和响应速度。同时，StreamPark 可以利用 Nacos 的配置推送功能，实现配置信息的自动化更新。

![](/blog/changan/nocos.png)


### **遇到的问题及解决方案**

我们当前私有云分析集群使用的是 Cloudera CDP，Flink 版本为 Cloudera Version 1.14，整体 Flink 安装目录以及配置文件结构与社区版本有较大出入。直接根据 StreamPark 官方文档进行部署，将无法配置 Flink Home，以及后续整体 Flink 任务提交到集群中，因此需要进行针对化适配集成，在满足使用需求上，尽量提供完整的 StreamPark 使用体验。

#### **1. Flink集群无法访问**

① 问题描述：Cloudera Flink 的安装路径与实际提交路径不一致，实际提交路径下缺少 conf 目录。

② 解决办法：实际的 flink 提交路径在
```shell
/opt/cloudera/parcels/Flink-$ {version}/lib/flink/bin/flink
```

因此路径

```shell
/opt/cloudera/parcels/Flink-$ {version}/1ib/flink
```

可以理解为真正的 Flink Home，具体查看该目录下内容。

![](/blog/changan/flink_home.png)

发现缺少 conf 目录，倘若配置该目录在 StreamPark 为 Flink Home 将无法访问到集群，因此可软连接 Flink 配置或者在该路径下编辑集群中的 Flink 配置文件。

![](/blog/changan/conf.png)

综上，前置配置和打包好代码（代码中可能会涉及到自己使用上的优化修改）之后，可以进行部署。

注意 2.0 的版本打包的话直接执行源码中的 build.sh 即可，选择混合部署，生成的包在 dist 目录下。

#### **2. Hadoop 环境检查失败**

![](/blog/changan/hadoop.png)

```shell
vi /etc/profile
```

解决办法：在部署 StreamPark 的节点上添加一下 hadoop 环境即可添加

```shell
export HADOOP_CONF_DIR=/etc/hadoop/conf
```

source 使其生效，重启 StreamPark 即可。

#### **3. HDFS 的 Flink路径下缺少 lib 目录**

解决办法：在于部署后的 StreamPark 在 HDFS 上的工作目录上 lib 目录没有正常上传，找到 HDFS 上初始化的 StremPark work 路径，观察一下 hdfs:///streampark/flink/.../下的 lib 目录是否完整，不完整的话手动将本地 Flink Home 目录下的 lib put 上去即可。

![](/blog/changan/lib.png)

#### **4. 作业失败后自动拉起导致作业重复**

StreamPark 自身具备作业使用后重启拉取的能力，当检测到作业失败后会重新拉起，但在实践中发现会出现同一个失败的作业在 YARN上启动多个的情况，经过和社区沟通，已确定是个 Bug，最终在 2.1.3 中解决了该 Bug。

## **4.带来的收益**

目前长安汽车已经在云上生产/预生产环境、云下生产/预生产环境中部署了 StreamPark，截至发稿前 StreamPark 共管理了 150+ 的 Flink 作业，包括 JAR 和与 SQL 作业。涉及利用 Flink、FlinkCDC 等技术，从 MySQL 或 kafka 同步数据到 MySQL、Doris、HBase、Hive 等数据库。后续所有环境总计 3000+ 的 Flink 作业也会分批迁至 StreamPark 来集中管理。

**Apache StreamPark 带来的收益最明显的就是其提供了一站式服务，业务开发同学可以在 StreamPark 上完成作业开发编译发布，无需再使用多个工具完成一个 FlinkSQL 作业开发，简化了整个开发流程**，StreamPark 给我们在 Flink 作业开发部署上节省了很多时间，显著地提升了 Flink 应用开发效率。

![](/blog/changan/job.png)
