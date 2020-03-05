# XBDD

## Pre-requisites

-   Maven 3+. See https://maven.apache.org/
-   Docker

## Pre-installation

In the instructions that follow, `$CATALINE_BASE` refers to the Tomcat installation directory and is available as a ENV variable in the Dockerfile.
As this solution is built using docker, the Dockerfile in the `package` directory will need to be modified for any of the following cusomisations.

### SSL/TLS

The XBDD application requires a secure connection. This can be setup using the Tomcat SSL connector.

You must first have configured a keystore. You can [create one](http://java.dzone.com/articles/setting-ssl-tomcat-5-minutes) or skip ahead if you have an existing one.

Open `$CATALINA_BASE/conf/server.xml` and uncomment the 8443 connector block. Add the `keystoreFile` and `keystorePass` attributes, e.g.:

```xml
<Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true"
    maxThreads="150" scheme="https" secure="true" clientAuth="false"
    sslProtocol="TLS"
    keystoreFile="FILE_LOCATION"
    keystorePass="PASSWORD_HERE" />
```

Replace `FILE_LOCATION` with the location of your security certificate and `PASSWORD_HERE` with the password.

### User Authentication

#### Local Authentication

To get started quickly without configuring enterprise authentication, it is possible to use Tomcat's default local UserDatabaseRealm with XBDD.

Configure a user by editing `$CATALINA_BASE/conf/tomcat-users.xml` and adding a `user` element within the `tomcat-users` element, e.g.:

```xml
<user username="xbdd" password="xbdd"/>
```

To make a user an administrator, in `$CATALINA_BASE/conf/tomcat-users.xml` first add the admin role:

```xml
<role rolename="admin"/>
```

Then assign a user that role, e.g.:

```xml
<user username="xbdd-admin" password="something" roles="admin" />
```

#### LDAP

If you want to use LDAP, configure the realm in `$CATALINA_BASE/conf/server.xml` or `$CATALINA_BASE/conf/context.xml` with the JNDIRealm. See the [documentation](https://tomcat.apache.org/tomcat-7.0-doc/config/realm.html#JNDI_Directory_Realm_-_org.apache.catalina.realm.JNDIRealm) for details on the required fields.

For example:

```xml
<Realm className="org.apache.catalina.realm.LockOutRealm">
    <Realm allRolesMode="authOnly" className="org.apache.catalina.realm.JNDIRealm"
    connectionName="USERNAME" connectionPassword="PASSWORD" connectionURL="ldap://LDAP_HOST:389"
    referrals="follow" roleBase="ou=Groups,ou=Employees,dc=Example,dc=Internal" roleName="cn"
    roleSearch="(member={0})" roleSubtree="true" userBase="ou=Employees,dc=Example,dc=Internal"
    userRoleName="memberOf" userSearch="(sAMAccountName={0})" userSubtree="true"/>
</Realm>
```

### Setup MongoDB for a dev environment

1. Build the docker mongo image with `docker build -t xbdd_mongo_dev mongo`
1. Start the docker container with `docker run -p=27017:27017 --name xbdd_mongo_dev -d xbdd_mongo_dev`

This will give you a docker container named xbdd_mongo_dev which is accessible at
[localhost:27017](http://localhost:27017)

### Configure Mongo Server Connection

By default XBDD will connect to MongoDB at its default address of `localhost:27017`.

To configure an alternative server or to add authentication, add the following parameters to `$CATALINA_BASE/conf/context.xml`

If you are deploying a full solution via the docker-compose setup, modify the `package/conf/context.xml` to your needs.

```xml
    <Parameter name="xbdd.mongo.hostname" value="<hostname>"/>
    <Parameter name="xbdd.mongo.port" value="<port>"/>
    <Parameter name="xbdd.mongo.username" value="<username>"/>
    <Parameter name="xbdd.mongo.password" value="<password>"/>
```

#### A word on securing the connection to MongoDB

MongoDB provides user access on a per-DB basis. XBDD uses two databases, `bdd` and `grid`. The user needs read/write permissions for both.

# Install and start XBDD

XBDD can be brought up via the docker-compose file or directly in eclipse/intelliJ.

### Docker Compose

1. Run `mvn clean install package` in the top level directory
1. From the top level directory run `docker-compose build`
1. Next run `docker-compose up`
1. Xbdd will be available at http://localhost:8080

### In IDE's

1. Import the top level into either IntelliJ or Eclipse
1. Run `mvn clean install` in the top level directory
1. Create a run target that executes `tomcat7:run` in the backend directory (this starts the backend server)
1. In the `frontend` directory run `npm start`
1. Xbdd will be available at http://localhost:3000
