---
id: 'local development and debugging'
title: 'Local Development and Debugging'
sidebar_position: 3
---

### Environment Requirements

- Maven 3.6+
- nodejs (version >= 16.14)
- npm 7.11.2 ( https://nodejs.org/en/ )
- pnpm (npm install -g pnpm)
- JDK 1.8+

### Clone the Source Code

```bash
git clone https://github.com/apache/incubator-streampark.git
```

### Build the Project

```bash
cd incubator-streampark/
./build.sh
```

![Build Success](/doc/image/streampark_build_success.png)

### Open the Project

Here, we are using `idea` to open the project.

```bash
open -a /Applications/IntelliJ\ IDEA\ CE.app/ ./
```

### Extract the Package

```bash
cd ./dist
tar -zxvf apache-streampark-2.2.0-SNAPSHOT-incubating-bin.tar.gz
```

### Copy the Path

Copy the path of the extracted directory, for example: `/Users/user/IdeaProjects/incubator-streampark/dist/apache-streampark_2.12-2.2.0-SNAPSHOT-incubating-bin`

### Start the Backend Service

Navigate to `streampark-console/streampark-console-service/src/main/java/org/apache/streampark/console/StreamParkConsoleBootstrap.java`

Modify the launch configuration

![Streampark Modify Run Configuration](/doc/image/streampark_modify_run_configuration.jpg)

Check `Add VM options`, and input the parameter `-Dapp.home=$path`, where `$path` is the path we just copied.

```bash
-Dapp.home=/Users/user/IdeaProjects/incubator-streampark/dist/apache-streampark_2.12-2.2.0-SNAPSHOT-incubating-bin
```

![Streampark Run Config](/doc/image/streampark_run_config.jpeg)

Then, start the backend service.

### Start the Frontend Service

```bash
cd ../streampark-console/streampark-console-webapp
pnpm serve
```

![Streampark Frontend Running](/doc/image/streampark_frontend_running.png)

Visit `http://localhost:10001/`, enter the username `admin` and the password `streampark`, then choose a `team` to proceed.

![Streampark Select Team](/doc/image/streampark_select_team.jpg)

### Demonstrate Debugging Code

Select the `Project` menu, and click on build.

![Streampark Project Build](/doc/image/streampark_project_build.png)

Debugging results:

![Streampark Debugging](/doc/image/streampark_debugging.png)