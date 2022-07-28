---
id: '5-elasticsearch'
title: 'Elasticsearch'
sidebar_position: 5
---

## 介绍

支持：

* Sink: Batch 
* Sink: Streaming Append & Upsert Mode

Elasticsearch 连接器允许将数据写入到 Elasticsearch 引擎的索引中。

连接器可以工作在 upsert 模式下，使用 DDL 中定义的主键与外部系统交换 **UPDATE/DELETE** 消息。

如果 DDL 中没有定义主键，则连接器只能工作在 append 模式，只能与外部系统交换 **INSERT** 消息。

## 依赖

为了使用Elasticsearch连接器，以下依赖项对于使用自动化构建工具(如Maven或SBT)的项目和带有SQL JAR包的SQL Client都是必需的。

**6.x**	

```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-connector-elasticsearch6_2.11</artifactId>
  <version>1.13.0</version>
</dependency>	
```

**7.x and later versions**

```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-connector-elasticsearch7_2.11</artifactId>
  <version>1.13.0</version>
</dependency>
```

注意自己使用的 flink 和 scala 版本。

## 创建 Elasticsearch 表

以下示例展示如何创建 Elasticsearch sink 表：

```sql
CREATE TABLE myUserTable (
    user_id STRING,
    user_name STRING
    uv BIGINT,
    pv BIGINT,
    PRIMARY KEY (user_id) NOT ENFORCED
) WITH (
    'connector' = 'elasticsearch-7',
    'hosts' = 'http://localhost:9200',
    'index' = 'users'
);
```

## 连接器参数

