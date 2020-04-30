package io.github.orionhealth.xbdd.model.xbdd;

import java.util.ArrayList;
import java.util.List;

import org.bson.codecs.pojo.annotations.BsonProperty;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

import io.github.orionhealth.xbdd.model.common.Tag;

public class XbddFeatureSummary {
	// The id field is used in indexes in mongo and actually gets mapped to _id in the db.
	@SerializedName("_id")
	@JsonProperty("_id")
	private String id;

	@SerializedName("id")
	@JsonProperty("id")
	@BsonProperty("id")
	private String originalId;

	private String name;
	private String uri;

	private String calculatedStatus;
	private String originalAutomatedStatus;
	private List<Tag> tags;

	public String getId() {
		return this.id;
	}

	public void setId(final String id) {
		this.id = id;
	}

	public String getOriginalId() {
		return this.originalId;
	}

	public void setOriginalId(final String originalId) {
		this.originalId = originalId;
	}

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getUri() {
		return this.uri;
	}

	public void setUri(final String uri) {
		this.uri = uri;
	}

	public String getCalculatedStatus() {
		return this.calculatedStatus;
	}

	public void setCalculatedStatus(final String calculatedStatus) {
		this.calculatedStatus = calculatedStatus;
	}

	public String getOriginalAutomatedStatus() {
		return this.originalAutomatedStatus;
	}

	public void setOriginalAutomatedStatus(final String originalAutomatedStatus) {
		this.originalAutomatedStatus = originalAutomatedStatus;
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
