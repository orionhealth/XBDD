FROM tomcat:9-jdk8-openjdk
COPY ./target/xbdd.war ${CATALINA_HOME}/deploy/
COPY ./conf/Catalina/localhost/ROOT.xml ${CATALINA_HOME}/conf/Catalina/localhost/
EXPOSE 8080
EXPOSE 8443
