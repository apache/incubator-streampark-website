---
id: '4-data-type'
title: '数据类型'
sidebar_position: 4
---

## 介绍

Flink SQL有一组丰富的本地数据类型可供用户使用。

数据类型描述表生态系统中值的逻辑类型，它可用于声明操作的输入和/或输出类型。

Flink的数据类型类似于SQL标准的数据类型，但也包含了关于值是否为空的信息，以便有效地处理标量表达式。

数据类型的例子有:

* INT
* INT NOT NULL
* INTERVAL DAY TO SECOND(3)
* `ROW<myField ARRAY<BOOLEAN>, myOtherField TIMESTAMP(3)>`

## 数据类型列表

下面将列出所有预定义数据类型。

默认的计划器支持下面的SQL类型：

| 数据类型             | 解释                              |
|:-----------------|:--------------------------------|
| CHAR             |                                 |
| VARCHAR          |                                 |
| STRING           |                                 |
| BOOLEAN          |                                 |
| BYTES            | 1.13、1.14不支持BINARY 和VARBINARY   |
| DECIMAL          | 支持固定的精度和刻度                      |
| TINYINT          |                                 |
| SMALLINT         |                                 |
| INTEGER          |                                 |
| BIGINT           |                                 |
| FLOAT            |                                 |
| DOUBLE           |                                 |
| DATE             |                                 |
| TIME             | 只支持精度：0                         |
| TIMESTAMP        |                                 |
| TIMESTAMP_LTZ    |                                 |
| INTERVAL         | 只支持interval of MONTH 和SECOND(3) |
| ARRAY            |                                 |
| MULTISET         |                                 |
| MAP              |                                 |
| ROW              |                                 |
| RAW              |                                 |
| structured types | 目前仅可在自定义函数中使用                   |

### Character Strings

**CHAR**

固定长度的character string。

**SQL**

```sql
CHAR
CHAR(n)
```

**java/scala**

```java
DataTypes.CHAR(n);
```

桥接到JVM数据类型

| Java 类型                                | Input | Output | Output  |
|:---------------------------------------|:------|:-------|:--------|
| java.lang.String                       | X     | X      | 默认      |
| byte[]                                 | X     | X      | UTF-8编码 |
| org.apache.flink.table.data.StringData | X     | X      | 内部数据结构  |

该类型可以使用`CHAR(n)`声明，其中`n`是字符的数量。`n`的值必须在`1`和`2147,483,647`之间(前后都包括)。如果没有指定长度，则`n`等于1。

**VARCHAR / STRING**

可变长度的character string。

**SQL**

```sql
VARCHAR
VARCHAR(n)
STRING
```

**java/scala**

```java
DataTypes.VARCHAR(n);
DataTypes.STRING();
```

桥接到JVM数据类型

| Java 类型                                | Input | Output | Output  |
|:---------------------------------------|:------|:-------|:--------|
| java.lang.String                       | X     |        | 默认      |
| byte[]                                 | X     | X      | UTF-8编码 |
| org.apache.flink.table.data.StringData | X     | X      | 内部数据结构  |

该类型可以使用`VARCHAR(n)`声明，其中`n`是最大的字符数量。`N`的值必须在`1`和`2147,483,647`之间(包括两者)。如果没有指定长度，则`n`等于1。

`STRING`和`VARCHAR(2147483647)`相同。

### Binary Strings

**BINARY**

固定长度的二进制字符串，等同于字节序列。

**SQL**

```sql
BINARY
BINARY(n)
```

**java/scala**

```java
DataTypes.BINARY(n);
```

桥接到JVM数据类型

| Java 类型 | Input | Output | Output |
|:--------|:------|:-------|:-------|
| byte[]  | X     | X      | 默认     |

该类型可以使用`BINARY(n)`声明，其中`n`为字节数。`N`的值必须在`1`和`2147,483,647`之间(包括两者)。如果没有指定长度，则`n`等于1。

**VARBINARY / BYTES**

可变长度的二进制字符串，等同于字节序列。

**SQL**

```sql
VARBINARY
VARBINARY(n)
BYTES
```

**java/scala**

```java
DataTypes.VARBINARY(n);
DataTypes.BYTES();
```

桥接到JVM数据类型

| Java 类型 | Input | Output | Output |
|:--------|:------|:-------|:-------|
| byte[]  | X     | X      | 默认     |

该类型可以使用`VARBINARY(n)`声明，其中`n`为最大字节数。`N`的值必须在`1`和`2147,483,647`之间(包括两者)。如果没有指定长度，则`n`等于1。

`BYTES`和`VARBINARY(2147483647)`相同。

### 精确数字

**DECIMAL**

具有固定精度和比例的小数的数据类型。

**SQL**

```sql
DECIMAL
DECIMAL(p)
DECIMAL(p, s)

DEC
DEC(p)
DEC(p, s)

NUMERIC
NUMERIC(p)
NUMERIC(p, s)
```

**java/scala**

```java
DataTypes.DECIMAL(p,s);
```

桥接到JVM数据类型

