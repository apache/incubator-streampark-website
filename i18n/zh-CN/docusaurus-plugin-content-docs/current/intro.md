---
id: 'intro'
title: '框架介绍'
sidebar_position: 1
---

# StreamPark
make stream processing easier!!!

> 一个神奇的框架,让流处理更简单

## 🚀 什么是StreamPark

实时即未来,在实时处理流域 `Apache Spark` 和 `Apache Flink` 是一个伟大的进步,尤其是`Apache Flink`被普遍认为是下一代大数据流计算引擎, 我们在使用 `Flink` & `Spark` 时发现从编程模型, 启动配置到运维管理都有很多可以抽象共用的地方, 我们将一些好的经验固化下来并结合业内的最佳实践, 通过不断努力终于诞生了今天的框架 —— `StreamPark`, 项目的初衷是 —— 让流处理更简单,
使用`StreamPark`开发,可以极大降低学习成本和开发门槛, 让开发者只用关心最核心的业务,`StreamPark` 规范了项目的配置,鼓励函数式编程,定义了最佳的编程方式,提供了一系列开箱即用的`Connectors`,标准化了配置、开发、测试、部署、监控、运维的整个过程, 提供了`scala`和`java`两套api,
其最终目的是打造一个一站式大数据平台,流批一体,湖仓一体的解决方案

<video src="http://assets.streamxhub.com/streamx-video.mp4" controls="controls" width="100%" height="100%"></video>

## 🎉 Features

* Apache Flink & Spark 应用程序开发脚手架
* 支持多个版本的 Flink & Spark
* 一系列开箱即用的connectors
* 一站式流处理运营平台
* 支持catalog、olap、streaming-warehouse等
* ...

## 🏳‍🌈 组成部分

`StreamPark`有三部分组成,分别是`streampark-core`,`streampark-pump` 和 `streampark-console`

![StreamPark Archite](/doc/image/streampark_archite.png)

### 1️⃣ streampark-core

`streampark-core` 定位是一个开发时框架,关注编码开发,规范了配置文件,按照约定优于配置的方式进行开发,提供了一个开发时 `RunTime Content`和一系列开箱即用的`Connector`,扩展了`DataStream`相关的方法,融合了`DataStream`和`Flink sql` api,简化繁琐的操作,聚焦业务本身,提高开发效率和开发体验

### 2️⃣ streampark-pump

`pump` 是抽水机,水泵的意思,`streampark-pump`的定位是一个数据抽取的组件,类似于`flinkx`,基于`streampark-core`中提供的各种`connector`开发,目的是打造一个方便快捷,开箱即用的大数据实时数据抽取和迁移组件,并且集成到`streampark-console`中,解决实时数据源获取问题,目前在规划中

### 3️⃣ streampark-console

`streampark-console` 是一个综合实时数据平台,低代码(`Low Code`)平台,可以较好的管理`Flink`任务,集成了项目编译、发布、参数配置、启动、`savepoint`,火焰图(`flame graph`),`Flink SQL`,
监控等诸多功能于一体,大大简化了`Flink`任务的日常操作和维护,融合了诸多最佳实践。旧时王谢堂前燕,飞入寻常百姓家,让大公司有能力研发使用的项目,现在人人可以使用,
其最终目标是打造成一个实时数仓,流批一体的一站式大数据解决方案,该平台使用但不仅限以下技术:

* [Apache Flink](http://flink.apache.org)
* [Apache YARN](http://hadoop.apache.org)
* [Spring Boot](https://spring.io/projects/spring-boot/)
* [Mybatis](http://www.mybatis.org)
* [Mybatis-Plus](http://mp.baomidou.com)
* [Flame Graph](http://www.brendangregg.com/FlameGraphs)
* [JVM-Profiler](https://github.com/uber-common/jvm-profiler)
* [Vue](https://cn.vuejs.org/)
* [VuePress](https://vuepress.vuejs.org/)
* [Ant Design of Vue](https://antdv.com/)
* [ANTD PRO VUE](https://pro.antdv)
* [xterm.js](https://xtermjs.org/)
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* ...

感谢以上优秀的开源项目和很多未提到的优秀开源项目,给予最大的respect.
