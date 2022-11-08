---
id: 'k8s-dev'
title: 'Flink K8s 集成支持'
sidebar_position: 1
---

StreamPark Flink Kubernetes 基于 [Flink Native Kubernetes](https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/resource-providers/native_kubernetes/) 实现，支持以下 Flink 运行模式：

* Native-Kubernetes Application
* Native-Kubernetes Session

单个 StreamPark 实例当前只支持单个 Kubernetes 集群，如果您有多 Kubernetes 支持的诉求，欢迎提交相关的 [Fearure Request Issue](https://github.com/apache/incubator-streampark/issues) : )

<br></br>

## 额外环境要求

StreamPark Flink-K8s 需要具备以下额外的运行环境：

* Kubernetes
* Maven（StreamPark 运行节点具备）
* Docker（StreamPark 运行节点是具备）

StreamPark 实例并不需要强制部署在 Kubernetes 所在节点上，可以部署在 Kubernetes 集群外部节点，但是需要该 StreamPark 部署节点与 Kubernetes 集群**保持网络通信畅通**。

<br></br>


## 集成准备

### Kubernetes 连接配置

StreamPark 直接使用系统 `～/.kube/config ` 作为 Kubernetes 集群的连接凭证，最为简单的方式是直接拷贝 Kubernetes 节点的 `.kube/config` 到 StreamPark 节点用户目录，各云服务商 Kubernetes 服务也都提供了相关配置的快速下载。当然为了权限约束，也可以自行生成对应 k8s 自定义账户的 config。

完成后，可以通过 StreamPark 所在机器的 kubectl 快速检查目标 Kubernetes 集群的连通性：

```shell
kubectl cluster-info
```

### Kubernetes RBAC 配置

同样的，需要准备 Flink 所使用 K8s Namespace 的 RBAC 资源，请参考 Flink-Docs：https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/resource-providers/native_kubernetes/#rbac

假设使用 Flink Namespace 为 `flink-dev`，不明确指定 K8s 账户，可以如下创建简单 clusterrolebinding 资源：

```
kubectl create clusterrolebinding flink-role-binding-default --clusterrole=edit --serviceaccount=flink-dev:default
```

### Docker 远程容器服务配置

在 StreamPark Setting 页面，配置目标 Kubernetes 集群所使用的 Docker 容器服务的连接信息。

![docker register setting](/doc/image/docker_register_setting.png)

在远程 Docker 容器服务创建一个名为 `streampark` 的 Namespace(该Namespace可自定义命名，命名不为 streampark 请在setting页面修改确认) ，为 StreamPark 自动构建的 Flink image 推送空间，请确保使用的 Docker Register User 具有该  Namespace 的 `pull`/`push` 权限。

可以在 StreamPark 所在节点通过 docker command 简单测试权限：

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

## 任务提交

### Application 任务发布

![k8s application submit](/doc/image/k8s_application_submit.png)

其中需要说明的参数如下：

* **Flink Base Docker Image**： 基础 Flink Docker 镜像的 Tag，可以直接从 [DockerHub - offical/flink](https://hub.docker.com/_/flink) 获取，也支持用户私有的底层镜像，此时在 setting 设置 Docker Register Account 需要具备该私有镜像 	`pull` 权限。
* **Rest-Service Exposed Type**：对应 Flink 原生 [kubernetes.rest-service.exposed.type](https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/config/#kubernetes) 配置，各个候选值说明：
  * `ClusterIP`：需要 StreamPark 可直接访问 K8s 内部网络；
  * `LoadBalancer`：需要 K8s 提前创建 LoadBalancer 资源，且 Flink Namespace 具备自动绑定权限，同时 StreamPark 可以访问该 LoadBalancer 网关；
  * `NodePort`：需要 StreamPark 可以直接连通所有 K8s 节点；
* **Kubernetes Pod Template**： Flink 自定义 pod-template 配置，注意container-name必须为flink-main-container，如果k8s pod拉取docker镜像需要秘钥，请在pod template文件中补全秘钥相关信息，pod-template模板如下：
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
* **Dynamic Option**： Flink on k8s动态参数（部分参数也可在pod-template文件中定义），该参数需要以-D开头，详情见[Flink on Kubernetes相关参数](https://nightlies.apache.org/flink/flink-docs-release-1.13/zh/docs/deployment/config/#kubernetes)

任务启动后，支持在该任务的 Detail 页直接访问对应的 Flink Web UI 页面：

![k8s app detail](/doc/image/k8s_app_detail.png)

### Session 任务发布

Flink-Native-Kubernetes Session 任务 K8s 额外的配置（pod-template 等）完全由提前部署的 Flink-Session 集群决定，请直接参考 Flink-Doc：https://ci.apache.org/projects/flink/flink-docs-stable/docs/deployment/resource-providers/native_kubernetes

<br></br>

## 相关参数配置

StreamPark 在 `applicaton.yml`  Flink-K8s 相关参数如下，默认情况下不需要额外调整默认值。

| 配置项                                                                    | 描述                                                        | 默认值  |
|:-----------------------------------------------------------------------|-----------------------------------------------------------| ------- |
| streampark.docker.register.image-namespace                             | 远程 docker 容器服务仓库命名空间，构建的 flink-job 镜像会推送到该命名空间。           | steramx |
| streampark.flink-k8s.tracking.polling-task-timeout-sec.job-status      | 每组 flink 状态追踪任务的运行超时秒数                                    | 120     |
| streampark.flink-k8s.tracking.polling-task-timeout-sec.cluster-metric  | 每组 flink 指标追踪任务的运行超时秒数                                    | 120     |
| streampark.flink-k8s.tracking.polling-interval-sec.job-status          | flink 状态追踪任务运行间隔秒数，为了维持准确性，请设置在 5s 以下，最佳设置在 2-3s          | 5       |
| streampark.flink-k8s.tracking.polling-interval-sec.cluster-metric      | flink 指标追踪任务运行间隔秒数                                        | 10      |
| streampark.flink-k8s.tracking.silent-state-keep-sec                    | silent 追踪容错时间秒数                                           | 60      |

