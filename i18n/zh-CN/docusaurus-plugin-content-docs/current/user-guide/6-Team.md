---
id: 'Team'
title: '用户、团队、角色以及成员管理'
sidebar_position: 6
---

## 用户管理

ADMIN 创建或修改用户时可以指定用户类型，用户类型有 ADMIN 和 USER 两种。

- ADMIN 表示系统管理员，即：StreamPark 的超级管理员，有 StreamPark 管理页面以及各个团队的所有权限。
- USER 表示平台的普通用户。创建 USER 只是创建账号的过程，默认普通用户在平台没有任何权限。创建 USER 后且系统管理员给 USER 在一些团队绑定角色后，USER 才会在相应团队有权限。

## 团队管理

为了方便管理公司内不同部门的作业，StreamPark 支持了团队管理。系统管理员可以在 StreamPark 上为不同部门创建不同的团队。

<img src="/doc/image/team/team_management.png"/><br></br>

用户可以点击平台右上角，选择有权限的团队。

<img src="/doc/image/team/change_team.png"/><br></br>

团队类似于工作空间的概念，当选择团队后平台只会展示当前团队的作业和项目。如果用户在多个团队有权限，切换到其他团队即可查看或操作相应团队的作业。

<img src="/doc/image/team/app_list.png"/><br></br>

## 角色管理

为了便于管理作业以及防止误操作，团队内部也需要区分管理员和普通开发者，所以 StreamPark 引入了角色管理。

当前，StreamPark 支持两者角色，分别是：team admin 和 developer。 team admin 拥有团队内的所有权限，developer 相比 team admin 而言，少了删除作业、添加 USER 到团队等权限。

<img src="/doc/image/team/role_management.png"/><br></br>

当然如果在使用过程中以上角色不能满足需求，也可以在角色管理页面添加更加的角色，且定义各个角色的权限。

## 成员管理

成员管理主要用于维护用户和团队的映射，即：每个团队有哪些用户，每个用户在当前团队分别是什么角色。

<img src="/doc/image/team/member_management.png"/><br></br>

一个团队可以拥有多个用户，一个用户也可以属于多个团队，且在不同的团队可以是不同的角色。

例如：user_a 在 team1 和 team2 有权限，在 team1 是 developer，在 team2 是 team admin。则：user_a 在 team2 是团队管理员，他在 team2
有所有权限，包括：开发作业，运维作业，删除作业以及添加其他用户到 team2。user_a 在 team1 是一个普通开发者，只有权限开发和运维作业。

注：成员管理页面只能查看当前团队的成员，如果需要查看或修改其他团队的成员映射，请先切换到其他团队。