| Java 类型                                 | Input | Output | Output |
|:----------------------------------------|:------|:-------|:-------|
| java.math.BigDecimal                    | X     | X      | 默认     |
| org.apache.flink.table.data.DecimalData | X     | X      | 内部数据结构 |

该类型可以使用`DECIMAL(p, s)`声明，其中`p`是数字(精度)的总位数，`s`是数字(刻度)小数点右边的位数。
`P`的值必须在`1`和`38`之间(包括两者)。`S`的值必须在`0`和`p`之间(包括两者)。`p`的默认值是10。`s`的默认值是0。

`NUMERIC(p, s)`、`DEC(p, s)`和该类型含义一样。

**TINYINT**

值从`-128`到`127`，1个字节，有符号整数。

**SQL**

```sql
TINYINT
```

**java/scala**

```java
DataTypes.TINYINT();
```

桥接到JVM数据类型

| Java 类型        | Input | Output | Output         |
|:---------------|:------|:-------|:---------------|
| java.lang.Byte | X     | X      | 默认             |
| byte           | X     | (X)    | 类型为非空null时才会输出 |

**SMALLINT**

值从`-32,768`到`32,767`，2个字节，有符号整数。

**SQL**

```sql
SMALLINT
```

**java/scala**

```java
DataTypes.SMALLINT();
```

桥接到JVM数据类型

| Java 类型         | Input | Output | Output         |
|:----------------|:------|:-------|:---------------|
| java.lang.Short | X     | X      | 默认             |
| short           | X     | (X)    | 类型为非空null时才会输出 |

**INT**

值从`-2147,483,648`到`2147,483,647`，4个字节，有符号整数。

**SQL**

```sql
INT
INTEGER
```

**java/scala**

```java
DataTypes.INT();
```

桥接到JVM数据类型

| Java 类型           | Input | Output | Output         |
|:------------------|:------|:-------|:---------------|
| java.lang.Integer | X     | X      | 默认             |
| int               | X     | (X)    | 类型为非空null时才会输出 |

**INTEGER**也表示该类型。

**BIGINT**

值从`-9,223,372,036,854,775,808`到`9,223,372,036,854,775,807`，8个字节，有符号整数。

**SQL**

```sql
BIGINT
```

**java/scala**

```java
DataTypes.BIGINT();
```

桥接到JVM数据类型

| Java 类型        | Input | Output | Output         |
|:---------------|:------|:-------|:---------------|
| java.lang.Long | X     | X      | 默认             |
| long           | X     | (X)    | 类型为非空null时才会输出 |

### 近似数字

**FLOAT**

4个字节的单精度浮点数。

与SQL标准相比，该类型不带参数。

**SQL**

```sql
FLOAT
```

**java/scala**

```java
DataTypes.FLOAT();
```

桥接到JVM数据类型

| Java 类型         | Input | Output | Output         |
|:----------------|:------|:-------|:---------------|
| java.lang.Float | X     | X      | 默认             |
| float           | X     | (X)    | 类型为非空null时才会输出 |

**DOUBLE**

8字节的双精度浮点数。

**SQL**

```sql
DOUBLE
DOUBLE PRECISION
```

**java/scala**

```java
DataTypes.DOUBLE();
```

桥接到JVM数据类型

| Java 类型          | Input | Output | Output         |
|:-----------------|:------|:-------|:---------------|
| java.lang.Double | X     | X      | 默认             |
| double           | X     | (X)    | 类型为非空null时才会输出 |

`DOUBLE PRECISION`也表示该类型。

### Date 和Time

注意：所有时间类型的精度 **p** 指的都是秒后面的小数个数。

**DATE**

日期数据类型为`年-月-日`，取值范围为`0000-01-01 ~ 9999-12-31`。

与SQL标准相比，范围从0000年开始。

**SQL**

```sql
DATE
```

**java/scala**

```java
DataTypes.DATE();
```

桥接到JVM数据类型

| Java 类型             | Input | Output | Output                       |
|:--------------------|:------|:-------|:-----------------------------|
| java.time.LocalDate | X     | X      | 默认                           |
| java.sql.Date       | X     | X      |                              |
| java.lang.Integer   | X     | X      | 描述从纪元开始经过的天数                 |
| int                 | X     | (X)    | 描述从纪元开始已经过的天数。类型为非空null时才会输出 |

**TIME**

无时区的时间数据类型，由`时:分:秒[.小数]`组成，精度可达纳秒，值范围从`00:00:00.000000000`到`23:59:59.999999999`。

**SQL/Java/Scala**

与SQL标准相比，该类型不支持闰秒`(23:59:60和23:59:61)`，因为该类型语义更接近`java.time.LocalTime`。目前不支持带时区的时间。

**SQL**

```sql
TIME
TIME(p)
```

**java/scala**

```java
DataTypes.TIME(p);
```

桥接到JVM数据类型

| Java 类型             | Input | Output | Output                        |
|:--------------------|:------|:-------|:------------------------------|
| java.time.LocalTime | X     | X      | 默认                            |
| java.sql.Time       | X     | X      |                               |
| java.lang.Integer   | X     | X      | 描述当天经过的毫秒值                    |
| int                 | X     | (X)    | 描述当天经过的毫秒值<br/>类型为非空null时才会输出 |
| java.lang.Long      | X     | X      | 描述当天经过的纳秒值                    |
| long                |       | (X)    | 描述当天经过的纳秒值<br/>类型为非空null时才会输出 |

