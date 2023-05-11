---
title: How to Release
sidebar_position: 4
---

This tutorial describes in detail how to release Apache StreamPark.

## 1. Environmental requirements

This release process is operated in the Ubuntu OS, and the following tools are required:

- JDK 1.8+
- Apache Maven 3.x (this process uses 3.8.7)
- GnuPG 2.x
- Git
- SVN (apache uses svn to host project releases)

> Pay attention to setting environment variables `export GPG_TTY=$(tty)`

## 2. Preparing for release

> First summarize the account information to better understand the operation process, will be used many times later.
- apache id: `muchunjin (APACHE LDAP UserName)`
- apache passphrase: `APACHE LDAP Passphrase`
- apache email: `muchunjin@apache.org`
- gpg real name: `muchunjin (Any name can be used, here I set it to the same name as the apache id)`
- gpg key passphrase: `The password set when creating the gpg key, you need to remember this password`

### 2.1 Key generation

```shell
$ gpg --full-gen-key
gpg (GnuPG) 2.2.27; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
(1) RSA and RSA (default)
(2) DSA and Elgamal
(3) DSA (sign only)
(4) RSA (sign only)
(14) Existing key from card
Your selection? 1 # Please enter 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 4096 # Please enter 4096 here
Requested keysize is 4096 bits
Please specify how long the key should be valid.
0 = key does not expire
<n> = key expires in n days
<n>w = key expires in n weeks
<n>m = key expires in n months
<n>y = key expires in n years
Key is valid for? (0) 0 # Please enter 0
Key does not expire at all
Is this correct? (y/N) y # Please enter y here

GnuPG needs to construct a user ID to identify your key.

Real name: muchunjin # Please enter 'gpg real name'
Email address: muchunjin@apache.org # Please enter your apache email address here
Comment: for apache StreamPark release create at 20230501 # Please enter some comments here
You selected this USER-ID:
    "muchunjin (for apache StreamPark release create at 20230501) <muchunjin@apache.org>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O # Please enter O here
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

# At this time, a dialog box will pop up, asking you to enter the key for this gpg. 
# you need to remember that it will be used in subsequent steps.
┌─────────────────────────────────────────────────────┐
│ Please enter this passphrase to                     │
│ protect your new key                                │
│                                                     │
│ Passphrase: _______________________________________ │
│                                                     │
│     <OK>                    <Cancel>                │
└─────────────────────────────────────────────────────┘

# Here you need to re-enter the password in the previous step.
┌─────────────────────────────────────────────────────┐
│ Please re-enter this passphrase                     │
│                                                     │
│ Passphrase: _______________________________________ │
│                                                     │
│     <OK>                    <Cancel>                │
└─────────────────────────────────────────────────────┘
gpg: key ACFB69E705016886 marked as ultimately trusted
gpg: revocation certificate stored as '/root/.gnupg/openpgp-revocs.d/DC12398CCC33A5349EB9663DF9D970AB18C9EDF6.rev'
public and secret key created and signed.

pub   rsa4096 2023-05-01 [SC]
      85778A4CE4DD04B7E07813ABACFB69E705016886
uid                      muchunjin (for apache StreamPark release create at 20230501) <muchunjin@apache.org>
sub   rsa4096 2023-05-01 [E]
```

Keys can be viewed through the `gpg --list-signatures` command

### 2.2 Upload the generated key to the public server

```shell
$ gpg --keyid-format SHORT --list-keys
/root/.gnupg/pubring.kbx
------------------------
pub   rsa4096/05016886 2023-05-01 [SC]
      85778A4CE4DD04B7E07813ABACFB69E705016886
uid         [ultimate] muchunjin (for apache StreamPark release create at 20230501) <muchunjin@apache.org>
sub   rsa4096/0C5A4E1C 2023-05-01 [E]

# Send public key to keyserver via key id
$ gpg --keyserver keyserver.ubuntu.com --send-key 584EE68E
# Among them, keyserver.ubuntu.com is the selected keyserver, it is recommended to use this, because the Apache Nexus verification uses this keyserver
```

#### 2.3 Check if the key is created successfully

