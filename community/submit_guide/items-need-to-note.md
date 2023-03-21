---
id: 'items-need-to-note.md'
title: 'Items need to note'
sidebar_position: 3
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

There are some rules need to note for reviewers and contributors when developing or reviewing PRs.  

### About Exception Processing for `streampark-console-service` Module

This `streampark-console-service` module is the core module for processing user requests.It's very necessary to strive to provide the best user experience.   
So, we introduced the [AbstractApiException](https://github.com/apache/incubator-streampark/blob/dev/streampark-console/streampark-console-service/src/main/java/org/apache/streampark/console/base/exception/AbstractApiException.java)
and its subclasses to get more friendly interaction effect. Non-`AbstractApiException` is treated as internal server errors correspondingly, which needn't notify the interaction details to users.   
Based on the above premise, we need to pay attention to the handling of `AbstractApiException`.    
For example, we should throw an exception by one of followed subclasses of `AbstractApiException` when processing logic with the user operation errors or missing data errors:  
 
- [ApiDetailException](https://github.com/apache/incubator-streampark/blob/dev/streampark-console/streampark-console-service/src/main/java/org/apache/streampark/console/base/exception/ApiDetailException.java)
> An exception message that needs to be notified to front-end, is a detailed exception message, such as the stackTrace info, often accompanied by a large number of exception logs, e.g: Failed to start job, need to display the exception(stackTrace info) to front-end.
- [ApiAlertException](https://github.com/apache/incubator-streampark/blob/dev/streampark-console/streampark-console-service/src/main/java/org/apache/streampark/console/base/exception/ApiAlertException.java)
> An exception message that needs to be notified to front-end, usually a simple, clear message, e.g:
> 1. Username already exists
> 2. No permission, please contact the administrator  
> 3. ...

- [AlertException](https://github.com/apache/incubator-streampark/blob/dev/streampark-console/streampark-console-service/src/main/java/org/apache/streampark/console/base/exception/AlertException.java)
> An exception message that needs to be notified to front-end when processing alert logic.
- Or others exceptions used to get fine users interaction.

In addition to handling the classification of exceptions, we'd better make the precise and concise exception message and try to ensure the follows in the exception:

- Display the current status of the abnormal case.
- Display the solutions to the abnormal case.
- Or others informations fit the pretty interaction.

Please click [Issue-2325](https://github.com/apache/incubator-streampark/issues/2325) for more details about the items if needed.