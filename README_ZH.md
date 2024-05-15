# Apache StreamPark™ Website

[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)

[English](README.md) | [中文](README_ZH.md)

这是包含 `http://streampark.apache.org` 的所有源代码的存储库。本指南将指导您如何为 Apache StreamPark™ (Incubating) 的网站做出贡献。

## 分支

dev 为默认主分支，修改请先 fork 到自己的仓库，然后切换到自己的开发分支上进行开发修改。

## 1. 预览并生成静态文件

本网站使用 Node.js 编译（>=18），并基于 [Docusaurus (3.3.2)](https://docusaurus.io/) 框架构建。

运行以下命令下载网站源代码并在本地预览：

```shell
git clone https://github.com/apache/incubator-streampark-website.git streampark-website
cd streampark-website
pnpm install
pnpm run start
```

这段命令将在浏览器打开 http://localhost:3000 页面提供英文预览版。如果想预览中文版本，请使用 `pnpm run start-zh` 命令。

运行 `pnpm run build` 命令可以生成静态网站资源文件，构建出来的静态资源在 build 目录中。

## 2. 目录结构

```text
|-- community //社区
|-- docs      //文档  存放下一个即将发布的版本
|-- download  //下载
|-- faq       //Q&A
|-- i18n
|   -- zh-CN  //国际化中文
|       |-- code.json
|       |-- docusaurus-plugin-content-docs
|       |-- docusaurus-plugin-content-docs-community
|       |-- docusaurus-plugin-content-docs-download
|       |-- docusaurus-plugin-content-docs-faq
|        -- docusaurus-theme-classic
|-- resource // 架构/时序/流程图等的原始工程文件
|-- src
|   |-- components
|   |-- css
|   |-- js
|   |-- pages
|   |   |-- home
|   |   |-- index.jsx
|   |   |-- team
|   |   |-- user
|   |-- styles
|-- static //静态资源
|   |-- doc  //文档的静态资源
|        |-- image //文档通用图片
|        |-- image_en //英文文档图片
|        |-- image_zh //中文文档图片
|   |-- user //用户的图片
|   |-- home //首页的图片
|   |-- image  //模块公用图片
|-- docusaurus.config.js
```

## 3. 规范

### 3.1 目录命名规范

全部采用小写方式，以中下划线分隔，有复数结构时，要采用复数命名法，缩写不用复数：

* 正例： `scripts / styles / components / images / utils / layouts / demo_styles / demo-scripts / img / doc`
* 反例： `script / style / demoStyles / imgs / docs`

### 3.2 JavaScript 以及静态资源文件命名规范

全部采用小写方式， 以中划线分隔：

* 正例： `render-dom.js / signup.css / index.html / company-logo.png`
* 反例： `renderDom.js / UserManagement.html`

### 3.3 资源路径

图片资源统一放在 `static/{模块名}` 下，CSS 等样式文件放在 `src/css` 目录下。

### 3.4 页面内容修改

除了首页、团队、用户、Docs>All Version 模块页面外，其余页面都能通过底部的 'Edit this page' 按钮，直接跳转至对应的 GitHub 的资源修改页。

### 3.5 首页页面修改

* 对应页面 http://streampark.apache.org/zh-CN
* 源码位于 `src/pages/home`

```
├─home
│      languages.json 首页中英文的配置
│      index.less     首页样式
```

### 3.6 团队页面修改

* 对应页面 http://streampark.apache.org/zh-CN/team
* 源码位于 `src/pages/team`

```
├─team
│ languages.json
│ index.js
│ index.less
```

### 3.7  用户列表页面修改

* 对应页面 http://streampark.apache.org/zh-CN/user/
* 源码位于 `src/pages/user`

```
├─user
│ data.json
│ images.json
│ index.js
│ index.less
│ languages.json
```
