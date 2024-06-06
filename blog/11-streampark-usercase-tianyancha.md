---
slug: streampark-usercase-tianyancha
title: Apache StreamPark™ helps Tianyancha real-time platform construction｜Multiple-fold increase in efficiency
tags: [StreamPark, 生产实践]
---

![](/blog/tianyancha/new_cover.png)

**Introduction**: This paper mainly introduces the challenges of job development and management faced by Tianyancha in the operation and maintenance of nearly 1,000 Flink jobs in the real-time computing business, and solves these challenges by introducing Apache StreamPark. It introduces some of the problems encountered in the process of introducing StreamPark, and how to solve these problems and successfully land the project, and finally greatly reduces operation and maintenance costs and significantly improve human efficiency.

Github: https://github.com/apache/streampark

Welcome to follow, star, fork, and participate in contributions

Contributor | Beijing Tianyancha

Author | Li Zhilin

Article compilation｜Yang Linwei

Content proofreading｜Pan Yuepeng

<!-- truncate -->

Tianyancha is China's leading business search platform. Since its inception in 2014, Tianyancha has continued to maintain rapid growth, with an industry penetration rate of more than 77%, a monthly active user base of 35 million, and a cumulative user base of 600 million+, making Tianyancha a super symbol in the business field, and one of the first companies to obtain the qualification of enterprise credit collection filed with the Central Bank. After years of deep cultivation, the platform has included 340 million social entities nationwide and 640 million globally, with more than 1,000 kinds of business information dimensions updated in real time, making it the preferred brand for business inquiries by both corporate clients and individual users.

![](/blog/tianyancha/enterprise.png)

In this paper, we will introduce the challenges faced by the real-time computing business of Tianyancha, how these challenges are addressed by the Apache StreamPark platform, as well as the significant benefits and future plans.

## **Business background and challenges**  

Tianyancha has a huge user base and diverse business dimensions, we use Apache Flink, a powerful real-time computing engine, to provide users with better products and service experience, our real-time computing business mainly covers the following scenarios:

- Real-time data ETL processing and data transmission.

- C-end dimensional data statistics, including user behavior, PV/UV analysis.

- Real-time correlation analysis of C-end business data with business information, risk information, property rights, equity, shareholders, cases and other information.

With the rapid development of the business of Tianyancha, real-time operations have increased to 800+, and will soon be thousands in the future. Facing such a large volume of operations, we have encountered challenges in development and management, which are roughly as follows:

- **Difficulty in job operation and maintenance**: Jobs cover multiple Flink versions, running and upgrading multi-version Flink jobs are costly due to API changes, and job submission and parameter tuning rely on complex scripts, which greatly increases the maintenance difficulty and cost.

- **Inefficient job development**: From local IDE debugging to test environment deployment, it takes time-consuming and inefficient steps such as compilation, file transfer and command execution.

- **Lack of automatic retry mechanism**: Multi-table correlation operation of real-time business is susceptible to network and IO fluctuations, which leads to Flink program failure and requires manual or additional program intervention for recovery, increasing development and maintenance costs.

- **High Maintenance Costs**: Lack of centralized logging, version control, and configuration management tools makes maintaining a large number of JAR packages, commit scripts, and Flink client configurations increasingly complex as the task volume rises.

![](/blog/tianyancha/challenges.png)

## **StreamPark on-the-ground practice**  

In order to solve the above problems, our company decided to introduce StreamPark, we started to pay attention to the StreamPark project when it was first open-sourced, and the project name was StreamX at that time, and since then we have been closely following the development of the project, witnessing its development from open-sourcing to joining the incubation of the Apache Software Foundation, and we have seen that its community activity, user reputation, and the number of times of release have all been very good, which strengthens our confidence in StreamPark. Its community activity, user reputation, number of releases, etc. are all very good, and there are a lot of real use cases in enterprises, which strengthens our confidence in StreamPark. Therefore, introducing StreamPark is a natural thing to do, and we are especially interested in the following capabilities that can solve our pain points:

- **Git-style project management**: provides a convenient version control and deployment process for jobs.

