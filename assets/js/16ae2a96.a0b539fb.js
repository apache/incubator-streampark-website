"use strict";(self.webpackChunkapache_streampark_website=self.webpackChunkapache_streampark_website||[]).push([[8986],{6797:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>c});var a=t(86070),s=t(76113);const i={slug:"streampark-usercase-shunwang",title:"Apache StreamPark\u2122 in the Large-Scale Production Practice at Shunwang Technology",tags:["StreamPark","Production Practice","FlinkSQL"]},o=void 0,r={permalink:"/blog/streampark-usercase-shunwang",editUrl:"https://github.com/apache/incubator-streampark-website/edit/dev/blog/4-streampark-usercase-shunwang.md",source:"@site/blog/4-streampark-usercase-shunwang.md",title:"Apache StreamPark\u2122 in the Large-Scale Production Practice at Shunwang Technology",description:"Preface: This article primarily discusses the challenges encountered by Shunwang Technology in using the Flink computation engine, and how StreamPark is leveraged as a real-time data platform to address these challenges, thus supporting the company's business on a large scale.",date:"2024-10-18T07:44:07.000Z",tags:[{label:"StreamPark",permalink:"/blog/tags/stream-park"},{label:"Production Practice",permalink:"/blog/tags/production-practice"},{label:"FlinkSQL",permalink:"/blog/tags/flink-sql"}],readingTime:11.575,hasTruncateMarker:!0,authors:[],frontMatter:{slug:"streampark-usercase-shunwang",title:"Apache StreamPark\u2122 in the Large-Scale Production Practice at Shunwang Technology",tags:["StreamPark","Production Practice","FlinkSQL"]},unlisted:!1,prevItem:{title:"Based on Apache Paimon + Apache StreamPark\u2122's Streaming Data Warehouse Practice by Bondex",permalink:"/blog/streampark-usercase-bondex-with-paimon"},nextItem:{title:"Apache StreamPark\u2122's Best Practices at Dustess, Simplifying Complexity for the Ultimate Experience",permalink:"/blog/streampark-usercase-dustess"}},l={authorsImageUrls:[]},c=[{value:"<strong>Introduction to the Company&#39;s Business</strong>",id:"introduction-to-the-companys-business",level:2},{value:"<strong>Challenges Encountered</strong>",id:"challenges-encountered",level:2},{value:"<strong>Cumbersome SQL Development Process</strong>",id:"cumbersome-sql-development-process",level:3},{value:"<strong>Drawbacks of SQL-Client</strong>",id:"drawbacks-of-sql-client",level:3},{value:"<strong>Lack of Unified Job Management</strong>",id:"lack-of-unified-job-management",level:3},{value:"<strong>Cumbersome Problem Diagnosis Process</strong>",id:"cumbersome-problem-diagnosis-process",level:3},{value:"<strong>Why Use Apache StreamPark\u2122</strong>",id:"why-use-apache-streampark",level:2},{value:"01  <strong>Apache StreamPark\u2122: A Powerful Tool for Solving Flink Issues</strong>",id:"01--apache-streampark-a-powerful-tool-for-solving-flink-issues",level:3},{value:"02  <strong>How Apache StreamPark\u2122 Addresses Issues of the Self-Developed Platform</strong>",id:"02--how-apache-streampark-addresses-issues-of-the-self-developed-platform",level:3},{value:"Practical Implementation",id:"practical-implementation",level:2},{value:"01  <strong>Leveraging the Capabilities of Flink-SQL-Gateway</strong>",id:"01--leveraging-the-capabilities-of-flink-sql-gateway",level:3},{value:"02  <strong>Enhancing Flink Cluster Management Capabilities</strong>",id:"02--enhancing-flink-cluster-management-capabilities",level:3},{value:"03  <strong>Enhancing Alert Capabilities</strong>",id:"03--enhancing-alert-capabilities",level:3},{value:"04  <strong>Adding a Blocking Queue to Solve Throttling Issues</strong>",id:"04--adding-a-blocking-queue-to-solve-throttling-issues",level:3},{value:"Benefits Brought",id:"benefits-brought",level:2},{value:"Future Plans",id:"future-plans",level:2}];function d(e){const n={a:"a",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{src:t(45625).A+"",width:"1080",height:"460"})}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Preface:"})," This article primarily discusses the challenges encountered by Shunwang Technology in using the Flink computation engine, and how StreamPark is leveraged as a real-time data platform to address these challenges, thus supporting the company's business on a large scale."]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Introduction to the company's business"}),"\n",(0,a.jsx)(n.li,{children:"Challenges encountered"}),"\n",(0,a.jsx)(n.li,{children:"Why choose StreamPark"}),"\n",(0,a.jsx)(n.li,{children:"Implementation in practice"}),"\n",(0,a.jsx)(n.li,{children:"Benefits Brought"}),"\n",(0,a.jsx)(n.li,{children:"Future planning"}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"introduction-to-the-companys-business",children:(0,a.jsx)(n.strong,{children:"Introduction to the Company's Business"})}),"\n",(0,a.jsx)(n.p,{children:"Hangzhou Shunwang Technology Co., Ltd. was established in 2005. Upholding the corporate mission of connecting happiness through technology, it is one of the influential pan-entertainment technology service platforms in China. Over the years, the company has always been driven by products and technology, dedicated to creating immersive entertainment experiences across all scenes through digital platform services."}),"\n",(0,a.jsx)(n.p,{children:"Since its inception, Shunwang Technology has experienced rapid business growth, serving 80,000 offline physical stores, owning more than 50 million internet users, reaching over 140 million netizens annually, with 7 out of every 10 public internet service venues using Shunwang Technology's products."}),"\n",(0,a.jsx)(n.p,{children:"With a vast user base, Shunwang Technology has been committed to providing a superior product experience and achieving digital transformation of the enterprise. Since 2015, it has vigorously developed big data capabilities, with Flink playing a crucial role in Shunwang Technology\u2019s real-time computing. At Shunwang Technology, real-time computing is roughly divided into four application scenarios:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Real-time update of user profiles: This includes internet cafe profiles and netizen profiles."}),"\n",(0,a.jsx)(n.li,{children:"Real-time risk control: This includes activity anti-brushing, monitoring of logins from different locations, etc."}),"\n",(0,a.jsx)(n.li,{children:"Data synchronization: This includes data synchronization from Kafka to Hive / Iceberg / ClickHouse, etc."}),"\n",(0,a.jsx)(n.li,{children:"Real-time data analysis: This includes real-time big screens for games, voice, advertising, live broadcasts, and other businesses."}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"To date, Shunwang Technology has to process TB-level data daily, with a total of more than 700 real-time tasks, of which FlinkSQL tasks account for over 95%. With the rapid development of the company's business and the increased demand for data timeliness, it is expected that the number of Flink tasks will reach 900+ by the end of this year."}),"\n",(0,a.jsx)(n.h2,{id:"challenges-encountered",children:(0,a.jsx)(n.strong,{children:"Challenges Encountered"})}),"\n",(0,a.jsx)(n.p,{children:"Flink, as one of the most popular real-time computing frameworks currently, boasts powerful features such as high throughput, low latency, and stateful computations. However, in our exploration, we found that while Flink has strong computational capabilities, the community has not provided effective solutions for job development management and operational issues. We have roughly summarized some of the pain points we encountered in Flink job development management into four aspects, as follows:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(41814).A+"",width:"1080",height:"744"})}),"\n",(0,a.jsx)(n.p,{children:"Facing a series of pain points in the management and operation of Flink jobs, we have been looking for suitable solutions to lower the barrier to entry for our developers using Flink and improve work efficiency."}),"\n",(0,a.jsx)(n.p,{children:"Before we encountered StreamPark, we researched some companies' Flink management solutions and found that they all developed and managed Flink jobs through self-developed real-time job platforms. Consequently, we decided to develop our own real-time computing management platform to meet the basic needs of our developers for Flink job management and operation. Our platform is called Streaming-Launcher, with the following main functions:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(79458).A+"",width:"1080",height:"670"})}),"\n",(0,a.jsx)(n.p,{children:"However, as our developers continued to use Streaming-Launcher, they discovered quite a few deficiencies: the development cost for Flink remained too high, work efficiency was poor, and troubleshooting was difficult. We summarized the defects of Streaming-Launcher as follows:"}),"\n",(0,a.jsx)(n.h3,{id:"cumbersome-sql-development-process",children:(0,a.jsx)(n.strong,{children:"Cumbersome SQL Development Process"})}),"\n",(0,a.jsx)(n.p,{children:"Business developers need multiple tools to complete the development of a single SQL job, increasing the barrier to entry for our developers."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"cc0b1414ed43942e0ef5e9129c2bf817",src:t(14074).A+"",width:"1080",height:"229"})}),"\n",(0,a.jsx)(n.h3,{id:"drawbacks-of-sql-client",children:(0,a.jsx)(n.strong,{children:"Drawbacks of SQL-Client"})}),"\n",(0,a.jsx)(n.p,{children:"The SQL-Client provided by Flink currently has certain drawbacks regarding the support for job execution modes."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(57924).A+"",width:"1080",height:"721"})}),"\n",(0,a.jsx)(n.h3,{id:"lack-of-unified-job-management",children:(0,a.jsx)(n.strong,{children:"Lack of Unified Job Management"})}),"\n",(0,a.jsx)(n.p,{children:"Within Streaming-Launcher, there is no provision of a unified job management interface. Developers cannot intuitively see the job running status and can only judge the job situation through alarm information, which is very unfriendly to developers. If a large number of tasks fail at once due to Yarn cluster stability problems or network fluctuations and other uncertain factors, it is easy for developers to miss restoring a certain task while manually recovering jobs, which can lead to production accidents."}),"\n",(0,a.jsx)(n.h3,{id:"cumbersome-problem-diagnosis-process",children:(0,a.jsx)(n.strong,{children:"Cumbersome Problem Diagnosis Process"})}),"\n",(0,a.jsx)(n.p,{children:"To view logs for a job, developers must go through multiple steps, which to some extent reduces their work efficiency."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(92880).A+"",width:"1080",height:"122"})}),"\n",(0,a.jsx)(n.h2,{id:"why-use-apache-streampark",children:(0,a.jsx)(n.strong,{children:"Why Use Apache StreamPark\u2122"})}),"\n",(0,a.jsx)(n.p,{children:"Faced with the defects of our self-developed platform Streaming-Launcher, we have been considering how to further lower the barriers to using Flink and improve work efficiency. Considering the cost of human resources and time, we decided to seek help from the open-source community and look for an appropriate open-source project to manage and maintain our Flink tasks."}),"\n",(0,a.jsxs)(n.h3,{id:"01--apache-streampark-a-powerful-tool-for-solving-flink-issues",children:["01  ",(0,a.jsx)(n.strong,{children:"Apache StreamPark\u2122: A Powerful Tool for Solving Flink Issues"})]}),"\n",(0,a.jsx)(n.p,{children:"Fortunately, in early June 2022, we stumbled upon StreamPark on GitHub and embarked on a preliminary exploration full of hope. We found that StreamPark's capabilities can be broadly divided into three areas: user permission management, job operation and maintenance management, and development scaffolding."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"User Permission Management"})}),"\n",(0,a.jsx)(n.p,{children:"In the StreamPark platform, to avoid the risk of users having too much authority and making unnecessary misoperations that affect job stability and the accuracy of environmental configurations, some user permission management functions are provided. This is very necessary for enterprise-level users."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(20135).A+"",width:"1080",height:"721"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Job Operation and Maintenance Management"})}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"Our main focus during the research on StreamPark was its capability to manage the entire lifecycle of jobs:"})," from development and deployment to management and problem diagnosis. ",(0,a.jsx)(n.strong,{children:"Fortunately, StreamPark excels in this aspect, relieving developers from the pain points associated with Flink job management and operation."})," Within StreamPark\u2019s job operation and maintenance management, there are three main modules: basic job management functions, Jar job management, and FlinkSQL job management as shown below:"]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(57940).A+"",width:"1080",height:"542"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Development Scaffolding"})}),"\n",(0,a.jsx)(n.p,{children:"Further research revealed that StreamPark is not just a platform but also includes a development scaffold for Flink jobs. It offers a better solution for code-written Flink jobs, standardizing program configuration, providing a simplified programming model, and a suite of Connectors that lower the barrier to entry for DataStream development."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(89886).A+"",width:"1080",height:"720"})}),"\n",(0,a.jsxs)(n.h3,{id:"02--how-apache-streampark-addresses-issues-of-the-self-developed-platform",children:["02  ",(0,a.jsx)(n.strong,{children:"How Apache StreamPark\u2122 Addresses Issues of the Self-Developed Platform"})]}),"\n",(0,a.jsx)(n.p,{children:"We briefly introduced the core capabilities of StreamPark above. During the technology selection process at Shunwang Technology, we found that StreamPark not only includes the basic functions of our existing Streaming-Launcher but also offers a more complete set of solutions to address its many shortcomings. Here, we focus on the solutions provided by StreamPark for the deficiencies of our self-developed platform, Streaming-Launcher."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(2570).A+"",width:"1080",height:"720"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"One-Stop Flink Job Development Capability"})}),"\n",(0,a.jsxs)(n.p,{children:["To lower the barriers to Flink job development and improve developers' work efficiency, ",(0,a.jsx)(n.strong,{children:"StreamPark provides features like FlinkSQL IDE, parameter management, task management, code management, one-click compilation, and one-click job deployment and undeployment"}),". Our research found that these integrated features of StreamPark could further enhance developers\u2019 work efficiency. To some extent, developers no longer need to concern themselves with the difficulties of Flink job management and operation and can focus on developing the business logic. These features also solve the pain point of cumbersome SQL development processes in Streaming-Launcher."]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(43602).A+"",width:"1080",height:"959"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Support for Multiple Deployment Modes"})}),"\n",(0,a.jsxs)(n.p,{children:["The Streaming-Launcher was not flexible for developers since it only supported the Yarn Session mode. StreamPark provides a comprehensive solution for this aspect. ",(0,a.jsx)(n.strong,{children:"StreamPark fully supports all of Flink's deployment modes: Remote, Yarn Per-Job, Yarn Application, Yarn Session, K8s Session, and K8s Application,"})," allowing developers to freely choose the appropriate running mode for different business scenarios."]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"Unified Job Management Center"})}),"\n",(0,a.jsx)(n.p,{children:"For developers, job running status is one of their primary concerns. In Streaming-Launcher, due to the lack of a unified job management interface, developers had to rely on alarm information and Yarn application status to judge the state of tasks, which was very unfriendly. StreamPark addresses this issue by providing a unified job management interface, allowing for a clear view of the running status of each task."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(18155).A+"",width:"1080",height:"572"})}),"\n",(0,a.jsx)(n.p,{children:"In the Streaming-Launcher, developers had to go through multiple steps to diagnose job issues and locate job runtime logs. StreamPark offers a one-click jump feature that allows quick access to job runtime logs."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(88331).A+"",width:"1080",height:"575"})}),"\n",(0,a.jsx)(n.h2,{id:"practical-implementation",children:"Practical Implementation"}),"\n",(0,a.jsx)(n.p,{children:"When introducing StreamPark to Shunwang Technology, due to the company's business characteristics and some customized requirements from the developers, we made some additions and optimizations to the functionalities of StreamPark. We have also summarized some problems encountered during the use and corresponding solutions."}),"\n",(0,a.jsxs)(n.h3,{id:"01--leveraging-the-capabilities-of-flink-sql-gateway",children:["01  ",(0,a.jsx)(n.strong,{children:"Leveraging the Capabilities of Flink-SQL-Gateway"})]}),"\n",(0,a.jsx)(n.p,{children:"At Shunwang Technology, we have developed the ODPS platform based on the Flink-SQL-Gateway to facilitate business developers in managing the metadata of Flink tables. Business developers perform DDL operations on Flink tables in ODPS, and then carry out analysis and query operations on the created Flink tables in StreamPark. Throughout the entire business development process, we have decoupled the creation and analysis of Flink tables, making the development process appear more straightforward."}),"\n",(0,a.jsx)(n.p,{children:"If developers wish to query real-time data in ODPS, we need to provide a Flink SQL runtime environment. We have used StreamPark to run a Yarn Session Flink environment to support ODPS in conducting real-time queries."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(27076).A+"",width:"1080",height:"541"})}),"\n",(0,a.jsx)(n.p,{children:"Currently, the StreamPark community is intergrating with Flink-SQL-Gateway to further lower the barriers to developing real-time jobs."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.a,{href:"https://github.com/apache/streampark/issues/2274",children:"https://github.com/apache/streampark/issues/2274"})}),"\n",(0,a.jsxs)(n.h3,{id:"02--enhancing-flink-cluster-management-capabilities",children:["02  ",(0,a.jsx)(n.strong,{children:"Enhancing Flink Cluster Management Capabilities"})]}),"\n",(0,a.jsx)(n.p,{children:"At Shunwang Technology, there are numerous jobs synchronizing data from Kafka to Iceberg / PG / Clickhouse / Hive. These jobs do not have high resource requirements and timeliness demands on Yarn. However, if Yarn Application and per-job modes are used for all tasks, where each task starts a JobManager, this would result in a waste of Yarn resources. For this reason, we decided to run these numerous data synchronization jobs in Yarn Session mode."}),"\n",(0,a.jsx)(n.p,{children:"In practice, we found it difficult for business developers to intuitively know how many jobs are running in each Yarn Session, including the total number of jobs and the number of jobs that are running. Based on this, to facilitate developers to intuitively observe the number of jobs in a Yarn Session, we added All Jobs and Running Jobs in the Flink Cluster interface to indicate the total number of jobs and the number of running jobs in a Yarn Session."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(80730).A+"",width:"1080",height:"543"})}),"\n",(0,a.jsxs)(n.h3,{id:"03--enhancing-alert-capabilities",children:["03  ",(0,a.jsx)(n.strong,{children:"Enhancing Alert Capabilities"})]}),"\n",(0,a.jsx)(n.p,{children:"Since each company's SMS alert platform is implemented differently, the StreamPark community has not abstracted a unified SMS alert function. Here, we have implemented the SMS alert function through the Webhook method."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(6395).A+"",width:"1080",height:"601"})}),"\n",(0,a.jsxs)(n.h3,{id:"04--adding-a-blocking-queue-to-solve-throttling-issues",children:["04  ",(0,a.jsx)(n.strong,{children:"Adding a Blocking Queue to Solve Throttling Issues"})]}),"\n",(0,a.jsx)(n.p,{children:"In production practice, we found that when a large number of tasks fail at the same time, such as when a Yarn Session cluster goes down, platforms like Feishu/Lark and WeChat have throttling issues when multiple threads call the alert interface simultaneously. Consequently, only a portion of the alert messages will be sent by StreamPark due to the throttling issues of platforms like Feishu/Lark and WeChat, which can easily mislead developers in troubleshooting. At Shunwang Technology, we added a blocking queue and an alert thread to solve the throttling issue."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(29637).A+"",width:"1080",height:"320"})}),"\n",(0,a.jsx)(n.p,{children:"When the job monitoring scheduler detects an abnormality in a job, it generates a job exception message and sends it to the blocking queue. The alert thread will continuously consume messages from the blocking queue. Upon receiving a job exception message, it will send the alert to different platforms sequentially according to the user-configured alert information. Although this method might delay the alert delivery to users, in practice, we found that even with 100+ Flink jobs failing simultaneously, the delay in receiving alerts is less than 3 seconds. Such a delay is completely acceptable to our business development colleagues. This improvement has been recorded as an ISSUE and is currently under consideration for contribution to the community."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.a,{href:"https://github.com/apache/streampark/issues/2142",children:"https://github.com/apache/streampark/issues/2142"})}),"\n",(0,a.jsx)(n.h2,{id:"benefits-brought",children:"Benefits Brought"}),"\n",(0,a.jsx)(n.p,{children:"We started exploring and using StreamX 1.2.3 (the predecessor of StreamPark) and after more than a year of running in, we found that StreamPark truly resolves many pain points in the development management and operation and maintenance of Flink jobs."}),"\n",(0,a.jsx)(n.p,{children:"The greatest benefit that StreamPark has brought to Shunwang Technology is the lowered threshold for using Flink and improved development efficiency. Previously, our business development colleagues had to use multiple tools such as vscode, GitLab, and a scheduling platform in the original Streaming-Launcher to complete a FlinkSQL job development. The process was tedious, going through multiple tools from development to compilation to release. StreamPark provides one-stop service, allowing job development, compilation, and release to be completed on StreamPark, simplifying the entire development process."}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.strong,{children:"At present, StreamPark has been massively deployed in the production environment at Shunwang Technology, with the number of FlinkSQL jobs managed by StreamPark increasing from the initial 500+ to nearly 700, while also managing more than 10 Yarn Session Clusters."})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(34253).A+"",width:"1080",height:"572"})}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"Image",src:t(2486).A+"",width:"1080",height:"545"})}),"\n",(0,a.jsx)(n.h2,{id:"future-plans",children:"Future Plans"}),"\n",(0,a.jsx)(n.p,{children:"As one of the early users of StreamPark, Shunwang Technology has been communicating with the community for a year and participating in the polishing of StreamPark's stability. We have submitted the Bugs encountered in production operations and new Features to the community. In the future, we hope to manage the metadata information of Flink tables on StreamPark, and implement cross-data-source query analysis functions based on the Flink engine through multiple Catalogs. Currently, StreamPark is integrating with Flink-SQL-Gateway capabilities, which will greatly help in the management of table metadata and cross-data-source query functions in the future."}),"\n",(0,a.jsx)(n.p,{children:"Since Shunwang Technology primarily runs jobs in Yarn Session mode, we hope that StreamPark can provide more support for Remote clusters, Yarn Session clusters, and K8s Session clusters, such as monitoring and alerts, and optimizing operational processes."}),"\n",(0,a.jsx)(n.p,{children:"Considering the future, as the business develops, we may use StreamPark to manage more Flink real-time jobs, and StreamPark in single-node mode may not be safe. Therefore, we are also looking forward to the High Availability (HA) of StreamPark."}),"\n",(0,a.jsx)(n.p,{children:"We will also participate in the construction of the capabilities of StreamPark is integrating with Flink-SQL-Gateway, enriching Flink Cluster functionality, and StreamPark HA."})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},34253:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/achievements1-9eb1dec5b2fa480e897cf1c12d1425d8.png"},2486:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/achievements2-5aa9b3c14892f9b1d8b054e82f3b4ad3.png"},6395:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/alarm-8fa330c6a2d27cfd62878dcd20cd524c.png"},43602:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/application-c99d4b0512fdb7d214e5429769629930.png"},45625:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/autor-4fee09aa3abf8842dcdbb7ada1aa9409.png"},80730:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/cluster-96bd791c1c4f3d6144fbd1d134d89cd6.png"},89886:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/connectors-d405c391d0cfdd753e7b329433275117.png"},2570:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/function-c2d3ad419e1676a0253d933935921a71.png"},27076:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/homework-96030dec4ea9db88b42668873f5a176d.png"},57940:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/homework_manager-96dc37860dd87f12ed55311b38116931.png"},79458:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/launcher-766611cb0dddb99d8437ead44d0665d4.png"},88331:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/logs-e4e9f2084f1fbcf0a4afe079433cef0a.png"},18155:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/management-9eb1dec5b2fa480e897cf1c12d1425d8.png"},41814:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/pain-4d2aee42ea7aae80eaeac17a6d51c090.png"},20135:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/permission-affd274acd10773ad4531da9102f3f91.png"},29637:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/queue-83552f1862acff8811b74488e8fe7c05.png"},57924:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/sql_client-32fd9eb063198e6f35349187eed61546.png"},14074:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/sql_develop-ef85f6a001fb814d494c9b39eb2dfba9.png"},92880:(e,n,t)=>{t.d(n,{A:()=>a});const a=t.p+"assets/images/step-d945592bbe32c0e093289c6265472f1c.png"},76113:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>r});var a=t(30758);const s={},i=a.createContext(s);function o(e){const n=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),a.createElement(i.Provider,{value:n},e.children)}}}]);