# XBDD

## Pre-requisites

-   Maven 3+. See https://maven.apache.org/
-   Docker

### Setup MongoDB for a dev environment

1. Build the docker mongo image with `docker build -t xbdd_mongo_dev mongo`
1. Start the docker container with `docker run -p=27017:27017 --name xbdd_mongo_dev -d xbdd_mongo_dev`

This will give you a docker container named xbdd_mongo_dev which is accessible at
[localhost:27017](http://localhost:27017)

### Running XBDD

1. Import the top level into either IntelliJ or Eclipse
1. Run `mvn clean install` in the top level directory
1. Create a run target that executes `tomcat7:run` in the backend directory (this starts the backend server)
1. In the `frontend` directory run `npm start`
1. Xbdd will be available at http://localhost:3000
