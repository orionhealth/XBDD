package io.github.orionhealth.xbdd.model.junit;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.github.orionhealth.xbdd.model.common.Tag;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JUnitFeature {
	private Integer line;
	private String name;
	private String description;
	private String id;
	private String keyword;
	private String uri;
	private List<JUnitElement> elements;
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

	public String getKeyword() {
		return this.keyword;
	}

	public void setKeyword(final String keyword) {
		this.keyword = keyword;
	}

	public String getUri() {
		return this.uri;
	}

	public void setUri(final String uri) {
		this.uri = uri;
	}

	public List<JUnitElement> getElements() {
		if (this.elements == null) {
			this.elements = new ArrayList<JUnitElement>();
		}
		return this.elements;
	}

	public void setElements(final List<JUnitElement> elements) {
		this.elements = elements;
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
