package io.github.orionhealth.xbdd.model.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

import java.util.Map;

public class Users {

	@SerializedName("user_id")
	@JsonProperty("user_id")
	private String userId;

	private Map<String, Boolean> favourites;

	public String getUserId() {
		return userId;
	}

	public void setUserId(final String userId) {
		this.userId = userId;
	}

	public Map<String, Boolean> getFavourites() {
		return favourites;
	}

	public void setFavourites(final Map<String, Boolean> favourites) {
		this.favourites = favourites;
	}
}
