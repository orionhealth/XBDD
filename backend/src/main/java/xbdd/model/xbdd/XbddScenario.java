package xbdd.model.xbdd;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import org.bson.codecs.pojo.annotations.BsonProperty;
import xbdd.model.simple.Tag;

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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public XbddScenario getBackground() {
		return background;
	}

	public void setBackground(XbddScenario background) {
		this.background = background;
	}

	public List<XbddStep> getSteps() {
		return steps;
	}

	public void setSteps(List<XbddStep> steps) {
		this.steps = steps;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}
}
