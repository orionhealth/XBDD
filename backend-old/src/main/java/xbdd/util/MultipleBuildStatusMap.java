/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xbdd.util;

import xbdd.model.simple.Feature;
import xbdd.model.simple.Scenario;

import java.util.HashMap;
import java.util.Map;

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
