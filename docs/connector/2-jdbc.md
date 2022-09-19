---
id: 'Jdbc-Connector'
title: 'JDBC Connector'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Flink officially provides the [JDBC](https://ci.apache.org/projects/flink/flink-docs-release-1.12/dev/connectors/jdbc.html) connector for reading from or writing to JDBC, which can provides **AT_LEAST_ONCE** (at least once) processing semantics

`StreamPark` implements **EXACTLY_ONCE** (Exactly Once) semantics of `JdbcSink` based on two-stage commit, and uses [`HikariCP`](https://github.com/brettwooldridge/HikariCP) as connection pool to make data reading and write data more easily and accurately

## JDBC Configuration

The implementation of the `Jdbc Connector` in `StreamPark` uses the [`HikariCP`](https://github.com/brettwooldridge/HikariCP) connection pool, which is configured under the namespace of `jdbc`, and the agreed configuration is as follows:

```yaml
jdbc:
  semantic: EXACTLY_ONCE # EXACTLY_ONCE|AT_LEAST_ONCE|NONE
  username: root
  password: 123456
  driverClassName: com.mysql.jdbc.Driver
  connectionTimeout: 30000
  idleTimeout: 30000
  maxLifetime: 30000
  maximumPoolSize: 6
  jdbcUrl: jdbc:mysql://localhost:3306/test?useSSL=false&allowPublicKeyRetrieval=true
```

### Semantic

The parameter `semantic` is the semantics when writing in `JdbcSink`, only effect for **JdbcSink**, `JdbcSource` will automatically mask this parameter, there are three options

<div class="counter">

* EXACTLY_ONCE
* AT_LEAST_ONCE
* NONE

</div>

#### EXACTLY_ONCE

If `JdbcSink` is configured with `EXACTLY_ONCE` semantics, the underlying two-phase commit implementation is used to complete the write, at this time to flink with `Checkpointing` to take effect, how to open checkpoint please refer to Chapter 2 on [checkpoint](/docs/model/conf) configuration section

#### AT_LEAST_ONCE && NONE

The default does not specify that the `NONE` semantics will be used, both configurations have the same effect, both are guaranteed **at least once** semantics


:::tip tip
The benefit of turning on `EXACTLY_ONCE` exactly once is obvious, to ensure the accuracy of the data, but the cost is also high, the need for `checkpoint` support, the underlying simulation of the transaction is submitted to read, there is a certain loss of real-time, if your business requirements for data accuracy is not so high, it is recommended to use `AT_LEAST_ONCE` semantics
:::


### Others

Except for the special `semantic` configuration item, all other configurations must comply with the **HikariCP** connection pool configuration, please refer to the `Light HikariCP` [official website documentation](https://github.com/brettwooldridge/) for the specific configurable items and the role of each parameter. HikariCP#gear-configuration-knobs-baby).

## JDBC read

In `StreamPark`, `JdbcSource` is used to read data, and according to the data `offset` to read data can be replayed, we look at the specific how to use `JdbcSource` to read data, if the demand is as follows

<div class="counter">

* Read data from the `t_order` table, using the `timestamp` field, starting at `2020-12-16 12:00:00` and extracting data from there.
* Construct the read data into an `Order` object and return it

</div>

The jdbc configuration and reading code is as follows

<Tabs>
<TabItem value="Setting" default>

```yaml
jdbc:
  driverClassName: com.mysql.jdbc.Driver
  jdbcUrl: jdbc:mysql://localhost:3306/test?useSSL=false&allowPublicKeyRetrieval=true
  username: root
  password: 123456
```

</TabItem>
<TabItem value="Scala" label="Scala">

```scala
import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.source.JdbcSource
import org.apache.flink.api.scala._

object MySQLSourceApp extends FlinkStreaming {

  override def handle(): Unit = {

    JdbcSource().getDataStream[Order](lastOne => {
      Thread.sleep(5000);
      val laseOffset = if (lastOne == null) "2020-12-16 12:00:00" else lastOne.timestamp
      s"select * from t_order where timestamp > '$laseOffset' order by timestamp asc "
    },
      _.map(x => new Order(x("market_id").toString, x("timestamp").toString))
    ).print()

  }

}

class Order(val marketId: String, val timestamp: String) extends Serializable
```

</TabItem>
<TabItem value="Java" label="Java">

```java
import org.apache.streampark.flink.core.java.function.SQLQueryFunction;
import org.apache.streampark.flink.core.java.function.SQLResultFunction;
import org.apache.streampark.flink.core.java.function.StreamEnvConfigFunction;
import org.apache.streampark.flink.core.java.source.JdbcSource;
import org.apache.streampark.flink.core.scala.StreamingContext;
import org.apache.streampark.flink.core.scala.util.StreamEnvConfig;
import org.apache.flink.api.common.typeinfo.TypeInformation;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class MySQLJavaApp {

    public static void main(String[] args) {
        StreamEnvConfig envConfig = new StreamEnvConfig(args, null);
        StreamingContext context = new StreamingContext(envConfig);
        new JdbcSource<Order>(context)
                .getDataStream(
                        (SQLQueryFunction<Order>) lastOne -> {
                            Thread.sleep(5000);

                            Serializable lastOffset = lastOne == null
                            ? "2020-12-16 12:00:00"
                            : lastOne.timestamp;

                            return String.format(
                                "select * from t_order " +
                                "where timestamp > '%s' " +
                                "order by timestamp asc ",
                                lastOffset
                            );
                        },
                        (SQLResultFunction<Order>) iterable -> {
                            List<Order> result = new ArrayList<>();
                            iterable.forEach(item -> {
                                Order Order = new Order();
                                Order.marketId = item.get("market_id").toString();
                                Order.timestamp = Long.parseLong(item.get("timestamp").toString());
                                result.add(Order);
                            });
                            return result;
                        })
                .returns(TypeInformation.of(Order.class))
                .print();

        context.start();
    }
}
```
</TabItem>
</Tabs>

Take the `java` api as an example, here you have to accept two parameters

<div class="counter">

* `SQLQueryFunction<T> queryFunc`
* `SQLResultFunction<T> resultFunc`

</div>

### queryFunc to get sql

`queryFunc` needs to pass in a `function` of type `SQLQueryFunction`, the `function` is used to get the query sql, will return the last record to the developer, and then the developer needs to return a new query `sql` according to the last record, `queryFunc` is defined as follows :

```java
@FunctionalInterface
public interface SQLQueryFunction<T> extends Serializable {
    /**
     * @return query sql
     */
    String query(T last) throws Exception;
}
```

So the above code, the first time `lastOne` (the last record) equals null, and will be judged, if null will take the default `offset`, query sql according to the `timestamp` field in positive order, so that after the first query, will return the last record, the next time you can directly use this record as the basis for the next query

:::info Cautions
`JdbcSource` implements the `CheckpointedFunction`, that is, when the program opens **checkpoint**, it will save these state data such as `laseOffset` to the `state backend`, so that when the program hangs, it will automatically restore `offset` from `checkpoint`, and continue to read data from the last position,
In the production environment, a more flexible way is writing `lastOffset` to storage, such as `redis`, after each query and then update the offset to `redis`, so that even if the program hangs unexpectedly, you can also get the last `offset` from `redis` for data extract, but also very convenient to adjust `offset` for data replay
:::

### resultFunc process the query data

The parameter type of `resultFunc` is `SQLResultFunction<T>`, which puts a query result set into `Iterable<Map<String, ? >>`, and then returns it to the developer, at the same time, you can see that each iteration of the iterator returns a `Map`, the `Map` records a complete line of records, the `Map` `key` is the query field, `value` is the value, `SQLResultFunction<T>` is defined as follows
```java
@FunctionalInterface
public interface SQLResultFunction<T> extends Serializable {
    Iterable<T> result(Iterable<Map<String, ?>> iterable);
}
```

## JDBC Read Write

In `StreamPark`, `JdbcSink` is used to write data, let's see how to write data with `JdbcSink`, the example is to read data from `kakfa` and write to `mysql`.

<Tabs>
<TabItem value="Setting" default>

```yaml
kafka.source:
  bootstrap.servers: kfk1:9092,kfk2:9092,kfk3:9092
  pattern: user
  group.id: user_02
  auto.offset.reset: earliest # (earliest | latest)
  ...

jdbc:
  semantic: EXACTLY_ONCE # EXACTLY_ONCE|AT_LEAST_ONCE|NONE
  driverClassName: com.mysql.jdbc.Driver
  jdbcUrl: jdbc:mysql://localhost:3306/test?useSSL=false&allowPublicKeyRetrieval=true
  username: root
  password: 123456
```
:::danger Cautions
The configuration under `jdbc` **semantic** is the semantics of writing, as described in [Jdbc Info Configuration](#jdbc-info-config), the configuration will only take effect on `JdbcSink`, `StreamPark` is based on two-phase commit to achieve **EXACTLY_ONCE** semantics,
This requires that the database being manipulated supports transactions(`mysql`, `oracle`, `MariaDB`, `MS SQL Server`), theoretically all databases that support standard Jdbc transactions can do EXACTLY_ONCE (exactly once) write
:::

</TabItem>
<TabItem value="Scala" label="Scala">

```scala
import org.apache.streampark.common.util.JsonUtils
import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.sink.JdbcSink
import org.apache.streampark.flink.core.scala.source.KafkaSource
import org.apache.flink.api.common.typeinfo.TypeInformation
import org.apache.flink.api.java.typeutils.TypeExtractor.getForClass
import org.apache.flink.api.scala._
import org.apache.flink.streaming.connectors.kafka.KafkaDeserializationSchema

object JdbcSinkApp extends FlinkStreaming {

  override def handle(): Unit = {
        val source = KafkaSource()
          .getDataStream[String]()
          .map(x => JsonUtils.read[User](x.value))

        JdbcSink().sink[User](source)(user =>
          s"""
          |insert into t_user(`name`,`age`,`gender`,`address`)
          |value('${user.name}',${user.age},${user.gender},'${user.address}')
          |""".stripMargin
        )
  }

}

case class User(name:String,age:Int,gender:Int,address:String)

```

</TabItem>
<TabItem value="Java" label="Java">

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.streampark.flink.core.java.function.StreamEnvConfigFunction;
import org.apache.streampark.flink.core.java.source.KafkaSource;
import org.apache.streampark.flink.core.scala.StreamingContext;
import org.apache.streampark.flink.core.scala.source.KafkaRecord;
import org.apache.streampark.flink.core.scala.util.StreamEnvConfig;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.streaming.connectors.kafka.KafkaDeserializationSchema;
import org.apache.kafka.clients.consumer.ConsumerRecord;

import java.io.Serializable;

import static org.apache.flink.api.java.typeutils.TypeExtractor.getForClass;

public class JdbcSinkJavaApp {

    public static void main(String[] args) {
        StreamEnvConfig envConfig = new StreamEnvConfig(args, null);
        StreamingContext context = new StreamingContext(envConfig);
        ObjectMapper mapper = new ObjectMapper();

        DataStream<JavaUser> source = new KafkaSource<String>(context)
                .getDataStream()
                .map((MapFunction<KafkaRecord<String>, JavaUser>) value ->
                    mapper.readValue(value.value(), JavaUser.class));

        new JdbcSink<JavaUser>(context)
                .sql((SQLFromFunction<JavaUser>) JavaUser::toSql)
                .sink(source);

        context.start();
    }

}

class JavaUser implements Serializable {
    String name;
    Integer age;
    Integer gender;
    String address;
    public String toSql() {
        return String.format(
                "insert into t_user(`name`,`age`,`gender`,`address`) value('%s',%d,%d,'%s')",
                name,
                age,
                gender,
                address);
    }
}

```
</TabItem>
</Tabs>

### Generate target SQL based on data flow

When writing, you need to know the specific `sql` statement to write, the `sql` statement needs to be provided by the developer by a way of the `function`, in the `scala` api, directly after the `sink` method followed by the `function`, while the `java` api is passed a `function` of type `SQLFromFunction` through the `sql()` method

The following is an example of the `java` api, let's look at the definition of the `function` method that provides sql in the `java` api

```java
@FunctionalInterface
public interface SQLFromFunction<T> extends Serializable {
    /**
     * @param bean
     * @return
     */
    String from(T bean);
}
```

The generic `<T>` on the `SQLFromFunction` is the actual data type in the `DataStream`, the `function` has a method `form(T bean)`, the `bean` is a specific data in the current `DataStream`, the data will be returned to the developer, the developer will based on this data, generate a specific `sql` that can be inserted into the database

### Set to write batch size

In non-`EXACTLY_ONCE` (under the semantics of exactly once) you can set `batch.size` to improve the performance of JDBC writes (provided that the business allows it), configured as follows

```yaml
jdbc:
  semantic: EXACTLY_ONCE # EXACTLY_ONCE|AT_LEAST_ONCE|NONE
  driverClassName: com.mysql.jdbc.Driver
  jdbcUrl: jdbc:mysql://localhost:3306/test?useSSL=false&allowPublicKeyRetrieval=true
  username: root
  password: 123456
  batch.size: 1000
```

In this way, instead of writing data immediately when it comes, and then performs a bulk insert

:::danger Cautions
This setting only takes effect the non-`EXACTLY_ONCE` semantics, the benefit is to improve the performance of Jdbc writes, a large number of data insertion, the disadvantage is that data writing will inevitably have a delay, please use caution according to the actual use of the situation
:::

## Multi-instance JDBC support


## Specify JDBC connection information manually
