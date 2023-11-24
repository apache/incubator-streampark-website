---
slug: flink-development-framework-streampark
title: StreamPark - Powerful Flink Development Framework
tags: [StreamPark, DataStream, FlinkSQL]
---

Although the Hadoop system is widely used today, its architecture is complicated, it has a high maintenance complexity, version upgrades are challenging, and due to departmental reasons, data center scheduling is prolonged. We urgently need to explore agile data platform models. With the current popularization of cloud-native architecture and the integration between lake and warehous, we have decided to use Doris as an offline data warehouse and TiDB (which is already in production) as a real-time data platform. Furthermore, because Doris has ODBC capabilities on MySQL, it can integrate external database resources and uniformly output reports.

![](/blog/belle/doris.png)

<!-- truncate -->

# 1. Background

Although the Hadoop system is widely used today, its architecture is complicated, it has a high maintenance complexity, version upgrades are challenging, and due to departmental reasons, data center scheduling is prolonged. We urgently need to explore agile data platform models. With the current popularization of cloud-native architecture and the integration between lake and warehous, we have decided to use Doris as an offline data warehouse and TiDB (which is already in production) as a real-time data platform. Furthermore, because Doris has ODBC capabilities on MySQL, it can integrate external database resources and uniformly output reports.

![](/blog/belle/doris.png)

