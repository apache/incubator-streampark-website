---
id: 'Hbase-Connector'
title: 'Apache HBase Connector'
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Apache HBase](https://hbase.apache.org/book.html) is a highly reliable, high-performance, column-oriented, and scalable distributed storage system. Using HBase technology,
large-scale structured storage clusters can be built on cheap PC Servers. Unlike general relational databases,
HBase is a database suitable for unstructured data storage because HBase storage is based on a column rather than a row-based schema.

Flink does not officially provide a connector for Hbase DataStream. StreamPark encapsulates HBaseSource and HBaseSink based on `Hbase-client`.
It supports automatic connection creation based on configuration and simplifies development. StreamPark reading Hbase can record the latest status of the read data when the checkpoint is enabled,
and the offset corresponding to the source can be restored through the data itself. Implement source-side AT_LEAST_ONCE.

HbaseSource implements Flink Async I/O to improve streaming throughput. The sink side supports AT_LEAST_ONCE by default.
EXACTLY_ONCE is supported when checkpointing is enabled.

:::tip hint
StreamPark reading HBASE can record the latest state of the read data when checkpoint is enabled.
Whether the previous state can be restored after the job is resumed depends entirely on whether the data itself has an offset identifier,
which needs to be manually specified in the code. The recovery logic needs to be specified in the func parameter of the getDataStream method of HBaseSource.
:::

## Dependency of HBase writing
HBase Maven Dependency
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

## Regular way to write and read Hbase
### 1.Create database and table
     create 'Student', {NAME => 'Stulnfo', VERSIONS => 3}, {NAME =>'Grades', BLOCKCACHE => true}
### 2.Write demo and Read demo
<Tabs>
<TabItem value="read data" default>

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

<TabItem value="data input" default>

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
 * Desc: Read stream data, then write to HBase
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
Write to HBase
  Inherit RichSinkFunction to override the parent class method
  <p>
  When writing to hbase, 500 items are flushed once, inserted in batches, using writeBufferSize
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

Reading and writing HBase in this way is cumbersome and inconvenient. `StreamPark` follows the concept of convention over configuration and automatic configuration.
Users only need to configure Hbase connection parameters and Flink operating parameters. StreamPark will automatically assemble source and sink,
which greatly simplifies development logic and improves development efficiency and maintainability.

## write and read Hbase with StreamPark

### 1. Configure policies and connection information

```yaml
# hbase
hbase:
  zookeeper.quorum: test1,test2,test6
  zookeeper.property.clientPort: 2181
  zookeeper.session.timeout: 1200000
  rpc.timeout: 5000
  client.pause: 20

```

### 2. Read and write HBase

Writing to Hbase with StreamPark is very simple, the code is as follows:

<Tabs>
<TabItem value="read HBase">

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
      //The following methods determine the logic for restoring offsets from checkpoints
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

<TabItem value="write HBase">

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

    //1）INSERT WAY 1
    HBaseSink().sink[TestEntity](source, "order")
    //2) 插入方式2
    //1.Specify the HBase configuration file
    implicit val prop = ConfigUtils.getHBaseConfig(context.parameter.toMap)
    //2.break in...
    source.writeUsingOutputFormat(new HBaseOutputFormat[TestEntity]("order", entry2Put))
  }
}
```
</TabItem>
</Tabs>

When StreamPark writes to HBase, you need to create the method of HBaseQuery,
specify the method to convert the query result into the required object, identify whether it is running,
and pass in the running parameters. details as follows
```scala
/**
 * @param ctx
 * @param property
 */
class HBaseSource(@(transient@param) val ctx: StreamingContext, property: Properties = new Properties()) {

  /**
   * @param query   Specify the method to create H Base Query
   * @param func    The query results are converted into the expected counterparty method
   * @param running runID
   * @param prop    Job parameters
   * @tparam R
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
StreamPark HbaseSource implements flink Async I/O, which is used to improve the throughput of Streaming: first create a DataStream,
then create an HBaseRequest and call requestOrdered() or requestUnordered() to create an asynchronous stream, as follows:
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
Stramx supports two ways to write data: 1. addSink() 2. writeUsingOutputFormat Examples are as follows:
```scala
    //1）Insert way 1
    HBaseSink().sink[TestEntity](source, "order")
    //2) insert way 2
    //1.Specify the HBase configuration file
    implicit val prop = ConfigUtils.getHBaseConfig(context.parameter.toMap)
    //
    source.writeUsingOutputFormat(new HBaseOutputFormat[TestEntity]("order", entry2Put))
```



## Other configuration

All other configurations must comply with the StreamPark configuration. For specific configurable items and the role of each parameter, please refer to the 【project configuration](/docs/development/conf)
