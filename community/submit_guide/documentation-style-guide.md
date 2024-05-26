---
id: 'documentation_style_guide'
title: 'Documentation Style Guide'
sidebar_position: 4
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


## 1 The English edition specification

### 1.1 Manual Line Break
When you're writing documents, please break lines intentionally around the approximate
character limit (120 chars), which makes it easier for review and developers to read.

### 1.2 [3-C rules](https://developer.mozilla.org/zh-CN/docs/MDN/Writing_guidelines/Writing_style_guide#%E8%80%83%E8%99%91%E5%86%99%E4%BD%9C%E7%9A%84%E2%80%9C3c%E2%80%9D%E5%87%86%E5%88%99)
- Clarity:

Ensure that your writing is clear and simple. Generally speaking,
use active voice and unambiguous pronouns.
Write short sentences, insisting on one viewpoint per sentence.
Before using new terminology, it is necessary to define it and maintain the target audience.

- Simplicity:

Knowing how much to say is important when writing any document. If you provide too much detail,
the page will become dull and difficult to read, and it will be rarely used.

- Consistency:

Ensure that you consistently use the same wording throughout the entire page and across
multiple pages.

### 1.3 Reduce Markers
Reduce the number of markers (such as code blocks, bold text) unless absolutely
necessary, as the rendered version becomes very difficult to read.

### 1.4 Correct Item Reference
- Positive：
  > Apache HBase, ClickHouse.
- Negative：
  > Apache Hbase, Clickhouse.
### 1.5 Integrity and Availability
- English documentation should have corresponding Chinese documentation pages.
- Internal links referenced in the English documentation should be functional,
  and corresponding pages in other languages should be accessible.
- External links referenced in the English documentation should be functional.
- If there are incomplete resources, it's preferable to declare the supplementary
  time or plan for missing resources, and add a simple explanation if necessary.

### 1.6 Using inclusive expression

Click [here](https://developer.mozilla.org/zh-CN/docs/MDN/Writing_guidelines/Writing_style_guide#%E4%BD%BF%E7%94%A8%E5%8C%85%E5%AE%B9%E6%80%A7%E8%AF%AD%E8%A8%80)
for more details.

### 1.7 Space
- Between English words and numbers
- Between English words and units
- Between English words and links
### 1.8 Punctuation Marks
- Use half-width English punctuation marks when using the English input method.
### 1.9 Capitalization of The First Letter
The first letter of the first word in a sentence should be capitalized unless there are special circumstances.
- Positive：
  > 'nameMap'(Assuming the attribute name is 'nameMap') is an attribute of class `Demo`.
  >
  > Jige is a pretty basketball player.
- Negative：
  > 'NameMap' is an attribute of class `Demo`.
  >
  > Jige is a pretty basketball player.

### For better

If you are interested in ensuring the standardized writing quality of the document, 
please let's reference this 
[link](https://developer.mozilla.org/zh-CN/docs/MDN/Writing_guidelines/Writing_style_guide) 
to do better. 


## References

- https://github.com/sparanoid/chinese-copywriting-guidelines/blob/master/README.zh-Hans.md
- https://github.com/apache/incubator-streampark-website/pull/347
- https://github.com/apache/incubator-streampark-website/pull/349
- https://cwiki.apache.org/confluence/display/FLINK/Flink+Translation+Specifications
- https://lists.apache.org/thread/0p40kdbkoqdto2zlvwbw3r9xo3hfnm4g
- [Guidelines for Using Capital Letters - ThoughtCo.](https://www.thoughtco.com/guidelines-for-using-capital-letters-1691724)
- [Letter case - Wikipedia](https://en.wikipedia.org/wiki/Letter_case)
- [Punctuation - Oxford Dictionaries](https://en.oxforddictionaries.com/grammar/punctuation)
- [Punctuation - The Purdue OWL](https://owl.english.purdue.edu/owl/section/1/6/)
- [How to Use English Punctuation Correctly - wikiHow](https://www.wikihow.com/Use-English-Punctuation-Correctly)
- [Format - openSUSE](https://zh.opensuse.org/index.php?title=Help:%E6%A0%BC%E5%BC%8F)
- [Full Form and Half Form - Wikipedia](https://zh.wikipedia.org/wiki/%E5%85%A8%E5%BD%A2%E5%92%8C%E5%8D%8A%E5%BD%A2)
- [Document Writing Specification](https://developer.mozilla.org/zh-CN/docs/MDN/Writing_guidelines/Writing_style_guide)


