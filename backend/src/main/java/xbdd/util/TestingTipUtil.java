package xbdd.util;

import xbdd.model.common.TestingTips;
import xbdd.model.xbdd.XbddFeature;
import xbdd.model.xbdd.XbddScenario;

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
