package io.github.orionhealth.xbdd.model.common;

import java.util.HashMap;
import java.util.Map;

public class Stats {
	String id;
	CoordinatesDto coordinates;
	Map<String, Integer> summary;

	public String getId() {
		return this.id;
	}

	public void setId(final String id) {
		this.id = id;
	}

	public CoordinatesDto getCoordinates() {
		return this.coordinates;
	}

	public void setCoordinates(final CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}

	public Map<String, Integer> getSummary() {
		if (this.summary == null) {
			this.summary = new HashMap<String, Integer>();
		}
		return this.summary;
	}

	public void setSummary(final HashMap<String, Integer> summary) {
		this.summary = summary;
	}
}
