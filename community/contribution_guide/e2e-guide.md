# E2E Test Contribution Guide

The main purpose of E2E test is to verify the integration and data integrity of the system, and its components, by simulating real user scenarios. This makes it possible to extend the scope of testing and ensure the health and stability of the system. To a certain extent, the test workload and costs are reduced. In simple terms, E2E testing is about treating a program as a black box and simulating the access behaviour of a real system from the user's point of view to see if the input to the test (user behaviour/simulated data) gives the expected results. Therefore, the community decided to add E2E automated testing to StreamPark.

The current community E2E test has not yet reached full coverage, so this document has been written with the aim of guiding more partners to get involved.

### How to find the corresponding ISSUE?

The E2E test pages are currently divided into four pages: Project Management, Resource Center, DataSource, and Security Center.

Contributors can find the task by going to GitHub, searching for [apache/incubator-streampark](https://github.com/apache/incubator-streampark), and then searching for `e2e` in the [issue list](https://github.com/apache/incubator-streampark/issues?q=is%3Aissue+is%3Aopen+e2e). As shown below.

For more information on e2e development, please refer to the [E2E](https://github.com/apache/incubator-streampark/blob/dev/streampark-e2e/README.md).
