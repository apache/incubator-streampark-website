---
id: 'Redis-Connector'
title: 'Redis Connector'
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Redis](http://www.redis.cn/) is an open source in-memory data structure storage system that can be used as a database, cache, and messaging middleware. It supports many types of data structures such as strings, hashes, lists, sets, ordered sets and range queries, bitmaps, hyperlogloglogs and geospatial index radius queries. Redis has built-in transactions and various levels of disk persistence, and provides high availability through Redis Sentinel and Cluster.

 Flink does not officially provide a connector for writing reids data.StreamPark is based on [Flink Connector Redis](https://bahir.apache.org/docs/flink/current/flink-streaming-redis/)
It encapsulates RedisSink, configures redis connection parameters, and automatically creates redis connections to simplify development. Currently, RedisSink supports the following connection methods: single-node mode, sentinel mode, and cluster mode because it does not support transactions.

StreamPark uses Redis' **MULTI** command to open a transaction and the **EXEC** command to commit a transaction, see the link for details:
http://www.redis.cn/topics/transactions.html , using RedisSink supports AT_LEAST_ONCE (at least once) processing semantics by default. EXACTLY_ONCE semantics are supported with checkpoint enabled.

:::tip tip
redis is a key,value type database, AT_LEAST_ONCE semantics flink job with abnormal restart the latest data will overwrite the previous version of data to achieve the final data consistency. If an external program reads the data during the restart, there is a risk of inconsistency with the final data.
EXACTLY_ONCE semantics will write to redis in batch when the flink job checkpoint is completed as a whole, and there will be a delay of checkpoint interval. Please choose the appropriate semantics according to the business scenario.
:::

## Redis Write Dependency
Flink Connector Redis officially provides two kinds, the following two api are the same, StreamPark is using org.apache.bahir dependency.
```xml
<dependency>
    <groupId>org.apache.bahir</groupId>
    <artifactId>flink-connector-redis_2.11</artifactId>
    <version>1.0</version>
</dependency>
```
```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-redis_2.10</artifactId>
    <version>1.1.5</version>
</dependency>
```

## Writing Redis the Regular Way

The regular way of writing data using Flink Connector Redis is as follows:

### 1.Access to source

```java
import org.apache.flink.streaming.api.functions.source.SourceFunction;
import scala.util.Random;

public class TestSource implements SourceFunction<TestEntity> {

    private boolean isRunning = true;

    private Random random = new Random();

    private int index = 0;

    @Override
    public void run(SourceContext<TestEntity> sourceContext) throws Exception {
        while (isRunning && index <= 1000001) {
            index += 1;
            long userId = System.currentTimeMillis();
            long orderId = random.nextInt(100);
            int status = random.nextInt(1);
            double price = random.nextDouble();
            int quantity = new Random().nextInt(10);
            TestEntity order = new TestEntity(userId, orderId, 1l, 1l, status, price, quantity, System.currentTimeMillis());
            sourceContext.collect(order);
        }
    }

    @Override
    public void cancel() {
        this.isRunning = false;
    }
}
class TestEntity {
    Long userId;
    Long orderId;
    Long siteId;
    Long cityId;
    Integer orderStatus;
    Double price;
    Integer quantity;
    Long timestamp;

    /**
     * @param userId      : User ID
     * @param orderId     : Order ID
     * @param siteId      : Site ID
     * @param cityId      : City ID
     * @param orderStatus : Order status(1:Place order,0:Return order)
     * @param price       : Unit price
     * @param quantity    : Number of orders
     * @param timestamp   : Order time
     */
    public TestEntity(Long userId, Long orderId, Long siteId, Long cityId, Integer orderStatus, Double price, Integer quantity, Long timestamp) {
        this.userId = userId;
        this.orderId = orderId;
        this.siteId = siteId;
        this.cityId = cityId;
        this.orderStatus = orderStatus;
        this.price = price;
        this.quantity = quantity;
        this.timestamp = timestamp;
    }
}

```

### 2. Write to redis

```java
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.redis.RedisSink;
import org.apache.flink.streaming.connectors.redis.common.config.FlinkJedisPoolConfig;
import org.apache.flink.streaming.connectors.redis.common.mapper.RedisCommand;
import org.apache.flink.streaming.connectors.redis.common.mapper.RedisCommandDescription;
import org.apache.flink.streaming.connectors.redis.common.mapper.RedisMapper;

public class FlinkRedisSink {

    public static void main(String[] args) throws Exception {
        //1.Get the execution environment
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.setParallelism(1);

        //2.Read data and convert to JavaBean
        DataStreamSource<TestEntity> source = env.addSource(new TestSource(), TypeInformation.of(TestEntity.class));
        //3.Write Data to Redis
        FlinkJedisPoolConfig jedisPoolConfig = new FlinkJedisPoolConfig.Builder()
                .setHost("localhost")
                .setPort(6379)
                .build();
        source.addSink(new RedisSink<>(jedisPoolConfig, new MyRedisMapper()));

        //4.Perform the task
        env.execute();
    }

    public static class MyRedisMapper implements RedisMapper<TestEntity> {
        @Override
        public RedisCommandDescription getCommandDescription() {
            // Returns the type of data that exists in Redis, stored as a hash, with the second parameter being the outside key
            return new RedisCommandDescription(RedisCommand.HSET, "");
        }

        @Override
        public String getKeyFromData(TestEntity data) {
            // Get Key from data: Key of Hash
            return String.valueOf(data.userId());
        }

        @Override
        public String getValueFromData(TestEntity data) {
            // Get Value from data: Value of Hash
            return String.valueOf(data.price());
        }
    }

}
```

The above creation of FlinkJedisPoolConfig is tedious, and each operation of redis has to build RedisMapper, which is very insensitive. `StreamPark` uses a convention over configuration and automatic configuration. This only requires configuring redis
StreamPark automatically assembles the source and sink parameters, which greatly simplifies the development logic and improves development efficiency and maintainability.

## StreamPark Writes to Redis

RedisSink defaults to AT_LEAST_ONCE (at least once) processing semantics, two-stage segment submission supports EXACTLY_ONCE semantics with checkpoint enabled, available connection types: single-node mode, sentinel mode.

### 1. Configure policy and connection information

<Tabs>
<TabItem value="Single-node configuration" default>

```yaml
#redis sink configuration
redis.sink:
  host: 127.0.0.1 #Required parameters
  #Optional parameters
  port: 6379
  database: 2
  password:
  connectType: jedisPool #Optional parameters: jedisPool（默认）|sentinel
  maxTotal:
  maxIdle:
  minIdle:
  connectionTimeout:
```

</TabItem>

<TabItem value="Sentinel mode configuration" default>

```yaml
#redis sink configuration
redis.sink:
  masterName: master # Sentinel mode parameters
  host: 192.168.0.1:6379, 192.168.0.3:6379 # Required parameter, must specify the port of the connection
  connectType: sentinel
  #Optional parameters
  soTimeout: 6379
  database: 2
  password:
  maxTotal:
  maxIdle:
  minIdle:
  connectionTimeout:
```

</TabItem>

</Tabs>

### 2. Write to Redis

Writing to redis with StreamPark is very simple, the code is as follows:

<Tabs>

<TabItem value="scala">

```scala

import org.apache.streampark.flink.core.scala.FlinkStreaming
import org.apache.streampark.flink.core.scala.sink.{RedisMapper, RedisSink}
import org.apache.flink.api.scala._
import org.apache.flink.streaming.connectors.redis.common.mapper.RedisCommand
import org.json4s.DefaultFormats

object FlinkRedisSinkApp extends FlinkStreaming {

  @transient
  implicit lazy val formats: DefaultFormats.type = org.json4s.DefaultFormats

  override def handle(): Unit = {

    /**
     * Create the source of read data
     */
    val source = context.addSource(new TestSource)


    // Redis sink..................
    //1)Define RedisSink
    val sink: RedisSink = RedisSink()
    //2)Write Mapper's mapping
    val personMapper: RedisMapper[TestEntity] = RedisMapper[TestEntity](RedisCommand.HSET, "flink_user", _.userId.toString, _.orderId.toString)

    sink.sink[TestEntity](source, personMapper, 60000000).setParallelism(1)

  }

}


/**
 * RedisMapper
 * @param cmd redis -Write command
 * @param additionalKey -Write additional keys, applicable to hset
 * @param key -Write key
 * @param value -Write value
 * @tparam T
 */
case class RedisMapper[T](cmd: RedisCommand, additionalKey: String, key: T => String, value: T => String) extends RMapper[T] {

  override def getCommandDescription: RedisCommandDescription = new RedisCommandDescription(cmd, additionalKey)

  override def getKeyFromData(r: T): String = key(r)

  override def getValueFromData(r: T): String = value(r)

}
```
</TabItem>
</Tabs>

As the code shows, StreamPark automatically loads the configuration to create a RedisSink, and the user completes the redis write operation by creating the required RedisMapper object, **additionalKey is the outermost key when hset is invalid for other write commands**.
RedisSink.sink() write the corresponding key corresponding to the data is required to specify the expiration time, if not specified default expiration time is java Integer.MAX_VALUE (67 years). As shown in the code.

```scala
class RedisSink() extends Sink {

  def sink[T](stream: DataStream[T], mapper: RedisMapper[T], ttl: Int = Int.MaxValue): DataStreamSink[T] = {
    val sinkFun = (enableCheckpoint, cpMode) match {
      case (false, CheckpointingMode.EXACTLY_ONCE) => throw new IllegalArgumentException("redis sink EXACTLY_ONCE must enable checkpoint")
      case (true, CheckpointingMode.EXACTLY_ONCE) => new Redis2PCSinkFunction[T](config, mapper, ttl)
      case _ => new RedisSinkFunction[T](config, mapper, ttl)
    }
    val sink = stream.addSink(sinkFun)
    afterSink(sink, parallelism, name, uid)
  }

}

```

### Supported redis operating commands

The following commands are supported for redis operations:

```java
public enum RedisCommand {

    /**
     * Insert the specified value at the head of the list stored at key.
     * If key does not exist, it is created as empty list before performing the push operations.
     */
    LPUSH(RedisDataType.LIST),

    /**
     * Insert the specified value at the tail of the list stored at key.
     * If key does not exist, it is created as empty list before performing the push operation.
     */
    RPUSH(RedisDataType.LIST),

    /**
     * Add the specified member to the set stored at key.
     * Specified member that is already a member of this set is ignored.
     */
    SADD(RedisDataType.SET),

    /**
     * Set key to hold the string value. If key already holds a value,
     * it is overwritten, regardless of its type.
     */
    SET(RedisDataType.STRING),

    /**
     * Adds the element to the HyperLogLog data structure stored at the variable name specified as first argument.
     */
    PFADD(RedisDataType.HYPER_LOG_LOG),

    /**
     * Posts a message to the given channel.
     */
    PUBLISH(RedisDataType.PUBSUB),

    /**
     * Adds the specified members with the specified score to the sorted set stored at key.
     */
    ZADD(RedisDataType.SORTED_SET),

    /**
     * Removes the specified members from the sorted set stored at key.
     */
    ZREM(RedisDataType.SORTED_SET),

    /**
     * Sets field in the hash stored at key to value. If key does not exist,
     * a new key holding a hash is created. If field already exists in the hash, it is overwritten.
     */
    HSET(RedisDataType.HASH);
}
```

:::info Warning
RedisSink currently supports single-node mode and sentinel mode connections. And its cluster mode does not support transactions, but StreamPark is currently for support. Please call the official Flink Connector Redis api if you have a usage scenario.<br />
Checkpoint must be enabled under EXACTLY_ONCE semantics, otherwise the program will throw parameter exceptions.<br />
EXACTLY_ONCE semantics checkpoint data sink cache inside the memory, you need to reasonably set the checkpoint interval according to the actual data, otherwise there is a risk of **oom**.<br />
:::

## Other Configuration

All other configurations must adhere to the **StreamPark** configuration, please refer to [project configuration](/docs/development/conf) for specific configurable items and the role of each parameter.
