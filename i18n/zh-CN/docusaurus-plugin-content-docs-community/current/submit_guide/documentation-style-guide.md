---
id: 'documentation_style_guide'
title: '文档书写规范'
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


## 1 英文文档规范

### 1.1 必要的换行符
当你在编写文档时，请在近似行长度的位置（120个字符）处主动使用换行符，以便开发人员阅读和审查。

### 1.2 [3-C 原则](https://developer.mozilla.org/zh-CN/docs/MDN/Writing_guidelines/Writing_style_guide#%E8%80%83%E8%99%91%E5%86%99%E4%BD%9C%E7%9A%84%E2%80%9C3c%E2%80%9D%E5%87%86%E5%88%99)
- 清晰  
  确保语句表达清晰简洁。一般来说，使用主动语态和毫不含糊的代词。
  写短句，坚持每句话一个观点。
  在使用新术语之前，有必要对其进行定义并维护目标受众。

- 简单  
  在编写文档时，明确主要表达的内容是很重要的。如果你提供了太多细节， 这一页会变得枯燥难懂，而且很少被使用。

- 一致性
  确保在当前页面和跨页面的时候使用一致性的表述。

### 1.3 减少标记标识
减少标记的数量（如代码块、粗体文本），除非是绝对必要的，因为过多的标记标识会使渲染的文档变得非常难以阅读。

### 1.4 正确的引用
- 正例：
  > Apache HBase, ClickHouse.
- 反例：
  > Apache Hbase, Clickhouse.
### 1.5 完整性和可用性
- 英文文档应具有相应的中文文档页面。
- 英文文档中引用的内部链接应确保目标页面存在，并且其他语言的相应页面应该是可访问的。
- 英文文档中引用的外部链接应确保目标页面存在。
- 如果有不完整的资源，最好声明补充时间和计划，并在必要时添加简单的解释。

### 1.6 包容性地表达

