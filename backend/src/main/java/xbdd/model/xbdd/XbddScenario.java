package xbdd.model.xbdd;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import org.bson.codecs.pojo.annotations.BsonIgnore;
import org.bson.codecs.pojo.annotations.BsonProperty;
import xbdd.model.common.Tag;

import java.util.List;

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

	public String getOriginalId() {
		return originalId;
	}

	public void setOriginalId(final String originalId) {
		this.originalId = originalId;
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

	public XbddScenario getBackground() {
		return background;
	}

	public void setBackground(final XbddScenario background) {
		this.background = background;
	}

	public List<XbddStep> getSteps() {
		return steps;
	}

	public void setSteps(final List<XbddStep> steps) {
		this.steps = steps;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(final List<Tag> tags) {
		this.tags = tags;
	}

	public String getTestingTips() {
		return testingTips;
	}

	public void setTestingTips(final String testingTips) {
		this.testingTips = testingTips;
	}
}
