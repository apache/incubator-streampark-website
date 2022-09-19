---
id: 'Hbase-Connector'
title: 'Apache HBase Connector'
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Apache HBase](https://hbase.apache.org/book.html)是一个高可靠性、高性能、面向列、可伸缩的分布式存储系统，利用HBase技术可在廉价PC Server
上搭建起大规模结构化存储集群。 HBase不同于一般的关系数据库，它是一个适合于非结构化数据存储的数据库，HBase基于列的而不是基于行的模式。

flink官方未提供Hbase DataStream的连接器。StreamPark 基于`Hbase-client`封装了HBaseSource、HBaseSink,支持依据配置自动创建连接，简化开发。
StreamPark 读取Hbase在开启chekpoint情况下可以记录读取数据的最新状态，通过数据本身标识可以恢复source对应偏移量。实现source端AT_LEAST_ONCE(至少一次语义)。
HbaseSource 实现了flink Async I/O，用于提升streaming的吞吐量，sink端默认支持AT_LEAST_ONCE (至少一次)的处理语义。在开启checkpoint情况下支持EXACTLY_ONCE()精确一次语义。

:::tip 提示
StreamPark 读取HBASE在开启chekpoint情况下可以记录读取数据的最新状态，作业恢复后从是否可以恢复之前状态完全取决于数据本身是否有偏移量的标识，需要在代码手动指定。
在HBaseSource的getDataStream方法func参数指定恢复逻辑。
:::

## HBase写入依赖
HBase Maven依赖
```xml
<dependency>
<groupId>org.apache.hbase</groupId>
<artifactId>hbase-client</artifactId>
<version>${hbase.version}</version>
</dependency>
```
```xml

<dependency>
<groupId>org.apache.hbase</groupId>
<artifactId>hbase-common</artifactId>
<version>${hbase.version}</version>
</dependency>
```

## 常规方式写入读取Hbase
### 1.创建库表
     create 'Student', {NAME => 'Stulnfo', VERSIONS => 3}, {NAME =>'Grades', BLOCKCACHE => true}
### 2.写入读取demo
<Tabs>
<TabItem value="读取数据" default>

```java

import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.source.RichSourceFunction;
import org.apache.hadoop.hbase.Cell;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

import java.util.List;


public class FlinkHBaseReader {
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        // 添加数据源
        DataStream<String> stream = env.addSource(new HBaseReader());
        stream.print();
        env.execute("FlinkHBaseDemo");
    }
}


class HBaseReader extends RichSourceFunction<String> {
    private Connection connection = null;
    private ResultScanner rs = null;
    private Table table = null;

    @Override
    public void open(Configuration parameters) throws Exception {
        org.apache.hadoop.conf.Configuration hconf = HBaseConfiguration.create();
        hconf.set("hbase.zookeeper.quorum", "localhost:2181");
        hconf.set("zookeeper.property.clientPort", "/hbase");
        connection = ConnectionFactory.createConnection(hconf);
    }

    @Override
    public void run(SourceContext<String> sourceContext) throws Exception {
        table = connection.getTable(TableName.valueOf("Student"));
        Scan scan = new Scan();
        scan.addFamily(Bytes.toBytes("Stulnfo"));
        rs = table.getScanner(scan);
        for (Result result : rs) {
            StringBuilder sb = new StringBuilder();
            List<Cell> cells = result.listCells();
            for (Cell cell : cells) {
                String value = Bytes.toString(cell.getValueArray(), cell.getValueOffset(), cell.getValueLength());
                sb.append(value).append("-");
            }
            String value = sb.replace(sb.length() - 1, sb.length(), "").toString();
            sourceContext.collect(value);
        }
    }

    @Override
    public void cancel() {

    }

    @Override
    public void close() throws Exception {
        if (rs != null) {
            rs.close();
        }
        if (table != null) {
            table.close();
        }
        if (connection != null) {
            connection.close();
        }
    }
}
```
</TabItem>

<TabItem value="写入数据" default>

```java
import com.zhisheng.common.utils.ExecutionEnvUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.flink.api.java.utils.ParameterTool;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;
import org.apache.flink.streaming.api.functions.source.SourceFunction;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Desc: 读取流数据，然后写入到 HBase
 */
@Slf4j
public class HBaseStreamWriteMain {

    public static void main(String[] args) throws Exception {
        final ParameterTool parameterTool = ExecutionEnvUtil.createParameterTool(args);
        StreamExecutionEnvironment env = ExecutionEnvUtil.prepare(parameterTool);
        DataStream<String> dataStream = env.addSource(new SourceFunction<String>() {
            private static final long serialVersionUID = 1L;

            private volatile boolean isRunning = true;

            @Override
            public void run(SourceContext<String> out) throws Exception {
                while (isRunning) {
                    out.collect("name" + Math.floor(Math.random() * 100));
                }
            }

            @Override
            public void cancel() {
                isRunning = false;
            }
        });
        dataStream.addSink(new HBaseWriter());
        env.execute("Flink HBase connector sink");
    }


}

/**
 * 写入HBase
 * 继承RichSinkFunction重写父类方法
 * <p>
 * 写入hbase时500条flush一次, 批量插入, 使用的是writeBufferSize
 */
class HBaseWriter extends RichSinkFunction<String> {
    private static final Logger logger = LoggerFactory.getLogger(HBaseWriter.class);

    private static org.apache.hadoop.conf.Configuration configuration;
    private static Connection connection = null;
    private static BufferedMutator mutator;
    private static int count = 0;

    @Override
    public void open(Configuration parameters) throws Exception {
        configuration = HBaseConfiguration.create();
        configuration.set("hbase.zookeeper.quorum", "localhost:21981");
        configuration.set("zookeeper.property.clientPort", "/hbase");
        try {
            connection = ConnectionFactory.createConnection(configuration);
        } catch (IOException e) {
            e.printStackTrace();
        }
        BufferedMutatorParams params = new BufferedMutatorParams(TableName.valueOf("Student"));
        params.writeBufferSize(2 * 1024 * 1024);
        mutator = connection.getBufferedMutator(params);
    }

    @Override
    public void close() throws IOException {
        if (mutator != null) {
            mutator.close();
        }
        if (connection != null) {
            connection.close();
        }
    }

    @Override
    public void invoke(String values, Context context) throws Exception {
        //Date 1970-01-06 11:45:55  to 445555000
        long unixTimestamp = 0;
        String RowKey = String.valueOf(unixTimestamp);
        Put put = new Put(RowKey.getBytes());
        put.addColumn("Stulnfo".getBytes(), "Name".getBytes(), values.getBytes());
        mutator.mutate(put);
        //每满500条刷新一下数据
        if (count >= 500) {
            mutator.flush();
            count = 0;
        }
        count = count + 1;
    }
}
```
</TabItem>

</Tabs>

以方式读写Hbase较繁琐，非常的不灵敏。`StreamPark`使用约定大于配置、自动配置的方式只需要配置Hbase连接参数、flink运行参数，StreamPark 会自动组装source和sink，极大的简化开发逻辑，提升开发效率和维护性。

## StreamPark 读写 Hbase

### 1. 配置策略和连接信息

```yaml
# hbase
hbase:
  zookeeper.quorum: test1,test2,test6
  zookeeper.property.clientPort: 2181
  zookeeper.session.timeout: 1200000
  rpc.timeout: 5000
  client.pause: 20

```

### 2. 读写入Hbase
用 StreamPark 写入Hbase非常简单,代码如下:

<Tabs>
<TabItem value="读取HBase">

```scala

import org.apache.streampark.common.util.ConfigUtils
import org.apache.streampark.flink.core.java.wrapper.HBaseQuery
import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.request.HBaseRequest
import org.apache.streampark.flink.core.scala.source.HBaseSource
import org.apache.flink.api.scala.createTypeInformation
import org.apache.hadoop.hbase.CellUtil
import org.apache.hadoop.hbase.client.{Get, Scan}
import org.apache.hadoop.hbase.util.Bytes

import java.util

object HBaseSourceApp extends FlinkStreaming {

  override def handle(): Unit = {

    implicit val conf = ConfigUtils.getHBaseConfig(context.parameter.toMap)

    val id = HBaseSource().getDataStream[String](query => {
        new HBaseQuery("person", new Scan())
    },
      //以下方法决定从checkpoint恢复偏移量的逻辑
      r => new String(r.getRow), null)
//flink Async I/O
    HBaseRequest(id).requestOrdered(x => {
      new HBaseQuery("person", new Get(x.getBytes()))
    }, (a, r) => {
      val map = new util.HashMap[String, String]()
      val cellScanner = r.cellScanner()
      while (cellScanner.advance()) {
        val cell = cellScanner.current()
        val q = Bytes.toString(CellUtil.cloneQualifier(cell))
        val (name, v) = q.split("_") match {
          case Array(_type, name) =>
            _type match {
              case "i" => name -> Bytes.toInt(CellUtil.cloneValue(cell))
              case "s" => name -> Bytes.toString(CellUtil.cloneValue(cell))
              case "d" => name -> Bytes.toDouble(CellUtil.cloneValue(cell))
              case "f" => name -> Bytes.toFloat(CellUtil.cloneValue(cell))
            }
          case _ =>
        }
        map.put(name.toString, v.toString)
      }
      map.toString
    }).print("Async")
  }

}

```
</TabItem>

<TabItem value="写入HBase">

```scala
import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.sink.{HBaseOutputFormat, HBaseSink}
import org.apache.flink.api.scala._
import org.apache.streampark.common.util.ConfigUtils
import org.apache.hadoop.hbase.client.{Mutation, Put}
import org.apache.hadoop.hbase.util.Bytes

import java.util.{Collections, Random}

object HBaseSinkApp extends FlinkStreaming {

  override def handle(): Unit = {
    val source = context.addSource(new TestSource)
    val random = new Random()

    //定义转换规则...
    implicit def entry2Put(entity: TestEntity): java.lang.Iterable[Mutation] = {
      val put = new Put(Bytes.toBytes(System.nanoTime() + random.nextInt(1000000)), entity.timestamp)
      put.addColumn(Bytes.toBytes("cf"), Bytes.toBytes("cid"), Bytes.toBytes(entity.cityId))
      put.addColumn(Bytes.toBytes("cf"), Bytes.toBytes("oid"), Bytes.toBytes(entity.orderId))
      put.addColumn(Bytes.toBytes("cf"), Bytes.toBytes("os"), Bytes.toBytes(entity.orderStatus))
      put.addColumn(Bytes.toBytes("cf"), Bytes.toBytes("oq"), Bytes.toBytes(entity.quantity))
      put.addColumn(Bytes.toBytes("cf"), Bytes.toBytes("sid"), Bytes.toBytes(entity.siteId))
      Collections.singleton(put)
    }
    //source ===> trans ===> sink

    //1）插入方式1
    HBaseSink().sink[TestEntity](source, "order")
    //2) 插入方式2
    //1.指定HBase 配置文件
    implicit val prop = ConfigUtils.getHBaseConfig(context.parameter.toMap)
    //2.插入...
    source.writeUsingOutputFormat(new HBaseOutputFormat[TestEntity]("order", entry2Put))


  }

}
```
</TabItem>
</Tabs>

StreamPark 写入Hbase 需要创建HBaseQuery的方法、指定将查询结果转化为需要对象的方法、标识是否在运行、传入运行参数。具体如下：
```scala
/**
 * @param ctx
 * @param property
 */
class HBaseSource(@(transient@param) val ctx: StreamingContext, property: Properties = new Properties()) {

  /**
   * @param query   指定创建HBaseQuery的方法
   * @param func    查询结果转化为期望对方方法
   * @param running 运行标识
   * @param prop    作业参数
   * @tparam R  返回类型
   * @return
   */
  def getDataStream[R: TypeInformation](query: R => HBaseQuery,
                                        func: Result => R,
                                        running: Unit => Boolean)(implicit prop: Properties = new Properties()) = {
    Utils.copyProperties(property, prop)
    val hBaseFunc = new HBaseSourceFunction[R](prop, query, func, running)
    ctx.addSource(hBaseFunc)
  }

}
```
StreamPark HbaseSource 实现了flink Async I/O 用于提升Streaming的吞吐量，先创建 DataStream 然后创建 HBaseRequest 调用
requestOrdered（） 或者 requestUnordered（） 创建异步流，建如下代码：
```scala
class HBaseRequest[T: TypeInformation](@(transient@param) private val stream: DataStream[T], property: Properties = new Properties()) {

  /**
   *
   * @param queryFunc
   * @param resultFunc
   * @param timeout
   * @param capacity
   * @param prop
   * @tparam R
   * @return
   */
  def requestOrdered[R: TypeInformation](queryFunc: T => HBaseQuery, resultFunc: (T, Result) => R, timeout: Long = 1000, capacity: Int = 10)(implicit prop: Properties): DataStream[R] = {
    Utils.copyProperties(property, prop)
    val async = new HBaseAsyncFunction[T, R](prop, queryFunc, resultFunc, capacity)
    AsyncDataStream.orderedWait(stream, async, timeout, TimeUnit.MILLISECONDS, capacity)
  }

  /**
   *
   * @param queryFunc
   * @param resultFunc
   * @param timeout
   * @param capacity
   * @param prop
   * @tparam R
   * @return
   */
  def requestUnordered[R: TypeInformation](queryFunc: T => HBaseQuery, resultFunc: (T, Result) => R, timeout: Long = 1000, capacity: Int = 10)(implicit prop: Properties): DataStream[R] = {
    Utils.copyProperties(property, prop)
    val async = new HBaseAsyncFunction[T, R](prop, queryFunc, resultFunc, capacity)
    AsyncDataStream.unorderedWait(stream, async, timeout, TimeUnit.MILLISECONDS, capacity)
  }

}
```
Stramx支持两种方式写入数据：1.addSink() 2. writeUsingOutputFormat 样例如下：
```scala
    //1）插入方式1
    HBaseSink().sink[TestEntity](source, "order")
    //2) 插入方式2
    //1.指定HBase 配置文件
    implicit val prop = ConfigUtils.getHBaseConfig(context.parameter.toMap)
    //2.插入...
    source.writeUsingOutputFormat(new HBaseOutputFormat[TestEntity]("order", entry2Put))
```



## 其他配置

其他的所有的配置都必须遵守 **StreamPark** 配置,具体可配置项和各个参数的作用请参考[项目配置](/docs/development/conf)
