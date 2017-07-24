XBDD
====

Pre-requisites
--------------

* MongoDB 2.6. See https://docs.mongodb.com/v2.6
* Tomcat 7. See http://tomcat.apache.org/download-70.cgi

Installation
------------


Configuration
-------------

In the instructions that follow, `$CATALINE_BASE` refers to the Tomcat installation directory.


### SSL/TLS

The XBDD application requires a secure connection. This can be achieved through the Tomcat SSL connector.

Open `$CATALINA_BASE/conf/server.xml` and uncomment the following:

```xml
<Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true"
    maxThreads="150" scheme="https" secure="true" clientAuth="false"
    sslProtocol="TLS"
    keystoreFile="FILE_LOCATION"
    keystorePass="PASSWORD_HERE" />
```

Replace `FILE_LOCATION` with the location of your security certificate (you may need to [create one](http://java.dzone.com/articles/setting-ssl-tomcat-5-minutes) first) and `PASSWORD_HERE` with the related password.

### Enable Authentication

#### Local Authentication
To get started quickly without configuring enterprise authentication, it is possible to use Tomcat's default local UserDatabaseRealm with XBDD.

Configure a user by editing ``$CATALINA_BASE/conf/tomcat-users.xml` and adding a "user" element within the "tomcat-users" element, e.g.:

```xml
<user username="xbdd" password="xbdd" roles="xbdd"/>
```

#### LDAP
Configure the realm in the server.xml or context.xml with the JNDIRealm. See the [documentation](https://tomcat.apache.org/tomcat-7.0-doc/config/realm.html#JNDI_Directory_Realm_-_org.apache.catalina.realm.JNDIRealm) for details on the required fields. For example:

```	xml
<Realm className="org.apache.catalina.realm.LockOutRealm">
    <Realm allRolesMode="authOnly" className="org.apache.catalina.realm.JNDIRealm"
    connectionName="USERNAME" connectionPassword="PASSWORD" connectionURL="ldap://LDAP_HOST:389"
    referrals="follow" roleBase="ou=Groups,ou=Employees,dc=Example,dc=Internal" roleName="cn"
    roleSearch="(member={0})" roleSubtree="true" userBase="ou=Employees,dc=Example,dc=Internal"
    userRoleName="memberOf" userSearch="(sAMAccountName={0})" userSubtree="true"/>
</Realm>
```

### Configure Mongo Server Connection

By default XBDD will connect to mongo at the default address `localhost:27017`

To configure an alternative server or authentication add the following parameters to the tomcat `context.xml`

```xml
    <Parameter name="xbdd.mongo.hostname" value="<hostname>"/>
    <Parameter name="xbdd.mongo.port" value="<port>"/>
    <Parameter name="xbdd.mongo.username" value="<username>"/>
    <Parameter name="xbdd.mongo.password" value="<password>"/>
```

### A word on securing the connection to MongoDB
MongoDB provides user access on a per-DB basis. XBDD uses two databases, "bdd" and "grid". The user needs read/write permissions for both.

Running
-------

The xbdd application can be run as a standalone webapp in Tomcat or with Eclipse.
It can also be run from command line using an embedded Tomcat instance.

### Standalone

Create a war from an existing project and install in to tomcat webapps dir.

1. Download `xbdd.war` or build from source with `mvn clean package`
3. Copy `xbdd.war` into the `$CATALINA_BASE/webapps` folder of the Tomcat installation
4. Start Tomcat with `$CATALINA_BASE/bin/startup.sh`
5. Open <http://localhost:8443/xbdd>

### Embedded

Use maven to launch an embedded tomcat.

1. From eclipse or the command line run `mvn tomcat7:run`
2. Open <http://localhost:8443/xbdd>

XBDD - Printing
================

To enable PDF downloading for printing, PhantomJS must be installed.

Installation
------------

1. Download PhantomJS from <http://phantomjs.org/download.html>
2. Extract PhantomJS to a directory, e.g. ```/opt/phantomJS```
3. Add context variables for the PhantomJS install dir and the user to use for printing to ```context.xml```:

```xml  
    <Parameter name="xbdd.phantomjs.home" value="/opt/phantomjs/bin"/>
    <Parameter name="xbdd.phantomjs.username" value="xbdd-print"/>
    <Parameter name="xbdd.phantomjs.password" value="secret"/>
```
