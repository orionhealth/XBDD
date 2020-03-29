package io.github.orionhealth.xbdd.model.xbdd;

import java.util.List;

import io.github.orionhealth.xbdd.model.common.CoordinatesDto;

public class XbddFeature extends XbddFeatureSummary {
	private Integer line;
	private String description;
	private String keyword;

	// Need to keep this as elements as that's already in the db
	private List<XbddScenario> elements;

	private CoordinatesDto coordinates;

	public Integer getLine() {
		return line;
	}

	public void setLine(final Integer line) {
		this.line = line;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(final String description) {
		this.description = description;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(final String keyword) {
		this.keyword = keyword;
	}

	public List<XbddScenario> getElements() {
		return elements;
	}

	public void setElements(final List<XbddScenario> elements) {
		this.elements = elements;
	}

	public CoordinatesDto getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(final CoordinatesDto coordinates) {
		this.coordinates = coordinates;
	}
}