该类型可以使用`TIME(p)`声明，其中p是秒后面小数的位数(精度)。P必须有一个介于0和9之间的值(包括两者)。如果没有指定精度，p等于0。

**TIMESTAMP**

无时区的时间戳数据类型，由`年-月-日 时:分:秒[.小数]`组成，精度可达纳秒，值范围从`0000-01-01 00:00:00.000000000`到`9999-12-31 23:59:59.99999999999`。

**SQL/Java/Scala**

与SQL标准相比，该类型不支持闰秒(23:59:60和23:59:61)，因为该类型语义更接近`java.time.LocalDateTime`。

不支持从`BIGINT` (JVM long类型)转化为该类型，也不支持从该类型转换到`BIGINT` (JVM long类型)，因为这种转换需要时区，但是该类型是不受时区限制的。
如果需要使用到时区，则可以使用`TIMESTAMP_LTZ`类型。

**SQL**

```sql
TIMESTAMP
TIMESTAMP(p)

TIMESTAMP WITHOUT TIME ZONE
TIMESTAMP(p) WITHOUT TIME ZONE
```

**java/scala**

```java
DataTypes.TIMESTAMP(p);
```

桥接到JVM数据类型

| Java 类型                                   | Input | Output | Output |
|:------------------------------------------|:------|:-------|:-------|
| java.time.LocalDateTime                   | X     | X      | 默认     |
| java.sql.Timestamp                        | X     | X      |        |
| org.apache.flink.table.data.TimestampData | X     | X      | 内部数据结构 |

该类型可以使用`TIMESTAMP(p)`声明，其中p是秒后面小数(精度)的位数。P必须是一个介于0和9之间的值(包括两者)。如果没有指定精度，则p等于6。

`TIMESTAMP(p) WITHOUT TIME ZONE`也表示该类型。

**TIMESTAMP WITH TIME ZONE**

有时区的时间戳的数据类型，由`年-月-日 时:分:秒[.分数]`组成，精确度可达纳秒，值范围为`0000-01-01 00:00:00.000000000 +14:59`
到`9999-12-31 23:59:59.999999999 -14:59`。

与`TIMESTAMP_LTZ`相比，时区偏移信息物理地存储在每个数据中。它被单独用于每一个计算、可视化以及与外部系统通信。

**SQL**

```sql
TIMESTAMP WITH TIME ZONE
TIMESTAMP(p) WITH TIME ZONE
```

**java/scala**

```java
DataTypes.TIMESTAMP_WITH_TIME_ZONE(p);
```

桥接到JVM数据类型

| Java 类型                  | Input | Output | Output |
|:-------------------------|:------|:-------|:-------|
| java.time.OffsetDateTime | X     | X      | 默认     |
| java.time.ZonedDateTime  | X     |        | 忽略时区ID |

**TIMESTAMP_LTZ**

使用本地时区的时间戳数据类型，由`年-月-日 时:分:秒[.分数]`组成，精度可达纳秒，值范围为`0000-01-01 00:00:00.000000000 +14:59`
到`9999-12-31 23:59:59.999999999 -14:59`。

该类型允许根据配置的会话时区解释UTC时间戳来填补自由时区和强制时区时间戳类型之间的空白。

**SQL**

```sql
TIMESTAMP_LTZ
TIMESTAMP_LTZ(p)

TIMESTAMP WITH LOCAL TIME ZONE
TIMESTAMP(p) WITH LOCAL TIME ZONE
```

**java/scala**

```java
DataTypes.TIMESTAMP_LTZ(p);
DataTypes.TIMESTAMP_WITH_LOCAL_TIME_ZONE(p);
```

桥接到JVM数据类型

| Java 类型                                   | Input | Output | Output                           |
|:------------------------------------------|:------|:-------|:---------------------------------|
| java.time.Instant                         | X     | X      | 默认                               |
| java.lang.Integer                         | X     | X      | 描述从纪元开始经过的秒数                     |
| int                                       | X     | (X)    | 描述从纪元开始经过的秒数<br/>类型为非空null时才会输出  |
| java.lang.Long                            | X     | X      | 描述从纪元开始经过的毫秒数                    |
| long                                      | X     | (X)    | 描述从纪元开始经过的毫秒数<br/>类型为非空null时才会输出 |
| java.sql.Timestamp                        | X     | X      | 描述从纪元开始经过的毫秒数                    |
| org.apache.flink.table.data.TimestampData | X     | X      | 内部数据结构                           |

可以使用`TIMESTAMP_LTZ(p)`声明该类型，其中p是秒后面小数(精度)的位数。P必须是一个介于0和9之间的值(包括两者)。如果没有指定精度，则p等于6。

`TIMESTAMP(p) WITH LOCAL TIME ZONE`是该类型的同义词。

**INTERVAL YEAR TO MONTH**

一组年-月间隔类型的数据类型。

该类型必须参数化为以下解析之一：

