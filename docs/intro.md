---
id: 'intro'
title: 'What is Apache StreamPark™'
sidebar_position: 1
---

# Apache StreamPark™

Make stream processing easier!

## 🚀 What is Apache StreamPark™

`Apache StreamPark` is an easy-to-use stream processing application development framework and one-stop stream processing operation platform. Aimed to make it easy to build and manage streaming applications, StreamPark provides scaffolding for writing streaming process logic with Apache Flink and Apache Spark.

StreamPark also provides a professional task management module including task development, scheduling, interactive queries, deployment, operations, and maintenance.

## Why Apache StreamPark™?

Apache Flink and Apache Spark are widely used as the next generation of big data streaming computing engines. Based on a foundation of excellent experiences combined with best practices, we extracted the task deployment and runtime parameters into the configuration files. In this way, an easy-to-use `RuntimeContext` with out-of-the-box connectors can bring an easier and more efficient task development experience. It reduces the learning cost and development barriers, so developers can focus on the business logic.

On the other hand, It can be challenge for enterprises to use Flink & Spark if there is no professional management platform for Flink & Spark tasks during the deployment phase. StreamPark provides such a professional task management platform as described above.

## 🎉 Features

* Apache Flink & Apache Spark application development scaffold
* Supports multiple versions of Flink & Spark
* Wide range of out-of-the-box connectors
* One-stop stream processing operation platform
* Supports catalog、olap、streaming-warehouse, etc.

## 🏳‍🌈 Architecture of Apache StreamPark™

The overall architecture of Apache StreamPark is shown in the following figure. Apache StreamPark has two parts, `streampark-core` and `streampark-console`.

![StreamPark Archite](/doc/image_en/streampark_archite.png)

### 1️⃣ streampark-core

`streampark-core` is a framework uesd during development. It supports on coding development, regulates configuration files, and follows the 'convention over configuration' guide.

`streampark-core` provides development-time RunTime Content and a series of out-of-the-box Connectors. Cumbersome operations are simplified by extending DataStream-related methods and integrating DataStream and the Flink SQL API. This improves development efficiency and developer experience, because users can focus on the business logic.

### 2️⃣ streampark-console

`streampark-console` is a comprehensive real-time Low Code data platform that can manage Flink tasks more convenient.
It integrates the experience of many best practices and integrates many functions such as project compilation, release,
parameter configuration, startup, savepoint, flame graph, Flink SQL, monitoring, etc., which greatly simplifies the daily operation of Flink tasks and maintenance. The ultimate goal is to create a one-stop big data platform, which can provide a solution that integrates flow and batch, and integrates lake and warehouse.

This platform uses technologies including, but not limited to:

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
  
Thanks for the support and inspiration given by the above excellent open source projects and many other excellent open source projects not mentioned here!
