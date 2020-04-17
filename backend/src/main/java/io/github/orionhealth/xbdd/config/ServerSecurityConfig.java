package io.github.orionhealth.xbdd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import io.github.orionhealth.xbdd.auth.github.GithubAuthenticationProvider;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class ServerSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	GithubAuthenticationProvider githubAuthenticationProvider;

	@Override
	protected void configure(final AuthenticationManagerBuilder auth) {
		auth.authenticationProvider(this.githubAuthenticationProvider);
	}

}
