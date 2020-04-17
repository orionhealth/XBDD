package io.github.orionhealth.xbdd.util;

import com.mongodb.BasicDBList;
import com.mongodb.DBObject;

import java.util.ArrayList;
import java.util.List;

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

	// go through all the steps in a scenario and reduce to a status for the scenario.
	public static Statuses getFinalScenarioStatus(final DBObject scenario, final boolean includeManualResults) {
		final List<String> allStatuses = new ArrayList<>();
		final BasicDBList steps = (BasicDBList) scenario.get("steps");
		if (includeManualResults) { // if we have got a bunch of manual step executions
			boolean hasManuallyExecutedSteps = false;
			final List<String> manualSteps = new ArrayList<>();
			// go through each step creating an array as though they were manual
			if (steps != null) {
				for (Object o : steps) {
					final DBObject step = (DBObject) o;
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
					for (Object backgroundStep : backgroundSteps) {
						final DBObject backGroundStep = (DBObject) backgroundStep;
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
					for (Object o : steps) {
						final DBObject step = (DBObject) o;
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
						for (Object backgroundStep : backgroundSteps) {
							final DBObject step = (DBObject) backgroundStep;
							final DBObject result = (DBObject) step.get("result");
							allStatuses.add((String) result.get("status"));// make sure to include the background steps too.
						}
					}
				}
			}
		} else { // if we are not including manual steps then just include the automated statuses.
			if (steps != null) {
				for (Object o : steps) {
					final DBObject step = (DBObject) o;
					final DBObject result = (DBObject) step.get("result");
					allStatuses.add((String) result.get("status"));
				}
			}
			if (scenario.get("background") != null) {
				final BasicDBList backgroundSteps = (BasicDBList) ((DBObject) scenario.get("background")).get("steps");
				if (backgroundSteps != null) {
					for (Object backgroundStep : backgroundSteps) {
						final DBObject step = (DBObject) backgroundStep;
						allStatuses.add((String) ((DBObject) step.get("result")).get("status"));// make sure to include the background steps
						// too.
					}
				}
			}
		}

		return reduceStatuses(allStatuses);
	}

	private static String getScenarioStatus(final DBObject scenario) {
		return getFinalScenarioStatus(scenario, true).getTextName();
	}

	private static boolean isScenarioKeyword(final String keyword) {
		return keyword.equals("Scenario") || keyword.equals("Scenario Outline");
	}

	public static String getFeatureStatus(final DBObject feature) {
		final List<String> allStatuses = new ArrayList<>();
		final BasicDBList featureElements = (BasicDBList) feature.get("elements");
		if (featureElements != null) {
			for (Object featureElement : featureElements) {
				final DBObject scenario = (DBObject) featureElement;
				if (isScenarioKeyword((String) scenario.get("keyword"))) {
					allStatuses.add(getScenarioStatus(scenario));
				}
			}
		}

		return reduceStatuses(allStatuses).getTextName();
	}
}
