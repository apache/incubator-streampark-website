---
id: 'intro'
title: 'What is StreamX'
sidebar_position: 1
---

# StreamX
make stream processing easier!!!

> An amazing framework makes stream processing easier.

## 🚀 What is StreamX

`StreamX` is an easy-to-use and comprehensive one-stop stream processing framework with a visual interface platform based on the web,
it is characterized by simplicity, fast, and convenience. The entire process of stream processing tasks will be extremely convenient by using StreamX,
which includes configuration, development, testing, deployment, monitoring, operation, and maintenance. 
It not only simplifies the process of developing streaming tasks through a well-designed programming model but also supports complex projects and a large number of task management.


<video src="http://assets.streamxhub.com/streamx-video.mp4" controls="controls" width="100%" height="100%"></video>

## Why StreamX

StreamX standardizes the entire process of a project from configuration to development, testing, 
deployment, monitoring, and operation and maintenance. It encourages functional programming, 
defines the best programming method, and provides a series of out-of-the-box Connectors. Moreover, 
StreamX provides two sets of APIs: scala and java.

Based on this, StreamX makes developers only need to care about the core business part with low learning cost and low development requirements.

## 🎉 Features
*Excellent development assistance framework 
* Supports multiple versions of Flink (1.11,x, 1.12.x, 1.13 )
* A range of out-of-the-box connectors 
* Support project compilation(maven)
* Configuration parameters online 
* Support to start in  Applicaion mode and Yarn-Per-Job mode 
* Quick and easy routine operations (task start, stop, savepoint, resume from savepoint)
* Support flame graphs 
* Support Notebook (Development online )
* Project configuration and dependencies could be managed by version 
* Support task backup and rollback (configuration rollback)
* Management of dependencies (maven pom) and custom jars online 
* Support custom udf, connector, etc. 
* Flink SQL Web IDE
* Support catalog、hive 
* Send an alert email when the task fails to run 
* Support restart and retry when the task fails 
* Full link support from task development stage to deployment management
* ...

## 🏳‍🌈 Architecture of StreamX

The overall architecture of StreamX is shown in the following figure. Streamx consists of three parts, they are streamx-core, streamx-pump, and streamx-console.

![Streamx Archite](/doc/image/streamx_archite.png)

### 1️⃣ streamx-core

The positioning of `streamx-core` is a framework uesd while developing, it focuses on coding development, regulates configuration files, and develops in the convention over configuration guide.
streamx-core provides a development-time RunTime Content and a series of out-of-the-box Connectors. Cumbersome operations are simplified by extending `DataStream-related` methods and integrating DataStream and `Flink sql` api .
development efficiency and development experience will be highly improved because users can focus on the business.

### 2️⃣ streamx-pump

`streamx-pump` is a component similar to `flinkx` which is used for data extraction. It is developed based on various connectors provided in `streamx-core` and will be integrated into `streamx-console`. 
The purpose of developing streamx-pump is to create a convenient, fast, out-of-the-box extraction and migration component for real-time big data. We expect it could solve the real-time data source fetching problem.
`streamx-pump` is still in planning.

### 3️⃣ streamx-console

`streamx-console` is a comprehensive real-time `low code` data platform that can manage `Flink` tasks more convenient. 
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


Thanks for the respect given by the above excellent open source projects and many unmentioned excellent open source projects, 
especially appreciate the support provided by Apache [Apache Zeppelin](http://zeppelin.apache.org) and [IntelliJ IDEA](https://www.jetbrains.com/idea/) for their support,
and  inspiration and help given by fire-spark project in early stage.

## 👻 Why not ...❓

### Apache Zeppelin

[Apache Zeppelin](http://zeppelin.apache.org) is an excellent open source project that supports `Flink` well. `Zeppelin's` innovative `notebook` function allows developers to easily program `on-line` and submit tasks quickly. At the language level, Zeppelin supports `java`, 
`scala`, and `python` at the same time.Whether it is a DataStream task or a Flink SQL task, most tasks will go through the development stage, the testing stage, the packaging stage, the uploading server stage, and the starting task stage，
this is a process with a long link, the whole process takes a long time, and the user experience is very unfriendly: even if a symbol is modified, the task has to go through the above process from the completion of the modification to the launch. 
We expect these steps could be completed by One-click solution—moving the mouse and have at least one task list, which can manage tasks conveniently、could clearly see which tasks are running, which tasks are stopped、the resource consumption of each task、one-click start or stop tasks and manage savePoint automatically.

These problems are also problems that developers will encounter in actual development. `streamx-console` can solve these pain points very well. It is positioned as a one-stop real-time data platform and has more exciting functions (such as `Flink SQL WebIDE`, `dependency isolation`, `task rollback`, `flame graph`, `etc.`)

### FlinkX

[FlinkX](http://github.com/DTStack/flinkx)  is a distributed data synchronization tool based on Flink, 
which realizes efficient data migration between various heterogeneous data sources, and its positioning is relatively clear - it is specially used for data extraction and migration.
It could be used as a service component. StreamX focuses on the management of the development stage and the post-task stage, 
the positioning is different. The streamx-pump module is also being planned. It is wished to solve data source extraction and migration problem, and will eventually be integrated into the streamx-console.

