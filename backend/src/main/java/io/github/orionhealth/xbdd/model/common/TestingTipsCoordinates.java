package io.github.orionhealth.xbdd.model.common;

public class TestingTipsCoordinates extends CoordinatesDto {
	private String featureId;
	private String scenarioId;

	public String getFeatureId() {
		return this.featureId;
	}

	public void setFeatureId(final String featureId) {
		this.featureId = featureId;
	}

	public String getScenarioId() {
		return this.scenarioId;
	}

	public void setScenarioId(final String scenarioId) {
		this.scenarioId = scenarioId;
	}
}
