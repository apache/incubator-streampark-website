---
id: 'hadoop-resource-integration'
title: 'Hadoop resource integration'
sidebar_position: 3
---

## Using Hadoop resource in K8s


To use Hadoop resource  in StreamPark Flink-K8s runtime such as write/read hive、mount checkpoint at HDFS and son on,  User should make Flink Base Docker Image which contains:

*  Hadoop Lib, which is set as  `HADOOP_CLASSPATH`;
*  Hadoop Config，which is set as  `HADOOP_CONF_DIR`;
*  Hive Config if used;
<br/>

In next version, automatic integration for hadoop will be supported.

