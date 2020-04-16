package io.github.orionhealth.xbdd.model.common;

import java.util.List;

public class TagAssignments {

	CoordinatesDto coordinates;
	List<SingleTagAssignment> tags;
	
	public CoordinatesDto getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}
	public List<SingleTagAssignment> getTags() {
		return tags;
	}
	public void setTags(List<SingleTagAssignment> tags) {
		this.tags = tags;
	}
}
