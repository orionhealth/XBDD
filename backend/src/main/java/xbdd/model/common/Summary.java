package xbdd.model.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import org.bson.codecs.pojo.annotations.BsonIgnore;

import java.util.List;

public class Summary {
	@SerializedName("_id")
	@JsonProperty("_id")
	String id;

	List<String> builds;
	CoordinatesDto coordinates;

	/**
	 * This is only used on the way out and is hydrated from the users collection. It's never saved here.
	 */
	@BsonIgnore
	private Boolean favourite;

	public String getId() {
		return id;
	}

	public void setId(final String id) {
		this.id = id;
	}

	public List<String> getBuilds() {
		return builds;
	}

	public void setBuilds(final List<String> builds) {
		this.builds = builds;
	}

	public CoordinatesDto getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(final CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}

	public Boolean getFavourite() {
		return favourite;
	}

	public void setFavourite(final Boolean favourite) {
		this.favourite = favourite;
	}
}
