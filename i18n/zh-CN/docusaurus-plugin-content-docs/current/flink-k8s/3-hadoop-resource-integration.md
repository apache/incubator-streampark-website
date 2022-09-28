---
id: 'hadoop-resource-integration'
title: 'Hadoop 资源集成'
sidebar_position: 3
---

## 在 Flink on K8s 上使用 Hadoop 资源

在 StreamPark Flink-K8s runtime 下使用 Hadoop 资源，如 checkpoint 挂载 HDFS、读写 Hive 等，大概流程如下：

#### 1、HDFS

​       如需将 flink on k8s 相关资源放在 HDFS 中，需要经过以下两个步骤：

##### i、添加 `shade jar`

​           默认情况下，从 Docker 上 pull 的 flink 镜像是不包括 hadoop 相关的 jar，这里以 flink:1.14.5-scala_2.12-java8 为例，如下：

```shell
[flink@ff]  /opt/flink-1.14.5/lib
$ ls
flink-csv-1.14.5.jar        flink-shaded-zookeeper-3.4.14.jar  log4j-api-2.17.1.jar
flink-dist_2.12-1.14.5.jar  flink-table_2.12-1.14.5.jar        log4j-core-2.17.1.jar
flink-json-1.14.5.jar       log4j-1.2-api-2.17.1.jar           log4j-slf4j-impl-2.17.1.jar
```

​         这是需要将 shade jar 下载下来，然后放在 flink 的 lib 目录下，这里 以hadoop2 为例，下载 `flink-shaded-hadoop-2-uber`：https://repo1.maven.org/maven2/org/apache/flink/flink-shaded-hadoop-2-uber/2.7.5-9.0/flink-shaded-hadoop-2-uber-2.7.5-9.0.jar

​	另外，可以将 shade jar 以依赖的方式在 StreamPark 的任务配置中的`Dependency` 进行依赖配置，如下配置：

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-shaded-hadoop-2-uber</artifactId>
    <version>2.7.5-9.0</version>
    <scope>provided</scope>
</dependency>
```

##### ii、添加 core-site.xml 和 hdfs-site.xml

​            有了 shade jar 还需要相应的配置文件去找到 hadoop 地址，这里主要涉及到两个配置文件：core-site.xml和hdfs-site.xml，通过 flink 的源码分析(涉及到的类主要是：org.apache.flink.kubernetes.kubeclient.parameters.AbstractKubernetesParameters)，该两文件有固定的加载顺序，如下：

```java
// 寻找 hadoop 配置文件的流程
// 1、先去寻在是否添加了参数：kubernetes.hadoop.conf.config-map.name
@Override
public Optional<String> getExistingHadoopConfigurationConfigMap() {
    final String existingHadoopConfigMap =
            flinkConfig.getString(KubernetesConfigOptions.HADOOP_CONF_CONFIG_MAP);
    if (StringUtils.isBlank(existingHadoopConfigMap)) {
        return Optional.empty();
    } else {
        return Optional.of(existingHadoopConfigMap.trim());
    }
}

@Override
public Optional<String> getLocalHadoopConfigurationDirectory() {
    // 2、如果没有1中指定的参数，查找提交 native 命令的本地环境是否有环境变量：HADOOP_CONF_DIR
    final String hadoopConfDirEnv = System.getenv(Constants.ENV_HADOOP_CONF_DIR);
    if (StringUtils.isNotBlank(hadoopConfDirEnv)) {
        return Optional.of(hadoopConfDirEnv);
    }
    // 3、如果没有2中环境变量，再继续看是否有环境变量：HADOOP_HOME
    final String hadoopHomeEnv = System.getenv(Constants.ENV_HADOOP_HOME);
    if (StringUtils.isNotBlank(hadoopHomeEnv)) {
        // Hadoop 2.x
        final File hadoop2ConfDir = new File(hadoopHomeEnv, "/etc/hadoop");
        if (hadoop2ConfDir.exists()) {
            return Optional.of(hadoop2ConfDir.getAbsolutePath());
        }

        // Hadoop 1.x
        final File hadoop1ConfDir = new File(hadoopHomeEnv, "/conf");
        if (hadoop1ConfDir.exists()) {
            return Optional.of(hadoop1ConfDir.getAbsolutePath());
        }
    }

    return Optional.empty();
}

