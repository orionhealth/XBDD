package xbdd.model.common;

import java.util.HashMap;

public class Stats {
	String id;
	CoordinatesDto coordinates;
	HashMap<String, Integer> summary;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public CoordinatesDto getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}

	public HashMap<String, Integer> getSummary() {
		return summary;
	}

	public void setSummary(HashMap<String, Integer> summary) {
		this.summary = summary;
	}
}
