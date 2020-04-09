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
package io.github.orionhealth.xbdd.auth.github;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.orionhealth.xbdd.model.auth.GithubProfile;
import io.github.orionhealth.xbdd.model.auth.GithubToken;
import io.github.orionhealth.xbdd.model.common.LoginType;
import io.github.orionhealth.xbdd.model.common.User;
import io.github.orionhealth.xbdd.persistence.UsersDao;

@Service
public class GithubAuthService {

	@Autowired
	UsersDao usersDao;

	@Autowired
	GithubClient githubAuthClient;

	public User authenticateUser(final String githubAuthCode) throws IOException {
		final GithubToken token = this.githubAuthClient.getAuthToken(githubAuthCode);
		final GithubProfile githubProfile = this.githubAuthClient.getProfileData(token);

		final User savedUser = this.usersDao.saveUser(mapGithubProfileToUser(githubProfile));

		return savedUser;
	}

	private User mapGithubProfileToUser(final GithubProfile githubProfile) {
		final User user = new User();

		user.setAvatarUrl(githubProfile.getAvatarUrl());
		user.setEmail(githubProfile.getEmail());
		user.setLoginType(LoginType.GITHUB);
		user.setName(githubProfile.getName());
		user.setSocialLogin(githubProfile.getLogin());
		user.setUserId(String.format("github-%s", githubProfile.getId()));

		return user;
	}
}
