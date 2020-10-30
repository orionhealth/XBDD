# XBDD

## Pre-requisites

- Maven 3+. See https://maven.apache.org/
- Docker

### Setup MongoDB for a dev environment

1. From the base directory, build the Mongo docker image via `docker build -t xbdd_mongo_dev mongo`
1. Start the docker container with `docker run -p=27017:27017 --name xbdd_mongo_dev -d xbdd_mongo_dev`

This will give you a docker container named `xbdd_mongo_dev` which is accessible at
http://localhost:27017


### Registering a Github OAuth App

1. Go to https://github.com/settings/developers and register a new OAuth application
1. Call the `application xbdd-{your-github-user-id}`
1. For the homepage url, use `http://localhost:3000`
1. For the redirect url, use `http://localhost:3000/redirect`
1. In `frontend/.env.development`, add `REACT_APP_GITHUB_CLIENT_ID={your-app-client-id}`.
1. In `backend/src/main/resources/application-dev.yml` paste in your app's client id and secret into `github.client-id` and `github.client-secret` respectively.

### OPTIONAL - Setup SSL Certificates

It is possible to run the dev environment using https. If you need to do so, in `frontend/.env.development` set `REACT_APP_BACKEND_HOST=https://localhost:8443` and add the following block,

```
HTTPS=true
```

Then you need to enable the backend server to run SSL. To do that:

1. Enable the block beginning with `server` in the `application-dev.yml`;

Finally you need to set up certificates, to do so follow the instructions for both the frontend and backend below.

1. Follow the instructions in [backend/src/main/resources/certs/README.md](../backend/src/main/resources/certs/README.md)

### Running XBDD

#### Via Eclipse

1. Import the top level into Eclipse. Ensure the nested projects import as well.
1. Install Eclipse Spring Tools 4, this can be obtained through the the Eclipse Marketplace or downloaded [here](https://spring.io/tools).
1. Run `mvn clean install` in the top level directory
1. There is a Spring Boot Run Configuration called `Xbdd Run` that starts the backend.
1. In the `frontend` directory run `npm start`
1. Xbdd will be available at http://localhost:3000

#### Via the commandline

1. In the top level directory, run `mvn clean install`.
1. In `backend`, run `mvn spring-boot:run -Dspring-boot.run.profiles=dev`
1. In `frontend`, run `npm start`
1. Ensure your mongo environment is running via `http://localhost:27017`. If not, see the earlier step.
1. Xbdd will be available at `http://localhost:3000`

### Testing the Docker deploy version

This builds the docker compose deployment without mounting the mongo db to a volume, as we require a /opt/xbdd/volumes/ to exist. The only caveat is that data will not saved between deployments, to save data the volume will need to be mounted locally.
It is supposed to be used for testing changes to the deployment process.

To run do

1. `docker-compose -f docker-compose-dev.yml build`
2. `docker-compose -f docker-compose-dev.yml -d up`

To stop, `docker-compose -f docker-compose-dev.yml --remove-orphans down`
