---
id: '1-introduce'
title: 'Introduction'
sidebar_position: 1
---

## 概述

`Flink Table API`和`SQL`允许用户使用函数对数据进行转换处理。

## 函数类型

在Flink中有两个维度可以对函数进行分类。

一个维度是`系统(或内置)`函数和`catalog`函数。系统函数没有命名空间，可以直接使用它们的名字来引用。
`catalog`函数属于指定`catalog`和`数据库`，因此它们具有`catalog`和数据库命名空间，它们可以通过完全/部分限定名（`catalog.db.func` 或 `db.func`）或只使用函数名。

另一个维度是`临时函数`和`持久函数`。临时函数是不稳定的，只能在会话的生命周期内使用，它们总是由用户创建的。持久函数存在于会话的整个生命周期中，它们要么由系统提供，要么在catalog中持久存在。

这两个维度为Flink用户提供了4种函数：

* Temporary system functions
* System functions
* Temporary catalog functions
* Catalog functions

## 使用函数

在Flink中，用户可以通过两种方式使用函数：`精确使用函数`或`模糊使用函数`。

### 精确使用

精确的函数使用户能够跨`catalog`和跨数据库使用catalog函数，例如`select mycatalog.mydb.myfunc(x) from mytable`
和 `select mydb.myfunc(x) from mytable`.。

从Flink 1.10开始支持。

### 模糊使用

在模糊函数使用中，用户只需要在SQL查询中指定函数名，例如`select myfunc(x) from mytable`。

## 函数解析顺序

当有不同类型但名称相同的函数时，需要注意函数的解析顺序。例如，当有三个函数都命名为“myfunc”，但分别是临时catalog、catalog和系统函数。如果没有函数名冲突，函数将被解析为唯一的一个。

### 精确函数解析

因为系统函数没有名称空间，所以Flink中的精确函数引用必定指向临时catalog函数或catalog函数。

解析顺序:

* Temporary catalog function
* Catalog function

### 模糊函数解析

解析顺序：

* Temporary system function
* System function
* Temporary catalog function，在会话的当前catalog和当前数据库中。
* Catalog function，在会话的当前catalog和当前数据库中。