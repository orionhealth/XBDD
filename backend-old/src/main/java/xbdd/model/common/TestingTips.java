package xbdd.model.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import org.bson.codecs.pojo.annotations.BsonProperty;

public class TestingTips {
	TestingTipsCoordinates coordinates;

	@SerializedName("testing-tips")
	@JsonProperty("testing-tips")
	@BsonProperty("testing-tips")
	String testingTips;

	public TestingTipsCoordinates getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(final TestingTipsCoordinates coordinates) {
		this.coordinates = coordinates;
	}

	public String getTestingTips() {
		return testingTips;
	}

	public void setTestingTips(final String testingTips) {
		this.testingTips = testingTips;
	}
}