- **Powerful job O&M capabilities**: significantly improves the efficiency of job management and maintenance.

- **Precise second-level alarm system**: provides real-time monitoring and rapid response capability.

- **One-stop task development platform**: provides strong protection for development, testing and deployment

### **1. Git-style project management**

Tianyancha more than 90% are JAR jobs, management of hundreds of JAR jobs is a headache, in order to facilitate the maintenance and management of the previous we named the JAR file name through the “developer name-project name-module-environment”, which brings another problem, there is no way to intuitively differentiate between the maintenance of the operation in that There is no way to visually distinguish which module the job is maintained in, and if a non-owner maintains the job, he or she has to go through the project documentation and code to see the logic, and needs to find the project code and the corresponding branch, the startup script of the job, etc., which increases the workload of the developer dramatically.

In StreamPark, we were pleasantly surprised to find a project management feature, similar to the Git integration, that solved our pain point by simplifying the naming convention to isolate projects, people, branches and environments. Now, we can instantly locate the code and documents of any job, which greatly improves the maintainability and development efficiency of jobs, and significantly improves our operation and maintenance efficiency.

![](/blog/tianyancha/git.png)

### **2. Seconds-accurate alerts and automated O&M**

Below is one of our Flink online tasks, during the query process to access the third-party side, Connection Time out and other errors occurred (Note: itself Flink set the restart policy interval restart three times, but ultimately failed)

![](/blog/tianyancha/alarm.png)

As shown above, when the job alert was received, and our fellow developers responded to 1 in the group, we realized that the **job had been successfully pulled up by StreamPark, and it took less than 15 seconds to resubmit the job and run it**!

### **3. Platform user rights control**

StreamPark provides a complete set of permission management mechanism, which allows us to manage the fine-grained permissions of jobs and users on the StreamPark platform, effectively avoiding possible misoperation due to excessive user permissions, and reducing the impact on the stability of job operation and the accuracy of the environment configuration, which is very necessary for enterprise-level users.

![](/blog/tianyancha/permissions.png)

### **4. Flink SQL online development**

For many development scenarios where Flink SQL jobs need to be submitted, we can now completely eliminate the tedious steps of writing code in IDEA. Simply use the StreamPark platform,**which makes it easy to develop Flink SQL jobs**, and here's a simple example.

![](/blog/tianyancha/sql_job.png)

### **5. Well-established operations management capabilities**

StreamPark also has more complete job operation records, for some abnormal jobs at the time of submission, you can now view the failure log completely through the platform, including historical log information.

![](/blog/tianyancha/historical_logs.png)

Of course, StreamPark also provides us with a more complete and user-friendly task management interface to visualize how tasks are running.

![](/blog/tianyancha/task_management.png)

Our internal real-time projects are highly abstracted code development jobs, and each time we develop a new job, we only need to modify some external incoming parameters. With the StreamPark replicated job feature, we can say goodbye to a lot of repetitive work, and just replicate the existing job on the platform, and slightly modify the running parameters of the program in order to submit a new job!

![](/blog/tianyancha/successful.png)

Of course, there are more, not to list here, StreamPark in the use of simple enough to use, within minutes you can get started to use, the function is focused enough to be reliable, the introduction of StreamPark to solve the problem we face in managing Flink jobs, bringing real convenience, significantly improve the efficiency of the people, to give the creative team a great praise!

## **Problems encountered**

In the StreamPark landing practice, we also encountered some problems, which are documented here, expecting to bring some inputs and references to the users in the community.

### **Huawei Cloud has compatibility issues with open source Hadoop**

Our jobs are in Flink on Yarn mode and deployed in Huawei Cloud. During the process of using StreamPark to deploy jobs, we found that the jobs can be successfully deployed to Huawei Hadoop cluster, but the request for Yarn ResourceManager was rejected when getting the job status information, so we communicated with the community in time to find a solution, and logged the issue.
https://github.com/apache/incubator-streampark/issues/3566

