package io.github.orionhealth.xbdd.util;

import io.github.orionhealth.xbdd.model.common.TestingTips;
import io.github.orionhealth.xbdd.model.xbdd.XbddFeature;
import io.github.orionhealth.xbdd.model.xbdd.XbddScenario;

public class TestingTipUtil {

	private static final String KEY_FORMAT = "%s&&%s";

	private TestingTipUtil() {
	}

	public static String getMapKey(final TestingTips testingTips) {
		return String.format(KEY_FORMAT, testingTips.getCoordinates().getFeatureId(), testingTips.getCoordinates().getScenarioId());
	}

	public static String getMapKey(final XbddFeature feature, final XbddScenario scenario) {
		return String.format(KEY_FORMAT, feature.getOriginalId(), scenario.getOriginalId());
	}
}
