"use strict";(self.webpackChunkapache_streampark_website=self.webpackChunkapache_streampark_website||[]).push([[9235],{14730:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>c});var i=n(86070),o=n(76113);const s={slug:"streampark-usercase-joyme",title:"Apache StreamPark\u2122's Production Practice in Joyme",tags:["StreamPark","Production Practice","FlinkSQL"]},a=void 0,r={permalink:"/blog/streampark-usercase-joyme",editUrl:"https://github.com/apache/incubator-streampark-website/edit/dev/blog/6-streampark-usercase-joyme.md",source:"@site/blog/6-streampark-usercase-joyme.md",title:"Apache StreamPark\u2122's Production Practice in Joyme",description:"Abstract",date:"2024-10-18T07:44:07.000Z",tags:[{label:"StreamPark",permalink:"/blog/tags/stream-park"},{label:"Production Practice",permalink:"/blog/tags/production-practice"},{label:"FlinkSQL",permalink:"/blog/tags/flink-sql"}],readingTime:10.14,hasTruncateMarker:!0,authors:[],frontMatter:{slug:"streampark-usercase-joyme",title:"Apache StreamPark\u2122's Production Practice in Joyme",tags:["StreamPark","Production Practice","FlinkSQL"]},unlisted:!1,prevItem:{title:"Apache StreamPark\u2122's Best Practices at Dustess, Simplifying Complexity for the Ultimate Experience",permalink:"/blog/streampark-usercase-dustess"},nextItem:{title:"An All-in-One Computation Tool in Haibo Tech's Production Practice and facilitation in Smart City Construction",permalink:"/blog/streampark-usercase-haibo"}},l={authorsImageUrls:[]},c=[{value:"1 Encountering Apache StreamPark\u2122",id:"1-encountering-apache-streampark",level:2},{value:"2 Development of Flink SQL Jobs",id:"2-development-of-flink-sql-jobs",level:2},{value:"<strong>1. Writing SQL</strong>",id:"1-writing-sql",level:3},{value:"<strong>2. Add Dependency</strong>",id:"2-add-dependency",level:3},{value:"<strong>3. Parameter Configuration</strong>",id:"3-parameter-configuration",level:3},{value:"<strong>4. Dynamic Parameter Settings</strong>",id:"4-dynamic-parameter-settings",level:3},{value:"3 Custom Code Job Development",id:"3-custom-code-job-development",level:2},{value:"4 Monitoring and Alerts",id:"4-monitoring-and-alerts",level:2},{value:"5 Common Issues",id:"5-common-issues",level:2},{value:"<strong>1. Job Launch Failure</strong>",id:"1-job-launch-failure",level:3},{value:"<strong>2. Job Running Failure</strong>",id:"2-job-running-failure",level:3},{value:"6 Community Impression",id:"6-community-impression",level:2},{value:"7 Conclusion",id:"7-conclusion",level:2}];function d(e){const t={code:"code",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Abstract:"})," This article presents the production practices of StreamPark at Joyme, written by Qin Jiyong, a big data engineer at Joyme. The main contents include:"]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Encountering StreamPark"}),"\n",(0,i.jsx)(t.li,{children:"Flink SQL job development"}),"\n",(0,i.jsx)(t.li,{children:"Custom code job development"}),"\n",(0,i.jsx)(t.li,{children:"Monitoring and alerting"}),"\n",(0,i.jsx)(t.li,{children:"Common issues"}),"\n",(0,i.jsx)(t.li,{children:"Community impressions"}),"\n",(0,i.jsx)(t.li,{children:"Summary"}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"1-encountering-apache-streampark",children:"1 Encountering Apache StreamPark\u2122"}),"\n",(0,i.jsx)(t.p,{children:"Encountering StreamPark was inevitable. Based on our existing real-time job development mode, we had to find an open-source platform to support our company's real-time business. Our current situation was as follows:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"We wrote jobs and packaged them to servers, then executed the Flink run command to submit them, which was a cumbersome and inefficient process."}),"\n",(0,i.jsx)(t.li,{children:"Flink SQL was submitted through a self-developed old platform. The developers of the old platform had left, and no one maintained the subsequent code, even if someone did, they would have to face the problem of high maintenance costs."}),"\n",(0,i.jsx)(t.li,{children:"Some of the authors were SparkStreaming jobs, with two sets of streaming engines and frameworks not unified, resulting in high development costs."}),"\n",(0,i.jsx)(t.li,{children:"Real-time jobs were developed in Scala and Java, with languages and technology stacks not unified."}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"For all these reasons, we needed an open-source platform to manage our real-time jobs, and we also needed to refactor to unify the development mode and language and centralize project management."}),"\n",(0,i.jsx)(t.p,{children:"The first encounter with StreamPark basically confirmed our choice. We quickly deployed and installed according to the official documentation, performed some operations after setting up, and were greeted with a user-friendly interface. StreamPark's support for multiple versions of Flink, permission management, job monitoring, and other series of functions already met our needs well. Further understanding revealed that its community is also very active. We have witnessed the process of StreamPark's feature completion since version 1.1.0. The development team is very ambitious, and we believe they will continue to improve."}),"\n",(0,i.jsx)(t.h2,{id:"2-development-of-flink-sql-jobs",children:"2 Development of Flink SQL Jobs"}),"\n",(0,i.jsx)(t.p,{children:"The Flink SQL development mode has brought great convenience. For some simple metric developments, it is possible to complete them with just a few SQL statements, without the need to write a single line of code. Flink SQL has facilitated the development work for many colleagues, especially since writing code can be somewhat difficult for those who work on warehouses."}),"\n",(0,i.jsx)(t.p,{children:"To add a new task, you open the task addition interface of StreamPark, where the default Development Mode is Flink SQL mode. You can write the SQL logic directly in the Flink SQL section."}),"\n",(0,i.jsx)(t.p,{children:"For the Flink SQL part, you can progressively write the logic SQL following the Flink official website's documentation. Generally, for our company, it consists of three parts: the Source connection, intermediate logic processing, and finally the Sink. Essentially, the Source is consuming data from Kafka, the logic layer will involve MySQL for dimension table queries, and the Sink part is mostly Elasticsearch, Redis, or MySQL."}),"\n",(0,i.jsx)(t.h3,{id:"1-writing-sql",children:(0,i.jsx)(t.strong,{children:"1. Writing SQL"})}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-sql",children:"-- Connect kafka\nCREATE TABLE source_table (\n `Data` ROW<uid STRING>\n) WITH (\n'connector.type' = 'kafka',\n'connector.version' = 'universal',\n'connector.topic' = '\u4e3b\u9898',\n'connector.properties.bootstrap.servers'='broker\u5730\u5740',\n'connector.startup-mode' = 'latest-offset',\n'update-mode' = 'append',\n'format.type' = 'json',\n'connector.properties.group.id' = '\u6d88\u8d39\u7ec4id',\n'format.derive-schema' = 'true'\n);\n\n-- Landing table sink\nCREATE TABLE sink_table (\n`uid` STRING\n) WITH (\n'connector.type' = 'jdbc',\n'connector.url' = 'jdbc:mysql://xxx/xxx?useSSL=false',\n'connector.username' = 'username',\n'connector.password' = 'password',\n'connector.table' = 'tablename',\n'connector.write.flush.max-rows' = '50',\n'connector.write.flush.interval' = '2s',\n'connector.write.max-retries' = '3'\n);\n\n-- Code logic pass\nINSERT INTO sink_table\nSELECT  Data.uid  FROM source_table;\n"})}),"\n",(0,i.jsx)(t.h3,{id:"2-add-dependency",children:(0,i.jsx)(t.strong,{children:"2. Add Dependency"})}),"\n",(0,i.jsx)(t.p,{children:"In terms of dependencies, it's an unique feature to Streampark. A complete Flink SQL job is innovatively split into two components within StreamPark: the SQL and the dependencies. The SQL part is easy to understand and requires no further explanation, but the dependencies are the various Connector JARs needed within the SQL, such as Kafka and MySQL Connectors. If these are used within the SQL, then these Connector dependencies must be introduced. In StreamPark, there are two ways to add dependencies: one is based on the standard Maven pom coordinates, and the other is by uploading the required Jars from a local source. These two methods can also be mixed and used as needed; simply apply, and these dependencies will be automatically loaded when the job is submitted."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(3920).A+"",width:"1080",height:"469"})}),"\n",(0,i.jsx)(t.h3,{id:"3-parameter-configuration",children:(0,i.jsx)(t.strong,{children:"3. Parameter Configuration"})}),"\n",(0,i.jsx)(t.p,{children:"The task addition and modification page has listed some common parameter settings, and for more extensive configuration options, a yaml configuration file is provided. Here, we've only set up checkpoint and savepoint configurations. The first is the location of the checkpoint, and the second is the frequency of checkpoint execution. We haven't changed other configurations much; users can customize these settings as per their needs."}),"\n",(0,i.jsx)(t.p,{children:"The rest of the parameter settings should be configured according to the specific circumstances of the job. If the volume of data processed is large or the logic is complex, it might require more memory and higher parallelism. Sometimes, adjustments need to be made multiple times based on the job's operational performance."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(11590).A+"",width:"1080",height:"610"})}),"\n",(0,i.jsx)(t.h3,{id:"4-dynamic-parameter-settings",children:(0,i.jsx)(t.strong,{children:"4. Dynamic Parameter Settings"})}),"\n",(0,i.jsx)(t.p,{children:"Since our deployment mode is on Yarn, we configured the name of the Yarn queue in the dynamic options. Some configurations have also been set to enable incremental checkpoints and state TTL (time-to-live), all of which can be found on Flink's official website. Before, some jobs frequently encountered out-of-memory issues. After adding the incremental parameter and TTL, the job operation improved significantly. Also, in cases where the Flink SQL job involves larger states and complex logic, I personally feel that it's better to implement them through streaming code for more control."}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"-Dyarn.application.queue=Yarn queue name"}),"\n",(0,i.jsx)(t.li,{children:"-Dstate.backend.incremental=true"}),"\n",(0,i.jsx)(t.li,{children:"-Dtable.exec.state.ttl=expiration time"}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"After completing the configuration, submit & deploy it from the application interface."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(89113).A+"",width:"1080",height:"422"})}),"\n",(0,i.jsx)(t.h2,{id:"3-custom-code-job-development",children:"3 Custom Code Job Development"}),"\n",(0,i.jsx)(t.p,{children:"For streaming jobs, we use Flink Java for development, having refactored previous Spark Scala, Flink Scala, and Flink Java jobs and then integrated these projects together. The purpose of this integration is to facilitate maintenance. Custom code jobs require the submission of code to Git, followed by project configuration:"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(61627).A+"",width:"1080",height:"365"})}),"\n",(0,i.jsx)(t.p,{children:"Once the configuration is completed, compile the corresponding project to finish the packaging phase. Thus, the Custom code jobs can also reference it. Compilation is required every time the code needs to go live; otherwise, only the last compiled code is available. Here's an issue: for security reasons, our company\u2019s GitLab account passwords are regularly updated. This leads to a situation where the StreamPark projects have the old passwords configured, resulting in a failure when pulling projects from Git during compilation. To address this problem, we contacted the community and learned that the capability to modify projects has been added in the subsequent version 1.2.1."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(88237).A+"",width:"1080",height:"214"})}),"\n",(0,i.jsx)(t.p,{children:"To create a new task, select Custom code, choose the Flink version, select the project and the module Jar package, and choose the development application mode as Apache Flink\xae (standard Flink program), program main function entry class, and the task's name."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(38504).A+"",width:"1080",height:"536"})}),"\n",(0,i.jsx)(t.p,{children:"As well as the task\u2019s parallelism, monitoring method, etc., memory size should be configured based on the needs of the task. Program Args, the program parameters, are defined according to the program's needs. For example: If our unified startup class is StartJobApp, to start a job, it's necessary to pass the full name of the job, informing the startup class which class to find to launch the task\u2014essentially, which is a reflection mechanism. After the job configuration is complete, it is also submitted with Submit and then deployed from the application interface."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(29617).A+"",width:"1080",height:"500"})}),"\n",(0,i.jsx)(t.h2,{id:"4-monitoring-and-alerts",children:"4 Monitoring and Alerts"}),"\n",(0,i.jsx)(t.p,{children:"The monitoring in StreamPark requires configuration in the setting module to set up the basic information for sending emails."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(54309).A+"",width:"1080",height:"380"})}),"\n",(0,i.jsx)(t.p,{children:"Then, within the tasks, configure the restart strategy: monitor how many times an exception occurs within a certain time, and then decide whether the strategy is to alert or restart, as well as which email address should receive the alert notifications. The version currently used by our company is 1.2.1, which supports only email sending."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(17174).A+"",width:"1080",height:"243"})}),"\n",(0,i.jsx)(t.p,{children:"When our jobs fail, we can receive alerts through email. These alerts are quite clear, showing which job is in what state. You can also click on the specific address below to view details."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(89465).A+"",width:"1080",height:"1517"})}),"\n",(0,i.jsx)(t.p,{children:"Regarding alerts, we have developed a scheduled task based on StreamPark's t_flink_app table. Why do this? Because most people might not check their emails promptly when it comes to email notifications. Therefore, we opted to monitor the status of each task and send corresponding monitoring information to our Lark (Feishu) alert group, enabling us to promptly identify and address issues with the tasks. It's a simple Python script, then configured with crontab to execute at scheduled times."}),"\n",(0,i.jsx)(t.h2,{id:"5-common-issues",children:"5 Common Issues"}),"\n",(0,i.jsx)(t.p,{children:"When it comes to the abnormal issues of jobs, we have summarized them into the following categories:"}),"\n",(0,i.jsx)(t.h3,{id:"1-job-launch-failure",children:(0,i.jsx)(t.strong,{children:"1. Job Launch Failure"})}),"\n",(0,i.jsx)(t.p,{children:"The issue of job launch failure refers to the situation where the job does not start upon initiation. In this case, one needs to check the detailed information logs on the interface. There is an eye-shaped button in our task list; by clicking on it, one can find the submitted job log information in the start logs. If there is clear prompt information, the issue can be directly addressed. If not, one has to check the streamx.out file under the logs/ directory of the backend deployment task to find the log information regarding the launch failure."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(12536).A+"",width:"1080",height:"83"})}),"\n",(0,i.jsx)(t.h3,{id:"2-job-running-failure",children:(0,i.jsx)(t.strong,{children:"2. Job Running Failure"})}),"\n",(0,i.jsx)(t.p,{children:"If the task has started but fails during the running phase, this situation might seem similar to the first, but is actually entirely different. This means that the task has been submitted to the cluster, but the task itself has problems running. One can still apply the troubleshooting method from the first scenario to open the specific logs of the job, find the task information on yarn, and then go to yarn's logs with the yarn's tackurl recorded in the logs to look for the specific reasons. Whether it is the absence of the Sql's Connector or a null pointer in a line of code, one can find the detailed stack information. With specific information, one can find the right remedy."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(86222).A+"",width:"1080",height:"82"})}),"\n",(0,i.jsx)(t.h2,{id:"6-community-impression",children:"6 Community Impression"}),"\n",(0,i.jsx)(t.p,{children:"Often when we discuss issues in the StreamPark user group, we get immediate responses from community members. Issues that cannot be resolved at the moment are generally fixed in the next version or the latest code branch. In the group, we also see many non-community members actively helping each other out. There are many big names from other communities as well, and many members actively join the community development work. The whole community feels very active to me!"}),"\n",(0,i.jsx)(t.h2,{id:"7-conclusion",children:"7 Conclusion"}),"\n",(0,i.jsx)(t.p,{children:"Currently, our company runs 60 real-time jobs online, with Flink SQL and custom code each making up about half. More real-time tasks will be put online subsequently. Many colleagues worry about the stability of StreamPark, but based on several months of production practice in our company, StreamPark is just a platform to help you develop, deploy, monitor, and manage jobs. Whether it is stable or not depends on the stability of our own Hadoop Yarn cluster (we use the onyan mode) and has little to do with StreamPark itself. It also depends on the robustness of the Flink SQL or code you write. These two aspects should be the primary concerns. Only when these two aspects are problem-free can the flexibility of StreamPark be fully utilized to improve job performance. To discuss the stability of StreamPark in isolation is somewhat extreme."}),"\n",(0,i.jsx)(t.p,{children:"That is all the content shared by StreamPark at Joyme. Thank you for reading this article. We are very grateful for such an excellent product provided by StreamPark, which is a true act of benefiting others. From version 1.0 to 1.2.1, the bugs encountered are promptly fixed, and every issue is taken seriously. We are still using the on yarn deployment mode. Restarting yarn will still cause jobs to be lost, but restarting yarn is not something we do every day. The community will also look to fix this problem as soon as possible. I believe that StreamPark will get better and better, with a promising future ahead."})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},3920:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/add_dependency-281888d96a8f3ce6e9af01efef9de643.png"},38504:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/add_projectconfiguration-26b97212de577a0cbc46b59f1eceea0b.png"},89465:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/alarm_eamil-29b2875dbfcbeb071fef815ab751786a.png"},29617:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/application_interface-51c8f96e343842f32b56c3c889064cba.png"},89113:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/application_job-5518b58af2b481d7bdb36a7bae252c41.png"},11590:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/checkpoint_configuration-861a4f0439b1a0f8aade35e10e6b60c5.png"},17174:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/email_setting-7b8ddba6688c75cfad32f5d16e93354f.png"},88237:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/flink_system-02dee8b704254087aae900731ae47076.png"},61627:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/project_configuration-add3d079bba91ac4977b830d3c3fe8f7.png"},12536:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/start_log-6ce6b3125c8693db96197193241d6807.png"},54309:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/system_setting-6b5b21f22fc4a32b973ede0a5f21ebc2.png"},86222:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/yarn_log-100e18b484ec81cf3165736de8259365.png"},76113:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>r});var i=n(30758);const o={},s=i.createContext(o);function a(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);