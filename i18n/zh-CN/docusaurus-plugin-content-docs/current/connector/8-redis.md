---
id: 'Redis-Connector'
title: 'Redis Connector'
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Redis](http://www.redis.cn/)是一个开源内存数据结构存储系统，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据
结构，如 字符串（strings）， 散列（hashes）， 列表（lists）， 集合（sets）， 有序集合（sorted sets） 与范围查询， bitmaps，
hyperloglogs 和 地理空间（geospatial） 索引半径查询。 Redis 内置了事务（transactions） 和不同级别的 磁盘持久化（persistence），
并通过 Redis哨兵（Sentinel）和自动 分区（Cluster）提供高可用性（high availability）。

flink官方未提供写入reids数据的连接器。StreamPark 基于[Flink Connector Redis](https://bahir.apache.org/docs/flink/current/flink-streaming-redis/)
封装了RedisSink、配置redis连接参数，即可自动创建redis连接简化开发。目前RedisSink支持连接方式有：单节点模式、哨兵模式，因集群模式不支持事务，目前未支持。

StreamPark 使用Redis的 **MULTI** 命令开启事务，**EXEC** 命令提交事务，细节见链接:
http://www.redis.cn/topics/transactions.html ，使用RedisSink 默认支持AT_LEAST_ONCE (至少一次)的处理语义。在开启checkpoint情况下支持EXACTLY_ONCE语义。

:::tip 提示
redis 为key,value类型数据库，AT_LEAST_ONCE语义下flink作业出现异常重启后最新的数据会覆盖上一版本数据，达到最终数据一致。如果有外部程序在重启期间读取了数据会有和最终数据不一致的风险。
EXACTLY_ONCE语义下会在flink作业checkpoint整体完成情况下批量写入redis，会有一个checkpoint时间间隔的延时。请根据业务场景选择合适语义。
:::

## Redis写入依赖
Flink Connector Redis 官方提供两种，以下两种api均相同，StreamPark 使用的是org.apache.bahir依赖
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

## 常规方式写Redis

常规方式下使用Flink Connector Redis写入数据的方式如下:

### 1.接入source

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
     * @param userId      : 用户Id
     * @param orderId     : 订单ID
     * @param siteId      : 站点ID
     * @param cityId      : 城市Id
     * @param orderStatus : 订单状态(1:下单,0:退单)
     * @param price       : 单价
     * @param quantity    : 订单数量
     * @param timestamp   : 下单时间
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

### 2. 写入redis

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
        //1.获取执行环境
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.setParallelism(1);

        //2.读数据并转换为JavaBean
        DataStreamSource<TestEntity> source = env.addSource(new TestSource(), TypeInformation.of(TestEntity.class));
        //3.将数据写入Redis
        FlinkJedisPoolConfig jedisPoolConfig = new FlinkJedisPoolConfig.Builder()
                .setHost("localhost")
                .setPort(6379)
                .build();
        source.addSink(new RedisSink<>(jedisPoolConfig, new MyRedisMapper()));

        //4.执行任务
        env.execute();
    }

    public static class MyRedisMapper implements RedisMapper<TestEntity> {
        @Override
        public RedisCommandDescription getCommandDescription() {
            // 返回存在Redis中的数据类型  存储的是Hash, 第二个参数是外面的key
            return new RedisCommandDescription(RedisCommand.HSET, "");
        }

        @Override
        public String getKeyFromData(TestEntity data) {
            // 从数据中获取Key: Hash的Key
            return String.valueOf(data.userId());
        }

        @Override
        public String getValueFromData(TestEntity data) {
            // 从数据中获取Value: Hash的value
            return String.valueOf(data.price());
        }
    }

}
```

以上创建FlinkJedisPoolConfig较繁琐，redis的每种操作都要构建RedisMapper,非常的不灵敏。`StreamPark`使用约定大于配置、自动配置的方式只需要配置redis
连接参数、flink运行参数，StreamPark 会自动组装source和sink，极大的简化开发逻辑，提升开发效率和维护性。

## StreamPark 写入 Redis

RedisSink 默认为AT_LEAST_ONCE (至少一次)的处理语义，在开启checkpoint情况下两阶段段提交支持EXACTLY_ONCE语义，可使用的连接类型： 单节点模式、哨兵模式。

### 1. 配置策略和连接信息

<Tabs>
<TabItem value="单节点配置" default>

```yaml
#redis sink 配置
redis.sink:
  host: 127.0.0.1 #必须参数
  #选填参数
  port: 6379
  database: 2
  password:
  connectType: jedisPool #可选参数：jedisPool（默认）|sentinel
  maxTotal:
  maxIdle:
  minIdle:
  connectionTimeout:
```

</TabItem>

<TabItem value="哨兵模式配置" default>

```yaml
#redis sink 配置
redis.sink:
  masterName: master 哨兵模式参数
  host: 192.168.0.1:6379, 192.168.0.3:6379 #必须参数，必须指定连接的port
  connectType: sentinel
  #选填参数
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

### 2. 写入Redis

用 StreamPark 写入redis非常简单,代码如下:

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
     * 创造读取数据的源头
     */
    val source = context.addSource(new TestSource)


    // Redis sink..................
    //1)定义 RedisSink
    val sink: RedisSink = RedisSink()
    //2)写Mapper映射
    val personMapper: RedisMapper[TestEntity] = RedisMapper[TestEntity](RedisCommand.HSET, "flink_user", _.userId.toString, _.orderId.toString)

    sink.sink[TestEntity](source, personMapper, 60000000).setParallelism(1)

  }

}


/**
 * RedisMapper
 * @param cmd redis 写入命令
 * @param additionalKey 写入额外key,适用于 hset
 * @param key  写入key
 * @param value 写入value
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

如代码所示，StreamPark 会自动加载配置创建RedisSink，用户通过创建需要的RedisMapper对象即完成redis写入操作，**additionalKey为hset时为最外层key其他写入命令无效**。
RedisSink.sink()写入相应的key对应数据是需要指定过期时间，如果未指定默认过期时间为java Integer.MAX_VALUE (67年)。如代码所示：

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

### 支持的redis操作命令

支持redis操作命令如下:

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

:::info 警告
RedisSink 目前支持单节点模式、哨兵模式连接，集群模式不支持事务，StreamPark 目前为支持，如有使用场景，请调用Flink Connector Redis官方api。<br></br>
EXACTLY_ONCE语义下必须开启checkpoint，否则程序会抛出参数异常。<br></br>
EXACTLY_ONCE语义下checkpoint的数据sink缓存在内存里面，需要根据实际数据合理设置checkpoint时间间隔，否则有**oom**的风险。<br></br>
:::

## 其他配置

其他的所有的配置都必须遵守 **StreamPark** 配置,具体可配置项和各个参数的作用请参考[项目配置](/docs/development/conf)