* interval of years
* interval of years to months
* interval of months

`年-月`的间隔由` +year-momth` 组成，取值范围为`-9999-11` ~ `+9999-11`。

比如，50个月的间隔以年到月的间隔格式表示为(使用默认的年精度):`+04-02`。

**SQL**

```sql
INTERVAL YEAR
INTERVAL YEAR(p)
INTERVAL YEAR(p) TO MONTH
INTERVAL MONTH
```

**java/scala**

```java
DataTypes.INTERVAL(DataTypes.YEAR());
DataTypes.INTERVAL(DataTypes.YEAR(p));
DataTypes.INTERVAL(DataTypes.YEAR(p),DataTypes.MONTH());
DataTypes.INTERVAL(DataTypes.MONTH());
```

桥接到JVM数据类型

| Java 类型           | Input | Output | Output                     |
|:------------------|:------|:-------|:---------------------------|
| java.time.Period  | X     | X      | 忽略天的部分，默认                  |
| java.lang.Integer | X     | X      | 描述经过的月数                    |
| int               | X     | (X)    | 描述经过的月数<br/>类型为非空null时才会输出 |

可以使用上面的组合声明类型，其中p是年份的位数(年份精度)。P的值必须在1和4之间(包括两者)。如果没有指定年份精度，则p等于2。

**INTERVAL DAY TO SECOND**

一组日间隔类型的数据类型。

该类型必须参数化为以下解析之一，精度可达纳秒：

* interval of days
* interval of days to hours
* interval of days to minutes
* interval of days to seconds
* interval of hours
* interval of hours to minutes
* interval of hours to seconds
* interval of minutes
* interval of minutes to seconds
* interval of seconds

`day-time`的间隔由 `+天 时:分:秒.小数`组成，取值范围为`-999999 23:59:59.999999999`到`+999999 23:59:59.999999999`。
例如，70秒的间隔以天到秒的间隔格式表示(具有默认精度):`+00 00:01:10 000000`。

**SQL**

```sql
INTERVAL DAY
INTERVAL DAY(p1)
INTERVAL DAY(p1) TO HOUR
INTERVAL DAY(p1) TO MINUTE
INTERVAL DAY(p1) TO SECOND(p2)
INTERVAL HOUR
INTERVAL HOUR TO MINUTE
INTERVAL HOUR TO SECOND(p2)
INTERVAL MINUTE
INTERVAL MINUTE TO SECOND(p2)
INTERVAL SECOND
INTERVAL SECOND(p2)
```

**java/scala**

```java
DataTypes.INTERVAL(DataTypes.DAY());
DataTypes.INTERVAL(DataTypes.DAY(p1));
DataTypes.INTERVAL(DataTypes.DAY(p1),DataTypes.HOUR());
DataTypes.INTERVAL(DataTypes.DAY(p1),DataTypes.MINUTE());
DataTypes.INTERVAL(DataTypes.DAY(p1),DataTypes.SECOND(p2));
DataTypes.INTERVAL(DataTypes.HOUR());
DataTypes.INTERVAL(DataTypes.HOUR(),DataTypes.MINUTE());
DataTypes.INTERVAL(DataTypes.HOUR(),DataTypes.SECOND(p2));
DataTypes.INTERVAL(DataTypes.MINUTE());
DataTypes.INTERVAL(DataTypes.MINUTE(),DataTypes.SECOND(p2));
DataTypes.INTERVAL(DataTypes.SECOND());
DataTypes.INTERVAL(DataTypes.SECOND(p2));
```

桥接到JVM数据类型

| Java 类型            | Input | Output | Output                   |
|:-------------------|:------|:-------|:-------------------------|
| java.time.Duration | X     | X      | 默认                       |
| java.lang.Long     | X     | X      | 描述毫秒值                    |
| long               | X     | (X)    | 描述毫秒值<br/>类型为非空null时才会输出 |

可以使用上面的组合声明该类型，其中`p1`是天数(天数精度)，`p2`是小数秒(小数精度)。`P1`的值必须在1到6之间(包括1和6)。`P2`的值必须在0到9之间(包括两者)。
如果没有指定p1，默认值为2。如果没有指定p2，默认值为6。

### Constructed结构数据类型

**ARRAY**

具有相同子类型元素的数组。

与SQL标准相比，不能指定数组的最大基数，而是固定在`2,147,483,647`。此外，支持任何有效类型作为子类型。

**SQL**

```sql
ARRAY<t>
t ARRAY
```

**java/scala**

```java
DataTypes.ARRAY(t);
```

桥接到JVM数据类型

| Java 类型                               | Input | Output | Output    |
|:--------------------------------------|:------|:-------|:----------|
| t[]                                   | (X)   | (X)    | 由子类型决定，默认 |
| `java.util.List<t>  `                 | X     | X      |           |
| `java.util.List<t>` 的子类               | X     |        |           |
| org.apache.flink.table.data.ArrayData | X     | X      | 内部数据结构    |

该类型可以使用`ARRAY<t>`声明，其中`t`是所包含元素的数据类型。

`t ARRAY`是接近SQL标准的同义词。例如，`INT ARRAY`等价于`ARRAY<INT>`。