We communicated with the community to seek a solution, and recorded the issue: . Finally, with the assistance of Mr. Huajie, a community PMC member, and Huawei Cloud students, we successfully resolved the issue: StreamPark could not access the cloud ResourceManager properly due to the internal security authentication mechanism of the cloud product itself.

Solution (for reference only - add different dependencies according to different environments)

Remove two HADOOP related packages from the STREAMPARK_HOME/lib directory:

```shell
hadoop-client-api-3.3.4.jar
hadoop-client-runtime-3.3.4.jar
```

Replace the following Huawei Cloud HADOOP dependencies.

```shell
commons-configuration2-2.1.1.jar
commons-lang-2.6.0.wso2v1.jar
hadoop-auth-3.1.1-hw-ei-xxx.jar
hadoop-common-3.1.1-hw-ei-xxx.jar
hadoop-hdfs-client-3.1.1-hw-ei-xxx.jar
hadoop-plugins-8.1.2-xxx.jar
hadoop-yarn-api-3.1.1-hw-ei-xxx.jar
hadoop-yarn-client-3.1.1-hw-ei-xxx.jar
hadoop-yarn-common-3.1.1-hw-ei-xxx.jar
httpcore5-h2-5.1.5.jar
jaeger-core-1.6.0.jar
mysql-connector-java-8.0.28.jar
opentracing-api-0.33.0.jar
opentracing-noop-0.33.0.jar
opentracing-util-0.33.0.jar
protobuf-java-2.5.0.jar
re2j-1.7.jar
stax2-api-4.2.1.jar
woodstox-core-5.0.3.jar
```

### **Other Bugs**

In the process of intensive use, we also found some problems. In order to better improve and optimize StreamPark's functionality, we have come up with some specific suggestions and solutions, such as:

- **Dependency conflict**: conflict resolution when loading Flink dependencies (see: Pull Request #3568).

- **Service Stability**: Intercept user program JVM exits to prevent the StreamPark platform from exiting abnormally due to user programs (see: Pull Request #3659).

- **Resource Optimization**: In order to reduce the burden on resources, we limit the number of concurrent StremaPark builds, and control the maximum number of builds through configuration parameters (see: Pull Request #3696).

## **Benefits derived**

Apache StreamPark has brought us significant benefits,**mainly in its one-stop service capability, which enables business developers to complete the development, compilation, submission and management of Flink jobs** on a unified platform. It greatly saves our time on Flink job development and deployment, significantly improves development efficiency, and realizes full-process automation from user rights management to Git deployment, task submission, alerting, and automatic recovery, effectively solving the complexity of Apache Flink operation and maintenance.

![](/blog/tianyancha/earnings.png)

Currently on the Tianyancha platform, specific results from StreamPark include:

- Real-time job go-live and test deployment processes are simplified by **70%**.

- The operation and maintenance costs of real-time jobs have been reduced by **80%**, allowing developers to focus more on code logic.

- Alert timeliness has improved by more than **5x**, from minutes to seconds, enabling task exceptions to be sensed and handled within **5 seconds**.

- StreamPark automatically recovers from task failures without human intervention.

- The integration of GitLab with StreamPark simplifies the process of compiling projects and submitting jobs, dramatically reducing development and maintenance costs.

## **Future planning**

In the future, we plan to migrate all 300+ Flink jobs deployed on our internal real-time computing platform and 500+ Flink jobs maintained in other ways to StreamPark for unified management and maintenance. When we encounter some optimization or enhancement points in the future, we will communicate with the community developers in a timely manner and contribute to the community, so as to make StreamPark easier and more usable! We will make StreamPark easier and better to use.

At the end of this article, we would like to thank the Apache Streampark community, especially Mr. Huajie, a member of the PMC, for his continuous follow-up and valuable technical support during the process of using StreamPark, and we deeply feel the serious attitude and enthusiasm of the Apache StreamPark community. We are also very grateful to Huawei Cloud students for their support and troubleshooting on cloud deployment.

We look forward to continuing our cooperation with the StreamPark community in the future to jointly promote the development of real-time computing technology, and hope that StreamPark will do better and better in the future, and graduate to become a representative of the new Apache project soon!











