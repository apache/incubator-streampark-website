---
id: 'Http-Connector'
title: 'Http Connector'
original: true
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

一些后台服务通过http请求接收数据，这种场景下flink可以通过http请求写入结果数据，目前flink官方未提供通过http请求写入
数据的连接器。StreamX 基于asynchttpclient封装了HttpSink异步实时写入数据。

`HttpSink`写入不支持事务，向目标服务写入数据可提供 AT_LEAST_ONCE (至少一次)的处理语义。异步写入重试多次失败的数据会写入外部组件（kafka,mysql,hdfs,hbase）,最终通过人为介入来恢复数据。


## http异步写入依赖
```xml
<dependency>
    <groupId>org.asynchttpclient</groupId>
    <artifactId>async-http-client</artifactId>
    <optional>true</optional>
</dependency>
```


## http异步写入信息配置

HttpSink 支持http协议的get 、post 、patch 、put 、delete 、options 、trace 对应至HttpSink同名方法，具体信息如下:

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

在`StreamX`中`HttpSink` 约定的配置见配置列表，运行程序样例为scala，详细信息如下

<Tabs>
<TabItem value="配置" default>

```yaml
http.sink:
  threshold:
    numWriters: 3
    queueCapacity: 10000 #队列最大容量,视单条记录大小而自行估量队列大小,如值太大,上游数据源来的太快,下游写入数据跟不上可能会OOM.
    timeout: 100 #发送http请求的超时时间
    retries: 3 #发送失败时的最大重试次数
    successCode: 200 #发送成功状态码,这里可以有多个值,用","号分隔
  failover:
    table: record
    storage: mysql #kafka,hbase,hdfs
    jdbc: # 保存类型为MySQL,将失败的数据保存到MySQL
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

</TabItem>
<TabItem value="Scala" label="Scala">

```scala

import com.streamxhub.streamx.flink.core.scala.FlinkStreaming
import com.streamxhub.streamx.flink.core.scala.sink.HttpSink
import org.apache.flink.api.scala._
import org.apache.flink.streaming.api.scala.DataStream

object HttpSinkApp extends FlinkStreaming {

  override def handle(): Unit = {
    val createTable =
      """
        |create TABLE test.orders(
        |userId UInt16,
        |orderId UInt16,
        |siteId UInt8,
        |cityId UInt8,
        |orderStatus UInt8,
        |price Float64,
        |quantity UInt8,
        |timestamp UInt16
        |)ENGINE = TinyLog;
        |""".stripMargin

    println(createTable)

    val source = context.addSource(new TestSource)

    source.print()
    val value: DataStream[String] = source.map(x => s"http://127.0.0.1:8080?userId=(${x.userId}&siteId=${x.siteId})")
    HttpSink().post(value).setParallelism(1)

  }

}

```
</TabItem>
</Tabs>

:::info 警告
由于http一次只能写入一条数据，延迟比较高，不适合大数据量写入，需设置合理阈值提高性能<br></br>
由于httpSink异步写入失败会重新将数据添加至缓存队列，可能造成同一窗口数据分两批次写入，实时性要求高的场景建议全面测试<br></br>
异步写入数据达到重试最大值后，会将数据备份至外部组件，在此时才会初始化组件连接，建议确保failover 组件的可用性
:::

## 其他配置
