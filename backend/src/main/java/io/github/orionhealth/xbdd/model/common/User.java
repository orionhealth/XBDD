package io.github.orionhealth.xbdd.model.common;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

public class User {

	@SerializedName("user_id")
	@JsonProperty("user_id")
	private String userId;

	private String email;
	private String avatarUrl;
	private String name;
	private String socialLogin;
	private LoginType loginType;

	private Map<String, Boolean> favourites;

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(final String userId) {
		this.userId = userId;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(final String email) {
		this.email = email;
	}

	public String getAvatarUrl() {
		return this.avatarUrl;
	}

	public void setAvatarUrl(final String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
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

	public Map<String, Boolean> getFavourites() {
		return this.favourites;
	}

	public void setFavourites(final Map<String, Boolean> favourites) {
		this.favourites = favourites;
	}
}
