---
id: 'Doris-Connector'
title: 'Apache Doris Connector'
original: true
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Apache Doris Connector

[Apache Doris](https://doris.apache.org/) is a high-performance, and real-time analytical database,
which could support high-concurrent point query scenarios.
StreamPark encapsulates DoirsSink for writing data to Doris in real-time, based on  [Doris' stream loads](https://doris.apache.org/administrator-guide/load-data/stream-load-manual.html)

### Write with StreamPark

Use `StreamPark` to write data to `Doris`.  DorisSink only supports JSON format (single-layer) writing currently,
such as: {"id":1,"name":"streampark"} The example of the running program is java, as follows:

#### configuration list

```yaml
doris.sink:
  fenodes:  127.0.0.1:8030    //doris fe http url
  database: test            //doris database
  table: test_tbl           //doris table
  user: root
  password: 123456
  batchSize: 100         //doris sink batch size per streamload
  intervalMs: 3000      //doris sink the time interval of each streamload
  maxRetries: 1          //stream load retries
  streamLoad:              //doris streamload own parameters
    format: json
    strip_outer_array: true
    max_filter_ratio: 1
```

#### write data to Doris

<Tabs>
<TabItem value="Java" label="Java">

```java
package org.apache.streampark.test.flink.java.datastream;

import org.apache.streampark.flink.core.StreamEnvConfig;
import org.apache.streampark.flink.core.java.sink.doris.DorisSink;
import org.apache.streampark.flink.core.java.source.KafkaSource;
import org.apache.streampark.flink.core.scala.StreamingContext;
import org.apache.streampark.flink.core.scala.source.KafkaRecord;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.streaming.api.datastream.DataStream;

public class DorisJavaApp {

    public static void main(String[] args) {
        StreamEnvConfig envConfig = new StreamEnvConfig(args, null);
        StreamingContext context = new StreamingContext(envConfig);
        DataStream<String> source = new KafkaSource<String>(context)
            .getDataStream()
            .map((MapFunction<KafkaRecord<String>, String>) KafkaRecord::value)
            .returns(String.class);

        new DorisSink<String>(context).sink(source);

        context.start();
    }
}

```
</TabItem>
</Tabs>

:::tip hint

It is recommended to set batchSize to insert data in batches to improve performance.
At the same time, to improve real-time performance, intervalMs is supported for batch writing.
The number of streamload retries can be increased by setting maxRetries.

:::
