package io.github.orionhealth.xbdd.resources;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.model.simple.Scenario;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.Field;
import io.github.orionhealth.xbdd.util.LoggedInUserUtil;
import io.github.orionhealth.xbdd.util.SerializerUtil;
import io.github.orionhealth.xbdd.util.StatusHelper;

@Path("/feature")
public class Feature {

	private static int MAX_ENVIRONMENTS_FOR_A_PRODUCT = 10;

	@Autowired
	private DB mongoLegacyDb;

	public static void embedTestingTips(final DBObject feature, final Coordinates coordinates, final DB db) {
		final DBCollection tips = db.getCollection("testingTips");
		final List<DBObject> elements = (List<DBObject>) feature.get("elements");
		for (final DBObject scenario : elements) {
			DBObject oldTip;
			final BasicDBObject tipQuery = coordinates
					.getTestingTipsCoordinatesQueryObject((String) feature.get("id"), (String) scenario.get("id"));
			// get the most recent tip that is LTE to the current coordinates. i.e. sort in reverse chronological order and take the first
			// item (if one exists).
			final DBCursor oldTipCursor = tips.find(tipQuery)
					.sort(new BasicDBObject("coordinates.major", -1).append("coordinates.minor", -1)
							.append("coordinates.servicePack", -1).append("coordinates.build", -1))
					.limit(1);
			try {
				if (oldTipCursor.hasNext()) {
					oldTip = oldTipCursor.next();
					scenario.put("testing-tips", oldTip.get("testing-tips"));
				}
			} finally {
				oldTipCursor.close();
			}
		}
	}

	/**
	 * Uses the '.+' regexp on featureId to allow for symbols such as slashes in the id
	 *
	 * @param featureId String The featureId to get the history for
	 * @return DBObjet Returns the past feature status for the given featureId
	 */
	@GET
	@Path("/rollup/{product}/{major}.{minor}.{servicePack}/{featureId:.+}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFeatureRollup(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId) {
		final List<BasicDBObject> features = new ArrayList<>();
		final DBCollection collection = this.mongoLegacyDb.getCollection("features");
		final DBCollection summary = this.mongoLegacyDb.getCollection("summary");
		final BasicDBObject example = coordinates.getRollupQueryObject(featureId);
		final DBCursor cursor = collection.find(example,
				new BasicDBObject("id", 1).append("coordinates.build", 1).append("calculatedStatus", 1)
						.append("originalAutomatedStatus", 1).append("statusLastEditedBy", 1));
		try {
			while (cursor.hasNext()) {
				final DBObject doc = cursor.next();
				final BasicDBObject rollup = new BasicDBObject()
						.append("build", ((DBObject) doc.get("coordinates")).get("build"))
						.append("calculatedStatus", doc.get("calculatedStatus"))
						.append("originalAutomatedStatus", doc.get("originalAutomatedStatus"))
						.append("statusLastEditedBy", doc.get("statusLastEditedBy"));
				features.add(rollup);
			}
		} finally {
			cursor.close();
		}
		final BasicDBObject returns = new BasicDBObject()
				.append("coordinates", coordinates.getRollupCoordinates().append("featureId", featureId)
						.append("version", coordinates.getVersionString()));

		final DBObject buildOrder = summary.findOne(coordinates.getQueryObject());
		final List<DBObject> buildList = (List<DBObject>) buildOrder.get("builds");
		final List<BasicDBObject> orderedFeatures = new ArrayList<>();

		for (final DBObject build : buildList) {
			for (final BasicDBObject feature : features) {
				if (feature.get("build").equals(((BasicDBObject) build).get("name"))) {
					orderedFeatures.add(feature);
					break;
				}
			}
		}

		returns.append("rollup", orderedFeatures);

		return Response.ok(SerializerUtil.serialise(returns)).build();
	}

