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
package io.github.orionhealth.xbdd.auth.clients;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.github.orionhealth.xbdd.auth.exceptions.GithubAuthException;
import io.github.orionhealth.xbdd.model.auth.GithubProfile;
import io.github.orionhealth.xbdd.model.auth.GithubToken;
import io.github.orionhealth.xbdd.util.SerializerUtil;
import okhttp3.Credentials;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Request.Builder;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class GithubClient {

	private static final Logger LOGGER = LoggerFactory.getLogger(GithubClient.class);

	@Value("${github.client.id}")
	private String clientId;

	@Value("${github.client.secret}")
	private String clientSecret;

	public GithubToken getAuthToken(final String code) throws IOException {

		final OkHttpClient client = new OkHttpClient.Builder().build();

		final String credentials = Credentials.basic(this.clientId, this.clientSecret);

		LOGGER.info(String.format("Using code: %s", code));

		final HttpUrl url = HttpUrl.parse("https://github.com/login/oauth/access_token")
				.newBuilder()
				.addQueryParameter("code", code)
				.build();

		final Request request = new Builder()
				.url(url)
				.addHeader("Accept", "application/json")
				.addHeader("Authorization", credentials)
				.post(RequestBody.create(null, new byte[0]))
				.build();

		final Response response = client.newCall(request).execute();

		if (!response.isSuccessful()) {
			throw new GithubAuthException(String.format("Failed to get Github Auth Token with code: %s", code));
		}

		return SerializerUtil.deserialise(response.body().string(), GithubToken.class);
	}

	public GithubProfile getProfileData(final GithubToken token) throws IOException {
		final OkHttpClient client = new OkHttpClient.Builder().build();

		LOGGER.info(String.format("Using token: %s", token.getAccessToken()));

		final HttpUrl url = HttpUrl.parse("https://api.github.com/user")
				.newBuilder()
				.build();

		final Request request = new Builder()
				.url(url)
				.addHeader("Accept", "application/json")
				.header("Authorization", getTokenHeader(token))
				.get()
				.build();

		final Response response = client.newCall(request).execute();

		if (!response.isSuccessful()) {
			throw new GithubAuthException("Failed to get Github Profile");
		}

		return SerializerUtil.deserialise(response.body().string(), GithubProfile.class);
	}

	private String getTokenHeader(final GithubToken token) {
		return String.format("%s %s", token.getTokenType(), token.getAccessToken());
	}
}
