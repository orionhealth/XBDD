# XBDD

## Pre-requisites

-   Maven 3+. See https://maven.apache.org/
-   Docker

## Pre-installation

In the instructions that follow, `$CATALINE_BASE` refers to the Tomcat installation directory and is available as a ENV variable in the Dockerfile.
As this solution is built using docker, the Dockerfile in the `package` directory will need to be modified for any of the following cusomisations.

### User Authentication

Currently LDAP, Github and Google authenticate is available through spring secutirty.

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
