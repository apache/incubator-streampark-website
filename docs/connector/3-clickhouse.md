---
id: 'Clickhouse-Connector'
title: 'ClickHouse Connector'
original: true
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[ClickHouse](https://clickhouse.com/) is a columnar database management system (DBMS) for online analytics (OLAP).
Currently, Flink does not officially provide a connector for writing to ClickHouse and reading from ClickHouse.
Based on the access form supported by [ClickHouse - HTTP client](https://clickhouse.com/docs/zh/interfaces/http/)
and [JDBC driver](https://clickhouse.com/docs/zh/interfaces/jdbc), StreamPark encapsulates ClickHouseSink for writing data to ClickHouse in real-time.

`ClickHouse` writes do not support transactions, using JDBC write data to it could provide (AT_LEAST_ONCE) semanteme. Using the HTTP client to write asynchronously,
it will retry the asynchronous write multiple times. The failed data will be written to external components (Kafka, MySQL, HDFS, HBase),
the data will be restored manually to achieve final data consistency.

## JDBC synchronous write

[ClickHouse](https://clickhouse.com/)provides a [JDBC driver](https://clickhouse.com/docs/zh/interfaces/jdbc/),JDBC driver package of ClickHouse need to be import first

```xml
<dependency>
    <groupId>ru.yandex.clickhouse</groupId>
    <artifactId>clickhouse-jdbc</artifactId>
    <version>0.3.1</version>
</dependency>
```

### Write in the normal way

The conventional way to create a clickhouse jdbc connection:

<TabItem value="Java" label="Java">

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ClickHouseUtil {
    private static Connection connection;

    public static Connection getConn(String host, int port, String database) throws SQLException, ClassNotFoundException {
        Class.forName("ru.yandex.clickhouse.ClickHouseDriver");
        String  address = "jdbc:clickhouse://" + host + ":" + port + "/" + database;
        connection = DriverManager.getConnection(address);
        return connection;
    }

    public static Connection getConn(String host, int port) throws SQLException, ClassNotFoundException {
        return getConn(host,port,"default");
    }
    public static Connection getConn() throws SQLException, ClassNotFoundException {
        return getConn("node-01",8123);
    }
    public void close() throws SQLException {
        connection.close();
    }
}
```
</TabItem>

The method of splicing various parameters into the request url is cumbersome and hard-coded, which is very inflexible.

### Write with StreamPark

To access `ClickHouse` data with `StreamPark`, you only need to define the configuration file in the specified format and then write code.
The configuration and code are as follows. The configuration of `ClickHose JDBC` in `StreamPark` is in the configuration list, and the sample running program is scala

#### configuration list

```yaml
clickhouse:
  sink:
    jdbcUrl: jdbc:clickhouse://127.0.0.1:8123,192.168.1.2:8123
    socketTimeout: 3000000
    database: test
    user: $user
    password: $password
    targetTable: orders(userId,siteId)
    batch:
      size: 1000
      delaytime: 6000000
```

#### Write to ClickHouse

<Tabs>
<TabItem value="Scala" label="Scala">

```scala
import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.sink.ClickHouseSink
import org.apache.flink.api.scala._

object ClickHouseSinkApp extends FlinkStreaming {

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

    val source = context.addSource(new TestSource)


     ClickHouseSink().syncSink[TestEntity](source)(x => {
         s"(${x.userId},${x.siteId})"
     }).setParallelism(1)
  }

}

class Order(val marketId: String, val timestamp: String) extends Serializable
```
</TabItem>
</Tabs>

:::tip hint
ClickHouse can support balanced writing of multiple nodes, you only need to configure writable nodes in JDBC URL
Since ClickHouse has a relatively high delay for single insertion, it is recommended to set the batch.
size to insert data in batches to improve performance. At the same time, to improve real-time performance,
it supports batch writing according to data volume or interval time.
In the implementation of ClickHouseSink, if the number of the last batch of data is less than BatchSize, the remaining data will be inserted when the connection is closed.
:::

## HTTP async write

In the case of a small amount of data, you can use JDBC to connect and write data. In actual production，is more using async HTTP to write data more efficiently and quickly.

### Write in the normal way

Clickhouse INSERT must insert data through the POST method. The general operation is as follows:
```bash
$ echo 'INSERT INTO t VALUES (1),(2),(3)' | curl 'http://localhost:8123/' --data-binary @-
```

The operation of the above method is relatively simple. Sure java could also be used for writing. StreamPark adds many functions to the http post writing method,
including encapsulation enhancement, adding cache, asynchronous writing, failure retry, and data backup after reaching the retry threshold，
To external components (kafka, mysql, hdfs, hbase), etc., the above functions only need to define the configuration file in the prescribed format,
and write the code.

### Write to ClickHouse

The configuration of `ClickHose JDBC` in `StreamPark` is in the configuration list, and the sample running program is scala, as follows:
asynchttpclient is used as an HTTP asynchronous client for writing. first, import the jar of asynchttpclient

```xml
<!--clickhouse async need asynchttpclient -->
<dependency>
    <groupId>org.asynchttpclient</groupId>
    <artifactId>async-http-client</artifactId>
    <optional>true</optional>
</dependency>
```

#### Asynchronous write configuration and failure recovery component configuration

```yaml

clickhouse:
  sink:
    hosts: 127.0.0.1:8123,192.168.1.2:8123
    socketTimeout: 3000000
    database: test
    user: $user
    password: $password
    targetTable: test.orders(userId,siteId)
    batch:
      size: 1
      delaytime: 60000
    threshold:
      bufferSize: 10
      #      Concurrent number of asynchronous writes
      numWriters: 4
      #      cache queue size
      queueCapacity: 100
      delayTime: 10
      requestTimeout: 600
      retries: 1
      #      success response code
      successCode: 200
    failover:
      table: chfailover
      #     After reaching the maximum number of failed writes, the components of the data backup
      storage: kafka #kafka|mysql|hbase|hdfs
      mysql:
        driverClassName: com.mysql.cj.jdbc.Driver
        jdbcUrl: jdbc:mysql://localhost:3306/test?useSSL=false&allowPublicKeyRetrieval=true
        username: $user
        password: $pass
      kafka:
        bootstrap.servers: localhost:9092
        topic: test1
        group.id: user_01
        auto.offset.reset: latest
      hbase:
        zookeeper.quorum: localhost
        zookeeper.property.clientPort: 2181
      hdfs:
        path: /data/chfailover
        namenode: hdfs://localhost:8020
        user: hdfs
```
#### Write to clickhouse

<Tabs>
<TabItem value="Scala" label="Scala">

```scala

import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.sink.ClickHouseSink
import org.apache.flink.api.scala._

object ClickHouseSinkApp extends FlinkStreaming {

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


    // asynchronous write
    ClickHouseSink().sink[TestEntity](source)(x => {
      s"(${x.userId},${x.siteId})"
    }).setParallelism(1)

  }

}

class Order(val marketId: String, val timestamp: String) extends Serializable
```
</TabItem>
</Tabs>

:::info warn
Due to the high latency of single insertion of ClickHouse, partitions will be merged too frequently by the ClickHouse server,
because of frequent writing of small data.It is recommended to use the asynchronous submission method and set a reasonable threshold to improve performance.

Since ClickHouse will re-add data to the cache queue when asynchronous writing fails, it may cause the same window of data to be written in two batches.
It is recommended to fully test the stability of ClickHouse in scenarios with high real-time requirements.

After the asynchronous write data reaches the maximum retry value, the data will be backed up to the external component,
and the component connection will be initialized at this time. It is recommended to ensure the availability of the failover component.
:::

## Other configuration

All other configurations must comply with the **ClickHouseDataSource** connection pool configuration.
For specific configurable items and the role of each parameter, please refer to the `ClickHouse-JDBC` [official website documentation](https://github.com/ClickHouse/clickhouse-jdbc).

