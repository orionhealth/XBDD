package io.github.orionhealth.xbdd.model.junit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.github.orionhealth.xbdd.model.common.Tag;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JUnitElement {
	private Integer line;
	private String name;
	private String description;
	private String id;
	private String type;
	private String keyword;
	private List<JUnitStep> steps;
	private List<Tag> tags;

	public Integer getLine() {
		return line;
	}

	public void setLine(final Integer line) {
		this.line = line;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(final String description) {
		this.description = description;
	}

	public String getId() {
		return id;
	}

	public void setId(final String id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(final String type) {
		this.type = type;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(final String keyword) {
		this.keyword = keyword;
	}

	public List<JUnitStep> getSteps() {
		return steps;
	}

	public void setSteps(final List<JUnitStep> steps) {
		this.steps = steps;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(final List<Tag> tags) {
		this.tags = tags;
	}
}
