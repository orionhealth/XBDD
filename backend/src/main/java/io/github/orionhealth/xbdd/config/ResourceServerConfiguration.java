package io.github.orionhealth.xbdd.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

@Configuration
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {

	@Override
	public void configure(final HttpSecurity http) throws Exception {
		http.authorizeRequests()
				.antMatchers("/rest/attachment/**")
				.permitAll()
				.antMatchers(HttpMethod.PUT, "/rest/reports/**")
				.permitAll()
				.antMatchers(HttpMethod.POST, "/rest/reports/**")
				.permitAll()
				.antMatchers("/rest/**")
				.authenticated();
	}

	@Override
	public void configure(final ResourceServerSecurityConfigurer resources) {
		resources.resourceId("rest");
	}
}
