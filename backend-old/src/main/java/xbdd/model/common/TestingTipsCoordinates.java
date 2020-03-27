package xbdd.model.common;

public class TestingTipsCoordinates extends CoordinatesDto {
	private String featureId;
	private String scenarioId;

	public String getFeatureId() {
		return featureId;
	}

	public void setFeatureId(final String featureId) {
		this.featureId = featureId;
	}

	public String getScenarioId() {
		return scenarioId;
	}

	public void setScenarioId(final String scenarioId) {
		this.scenarioId = scenarioId;
	}
}
