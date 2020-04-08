# XBDD

## Pre-requisites

- Maven 3+. See https://maven.apache.org/
- Docker

### Setup MongoDB for a dev environment

1. Build the docker mongo image with `docker build -t xbdd_mongo_dev mongo`
1. Start the docker container with `docker run -p=27017:27017 --name xbdd_mongo_dev -d xbdd_mongo_dev`

This will give you a docker container named xbdd_mongo_dev which is accessible at
http://localhost:27017

### Registering a Github OAuth App

1. Go to https://github.com/settings/developers and register a new OAuth application
1. Call the application xbdd-{your-github-user-id}
1. For the homepage url use http://localhost:19080
1. For the redirect url use http://localhost:19080/redirect
1. In frontend/.env.development paste in your app's client id into REACT_APP_GITHUB_CLIENT_ID.
1. In backend/src/main/resources/application-dev.yml paste in your app's client id and secret into github.client.id and github.client.secret respectively.

### Setup SSL Certificates

1. Follow the instructions in [frontend/certs/README.md](../frontend/certs/README.md)
1. Follow the instructions in [backend/src/main/resources/certs/README.md](../backend/src/main/resources/certs/README.md)

### Running XBDD

1. Import the top level into Eclipse (IntelliJ Community doesn't have the web server capabilities to run this properly).
1. Install Eclipse Spring Tools 4, this can be obtained through the the Eclipse Marketplace or downloaded [here](https://spring.io/tools).
1. Run `mvn clean install` in the top level directory
1. There is a Spring Boot Run Configuration called `Xbdd Run` that starts the backend.
1. In the `frontend` directory run `npm start`
1. Xbdd will be available at http://localhost:3000

### Testing the Docker deploy version

This builds the docker compose deployment without mounting the mongo db to a volume, as we require a /opt/xbdd/volumes/ to exist. The only caveat is that data will not saved between deployments, to save data the volume will need to be mounted locally.
It is supposed to be used for testing changes to the deployment process.

To run do

1. `docker-compose -f docker-compose-dev.yml build`
2. `docker-compose -f docker-compose-dev.yml -d up`

To stop, `docker-compose -f docker-compose-dev.yml --remove-orphans down`
