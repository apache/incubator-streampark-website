---
id: 'Team'
title: 'User, team, role and member management'
sidebar_position: 6
---

## User Management

ADMIN can select the user type when creating or modifying a user. There are two user types: ADMIN and USER.

- ADMIN means the system administrator, that is: the super administrator of StreamPark, who has all the permissions of
  the StreamPark management page and each team.
- USER means a normal user of the platform. Creating a USER is just creating an account. By default, users don't have
  any permissions on the platform. After account is created and the ADMIN binds it to some teams, USER will have
  permissions in the corresponding teams.

## Team Management

In order to facilitate the management of applications in different departments within the company, StreamPark supports
team management. ADMIN can create different teams for different departments on StreamPark.

<img src="/doc/image/team/team_management.png"/><br></br>

Users can click on the team at the top right of the platform to select a team with permission.

<img src="/doc/image/team/change_team.png"/><br></br>

A team is similar to the concept of a workspace. When a team is selected, the platform will only display the
applications and projects of the current team. If the user has permissions in multiple teams, switching to another team
can view or operate the applications of the corresponding team.

<img src="/doc/image/team/app_list.png"/><br></br>

## Role Management

In order to facilitate application management and prevent misoperation, the team also needs to distinguish between
administrator and developer, so StreamPark introduces role management.

Currently, StreamPark supports two roles: team admin and developer. The team admin has all the permissions in the team.
Compared with the team admin, the developer has fewer permissions to delete applications and add USER to the team.

<img src="/doc/image/team/role_management.png"/><br></br>

If the above roles cannot meet the requirements during use, you can also add more roles on the role management page, and
define the permissions of each role.

## Member Management

Member management is used to maintain the mapping between users and teams, that is: which users are in each team, and
what role is each user in the current team.

<img src="/doc/image/team/member_management.png"/><br></br>

A team can have multiple users, a user can also belong to multiple teams, and can have different roles in different
teams.

For example: user_a has permissions in team1 and team2, he is developer in team1, and he is team admin in team2. That
is, user_a is the team administrator in team2, and he has all permissions in team2, including: develop, maintain, and
delete applications and add other users to team2. user_a is a developer in team1, and only has permission to develop and
maintain applications.

Note: The member management page can only view the members of the current team. If you need to view or modify the member
mapping of other teams, please switch to other teams first.
