---
id: 'Elasticsearch-Connector'
title: 'Elasticsearch Connector'
sidebar_position: 5
---


import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

[Elasticsearch](https://www.elastic.co/cn/elasticsearch/) is a distributed, RESTful style search and data analysis
engine.
[Flink officially](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/) provides a connector
for Elasticsearch, which is used to write data to Elasticsearch, which can provide ** at least once** Semantics.

ElasticsearchSink uses TransportClient (before 6.x) or RestHighLevelClient (starting with 6.x) to communicate with the
Elasticsearch cluster.
`StreamPark` further encapsulates Flink-connector-elasticsearch6, shields development details, and simplifies write
operations for Elasticsearch6 and above.

:::tip hint

Because there are conflicts between different versions of Flink Connector Elasticsearch, StreamPark temporarily only
supports write operations of Elasticsearch6 and above. If you wants to using Elasticsearch5, you need to exclude the
flink-connector-elasticsearch6 dependency and introduce the flink-connector-elasticsearch5 dependency to create
org.apache.flink.streaming.connectors.elasticsearch5.ElasticsearchSink instance writes data.

:::

## Dependency of elastic writing

Different Elasticsearch versions rely on the Flink Connector Elasticsearch is not universal, the following information
comes from the [flink-docs-release-1.14 document](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/connectors/datastream/elasticsearch/):

Elasticsearch 5.x Maven dependencies

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-elasticsearch5_2.11</artifactId>
    <version>1.14.3</version>
</dependency>
```

Elasticsearch 6.x Maven dependencies

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-elasticsearch6_2.11</artifactId>
    <version>1.14.3</version>
</dependency>
```

Elasticsearch 7.x ans above Maven dependencies

```xml

<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-elasticsearch7_2.11</artifactId>
    <version>1.14.3</version>
</dependency>
```

## Write data to Elasticsearch based on the official

The following code is taken from the official documentation[Elasticsearch based on the official](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/elasticsearch/#elasticsearch-sink)


<Tabs>
<TabItem value="java, Elasticsearch 6.x ans above" java>

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

DataStream<String> input=...;

        List<HttpHost> httpHosts=new ArrayList<>();
        httpHosts.add(new HttpHost("127.0.0.1",9200,"http"));
        httpHosts.add(new HttpHost("10.2.3.1",9200,"http"));

// 使用 ElasticsearchSink.Builder 创建 ElasticsearchSink
        ElasticsearchSink.Builder<String> esSinkBuilder=new ElasticsearchSink.Builder<>(
        httpHosts,
        new ElasticsearchSinkFunction<String>(){
public IndexRequest createIndexRequest(String element){
        Map<String, String> json=new HashMap<>();
        json.put("data",element);

        return Requests.indexRequest()
        .index("my-index")
        .type("my-type")
        .source(json);
        }

@Override
public void process(String element,RuntimeContext ctx,RequestIndexer indexer){
        indexer.add(createIndexRequest(element));
        }
        }
        );

// Configuration for batch requests; the settings below cause the sink to commit immediately after receiving each element that would otherwise be cached
        esSinkBuilder.setBulkFlushMaxActions(1);

A RestClientFactory that provides custom configuration information for internally created REST clients
        esSinkBuilder.setRestClientFactory(
        restClientBuilder->{
        restClientBuilder.setDefaultHeaders(...)
        restClientBuilder.setMaxRetryTimeoutMillis(...)
        restClientBuilder.setPathPrefix(...)
        restClientBuilder.setHttpClientConfigCallback(...)
        }
        );

// Finally, build and add the sink to the job pipeline
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

val input: DataStream[String] =
...

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

// Configuration for batch requests; the settings below cause the sink to commit immediately after receiving each element that would otherwise be cached
esSinkBuilder.setBulkFlushMaxActions(1)

// A RestClientFactory that provides custom configuration information for internally created REST clients
esSinkBuilder.setRestClientFactory(new RestClientFactory {
  override def configureRestClientBuilder(restClientBuilder: RestClientBuilder): Unit = {
    restClientBuilder.setDefaultHeaders(
    ...)
    restClientBuilder.setMaxRetryTimeoutMillis(
    ...)
    restClientBuilder.setPathPrefix(
    ...)
    restClientBuilder.setHttpClientConfigCallback(
    ...)
  }
})

// Finally, build and add the sink to the job pipeline
input.addSink(esSinkBuilder.build)
```

</TabItem>

</Tabs>

The ElasticsearchSink created above is very inflexible to add parameters. `StreamPark` follows the concept of convention over configuration and automatic configuration.
Users only need to configure es connection parameters and Flink operating parameters, and StreamPark will automatically assemble source and sink,
which greatly simplifies development logic and improves development efficiency and maintainability.

## Using StreamPark writes to Elasticsearch

Please ensure that operation requests are sent to the Elasticsearch cluster at least once after enabling Flink checkpointing in ESSink.

### 1. 配置策略和连接信息

```yaml
#redis sink configure
#  Required parameter, used by multiple nodes host1:port, host2:port,
host: localhost:9200
#  optional parameters
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

Using StreamPark writes to Elasticsearch

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

    //1)Define the writing rules for Index
    implicit def indexReq(x: OrderEntity): IndexRequest = ElasticSearchUtils.indexRequest(
      "flink_order",
      "_doc",
      s"${x.id}_${x.time.getTime}",
      Serialization.write(x)
    )
    //3)define esSink and sink = data. done
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
                (f: T => UpdateRequest): DataStreamSink[T] = {

    new ES6Sink(context, property, parallelism, name, uid).sink[T](stream, suffix, restClientFactory, failureHandler, f)
  }


  def delete6[T](stream: DataStream[T],
                 suffix: String = "",
                 restClientFactory: RestClientFactory = null,
                 failureHandler: ActionRequestFailureHandler = new RetryRejectedExecutionFailureHandler)
                (f: T => DeleteRequest): DataStreamSink[T] = {

    new ES6Sink(context, property, parallelism, name, uid).sink[T](stream, suffix, restClientFactory, failureHandler, f)
  }

}
```

:::info
When the Flink checkpoint is enabled, the Flink Elasticsearch Sink guarantees that operation requests are sent to the Elasticsearch cluster at least once.
It does this by waiting for all pending operation requests in the BulkProcessor while checkpointing.
This effectively guarantees that all requests will be successfully acknowledged by Elasticsearch before triggering the checkpoint and proceeding to process records sent to the sink.
If the user wants to disable flushing, they can configure disableFlushOnCheckpoint to true to do so,
which essentially means that the sink will no longer provide any reliable delivery guarantees,
even if checkpointing of the job topology is enabled.
:::

## Other configuration

### deal with failed Elasticsearch request

An Elasticsearch operation request may fail for a variety of reasons. You can specify the failure handling logic by implementing ActionRequestFailureHandler.
See [Official Documentation](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/elasticsearch/#elasticsearch-sink) - Handling Failed Elasticsearch Requests

### Configure the internal batch processor

The BulkProcessor inside es can further configure its behavior of how to refresh the cache operation request,
see the [official documentation](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/elasticsearch/#elasticsearch-sink) for details - **Configuring the Internal** Bulk Processor

### StreamPark configuration

All other configurations must comply with the StreamPark configuration.
For [specific configurable](/docs/development/conf) items and the role of each parameter,
please refer to the project configuration
