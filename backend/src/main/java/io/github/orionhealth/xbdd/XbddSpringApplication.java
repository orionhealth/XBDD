package io.github.orionhealth.xbdd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;

@EnableAuthorizationServer
@SpringBootApplication
public class XbddSpringApplication {

	public static void main(final String[] args) {
		SpringApplication.run(XbddSpringApplication.class, args);
	}

}
