package io.github.orionhealth.xbdd.auth.github;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import io.github.orionhealth.xbdd.model.common.User;

@Component
public class GithubAuthenticationProvider implements AuthenticationProvider {

	@Autowired
	GithubAuthService githubAuthService;

	@Override
	public Authentication authenticate(final Authentication authentication) throws AuthenticationException {
		final String authType = authentication.getName();

		if ("github".contentEquals(authType)) {
			final String githubCode = authentication.getCredentials().toString();
			try {
				final User user = this.githubAuthService.authenticateUser(githubCode);
				final Authentication rememberMe = new RememberMeAuthenticationToken(authType, user, Collections.emptyList());
				rememberMe.setAuthenticated(true);
				return rememberMe;
			} catch (final IOException e) {
				throw new GithubAuthException(String.format("Failed to authenticate with supplied code", githubCode));
			}
		}

		return null;
	}

	@Override
	public boolean supports(final Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}
