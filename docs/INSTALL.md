# XBDD

## Pre-requisites

-   Maven 3+. See https://maven.apache.org/
-   Docker

## Pre-installation

In the instructions that follow, `$CATALINE_BASE` refers to the Tomcat installation directory and is available as a ENV variable in the Dockerfile.
As this solution is built using docker, the Dockerfile in the `package` directory will need to be modified for any of the following cusomisations.

### HTTPS

### User Authentication

#### Local Authentication

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

### Configure Mongo Server Connection

By default XBDD will connect to MongoDB at its default address of `localhost:27017`.

To configure an alternative server or to change the admin user, modify `backen/src/main/resources/application.properties` with the required settings.

#### A word on securing the connection to MongoDB

MongoDB provides user access on a per-DB basis. XBDD uses two databases, `bdd` and `grid`. The user needs read/write permissions for both.

# Install and start XBDD

XBDD can be brought up via the docker-compose file or directly in eclipse/intelliJ.

### Docker Compose

1. Run `mvn clean install package` in the top level directory
1. From the top level directory run `docker-compose build`
1. Next run `docker-compose up`
1. Xbdd will be available at http://localhost:8080
