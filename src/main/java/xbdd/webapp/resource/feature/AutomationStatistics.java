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

import java.net.UnknownHostException;

import javax.inject.Inject;
import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;
import xbdd.webapp.util.Field;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

@Path("/rest/automation-statistics")
public class AutomationStatistics {

	private final MongoDBAccessor client;

	@Inject
	public AutomationStatistics(final MongoDBAccessor client) {
		this.client = client;
	}

	@GET
	@Path("/recent-builds/{product}")
	public DBObject getRecentBuildStatsForProduct(@BeanParam final Coordinates coordinates, @QueryParam("limit") final Integer limit) {
		final BasicDBList returns = new BasicDBList();
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("reportStats");
		final BasicDBObject example = coordinates.getQueryObject(Field.PRODUCT);
		final DBCursor cursor = collection.find(example).sort(Coordinates.getFeatureSortingObject());
		if (limit != null) {
			cursor.limit(limit);
		}
		try {
			while (cursor.hasNext()) {
				final DBObject doc = cursor.next();
				returns.add(doc);
			}
		} finally {
			cursor.close();
		}
		return returns;
	}

	/**
	 * Go through the prior versions of this product; for each version, find the latest build and contribute the stats for that to the
	 * returned list.
	 *
	 * @param coordinates
	 * @param limit
	 * @return A list of report stats in reverse version order.
	 * @throws UnknownHostException
	 */
	@GET
	@Path("/recent-versions/{product}")
	public DBObject getRecentVersionStatsForProduct(@BeanParam final Coordinates coordinates, @QueryParam("limit") final Integer limit) {
		final BasicDBList returns = new BasicDBList();

		final DB db = this.client.getDB("bdd");
		final DBCollection summaryCollection = db.getCollection("summary");
		final DBCollection reportStatsCollection = db.getCollection("reportStats");
		final DBCursor versions = summaryCollection.find(coordinates.getQueryObject(Field.PRODUCT)).sort(Coordinates.getFeatureSortingObject());
		if (limit != null) {
			versions.limit(limit);
		}
		try {
			while (versions.hasNext()) { // go through each summary document
				final DBObject version = versions.next(); // each represents the coordinates for a given version
				final Coordinates c = new Coordinates((DBObject) version.get("coordinates"));
				final BasicDBList builds = (BasicDBList) version.get("builds");
				c.setBuild((String) builds.get(builds.size() - 1)); // we need to specify which build (the latest is last in the list)
				final DBObject query = c.getQueryObject();
				returns.add(reportStatsCollection.findOne(query));
			}
		} finally {
			versions.close();
		}

		return returns;
	}

}
