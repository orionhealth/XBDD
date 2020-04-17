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
