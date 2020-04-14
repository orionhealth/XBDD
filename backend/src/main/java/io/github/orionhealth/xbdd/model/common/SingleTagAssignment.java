package io.github.orionhealth.xbdd.model.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SingleTagAssignment {
	private String tag;

	private String userId;

	private String socialLogin;

	private LoginType loginType;

	private String display;

	public String getTag() {
		return this.tag;
	}

	public void setTag(final String tag) {
		this.tag = tag;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(final String userId) {
		this.userId = userId;
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

}
