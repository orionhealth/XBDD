package io.github.orionhealth.xbdd.model.common;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

public class User {

	@SerializedName("user_id")
	@JsonProperty("user_id")
	private String userId;

	private String socialId;
	private String socialLogin;
	private LoginType loginType;

	// Text display for the user, ideally a name or handle
	private String display;

	private Map<String, Boolean> favourites;

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(final String userId) {
		this.userId = userId;
	}

	public String getSocialId() {
		return this.socialId;
	}

	public void setSocialId(final String socialId) {
		this.socialId = socialId;
	}

	public String getSocialLogin() {
		return this.socialLogin;
	}

	public void setSocialLogin(final String socialLogin) {
		this.socialLogin = socialLogin;
	}

	public LoginType getLoginType() {
		return this.loginType;
	}

	public void setLoginType(final LoginType loginType) {
		this.loginType = loginType;
	}

	public String getDisplay() {
		return this.display;
	}

	public void setDisplay(final String display) {
		this.display = display;
	}

	public Map<String, Boolean> getFavourites() {
		return this.favourites;
	}

	public void setFavourites(final Map<String, Boolean> favourites) {
		this.favourites = favourites;
	}
}
