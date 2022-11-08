---
id: 'Elasticsearch-Connector'
title: 'Elasticsearch Connector'
sidebar_position: 5
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Elasticsearch](https://www.elastic.co/cn/elasticsearch/) 是一个分布式、RESTful 风格的搜索和数据分析引擎。
[Flink 官方](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/)提供了[Elasticsearch](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/elasticsearch/)的连接器,用于向 elasticsearch 中写入数据,可提供 **至少一次** 的处理语义

ElasticsearchSink 使用 TransportClient（6.x 之前）或者 RestHighLevelClient（6.x 开始）和 Elasticsearch 集群进行通信，
`StreamPark`对 flink-connector-elasticsearch6 进一步封装，屏蔽开发细节，简化Elasticsearch6及以上的写入操作。

:::tip 提示
因为Flink Connector Elasticsearch 不同版本之间存在冲突`StreamPark`暂时仅支持Elasticsearch6及以上的写入操作，如需写入Elasticsearch5需要使用者排除
flink-connector-elasticsearch6 依赖，引入 flink-connector-elasticsearch5依赖 创建
org.apache.flink.streaming.connectors.elasticsearch5.ElasticsearchSink 实例写入数据。
:::

## Elasticsearch 写入依赖
Elasticsearch 版本不同依赖 Flink Connector Elasticsearch 不同,以下信息来源[flink-docs-release-1.14文档](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/connectors/datastream/elasticsearch/):
Elasticsearch 5.x Maven依赖
```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-elasticsearch5_2.11</artifactId>
    <version>1.14.3</version>
</dependency>
```
Elasticsearch 6.x Maven依赖
```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-elasticsearch6_2.11</artifactId>
    <version>1.14.3</version>
</dependency>
```
Elasticsearch 7.x及以上 Maven依赖
```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-elasticsearch7_2.11</artifactId>
    <version>1.14.3</version>
</dependency>
```

## 基于官网的Elasticsearch写入数据
以下代码摘自[官方文档](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/elasticsearch/#elasticsearch-sink)


<Tabs>
<TabItem value="java, Elasticsearch 6.x 及以上" java>

```java
import org.apache.flink.api.common.functions.RuntimeContext;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.connectors.elasticsearch.ElasticsearchSinkFunction;
import org.apache.flink.streaming.connectors.elasticsearch.RequestIndexer;
import org.apache.flink.streaming.connectors.elasticsearch6.ElasticsearchSink;

import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Requests;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

DataStream<String> input = ...;

List<HttpHost> httpHosts = new ArrayList<>();
httpHosts.add(new HttpHost("127.0.0.1", 9200, "http"));
httpHosts.add(new HttpHost("10.2.3.1", 9200, "http"));

// 使用 ElasticsearchSink.Builder 创建 ElasticsearchSink
ElasticsearchSink.Builder<String> esSinkBuilder = new ElasticsearchSink.Builder<>(
    httpHosts,
    new ElasticsearchSinkFunction<String>() {
        public IndexRequest createIndexRequest(String element) {
            Map<String, String> json = new HashMap<>();
            json.put("data", element);

            return Requests.indexRequest()
                    .index("my-index")
                    .type("my-type")
                    .source(json);
        }

        @Override
        public void process(String element, RuntimeContext ctx, RequestIndexer indexer) {
            indexer.add(createIndexRequest(element));
        }
    }
);

// 批量请求的配置；下面的设置使 sink 在接收每个元素之后立即提交，否则这些元素将被缓存起来
esSinkBuilder.setBulkFlushMaxActions(1);

// 为内部创建的 REST 客户端提供一个自定义配置信息的 RestClientFactory
esSinkBuilder.setRestClientFactory(
  restClientBuilder -> {
    restClientBuilder.setDefaultHeaders(...)
    restClientBuilder.setMaxRetryTimeoutMillis(...)
    restClientBuilder.setPathPrefix(...)
    restClientBuilder.setHttpClientConfigCallback(...)
  }
);

// 最后，构建并添加 sink 到作业管道中
input.addSink(esSinkBuilder.build());
```

</TabItem>

<TabItem value="scala, Elasticsearch 6.x 及以上" >

```scala

import org.apache.flink.api.common.functions.RuntimeContext
import org.apache.flink.streaming.api.datastream.DataStream
import org.apache.flink.streaming.connectors.elasticsearch.ElasticsearchSinkFunction
import org.apache.flink.streaming.connectors.elasticsearch.RequestIndexer
import org.apache.flink.streaming.connectors.elasticsearch6.ElasticsearchSink

import org.apache.http.HttpHost
import org.elasticsearch.action.index.IndexRequest
import org.elasticsearch.client.Requests

import java.util.ArrayList
import java.util.List

val input: DataStream[String] = ...

val httpHosts = new java.util.ArrayList[HttpHost]
httpHosts.add(new HttpHost("127.0.0.1", 9200, "http"))
httpHosts.add(new HttpHost("10.2.3.1", 9200, "http"))

val esSinkBuilder = new ElasticsearchSink.Builder[String](
  httpHosts,
  new ElasticsearchSinkFunction[String] {
     def process(element: String, ctx: RuntimeContext, indexer: RequestIndexer) {
          val json = new java.util.HashMap[String, String]
          json.put("data", element)

          val rqst: IndexRequest = Requests.indexRequest
            .index("my-index")
            .`type`("my-type")
            .source(json)

          indexer.add(rqst)
     }
  }
)

// 批量请求的配置；下面的设置使 sink 在接收每个元素之后立即提交，否则这些元素将被缓存起来
esSinkBuilder.setBulkFlushMaxActions(1)

// 为内部创建的 REST 客户端提供一个自定义配置信息的 RestClientFactory
esSinkBuilder.setRestClientFactory(new RestClientFactory {
  override def configureRestClientBuilder(restClientBuilder: RestClientBuilder): Unit = {
       restClientBuilder.setDefaultHeaders(...)
       restClientBuilder.setMaxRetryTimeoutMillis(...)
       restClientBuilder.setPathPrefix(...)
       restClientBuilder.setHttpClientConfigCallback(...)
  }
})

// 最后，构建并添加 sink 到作业管道中
input.addSink(esSinkBuilder.build)
```

</TabItem>

</Tabs>

以上创建ElasticsearchSink添加参数非常的不灵敏。`StreamPark`使用约定大于配置、自动配置的方式只需要配置es
连接参数、flink运行参数，StreamPark 会自动组装source和sink，极大的简化开发逻辑，提升开发效率和维护性。

## StreamPark 写入 Elasticsearch

ESSink 在启用 Flink checkpoint 后，保证至少一次将操作请求发送到 Elasticsearch 集群。

### 1. 配置策略和连接信息

```yaml
#redis sink 配置
#  必填参数，多个节点使用 host1:port, host2:port,
host: localhost:9200
#  选填参数
#  es:
#    disableFlushOnCheckpoint: true #默认为false
#    auth:
#    user:
#      password:
#    rest:
#      max.retry.timeout:
#      path.prefix:
#      content.type:
#    connect:
#      request.timeout:
#      timeout:
#    cluster.name: elasticsearch
#  client.transport.sniff:
#  bulk.flush.:
```



### 2. 写入Elasticsearch

用 StreamPark 写入Elasticsearch非常简单,代码如下:

<Tabs>

<TabItem value="scala">

```scala
import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.sink.ESSink
import org.apache.streampark.flink.core.scala.util.ElasticSearchUtils
import org.apache.flink.api.scala._
import org.elasticsearch.action.index.IndexRequest
import org.json4s.DefaultFormats
import org.json4s.jackson.Serialization

import java.util.Date

object ConnectorApp extends FlinkStreaming {


  implicit lazy val formats: DefaultFormats.type = org.json4s.DefaultFormats

  override def handle(): Unit = {
    val ds = context.fromCollection(List(
      OrderEntity(1, 1, 11.3d, 3.1d, new Date()),
      OrderEntity(2, 1, 12.3d, 3.2d, new Date()),
      OrderEntity(3, 1, 13.3d, 3.3d, new Date()),
      OrderEntity(4, 1, 14.3d, 3.4d, new Date()),
      OrderEntity(5, 1, 15.3d, 7.5d, new Date()),
      OrderEntity(6, 1, 16.3d, 3.6d, new Date()),
      OrderEntity(7, 1, 17.3d, 3.7d, new Date())
    ))

    // es sink.........

    //1)定义 Index的写入规则
    implicit def indexReq(x: OrderEntity): IndexRequest = ElasticSearchUtils.indexRequest(
      "flink_order",
      "_doc",
      s"${x.id}_${x.time.getTime}",
      Serialization.write(x)
    )
    //3)定义esSink并下沉=数据. done
    ESSink().sink6[OrderEntity](ds)
  }


  case class OrderEntity(id: Int, num: Int, price: Double, gmv: Double, time: Date) extends Serializable

}
```
</TabItem>
</Tabs>

Flink ElasticsearchSinkFunction可以执行多种类型请求，如（DeleteRequest、 UpdateRequest、IndexRequest）,StreamPark也对以上功能进行了支持，对应方法如下：
```scala
import org.apache.streampark.flink.core.scala.StreamingContext
import org.apache.flink.streaming.api.datastream.DataStreamSink
import org.apache.flink.streaming.api.scala.DataStream
import org.apache.flink.streaming.connectors.elasticsearch.ActionRequestFailureHandler
import org.apache.flink.streaming.connectors.elasticsearch.util.RetryRejectedExecutionFailureHandler
import org.apache.flink.streaming.connectors.elasticsearch6.RestClientFactory
import org.elasticsearch.action.delete.DeleteRequest
import org.elasticsearch.action.index.IndexRequest
import org.elasticsearch.action.update.UpdateRequest

import java.util.Properties
import scala.annotation.meta.param


class ESSink(@(transient@param) context: StreamingContext,
             property: Properties = new Properties(),
             parallelism: Int = 0,
             name: String = null,
             uid: String = null) {

  /**
   * for ElasticSearch6
   *
   * @param stream
   * @param suffix
   * @param restClientFactory
   * @param failureHandler
   * @param f
   * @tparam T
   * @return
   */
  def sink6[T](stream: DataStream[T],
               suffix: String = "",
               restClientFactory: RestClientFactory = null,
               failureHandler: ActionRequestFailureHandler = new RetryRejectedExecutionFailureHandler)
              (implicit f: T => IndexRequest): DataStreamSink[T] = {

    new ES6Sink(context, property, parallelism, name, uid).sink[T](stream, suffix, restClientFactory, failureHandler, f)
  }



  def update6[T](stream: DataStream[T],
               suffix: String = "",
               restClientFactory: RestClientFactory = null,
               failureHandler: ActionRequestFailureHandler = new RetryRejectedExecutionFailureHandler)
              ( f: T => UpdateRequest): DataStreamSink[T] = {

    new ES6Sink(context, property, parallelism, name, uid).sink[T](stream, suffix, restClientFactory, failureHandler, f)
  }


  def delete6[T](stream: DataStream[T],
               suffix: String = "",
               restClientFactory: RestClientFactory = null,
               failureHandler: ActionRequestFailureHandler = new RetryRejectedExecutionFailureHandler)
              ( f: T => DeleteRequest): DataStreamSink[T] = {

    new ES6Sink(context, property, parallelism, name, uid).sink[T](stream, suffix, restClientFactory, failureHandler, f)
  }

}
```


:::info 注意事项
启用 Flink checkpoint 后，Flink Elasticsearch Sink 保证至少一次将操作请求发送到 Elasticsearch 集群。 这是通过在进行 checkpoint 时等待 BulkProcessor 中所有挂起的操作请求来实现。 这有效地保证了在触发 checkpoint 之前所有的请求被 Elasticsearch 成功确认，然后继续处理发送到 sink 的记录。
用户想要禁用刷新，可以配置disableFlushOnCheckpoint为true来实现，实质上意味着 sink 将不再提供任何可靠的交付保证，即使启用了作业拓扑的 checkpoint。
:::

## 其他配置
### 处理失败的 Elasticsearch 请求
Elasticsearch 操作请求可能由于多种原因而失败，可以通过实现ActionRequestFailureHandler来指定失败处理逻辑，见
[官方文档](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/elasticsearch/#elasticsearch-sink)**处理失败的 Elasticsearch 请求** 单元
### 配置内部批量处理器
es内部`BulkProcessor`可以进一步配置其如何刷新缓存操作请求的行为详细查看[官方文档](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/elasticsearch/#elasticsearch-sink)**配置内部批量处理器** 单元
### StreamPark配置
其他的所有的配置都必须遵守 **StreamPark** 配置,具体可配置项和各个参数的作用请参考[项目配置](/docs/development/conf)