**MAP**

关联数组的数据类型，将键(包括NULL)映射到值(包括NULL)。`map`不能包含重复的键；每个键最多只能映射到一个值。

元素类型没有限制，需要用户确保数据`key`的唯一性。

`map`类型是对SQL标准的扩展。

**SQL**

```sql
MAP<kt, vt>
```

**java/scala**

```java
DataTypes.MAP(kt,vt);
```

其中的`kt`和`vt`都是`DataType`类型。

桥接到JVM数据类型

| Java 类型                             | Input | Output | Output |
|:------------------------------------|:------|:-------|:-------|
| `java.util.Map<kt, vt>`             | X     | X      | 默认     |
| `java.util.Map<kt, vt>`             | X     |        |        |
| org.apache.flink.table.data.MapData | X     | X      | 内部数据类型 |

该类型可以使用`MAP<kt, vt>`声明，其中`kt`是key元素的数据类型，`vt`是value元素的数据类型。

**MULTISET**

`multiset`(=bag)数据类型。与`map`不同，它允许集合中的每个元素存在多个实例。每个唯一的值(包括NULL)可以保存多个。

元素类型没有限制，需要用户确保唯一性。

**SQL**

```sql
MULTISET<t>
t MULTISET
```

**java/scala**

```java
DataTypes.MULTISET(t);
```

桥接到JVM数据类型

| Java 类型                                 | Input | Output | Output         |
|:----------------------------------------|:------|:-------|:---------------|
| `java.util.Map<t, java.lang.Integer>`   | X     | X      | 默认，给每个值分配其对应个数 |
| `java.util.Map<t, java.lang.Integer>`子类 | X     |        |                |
| org.apache.flink.table.data.MapData     | X     | X      | 内部数据类型         |

该类型可以使用`MULTISET<t>`声明，其中t是所包含元素的数据类型。

`MULTISET`是接近SQL标准的同义词。例如，`INT MULTISET`等价于`MULTISET<INT>`。

**ROW**

字段序列的数据类型。

字段由字段名、字段类型和可选描述组成。

与SQL标准相比，可选的字段描述简化了复杂结构的处理。

行类型类似于其他非标准兼容框架中的`STRUCT`类型。

**SQL**

```sql
ROW<n0 t0, n1 t1, ...>
ROW<n0 t0 'd0', n1 t1 'd1', ...>

ROW(n0 t0, n1 t1, ...)
ROW(n0 t0 'd0', n1 t1 'd1', ...)
```

**java/scala**

```java
DataTypes.ROW(DataTypes.FIELD(n0,t0),DataTypes.FIELD(n1,t1),...);
        DataTypes.ROW(DataTypes.FIELD(n0,t0,d0),DataTypes.FIELD(n1,t1,d1),...);
```

`n0`为字段名称，`t0`为字段类型，`d0`为字段描述。

桥接到JVM数据类型

| Java 类型                             | Input | Output | Output |
|:------------------------------------|:------|:-------|:-------|
| org.apache.flink.types.Row          | X     | X      | 默认     |
| org.apache.flink.table.data.RowData | X     | X      | 内部数据结构 |

可以使用`ROW<n0 t0 'd0'， n1 t1 'd1'，…>`声明该类型，其中`n`是字段的唯一名称，`t`是字段的逻辑类型，`d`是字段的描述。

`ROW(…)`是接近SQL标准的同义词。例如，`ROW(myField INT, myOtherField BOOLEAN)`等价于`ROW<myField INT, myOtherField BOOLEAN>`。

### 用户自定义数据类型

目前还不完全支持用户自定义的数据类型。它们目前(从Flink 1.11开始)只在参数和函数返回类型中作为未注册的结构类型。

结构化类型类似于面向对象编程语言中的对象。它包含零个、一个或多个属性。每个属性由名称和类型组成。

有两种结构化类型:

* 存储在`catalog`中并由`catalog`标识符标识的类型(如cat.db.MyType)。这些等同于结构化类型的SQL标准定义。
* 匿名定义、未注册的类型(通常通过反射提取)，由其实现类(如com.myorg.model.MyType)标识。这些类型在以编程方式定义表程序中很有用。它们允许重用现有的JVM类，而无需再次手动定义数据类型的模式。

**注册的结构化类型**

目前还不支持注册结构化类型。因此，它们不能存储在`catalog`中，也不能在`CREATE TABLE DDL`中引用。

**未注册的结构化类型**

可以使用自动反射提取从常规`pojo`(普通Java对象)创建未注册的结构化类型。

结构化类型的实现类必须满足以下要求:

* 类必须是全局可访问的，这意味着它必须声明为`public、static`，而不是`abstract`。
* 类必须提供一个零参数的默认构造函数或一个赋值所有字段的完整参数的构造函数。
* 类的所有字段必须可以通过`public`声明或遵循公共编码风格的`getter`(如getField()， isField()， field())方法读取。
* 类的所有字段必须由`public`声明、有完整参数的构造函数或遵循公共编码风格的`setter`(如setField(…)、field(…))方法写入。
* 所有字段必须可以通过隐式地反射提取或使用`@DataTypeHint`注释显式地映射到数据类型。
* 声明为`static`或`transient`的字段将被忽略。

