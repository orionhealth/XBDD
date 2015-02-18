/**
 * Copyright (C) 2015 Orion Health (Orchestral Development Ltd)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xbdd.util;

import java.util.ArrayList;
import java.util.List;

import xbdd.model.MergeFeature;
import xbdd.model.MergeScenario;
import xbdd.model.simple.Feature;
import xbdd.model.simple.Scenario;

/**
 * Represents a helper class for retrieving a merged feature
 */
public class MultipleBuildsFeatureMergeHelper {

	private final List<String> orderedBuildList;

	private final MultipleBuildMap<Feature> features = new MultipleBuildMap<Feature>();
	private final MultipleBuildMap<Scenario> scenarios = new MultipleBuildMap<Scenario>();

	private final MultipleBuildStatusMap scenarioStatusMap = new MultipleBuildStatusMap();

	private static final String MERGE = "{{MERGE}}";

	public MultipleBuildsFeatureMergeHelper(final List<String> orderedBuilds) {
		this.orderedBuildList = orderedBuilds;
	}

	/**
	 * @param feature Adds features that are to be merged
	 */
	public void addFeature(final Feature feature) {
		this.features.put(feature.getId(), feature.getCoordinates().getBuild(), feature);

		for (final Scenario scenario : feature.getScenarios()) {
			addScenario(scenario, feature);
		}
	}

	/**
	 * returns the mergeFeature with the given id using the features and scenarios that have been added. If the given feature has not been
	 * added then will return null
	 *
	 * @param featureId
	 * @return
	 */
	public MergeFeature getMergeFeature(final String featureId) {
		if (!this.orderedBuildList.isEmpty() && this.features.containsKey(featureId, getLatestBuild())) {
			final Feature feature = this.features.get(featureId, getLatestBuild());

			final List<String> featureStatuses = getFeatureStatuses(feature);

			final List<MergeScenario> scenarioList = getMergedScenarios(feature);

			final MergeFeature mergeFeature = new MergeFeature();
			mergeFeature.setId(feature.getId());
			mergeFeature.setName(feature.getName());
			mergeFeature.setStatuses(featureStatuses);
			mergeFeature.setUrl("reports/" + feature.getCoordinates().getProduct() + "/" + feature.getCoordinates().getVersionString()
					+ "/{{BUILD_NAME}}/" + feature.getId());
			mergeFeature.setScenarios(scenarioList);

			return mergeFeature;
		} else {
			return null;
		}
	}

	/**
	 * Adds scenarios that are to be built that belong to the given feature
	 *
	 * @param scenario
	 * @param feature
	 */
	private void addScenario(final Scenario scenario, final Feature feature) {
		final String scenarioId = getScenarioId(feature, scenario);
		this.scenarios.put(scenarioId, feature.getCoordinates().getBuild(), scenario);
	}

	private String getScenarioId(final Feature feature, final Scenario scenario) {
		return feature.getId() + ";" + scenario.getId();
	}

	private String getScenarioMergeStatus(final Scenario scenario, final Feature feature) {
		final String scenarioId = getScenarioId(feature, scenario);
		for (final String build : this.orderedBuildList) {
			if (this.scenarios.containsKey(scenarioId, build)) {
				final Statuses scenarioStatus = StatusHelper.getFinalScenarioStatus(this.scenarios.get(scenarioId, build), true);

				this.scenarioStatusMap.put(feature, scenario, build, scenarioStatus.getTextName());

				switch (scenarioStatus) {
					case FAILED:
						this.scenarioStatusMap.put(feature, scenario, MERGE, scenarioStatus.getTextName());
						return scenarioStatus.getTextName();
					case PASSED:
						this.scenarioStatusMap.put(feature, scenario, MERGE, scenarioStatus.getTextName());
						return scenarioStatus.getTextName();
					case UNKNOWN:
						this.scenarioStatusMap.put(feature, scenario, MERGE, scenarioStatus.getTextName());
						return scenarioStatus.getTextName();
					default:
						break;
				}
			}
		}
		this.scenarioStatusMap.put(feature, scenario, MERGE, this.scenarioStatusMap.get(feature, scenario, getLatestBuild()));
		final Scenario recentScenario = this.scenarios.get(scenarioId, getLatestBuild());
		return StatusHelper.getFinalScenarioStatus(recentScenario, true).getTextName();
	}

	private String getFeatureMergeStatus(final String featureId) {
		final List<String> mergeScenarioStatus = new ArrayList<String>();
		final Feature feature = this.features.get(featureId, getLatestBuild());
		for (final Scenario scenario : feature.getScenarios()) {
			mergeScenarioStatus.add(getScenarioMergeStatus(scenario, feature));
		}
		return StatusHelper.reduceStatuses(mergeScenarioStatus).getTextName();
	}

	private List<MergeScenario> getMergedScenarios(final Feature feature) {
		final List<MergeScenario> scenarioList = new ArrayList<MergeScenario>();

		for (final Scenario scenario : feature.getScenarios()) {
			final List<String> scenarioStatuses = new ArrayList<String>();
			scenarioStatuses.add(this.scenarioStatusMap.get(feature, scenario, MERGE));

			for (final String build : this.orderedBuildList) {
				if (this.scenarioStatusMap.containsKey(feature, scenario, build)) {
					scenarioStatuses.add(this.scenarioStatusMap.get(feature, scenario, build));
				} else {
					if (this.scenarios.containsKey(getScenarioId(feature, scenario), build)) {
						scenarioStatuses.add(StatusHelper.getFinalScenarioStatus(
								this.scenarios.get(getScenarioId(feature, scenario), build), true).getTextName());
					} else {
						scenarioStatuses.add(Statuses.DONT_EXIST.getTextName());
					}
				}
			}

			final MergeScenario mergeScenario = new MergeScenario();
			mergeScenario.setId(scenario.getId()).setName(scenario.getName()).setStatuses(scenarioStatuses);
			scenarioList.add(mergeScenario);
		}

		return scenarioList;
	}

	private List<String> getFeatureStatuses(final Feature feature) {
		final List<String> featureStatuses = new ArrayList<String>();

		featureStatuses.add(getFeatureMergeStatus(feature.getId()));
		for (final String build : this.orderedBuildList) {
			if (this.features.containsKey(feature.getId(), build)) {
				featureStatuses.add(this.features.get(feature.getId(), build).getCalculatedStatus());
			} else {
				featureStatuses.add(Statuses.DONT_EXIST.getTextName());
			}
		}

		return featureStatuses;
	}

	private String getLatestBuild() {
		return this.orderedBuildList.get(0);
	}
}