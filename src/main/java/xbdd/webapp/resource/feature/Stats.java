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
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import xbdd.util.StatusHelper;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;
import xbdd.webapp.util.DatabaseUtilities;
import xbdd.webapp.util.Field;

@Path("/rest/stats")
public class Stats {

	private final MongoDBAccessor client;

	@Inject
	public Stats(final MongoDBAccessor client) {
		this.client = client;
	}

	private Integer getNumberOfState(final DBCollection collection, final DBObject query, final String state) {
		query.put("calculatedStatus", state);
		return collection.find(query).count();
	}

	private DBObject getNumberOfAllStates(final DBCollection collection, final DBObject query) {
		final List<String> states = Arrays.asList("passed", "failed", "skipped", "undefined");
		final BasicDBObject ret = new BasicDBObject();
		for (final String state : states) {
			ret.put(state.substring(0, 1), getNumberOfState(collection, query, state));
		}
		return ret;
	}

	private static BasicDBObject getNumberOfAllStatesPerScenario(final BasicDBList features, final boolean separateManualAndAutomated) {
		final String manualTag = "@manual";
		final List<String> states = Arrays.asList("passed", "failed", "skipped", "undefined");
		final BasicDBObject counts = new BasicDBObject(); // if `separateManualAndAutomated`, `counts` does not include manual scenarios
		final BasicDBObject manualCounts = new BasicDBObject(); // if _not_ `separateManualAndAutomated`, `manualCounts` is not used
		for (final String state : states) {
			counts.append(state.substring(0, 1), 0);
			manualCounts.append(state.substring(0, 1), 0);
		}

		for (final Object ob : features) {
			final BasicDBList scenarios = (BasicDBList) ((DBObject) ob).get("elements");
			if (scenarios != null) {
				for (final Object o : scenarios) {
					boolean isManual = false;
					if (separateManualAndAutomated) {
						// determine whether this scenario is marked @manual
						final BasicDBList tags = (BasicDBList) ((DBObject) o).get("tags");
						if (tags != null) {
							for (final Object b : tags) {
								if (((BasicDBObject) b).get("name").equals(manualTag)) {
									isManual = true;
									break;
								}
							}
						}
					}
					final BasicDBObject category = isManual ? manualCounts : counts;
					final String status = StatusHelper.getFinalScenarioStatus((DBObject) o, true).getTextName().substring(0, 1);
					category.put(status, ((Integer) category.get(status)) + 1);
				}
			}
		}
		if (separateManualAndAutomated) {
			final BasicDBObject ret = new BasicDBObject();
			ret.put("automated", counts);
			ret.put("manual", manualCounts);
			return ret;
		} else {
			return counts;
		}
	}

	@GET
	@Path("/build/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces("application/json")
	public BasicDBObject getBuildStats(@BeanParam final Coordinates coordinates) {

		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("features");
		final String manualTag = "undefined";

		final BasicDBObject query = coordinates.getQueryObject();
		final BasicDBList manual = new BasicDBList();
		manual.add(new BasicDBObject("originalAutomatedStatus", manualTag));
		manual.add(new BasicDBObject("calculatedStatus", manualTag));
		query.put("$or", manual);

		final DBObject m = getNumberOfAllStates(collection, query);

		query.remove("$or");
		query.put("$nor", manual);

		final DBObject a = getNumberOfAllStates(collection, query);

		final BasicDBObject ret = new BasicDBObject();
		ret.put("automated", a);
		ret.put("manual", m);
		return ret;
	}

	@GET
	@Path("/build/per_scenario/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces("application/json")
	public BasicDBObject getBuildStatsPerScenario(@BeanParam final Coordinates coordinates) {
		final DB db = this.client.getDB("bdd");
		final BasicDBList features = DatabaseUtilities.extractList(db.getCollection("features").find(coordinates.getQueryObject()));
		return getNumberOfAllStatesPerScenario(features, true);
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/product/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces("application/json")
	public List<BasicDBObject> getProductHistory(@BeanParam final Coordinates coordinates) {
		List<String> buildList = new ArrayList<String>();
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("summary");
		final DBObject productQuery = coordinates.getQueryObject(Field.PRODUCT, Field.MAJOR, Field.MINOR, Field.SERVICEPACK);
		final DBCursor results = collection.find(productQuery);

		while (results.hasNext()) {
			buildList = (List<String>) results.next().get("builds");
		}

		final DBCollection featureCollection = db.getCollection("features");

		final List<BasicDBObject> buildDBObjectList = new ArrayList<BasicDBObject>();
		for (final String build : buildList) {
			coordinates.setBuild(build);
			final DBObject buildQuery = coordinates.getQueryObject();

			final BasicDBObject buildObj = new BasicDBObject();
			buildObj.put("passed", getNumberOfState(featureCollection, buildQuery, "passed"));
			buildObj.put("failed", getNumberOfState(featureCollection, buildQuery, "failed"));
			buildObj.put("skipped", getNumberOfState(featureCollection, buildQuery, "skipped"));
			buildObj.put("undefined", getNumberOfState(featureCollection, buildQuery, "undefined"));
			buildObj.put("name", build);
			buildDBObjectList.add(buildObj);
		}

		return buildDBObjectList;
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/product/per_scenario/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces("application/json")
	public List<BasicDBObject> getProductHistoryPerScenario(@BeanParam final Coordinates coordinates) {
		List<String> buildList = new ArrayList<String>();
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("summary");
		final DBObject productQuery = coordinates.getQueryObject(Field.PRODUCT, Field.MAJOR, Field.MINOR, Field.SERVICEPACK);
		final DBCursor results = collection.find(productQuery);

		while (results.hasNext()) {
			buildList = (List<String>) results.next().get("builds");
		}

		final DBCollection featureCollection = db.getCollection("features");

		final List<BasicDBObject> buildDBObjectList = new ArrayList<BasicDBObject>();
		for (final String build : buildList) {
			coordinates.setBuild(build);

			final BasicDBObject counts = getNumberOfAllStatesPerScenario(
					DatabaseUtilities.extractList(featureCollection.find(coordinates.getQueryObject())),
					false);

			final BasicDBObject buildObj = new BasicDBObject();
			buildObj.put("passed", counts.get("p"));
			buildObj.put("failed", counts.get("f"));
			buildObj.put("skipped", counts.get("s"));
			buildObj.put("undefined", counts.get("u"));
			buildObj.put("name", build);
			buildDBObjectList.add(buildObj);
		}

		return buildDBObjectList;
	}
}
