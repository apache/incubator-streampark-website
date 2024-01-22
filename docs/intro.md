---
id: 'intro'
title: 'What is Apache StreamPark'
sidebar_position: 1
---

# Apache StreamPark™

make stream processing easier!!!

> An amazing framework makes stream processing easier.

## 🚀 What is Apache StreamPark™

`Apache StreamPark` is an easy-to-use stream processing application development framework and one-stop stream processing operation platform, Aimed at ease building and managing streaming applications, Apache StreamPark provides scaffolding for writing streaming process logics with Apache Flink and Apache Spark.
Apache StreamPark also provides a professional task management including task development, scheduling, interactive query, deployment, operation, maintenance, etc.



## Why Apache StreamPark™

Apache Flink and Apache Spark are widely used as the next generation of big data streaming computing engines.  Based on a bench of excellent experiences combined with best practices, we extracted the task deployment and runtime parameters into the configuration files. In this way,  an easy-to-use RuntimeContext with out-of-the-box connectors would bring easier and more efficient task development experience. It reduces the learning cost and development barriers, hence developers can focus on the business logic.
On the other hand, It can be challenge for enterprises to use Flink & Spark if there is no professional management platform for Flink & Spark tasks during the deployment phase. Apache StreamPark provides such a professional task management platform, including task development, scheduling, interactive query, deployment, operation, maintenance, etc.

## 🎉 Features
* Apache Flink & Apache Spark application development scaffold
* Support multiple versions of Flink & Spark
* Wide range of out-of-the-box connectors
* One-stop stream processing operation platform
* Support catalog、olap、streaming-warehouse etc.
* ...

## 🏳‍🌈 Architecture of Apache StreamPark™

The overall architecture of Apache StreamPark is shown in the following figure. Apache StreamPark consists of three parts, they are Apache StreamPark-core and Apache StreamPark-console.

![Apache StreamPark Archite](/doc/image_en/streampark_archite.png)

### 1️⃣ Apache StreamPark-core

The positioning of `Apache StreamPark-core` is a framework uesd while developing, it focuses on coding development, regulates configuration files, and develops in the convention over configuration guide.
Apache StreamPark-core provides a development-time RunTime Content and a series of out-of-the-box Connectors. Cumbersome operations are simplified by extending `DataStream-related` methods and integrating DataStream and `Flink sql` api .
development efficiency and development experience will be highly improved because users can focus on the business.

### 2️⃣ Apache StreamPark-console

`Apache StreamPark-console` is a comprehensive real-time `low code` data platform that can manage `Flink` tasks more convenient.
It integrates the experience of many best practices and integrates many functions such as project compilation, release,
parameter configuration, startup, `savepoint`, `flame graph`, `Flink SQL`, monitoring, etc.,
which greatly simplifies the daily operation of Flink tasks and maintenance. The ultimate goal is to create a one-stop big data platform,
which can provide a solution that integrates flow and batch, and integrates lake and warehouse.
This platform uses technologies including but not limited to:

* [Apache Flink](http://flink.apache.org)
* [Apache Spark](http://spark.apache.org)
* [Apache YARN](http://hadoop.apache.org)
* [Spring Boot](https://spring.io/projects/spring-boot/)
* [Mybatis](http://www.mybatis.org)
* [Mybatis-Plus](http://mp.baomidou.com)
* [Vue](https://cn.vuejs.org/)
* [VuePress](https://vuepress.vuejs.org/)
* [Ant Design of Vue](https://antdv.com/)
* [ANTD PRO VUE](https://pro.antdv)
* [xterm.js](https://xtermjs.org/)
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* ...

Thanks for the respect given by the above excellent open source projects and many unmentioned excellent open source projects