	/**
	 * Uses the '.+' regexp on featureId to allow for symbols such as slashes in the id
	 *
	 * @param featureId String The featureId to get the history for
	 * @return DBObjet Returns the the current features state and details (environments, tips, steps and scenarios)
	 */
	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId:.+}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFeature(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId) {
		final DBCollection tips = this.mongoLegacyDb.getCollection("features");
		final BasicDBObject example = coordinates.getReportCoordinatesQueryObject().append("id", featureId);
		final DBObject feature = tips.findOne(example);
		if (feature != null) {
			Feature.embedTestingTips(feature, coordinates, this.mongoLegacyDb);

			// Ensure tags array is always present in the response, so the frontend receives [] instead of having to deal with null.
			if (feature.get("tags") == null) {
				feature.put("tags", Collections.emptyList());
			}
		}
		return Response.ok(SerializerUtil.serialise(feature)).build();
	}

	protected void updateTestingTips(final DB db, final Coordinates coordinates, final String featureId, final DBObject feature) {
		final DBCollection tips = db.getCollection("testingTips");
		final List<DBObject> elements = (List<DBObject>) feature.get("elements");
		for (final DBObject scenario : elements) {
			updateTestingTipsForScenario(tips, scenario, coordinates, featureId);
		}
	}

	private void updateTestingTipsForScenario(final DBCollection tips, final DBObject scenario, final Coordinates coordinates,
			final String featureId) {
		if (scenario.get("testing-tips") != null) {
			final String tipText = (String) scenario.get("testing-tips");
			final String scenarioId = (String) scenario.get("id");
			final BasicDBObject tipQuery = coordinates.getTestingTipsCoordinatesQueryObject(featureId, scenarioId);
			DBObject oldTip = null;
			// get the most recent tip that is LTE to the current coordinates. i.e. sort in reverse chronological order and take the
			// first item (if one exists).
			final DBCursor oldTipCursor = tips.find(tipQuery)
					.sort(new BasicDBObject("coordinates.major", -1).append("coordinates.minor", -1)
							.append("coordinates.servicePack", -1).append("coordinates.build", -1))
					.limit(1);
			try {
				if (oldTipCursor.hasNext()) {
					oldTip = oldTipCursor.next();
				}
			} finally {
				oldTipCursor.close();
			}
			if (oldTip != null) { // if there is an old tip...
				final String oldTipText = (String) oldTip.get("testing-tips"); // get it and...
				if (!tipText.equals(oldTipText)) {// compare it to the current tip to it, if they're not the same...
					final DBObject newTip = new BasicDBObject("testing-tips", tipText).append("coordinates",
							coordinates.getTestingTipsCoordinates(featureId, scenarioId))
							.append("_id", coordinates.getTestingTipsId(featureId, scenarioId));
					tips.save(newTip);// then save this as a new tip.
				}
			} else { // no prior tip exists, add this one.
				final DBObject newTip = new BasicDBObject("testing-tips", tipText).append("coordinates",
						coordinates.getTestingTipsCoordinates(featureId, scenarioId))
						.append("_id", coordinates.getTestingTipsId(featureId, scenarioId));
				tips.save(newTip);// then save this as a new tip.
			}
		}
		scenario.removeField("testing-tips");
	}

	@PUT
	@Path("/comments/{product}/{major}.{minor}.{servicePack}/{build}/{featureId:.+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateCommentWithPatch(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			final BasicDBObject patch) {
		try {
			final DBCollection collection = this.mongoLegacyDb.getCollection("features");
			final BasicDBObject example = coordinates.getReportCoordinatesQueryObject().append("id", featureId);
			final BasicDBObject storedFeature = (BasicDBObject) collection.findOne(example);

			final String scenarioId = (String) patch.get("scenarioId");
			final String label = (String) patch.get("label");
			final String content = (String) patch.get("content");

			final BasicDBObject featureToUpdate = (BasicDBObject) storedFeature.copy();
			final BasicDBObject scenarioToUpdate = getScenarioById(scenarioId, featureToUpdate);
			scenarioToUpdate.put(label, content);

			if (label.equals("testing-tips")) {
				final DBCollection tips = this.mongoLegacyDb.getCollection("testingTips");
				updateTestingTipsForScenario(tips, scenarioToUpdate, coordinates, featureId);
			}
			featureToUpdate.put("statusLastEditedBy", LoggedInUserUtil.getLoggedInUser().getDisplay());
			featureToUpdate.put("lastEditOn", new Date());
			featureToUpdate.put("calculatedStatus", calculateStatusForFeature(featureToUpdate));
			collection.save(featureToUpdate);
			if (label.equals("testing-tips")) {
				Feature.embedTestingTips(featureToUpdate, coordinates, this.mongoLegacyDb);
			}
			return Response.ok().build();
		} catch (final Throwable th) {
			th.printStackTrace();
			return Response.serverError().build();
		}

	}

	/**
	 * Uses the '.+' regexp on featureId to allow for symbols such as slashes in the id
	 *
	 * @param featureId String The featureId to make changes to
	 * @return DBObjet Returns the the features new state if changes were made and returns null if bad JSON was sent
	 */
	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId:.+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putFeature(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			final BasicDBObject feature) {
		feature.put("calculatedStatus", StatusHelper.getFeatureStatus(feature));
		final DBCollection collection = this.mongoLegacyDb.getCollection("features");
		final BasicDBObject example = coordinates.getReportCoordinatesQueryObject().append("id", featureId);
		final DBObject report = collection.findOne(example);

		// get the differences/new edits

		// Detect if the edits caused a change
		feature.put("statusLastEditedBy", LoggedInUserUtil.getLoggedInUser().getDisplay());
		feature.put("lastEditOn", new Date());
		final BasicDBList edits = updateEdits(feature, report);
		feature.put("edits", edits);

		updateTestingTips(this.mongoLegacyDb, coordinates, featureId, feature); // save testing tips / strip them out of the document.
		updateEnvironmentDetails(this.mongoLegacyDb, coordinates, feature);
		collection.save(feature);
		Feature.embedTestingTips(feature, coordinates, this.mongoLegacyDb); // rembed testing tips.
		return Response.ok(SerializerUtil.serialise(feature))
				.build();// pull back feature - will re-include tips that were extracted prior to saving
	}

	@PUT
	@Path("/step/{product}/{major}.{minor}.{servicePack}/{build}/{featureId:.+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateStepWithPatch(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			final BasicDBObject patch) {
		try {
			final DBCollection collection = this.mongoLegacyDb.getCollection("features");
			final BasicDBObject example = coordinates.getReportCoordinatesQueryObject().append("id", featureId);
			final BasicDBObject storedFeature = (BasicDBObject) collection.findOne(example);

			final int stepLine = (int) patch.get("line");
			final String status = (String) patch.get("status");
			final String scenarioId = (String) patch.get("scenarioId");

			final BasicDBObject featureToUpdate = (BasicDBObject) storedFeature.copy();
			final BasicDBObject scenarioToUpdate = getScenarioById(scenarioId, featureToUpdate);

			boolean found = false;

			if (scenarioToUpdate.get("background") != null) {
				final BasicDBObject backgroundToUpdate = (BasicDBObject) (scenarioToUpdate.get("background"));
				final BasicDBList backgroundStepsToUpdate = (BasicDBList) (backgroundToUpdate.get("steps"));
				found = updateSteps(backgroundStepsToUpdate, stepLine, status);
			}
			if (!found) {
				final BasicDBList stepsToUpdate = (BasicDBList) (scenarioToUpdate.get("steps"));
				updateSteps(stepsToUpdate, stepLine, status);
			}
			featureToUpdate.put("statusLastEditedBy", LoggedInUserUtil.getLoggedInUser().getDisplay());
			featureToUpdate.put("lastEditOn", new Date());
			featureToUpdate.put("calculatedStatus", calculateStatusForFeature(featureToUpdate));
			collection.save(featureToUpdate);
			return Response.ok().build();
		} catch (final Throwable th) {
			th.printStackTrace();
			return Response.serverError().build();
		}
	}

	private boolean updateSteps(final BasicDBList steps, final int stepLine, final String status) {
		for (final Object step : steps) {
			final BasicDBObject dbStep = (BasicDBObject) step;
			if ((int) dbStep.get("line") == stepLine) {
				final BasicDBObject result = (BasicDBObject) dbStep.get("result");
				result.put("manualStatus", status);
				return true;
			}
		}
		return false;
	}

	private String calculateStatusForFeature(final DBObject feature) {
		String currentBgStatus = "passed", currentStepsStatus = "passed";

		final BasicDBList scenarios = (BasicDBList) feature.get("elements");
		for (final Object scenario : scenarios) {
			final BasicDBObject background = (BasicDBObject) ((BasicDBObject) scenario).get("background");
			if (background != null) {
				final BasicDBList bgsteps = (BasicDBList) background.get("steps");
				currentBgStatus = calculateStatusForSteps(currentBgStatus, bgsteps);
			}
			final BasicDBList steps = (BasicDBList) ((BasicDBObject) scenario).get("steps");
			if (steps != null) {
				currentStepsStatus = calculateStatusForSteps(currentStepsStatus, steps);
			}
		}
		return compareStatusPriority(currentBgStatus, currentStepsStatus);
	}

	private String calculateStatusForSteps(final String currentStatus, final BasicDBList steps) {
		String rtn = currentStatus;
		for (final Object step : steps) {
			final BasicDBObject result = (BasicDBObject) ((BasicDBObject) step).get("result");
			final String status = (String) result.get("status");
			final String manualStatus = (String) result.get("manualStatus");
			if (manualStatus != null) {
				rtn = compareStatusPriority(rtn, manualStatus);
			} else {
				rtn = compareStatusPriority(rtn, status);
			}
		}
		return rtn;
	}

	private String compareStatusPriority(final String firstStatus, final String secondStatus) {
		final HashMap<String, Integer> statusPriority = new HashMap<>();
		statusPriority.put("passed", 1);
		statusPriority.put("skipped", 2);
		statusPriority.put("undefined", 3);
		statusPriority.put("failed", 4);
		return statusPriority.get(firstStatus) > statusPriority.get(secondStatus) ? firstStatus : secondStatus;
	}

	private BasicDBObject getScenarioById(final String scenarioId, final DBObject feature) {
		final BasicDBList scenarios = (BasicDBList) feature.get("elements");
		for (final Object scenario : scenarios) {
			if (new Scenario((BasicDBObject) scenario).getId().equals(scenarioId)) {
				return (BasicDBObject) scenario;
			}
		}

		return null;
	}

	@PUT
	@Path("/steps/{product}/{major}.{minor}.{servicePack}/{build}/{featureId:.+}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateStepsWithPatch(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			final BasicDBObject patch) {
		try {
			final DBCollection collection = this.mongoLegacyDb.getCollection("features");
			final BasicDBObject example = coordinates.getReportCoordinatesQueryObject().append("id", featureId);
			final BasicDBObject storedFeature = (BasicDBObject) collection.findOne(example);

			final String status = (String) patch.get("status");
			final String scenarioId = (String) patch.get("scenarioId");

			final BasicDBObject featureToUpdate = (BasicDBObject) storedFeature.copy();
			final BasicDBObject scenarioToUpdate = getScenarioById(scenarioId, featureToUpdate);

			if (scenarioToUpdate.get("background") != null) {
				final BasicDBObject backgroundToUpdate = (BasicDBObject) (scenarioToUpdate.get("background"));
				final BasicDBList backgroundStepsToUpdate = (BasicDBList) (backgroundToUpdate.get("steps"));
				updateAllSteps(backgroundStepsToUpdate, status);

			}
			if (scenarioToUpdate.get("steps") != null) {
				final BasicDBList stepsToUpdate = (BasicDBList) (scenarioToUpdate.get("steps"));
				updateAllSteps(stepsToUpdate, status);
			}
			featureToUpdate.put("statusLastEditedBy", LoggedInUserUtil.getLoggedInUser().getDisplay());
			featureToUpdate.put("lastEditOn", new Date());
			featureToUpdate.put("calculatedStatus", calculateStatusForFeature(featureToUpdate));
			collection.save(featureToUpdate);
			return Response.ok().build();
		} catch (final Throwable th) {
			th.printStackTrace();
			return Response.serverError().build();
		}
	}

	private void updateAllSteps(final BasicDBList steps, final String status) {
		for (final Object step : steps) {
			final BasicDBObject dbStep = (BasicDBObject) step;
			final BasicDBObject result = (BasicDBObject) dbStep.get("result");
			result.put("manualStatus", status);
		}
	}

	/**
	 * Goes through each environment detail on this feature and pushes each unique one to a per-product document in the 'environments'
	 * collection.
	 */

	public void updateEnvironmentDetails(final DB db, final Coordinates coordinates, final DBObject feature) {
		final DBCollection env = db.getCollection("environments");
		final List<DBObject> elements = (List<DBObject>) feature.get("elements");
		final BasicDBObject envQuery = coordinates.getQueryObject(Field.PRODUCT);
		// pull back the "product" document containing all the environments.
		DBObject productEnvironments = env.findOne(envQuery);
		// if one doesn't exist then create it.
		if (productEnvironments == null) {
			productEnvironments = new BasicDBObject();
			productEnvironments.put("coordinates", coordinates.getObject(Field.PRODUCT));
		}
		// pull back the list of environments
		List<Object> envs = (List<Object>) productEnvironments.get("environments");
		// if the list doesn't exist then create it.
		if (envs == null) {
			envs = new BasicDBList();
			productEnvironments.put("environments", envs);
		}
		final List<String> titleCache = new ArrayList<>();
		// go through each scenario, pull out the environment details and add them to the back of the list.
		for (final DBObject scenario : elements) {
			String notes = (String) scenario.get("environment-notes");
			if (notes != null) {
				notes = notes.trim();
				if (notes.length() > 0) {
					if (!titleCache.contains(notes)) {
						titleCache.add(notes);
					}
				}
			}
		}
		// go through each unique environment detail, remove it if it is already in the list and append to the end.
		for (final String environmentDetail : titleCache) {
			envs.remove(environmentDetail);
			envs.add(environmentDetail);
		}
		// if the list gets too long, truncate it on a LRU basis.
		if (envs.size() > MAX_ENVIRONMENTS_FOR_A_PRODUCT) {
			envs = envs.subList(envs.size() - MAX_ENVIRONMENTS_FOR_A_PRODUCT, envs.size());
			productEnvironments.put("environments", envs);
		}
		// save the list back.
		env.save(productEnvironments);
	}

	private BasicDBList updateEdits(final DBObject feature, final DBObject previousVersion) {
		BasicDBList edits = (BasicDBList) feature.get("edits");
		if (edits == null) {
			edits = new BasicDBList();
		}
		final BasicDBList newEdits = new BasicDBList();
		final BasicDBObject edit = new BasicDBObject()
				.append("name", feature.get("statusLastEditedBy"))
				.append("date", feature.get("lastEditOn"))
				.append("prev", previousVersion.get("calculatedStatus"))
				.append("curr", feature.get("calculatedStatus"))
				.append("stepChanges",
						constructEditStepChanges(feature, previousVersion));
		newEdits.add(edit);
		newEdits.addAll(edits);
		return newEdits;
	}

	private BasicDBList constructEditStepChanges(final DBObject currentVersion, final DBObject previousVersion) {
		final BasicDBList stepChanges = new BasicDBList();
		final BasicDBList scenarios = (BasicDBList) currentVersion.get("elements");
		final BasicDBList prevScenarios = (BasicDBList) previousVersion.get("elements");
		if (scenarios != null) {
			for (int i = 0; i < scenarios.size(); i++) {
				stepChanges.addAll(updateScenarioSteps((BasicDBObject) scenarios.get(i), (BasicDBObject) prevScenarios.get(i)));
			}
		}
		return stepChanges;
	}

	private BasicDBList updateScenarioSteps(final DBObject scenario, final DBObject previousScenario) {
		final BasicDBList stepChanges = new BasicDBList();
		final BasicDBList allSteps = new BasicDBList();
		final BasicDBList changes = new BasicDBList();
		final String scenarioName = (String) scenario.get("name");
		boolean currManual = false;
		boolean prevManual = false;

		// get all scenario steps
		if (scenario.get("background") != null) {
			for (int j = 0; j < ((BasicDBList) ((BasicDBObject) scenario.get("background")).get("steps")).size(); j++) {
				final BasicDBObject step = (BasicDBObject) ((BasicDBList) ((BasicDBObject) scenario.get("background")).get("steps"))
						.get(j);
				final BasicDBObject prevStep = (BasicDBObject) ((BasicDBList) ((BasicDBObject) previousScenario.get("background"))
						.get("steps"))
								.get(j);
				final String id = (String) step.get("keyword") + (String) step.get("name");
				if (((BasicDBObject) step.get("result")).get("manualStatus") != null) {
					currManual = true;
				}
				if (((BasicDBObject) prevStep.get("result")).get("manualStatus") != null) {
					prevManual = true;
				}
				final BasicDBObject compareStep = new BasicDBObject()
						.append("id", id)
						.append("curr", step)
						.append("prev", prevStep);
				allSteps.add(compareStep);
			}
		}

		if (scenario.get("steps") != null) {
			for (int j = 0; j < ((BasicDBList) scenario.get("steps")).size(); j++) {
				final BasicDBObject step = (BasicDBObject) ((BasicDBList) scenario.get("steps")).get(j);
				final BasicDBObject prevStep = (BasicDBObject) ((BasicDBList) previousScenario.get("steps")).get(j);
				final String id = (String) step.get("keyword") + (String) step.get("name");
				if (((BasicDBObject) step.get("result")).get("manualStatus") != null) {
					currManual = true;
				}
				if (((BasicDBObject) prevStep.get("result")).get("manualStatus") != null) {
					prevManual = true;
				}
				final BasicDBObject compareStep = new BasicDBObject()
						.append("id", id)
						.append("curr", step)
						.append("prev", prevStep);
				allSteps.add(compareStep);
			}
		}

		for (final Object allStep : allSteps) {
			formatStep(changes, (BasicDBObject) allStep, currManual, prevManual);
		}

		// only add if changes have been made
		if (changes.size() > 0) {
			final BasicDBObject singleScenario = new BasicDBObject()
					.append("scenario", scenarioName)
					.append("changes", changes);
			stepChanges.add(singleScenario);
		}

		return stepChanges;
	}

	private void formatStep(final BasicDBList changes, final BasicDBObject step,
			final boolean currManual, final boolean prevManual) {
		String currState, currCause, prevState, prevCause;

		final BasicDBObject currStep = ((BasicDBObject) step.get("curr"));
		if (((BasicDBObject) currStep.get("result")).get("manualStatus") != null) {
			currState = (String) ((BasicDBObject) currStep.get("result")).get("manualStatus");
			currCause = "manual";
		} else {
			currCause = "auto";
			if (currManual) {
				currState = "undefined";
			} else {
				currState = (String) ((BasicDBObject) currStep.get("result")).get("status");
			}
		}

		final BasicDBObject prevStep = ((BasicDBObject) step.get("prev"));
		if (((BasicDBObject) prevStep.get("result")).get("manualStatus") != null) {
			prevState = (String) ((BasicDBObject) prevStep.get("result")).get("manualStatus");
			prevCause = "manual";
		} else {
			prevCause = "auto";
			if (prevManual) {
				prevState = "undefined";
			} else {
				prevState = (String) ((BasicDBObject) prevStep.get("result")).get("status");
			}
		}

		// only add if different
		if (!currState.equals(prevState) || !currCause.equals(prevCause)) {
			final BasicDBObject stateChange = new BasicDBObject()
					.append("id", step.get("id"))
					.append("curr", currState)
					.append("prev", prevState);
			changes.add(stateChange);
		}
	}
}
