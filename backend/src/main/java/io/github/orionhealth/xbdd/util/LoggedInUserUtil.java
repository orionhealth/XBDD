package io.github.orionhealth.xbdd.util;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import io.github.orionhealth.xbdd.model.common.User;

public class LoggedInUserUtil {
	public static User getLoggedInUser() {
		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (!(authentication instanceof AnonymousAuthenticationToken)) {
			if (authentication.getPrincipal() instanceof User) {
				return (User) authentication.getPrincipal();
			}
		}

		// This shouldn't ever happen unless it is called in an unauthenticated context.
		throw new RuntimeException("Attempted to get logged in user but you must not be logged in.");
	}
}
