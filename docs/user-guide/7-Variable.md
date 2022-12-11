---
id: 'Variable'
title: 'Variable management'
sidebar_position: 7
---

## Background Introduction

In the actual production environment, Flink jobs are generally complex, and usually require multiple external components. For example, Flink jobs consume data from Kafka, then connect external components such as HBase or Redis to obtain additional business information, and then write it to the downstream external components. There are the following problems.

- The connection information of external components, such as IP, port and user password, needs to be configured in the application args and transferred to the Flink job, 
  so that the connection information of external components is distributed in multiple applications. Once the connection information of external components changes, 
  many application args parameters need to be modified, which will lead to high operation and maintenance costs.
- There are many people in the team developing real-time computing jobs. There is no uniform specification for the connection information of the external components passed to the job, 
  resulting in different parameter names of the same component. This is difficult to count which external components are dependent.
- In production practice, there are usually multiple sets of environments, such as test environment and 
  production environment. It is not intuitive to judge whether a component belongs to a test environment or 
  a production environment simply through IP and ports. Even if it can be judged, there are some omissions. 
  In this way, the connection information online to the production environment may be external components of the test environment, 
  or components of the production environment are inadvertently configured during testing, leading to production failures.

## Create Variable

Variables are isolated between teams, there are independent variables under different teams, so you need to choose which Team to create variables before creating, 
Here we choose the default team, and then click the `Add New` button to start creating variables.

<img src="/doc/image/variable/create_variable.png"/><br></br>

If the value of the variable is sensitive, such as a database password, you can turn on the `Desensitization` option when creating the variable, then the value of the variable will be displayed with `********` instead.

<img src="/doc/image/variable/create_variable_desensitization.png"/><br></br><br></br>

<img src="/doc/image/variable/variable_list.png"/><br></br>

## Reference variables in Flink SQL

The variables that have been created can be referenced in Flink SQL as `${kafka.cluster}`, and support follow-up searches.

<img src="/doc/image/variable/variable_flinksql_search.png"/><br></br><br></br>

<img src="/doc/image/variable/variable_flinksql_quote.png"/><br></br><br></br>

You can click the `Preview` button to view the value of the real variable. If this variable is set as desensitized, the value of the variable will be displayed as `********`.

<img src="/doc/image/variable/variable_flinksql_preview.png"/><br></br>

## Reference variables in args of Flink JAR jobs

Variables can also be referenced in the args of a Flink JAR job and support follow-up searches.

<img src="/doc/image/variable/variable_flinkjar_queto.png"/><br></br><br></br>

<img src="/doc/image/variable/variable_flinkjar_preview.png"/><br></br>
