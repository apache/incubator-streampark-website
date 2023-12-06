# 快速上手
> 说明：该部分旨在通过简单的操作步骤，体验使用StreamPark平台提交flink作业的边界流程。

## 配置FLINK_HOME
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701865406948-b34d219d-6d7e-474b-9acb-7e11b4e7c93c.png#averageHue=%23cdebe8&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u24b68672&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=64511&status=done&style=none&taskId=ud186ffe5-f89a-4600-b149-1a58091dcb5&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701865537393-eeef8b04-9581-4a6f-83df-65261ba3980a.png#averageHue=%237f8279&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u27e38640&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=79284&status=done&style=none&taskId=u8b441fe8-6971-49de-afe0-934013b4e8f&title=&width=1241.8181549024982)
> 点击"OK"，保存

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701865568635-aee94232-c677-4353-be7d-5bf5cc515589.png#averageHue=%23aadce6&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u8d0fb30f&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=64698&status=done&style=none&taskId=udbd6e2e7-969f-462d-bd0a-47487c5734f&title=&width=1241.8181549024982)
## 配置Flink Cluster
> 根据flink 部署模式 以及 资源管理方式，StreamPark 支持以下6种作业模式
> - **Standalone Session**
> - **Yarn Session**
> - **Yarn Per-job**
> - **Yarn Application**
> - **K8s Session**
> - **K8s Application**
> 
本次选取较为简单的 Standalone Session 模式(**下图绿色连线**)，快速上手。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701866758725-aaef8d0d-3b27-4a24-b757-6fc89bf27bb1.png#averageHue=%23fef7f7&clientId=u508dae7f-83aa-4&from=paste&height=321&id=ub1f07d1a&originHeight=353&originWidth=637&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=15170&status=done&style=none&taskId=ub830f3d5-a13f-4408-be54-c66e24e94aa&title=&width=579.0908965394519)
### 服务器启动 flink Standalone Session
```bash
start-cluster.sh
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867004740-84622fc9-358c-46c8-b562-132636726cf8.png#averageHue=%23130d0b&clientId=u508dae7f-83aa-4&from=paste&height=90&id=u1b399168&originHeight=99&originWidth=667&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=10842&status=done&style=none&taskId=u64da2594-ef86-4e19-8280-96447d66eeb&title=&width=606.3636232210588)
> 页面访问：[http://hadoop:8081/](http://hadoop:8081/)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867049527-647338fb-6f96-4dfe-a7a2-3ea792fcfac5.png#averageHue=%23d4b582&clientId=u508dae7f-83aa-4&from=paste&height=633&id=u8575917a&originHeight=696&originWidth=1362&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=65746&status=done&style=none&taskId=ud6e6ad05-385f-49ef-8132-c96c0115107&title=&width=1238.1817913449506)
### 配置Flink Cluster
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867098150-ce5504ff-23cf-4b86-b464-61de31304fe9.png#averageHue=%23caebe8&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u60189316&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=65008&status=done&style=none&taskId=u2c4d0550-9c63-440b-a0af-306bb9060c6&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867222025-1f172c90-67df-4883-a693-4c33a2b4cdf5.png#averageHue=%23e5d4aa&clientId=u508dae7f-83aa-4&from=paste&height=592&id=ud7fd95b7&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=74234&status=done&style=none&taskId=ueb315c7d-032e-4922-88e2-80db1f57744&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867235623-15e67397-106e-4eea-a31b-1ab48a4ee36a.png#averageHue=%23c6dec4&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u8459b711&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=76609&status=done&style=none&taskId=u81f8aad9-555e-405c-9870-9ccec762e19&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867328125-afcae61a-0d38-4d90-b994-fb5a54a92700.png#averageHue=%23b2e1e8&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u6fa91fde&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=75740&status=done&style=none&taskId=u7c649f5b-e91c-4e5d-a7ae-e537e585e4e&title=&width=1241.8181549024982)
## 创建作业
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867392714-35af5219-e80b-43a0-86b3-d1c7ce783778.png#averageHue=%23abd09d&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u0c1f94d2&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=94703&status=done&style=none&taskId=uf76bcefc-a461-4801-8d40-861be526726&title=&width=1241.8181549024982)
### 主要参数
> - Development Mode: 选择 “Flink SQL”
> - Execution Mode:  选择 “remote”
> - Flink Version:  选择  "flink-1.14", 即 “1.1 配置FLINK_HOME”里面配置的 
> - Flink Cluster:  选择 “myStandalonSession”, 即“1.2 配置FLINK Cluster”里面配置的 
> - Flink SQL: 详见下面示例
> - Application Name: 作业名称

### 创建作业
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867808970-021af1f9-d3b2-4aaa-9c2a-878d0f1a1902.png#averageHue=%23fdfdfd&clientId=u508dae7f-83aa-4&from=paste&height=227&id=u83cf46d6&originHeight=250&originWidth=951&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=12688&status=done&style=none&taskId=u5dc282b5-cf49-46a7-9834-c909bf1598e&title=&width=864.5454358069369)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867855376-507e48ad-c3d6-462d-9057-f6dd6bafdf22.png#averageHue=%23fefefc&clientId=u508dae7f-83aa-4&from=paste&height=316&id=ud7499662&originHeight=348&originWidth=796&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=27851&status=done&style=none&taskId=u2b628d8a-5880-4e26-a282-ea52af300bd&title=&width=723.6363479519682)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867927623-19ecc9b7-eaa3-46cd-8307-c78e61613c25.png#averageHue=%23fcfbfb&clientId=u508dae7f-83aa-4&from=paste&height=45&id=u173a7a38&originHeight=49&originWidth=860&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=3086&status=done&style=none&taskId=u0f63b121-085b-4e6b-beeb-425f78bc45d&title=&width=781.8181648727294)
### 保存作业
> 点击 蓝色“Submit”按钮，提交作业

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701867996167-bbb92021-869c-44f5-a2ca-692e73a71b00.png#averageHue=%23e7d3ac&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u5e36bda5&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=73075&status=done&style=none&taskId=u3e6ed820-5faf-45e3-b047-bcbc0c64099&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868099973-872ec2f0-5cb1-4b51-a85f-1b65eace2dd5.png#averageHue=%2371b577&clientId=u508dae7f-83aa-4&from=paste&height=592&id=ue2fc3b3a&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=84747&status=done&style=none&taskId=u57d8b79d-da4b-4821-9b1c-a235b6e5a76&title=&width=1241.8181549024982)
## 构建作业
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868235397-958ad9f4-00ae-4f68-b044-3660eb2eab32.png#averageHue=%2371b577&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u0300908c&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=94392&status=done&style=none&taskId=u3948abb8-007c-4049-81af-2e0d455d632&title=&width=1241.8181549024982)
> 构建成功

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868278610-d8dcce39-b7e4-4c2d-a7f8-de7604344c8d.png#averageHue=%2347bf6c&clientId=u508dae7f-83aa-4&from=paste&height=592&id=ub164fb0c&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=88395&status=done&style=none&taskId=uc062feef-c239-4c07-92b9-483de0083a3&title=&width=1241.8181549024982)
## 启动作业
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868373274-f0245bdf-710d-4bed-a54b-c21cb8f035b0.png#averageHue=%2346bf6c&clientId=u508dae7f-83aa-4&from=paste&height=592&id=uf4727344&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=91885&status=done&style=none&taskId=u0c6f976c-57e6-4b68-bcb1-79822b846a9&title=&width=1241.8181549024982)
### 启动检查点设置
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868448163-47dc0641-1324-4c64-9416-0c1a814311e2.png#averageHue=%2349734d&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u604a9133&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=111818&status=done&style=none&taskId=u04ce718e-5023-40f0-b83c-9f8af25f7e9&title=&width=1241.8181549024982)
### 提交作业
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868491340-f0527f77-de9e-46a4-91b9-49240f27ee97.png#averageHue=%2336724b&clientId=u508dae7f-83aa-4&from=paste&height=592&id=uc310bf89&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=89656&status=done&style=none&taskId=u6b6bcc30-4321-4e01-be01-ed6e02e789e&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868503415-f2217be4-aedf-41f3-8908-f07612307b02.png#averageHue=%237aa47b&clientId=u508dae7f-83aa-4&from=paste&height=592&id=ua9e86c08&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=89010&status=done&style=none&taskId=u7462e62f-85d8-4176-9484-74afc1a16d6&title=&width=1241.8181549024982)
## 查看作业状态
### 通过StreamPark看板查看
> StreamPark dashboard

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868607586-7c146074-44b2-4d6e-9bf1-3dfbdcb235e6.png#averageHue=%2340ba5f&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u7a35cf03&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=92334&status=done&style=none&taskId=ud65567a2-f005-42d9-80b9-7bc8159cdfc&title=&width=1241.8181549024982)
> 查看作业详情

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868728902-802a23f7-70a5-4298-9c75-a3ae0b84f5a7.png#averageHue=%235dc577&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u5d707514&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=95996&status=done&style=none&taskId=u127f6155-3953-473b-8009-73192b6801c&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868769882-4bdadf70-860a-4cff-89e5-e86194cceb83.png#averageHue=%23e7d6ac&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u424d5cfb&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=74458&status=done&style=none&taskId=u2d8a4455-809a-49f5-b89b-37af7ef50c7&title=&width=1241.8181549024982)
### 查看原生 flink web ui
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868865112-7020ed0d-4485-4084-a807-ae3b2d073031.png#averageHue=%23e7d7ae&clientId=u508dae7f-83aa-4&from=paste&height=592&id=u8fc06cdc&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=78632&status=done&style=none&taskId=uc2c455a4-7472-42b7-bbd7-cb9d9094831&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701868913249-36e1627c-3623-4484-8510-b3c8ae0286fe.png#averageHue=%23fbf8f8&clientId=u508dae7f-83aa-4&from=paste&height=585&id=u69985905&originHeight=643&originWidth=1365&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=60112&status=done&style=none&taskId=u24a40e04-9a7e-4d0c-878e-4c095f009e6&title=&width=1240.9090640131112)
> 至此，一个使用StreamPark平台提交flink job的流程基本完成。下面简单总结下StreamPark平台管理flink作业的大致流程。

## StreamPark平台管理flink job的流程
![](https://cdn.nlark.com/yuque/0/2023/png/25667299/1689059673517-b7c4c5d0-ba6c-463c-9d00-6b47f2058ded.png#averageHue=%23f7f7f7&from=url&id=HZS3z&originHeight=1277&originWidth=284&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=)
> 通过 StreamPark 平台 停止、修改、删除 flink job 相对简单，大家可自行体验，需要说明的一点是：**若作业为running状态，则不可删除，需先停止**。


# StreamPark系统模块简介
## 系统设置
> 菜单位置

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701869730396-cc5e9115-25ae-4b56-9b6b-adaf7c581f7a.png#averageHue=%237eb974&clientId=ude539673-8688-4&from=paste&height=592&id=u48ab9556&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=95473&status=done&style=none&taskId=ud165fe17-0a07-4f52-9bc4-5095ebb108a&title=&width=1241.8181549024982)
### User Management
> 用于管理StreamPark平台用户

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701869792747-ece691ad-450d-423a-881e-a3cf95d5db85.png#averageHue=%23d3efe0&clientId=ude539673-8688-4&from=paste&height=592&id=ucae23f7d&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=75673&status=done&style=none&taskId=u64837473-a4fb-4f3f-87a8-c09ce186281&title=&width=1241.8181549024982)
### Token Management
> 允许用户以Restful api形式操作flink job

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701869986067-e248e5c8-66af-457b-8a89-091bea8bcb59.png#averageHue=%239fd4df&clientId=ude539673-8688-4&from=paste&height=592&id=ue6e1315f&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=71968&status=done&style=none&taskId=uc8604d1d-3125-4492-8757-991c69a395a&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870074415-787882b8-3c42-43de-8a53-253b0403808e.png#averageHue=%23dfc38b&clientId=ude539673-8688-4&from=paste&height=592&id=u5bf06f02&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=88690&status=done&style=none&taskId=ud6af1fa8-5760-48df-9c38-08da630d455&title=&width=1241.8181549024982)
```bash
curl -X POST '/flink/app/cancel' \
-H 'Authorization: 69qMW7reOXhrAh29LjPWwwP+quFqLf++MbPbsB9/NcTCKGzZE2EU7tBUBU5gqG236VF5pMyVrsE5K7hBWiyuLuJRqmxKdPct4lbGrjZZqkv5lBBYExxYVMIl+f5MZ9dbqqslZifFx3P4A//NYgGwkx5PpizomwkE+oZOqg0+c2apU0UZ9T7Dpnu/tPLk9g5w9q+6ZS2p+rTllPiEgyBnSw==' \
-H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
--data-urlencode 'savePoint=' \
--data-urlencode 'id=100001' \
--data-urlencode 'savePointed=false' \
--data-urlencode 'drain=false' \
-i
```
### Role Management
> 用户角色：目前有2种，develop 和 admin。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870193056-8ddf44b6-1507-4de1-aa67-5e9f97b440a8.png#averageHue=%23cceae7&clientId=ude539673-8688-4&from=paste&height=592&id=u3068ec35&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=79304&status=done&style=none&taskId=ua97f7b1a-9dbd-4cf8-a9a3-9c460caa0b5&title=&width=1241.8181549024982)
### Team Management
> 团队：用于区分管理企业不同团队的作业。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870337524-1bea85da-d3a3-40ef-ae67-c1489a2a311b.png#averageHue=%23cfeae6&clientId=ude539673-8688-4&from=paste&height=592&id=u2ca84c20&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=73012&status=done&style=none&taskId=u36356a22-ee1d-487a-a0c3-47628e44e30&title=&width=1241.8181549024982)
### Member Management
> (团队)成员管理

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870382372-2fcab2b6-eced-441e-b4d7-21bae708e97a.png#averageHue=%23cfebe7&clientId=ude539673-8688-4&from=paste&height=592&id=u611844ce&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=74390&status=done&style=none&taskId=uab782425-9c08-4dab-b27b-e58a6fb4143&title=&width=1241.8181549024982)
### Menu Management
> 管理系统菜单

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870426498-d3833ba2-0a63-4e7c-9392-d2aaaf930158.png#averageHue=%23e6d8af&clientId=ude539673-8688-4&from=paste&height=592&id=ucec01797&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=105805&status=done&style=none&taskId=uc25fa791-d72e-475b-8711-a4aea40c529&title=&width=1241.8181549024982)
## StreamPark菜单模块
### Project
> StreamPark结合代码仓库实现CICD

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870578776-8b7258b2-9166-4a62-b0b8-831c7805571e.png#averageHue=%23e3d7ad&clientId=ude539673-8688-4&from=paste&height=592&id=ue94ea260&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=70041&status=done&style=none&taskId=u55b88864-79ed-4bdf-950a-000c107bf46&title=&width=1241.8181549024982)
> 使用时，点击 “+ Add new ”,配置repo信息，保存。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870655803-78880b40-f949-485d-bce1-025f00410aaf.png#averageHue=%23e7d1ad&clientId=ude539673-8688-4&from=paste&height=592&id=ud0253594&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=74763&status=done&style=none&taskId=u64ecddcc-ddb7-49dd-9bf9-795e95fcd10&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870782290-ede8ca40-ed87-448e-87f5-574b11b1788d.png#averageHue=%23e3d7ac&clientId=ude539673-8688-4&from=paste&height=592&id=u8c1aaaae&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=86426&status=done&style=none&taskId=udc92294d-c367-4f3b-925e-fcb444f5a72&title=&width=1241.8181549024982)
### Application
> **核心模块：用于对 flink job 全生命周期(创建、构建、启动、停止、删除等)管理。**

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701870859388-3579d9bd-f220-4de6-8aad-ae1912b8f100.png#averageHue=%237ab971&clientId=ude539673-8688-4&from=paste&height=592&id=uac6a72b0&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=90632&status=done&style=none&taskId=u004c6f02-0a3f-4c4e-9255-21d400d3096&title=&width=1241.8181549024982)
### Variable
> 变量管理：管理变量，可在Application 作业创建时使用。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871137075-09b52c29-2b95-4214-89c5-a53a0cd54d0a.png#averageHue=%23bcefdd&clientId=ude539673-8688-4&from=paste&height=592&id=u97cc0c42&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=77057&status=done&style=none&taskId=u2e5dd4fc-3feb-4ea6-814c-e374829b481&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871196906-40cd7e09-927c-4aa0-a15f-25eab7b39e32.png#averageHue=%23fefefc&clientId=ude539673-8688-4&from=paste&height=592&id=u15927de8&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=69482&status=done&style=none&taskId=u95933d49-fe6d-49d3-b3b7-98568ce5824&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871206644-5046c6e1-2b54-4c17-9eb0-1d2eeea7958c.png#averageHue=%23fefefc&clientId=ude539673-8688-4&from=paste&height=592&id=uc8f9d581&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=69112&status=done&style=none&taskId=udeb4a720-2b56-4897-aa00-f4ed88233eb&title=&width=1241.8181549024982)
### Setting
#### System Setting
> 用于系统配置：Maven 、 Docker 、 alert email、Ingress

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871355164-830e7c88-a990-4152-8644-8d4adb44b98b.png#averageHue=%23e1bf8a&clientId=ude539673-8688-4&from=paste&height=592&id=ud58f84de&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=72438&status=done&style=none&taskId=u661c4b01-1481-4beb-a0e2-caeeb3071dc&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871367549-04c17727-d231-45d5-9fb7-ffd079ee2aec.png#averageHue=%23dcc192&clientId=ude539673-8688-4&from=paste&height=592&id=u06c57811&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=74431&status=done&style=none&taskId=ufe545324-a19f-46af-a18e-5d73d86cad7&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871379031-8ca2ed19-d072-41aa-b5f5-4c1969cde706.png#averageHue=%23dfc292&clientId=ude539673-8688-4&from=paste&height=592&id=ube3d08df&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=69906&status=done&style=none&taskId=u0e49bfb2-79b7-4594-8f8e-73036e38e38&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871389112-d758e9b2-f737-45b4-9358-a1a4bafed7c5.png#averageHue=%23eef0d9&clientId=ude539673-8688-4&from=paste&height=592&id=u79ba5960&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=68408&status=done&style=none&taskId=ufcea0bed-b6c2-4f52-93f8-cb53d712ab2&title=&width=1241.8181549024982)
#### Alert Setting
> 支持多种告警通知模式

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871432517-21d10052-9d91-4791-afbd-6764bfdd261d.png#averageHue=%23746b4f&clientId=ude539673-8688-4&from=paste&height=552&id=uc9edb12a&originHeight=607&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=73513&status=done&style=none&taskId=u3a53717d-707f-4e18-8530-26707daf4dc&title=&width=1241.8181549024982)
#### Flink Home
> 【**待完善**】可对flink作业进行一些操作，如对flink sql校验等

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871540452-9dc8fa48-5836-41c8-8bfb-aea542d164b7.png#averageHue=%23aadce5&clientId=ude539673-8688-4&from=paste&height=592&id=u28a070fa&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=63714&status=done&style=none&taskId=uca30e646-d21c-41c5-9846-875a84e179f&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871563252-a88e5bbd-2938-4252-9fe0-e84806138211.png#averageHue=%23fefdfc&clientId=ude539673-8688-4&from=paste&height=592&id=u186eb58e&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=76584&status=done&style=none&taskId=uac8784bf-e91e-4b1b-85c0-3c12686303f&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701871572682-05317a4a-b891-4f2b-9aef-37f463a71555.png#averageHue=%23fefdfc&clientId=ude539673-8688-4&from=paste&height=592&id=ua8ebc29f&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=77630&status=done&style=none&taskId=u41737f60-19c9-4d0e-ba3f-ab6c6c6e272&title=&width=1241.8181549024982)
#### Flink Cluster
> - Session模式执行flink作业，根据资源管理方式不同，可以分为3种：Standalone、Yarn、K8s
> - 【**待完善**】应用场景：资源充足，作业之间隔离性需求不是很强的场景
> - 关于session模式，详见：[https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/deployment/overview/#session-mode](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/deployment/overview/#session-mode)


![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701872377346-e1d0a693-b50d-4db1-beed-10b3c36a118f.png#averageHue=%23e7c995&clientId=u8e4d72e5-8ba3-4&from=paste&height=592&id=uf5880e15&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=75042&status=done&style=none&taskId=ufb405fb1-c59f-4933-8fc2-3ec61d84c51&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701872180505-4b7c4e5a-81d1-4c5a-8082-be5387b0e70e.png#averageHue=%23dee7de&clientId=u8e4d72e5-8ba3-4&from=paste&height=592&id=xluSx&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=81708&status=done&style=none&taskId=ub15c164d-e191-41eb-a462-30aaf233a0e&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701872205905-6a769631-388e-4f7b-86ed-4a5ab17954f3.png#averageHue=%23d5b684&clientId=u8e4d72e5-8ba3-4&from=paste&height=669&id=u892a31d8&originHeight=736&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=86821&status=done&style=none&taskId=ub4917eb4-1b9c-44fb-aafb-801a7dd16bd&title=&width=1241.8181549024982)
# 原生flink 与 StreamPark关联使用
> 【**待完善**】其实，个人理解，StreamPark一大特点是对flink原生作业的管理模式在用户使用层面进行了优化，使得用户能快速利用该平台快速开发flink作业。所以，想表达的意思是：如果用户对原生flink比较熟悉的话，那StreamPark使用起来就会更加得心应手。

## flink部署模式
> 下面内容摘自 **张利兵 老师 极客时间专栏** 《[Flink核心技术与实战](https://time.geekbang.org/course/intro/100058801)》

### 原生flink集群部署模式
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701873666440-918aa4c9-5b2d-4cd2-b314-35dcff8c636f.png#averageHue=%23f5f3f1&clientId=u8e4d72e5-8ba3-4&from=paste&height=441&id=u3d1e0538&originHeight=485&originWidth=1077&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=135425&status=done&style=none&taskId=u12f46288-7f38-4cf2-baf2-957a65ae340&title=&width=979.0908878696856)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701873716715-a163c9b4-2cf2-49f9-acba-8518de145451.png#averageHue=%23f7f5f3&clientId=u8e4d72e5-8ba3-4&from=paste&height=465&id=u6fde72d1&originHeight=512&originWidth=1091&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=205456&status=done&style=none&taskId=ue10dc45d-3250-4d51-91e1-27d66b82c1b&title=&width=991.8181603211021)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701873733501-d8d9ef26-bbe5-4cc8-b239-8f14d9d80d5b.png#averageHue=%23f7f5f3&clientId=u8e4d72e5-8ba3-4&from=paste&height=481&id=u2413ff5f&originHeight=529&originWidth=1074&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=207480&status=done&style=none&taskId=u3118e486-fa36-4e5e-a6cd-f26166e5927&title=&width=976.3636152015249)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701873763887-33a2e0c1-87ed-4a66-85e4-2900a4f8d77f.png#averageHue=%23faede6&clientId=u8e4d72e5-8ba3-4&from=paste&height=366&id=u3ac9dd08&originHeight=403&originWidth=765&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=67786&status=done&style=none&taskId=ude338b3c-d2cb-4d94-a1d5-e76dc04d74c&title=&width=695.4545303809745)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701873781568-8b2ad65e-8d8a-43ae-8cfd-bd2456773b49.png#averageHue=%23f8ebe4&clientId=u8e4d72e5-8ba3-4&from=paste&height=363&id=uf6d9dec1&originHeight=399&originWidth=764&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=81369&status=done&style=none&taskId=uebbe9052-8919-4890-8af8-90b908459b8&title=&width=694.5454394915876)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701873800969-1f40ce6c-59a6-4905-9fa6-97dbba8dcfad.png#averageHue=%23f8f4f1&clientId=u8e4d72e5-8ba3-4&from=paste&height=362&id=ueac8c2bb&originHeight=398&originWidth=759&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=137385&status=done&style=none&taskId=ud50f6a68-d98d-45c1-a074-790c8b0b4c5&title=&width=689.999985044653)
### 如何在StreamPark中使用
> **Session 模式**

1. 配置 Flink Cluster

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701874428460-dfa11de5-3ba8-405b-a6e7-5057c6809b5f.png#averageHue=%23dee7de&clientId=u8e4d72e5-8ba3-4&from=paste&height=592&id=u13e0a607&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=83793&status=done&style=none&taskId=u7e16836c-c8cd-46de-83d7-70babbcad9d&title=&width=1241.8181549024982)

2. 创建作业时在 Execution Mode选择对应资源管理器的mode 和  已经建立好的Flink Cluster

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701874308819-d0fd4a90-00e9-4387-82ce-7ddb923f1791.png#averageHue=%23fdfcfa&clientId=u8e4d72e5-8ba3-4&from=paste&height=592&id=u97c0df2a&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=83664&status=done&style=none&taskId=u317c1b7f-f078-4515-90a1-6578a0be2ba&title=&width=1241.8181549024982)
> **Application 模式**

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701875116219-20490ebf-055f-4a06-8f9d-4336e1fcf2d0.png#averageHue=%23fefdfb&clientId=ue3e662d7-c466-4&from=paste&height=592&id=u8ae7eb13&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=78361&status=done&style=none&taskId=u75d4b355-4112-46bd-8090-664adf3de1b&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701875231409-73c2c652-62bb-4836-88f0-4ed075084e0d.png#averageHue=%23dec891&clientId=ue3e662d7-c466-4&from=paste&height=434&id=u8084b00f&originHeight=477&originWidth=1358&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=76677&status=done&style=none&taskId=u069929cb-1f8c-4be4-ad7f-c17c42bb58b&title=&width=1234.545427787403)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701875255403-0bc53e76-3c67-4322-978f-9fa74d161d47.png#averageHue=%23ee7b61&clientId=ue3e662d7-c466-4&from=paste&height=579&id=u54a9eb9d&originHeight=637&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=58665&status=done&style=none&taskId=ub7ca7f6c-3369-4fb4-aa47-911d1de6255&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701875320467-fef60e13-e01b-4192-9633-cb95d3bab178.png#averageHue=%23fdfaf4&clientId=ue3e662d7-c466-4&from=paste&height=592&id=ub1ace1d4&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=125235&status=done&style=none&taskId=u866eeee5-d1f8-469c-8b65-ee940e1e0a7&title=&width=1241.8181549024982)
## 设置作业参数
### 原生flink作业参数
> 官网：[https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/deployment/config/](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/deployment/config/)

> 原生提交命令(含参数)

```bash
flink run-application -t yarn-application \
	-Dyarn.provided.lib.dirs="hdfs://myhdfs/my-remote-flink-dist-dir" \
	hdfs://myhdfs/jars/my-application.jar
