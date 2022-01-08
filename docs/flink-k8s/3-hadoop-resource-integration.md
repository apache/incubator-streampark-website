---
title: 'Hadoop 资源集成'
sidebar: true
author: 'Al-assad'
original: true
time: 2021/09/27
---

## 在 K8s 上使用 Hadoop 资源

在 StreamX Flink-K8s runtime 下使用 Hadoop 资源，如 checkpoint 挂载 HDFS、读写 Hive 等，目前用户需要自行构建相关 Flink Base   Docker Image，Image 中需要包含以下内容：

* 包含 Hadoop Lib， 并设置 `HADOOP_CLASSPATH` 到该目录；
* 包含 Hadoop Config，并设置 `HADOOP_CONF_DIR` 到该目录；
* 如果使用 Hive， 需要包含 Hive Config；

<br/>

这其实挺不优雅的 🥲，我们将在随后的版本里支持**自动集成 Hadoop** 的功能支持， Plz look forward to !

