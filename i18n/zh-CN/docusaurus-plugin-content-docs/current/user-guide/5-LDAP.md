---
id: 'LDAP'
title: 'LDAP 快速使用教程'
sidebar_position: 5
---

## LDAP简介

LDAP（Light Directory Access Portocol），它是基于X.500标准的轻量级目录访问协议。

目录是一个为查询、浏览和搜索而优化的数据库，它成树状结构组织数据，类似文件目录一样。

LDAP目录服务是由目录数据库和一套访问协议组成的系统。

## 为什么使用LDAP?

当我们日常的办公系统有多个，每套系统都有不同的账号密码，密码多了想不起来密码对应的是哪个系统，当新系统开发时是不是还要再新建一套账号密码？

LDAP统一认证服务用来解决以上的问题。

## 配置LDAP

### 1.官网下载二进制安装包

https://github.com/apache/incubator-streampark/releases

### 2.增加LDAP配置
```
cd streampark
cd conf
vim application
```

```
ldap:
  ## 该值为公司LDAP用户登录需要的域名
  urls: ldap://99.99.99.99:389
  ## 用户名
  username: cn=Manager,dc=streampark,dc=com
  ## 密码
  password: streampark
  ## DN 分辨名
  embedded:
    base-dn: dc=streampark,dc=com
  user:
    ## 用于搜索过滤的Key值
    identity:
      attribute: cn
    ## 用户匹配用户的邮箱的Key值
    email:
      attribute: mail
```