```
### 如何在StreamPark中使用
> 创建 或 修改 作业时，在“Dynamic Properties”里面按指定格式添加即可

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701876089258-10e5de58-7c72-4ea6-9f20-4bc77d480eec.png#averageHue=%23fefdfa&clientId=ue3e662d7-c466-4&from=paste&height=592&id=u7ff16829&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=68487&status=done&style=none&taskId=u91c23c08-37e3-48ba-8c20-096e900af3c&title=&width=1241.8181549024982)
## 告警策略
> 【**待完善**】

### 原生flink重启机制
> 参考：[https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/ops/state/task_failure_recovery/](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/ops/state/task_failure_recovery/)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701876432388-76971547-12d6-44fd-844e-8b440fd057a0.png#averageHue=%23f6f6f6&clientId=ue3e662d7-c466-4&from=paste&height=301&id=uc0779606&originHeight=331&originWidth=775&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=33953&status=done&style=none&taskId=u25f66b7b-48df-48e0-b714-f266b7c189e&title=&width=704.5454392748434)
### 如何在StreamPark中使用
> 【**待完善**】一般在作业失败或出现异常时，会触发告警

1. 配置告警通知

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701876529225-14488218-e051-493c-9d73-da1db30db647.png#averageHue=%23818377&clientId=ue3e662d7-c466-4&from=paste&height=592&id=ub698dbfa&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=83561&status=done&style=none&taskId=u9178cc13-1ae9-4309-9cdf-60309b45b87&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701876566596-7f44514e-8e86-4ada-819e-958fcd93df9f.png#averageHue=%231c4155&clientId=ue3e662d7-c466-4&from=paste&height=592&id=u296c7631&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=67099&status=done&style=none&taskId=u52cff079-b66d-4203-a9a3-96351a2aa26&title=&width=1241.8181549024982)

2. 创建 或 修改 作业时，在"Fault Alert Template"、“CheckPoint Failure Options”里面配置即可

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701876673669-9dfb9763-aa4a-4f7a-bab5-d64eaa64ca09.png#averageHue=%23fcf8f7&clientId=ue3e662d7-c466-4&from=paste&height=592&id=ub140e92a&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=97946&status=done&style=none&taskId=u75d45170-c99f-4ac9-bbaa-93737963fcc&title=&width=1241.8181549024982)
## cp/sp
> 【**待完善**】

### 原生flink checkpoint 和 savepoint
> cp:  [https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/fault-tolerance/checkpointing/](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/fault-tolerance/checkpointing/)
> sp: [https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/ops/state/savepoints/](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/ops/state/savepoints/)


![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701876975740-35c5222f-0c93-4b93-9b13-9c515594736d.png#averageHue=%23f8f8f9&clientId=ue3e662d7-c466-4&from=paste&height=92&id=ub6300b85&originHeight=101&originWidth=805&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=6058&status=done&style=none&taskId=u56e4c436-3f9a-45bc-8684-38e358547d5&title=&width=731.8181659564502)
### 如何在StreamPark中配置savepoint
> 当停止作业时，可以让用户设置savepoint

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701877142502-e6a7547b-37ec-4165-819d-be351ff33776.png#averageHue=%235f704b&clientId=ue3e662d7-c466-4&from=paste&height=592&id=udbb52439&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=107963&status=done&style=none&taskId=ua898afc2-d20a-49a5-aede-63a055faff7&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701877197445-fa42404d-5ca7-411b-8636-1431d854f57e.png#averageHue=%2361714d&clientId=ue3e662d7-c466-4&from=paste&height=592&id=u46e38c5a&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=110078&status=done&style=none&taskId=ue92bad7b-d292-4ebe-8945-1f4f3b9f389&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701877259734-40be92e5-11a0-4dec-851e-de61f36e6bd3.png#averageHue=%231b0d0a&clientId=ue3e662d7-c466-4&from=paste&height=88&id=uc9fead3f&originHeight=97&originWidth=1240&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=18758&status=done&style=none&taskId=u3582970a-6a83-46ce-8a23-bb81f79105f&title=&width=1127.2727028397494)
> 查看savepoint

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701877333017-85f8526c-ac49-49d1-88cc-ff7bed8d7215.png#averageHue=%230b0907&clientId=ue3e662d7-c466-4&from=paste&height=86&id=u38289182&originHeight=95&originWidth=1222&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=14106&status=done&style=none&taskId=ud361fb51-8b87-4248-ad92-df90178f0e6&title=&width=1110.9090668307854)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701877358466-4449b0bb-63c4-46ee-860f-7a499b7c6b7f.png#averageHue=%23fbfbfa&clientId=ue3e662d7-c466-4&from=paste&height=425&id=uae84cc25&originHeight=468&originWidth=1338&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=46683&status=done&style=none&taskId=u7675ff13-dc05-4eb7-ade2-2252a27c429&title=&width=1216.3636099996652)
### 如何在StreamPark中由指定savepoint恢复作业
> 启动作业时，会让选择

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701877487136-f1fa37c0-01b0-4367-884c-01c6660c41fc.png#averageHue=%236f7856&clientId=ue3e662d7-c466-4&from=paste&height=592&id=u24094096&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=105680&status=done&style=none&taskId=u8119aa25-2c0a-43a4-9ea8-dbf7ebb01c3&title=&width=1241.8181549024982)
## 作业状态
> 【**待完善**】

### 原生flink 作业状态
> 参考：[https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/internals/job_scheduling/#jobmanager-%e6%95%b0%e6%8d%ae%e7%bb%93%e6%9e%84](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/internals/job_scheduling/#jobmanager-%e6%95%b0%e6%8d%ae%e7%bb%93%e6%9e%84)

![](https://cdn.nlark.com/yuque/0/2023/svg/25667299/1701878186642-769081d2-ba63-4537-910b-a4a5ccc4d063.svg#clientId=ufa1f3925-b25b-4&from=paste&id=ufe6ee564&originHeight=831&originWidth=907&originalType=url&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&taskId=u0f1b1702-36be-4a1b-a0b4-e6bbe181119&title=)
### StreamPark中的作业状态
> 【**待完善**】


## 作业详情
### 原生flink作业详情
> 通过 “[Apache Flink Dashboard](http://hadoop:8088/proxy/application_1701871016253_0004/#/)”查看

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701878504924-93a7ca25-899a-4131-a733-7460fb95cbe0.png#averageHue=%23fbfbfa&clientId=ufa1f3925-b25b-4&from=paste&height=592&id=u14757198&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=62321&status=done&style=none&taskId=ue26645aa-3b17-48b2-8910-443c37d5cb5&title=&width=1241.8181549024982)
### StreamPark中作业详情
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701878650894-f350856c-dc12-4b2b-ab05-05da64ac4039.png#averageHue=%23e0c58a&clientId=ufa1f3925-b25b-4&from=paste&height=592&id=u09104a43&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=97145&status=done&style=none&taskId=u8a1c250d-e510-49b3-935c-749eed1b2af&title=&width=1241.8181549024982)
> 同时在k8s模式下的作业，StreamPark还支持启动日志实时展示，如下

![](https://cdn.nlark.com/yuque/0/2023/png/25667299/1688702730199-a4df5585-778e-4d54-8436-43adc1757d26.png#averageHue=%23fafbf9&from=url&id=wH2uH&originHeight=866&originWidth=1920&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&status=done&style=none&title=)
## 如何与第三方系统集成
### 原生flink如何与第三方系统集成
> 原生flink提供了 rest api
> 参考：[https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/ops/rest_api/](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/ops/rest_api/)

### StreamPark如何与第三方系统集成
> 也提供了Restful Api，支持与其他系统对接，
> 比如：开启作业 启动|停止 restapi 接口

![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701879294725-d725ee5d-5c36-4dc8-9a47-f08295dd858b.png#averageHue=%23e5d4a6&clientId=ufa1f3925-b25b-4&from=paste&height=592&id=uc829a64b&originHeight=651&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=80186&status=done&style=none&taskId=u1bcd5cd0-27f6-46a3-9b41-bd35b8bafc9&title=&width=1241.8181549024982)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/25667299/1701879311145-5555735e-a4fc-48a8-aab1-9ebc6e23faf4.png#averageHue=%23ceb990&clientId=ufa1f3925-b25b-4&from=paste&height=631&id=u4d3c6b7c&originHeight=694&originWidth=1366&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=88808&status=done&style=none&taskId=udacca9ce-37fd-4fa3-bf9d-770ef0a9dd1&title=&width=1241.8181549024982)
