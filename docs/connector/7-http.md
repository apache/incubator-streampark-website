---
id: 'Http-Connector'
title: 'Http Connector'
original: true
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Some background services receive data through HTTP requests. In this scenario, Flink can write result data through HTTP
requests. Currently, Flink officially does not provide a connector for writing data through HTTP requests. StreamPark
encapsulates HttpSink to write data asynchronously in real-time based on asynchttpclient.

`HttpSink` writes do not support transactions, writing data to the target service provides AT_LEAST_ONCE semantics. Data
that fails to be retried multiple times will be written to external components (kafka, mysql, hdfs, hbase), and the data
will be restored manually to achieve final data consistency.

## http asynchronous write

Asynchronous writing uses asynchttpclient as the client, you need to import the jar of asynchttpclient first.

```xml

<dependency>
    <groupId>org.asynchttpclient</groupId>
    <artifactId>async-http-client</artifactId>
    <optional>true</optional>
</dependency>
```

## Write with StreamPark

### http asynchronous write support type

HttpSink supports get , post , patch , put , delete , options , trace of http protocol. Corresponding to the method of
the same name of HttpSink, the specific information is as follows:

<TabItem value="Scala" label="Scala">

```scala
class HttpSink(@(transient@param) ctx: StreamingContext,
               header: Map[String, String] = Map.empty[String, String],
               parallelism: Int = 0,
               name: String = null,
               uid: String = null) extends Sink {

  def get(stream: DataStream[String]): DataStreamSink[String] = sink(stream, HttpGet.METHOD_NAME)

  def post(stream: DataStream[String]): DataStreamSink[String] = sink(stream, HttpPost.METHOD_NAME)

  def patch(stream: DataStream[String]): DataStreamSink[String] = sink(stream, HttpPatch.METHOD_NAME)

  def put(stream: DataStream[String]): DataStreamSink[String] = sink(stream, HttpPut.METHOD_NAME)

  def delete(stream: DataStream[String]): DataStreamSink[String] = sink(stream, HttpDelete.METHOD_NAME)

  def options(stream: DataStream[String]): DataStreamSink[String] = sink(stream, HttpOptions.METHOD_NAME)

  def trace(stream: DataStream[String]): DataStreamSink[String] = sink(stream, HttpTrace.METHOD_NAME)

  private[this] def sink(stream: DataStream[String], method: String): DataStreamSink[String] = {
    val params = ctx.parameter.toMap.filter(_._1.startsWith(HTTP_SINK_PREFIX)).map(x => x._1.drop(HTTP_SINK_PREFIX.length + 1) -> x._2)
    val sinkFun = new HttpSinkFunction(params, header, method)
    val sink = stream.addSink(sinkFun)
    afterSink(sink, parallelism, name, uid)
  }
}

```

</TabItem>

### Configuration list of HTTP asynchronous write

```yaml
http.sink:
  threshold:
    numWriters: 3
    queueCapacity: 10000 #The maximum capacity of the queue, according to the size of a single record, and the size of the queue is estimated by itself. If the value is too large, the upstream data source is coming too fast, and the downstream write data may not keep up with OOM.
    timeout: 100 #Timeout for sending http requests
    retries: 3 #Maximum number of retries when sending fails
    successCode: 200 #Send success status code
  failover:
    table: record
    storage: mysql #kafka,hbase,hdfs
    jdbc:
      jdbcUrl: jdbc:mysql://localhost:3306/test
      username: root
      password: 123456
    kafka:
      topic: bigdata
      bootstrap.servers: localhost:9091,localhost:9092,localhost:9093
    hbase:
      zookeeper.quorum: localhost
      zookeeper.property.clientPort: 2181
    hdfs:
      namenode: hdfs://localhost:8020 # namenode rpc address and port, e.g: hdfs://hadoop:8020 , hdfs://hadoop:9000
      user: benjobs # user
      path: /http/failover # save path
      format: yyyy-MM-dd
```

### HTTP writes data asynchronously

The program sample is scala

<Tabs>
<TabItem value="Scala" label="Scala">

```scala

import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.sink.HttpSink
import org.apache.flink.api.scala._
import org.apache.flink.streaming.api.scala.DataStream

object HttpSinkApp extends FlinkStreaming {

  override def handle(): Unit = {

    val source = context.addSource(new TestSource)

    val value: DataStream[String] = source.map(x => s"http://127.0.0.1:8080?userId=(${x.userId}&siteId=${x.siteId})")
    HttpSink().post(value).setParallelism(1)

  }
}

```

</TabItem>
</Tabs>

:::info warn
Since http can only write one piece of data at a time, the latency is relatively high, and it is not suitable for
writing large amounts of data.   It is necessary to set a reasonable threshold to improve performance.
Since httpSink asynchronous writing fails, data will be added to the cache queue again, which may cause data in the same
window to be written in two batches.   It is recommended to fully test in scenarios with high real-time requirements.
After the asynchronous write data reaches the maximum retry value, the data will be backed up to the external component, and the component connection will be initialized at this time. It is recommended to ensure the availability of the failover component.
:::

## Other configuration
All other configurations must comply with the **StreamPark** configuration.
For specific configurable items and the role of each parameter, please refer [Project configuration](/docs/development/conf)
