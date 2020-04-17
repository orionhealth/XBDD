package io.github.orionhealth.xbdd.util;

import java.util.HashMap;
import java.util.Map;

import io.github.orionhealth.xbdd.model.simple.Feature;
import io.github.orionhealth.xbdd.model.simple.Scenario;

/**
 * Represents a map of the status of a uniquely identified scenario over multiple builds
 */
public class MultipleBuildStatusMap {

	private final Map<String, String> map = new HashMap<>();

	public void put(final Feature feature, final Scenario scenario, final String build, final String status) {
		this.map.put(feature.getId() + scenario.getId() + build, status);
	}

	public String get(final Feature feature, final Scenario scenario, final String build) {
		return this.map.get(feature.getId() + scenario.getId() + build);
	}

	public boolean containsKey(final Feature feature, final Scenario scenario, final String build) {
		return this.map.containsKey(feature.getId() + scenario.getId() + build);
	}
}
