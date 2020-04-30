package io.github.orionhealth.xbdd.model.common;

import org.bson.codecs.pojo.annotations.BsonProperty;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;

public class TestingTips {
	TestingTipsCoordinates coordinates;

	@SerializedName("testing-tips")
	@JsonProperty("testing-tips")
	@BsonProperty("testing-tips")
	String testingTips;

	public TestingTipsCoordinates getCoordinates() {
		return this.coordinates;
	}

	public void setCoordinates(final TestingTipsCoordinates coordinates) {
		this.coordinates = coordinates;
	}

	public String getTestingTips() {
		return this.testingTips;
	}

	public void setTestingTips(final String testingTips) {
		this.testingTips = testingTips;
	}
}
