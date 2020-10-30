package io.github.orionhealth.xbdd.model.common;

import java.util.ArrayList;
import java.util.List;

import org.bson.codecs.pojo.annotations.BsonIgnore;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Summary {
	@SerializedName("_id")
	@JsonProperty("_id")
	String id;

	List<Build> builds;
	CoordinatesDto coordinates;

	/**
	 * This is only used on the way out and is hydrated from the users collection. It's never saved here.
	 */
	@BsonIgnore
	private Boolean favourite;

	public String getId() {
		return this.id;
	}

	public void setId(final String id) {
		this.id = id;
	}

	public List<Build> getBuilds() {
		if (this.builds == null) {
			this.builds = new ArrayList<Build>();
		}
		return this.builds;
	}

	public void setBuilds(final List<Build> builds) {
		this.builds = builds;
	}

	public CoordinatesDto getCoordinates() {
		return this.coordinates;
	}

	public void setCoordinates(final CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}

	public Boolean getFavourite() {
		return this.favourite;
	}

	public void setFavourite(final Boolean favourite) {
		this.favourite = favourite;
	}

}
