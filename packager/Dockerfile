FROM tomcat:7.0.99-jdk8-openjdk
COPY ./target/xbdd.war ${CATALINA_HOME}/webapps
COPY ./conf/context.xml ${CATALINA_HOME}/conf/context.xml
EXPOSE 8080