final List<File> hadoopConfigurationFileItems = getHadoopConfigurationFileItems(localHadoopConfigurationDirectory.get());
// 如果没有找到1、2、3说明没有 hadoop 环境
if (hadoopConfigurationFileItems.isEmpty()) {
    LOG.warn("Found 0 files in directory {}, skip to mount the Hadoop Configuration ConfigMap.", localHadoopConfigurationDirectory.get());
    return flinkPod;
}
//如果2或者3存在，会在路径下查找 core-site.xml 和 hdfs-site.xml 文件
private List<File> getHadoopConfigurationFileItems(String localHadoopConfigurationDirectory) {
    final List<String> expectedFileNames = new ArrayList<>();
    expectedFileNames.add("core-site.xml");
    expectedFileNames.add("hdfs-site.xml");

    final File directory = new File(localHadoopConfigurationDirectory);
    if (directory.exists() && directory.isDirectory()) {
        return Arrays.stream(directory.listFiles())
                .filter(
                        file ->
                                file.isFile()
                                        && expectedFileNames.stream()
                                                .anyMatch(name -> file.getName().equals(name)))
                .collect(Collectors.toList());
    } else {
        return Collections.emptyList();
    }
}
// 如果找到上述文件，说明有 hadoop 的环境，将会把上述两个文件解析为 kv 对，然后构建成一个 ConfigMap，名字命名规则如下：
public static String getHadoopConfConfigMapName(String clusterId) {
    return Constants.HADOOP_CONF_CONFIG_MAP_PREFIX + clusterId;
}
```



#### 2、Hive

​        将数据 sink 到 hive，或者以 hive 的 metastore 作为 flink 的元数据，都需要打通 flink 到 hive 的路径，同样需要经过一下两个步骤：

##### i、添加 hive 相关的 jar

​	     如上所述，默认 flink 镜像是不包括 hive 相关的 jar，需要将 hive 相关的如下三个 jar 放在 flink 的 lib 目录下，这里以 hive 2.3.6 版本为例：

​                a、`hive-exec`：https://repo1.maven.org/maven2/org/apache/hive/hive-exec/2.3.6/hive-exec-2.3.6.jar

​                b、`flink-connector-hive`：https://repo1.maven.org/maven2/org/apache/flink/flink-connector-hive_2.12/1.14.5/flink-connector-hive_2.12-1.14.5.jar

​                c、`flink-sql-connector-hive`：https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-hive-2.3.6_2.12/1.14.5/flink-sql-connector-hive-2.3.6_2.12-1.14.5.jar

​               同样，也可以将上述 hive 相关 jar 以依赖的方式在 StreamPark 的任务配置中的`Dependency` 进行依赖配置，这里不再赘述。

##### ii、添加 hive 的配置文件（hive-site.xml）

​	       和 hdfs 所不同的是，flink 源码中并没有 hive 的配置文件的默认的加载方式，因此需要开发者手动添加 hive 的配置文件，这里主要采用三种方式：

​		a、将 hive-site.xml 打在 flink 的自定义镜像之中，一般建议放在镜像里的`/opt/flink/`目录之下

​		b、将 hive-site.xml 放在远端的存储系统之后，例如 HDFS，在使用的时候进行加载

​		c、将 hive-site.xml 以 ConfigMap 的形式挂载在 k8s 之中，建议使用此种方式，如下：

```shell
# 1、在指定的 ns 中挂载指定位置的 hive-site.xml
kubectl create cm hive-conf --from-file=hive-site.xml -n flink-test
# 2、查看挂载到 k8s 中的 hive-site.xml
kubectl describe cm hive-conf -n flink-test 
# 3、将此 cm 挂载到容器内指定的目录
spec:
  containers:
    - name: flink-main-container
      volumeMounts:
        - mountPath: /opt/flink/hive
          name: hive-conf
  volumes:
    - name: hive-conf
      configMap:
        name: hive-conf
        items:
          - key: hive-site.xml
            path: hive-site.xml
```



#### 总结

​        通过以上的方式便可以将 flink 和 hadoop、hive 打通，此方法可推广至一般，即 flink 与外部系统如redis、mongo 等连通，一般需要如下两个步骤：

​        i、加载指定外部服务的 connector jar

​	ii、如果有，加载指定的配置文件到 flink 系统之中



