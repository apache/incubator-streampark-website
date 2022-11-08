---
id: 'intro'
title: 'What is StreamPark'
sidebar_position: 1
---

# StreamPark
make stream processing easier!!!

> An amazing framework makes stream processing easier.

## 🚀 What is StreamPark

`StreamPark` is an easy-to-use stream processing application development framework and one-stop stream processing operation platform, Aimed at ease building and managing streaming applications, StreamPark provides scaffolding for writing streaming process logics with Apache Flink and Apache Spark.
StreamPark also provides a professional task management including task development, scheduling, interactive query, deployment, operation, maintenance, etc.

<video src="http://assets.streamxhub.com/StreamPark-video.mp4" controls="controls" width="100%" height="100%"></video>

## Why StreamPark

Apache Flink and Apache Spark are widely used as the next generation of big data streaming computing engines.  Based on a bench of excellent experiences combined with best practices, we extracted the task deployment and runtime parameters into the configuration files. In this way,  an easy-to-use RuntimeContext with out-of-the-box connectors would bring easier and more efficient task development experience. It reduces the learning cost and development barriers, hence developers can focus on the business logic.
On the other hand, It can be challenge for enterprises to use Flink & Spark if there is no professional management platform for Flink & Spark tasks during the deployment phase. StreamPark provides such a professional task management platform, including task development, scheduling, interactive query, deployment, operation, maintenance, etc.

## 🎉 Features
* Apache Flink & Spark application development scaffolding
* Supports multiple versions of Flink & Spark
* A range of out-of-the-box connectors
* one-stop stream processing operation platform
* Support catalog、olap、streaming-warehouse etc.
* ...


## 🏳‍🌈 Architecture of StreamPark

The overall architecture of StreamPark is shown in the following figure. StreamPark consists of three parts, they are StreamPark-core, StreamPark-pump, and StreamPark-console.

![StreamPark Archite](/doc/image/streampark_archite.png)

### 1️⃣ StreamPark-core

The positioning of `StreamPark-core` is a framework uesd while developing, it focuses on coding development, regulates configuration files, and develops in the convention over configuration guide.
StreamPark-core provides a development-time RunTime Content and a series of out-of-the-box Connectors. Cumbersome operations are simplified by extending `DataStream-related` methods and integrating DataStream and `Flink sql` api .
development efficiency and development experience will be highly improved because users can focus on the business.

### 2️⃣ StreamPark-pump

`StreamPark-pump` is a component similar to `flinkx` which is used for data extraction. It is developed based on various connectors provided in `StreamPark-core` and will be integrated into `StreamPark-console`.
The purpose of developing StreamPark-pump is to create a convenient, fast, out-of-the-box extraction and migration component for real-time big data. We expect it could solve the real-time data source fetching problem.
`StreamPark-pump` is still in planning.

### 3️⃣ StreamPark-console

`StreamPark-console` is a comprehensive real-time `low code` data platform that can manage `Flink` tasks more convenient.
It integrates the experience of many best practices and integrates many functions such as project compilation, release,
parameter configuration, startup, `savepoint`, `flame graph`, `Flink SQL`, monitoring, etc.,
which greatly simplifies the daily operation of Flink tasks and maintenance. The ultimate goal is to create a one-stop big data platform,
which can provide a solution that integrates flow and batch, and integrates lake and warehouse.
This platform uses technologies including but not limited to:

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


Thanks for the respect given by the above excellent open source projects and many unmentioned excellent open source projects

## 👻 Why not ...❓

### Apache Zeppelin

[Apache Zeppelin](http://zeppelin.apache.org) is an excellent open source project that supports `Flink` well. `Zeppelin's` innovative `notebook` function allows developers to easily program `on-line` and submit tasks quickly. At the language level, Zeppelin supports `java`,
`scala`, and `python` at the same time.Whether it is a DataStream task or a Flink SQL task, most tasks will go through the development stage, the testing stage, the packaging stage, the uploading server stage, and the starting task stage，
this is a process with a long link, the whole process takes a long time, and the user experience is very unfriendly: even if a symbol is modified, the task has to go through the above process from the completion of the modification to the launch.
We expect these steps could be completed by One-click solution—moving the mouse and have at least one task list, which can manage tasks conveniently、could clearly see which tasks are running, which tasks are stopped、the resource consumption of each task、one-click start or stop tasks and manage savePoint automatically.

These problems are also problems that developers will encounter in actual development. `StreamPark-console` can solve these pain points very well. It is positioned as a one-stop real-time data platform and has more exciting functions (such as `Flink SQL WebIDE`, `dependency isolation`, `task rollback`, `flame graph`, `etc.`)

### FlinkX

[FlinkX](http://github.com/DTStack/flinkx)  is a distributed data synchronization tool based on Flink,
which realizes efficient data migration between various heterogeneous data sources, and its positioning is relatively clear - it is specially used for data extraction and migration.
It could be used as a service component. StreamPark focuses on the management of the development stage and the post-task stage,
the positioning is different. The StreamPark-pump module is also being planned. It is wished to solve data source extraction and migration problem, and will eventually be integrated into the StreamPark-console.

