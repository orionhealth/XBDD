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
package io.github.orionhealth.xbdd.model.auth;

import com.google.gson.annotations.SerializedName;

public class GithubToken {

	@SerializedName("access_token")
	private String accessToken;

	private String scope;

	@SerializedName("token_type")
	private String tokenType;

	public String getAccessToken() {
		return this.accessToken;
	}

	public void setAccessToken(final String accessToken) {
		this.accessToken = accessToken;
	}

	public String getScope() {
		return this.scope;
	}

	public void setScope(final String scope) {
		this.scope = scope;
	}

	public String getTokenType() {
		return this.tokenType;
	}

	public void setTokenType(final String tokenType) {
		this.tokenType = tokenType;
	}
}
