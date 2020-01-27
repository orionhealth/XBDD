docker stop xbdd
docker image rm xbdd
docker build -t xbdd .
docker network create xbdd-network
docker network connect xbdd-network mongo
docker run --rm --name xbdd -p 8080:8080 --network xbdd-network xbdd