package io.github.orionhealth.xbdd.model.common;

import java.util.ArrayList;
import java.util.List;

public class TagAssignments {

	CoordinatesDto coordinates;
	List<SingleTagAssignment> tags;

	public CoordinatesDto getCoordinates() {
		return this.coordinates;
	}

	public void setCoordinates(final CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}

	public List<SingleTagAssignment> getTags() {
		if (this.tags == null) {
			this.tags = new ArrayList<SingleTagAssignment>();
		}
		return this.tags;
	}

	public void setTags(final List<SingleTagAssignment> tags) {
		this.tags = tags;
	}
}
