/*
 * Copyright (c) Orchestral Developments Ltd and the Orion Health group of companies (2001 - 2020).
 *
 * This document is copyright. Except for the purpose of fair reviewing, no part
 * of this publication may be reproduced or transmitted in any form or by any
 * means, electronic or mechanical, including photocopying, recording, or any
 * information storage and retrieval system, without permission in writing from
 * the publisher. Infringers of copyright render themselves liable for
 * prosecution.
 */
package io.github.orionhealth.xbdd.auth;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import io.github.orionhealth.xbdd.model.auth.GithubToken;
import io.github.orionhealth.xbdd.model.common.User;

public class AuthenticatedByGithubToken extends AbstractAuthenticationToken {

	private static final long serialVersionUID = 1L;

	private final GithubToken token;

	private final User user;

	public AuthenticatedByGithubToken(final User user, final GithubToken token, final Collection<? extends GrantedAuthority> authorities) {
		super(authorities);
		this.user = user;
		this.token = token;
	}

	@Override
	public Object getCredentials() {
		return this.token;
	}

	@Override
	public Object getPrincipal() {
		return this.user;
	}

}
