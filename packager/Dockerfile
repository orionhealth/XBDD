FROM tomcat:7.0.99-jdk8-openjdk
COPY ./target/xbdd.war ${CATALINA_HOME}/deploy/
COPY ./conf/context.xml ${CATALINA_HOME}/conf/context.xml
COPY ./conf/server.xml ${CATALINA_HOME}/conf/server.xml
COPY ./conf/Catalina/localhost/ROOT.xml ${CATALINA_HOME}/conf/Catalina/localhost/
EXPOSE 80
