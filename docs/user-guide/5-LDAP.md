---
id: 'LDAP'
title: 'LDAP Quick Tutorial'
sidebar_position: 5
---

## LDAP Introduction

LDAP (Light Directory Access Portocol), which is a lightweight directory access protocol based on the X.500 standard.

A directory is a database optimized for querying, browsing and searching that organizes data in a tree-like structure, similar to a file directory.

LDAP directory service is a system consisting of a directory database and a set of access protocols.

## Why use LDAP?

When we have more than one daily office system, each system has a different account password, the password is too much to remember which system the password corresponds to, when the new system development is not to create a new set of account password?

LDAP unified authentication service is used to solve the above problems.

## Configuring LDAP

### 1.Official website to download the binary installation package

https://github.com/apache/incubator-streampark/releases

### 2.Add LDAP configuration
```
cd streampark
cd conf
vim application
```

```
ldap:
  ## This value is the domain name required for company LDAP user login
  urls: ldap://99.99.99.99:389
  username: cn=Manager,dc=streampark,dc=com
  password: streampark
  ## DN distinguished name
  embedded:
    base-dn: dc=streampark,dc=com
  user:
    ## Key values for search filtering
    identity:
      attribute: cn
    ## User matches the Key value of the user's mailbox
    email:
      attribute: mail
```