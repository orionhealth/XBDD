# XBDD

## Pre-requisites

- Maven 3+
- Docker

# Quickstart

1. Run `mvn clean install package` in the top level directory
1. From the top level directory run `docker-compose build`
1. Next run `docker-compose up`
1. Xbdd will be available at http://localhost:8080

# Detailed build instructions

XBDD is laid out via three docker images:
- Backend
- Frontend
- Mongo

Each of these is their own top level directory and can be customised, rebuilt and re-deployed independently.

## Customising /backend


### Tomcat
In the instructions that follow, `$CATALINE_BASE` refers to the Tomcat installation directory and is available as a ENV variable in the Dockerfile.
As this solution is built using docker, the Dockerfile in the `package` directory will need to be modified for any of the following customisations.

## User Authentication

The following login options are available:
- LDAP
- Github
- Google

### LDAP authentication
TODO

Default user is test/test

### Github authentication
TODO

### Google authentication
TODO

## Customising /frontend
TODO

## Customising /mongo

By default XBDD will connect to MongoDB at its default address of `localhost:27017`.

To configure an alternative server or to change the admin user, modify `backend/src/main/resources/application.properties` with the required settings.

MongoDB provides user access on a per-DB basis. XBDD uses two databases, `bdd` and `grid`. The user needs read/write permissions for both.