反射提取支持字段的任意嵌套，只要字段类型不传递性地引用自身。

声明的字段类行(例如public int age)必须在受支持的JVM桥接类列表中，例如`in`t 为：`java.lang.Integer`或`int`。

对于某些类，需要一个注释来将类映射到具体的数据类型(例如`@DataTypeHint("DECIMAL(10,2)`")来为`java.math.BigDecimal`指定固定的精度和比例)。

**JAVA**

```java
class User {
    // 自动抽取数据类型
    public int age;
    public String name;
    //通过注解丰富其精度信息
    public @DataTypeHint("DECIMAL(10, 2)")
    BigDecimal totalBalance;
    //强制使用RAW类型丰富提取
    public @DataTypeHint("RAW")
    Class<?> modelClass;
}
DataTypes.of(User.class);
```

**桥接到JVM数据类型**

| Java 类型                             | Input | Output | Output                  |
|:------------------------------------|:------|:-------|:------------------------|
| class                               | X     | X      | 输入：该类或其子类。输出：子类。<br/>默认 |
| org.apache.flink.types.Row          | X     | X      | 代表row类型的结构体             |
| org.apache.flink.table.data.RowData | X     | X      | 内部数据类型                  |

### 其他数据类型

**BOOLEAN**
布尔数据类型，值为：`TRUE`、`FALSE`或`UNKNOWN`。

**SQL**

```sql
BOOLEAN
```

**java/scala**

```java
DataTypes.BOOLEAN();
```

桥接到JVM数据类型

| Java 类型           | Input | Output | Output         |
|:------------------|:------|:-------|:---------------|
| java.lang.Boolean | X     | X      | 默认             |
| boolean           | X     | (X)    | 类型为非空null时才会输出 |

**RAW**

任意序列化类型的数据类型。这种类型是表生态系统中的黑盒，仅在边缘处进行反序列化。

该类型是对SQL标准的扩展。

**SQL**

```sql
RAW('class', 'snapshot')
```

**java/scala**

```java
DataTypes.RAW(class,serializer);
DataTypes.RAW(class);
```

桥接到JVM数据类型

| Java 类型                                  | Input | Output | Output             |
|:-----------------------------------------|:------|:-------|:-------------------|
| class                                    | X     | X      | 默认。输入：原始类或子类。输出：子类 |
| byte[]                                   |       | X      |                    |
| org.apache.flink.table.data.RawValueData | X     | X      | 内部数据结构             |

**SQL/Java/Scala**

该类型可以使用`RAW('class', 'snapshot')`声明，其中`class`是原始类，`snapshot`是Base64编码的序列化的`TypeSerializerSnapshot`。
通常，类型字符串不是直接声明的，而是在持久化类型时生成的。

在API中，RAW类型可以通过直接提供`Class + TypeSerializer`或者通过传递Class并让框架从中提取`Class + TypeSerializer`来声明。

**NULL**

表示非类型NULL值的数据类型。

`NULL`类型是对SQL标准的扩展。`NULL`类型除了`null`以外没有其他值，因此，它可以被强制转换为任何可为空的类型，类似于JVM语义。

这种类型有助于在API调用中表示未知类型，这些调用使用`NULL`字面量，并桥接到JSON或Avro等格式，这些格式也定义了这种类型。

这种类型在实践中不是很有用，这里只是为了完整性而提到它。

**SQL**

```sql
NULL
```

**java/scala**

```java
DataTypes.NULL();
```

桥接到JVM数据类型

| Java 类型          | Input | Output | Output  |
|:-----------------|:------|:-------|:--------|
| java.lang.Object | X     | X      | 默认      |
| 任何类              |       | (X)    | 任何非原始类型 |

## 新版类型转换CAST

**从flink-1.15.x开始支持。**

`Flink Table API` 和 `SQL` 可以将定义的输入类型转化为目标类型，不管输入值是什么，有些转化操作都会成功，但是有些转化会在运行时失败，比如无法为目标类型创建一个正确的值。
举例：通常来说，可以将一个 `INT` 值转化为 `STRING`，但是并不是什么时候都可以将 `INT` 值转化为 `STRING`。

在计划期间，查询校验器在遇到校验异常时拒绝无效类型对的查询，比如尝试将 `TIMESTAMP` 转化为 `INTERVAL` 类型。查询校验器会接受可能在运行时失败的有效类型对，但是要求用户正确的处理运行失败。

在` Flink Table API `和` SQL` 中，转化可以使用以下两个内建函数之一来执行：

* **CAST**：SQL 标准定义的常规转化函数，该函数会在转化不可靠或者是提供的输入无效时造成任务失败。类型推断将会保留输入类型的可空性（**NULL**）。
* **TRY_CAST**：常规转换函数的扩展函数，在转换操作失败时返回 NULL 值，该函数的返回类型一直保持可空性（**NULL**）。

比如：

```sql
CAST('42' AS INT) --- 返回 INT NOT NULL 类型的 42
CAST(NULL AS VARCHAR) --- 返回 VARCHAR 类型的 NULL
CAST('non-number' AS INT) --- 抛出异常，并且将任务运行失败

TRY_CAST('42' AS INT) --- 返回 INT 类型的 42
TRY_CAST(NULL AS VARCHAR) --- 返回 VARCHAR 类型的 NULL
TRY_CAST('non-number' AS INT) --- 返回 INT 类型的 NULL
COALESCE(TRY_CAST('non-number' AS INT), 0) --- 返回 INT NOT NULL 类型的 0
```

**可空性解释**：在`flink-1.15.x`版本之前，如果你在 SQL 中使用了 `if` 或 `case when` 表达式，在满足条件时，你想让结果为 `NULL`，此时直接写 `NULL` ，是无法运行的。
但在 `flink-1.15.x` 中，可以使用新版的转化函数，将 `NULL` 值转化为对应字段的类型，以此来使用 `NULL` 。

下面的表格展示了支持的可转化类型对，“Y”表示支持，“!”表示失败，“N”表示还不支持。

| Input\Target           | CHAR¹/VARCHAR¹/STRING | BINARY¹/VARBINARY¹/BYTES | BOOLEAN | DECIMAL | TINYINT | SMALLINT | INTEGER | BIGINT | FLOAT | DOUBLE | DATE | TIME | TIMESTAMP | TIMESTAMP_LTZ | INTERVAL | ARRAY | MULTISET | MAP | ROW | STRUCTURED | RAW |
|:-----------------------|:----------------------|:-------------------------|:--------|:--------|:--------|:---------|:--------|:-------|:------|:-------|:-----|:-----|:----------|:--------------|:---------|:------|:---------|:----|:----|:-----------|:----|
| CHAR/VARCHAR/STRING    | Y                     | !                        | !       | !       | !       | !        | !       | !      | !     | !      | !    | !    | !         | !             | N        | N     | N        | N   | N   | N          | N   |
| BINARY/VARBINARY/BYTES | Y                     | Y                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | N    | N         | N             | N        | N     | N        | N   | N   | N          | N   |
| BOOLEAN                | Y                     | N                        | Y       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N         | N             | N        | N     | N        | N   | N   | N          | N   |
| DECIMAL                | Y                     | N                        | N       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N         | N             | N        | N     | N        | N   | N   | N          | N   |
| TINYINT                | Y                     | N                        | Y       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N²        | N²            | N        | N     | N        | N   | N   | N          | N   |
| SMALLINT               | Y                     | N                        | Y       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N²        | N²            | N        | N     | N        | N   | N   | N          | N   |
| INTEGER                | Y                     | N                        | Y       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N²        | N²            | Y⁵       | N     | N        | N   | N   | N          | N   |
| BIGINT                 | Y                     | N                        | Y       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N²        | N²            | Y⁶       | N     | N        | N   | N   | N          | N   |
| FLOAT                  | Y                     | N                        | N       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N         | N             | N        | N     | N        | N   | N   | N          | N   |
| DOUBLE                 | Y                     | N                        | N       | Y       | Y       | Y        | Y       | Y      | Y     | Y      | N    | N    | N         | N             | N        | N     | N        | N   | N   | N          | N   |
| DATE                   | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | Y    | N    | Y         | Y             | N        | N     | N        | N   | N   | N          | N   |
| TIME                   | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | Y    | Y         | Y             | N        | N     | N        | N   | N   | N          | N   |
| TIMESTAMP              | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | Y    | Y    | Y         | Y             | N        | N     | N        | N   | N   | N          | N   |
| TIMESTAMP_LTZ          | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | Y    | Y    | Y         | Y             | N        | N     | N        | N   | N   | N          | N   |
| INTERVAL               | Y                     | N                        | N       | N       | N       | N        | Y⁵      | Y⁶     | N     | N      | N    | N    | N         | N             | Y        | N     | N        | N   | N   | N          | N   |
| ARRAY                  | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | N    | N         | N             | N        | !³    | N        | N   | N   | N          | N   |
| MULTISET               | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | N    | N         | N             | N        | N     | !³       | N   | N   | N          | N   |
| MAP                    | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | N    | N         | N             | N        | N     | N        | !³  | N   | N          | N   |
| ROW                    | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | N    | N         | N             | N        | N     | N        | N   | !³  | N          | N   |
| STRUCTURED             | Y                     | N                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | N    | N         | N             | N        | N     | N        | N   | N   | !³         | N   |
| RAW                    | Y                     | !                        | N       | N       | N       | N        | N       | N      | N     | N      | N    | N    | N         | N             | N        | N     | N        | N   | N   | N          | Y⁴  |

注（下面这些数字对应表中的右上角数字）：

1. 所有转化为固定或可变长度的类型，都会根据类型定义对结果值进行截取或使用空格填充。
2. 必须使用 TO_TIMESTAMP 和 TO_TIMESTAMP_LTZ ，而不是 CAST/TRY_CAST。
3. 如果子类型对支持，则支持，如果子类型对不支持，则失败。
4. 如果 RAW 类和序列化类相等，则支持。
5. 如果 INTERVAL 在 MONTH TO YEAR 范围内，则支持。
6. 如果 INTERVAL 在 DAY TO TIME 范围内，则支持。

另外，不管是使用 `CAST` 还是 `TRY_CAST` 函数，转化 `NULL` 都只会返回 `NULL` 值。

### 旧版转化

**指1.14.x及以下版本。**

可以设置 `table.exec.legacy-cast-behaviour` 为 `enabled` 来使用` Flink-1.15` 之前的转化操作，在 `Flink-1.15` 中，该设置默认禁用。

开启该参数，将会导致：

1. 转化为 `CHAR/VARCHAR/BINARY/VARBINARY` 类型时，将不会对结果值进行截取或填充。
2. `CAST` 永远不会失败，而是返回 `NULL` ，就像是 `TRY_CAST` 的行为，但是不会参考正确的类型。
3. 转化一些值为 `CHAR/VARCHAR/STRING` 类型时，将会产生稍微不同的结果。

我们不推荐开启该参数，并且强烈建议新的项目保持禁用该参数，并且使用新的转化行为。该参数将会在下个 flink 版本中移除。

## 数据类型提取

在API中，Flink会尝试使用反射从类信息中自动提取数据类型，以避免重复的手动指定工作。但是，反射式提取数据类型并不总是成功的，因为可能缺少逻辑信息。
因此，可能需要在类或字段声明附近添加额外的信息，以支持提取逻辑。

下表列出了可以隐式映射到数据类型而不需要进一步添加额外信息的类。

如果你想使用`Scala`类，建议使用装箱类型(例如`java.lang.Integer`)，而不是`Scala`的原生类。
`Scala`的原生类(例如`Int`或`Doubl`e)被编译为JVM原生类(例如`Int` / `Double`)，结果如下表所示，增加`NOT NULL`语义。

此外，`Scala`原生类的泛型(例如`java.util.Map[Int, Double]`)在编译过程中会被擦除，最后结果类似于：`java.util.Map[java.lang.Object, java.lang.Object]`。

| Class                    | 数据类型                        |
|:-------------------------|:----------------------------|
| java.lang.String         | STRING                      |
| java.lang.Boolean        | BOOLEAN                     |
| boolean                  | BOOLEAN NOT NULL            |
| java.lang.Byte           | TINYINT                     |
| byte                     | TINYINT NOT NULL            |
| java.lang.Short          | SMALLINT                    |
| short                    | SMALLINT NOT NULL           |
| java.lang.Integer        | INT                         |
| int                      | INT NOT NULL                |
| java.lang.Long           | BIGINT                      |
| long                     | BIGINT NOT NULL             |
| java.lang.Float          | FLOAT                       |
| java.lang.Float          | FLOAT                       |
| float                    | FLOAT NOT NULL              |
| java.lang.Double         | DOUBLE                      |
| double                   | DOUBLE NOT NULL             |
| java.sql.Date            | DATE                        |
| java.time.LocalDate      | DATE                        |
| java.sql.Time            | TIME(0)                     |
| java.time.LocalTime      | TIME(9)                     |
| java.sql.Timestamp       | TIMESTAMP(9)                |
| java.time.LocalDateTime  | TIMESTAMP(9)                |
| java.time.OffsetDateTime | TIMESTAMP(9) WITH TIME ZONE |
| java.time.Instant        | TIMESTAMP_LTZ(9)            |
| java.time.Duration       | INTERVAL SECOND(9)          |
| java.time.Period         | INTERVAL YEAR(4) TO MONTH   |
| byte[]                   | BYTES                       |
| T[]                      | `ARRAY<T>`                  |
| `java.util.Map<K, V>`    | `MAP<K, V>`                 |
| structured type T        | 匿名 structured type T        |

本章节中提到的其他JVM桥接类需要`@DataTypeHint`注解。

数据类型提示可以参数化或替换单个函数参数和返回类型、结构化类或结构化类的字段的默认提取逻辑。开发者可以通过声明`@DataTypeHint`注解来选择应该在多大程度上修改默认提取逻辑。

`@DataTypeHint`注解提供了一组可选的提示参数。下面的示例显示了其中一些参数。更多信息可以在注解类的文档中找到。

**java**

```java
import org.apache.flink.table.annotation.DataTypeHint;

class User {
    //将java.lang.Integer类转化为 INT 数据类型
    public @DataTypeHint("INT")
    Object o1;
    // 使用显式转换类定义毫秒精度的TIMESTAMP数据类型
    public @DataTypeHint(value = "TIMESTAMP(3)", bridgedTo = java.sql.Timestamp.class)
    Object o2;
    //强制使用RAW类型来丰富类型提取
    public @DataTypeHint("RAW")
    Class<?> modelClass;
    // 定义所有出现的java.math.BigDecimal(也包括嵌套字段)将被提取为DECIMAL(12, 2)
    public @DataTypeHint(defaultDecimalPrecision = 12, defaultDecimalScale = 2)
    AccountStatement stmt;
    // 定义每当类型不能映射到数据类型时，不要抛出异常，而应始终将其视为RAW类型
    public @DataTypeHint(allowRawGlobally = HintFlag.TRUE)
    ComplexModel model;
}
```
