---
id: 'submit_code'
title: '提交代码'
sidebar_position: 2
---

<!--
    Licensed to the Apache Software Foundation (ASF) under one or more
    contributor license agreements.  See the NOTICE file distributed with
    this work for additional information regarding copyright ownership.
    The ASF licenses this file to You under the Apache License, Version 2.0
    (the "License"); you may not use this file except in compliance with
    the License.  You may obtain a copy of the License at

       https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
-->

1. 首先从远程仓库 https://github.com/apache/incubator-streampark.git 将代码的一份副本 fork 到你自己的仓库。

2. 将你的仓库 Clone 到本地设备：

    ```shell
    git clone https://github.com/<your-github-id>/incubator-streampark.git
    ```

3. 添加远程仓库地址：

    ```shell
    git remote add upstream https://github.com/apache/incubator-streampark.git
    ```

4. 查看仓库：

    ```shell
    git remote -v
    ```

> 此时会有两个仓库：`origin`（你自己的仓库）和 `upstream`（远程仓库）。

5. 获取/更新远程仓库代码：

    ```shell
    git fetch upstream
    ```

4. 将远程仓库代码同步到本地仓库：

    ```shell
    git checkout origin/dev
    git merge --no-ff upstream/dev
    ```

5. 如果远程分支有新的分支，如 `dev-1.0`，你需要将这个分支同步到本地仓库：

    ```shell
    git checkout -b dev-1.0 upstream/dev-1.0
    git push --set-upstream origin dev-1.0
    ```

6. 在本地修改代码后，提交到自己的仓库：

    ```shell
    git commit -m '提交内容'
    git push
    ```

7. 将更改提交到远程仓库

8. 在 GitHub 页面，点击 “New pull request” 按钮。

9. 选择修改过的本地分支和过去要合并的分支，点击 “Create pull request” 按钮。

10. 随后，Committers 将进行 CodeReview 并与你讨论一些细节（包括设计、实现、性能等）。当团队的每个成员都对此修改感到满意时，提交将被合并到 dev 分支。

11. 恭喜你！你已经成为 Apache StreamPark 的贡献者！
