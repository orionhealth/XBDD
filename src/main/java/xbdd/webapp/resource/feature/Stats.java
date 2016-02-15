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

@Path("/rest/stats")
public class Stats {
	private static final String MANUAL_TAG = "undefined";
	private static final List<String> STATES = Arrays.asList("passed", "failed", "skipped", "undefined");

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
		final BasicDBObject ret = new BasicDBObject();
		for (final String state : STATES) {
			ret.put(state.substring(0, 1), getNumberOfState(collection, query, state));
		}
		return ret;
	}

	@GET
	@Path("/build/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces("application/json")
	@Deprecated
	public BasicDBObject getBuildStats(@BeanParam final Coordinates coordinates) {
		return getBuildStatsByFeature(coordinates);
	}
	
	@GET
	@Path("/build/{product}/{major}.{minor}.{servicePack}/{build}/features")
	@Produces("application/json")
	public BasicDBObject getBuildStatsByFeature(@BeanParam final Coordinates coordinates) {

		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("features");
		
		final BasicDBObject query = coordinates.getQueryObject();
		final BasicDBList manual = new BasicDBList();
		manual.add(new BasicDBObject("originalAutomatedStatus", MANUAL_TAG));
		manual.add(new BasicDBObject("calculatedStatus", MANUAL_TAG));
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
	@Path("/build/{product}/{major}.{minor}.{servicePack}/{build}/scenarios")
	@Produces("application/json")
	public BasicDBObject getBuildStatsByScenario(@BeanParam final Coordinates coordinates) {
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("features");
		
		final BasicDBObject query = coordinates.getQueryObject();
		
		BasicDBObject manualCounts = new BasicDBObject();
		BasicDBObject autoCounts = new BasicDBObject();
		for (final String state : STATES) {
			manualCounts.put(state.substring(0, 1), 0);
			autoCounts.put(state.substring(0, 1), 0);
		}
		
		DBCursor featuresCursor = collection.find(query);
		while (featuresCursor.hasNext()) {
			DBObject feature = featuresCursor.next();
			BasicDBList elements = (BasicDBList) feature.get("elements");
			for (Object object : elements) {
				BasicDBObject element = (BasicDBObject) object;
				String type = (String) element.get("type");
				if (type.equalsIgnoreCase("scenario") || type.equalsIgnoreCase("scenario outline")) {
					String currentStateName = StatusHelper.getScenarioStatus(element).getTextName();
					String currentStateInitial = currentStateName.substring(0, 1);
					if (element.get("originalAutomatedStatus").equals(MANUAL_TAG) || currentStateName == MANUAL_TAG) {
						manualCounts.put(currentStateInitial, ((Integer) manualCounts.get(currentStateInitial)) + 1);
					} else {
						autoCounts.put(currentStateInitial, ((Integer) autoCounts.get(currentStateInitial)) + 1);
					}
				}
			}
		}
		
		final BasicDBObject ret = new BasicDBObject();
		ret.put("automated", autoCounts);
		ret.put("manual", manualCounts);
		return ret;
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/product/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces("application/json")
	@Deprecated
	public List<BasicDBObject> getProductHistory(@BeanParam final Coordinates coordinates) {
		return getProductHistoryByFeature(coordinates);
	}
	
	@SuppressWarnings("unchecked")
	@GET
	@Path("/product/{product}/{major}.{minor}.{servicePack}/{build}/features")
	@Produces("application/json")
	public List<BasicDBObject> getProductHistoryByFeature(@BeanParam final Coordinates coordinates) {
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
	@Path("/product/{product}/{major}.{minor}.{servicePack}/{build}/scenarios")
	@Produces("application/json")
	public List<BasicDBObject> getProductHistoryByScenario(@BeanParam final Coordinates coordinates) {
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
			for (final String state : STATES) {
				buildObj.put(state, 0);
			}
			
			DBCursor featuresCursor = featureCollection.find(buildQuery);
			while (featuresCursor.hasNext()) {
				DBObject feature = featuresCursor.next();
				BasicDBList elements = (BasicDBList) feature.get("elements");
				for (Object object : elements) {
					BasicDBObject element = (BasicDBObject) object;
					String type = (String) element.get("type");
					if (type.equalsIgnoreCase("scenario") || type.equalsIgnoreCase("scenario outline")) {
						String currentStateName = StatusHelper.getScenarioStatus(element).getTextName();
						buildObj.put(currentStateName, ((Integer) buildObj.get(currentStateName)) + 1);
					}
				}
			}
			
			buildObj.put("name", build);
			buildDBObjectList.add(buildObj);
		}

		return buildDBObjectList;
	}
}
