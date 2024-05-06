---
id: 'k8s-dev'
title: 'Flink on K8s '
sidebar_position: 1
---


StreamPark Flink Kubernetes is based on [Flink Native Kubernetes](https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/resource-providers/native_kubernetes/) and support deployment modes as below：

* Native-Kubernetes Application
* Native-Kubernetes Session
At now, one StreamPark only supports one Kubernetes cluster.You can submit [Fearure Request Issue](https://github.com/apache/incubator-streampark/issues) , when multiple Kubernetes clusters are needed.
<br></br>

## Environments requirement

Additional operating environment to run StreamPark Flink-Kubernetes is as below:
* Kubernetes
* Maven（StreamPark runNode）
* Docker（StreamPark runNode）


StreamPark entity can be deployed on Kubernetes nodes, and can also be deployed on node out of Kubernetes cluster when there are **smooth network** between the node and cluster.
<br></br>



## Preparation for integration

### configuration for connecting  Kubernetes

StreamPark connects to Kubernetes cluster by default connection credentials `～/.kube/config `.User can copy `.kube/config` from  Kubernetes node to StreamPark nodes,or download it from Kubernetes provided by cloud service providers.If considering Permission constraints, User also can
generate custom account`s  configuration by themselves.

```shell
kubectl cluster-info
```

### configuration for coKubernetes RBAC


User can configure RBAC for Kubernetes Namespace by referring to Flink-Docs：https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/resource-providers/native_kubernetes/#rbac

When Flink Namespace is `flink-dev` and there are no needed to explicitly specify Kubernetes accounts, user can allocate resource to clusterrolebinding by the way as below


```
kubectl create clusterrolebinding flink-role-binding-default --clusterrole=edit --serviceaccount=flink-dev:default
```

### Configuration for remote Docker service


On Setting page of StreamPark, user can configure the connection information for Docker service of Kubernetes cluster.

![docker register setting](/doc/image/docker_register_setting.png)


Building a Namespace named `streampark`(other name should be set at Setting page of StreamPark) at remote Docker.The namespace is push/pull space of StreamPark Flink image and Docker Register User should own `pull`/`push`  permission of this namespace.


```shell
# verify access
docker login --username=<your_username> <your_register_addr>
# verify push permission
docker pull busybox
docker tag busybox <your_register_addr>/streampark/busybox
docker push <your_register_addr>/streampark/busybox
# verify pull permission
docker pull <your_register_addr>/streampark/busybox
```
<br></br>
## Job submit

### Application  Job release

![k8s application submit](/doc/image/k8s_application_submit.png)

parameter descriptions are as below：

* **Flink Base Docker Image**： Base Flink Docker Image Tag can be obtained from  [DockerHub - offical/flink](https://hub.docker.com/_/flink) .And user can also use private image when Docker Register Account owns `pull` permission of it.

* **Rest-Service Exposed Type**：Description of candidate values for native Flink Kubernetes configuration [kubernetes.rest-service.exposed.type](https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/config/#kubernetes) ：
  * `ClusterIP`：ip that StreamPark can access；
  * `LoadBalancer`：resource of LoadBalancer should be allocated in advance， Flink Namespace own permission of automatic binding，and StreamPark can access LoadBalancer`s gateway；
  * `NodePort`：StreamPark can access  all Kubernetes nodes；
* **Kubernetes Pod Template**: This is Flink's custom configuration of pod-template. The `container-name` must be `flink-main-container`. If the Kubernetes pod needs a secret key to pull the Docker image, please fill in the information about
the secret key in the pod template file. Below is an example of pod-template:

    ```
    apiVersion: v1
    kind: Pod
    metadata:
      name: pod-template
    spec:
      serviceAccount: default
      containers:
      - name: flink-main-container
        image:
      imagePullSecrets:
      - name: regsecret
    ```

* **Dynamic Option**: Dynamic options of Flink on Kubernetes (part of parameters can also be defined in pod-template). Options should start with `-D`. Details can be found at [Flink on Kubernetes parameters](https://nightlies.apache.org/flink/flink-docs-release-1.13/zh/docs/deployment/config/#kubernetes).

After the job is started, it is supported to directly access the corresponding Flink Web UI page on the Detail page of the task：

![k8s app detail](/doc/image/k8s_app_detail.png)

### Session job release

The additional configuration of Flink-Native-Kubernetes Session Job will be decided by Flink-Session cluster.More details can be find in Flink-Doc：https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/resource-providers/native_kubernetes
<br></br>

## other configuration

StreamPark parameters related to Flink-Kubernetes in `applicaton.yml` are as below. And in most conditions, there is no need to change it.

| Configuration item                                                    | Description                                                                                                          | Default value |
|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|---------------|
| streampark.docker.register.image-namespace                            | namespace of Remote docker service repository， flink-job image will be pushed here                                   | null          |
| streampark.flink-k8s.tracking.polling-task-timeout-sec.job-status     | timeout in seconds of flink state tracking task                                                                      | 120           |
| streampark.flink-k8s.tracking.polling-task-timeout-sec.cluster-metric | timeout in seconds of flink metrics tracking task                                                                    | 120           |
| streampark.flink-k8s.tracking.polling-interval-sec.job-status         | interval in seconds of flink state tracking task.To maintain accuracy, please set below 5s, the best setting is 2-3s | 5             |
| streampark.flink-k8s.tracking.polling-interval-sec.cluster-metric     | interval in seconds of flink metrics tracking task                                                                   | 10            |
| streampark.flink-k8s.tracking.silent-state-keep-sec                   | fault tolerance time in seconds of  silent  metrics                                                                  | 60            |

