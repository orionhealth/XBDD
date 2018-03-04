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
package xbdd.webapp.resource.feature;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;

import xbdd.util.StatusHelper;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;
import xbdd.webapp.util.Field;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

@Path("/rest/feature")
public class Feature {

	private final MongoDBAccessor client;
	private static int MAX_ENVIRONMENTS_FOR_A_PRODUCT = 10;

	@Inject
	public Feature(final MongoDBAccessor client) {
		this.client = client;
	}

	@SuppressWarnings("unchecked")
	/**
	 * Uses the '.+' regexp on featureId to allow for symbols such as slashes in the id
	 *
	 * @param String featureId The featureId to get the history for
	 * @return DBObjet Returns the past feature status for the given featureId
	 */
	@GET
	@Path("/rollup/{product}/{major}.{minor}.{servicePack}/{featureId:.+}")
	public DBObject getFeatureRollup(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId) {
		final List<BasicDBObject> features = new ArrayList<BasicDBObject>();
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("features");
		final DBCollection summary = db.getCollection("summary");
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
				.append("coordinates", coordinates.getRollupCoordinates().append("featureId", featureId).append("version", coordinates.getVersionString()));
		
		final DBObject buildOrder = summary.findOne(coordinates.getQueryObject());
		final List<String> buildArray = (List<String>) buildOrder.get("builds");
		final List<BasicDBObject> orderedFeatures = new ArrayList<BasicDBObject>();
		
		for (String build : buildArray) {
			for (BasicDBObject feature : features) {
				if (feature.get("build").equals(build)) {
					orderedFeatures.add(feature);
					break;
				}
			}
		}
		
		returns.append("rollup", orderedFeatures);
		
		return returns;
	}

