FROM tomcat:7.0.99-jdk8-openjdk
COPY ./target/xbdd.war ${CATALINA_HOME}/webapps
COPY ./conf/context.xml ${CATALINA_HOME}/conf/context.xml
COPY ./conf/server.xml ${CATALINA_HOME}/conf/server.xml
EXPOSE 8080