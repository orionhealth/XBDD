package io.github.orionhealth.xbdd.model.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Tag {
	Integer line;
	String name;

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
}
