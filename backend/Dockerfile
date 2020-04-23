FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/xbdd.jar
COPY ${JAR_FILE} xbdd.jar
ENTRYPOINT ["java","-jar","/xbdd.jar"]
EXPOSE 8080
EXPOSE 8443
