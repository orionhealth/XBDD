package io.github.orionhealth.xbdd.model.xbdd;

import java.util.ArrayList;
import java.util.List;

import org.bson.codecs.pojo.annotations.BsonIgnore;
import org.bson.codecs.pojo.annotations.BsonProperty;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

import io.github.orionhealth.xbdd.model.common.Tag;

public class XbddScenario {
	// The id field gets mapped in _id in the mongo driver so we need to bypass that.
	@SerializedName("id")
	@JsonProperty("id")
	@BsonProperty("id")
	private String originalId;

	private Integer line;
	private String name;
	private String description;
	private String type;
	private String keyword;
	private XbddScenario background;
	private List<XbddStep> steps;
	private List<Tag> tags;

	@BsonIgnore
	@SerializedName("testing-tips")
	@JsonProperty("testing-tips")
	private String testingTips;

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

	public String getOriginalId() {
		return this.originalId;
	}

	public void setOriginalId(final String originalId) {
		this.originalId = originalId;
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

	public XbddScenario getBackground() {
		return this.background;
	}

	public void setBackground(final XbddScenario background) {
		this.background = background;
	}

	public List<XbddStep> getSteps() {
		if (this.steps == null) {
			this.steps = new ArrayList<XbddStep>();
		}
		return this.steps;
	}

	public void setSteps(final List<XbddStep> steps) {
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

	public String getTestingTips() {
		return this.testingTips;
	}

	public void setTestingTips(final String testingTips) {
		this.testingTips = testingTips;
	}
}
