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
package xbdd.webapp.resource.feature;

import com.mongodb.*;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;
import xbdd.webapp.util.Field;
import xbdd.webapp.util.SerializerUtil;

import javax.inject.Inject;
import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Path("/stats")
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

	@GET
	@Path("/build/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getBuildStats(@BeanParam final Coordinates coordinates) {

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
		return Response.ok(SerializerUtil.serialise(ret)).build();
	}

	@GET
	@Path("/product/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProductHistory(@BeanParam final Coordinates coordinates) {
		List<String> buildList = new ArrayList<>();
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("summary");
		final DBObject productQuery = coordinates.getQueryObject(Field.PRODUCT, Field.MAJOR, Field.MINOR, Field.SERVICEPACK);
		final DBCursor results = collection.find(productQuery);

		while (results.hasNext()) {
			buildList = (List<String>) results.next().get("builds");
		}

		final DBCollection featureCollection = db.getCollection("features");

		final List<BasicDBObject> buildDBObjectList = new ArrayList<>();
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

		return Response.ok(SerializerUtil.serialise(buildDBObjectList)).build();
	}
}
