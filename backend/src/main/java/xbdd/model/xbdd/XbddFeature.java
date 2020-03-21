package xbdd.model.xbdd;

import com.fasterxml.jackson.annotation.JsonProperty;
import xbdd.model.simple.Tag;

import java.util.List;

public class XbddFeature {
	@JsonProperty("_id")
	private String effectiveId;

	@JsonProperty("id")
	private String originalId;

	private Integer line ;
	private String name;
	private String description;
	private String keyword;
	private String uri;
	private List<XbddScenario> elements;
	private XbddCoodinates coordinates;
	private String calculatedStatus;
	private String originalAutomatedStatus;
	private List<Tag> tags;

	public String getEffectiveId() {
		return effectiveId;
	}

	public void setEffectiveId(String effectiveId) {
		this.effectiveId = effectiveId;
	}

	public Integer getLine() {
		return line;
	}

	public void setLine(Integer line) {
		this.line = line;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getOriginalId() {
		return originalId;
	}

	public void setOriginalId(String originalId) {
		this.originalId = originalId;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public List<XbddScenario> getElements() {
		return elements;
	}

	public void setElements(List<XbddScenario> elements) {
		this.elements = elements;
	}

	public XbddCoodinates getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(XbddCoodinates coordinates) {
		this.coordinates = coordinates;
	}

	public String getCalculatedStatus() {
		return calculatedStatus;
	}

	public void setCalculatedStatus(String calculatedStatus) {
		this.calculatedStatus = calculatedStatus;
	}

	public String getOriginalAutomatedStatus() {
		return originalAutomatedStatus;
	}

	public void setOriginalAutomatedStatus(String originalAutomatedStatus) {
		this.originalAutomatedStatus = originalAutomatedStatus;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}
}
