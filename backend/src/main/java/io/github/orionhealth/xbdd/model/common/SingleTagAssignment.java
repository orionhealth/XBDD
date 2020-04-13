package io.github.orionhealth.xbdd.model.common;

public class SingleTagAssignment {
	private String tag;

	private String userId;

	private String userName;

	private String avatarUrl;

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

	public String getUserName() {
		return this.userName;
	}

	public void setUserName(final String userName) {
		this.userName = userName;
	}

	public String getAvatarUrl() {
		return this.avatarUrl;
	}

	public void setAvatarUrl(final String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}

}
