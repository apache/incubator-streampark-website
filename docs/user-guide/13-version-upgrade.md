---
id: 'version-upgrade'
title: 'Version Upgrade Guide'
sidebar_position: 13
---

### Pre-Upgrade Preparation

Before starting the upgrade process, please ensure the following preparatory steps are completed to ensure a smooth transition.

- **Database Backup**: An essential step to ensure you have a complete backup of your database. This allows for recovery to the pre-upgrade state if any problems are encountered during the upgrade.
- **Check Version Compatibility**: Confirm your current version number and ensure that the upgrade path is compatible with your version. This guide is applicable for upgrades starting from version `1.2.3`.
- **Verify System Requirements**: Ensure that your server meets the system requirements for the new version.

### Locating Upgrade Scripts

Upgrade scripts are located in the `script/upgrade` directory. You will need to choose the correct script based on your current version and the target version for the upgrade.

```plaintext
script
└── upgrade
      ├── mysql
      |     ├── 1.2.3.sql
      |     ├── 2.0.0.sql
      |     ├── 2.1.0.sql
      |     └── 2.1.2.sql
      └── pgsql
            ├── 2.1.0.sql
            ├── 2.1.2.sql
            └── 2.1.3.sql
```

### Executing Upgrade Scripts

Connect to your database using a database management tool (such as MySQL Workbench, pgAdmin, JetBrains DataGrip) and execute the upgrade scripts sequentially.

####

#### Example: Upgrading from 2.0.0 to 2.1.2

1. **Upgrade to 2.1.0**:

```bash
# Use command line or your database management tool to execute the 2.1.0.sql script
mysql -h 127.0.0.1 -P 3306 -u root --password=streampark streampark < ./script/upgrade/mysql/2.1.0.sql
```

2. **Upgrade to 2.1.2**:

```bash
# Next, execute the 2.1.2.sql script to complete the upgrade
mysql -h 127.0.0.1 -P 3306 -u root --password=streampark streampark < ./script/upgrade/mysql/2.1.2.sql
```

### Verifying the Upgrade

After completing the upgrade, log into your application and check that everything is running normally. You can review the application logs or verify that new version features are working as expected.

### Troubleshooting

If you encounter any issues during the upgrade process:

1. **Refer to Official Documentation**: Look for possible error messages and solutions.
2. **Restore Backup**: If the upgrade fails, restore your database to its pre-upgrade state using the backup created earlier.
3. **Seek Help**: If the problem persists, seek assistance through Apache StreamPark's official forum or community.

### Next Steps

After the upgrade is complete, you may need to adjust and optimize your application's configuration and performance settings based on the features and improvements of the new version.
