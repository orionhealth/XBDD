package io.github.orionhealth.xbdd.model.junit;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.github.orionhealth.xbdd.model.common.Tag;

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
		return this.line;
	}

	public void setLine(final Integer line) {
		this.line = line;
	}

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(final String description) {
		this.description = description;
	}

	public String getId() {
		return this.id;
	}

	public void setId(final String id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(final String type) {
		this.type = type;
	}

	public String getKeyword() {
		return this.keyword;
	}

	public void setKeyword(final String keyword) {
		this.keyword = keyword;
	}

	public List<JUnitStep> getSteps() {
		if (this.steps == null) {
			this.steps = new ArrayList<JUnitStep>();
		}
		return this.steps;
	}

	public void setSteps(final List<JUnitStep> steps) {
		this.steps = steps;
	}

	public List<Tag> getTags() {
		if (this.tags == null) {
			this.tags = new ArrayList<Tag>();
		}
		return this.tags;
	}

	public void setTags(final List<Tag> tags) {
		this.tags = tags;
	}
}
