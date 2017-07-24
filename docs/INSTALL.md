XBDD
====

Pre-requisites
--------------

* MongoDB 2.6. See https://docs.mongodb.com/v2.6
* Tomcat 7. See http://tomcat.apache.org/download-70.cgi
* Maven 3+. See https://maven.apache.org/



Configuration
-------------

In the instructions that follow, `$CATALINE_BASE` refers to the Tomcat installation directory.

### SSL/TLS
The XBDD application requires a secure connection. This can be achieved through the Tomcat SSL connector.

You must first have configured a keystore. You can [create one](http://java.dzone.com/articles/setting-ssl-tomcat-5-minutes) or skip ahead if you have an existing one.

Open `$CATALINA_BASE/conf/server.xml` and uncomment the following:

```xml
<Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true"
    maxThreads="150" scheme="https" secure="true" clientAuth="false"
    sslProtocol="TLS"
    keystoreFile="FILE_LOCATION"
    keystorePass="PASSWORD_HERE" />
```

Replace `FILE_LOCATION` with the location of your security certificate and `PASSWORD_HERE` with the password.

### Authentication

#### Local Authentication
To get started quickly without configuring enterprise authentication, it is possible to use Tomcat's default local UserDatabaseRealm with XBDD.

Configure a user by editing `$CATALINA_BASE/conf/tomcat-users.xml` and adding a "user" element within the "tomcat-users" element, e.g.:

```xml
<user username="xbdd" password="xbdd" roles="xbdd"/>
```

#### LDAP
If you want to use LDAP, configure the realm in `$CATALINA_BASE/conf/server.xml` or `$CATALINA_BASE/conf/context.xml` with the JNDIRealm. See the [documentation](https://tomcat.apache.org/tomcat-7.0-doc/config/realm.html#JNDI_Directory_Realm_-_org.apache.catalina.realm.JNDIRealm) for details on the required fields. 

For example:
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

By default XBDD will connect to MongoDB at its default address of `localhost:27017`.

To configure an alternative server or to add authentication, add the following parameters to `$CATALINA_BASE/conf/context.xml`

```xml
    <Parameter name="xbdd.mongo.hostname" value="<hostname>"/>
    <Parameter name="xbdd.mongo.port" value="<port>"/>
    <Parameter name="xbdd.mongo.username" value="<username>"/>
    <Parameter name="xbdd.mongo.password" value="<password>"/>
```

### A word on securing the connection to MongoDB
MongoDB provides user access on a per-DB basis. XBDD uses two databases, "bdd" and "grid". The user needs read/write permissions for both.

Installation
------------

XBDD can be run as a standalone webapp in Tomcat (recommended) or via Eclipse.
It can also be run with an embedded Tomcat instance however the above configuration will not be applied if using this mode. This may be useful for development purposes though.

### Standalone mode

1. From the top level directory run `mvn clean package`.
2. Copy xbdd.war into the $CATALINA_BASE/webapps folder of your Tomcat installation
3. Start Tomcat with $CATALINA_BASE/bin/startup.sh
4. Open http://localhost:8443/xbdd

### Embedded mode

1. From the top level directory (or within an IDE) run `mvn tomcat7:run`
2. Open <http://localhost:8443/xbdd>

Printing
========

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