<center style={{"color": "gray"}}>(Borrowing Doris's official architecture diagram here)</center>

<br/><br/>

# 2. Challenges Faced

For the data engine, we settled on using Spark and Flink:

* Use Spark on K8s client mode for offline data processing.
* Use Flink on K8s Native-Application/Session mode for real-time task stream management.

Here, there are some challenges we haven't fully resolved:

Those who have used the Native-Application mode know that each time a task is submitted, a new image must be packaged, pushed to a private repository, and then the Flink Run command is used to communicate with K8s to pull the image and run the Pod. After the task is submitted, you need to check the log on K8s, but:

1. How is task runtime monitoring handled?
2. Do you use Cluster mode or expose ports using NodePort to access Web UI?
3. Can the task submission process be simplified to avoid image packaging?
4. How can we reduce the pressure on developers?

<br/><br/>

# 3. Solving the Challenges

All of the above are challenges that need addressing. If we rely solely on the command line to submit each task, it becomes unrealistic. As the number of tasks increases, it becomes unmanageable. Addressing these challenges became inevitable.

<br/>

## Simplifying Image Building

Firstly, regarding the need for a secondary build of the native Flink image: we utilized MinIO as external storage and mounted it directly on each host node using s3-fuse via DaemonSet. The jar packages we need to submit can all be managed there. In this way, even if we scale the Flink nodes up or down, S3 mounts can automatically scale.

![](/blog/belle/k8s.png)

From Flink version 1.13 onwards, Pod Template support has been added. We can use volume mounts in the Pod Template to mount host directories into each pod, allowing Flink programs to run directly on K8s without packaging them into images. As shown in the diagram above, we first mount S3 using the s3-fuse Pod to the `/mnt/data-s3fs` directory on Node 1 and Node 2, and then mount `/mnt/data-s3fs` into Pod A.

However, because object storage requires the entire object to be rewritten for random writes or file appends, this method is only suitable for frequent reads. This perfectly fits our current scenario.

<br/>

## Introducing StreamPark

Previously, when we wrote Flink SQL, we generally used Java to wrap SQL, packed it into a jar package, and submitted it to the S3 platform through the command line. This approach has always been unfriendly; the process is cumbersome, and the costs for development and operations are too high. We hoped to further streamline the process by abstracting the Flink TableEnvironment, letting the platform handle initialization, packaging, and running Flink tasks, and automating the building, testing, and deployment of Flink applications.

This is an era of open-source uprising. Naturally, we turned our attention to the open-source realm: among numerous open-source projects, after comparing various projects, we found that both Zeppelin and StreamPark provide substantial support for Flink and both claim to support Flink on K8s. Eventually, both were shortlisted for our selection. Here's a brief comparison of their support for K8s (if there have been updates since, please kindly correct).

<table>
    <thead>
        <tr>
            <td>Feature</td>
            <td>Zeppelin</td>
            <td>StreamPark</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Task Status Monitoring</td>
            <td>Somewhat limited, not suitable as a task status monitoring tool.</td>
            <td>Highly capable</td>
        </tr>
        <tr>
            <td>Task Resource Management</td>
            <td>None</td>
            <td>Exists, but the current version is not very robust.</td>
        </tr>
        <tr>
            <td>Local Deployment</td>
            <td>On the lower side. In on K8s mode, you can only deploy Zeppelin in K8s. Otherwise, you need to connect the Pod and external network, which is rarely done in production.</td>
            <td>Can be deployed locally</td>
        </tr>
        <tr>
            <td>Multi-language Support</td>
            <td>High - Supports multiple languages such as Python/Scala/Java.</td>
            <td>Average - Currently, K8s mode and YARN mode support FlinkSQL, and based on individual needs, you can use Java/Scala to develop DataStream.</td>
        </tr>
        <tr>
            <td>Flink WebUI Proxy</td>
            <td>Currently not very comprehensive. The main developer is considering integrating Ingress.</td>
            <td>Good - Currently supports ClusterIp/NodePort/LoadBalance modes.</td>
        </tr>
        <tr>
            <td>Learning Curve</td>
            <td>Low cost. Needs to learn additional parameters, which differ somewhat from native FlinkSQL.</td>
            <td>No cost. In K8s mode, FlinkSQL is supported in its native SQL format; also supports Custom-Code (user writes code for developing Datastream/FlinkSQL tasks).</td>
        </tr>
        <tr>
            <td>Support for Multiple Flink Versions</td>
            <td>Supported</td>
            <td>Supported</td>
        </tr>
        <tr>
            <td>Intrusion into Native Flink Image</td>
            <td>Invasive. You need to pre-deploy the jar package in the Flink image, which will start in the same Pod as JobManager and communicate with the zeppelin-server.</td>
            <td>Non-invasive, but it will generate many images that need to be cleaned up regularly.</td>
        </tr>
        <tr>
            <td>Multi-version Code Management</td>
            <td>Supported</td>
            <td>Supported</td>
        </tr>
    </tbody>
</table>

<center style={{"color": "gray"}}>(PS: This comparison is based on our perspective as evaluators. We hold the utmost respect for the developers of both platforms.)</center>

<br/>

During our research process, we communicated with the main developers of both tools multiple times. After our repeated studies and assessments, we eventually decided to adopt StreamPark as our primary Flink development tool for now.

<video src="http://assets.streamxhub.com/streamx-video.mp4" controls="controls" width="100%" height="100%"></video>

<center style={{"color": "gray"}}>(StreamPark's official splash screen)</center>

<br/>

After extended development and testing by our team, StreamPark currently boasts:

* Comprehensive <span style={{"color": "red"}}>SQL validation capabilities</span>
* It has achieved <span style={{"color": "red"}}>automatic build/push for images</span>
* Using a custom class loader and through the Child-first loading method, it <span style={{"color": "red"}}>addresses both YARN and K8s operational modes</span> and <span style={{"color": "red"}}>supports the seamless switch between multiple Flink versions</span>
* It deeply integrates with Flink-Kubernetes, returning a WebUI after task submission, and via remote REST API + remote K8s, it can <span style={{"color": "red"}}>track task execution status</span>
* It supports versions like <span style={{"color": "red"}}>Flink 1.12, 1.13, 1.14, and more</span>

This effectively addresses most of the challenges we currently face in development and operations.

<video src="http://assets.streamxhub.com/streamx-1.2.0.mp4" controls="controls" width="100%" height="100%"></video>

<center style={{"color": "gray"}}>(Demo video showcasing StreamPark's support for multiple Flink versions)</center>

<br/>

In its latest release, version 1.2.0, StreamPark provides robust support for both K8s-Native-Application and K8s-Session-Application modes.

<video src="http://assets.streamxhub.com/streamx-k8s.mp4" controls="controls" width="100%" height="100%"></video>

<center style={{"color": "gray"}}>(StreamPark's K8s deployment demo video)</center>

<br/>

### K8s Native Application Mode

Within StreamPark, all we need to do is configure the relevant parameters, fill in the corresponding dependencies in the Maven POM, or upload the dependency jar files. Once we click on 'Apply', the specified dependencies will be generated. This implies that we can also compile all the UDFs we use into jar files, as well as various connector.jar files, and use them directly in SQL. As illustrated below:

![](/blog/belle/dependency.png)

The SQL validation capability is roughly equivalent to that of Zeppelin:

![](/blog/belle/sqlverify.png)

We can also specify resources, designate dynamic parameters within Flink Run as Dynamic Options, and even integrate these parameters with a Pod Template.

![](/blog/belle/pod.png)

After saving the program, when clicking to run, we can also specify a savepoint. Once the task is successfully submitted, StreamPark will, based on the FlinkPod's network Exposed Type (be it loadBalancer, NodePort, or ClusterIp), return the corresponding WebURL, seamlessly enabling a WebUI redirect. However, as of now, due to security considerations within our online private K8s cluster, there hasn't been a connection established between the Pod and client node network (and there's currently no plan for this). Hence, we only employ NodePort. If the number of future tasks increases significantly, and there's a need for ClusterIP, we might consider deploying StreamPark in K8s or further integrate it with Ingress.

![](/blog/belle/start.png)

Note: If the K8s master uses a vip for load balancing, the Flink 1.13 version will return the vip's IP address. This issue has been rectified in the 1.14 version.

Below is the specific submission process in the K8s Application mode:

![](/blog/belle/flow.png)

<center style={{"color": "gray"}}>(The above is a task submission flowchart, drawn based on personal understanding. If there are inaccuracies, your understanding is appreciated.)</center>

<br/>

### K8s Native Session Mode

StreamPark also offers robust support for the <span style={{"color": "red"}}> K8s Native-Session mode</span>, which lays a solid technical foundation for our subsequent offline FlinkSQL development or for segmenting certain resources.

To use the Native-Session mode, one must first use the Flink command to create a Flink cluster that operates within K8s. For instance:

```shell
./kubernetes-session.sh \
-Dkubernetes.cluster-id=flink-on-k8s-flinkSql-test \
-Dkubernetes.context=XXX \
-Dkubernetes.namespace=XXXX \
-Dkubernetes.service-account=XXXX \
-Dkubernetes.container.image=XXXX \
-Dkubernetes.container.image.pull-policy=Always \
-Dkubernetes.taskmanager.node-selector=XXXX \
-Dkubernetes.rest-service.exposed.type=Nodeport
```

![](/blog/belle/flinksql.png)

As shown in the image above, we use that ClusterId as the Kubernetes ClusterId task parameter for StreamPark. Once the task is saved and submitted, it quickly transitions to a 'Running' state:

![](/blog/belle/detail.png)

Following the application info's WebUI link:

![](/blog/belle/dashboard.png)

It becomes evident that StreamPark essentially uploads the jar package to the Flink cluster through REST API and then schedules the task for execution.

<br/>

### Custom Code Mode

To our delight, StreamPark also provides support for coding DataStream/FlinkSQL tasks. For special requirements, we can achieve our implementations in Java/Scala. You can compose tasks following the scaffold method recommended by StreamPark or write a standard Flink task. By adopting this approach, we can delegate code management to git, utilizing the platform for automated compilation, packaging, and deployment. Naturally, if functionality can be achieved via SQL, we would prefer not to customize DataStream, thereby minimizing unnecessary operational complexities.

<br/><br/>

# 4. Feedback and Future Directions

## Suggestions for Improvement

StreamPark, similar to any other new tools, does have areas for further enhancement based on our current evaluations:

* **Strengthening Resource Management**: Features like multi-file system jar resources and robust task versioning are still awaiting additions.
* **Enriching Frontend Features**: For instance, once a task is added, functionalities like copying could be integrated.
* **Visualization of Task Submission Logs**: The process of task submission involves loading class files, jar packaging, building and submitting images, and more. A failure at any of these stages could halt the task. However, error logs are not always clear, or due to some anomaly, the exceptions aren't thrown as expected, leaving users puzzled about rectifications.

It's a universal truth that innovations aren't perfect from the outset. Although minor issues exist and there are areas for improvement with StreamPark, its merits outweigh its limitations. As a result, we've chosen StreamPark as our Flink DevOps platform. We're also committed to collaborating with its main developers to refine StreamPark further. We wholeheartedly invite others to use it and contribute towards its advancement.

<br/>

## Future Prospects

* We'll keep our focus on Doris and plan to unify business data with log data in Doris, leveraging Flink to realize lakehouse capabilities.
* Our next step is to explore integrating StreamPark with DolphinScheduler 2.x. This would enhance DolphinScheduler's offline tasks, and gradually we aim to replace Spark with Flink for a unified batch-streaming solution.
* Drawing from our own experiments with S3, after building the fat-jar, we're considering bypassing image building. Instead, we'll mount PVC directly to the Flink Pod's directory using Pod Template, refining the code submission process even further.
* We plan to persistently implement StreamPark in our production environment. Collaborating with community developers, we aim to boost StreamPark's Flink stream development, deployment, and monitoring capabilities. Our collective vision is to evolve StreamPark into a holistic stream data DevOps platform.

Resources:

StreamPark GitHub: [https://github.com/apache/incubator-streampark](https://github.com/apache/incubator-streampark) <br/>
Doris GitHub: [https://github.com/apache/doris](https://github.com/apache/doris)

![](/blog/belle/author.png)
