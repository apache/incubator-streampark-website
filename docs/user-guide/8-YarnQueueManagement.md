---
id: 'YarnQueueManagement'
title: 'Yarn Queue Management'
sidebar_position: 8
---

## Background
In the actual production environment for the `Yarn Deployment Mode`, 
users often need to type in `queue` or `queue`&`labels` to specify 
the configuration for the `yarn-application` mode flink applications
or the `yarn-session` mode flink clusters.
During this process, manual input by users may cause errors, 
which may result in specified non-existed queues or the `flink application`/`flink cluster` 
being submitted to the wrong queues.

If the yarn cluster doesn't include users specified queues,
the deployment process of `flink applications`/`flink clusters` 
will be time-consuming and accompanied by poor user experience. 
If a task is submitted to an incorrect queue due to the error-input, 
it's likely to affect the stability of yarn applications on the queue and the abuse of the queue resource.

So StreamPark introduced the queue management feature to ensure that a set of added queues are shared within the same team, 
that is, ensure that queues resource is isolated within the scope of the team. It can generate the following benefits:
- When deploying Flink `yarn-application` applications or Flink `yarn-session` clusters, 
it could set quickly and accurately yarn queue(`yarn.application.queue`) & labels(`yarn.application.node-label`).
- Not only does it ensure the correctness of queue & labels input, 
but it also shortens the time consumption of incorrect queues leading to applications failures,
that is, to prompt users as early as possible whether the queue setting results are correct, improving interaction efficiency.
- Effectively preventing the abuse of queues resource.


## How to create yarn queues
- Premise  
You must keep a admin user account. In the case, The admin user `admin` was used to login the `default` team of the system.  
- Locate the `Add New` button of the `Yarn Queue` page as followed steps and the fig.
  - Use the admin user account to login the system with a target team.
  - Click `Settings`.
  - Click `Yarn Queue`.
  - Click `Add New`.
  <img src="/doc/image/yarn-queue/flow_to_create.png"/><br></br><br></br>

- Type in the queue fields.  
  - Create a pure queue.
    - Type in the required yarn queue name
    - Type in the optional description of the yarn queue if needed.
    - Click `OK`.
    <img src="/doc/image/yarn-queue/flow_to_type_in_pure_queue.png"/><br></br><br></br>
  - Create a queue with labels.
    - Type in the required yarn queue-label name.  
      Queue label, eg. `queue1` represents queue name, `queue@label1,label2` represents that queue name is `queue1` and labels of the queue are `label1` & `label2`.  
    - Type in the optional description of the yarn queue if needed.
    - Click `OK`.
  <img src="/doc/image/yarn-queue/flow_to_type_in_pure_queue_labels.png"/><br></br><br></br>
- View the existed yarn queue(-labels)s.
  <img src="/doc/image/yarn-queue/existed_queues.png"/><br></br><br></br>


## How to use available queues

- Create a flink cluster with a specified yarn queue.
  
  <img src="/doc/image/yarn-queue/available_queues_when_creating_cluster.png"/><br></br><br></br>

- Create a yarn-application mode flink application with a specified yarn queue

  <img src="/doc/image/yarn-queue/use_yarn_app_mode_to_create_application.png"/><br></br><br></br>
  <img src="/doc/image/yarn-queue/available_queues_when_creating_application.png"/><br></br><br></br>



## Items about the feature

- Will this feature affect the `yarn-application` mode flink applications or `yarn-session` mode flink-clusters whose yarn queue(`yarn.application.queue`) & labels(`yarn.application.node-label`) specified by the old dynamic properties ?  
> The feature will not affect it at all. SteamPark still retains the highest priority of dynamic properties and does 
not enforce verification on the specified queues and labels in the dynamic properties, providing users with space for advanced configuration.

- The isolation of Yarn queue isn't stricter.
> In the current designs, the permissions of queues aren't strictly isolated due to
the relationship between the queues and the `yarn-session` mode flink clusters.  
> Flink `yarn-session` clusters are visible to all team, as shown in the figure. 
The target `yarn-session` flink cluster uses a queue in the `default` team, but it can still be selected in the `test` team.  
> So, if a `yarn-session` flink cluster uses a queue located in a certain team, as the resource usage of the target cluster increases, 
the consumption of queues resource used by the target resource will also increase.
This is the phenomenon that yarn queues can't be strictly isolated 
due to the relationship between the queues and the `yarn-session` mode flink clusters.   
> In other words, in `yarn-session` mode, flink clusters sharing leads to indirect sharing of queues resource between teams.

  <img src="/doc/image/yarn-queue/use_yarn_session_mode_to_create_application.png"/><br></br>

- Session cluster is shared by all teams. Why is it that when creating a `yarn-session` flink cluster, only the queues in the current team instead of all teams can be used in the queues candidate list ?
> Based on the mentioned above, StreamPark hopes that when creating a `yarn-session` flink cluster, 
administrators can specify the queue belonged to current of the current team only,
which could be better for administrators to perceive the impact of current operations on the current team.

- Why not support the isolation for `flink yarn-session clusters / general clusters` on team wide ?  
  - The impact range caused by changes in cluster visibility is larger than that caused by changes in queue visibility.  
  - StreamPark need to face greater difficulties in backward compatibility while also considering the user experience.   
  - At present, there is no exact research on the users group and applications scale deployed using
    `yarn-application` & `yarn-session` cluster modes in the community.    
  Based on this fact, the community didn't provide greater feature support.    


- If you have any related requirements about the feature, feel free to contact us or provide feedback directly to the community email list, please.   
  The community will make the next evaluation and support based on the usage status of the users group and applications scale.

Any suggestion is appreciated.

