# License Notice

As we know that StreamPark is an open-source undergoing project at The Apache Software Foundation (ASF), which means that you have to follow the Apache way to become the StreamPark contributor. Furthermore, Apache has extremely strict rules according to the License. This passage will explain the ASF license and how to avoid License risks at the early stage when you participate in StreamPark.

Note: This article only applies to the Apache projects.

### Licenses Could be Accepted to the Apache Project

You have to pay attention to the following open-source software protocols which Apache projects support when you intend to add a new feature to the StreamPark (or other Apache projects), which functions refers to other open-source software references.

[ASF 3RD PARTY LICENSE POLICY](https://apache.org/legal/resolved.html)

If the 3rd party software is not present at the above policy, we are sorry that your code can not pass the audit and we suggest searching for other substitute plans.

Besides,  when you demand new dependencies in the project, please email us about the reason and the outcome of the influence to dev@StreamPark.apache.org to discuss. Besides, you need at least 3 positive votes from the PPMC to finish the whole step.

### How to Legally Use 3rd Party Open-source Software in the StreamPark

Moreover, when we intend to refer a new software ( not limited to 3rd party jar, text, CSS, js, pics, icons, audios etc and modifications based on 3rd party files) to our project, we need to use them legally in addition to the permission of ASF. Refer to the following article:

* [COMMUNITY-LED DEVELOPMENT "THE APACHE WAY"](https://apache.org/dev/licensing-howto.html)

For example, we should contain the NOTICE file (every open-source project has NOTICE file, generally under root directory) of ZooKeeper in our project when we are using ZooKeeper. As the Apache explains, "Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work.

We are not going to dive into every 3rd party open-source license policy, you may look up them if interested.

### StreamPark-License Check Rules

In general, we would have our License-check scripts to our project. StreamPark-License is differ a bit from other open-source projects. All in all, we are trying to make sure avoiding the license issues at the first time.

We need to follow the following steps when we need to add new jars or external resources:

* Add the name and the version of the jar file in the `tools/dependencies/known-dependencies.txt`

### References

* [COMMUNITY-LED DEVELOPMENT "THE APACHE WAY"](https://apache.org/dev/licensing-howto.html)
* [ASF 3RD PARTY LICENSE POLICY](https://apache.org/legal/resolved.html)