点击 [这里](https://developer.mozilla.org/zh-CN/docs/MDN/Writing_guidelines/Writing_style_guide#%E4%BD%BF%E7%94%A8%E5%8C%85%E5%AE%B9%E6%80%A7%E8%AF%AD%E8%A8%80) 获取更多的细节。

### 1.7 空格

如下情况需要保证空格分隔。

- 单词和数字之间
- 单词和单位之间
- 数字和单位之间
- 单词和连接之间

### 1.8 标点符号

- 使用英文输入法时，请使用半角英文标点符号。

### 1.9 句首字母大写

除非是特殊情况，否则句子中第一个单词的第一个字母应该大写。

- 正例：
  > 'nameMap'(Assuming the attribute name is 'nameMap') is an attribute of class `Demo`.
  >
  > Jige is a pretty basketball player.
- 反例：
  > 'NameMap' is an attribute of class `Demo`.
  >
  > Jige is a pretty basketball player.

### 更严谨的规范

如果你有兴趣确保更高质量的文档的标准化写作，请让参考 [这里](https://developer.mozilla.org/zh-CN/docs/MDN/Writing_guidelines/Writing_style_guide)。

## 2 中文文档规范
### 2.1 空格
#### 2.1.1 中英文之间

正例：

> Apache Flink® 是 Apache StreamPark 支持的计算引擎之一。

反例：

> Apache Flink® 是 Apache StreamPark支持的计算引擎之一。
>
> Apache Flink是 Apache StreamPark 支持的计算引擎之一。

特别地：对于产品术语，请以官方定义的方式书写。

#### 2.1.2 文字和数字之间

正例：

> 某个公司的 Apache StreamPark 平台运行了 5000 个 Apache Flink® 作业。

反例：

> 某个公司的 Apache StreamPark 平台运行了5000 个 Apache Flink® 作业。
>
> 某个公司的 Apache StreamPark 平台运行了 5000个 Apache Flink® 作业。

#### 2.1.3 数字和单位之间

正例：

> 某公司的 Apache StreamPark 平台可用内存资源接近 100 PB。

反例：

> 某公司的 Apache StreamPark 平台可用内存资源接近 100PB。

特别地，无需在度数、百分比和数字之间添加空格：

正例：

> 角度为 90° 的角，就是直角。
>
> Apache StreamPark 可以给 Apache Flink® 作业管理带来约 15% 的效率提升。

反例：

> 角度为 90 ° 的角，就是直角。
>
> Apache StreamPark 可以给 Apache Flink® 作业管理带来约 15 % 的效率提升。

#### 2.1.4 全角标点符号和其他字符之间不需要空格

正例：

> 公司的计算平台刚刚升级成了 Apache StreamPark，好开心！

反例：

> 公司的计算平台刚刚升级成了 Apache StreamPark ，好开心！
>
> 公司的计算平台刚刚升级成了 Apache StreamPark， 好开心！

#### 2.1.5 文字与超链接之间

使用方式：

> 请 [提交一个 issue](http://localhost) 反馈到 Apache StreamPark 社区。
>
> 访问 Apache StreamPark 的最新动态，请 [点击这里](http://localhost) 进行订阅！

对比用法：

> 请[提交一个 issue](http://localhost)反馈到 Apache StreamPark 社区。
>
> 访问 Apache StreamPark 的最新动态，请[点击这里](http://localhost)进行订阅！


### 2.2 标点符号

#### 2.2.1 Do not repeat punctuation marks


正例：

> 哇！Apache StreamPark！

反例：

> 哇！Apache StreamPark！！！


[Full angle and half angle](https://zh.wikipedia.org/wiki/%E5%85%A8%E5%BD%A2%E5%92%8C%E5%8D%8A%E5%BD%A2)

#### 2.2.2 使用全角中文标点符号

正例：

> Apache StreamPark 是一个不错的大数据计算平台的选型。

反例：

> Apache StreamPark 是一个不错的大数据计算平台的选型.

特别是当中文句子包含英文书籍或报纸标题时，不应使用中文书名号，而应以斜体字标明。

#### 2.2.3 使用半角数字

正例：

> 某公司的 Apache StreamPark 平台稳定运行了 1000 个 Application。

反例：

> 某公司的 Apache StreamPark 平台稳定运行了 １０００ 个 Application。


#### 2.2.4 半角标点符号的特殊用法

特别地，当遇到完整的英语句子和特殊名词时，在内容中使用半角标点符号。

正例：

> 乔布斯那句话是怎么说的？“Stay hungry, stay foolish.”
>
> 推荐你阅读 *Hackers & Painters: Big Ideas from the Computer Age*，非常地有趣。

反例：

> 乔布斯那句话是怎么说的？“Stay hungry，stay foolish。”
>
> 推荐你阅读《Hackers＆Painters：Big Ideas from the Computer Age》，非常的有趣。

### 2.2.5 引号

建议使用如下示例的引用方式：

> 鸡哥说：“老师，‘鸡你太美’的‘坤’是谁？”


### 2.3 名词

#### 2.3.1 正确的大小写

专有名词应正确使用大小写。

正例：

> 使用 GitHub 克隆 Apache StreamPark 代码仓库。
>
> Apache StreamPark 支持的生态有 Apache Flink、Spark、Flink-CDC、Paimon、Hudi, Inc.。

反例：

> 使用 gitHub 克隆 Apache StreamPark 代码仓库。
>
> 使用 Github 克隆 Apache StreamPark 代码仓库。
>
> Apache StreamPark 支持的生态有 Apache flink、Spark、Flink-CDC、Paimon、Hudi, Inc.。
>
> Apache StreamPark 支持的生态有 apache Flink、spark、flink-cdc、Paimon、Hudi, Inc.。


#### 2.3.2 不恰当的缩写

不要使用非常规的缩写。

正例：

> Apache StreamPark 使用了 TypeScript、HTML5 技术吗？

反例：

> Apache StreamPark 使用了 ts、h5 技术吗？


## 3 中文翻译
- 社区推荐优先推荐撰写英文文档，然后根据英文文档翻译为中文文档。
- 翻译时以 `2 中文规范` 为基准，并兼顾如下几点：

### 3.1 使用纯文本工具进行翻译，不要使用富文本工具
使用纯文本工具可以进行翻译，可以有效避免增加新行、删除行、破坏链接、破坏引号、破坏星号等行为。

### 3.2 汉字与英文、数字之间需空格
参考中文文档规范部分

### 3.3 文档链接

英文版文档中可能会包含引用文档中其他文章的绝对链接，此时要注意将链接修改为中文版的 URL。


### 3.4 一般用“你”，而不是“您”

为了风格统一，我们建议在一般情况下使用“你”即可，这样与读者距离近一些。当然必要的时候可以使用“您”来称呼，比如 warning 提示的时候。

### 3.5 示例代码及注释

示例代码中的注释最好能够翻译，当然也可以选择不翻译（当注释很简单时）。

### 3.6 意译优于直译

社区不推荐把原文一字不漏地、逐句地翻译。因为有些情况下不但不准确而且有时候读着会很别扭。所以建议在翻译完以后，
自己多读几遍，看看是否符合原意、是否绕口、是否简洁。
在充分理解原文的基础上，可以适当采用意译的方式来翻译。有时候为了简化句子，有些数量词、助词、主语都可以省略。

简述两种示例情况如下：

#### 3.6.1 不必要的所有格翻译
英文中经常会用 `'s` 来表达从属关系，一字不落地都将其翻译成 "的" 就会很翻译腔。在中文里面有些 "的" 完全可以去掉，
不会影响表达的意思，还能简洁很多，看下面的例子：
- 示例：  
  Flink's documentation is located in the docs folder in Flink's source code repository

    - 反例：将"的"字都翻译出来，但是读起来很不顺畅
      >Flink 的文档位于 Flink 的源码仓库的 docs 文件夹中。

    - 正例：去掉不必要的"的"字，就会简洁很多：
      >Flink 文档位于 Flink 源码仓库的 docs 文件夹中。


#### 3.6.2 不必要的量词/冠词的翻译

英文一般比较严谨，当代表多个时，会使用复数名字，在翻译成中文时，一般不需要刻意把这种复数翻译出来。

在英文里，当单数可数名词时，前面一般会有“a”或“an”，但在中文里我们大多数时候是不用把“一个...”给翻译出来的。

- 示例：  
  State is a first-class citizen in Flink.

    - 反例：将“a”翻译成“一个”
      >状态是 Flink 中的一个一等公民

    - 正例：去掉不必要的“一个”
      >状态是 Flink 中的一等公民

虽然看起来没什么问题，但是这里的“一个”完全是多余的，去掉之后不但不会影响翻译效果，而且还会显得更加简洁。


### 3.7 专业术语
- Application，Checkpoint，Savepoint，Team 等，及当前没有合适的对应统一名词的翻译可以直接使用英文进行表述
- 重要：文章中第一次出现专业术语翻译的地方需要给出英文原文。例如：“如果看到反压（back pressure）警告，则...”
- 专有词要注意大小写，如 Apache Flink，Java，Scala，API，SQL，不要用小写的 apache flink, java, scala, api, sql。
- 当单词是指代码中的属性名、方法名、对象名、类名、标签名等时，可以不译。  
  例如 "parallelism parameter" 不需要翻译成“并发参数”，而是应为“parallelism 属性”。

### 3.8 编写或者翻译文档时及时换行
编写文档时，在近似行字符数（120 chars）附近主动换行，方便 review 和 开发者阅读.


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