| 参数                                                        | 	是否必选      | 	从 flink-1.15.x 开始支持<br/>是否可传递 | 	默认值                                                  | 	数据类型       | 	描述                                                                                                                                                                                                       |
|:----------------------------------------------------------|:-----------|:-------------------------------|:------------------------------------------------------|:------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| connector                                                 | 	必选	       | 否	                             | (none)                                                | 	String	    | 指定要使用的连接器，有效值为：<br/>**elasticsearch-6**：连接到 Elasticsearch 6.x 的集群。<br/>**elasticsearch-7**：连接到 Elasticsearch 7.x 及更高版本的集群。                                                                                |
| hosts	                                                    | 必选	        | 是	                             | (none)                                                | 	String	    | 要连接到的一台或多台 Elasticsearch 主机，例如 **http://host_name:9092;http://host_name:9093**。                                                                                                                           |
| index	                                                    | 必选	        | 是	                             | (none)                                                | 	String     | 	Elasticsearch 中每条记录的索引。可以是一个静态索引（例如 **myIndex**）或一个动态索引（例如 **index-{log_ts&#124;yyyy-MM-dd}**）。 更多详细信息，请参见下面的动态索引部分。                                                                                     |
| document-type                                             | 	6.x 版本中必选 | 	**6.x**：是                     | 	(none)	                                              | String	     | Elasticsearch 文档类型。在 elasticsearch-7 中不再需要。                                                                                                                                                               |
| document-id.key-delimiter	                                | 可选	        | 是                              | 	_	                                                   | String	     | 复合键的分隔符（默认为**_**），例如，指定为**$**将导致文档 ID 为**KEY1$KEY2$KEY3**。                                                                                                                                                |
| username	                                                 | 可选	        | 是	                             | (none)                                              	 | String	     | 用于连接 Elasticsearch 实例的用户名。请注意，Elasticsearch 没有预绑定安全特性，但你可以通过如下指南启用它来保护 Elasticsearch 集群。                                                                                                                  |
| password	                                                 | 可选	        | 是	                             | (none)                                              	 | String	     | 用于连接 Elasticsearch 实例的密码。如果配置了username，则此选项也必须配置为非空字符串。                                                                                                                                                   |
| failure-handler	                                          | 可选	        | 是	                             | fail	                                                 | String	     | 对 Elasticsearch 请求失败情况下的失败处理策略。有效策略为：<br/>**fail**：如果请求失败并因此导致作业失败，则抛出异常。<br/>**ignore**：忽略失败并放弃请求。<br/>**retry-rejected**：重新添加由于队列容量饱和而失败的请求。<br/>**自定义类名称**：使用 `ActionRequestFailureHandler` 的子类进行失败处理。 |
| sink.flush-on-checkpoint	                                 | 可选		       |                                | true	                                                 | Boolean     | 	是否在 checkpoint 时执行 flush。禁用后，在 checkpoint 时 sink 将不会等待所有的 pending 请求被 Elasticsearch 确认。因此，sink 不会为请求的 **at-least-once** 交付提供任何有力保证。                                                                      |                                                                                                                                                                                                           |
| sink.bulk-flush.max-actions	                              | 可选	        | 是	                             | 1000	                                                 | Integer     | 	每个批量请求的最大缓冲操作数。 可以设置为**0**来禁用它。                                                                                                                                                                          |
| sink.bulk-flush.max-size	                                 | 可选         | 	是                             | 	2mb                                                  | 	MemorySize | 	每个批量请求的缓冲操作在内存中的最大值。单位必须为 **MB**。 可以设置为**0**来禁用它。                                                                                                                                                        |
| sink.bulk-flush.interval                                  | 	可选	       | 是	                             | 1s                                                    | 	Duration	  | flush 缓冲操作的间隔。 可以设置为**0**来禁用它。注意，**sink.bulk-flush.max-size**和**sink.bulk-flush.max-actions**都设置为**0**的这种 flush 间隔设置允许对缓冲操作进行完全异步处理。                                                                      |
| sink.bulk-flush.backoff.strategy	                         | 可选         | 	是	                            | DISABLED	                                             | String      | 	指定在由于临时请求错误导致任何 flush 操作失败时如何执行重试。有效策略为：<br/>**DISABLED**：不执行重试，即第一次请求错误后失败。<br/>**CONSTANT**：以指定的重试延迟时间间隔来进行重试。<br/>**EXPONENTIAL**：先等待回退延迟，然后在重试之间指数递增延迟时间。                                            |
| sink.bulk-flush.backoff.max-retries	                      | 可选         | 	是	                            | **flink-1.13.x**：8<br/>**flink-1.15.x**：(none)	       | Integer     | 	最大回退重试次数。                                                                                                                                                                                                |
| sink.bulk-flush.backoff.delay	                            | 可选	        | 是	                             | **flink-1.13.x**：50ms<br/>**flink-1.15.x**：(none)	    | Duration	   | 每次回退尝试之间的延迟。对于 **CONSTANT** 回退策略，该值是每次重试之间的延迟。对于 **EXPONENTIAL** 回退策略，该值是初始的延迟。                                                                                                                           |
| **在 flink-1.15.x 中被删除**<br/>connection.max-retry-timeout	 | 可选         | 	是	                            | (none)	                                               | Duration    | 	最大重试超时时间。                                                                                                                                                                                                |                                                                                                                                                                                                           |
| connection.path-prefix	                                   | 可选         | 	是	                            | (none)	                                               | String	     | 添加到每个 REST 通信中的前缀字符串，例如，**/v                                                                                                                                                                              |1**。                                                                                                                                                                 |
| **从 Flink-1.15.x 开始支持**<br/>connection.request-timeout    | 	可选        | 	是	                            | (none)	                                               | Duration    | 	请求连接的超时时间，单位：毫秒，数值必须大于等于0。设置为**0**，表示超时时间无限大。                                                                                                                                                            |
| **从 Flink-1.15.x 开始支持**<br/>connection.timeout            | 可选         | 	是	                            | (none)                                                | 	Duration	  | 建立连接使用的超时时间，单位：毫秒，数值必须大于等于0。设置为**0**，表示超时时间无限大。                                                                                                                                                           |
| **从 Flink-1.15.x 开始支持**<br/>socket.timeout                | 	可选        | 	是	                            | (none)	                                               | Duration	   | socket 等待数据的超时时间（SO_TIMEOUT），换句话说，两个连续数据包之间不活跃的最大时间，数值必须大于等于0。设置为**0**，表示超时时间无限大。                                                                                                                         |
| format	                                                   | 可选         | 	否	                            | json	                                                 | String      | 	Elasticsearch 连接器支持指定格式。该格式必须生成一个有效的 json 文档。 默认使用内置的 **json** 格式。更多详细信息，请参阅 JSON Format 页面。                                                                                                             |

## 特性

### Key 处理

Elasticsearch sink 可以根据是否定义了主键来确定是在 `upsert` 模式还是 `append` 模式下工作。 
如果定义了主键，Elasticsearch sink 将以 `upsert` 模式工作，该模式可以消费包含 **UPDATE/DELETE** 的消息。 如果未定义主键，Elasticsearch sink 将以 `append` 模式工作，该模式只能消费包含 **INSERT** 的消息。

在 Elasticsearch 连接器中，主键用于计算 Elasticsearch 的文档 id，文档 id 为最多 **512** 字节且不包含空格的字符串。 
Elasticsearch 连接器通过使用 **document-id.key-delimiter** 指定的键分隔符按照 `DDL` 中定义的顺序连接所有主键字段，为每一行记录生成一个文档 ID 字符串。 
某些类型不允许作为主键字段，因为它们没有对应的字符串表示形式，例如，**BYTES**，**ROW**，**ARRAY**，**MAP** 等。 如果未指定主键，Elasticsearch 将自动生成文档 id。

有关 `PRIMARY KEY` 语法的更多详细信息，请参见 [CREATE TABLE DDL](../syntax/4-create)。

### 动态索引

Elasticsearch sink 同时支持静态索引和动态索引。

如果想使用静态索引，则 index 选项值应为纯字符串，例如 **myusers**，所有记录都将被写入到 **myusers** 索引中。

如果想使用动态索引，你可以使用 {field_name} 来引用记录中的字段值来动态生成目标索引。 
你也可以使用 **{field_name|date_format_string}** 将 **TIMESTAMP/DATE/TIME** 类型的字段值转换为 **date_format_string** 指定的格式。 

**date_format_string** 与 Java 的 **DateTimeFormatter** 兼容。 
例如，如果选项值设置为 **myusers-{log_ts|yyyy-MM-dd}**，则 `log_ts` 字段值为 **2020-03-27 12:25:55** 的记录将被写入到 **myusers-2020-03-27** 索引中。

## 数据类型映射

Elasticsearch 将文档存储在 JSON 字符串中。因此数据类型映射介于 Flink 数据类型和 JSON 数据类型之间。 
Flink 为 Elasticsearch 连接器使用内置的 **json** 格式。更多类型映射的详细信息，请参阅 [JSON Format](../format/3-json) 页面。
