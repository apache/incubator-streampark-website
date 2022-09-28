---
id: 'hadoop-resource-integration'
title: 'Hadoop resource integration'
sidebar_position: 3
---

## Using Hadoop resource in Flink on K8s

Using Hadoop resources under the StreamPark Flink-K8s runtime, such as checkpoint mount HDFS, read and write Hive, etc. The general process is as follows:

#### 1、HDFS

​       To put flink on k8s related resources in HDFS, you need to go through the following two steps:

##### i、add `shade jar`

​            By default, the flink image pulled from Docker does not include hadoop-related jars. Here, flink:1.14.5-scala_2.12-java8 is taken as an example, as follows:

```shell
[flink@ff]  /opt/flink-1.14.5/lib
$ ls
flink-csv-1.14.5.jar        flink-shaded-zookeeper-3.4.14.jar  log4j-api-2.17.1.jar
flink-dist_2.12-1.14.5.jar  flink-table_2.12-1.14.5.jar        log4j-core-2.17.1.jar
flink-json-1.14.5.jar       log4j-1.2-api-2.17.1.jar           log4j-slf4j-impl-2.17.1.jar
```

​         This is to download the shaded jar and put it in the lib directory of flink. Take hadoop2 as an example, download `flink-shaded-hadoop-2-uber`：https://repo1.maven.org/maven2/org/apache/flink/flink-shaded-hadoop-2-uber/2.7.5-9.0/flink-shaded-hadoop-2-uber-2.7.5-9.0.jar

​	In addition, you can configure the shade jar in a dependent manner in the `Dependency` in the StreamPark task configuration. the following configuration:

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-shaded-hadoop-2-uber</artifactId>
    <version>2.7.5-9.0</version>
    <scope>provided</scope>
</dependency>
```

##### ii、add `core-site.xml` and `hdfs-site.xml`

​            With the shade jar, you also need the corresponding configuration file to find the hadoop address. Two configuration files are mainly involved here: `core-site.xml` and `hdfs-site.xml`, through the source code analysis of flink (the classes involved are mainly: org .apache.flink.kubernetes.kubeclient.parameters.AbstractKubernetesParameters), the two files have a fixed loading order, as follows:

```java
// The process of finding hadoop configuration files:
// 1、Find out whether parameters have been added:${kubernetes.hadoop.conf.config-map.name}
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
    // 2、If there is no parameter specified in "1", find out whether the local environment where the native command is submitted has environment variables：${HADOOP_CONF_DIR}
    final String hadoopConfDirEnv = System.getenv(Constants.ENV_HADOOP_CONF_DIR);
    if (StringUtils.isNotBlank(hadoopConfDirEnv)) {
        return Optional.of(hadoopConfDirEnv);
    }
    // 3、If there are no "2" environment variables, continue to see if there are environment variables:${HADOOP_HOME}
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
// If "1", "2", and "3" are not found, there is no hadoop environment
if (hadoopConfigurationFileItems.isEmpty()) {
    LOG.warn("Found 0 files in directory {}, skip to mount the Hadoop Configuration ConfigMap.", localHadoopConfigurationDirectory.get());
    return flinkPod;
}
// If "2" or "3" exists, it will look for the core-site.xml and hdfs-site.xml files in the path where the above environment variables are located
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
// If the above files are found, it means that there is a hadoop environment. The above two files will be parsed into kv pairs, and then constructed into a ConfigMap. The naming rules are as follows:
public static String getHadoopConfConfigMapName(String clusterId) {
    return Constants.HADOOP_CONF_CONFIG_MAP_PREFIX + clusterId;
}
```



#### 2、Hive

​        To sink data to hive, or use hive metastore as flink's metadata, it is necessary to open the path from flink to hive, which also needs to go through the following two steps:

##### i、Add hive related jars

​	     As mentioned above, the default flink image does not include hive-related jars. The following three hive-related jars need to be placed in the lib directory of flink. Here, hive version 2.3.6 is used as an example:

​                a、`hive-exec`：https://repo1.maven.org/maven2/org/apache/hive/hive-exec/2.3.6/hive-exec-2.3.6.jar

​                b、`flink-connector-hive`：https://repo1.maven.org/maven2/org/apache/flink/flink-connector-hive_2.12/1.14.5/flink-connector-hive_2.12-1.14.5.jar

​                c、`flink-sql-connector-hive`：https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-hive-2.3.6_2.12/1.14.5/flink-sql-connector-hive-2.3.6_2.12-1.14.5.jar

​            Similarly, the above-mentioned hive-related jars can also be dependently configured in the `Dependency` in the task configuration of StreamPark in a dependent manner, which will not be repeated here.

##### ii、Add hive configuration file (hive-site.xml)

​	       The difference from hdfs is that there is no default loading method for the hive configuration file in the flink source code, so developers need to manually add the hive configuration file. There are three main methods here:

​                  a. Put hive-site.xml in the custom image of flink, it is generally recommended to put it under the `/opt/flink/` directory in the image

​                  b. Put hive-site.xml behind the remote storage system, such as HDFS, and load it when it is used

​                  c. Mount hive-site.xml in k8s in the form of ConfigMap. It is recommended to use this method, as follows:

```shell
# 1、Mount the hive-site.xml at the specified location in the specified namespace
kubectl create cm hive-conf --from-file=hive-site.xml -n flink-test
# 2、View the hive-site.xml mounted to k8s
kubectl describe cm hive-conf -n flink-test 
# 3、Mount this cm to the specified directory inside the container
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



#### Conclusion

​        Through the above method, flink can be connected with hadoop and hive. This method can be extended to general, that is, flink and external systems such as redis, mongo, etc., generally require the following two steps:

​        i. Load the connector jar of the specified external service

​        ii. If there is, load the specified configuration file into the flink system



