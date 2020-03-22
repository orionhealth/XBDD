package xbdd.model.simple;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class FeatureSummary {
	@SerializedName("_id")
	@JsonProperty("_id")
	String id;

	List<String> builds;
	CoordinatesDto coordinates;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<String> getBuilds() {
		return builds;
	}

	public void setBuilds(List<String> builds) {
		this.builds = builds;
	}

	public CoordinatesDto getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}
}
