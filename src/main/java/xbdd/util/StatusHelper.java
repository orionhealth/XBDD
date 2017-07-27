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

import com.mongodb.BasicDBList;
import com.mongodb.DBObject;

public class StatusHelper {

	public static Statuses reduceStatuses(final List<String> allStatuses) {
		if (allStatuses.contains("failed")) {
			return Statuses.FAILED;
		}
		if (allStatuses.contains("undefined")) {
			return Statuses.UNDEFINED;
		}
		if (allStatuses.contains("skipped")) {
			return Statuses.SKIPPED;
		}
		if (allStatuses.contains("passed")) {
			return Statuses.PASSED;
		} else {
			return Statuses.UNKNOWN;
		}
	}

	// go through all the original (as-uploaded) steps in a scenario and reduce to a status for the scenario.
	public static String getOriginalScenarioStatusName(final DBObject scenario) {
		final List<String> allStatuses = new ArrayList<String>();
		final BasicDBList steps = (BasicDBList) scenario.get("steps");
		
		// we are not including manual steps so just include the automated statuses.
		if (steps != null) {
			for (int i = 0; i < steps.size(); i++) {
				final DBObject step = (DBObject) steps.get(i);
				final DBObject result = (DBObject) step.get("result");
				allStatuses.add((String) result.get("status"));
			}
		}
		// make sure to include the background steps too.
		if (scenario.get("background") != null) {
			final BasicDBList backgroundSteps = (BasicDBList) ((DBObject) scenario.get("background")).get("steps");
			if (backgroundSteps != null) {
				for (int i = 0; i < backgroundSteps.size(); i++) {
					final DBObject step = (DBObject) backgroundSteps.get(i);
					allStatuses.add((String) ((DBObject) step.get("result")).get("status"));
				}
			}
		}
			
		return reduceStatuses(allStatuses).getTextName();
	}
	
	// go through all the steps in a scenario and reduce to a status for the scenario.
	public static Statuses getScenarioStatus(final DBObject scenario) {
		final List<String> allStatuses = new ArrayList<String>();
		final BasicDBList steps = (BasicDBList) scenario.get("steps");
		
		// assume we have a bunch of manual step executions
		boolean hasManuallyExecutedSteps = false;
		final List<String> manualSteps = new ArrayList<String>();
		// go through each step creating an array as though they were manual
		if (steps != null) {
			for (int i = 0; i < steps.size(); i++) {
				final DBObject step = (DBObject) steps.get(i);
				final DBObject result = (DBObject) step.get("result");
				if (result != null) {
					if (result.get("manualStatus") != null) {
						manualSteps.add((String) result.get("manualStatus")); // if there is manual status include it
						hasManuallyExecutedSteps = true; // mark that there is a manual step executed
					} else {
						manualSteps.add("undefined"); // otherwise it is effectively unexecuted/undefined
					}
				}
			}
		}
		// do the same for the background steps
		if (scenario.get("background") != null) {// only if there are background steps.
			final BasicDBList backgroundSteps = (BasicDBList) ((DBObject) scenario.get("background")).get("steps");
			if (backgroundSteps != null) {
				for (int i = 0; i < backgroundSteps.size(); i++) {
					final DBObject backGroundStep = (DBObject) backgroundSteps.get(i);
					final DBObject result = (DBObject) backGroundStep.get("result");
					if (result != null) {
						final String manualStatus = (String) result.get("manualStatus");
						if (manualStatus != null) {
							manualSteps.add(manualStatus); // if there is manual status include it
							hasManuallyExecutedSteps = true; // mark that there is a manual step executed
						} else {
							manualSteps.add("undefined"); // otherwise it is effectively unexecuted/undefined
						}
					}
				}
			}
		}
		if (hasManuallyExecutedSteps) { // if any steps have been executed
			allStatuses.addAll(manualSteps);// then treat this scenario as though it has been manually executed.
		} else {
			if (steps != null) {
				for (int i = 0; i < steps.size(); i++) {
					final DBObject step = (DBObject) steps.get(i);
					final DBObject result = (DBObject) step.get("result");
					if (result == null) {
						throw new RuntimeException(
								"You are missing a 'result' element in your steps, perhaps you need to use a later version of cucumber to generate your report (>1.1.3)?'");
					}
					allStatuses.add((String) result.get("status"));// otherwise just include whatever automated step statuses exist.
				}
			}
			if (scenario.get("background") != null) {
				final BasicDBList backgroundSteps = (BasicDBList) ((DBObject) scenario.get("background")).get("steps");
				if (backgroundSteps != null) {
					for (int i = 0; i < backgroundSteps.size(); i++) {
						final DBObject step = (DBObject) backgroundSteps.get(i);
						final DBObject result = (DBObject) step.get("result");
						allStatuses.add((String) result.get("status"));// make sure to include the background steps too.
					}
				}
			}
		}

		return reduceStatuses(allStatuses);
	}

	private static boolean isScenarioKeyword(final String keyword) {
		if (keyword.equals("Scenario") || keyword.equals("Scenario Outline")) {
			return true;
		} else {
			return false;
		}
	}

	public static String getFeatureStatus(final DBObject feature) {
		final List<String> allStatuses = new ArrayList<String>();
		final BasicDBList featureElements = (BasicDBList) feature.get("elements");
		if (featureElements != null) {
			for (int i = 0; i < featureElements.size(); i++) {
				final DBObject scenario = (DBObject) featureElements.get(i);
				if (isScenarioKeyword((String) scenario.get("keyword"))) {
					allStatuses.add(getScenarioStatus(scenario).getTextName());
				}
			}
		}

		final String result = reduceStatuses(allStatuses).getTextName();
		return result;
	}
}
