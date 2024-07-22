# SPIP

StreamPark Improvement Proposal(SPIP) introduce major improvements to the Apache StreamPark codebase. It is
not for small incremental improvements, and the purpose of SPIP is to notice and inform community the finished or coming
big feature for Apache StreamPark.

## What is considered as SPIP

- Any major new feature, major improvement, introduce or remove components
- Any major change of public interfaces, such as API endpoints, web ui huge change

When the change in doubt and any committer thinks it should be SPIP, it does.

We use GitHub Issue and Apache mail thread to record and hold SPIP, for more detail you could go to section
[current SPIPs](#current-SPIPs) and [past SPIPs](#past-SPIPs).

As a SPIP, it should:

- Have a mail thread title started with `[DISCUSS]` in [dev@streampark.apache.org][mail-to-dev]
- Have a GitHub Issue labeled with `SPIP`, and including the mail thread link in the description.

### Current SPIPs

Current SPIPs including all SPIP still work-in-progress, you could see in [current SPIPs][current-SPIPs]

### Past SPIPs

Past SPIPs including all SPIP already done or retired for some reason, you could see in [past SPIPs][past-SPIPs]

## SPIP Process

### Create GitHub Issue

All SPIP should start with GitHub Issue

- If you pretty sure your issue is SPIP, you could click and choose "SPIP" in
  [GitHub Issue][github-issue-choose]
- If you not sure about your issue is SPIP or not, you could click and choose "Feature request" in
  [GitHub Issue][github-issue-choose]. StreamPark maintainer team would add label `SPIP`, mention you in the
  issue and lead you to this document when they think it should be SPIP.

You should add special prefix `[SPIP-XXX]`, `XXX` stand for the id SPIP. It's auto increment, and you could find the next
integer in [All SPIPs][all-SPIPs] issues.

### Send Discuss Mail

After issue labeled with "SPIP", you should send an email to [dev@streampark.apache.org][mail-to-dev].
Describe the purpose, and the draft design about your idea.

Here is the template for mail

- Title: `[DISCUSS][SPIP-XXX] <CHANGE-TO-YOUR-LOVELY-PROPOSAL-TITLE>`, change `XXX` to special integer you just change in
  [GitHub Issue](#create-github-issue), and also change proposal title.
- Content:

  ```text
  Hi community,

  <CHANGE-TO-YOUR-PROPOSAL-DETAIL>

  I already add a GitHub Issue for my proposal, which you could see in <CHANGE-TO-YOUR-GITHUB-ISSUE-LINK>.

  Looking forward any feedback for this thread.
  ```

After community discuss and all of them think it worth as SPIP, you could [work on it](#work-on-it-or-create-subtask-for-it).
But if community think it should not be SPIP or even this change should not be included to StreamPark, maintainers
terminate mail thread and remove label "SPIP" for GitHub Issue, or even close issue if it should not change.

### Work On It, Or Create Subtask For It

When your proposal pass in the mail thread, you could make your hand dirty and start the work. You could submit related
pull requests in GitHub if change should in one single commit. What's more, if proposal is too huge in single commit, you
could create subtasks in GitHub Issue like [SPIP-1][SPIP-1], and separate into multiple commit.

### Close After It Done

When SPIP is finished and all related PR were merged, you should reply the mail thread you created in
[step two](#send-discuss-mail) to notice community the result of the SPIP. After that, this SPIP GitHub Issue would be
closed and transfer from [current SPIPs][current-SPIPs] to [past SPIPs][past-SPIPs], but you could still find it in [All SPIPs][all-SPIPs]

## An Example For SPIP

* [[SPIP-1][Feature][Parent] Suggest add HA for StreamPark][SPIP-1]: Have multiple subtasks and Projects on it.

[all-SPIPs]: https://github.com/apache/incubator-streampark/issues?q=is%3Aissue+label%3A%22SPIP%22+
[current-SPIPs]: https://github.com/apache/incubator-streampark/issues?q=is%3Aissue+is%3Aopen+label%3A%22SPIP%22
[past-SPIPs]: https://github.com/apache/incubator-streampark/issues?q=is%3Aissue+is%3Aclosed+label%3A%22SPIP%22+
[github-issue-choose]: https://github.com/apache/incubator-streampark/issues/new/choose
[mail-to-dev]: mailto:dev@streampark.apache.org
[SPIP-1]: https://github.com/apache/incubator-streampark/issues/3905

