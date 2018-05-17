# react-graphql-app-boilerplate

## Setup

### 1) Setup environment variables

Create `.env` file by renaming `.env.example`

### 2) Create Docker repository in AWS

Create using console & update `.circleci/config.yml` + `Dockerrun.aws.json`

### 3) Create Elastic Beanstalk (EB) application

Create using following command your EB application:

```bash
aws elasticbeanstalk create-application --application-name MyApp
```

and update your EB application name in:

```bash
[ROOT]/.elasticbeanstalk/config.yml
```

### 4) Create EB environment

Next, create the following file:

```bash
[ROOT]/.elasticbeanstalk/saved_configs/production-env-config.cfg.yml
```

with the following contents:

```yml
EnvironmentConfigurationMetadata:
  Description: Configuration created from the EB CLI using "eb config save".
  DateCreated: '1527025088000'
  DateModified: '1527025088000'
Platform:
  PlatformArn: arn:aws:elasticbeanstalk:eu-west-1::platform/Docker running on 64bit Amazon Linux/2.10.0
OptionSettings:
  aws:elasticbeanstalk:application:environment:
    JWT_SECRET: XXXXXXXXXXXXXXXXXXXXXXXXX
    JWT_EXPIRY: '0'
    DB_HOST: XXXXXXXXXXXXXXXXXXXXXXXXX
    DB_NAME: XXXXXXXXXXXXXXXXXXXXXXXXX
    DB_USER: XXXXXXXXXXXXXXXXXXXXXXXXX
    DB_PASS: XXXXXXXXXXXXXXXXXXXXXXXXX
    SMTP_HOST: XXXXXXXXXXXXXXXXXXXXXXXXX
    SMTP_PORT: XXXXXXXXXXXXXXXXXXXXXXXXX
    SMTP_USER: XXXXXXXXXXXXXXXXXXXXXXXXX
    SMTP_PASS: XXXXXXXXXXXXXXXXXXXXXXXXX
  aws:elasticbeanstalk:environment:proxy:
    ProxyServer: nginx
  aws:elasticbeanstalk:environment:
    ServiceRole: aws-elasticbeanstalk-service-role
    LoadBalancerType: application
  aws:ec2:vpc:
    Subnets: subnet-c4c8cda0
    ELBSubnets: subnet-c4c8cda0,subnet-71b4b507
  aws:elasticbeanstalk:healthreporting:system:
    SystemType: enhanced
  aws:elbv2:listener:443:
    ListenerEnabled: true
    SSLPolicy: ELBSecurityPolicy-2016-08
    SSLCertificateArns: arn:aws:acm:eu-west-1:130339930427:certificate/8a698bc0-d8ca-438a-8661-683898ee1150
    DefaultProcess: default
    Protocol: HTTPS
    Rules: ''
  AWSEBLoadBalancerSecurityGroup.aws:ec2:vpc:
    VPCId: vpc-35dbec51
  aws:autoscaling:launchconfiguration:
    SecurityGroups: sg-ecf36591
    IamInstanceProfile: aws-elasticbeanstalk-ec2-role
    InstanceType: t2.nano
EnvironmentTier:
  Type: Standard
  Name: WebServer
AWSConfigurationTemplateVersion: 1.1.0.0
```

and run:

```bash
eb create production --cfg production-env-config
```

## Auto-deployment

Only branch `master` will auto-deploy to AWS Beanstalk, while any other branch will only build & run tests.

### auto-deploying staging

Create staging branch in git, and update:

* `.elasticbeanstalk/config.yml`: change environment name to `staging`
* `.circleci/config.yml`: modify ECR docker image tags to: `latest-staging`
* `Dockerrun.aws.json`: modify docker image name to use tag: `latest-staging`
