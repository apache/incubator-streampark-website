---
id: 'submit_code'
title: 'Submit Code'
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

1. First, fork the upstream repository https://github.com/apache/incubator-streampark.git into your own repository.

2. Clone your repository to your local:

    ```shell
    git clone https://github.com/<your-github-id>/incubator-streampark.git
    ```

3. Add remote repository address, name it upstream:

    ```shell
    git remote add upstream https://github.com/apache/incubator-streampark.git
    ```

4. View repository:

    ```shell
    git remote -v
    ```

> At this time, there will be two repositories: `origin` (your own repository) and `upstream` (remote repository).

5. Get/Update remote repository code:

    ```shell
    git fetch upstream
    ```

6. Synchronize remote repository code to local repository:

    ```shell
    git checkout origin/dev
    git merge --no-ff upstream/dev
    ```

7. If remote branch has a new branch such as `dev-1.0`, you need to synchronize this branch to the local repository:

    ```shell
    git checkout -b dev-1.0 upstream/dev-1.0
    git push --set-upstream origin dev-1.0
    ```

8. After modifying the code locally, submit it to your own repository:

    ```shell
    git commit -m 'commit content'
    git push
    ```

9. Submit changes to the remote repository

10. On the github page, click "New pull request".

11. Select the modified local branch and the branch you want to merge with the past, click "Create pull request".

12. Then the community Committers will do CodeReview, and then he will discuss some details (including design, implementation, performance, etc.) with you. When everyone on the team is satisfied with this modification, the commit will be merged into the dev branch

13. Congratulations! You have become a contributor to Apache StreamPark!
