---
id: 'k8s-pvc-integration'
title: 'Kubernetes PVC Resource usage'
sidebar_position: 2
---

## Resource usage instructions of K8s PVC

The support for pvc resource(mount file resources such as checkpoint/savepoint/logs and so on) is based on pod-template at current version。

Users do not have to concern the Native-Kubernetes Session.It will be processed when Session Cluster is constructed .Native-Kubernetes Application can be constructed by configuring on StreamPark webpage using `pod-template`、`jm-pod-template`、`tm-pod-template`.

<br/>


Here is a brief example. Two PVC `flink-checkpoint`， `flink-savepoint` should be constructed in advance

![Kubernetes PVC](/doc/image/k8s_pvc.png)

'pod-template' can be configured as below ：

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

There are three ways to provide the dependency when using `rocksdb-backend`.

1.  Flink Base Docker Image contains the dependency（user fix the dependency conflict by themself）;

2. Put the dependency `flink-statebackend-rocksdb_xx.jar` to  the path `Workspace/jars` in StreamPark ;

3. Add the rockdb-backend dependency to StreamPark Dependency(StreamPark will fix the conflict automatically) ：

   ![rocksdb dependency](/doc/image/rocksdb_dependency.png)

<br/>

We will provide a graceful way to generate pod-template configuration to simplify the procedure of k8s-pvc mounting in future version.