	/**
	 * Uses the '.+' regexp on featureId to allow for symbols such as slashes in the id
	 *
	 * @param String featureId The featureId to get the history for
	 * @return DBObjet Returns the the current features state and details (environments, tips, steps and scenarios)
	 */
	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId:.+}")
	public DBObject getFeature(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId) {
		final DB db = this.client.getDB("bdd");
		final DBCollection tips = db.getCollection("features");
		final BasicDBObject example = coordinates.getReportCoordinatesQueryObject().append("id", featureId);
		final DBObject feature = tips.findOne(example);
		if (feature != null) {
			Feature.embedTestingTips(feature, coordinates, db);
		}
		return feature;
	}

	@SuppressWarnings("unchecked")
	protected void updateTestingTips(final DB db, final Coordinates coordinates, final String featureId, final DBObject feature) {
		final DBCollection tips = db.getCollection("testingTips");
		final List<DBObject> elements = (List<DBObject>) feature.get("elements");
		for (final DBObject scenario : elements) {
			if (scenario.get("testing-tips") != null) {
				final String tipText = (String) scenario.get("testing-tips");
				final String scenarioId = (String) scenario.get("id");
				final BasicDBObject tipQuery = coordinates.getTestingTipsCoordinatesQueryObject(featureId, scenarioId);
				DBObject oldTip = null;
				// get the most recent tip that is LTE to the current coordinates. i.e. sort in reverse chronological order and take the
				// first item (if one exists).
				final DBCursor oldTipCursor = tips.find(tipQuery)
						.sort(new BasicDBObject("coordinates.major", -1).append("coordinates.minor", -1)
								.append("coordinates.servicePack", -1).append("coordinates.build", -1)).limit(1);
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
	}

	/**
	 * Uses the '.+' regexp on featureId to allow for symbols such as slashes in the id
	 *
	 * @param String featureId The featureId to make changes to
	 * @return DBObjet Returns the the features new state if changes were made and returns null if bad JSON was sent
	 */
	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId:.+}")
	@Consumes("application/json")
	public DBObject putFeature(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			@Context final HttpServletRequest req, final DBObject feature) {
		feature.put("calculatedStatus", StatusHelper.getFeatureStatus(feature));
		try {
			final DB db = this.client.getDB("bdd");
			final DBCollection collection = db.getCollection("features");
			final BasicDBObject example = coordinates.getReportCoordinatesQueryObject().append("id", featureId);
			final DBObject report = collection.findOne(example);

			// get the differences/new edits

			// Detect if the edits caused a change
			feature.put("statusLastEditedBy", req.getRemoteUser());
			feature.put("lastEditOn", new Date());
			final BasicDBList edits = updateEdits(feature, report);
			feature.put("edits", edits);

			updateTestingTips(db, coordinates, featureId, feature); // save testing tips / strip them out of the document.
			updateEnvironmentDetails(db, coordinates, feature);
			collection.save(feature);
			Feature.embedTestingTips(feature, coordinates, db); // rembed testing tips.
			return feature;// pull back feature - will re-include tips that were extracted prior to saving
		} catch (final Throwable th) {
			th.printStackTrace();
			return null;
		}
	}

	/**
	 * Goes through each environment detail on this feature and pushes each unique one to a per-product document in the 'environments'
	 * collection.
	 *
	 * @param db
	 * @param coordinates
	 * @param feature
	 */
	@SuppressWarnings("unchecked")
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
		final List<String> titleCache = new ArrayList<String>();
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

	@SuppressWarnings("unchecked")
	public static void embedTestingTips(final DBObject feature, final Coordinates coordinates, final DB db) {
		final DBCollection tips = db.getCollection("testingTips");
		final List<DBObject> elements = (List<DBObject>) feature.get("elements");
		for (final DBObject scenario : elements) {
			DBObject oldTip = null;
			final BasicDBObject tipQuery = coordinates.getTestingTipsCoordinatesQueryObject((String) feature.get("id"), (String) scenario.get("id"));
			// get the most recent tip that is LTE to the current coordinates. i.e. sort in reverse chronological order and take the first
			// item (if one exists).
			final DBCursor oldTipCursor = tips.find(tipQuery)
					.sort(new BasicDBObject("coordinates.major", -1).append("coordinates.minor", -1)
							.append("coordinates.servicePack", -1).append("coordinates.build", -1)).limit(1);
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
		final BasicDBList elements = (BasicDBList) currentVersion.get("elements");
		final BasicDBList prevElements = (BasicDBList) previousVersion.get("elements");
		if (elements != null) {
			for (int i = 0; i < elements.size(); i++) {
				final BasicDBList allSteps = new BasicDBList();
				final BasicDBList changes = new BasicDBList();
				final BasicDBObject element = (BasicDBObject) elements.get(i);
				final BasicDBObject prevElement = (BasicDBObject) prevElements.get(i);
				final String scenarioName = (String) element.get("name");
				boolean currManual = false;
				boolean prevManual = false;

				// get all scenario steps
				if ((BasicDBObject) element.get("background") != null) {
					for (int j = 0; j < ((BasicDBList) ((BasicDBObject) element.get("background")).get("steps")).size(); j++) {
						final BasicDBObject step = (BasicDBObject) ((BasicDBList) ((BasicDBObject) element.get("background")).get("steps"))
								.get(j);
						final BasicDBObject prevStep = (BasicDBObject) ((BasicDBList) ((BasicDBObject) prevElement.get("background"))
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

				if ((BasicDBList) element.get("steps") != null) {
					for (int j = 0; j < ((BasicDBList) element.get("steps")).size(); j++) {
						final BasicDBObject step = (BasicDBObject) ((BasicDBList) element.get("steps")).get(j);
						final BasicDBObject prevStep = (BasicDBObject) ((BasicDBList) prevElement.get("steps")).get(j);
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

				for (int j = 0; j < allSteps.size(); j++) {
					formatStep(changes, (BasicDBObject) allSteps.get(j), currManual, prevManual);
				}

				// only add if changes have been made
				if (changes.size() > 0) {
					final BasicDBObject singleScenario = new BasicDBObject()
							.append("scenario", scenarioName)
							.append("changes", changes);
					stepChanges.add(singleScenario);
				}
			}
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