---
id: 'k8s-pvc-integration'
title: 'K8S PVC 资源使用'
sidebar_position: 2
---

## K8s PVC 资源使用说明

当前版本 StreamPark Flink-K8s 任务对 PVC 资源（挂载 checkpoint/savepoint/logs 等文件资源）的支持基于 pod-template。

Native-Kubernetes Session 由创建 Session Cluster 时控制，这里不再赘述。Native-Kubernetes Application 支持在 StreamPark 页面上直接编写 `pod-template`，`jm-pod-template`，`tm-pod-template` 配置。

<br/>

以下是一个简要的示例，假设已经提前创建 `flink-checkpoint`， `flink-savepoint` 两个 PVC ：

![K8S PVC](/doc/image/k8s_pvc.png)

pod-template 配置文本如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-template
spec:
  containers:
    - name: flink-main-container
      volumeMounts:
        - name: checkpoint-pvc
          mountPath: /opt/flink/checkpoints
        - name: savepoint-pvc
          mountPath: /opt/flink/savepoints
  volumes:
    - name: checkpoint-pvc
      persistentVolumeClaim:
        claimName: flink-checkpoint
    - name: savepoint-pvc
      persistentVolumeClaim:
        claimName: flink-savepoint
```

由于使用了 `rocksdb-backend`，该依赖可以由 3 种方式提供：

1. 提供的 Flink Base Docker Image 已经包含该依赖（用户自行解决依赖冲突）；

2. 在 StreamPark 本地 `Workspace/jars` 目录下放置 `flink-statebackend-rocksdb_xx.jar` 依赖；

3. 在 StreamPark Dependency 配置中加入 rockdb-backend 依赖（此时 StreamPark 会自动解决依赖冲突）：

   ![rocksdb dependency](/doc/image/rocksdb_dependency.png)

<br/>

在随后版本中，我们会提供一种优雅的 pod-template 配置自动生成的方式，来简化 k8s-pvc 挂载这一过程 : )