Verify whether it is synchronized to the public network, it will take about a minute to find out the answer, if not successful, you can upload and retry multiple times.

```shell
$ gpg --keyserver keyserver.ubuntu.com --recv-keys 05016886   # If the following content appears, it means success
gpg: key ACFB69E705016886: "muchunjin (for apache StreamPark release create at 20230501) <muchunjin@apache.org>" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1
```

Or enter https://keyserver.ubuntu.com/ address in the browser, enter the name of the key and click 'Search key'

![图片](https://github.com/apache/incubator-streampark/assets/19602424/b8fe193e-c137-42b0-a833-90a6d975f335)

If the query results are as follows, it means that the key is successfully created.

![图片](https://github.com/apache/incubator-streampark/assets/19602424/73ada3f2-2d2e-4b76-b25c-34a52db6a069)

#### 2.4 Add the gpg public key to the KEYS file of the Apache SVN project warehouse

- Apache StreamPark Dev分支 https://dist.apache.org/repos/dist/dev/incubator/streampark
- Apache StreamPark Release分支 https://dist.apache.org/repos/dist/release/incubator/streampark/

##### 2.4.1 Add public key to KEYS in dev branch

```shell
$ mkdir -p streampark_svn/dev
$ cd streampark_svn/dev

$ svn co https://dist.apache.org/repos/dist/dev/incubator/streampark
$ cd streampark_svn/dev/streampark

# Append the KEY you generated to the file KEYS, and check if it is added correctly
$ (gpg --list-sigs muchunjin@apache.org && gpg --export --armor muchunjin@apache.org) >> KEYS 

$ svn ci -m "add gpg key for muchunjin"
```

##### 2.4.2 Add public key to KEYS in release branch

```shell
$ mkdir -p streampark_svn/release
$ cd streampark_svn/release

$ svn co https://dist.apache.org/repos/dist/release/incubator/streampark/
$ cd streampark_svn/release/streampark

# Append the KEY you generated to the file KEYS, and check if it is added correctly
$ (gpg --list-sigs muchunjin@apache.org && gpg --export --armor muchunjin@apache.org) >> KEYS 

$ svn ci -m "add gpg key for muchunjin"
```

#### 2.5 Configure apache maven address and user password settings

- Generate master password
```shell
$ mvn --encrypt-master-password <apache password>
{EM+4/TYVDXYHRbkwjjAS3mE1RhRJXJUSG8aIO5RSxuHU26rKCjuS2vG+/wMjz9te}
```

- Create the file ${user.home}/.m2/settings-security.xml and configure the password created in the previous step

```shell
<settingsSecurity>
  <master>{EM+4/TYVDXYHRbkwjjAS3mE1RhRJXJUSG8aIO5RSxuHU26rKCjuS2vG+/wMjz9te}</master>
</settingsSecurity>
```

- Generate the final encrypted password and add it to the ~/.m2/settings.xml file

```shell
$ mvn --encrypt-password <apache passphrase>
{/ZLaH78TWboH5IRqNv9pgU4uamuqm9fCIbw0gRWT01c=}
```

> In the maven configuration file ~/.m2/settings.xml, add the following `server` item

```
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  
  <localRepository>/path/to/local/repo</localRepository>
  
  <servers>
    <server>
        <id>apache.snapshots.https</id>
        <!-- APACHE LDAP UserName --> 
        <username>muchunjin</username>
        <!-- APACHE LDAP password (Fill in the password you just created with the command `mvn --encrypt-password <apache passphrase>`) -->
        <password>{/ZLaH78TWboH5IRqNv9pgU4uamuqm9fCIbw0gRWT01c=}</password>
    </server>
    <server>
        <id>apache.releases.https</id>
        <!-- APACHE LDAP UserName --> 
        <username>muchunjin</username>
        <!-- APACHE LDAP password (Fill in the password you just created with the command `mvn --encrypt-password <apache passphrase>`) -->
        <password>{/ZLaH78TWboH5IRqNv9pgU4uamuqm9fCIbw0gRWT01c=}</password>
    </server>
  </servers>

  <profiles>
        <profile>
          <id>apache-release</id>
          <properties>
            <gpg.keyname>05016886</gpg.keyname>
            <!-- Use an agent: Prevents being asked for the password during the build -->
            <gpg.useagent>true</gpg.useagent>
            <gpg.passphrase>passphrase for your gpg key</gpg.passphrase>
          </properties>
        </profile>
  </profiles>
```

## 3. Prepare material package & release Apache Nexus

#### 3.1 Based on the dev branch, create a release-${release_version}-rcx branch, such as release-2.1.0-rc1

![图片](https://user-images.githubusercontent.com/19602424/236656362-1d346faa-6582-44eb-9722-8bb2de0eaa92.png)

#### 3.2 clone release branch to local

```shell
git clone -b release-2.1.0-rc1 -c core.autocrlf=false git@github.com:apache/incubator-streampark.git
```

#### 3.3 Publish the relevant JARs to Apache Nexus

##### 3.3.1 Release scala 2.11 to the Apache Nexus repository

```shell
mvn clean install \
-Pscala-2.11,shaded \
-DskipTests \
-Dcheckstyle.skip=true \
-Dmaven.javadoc.skip=true \
-pl 'streampark-common,streampark-flink,streampark-shaded' \
-pl '!streampark-console/streampark-console-service' \
-amd
```

```shell
mvn deploy \
-Pscala-2.11,apache-release \
-DskipTests \
-Dmaven.javadoc.skip=true \
-DretryFailedDeploymentCount=3
```

##### 3.3.2 Release scala 2.12 to the Apache Nexus repository

```shell
mvn clean install \
-Pscala-2.12,shaded \
-DskipTests \
-Dcheckstyle.skip=true \
-Dmaven.javadoc.skip=true \
-pl 'streampark-common,streampark-flink,streampark-shaded' \
-pl '!streampark-console/streampark-console-service' \
-amd
```

```shell
mvn deploy \
-Pscala-2.12,apache-release \
-DskipTests \
-Dmaven.javadoc.skip=true \
-DretryFailedDeploymentCount=3
```

##### 3.3.3 Release shaded to the Apache Nexus repository

```shell
mvn clean install \
-DskipTests \
-Dcheckstyle.skip=true \
-Dmaven.javadoc.skip=true
```

```shell
mvn deploy \
-Papache-release \
-DskipTests \
-Dmaven.javadoc.skip=true \
-DretryFailedDeploymentCount=3
```

##### 3.3.4 Check for successful publishing to the Apache Nexus repository

> Visit https://repository.apache.org/ and log in, if there are scala 2.11, scala 2.12, shaded packages, it means success.

![图片](https://user-images.githubusercontent.com/19602424/236657233-08d142eb-5f81-427b-a04d-9ab3172199c1.png)

#### 3.4 Compile the binary package

> Scala 2.11 compilation and packaging

```shell
mvn -Pscala-2.11,shaded,webapp,dist -DskipTests clean install
```

> Scala 2.12 compilation and packaging

```shell
mvn -Pscala-2.12,shaded,webapp,dist -DskipTests clean install
```

> Package the project source code

```shell
git archive \
--format=tar.gz \
--output="dist/apache-streampark-2.1.0-incubating-src.tar.gz" \
--prefix=apache-streampark-2.1.0-incubating-src/ \
release-2.1.0-rc1
```

> The following 3 files will be generated

```
apache-streampark-2.1.0-incubating-src.tar.gz
apache-streampark_2.11-2.1.0-incubating-bin.tar.gz
apache-streampark_2.12-2.1.0-incubating-bin.tar.gz
```

#### 3.4 Sign binary and source packages

```shell
cd dist

# sign
for i in *.tar.gz; do echo $i; gpg --armor --output $i.asc --detach-sig $i ; done

# SHA512
for i in *.tar.gz; do echo $i; sha512sum $i > $i.sha512 ; done
```

> The final file list is as follows

```
apache-streampark-2.1.0-incubating-src.tar.gz
apache-streampark-2.1.0-incubating-src.tar.gz.asc
apache-streampark-2.1.0-incubating-src.tar.gz.sha512
apache-streampark_2.11-2.1.0-incubating-bin.tar.gz
apache-streampark_2.11-2.1.0-incubating-bin.tar.gz.asc
apache-streampark_2.11-2.1.0-incubating-bin.tar.gz.sha512
apache-streampark_2.12-2.1.0-incubating-bin.tar.gz
apache-streampark_2.12-2.1.0-incubating-bin.tar.gz.asc
apache-streampark_2.12-2.1.0-incubating-bin.tar.gz.sha512
```

#### 3.5 Verify signature

```shell
$ cd dist

# Verify signature
$ for i in *.tar.gz; do echo $i; gpg --verify $i.asc $i ; done

apache-streampark-2.1.0-incubating-src.tar.gz
gpg: Signature made Tue May  2 12:16:35 2023 CST
gpg:                using RSA key 85778A4CE4DD04B7E07813ABACFB69E705016886
gpg: Good signature from "muchunjin (for apache StreamPark release create at 20230501) <muchunjin@apache.org>" [ultimate]
apache-streampark_2.11-2.1.0-incubating-bin.tar.gz
gpg: Signature made Tue May  2 12:16:36 2023 CST
gpg:                using RSA key 85778A4CE4DD04B7E07813ABACFB69E705016886
gpg: Good signature from "muchunjin (for apache StreamPark release create at 20230501) <muchunjin@apache.org>" [ultimate]
apache-streampark_2.12-2.1.0-incubating-bin.tar.gz
gpg: Signature made Tue May  2 12:16:37 2023 CST
gpg:                using RSA key 85778A4CE4DD04B7E07813ABACFB69E705016886
gpg: BAD signature from "muchunjin (for apache StreamPark release create at 20230501) <muchunjin@apache.org>" [ultimate]

# Verify SHA512
$ for i in *.tar.gz; do echo $i; sha512sum --check $i.sha512; done

apache-streampark-2.1.0-incubating-src.tar.gz
apache-streampark-2.1.0-incubating-src.tar.gz: OK
apache-streampark_2.11-2.1.0-incubating-bin.tar.gz
apache-streampark_2.11-2.1.0-incubating-bin.tar.gz: OK
apache-streampark_2.12-2.1.0-incubating-bin.tar.gz
apache-streampark_2.12-2.1.0-incubating-bin.tar.gz: OK
```

#### 3.6 Publish the dev directory of the Apache SVN warehouse of the material package

```shell
# Check out the dev directory of the Apache SVN warehouse to the streampark_svn_dev directory under dist in the root directory of the Apache StreamPark project
svn co https://dist.apache.org/repos/dist/dev/incubator/streampark dist/streampark_svn_dev

svn co --depth empty https://dist.apache.org/repos/dist/dev/incubator/streampark
```

#### 3.7 Publish the dev directory of the Apache SVN warehouse of the material package

Create a version number directory and name it in the form of ${release_version}-${RC_version}. RC_version starts from 1, that is, the candidate version starts from RC1. During the release process, there is a problem that causes the vote to fail. If it needs to be corrected, it needs to iterate the RC version , the RC version number needs to be +1. For example: Vote for version 2.1.0-RC1. If the vote passes without any problems, the RC1 version material will be released as the final version material. If there is a problem (when the streampark/incubator community votes, the voters will strictly check various release requirements and compliance issues) and need to be corrected, then re-initiate the vote after the correction, and the candidate version for the next vote is 2.1.0- RC2.

```shell
mkdir -p dist/streampark_svn_dev/2.1.0-RC1
cp -f dist/* dist/streampark_svn_dev/2.1.0-RC1
```

Commit to SVN

```shell
cd dist/streampark_svn_dev/

# 1.check svn status
svn status

# 2. add to svn
svn add 2.0.0-RC1

svn status

# 3. Submit to svn remote server
svn commit -m "release for StreamPark 2.1.0"
```

#### 3.8 Check Apache SVN Commit Results

> Visit the address https://dist.apache.org/repos/dist/dev/incubator/streampark/2.1.0-RC1/ in the browser

![图片](https://github.com/apache/incubator-streampark/assets/19602424/e4763537-af9f-4f2a-967d-912e6670b360)

## 3. Enter the community voting stage

#### 3.1 Initiate a Community Vote Email

#### 3.2 Initiate a Community Vote Email



