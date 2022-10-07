---
id: '1-introduce'
title: 'Introduction'
sidebar_position: 1
---

## 版本说明

本文档适用于`平台1.2.4`及以上版本，并且里面介绍的各种`flink sql`的语法基于`flink-1.13.x`，flink版本低于1.13.x的用户，在sql运行出错误时，
需要自行去[flink官网](https://nightlies.apache.org/flink/flink-docs-release-1.12/dev/table/sql/)查看对应版本的语法支持。

另外，flink新版本支持的语法，文档中会进行特殊标注，说明对应语法在 flink 哪个版本开始支持，但凡是没有特殊标注的，均支持`flink-1.13.x`及以上版本。

## 其他

### 技术

注意，在 flink sql 中，对表名、字段名、函数名等是严格区分大小写的，为了兼容 hive 等其他仓库，建议建表时，表名和字段名都采用下划线连接单词的方式，以避免大小写问题。

比如 hive ，是不区分大小写的，所有大写字母最终都会被系统转化为小写字母，此时使用 flink sql 去读写 hive ，出现大写字母时，会出现找不到表或字段的错误。

关键字是不区分大小写的，比如 insert、select、create等。

flink sql 中所有的字符串常量都需要使用英文单引号括起来，不要使用英文双引号以及中文符号。

### 平台

目前平台还不支持直接在`flink sql`中直接创建 hive 表之类的操作。如果需要读写 hive 表，建议是先在 hive 中直接创建好对应的表，然后再使用`flink sql`去读写 hive 表。
