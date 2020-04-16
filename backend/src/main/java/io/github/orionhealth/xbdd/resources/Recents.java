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
package io.github.orionhealth.xbdd.resources;

import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.LoggedInUserUtil;

@Path("/recents")
public class Recents {

	@Autowired
	private DB mongoLegacyDb;

	@PUT
	@Path("/feature/{product}/{major}.{minor}.{servicePack}/{build}/{id:.+}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addFeatureToRecents(@QueryParam("name") final String featureName,
			@BeanParam final Coordinates coordinates,
			@PathParam("id") final String featureID) {

		final BasicDBObject featureDetails = new BasicDBObject("name", featureName);
		featureDetails.put("product", coordinates.getProduct());
		featureDetails.put("version", coordinates.getVersionString());
		featureDetails.put("build", coordinates.getBuild());
		featureDetails.put("id", featureID);

		final DBCollection collection = this.mongoLegacyDb.getCollection("users");

		final BasicDBObject user = new BasicDBObject();
		user.put("user_id", LoggedInUserUtil.getLoggedInUser().getDisplay());

		final DBObject blank = new BasicDBObject();
		final DBObject doc = collection.findAndModify(user, blank, blank, false, new BasicDBObject("$set", user), true, true);

		if (doc.containsField("recentFeatures")) {
			final BasicDBList featureArray = (BasicDBList) doc.get("recentFeatures");
			if (featureArray.contains(featureDetails)) {
				featureArray.remove(featureDetails);
				featureArray.add(featureDetails);
				collection.update(user, new BasicDBObject("$set", new BasicDBObject("recentFeatures", featureArray)));
			} else {
				if (featureArray.size() >= 5) {
					collection.update(user, new BasicDBObject("$pop", new BasicDBObject("recentFeatures", "-1")));
				}
				collection.update(user, new BasicDBObject("$addToSet", new BasicDBObject("recentFeatures", featureDetails)));
			}
		} else {
			collection.update(user, new BasicDBObject("$addToSet", new BasicDBObject("recentFeatures", featureDetails)));
		}

		return Response.ok().build();
	}

	@PUT
	@Path("/build/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addBuildToRecents(@BeanParam final Coordinates coordinates) {

		final DBObject buildCoords = coordinates.getReportCoordinates();

		final DBCollection collection = this.mongoLegacyDb.getCollection("users");

		final BasicDBObject user = new BasicDBObject();
		user.put("user_id", LoggedInUserUtil.getLoggedInUser().getDisplay());

		final DBObject blank = new BasicDBObject();
		final DBObject doc = collection.findAndModify(user, blank, blank, false, new BasicDBObject("$set", user), true, true);

		if (doc.containsField("recentBuilds")) {
			final BasicDBList buildArray = (BasicDBList) doc.get("recentBuilds");
			if (buildArray.contains(buildCoords)) {
				// BasicDBObject toMove = (BasicDBObject) featureArray.get(featureArray.indexOf(featureDetails));
				buildArray.remove(buildCoords);
				buildArray.add(buildCoords);
				collection.update(user, new BasicDBObject("$set", new BasicDBObject("recentBuilds", buildArray)));
			} else {
				if (buildArray.size() >= 5) {
					collection.update(user, new BasicDBObject("$pop", new BasicDBObject("recentBuilds", "-1")));
				}
				collection.update(user, new BasicDBObject("$addToSet", new BasicDBObject("recentBuilds", buildCoords)));
			}
		} else {
			collection.update(user, new BasicDBObject("$addToSet", new BasicDBObject("recentBuilds", buildCoords)));
		}

		return Response.ok().build();
	}

	@GET
	@Path("/builds")
	@Produces(MediaType.APPLICATION_JSON)
	public DBObject getRecentBuilds() {

		final DBCollection collection = this.mongoLegacyDb.getCollection("users");

		final BasicDBObject user = new BasicDBObject("user_id", LoggedInUserUtil.getLoggedInUser().getDisplay());

		final DBCursor cursor = collection.find(user);
		DBObject doc;
		BasicDBList ret = new BasicDBList();

		if (cursor.hasNext()) {
			doc = cursor.next();
			if (doc.containsField("recentBuilds")) {
				ret = (BasicDBList) doc.get("recentBuilds");
			}
		}

		return new BasicDBObject("recents", ret);
	}

	@GET
	@Path("/features")
	@Produces(MediaType.APPLICATION_JSON)
	public DBObject getRecentFeatures() {

		final DBCollection collection = this.mongoLegacyDb.getCollection("users");

		final BasicDBObject user = new BasicDBObject("user_id", LoggedInUserUtil.getLoggedInUser().getDisplay());

		final DBCursor cursor = collection.find(user);
		DBObject doc;
		BasicDBList ret = new BasicDBList();

		if (cursor.hasNext()) {
			doc = cursor.next();
			if (doc.containsField("recentFeatures")) {
				ret = (BasicDBList) doc.get("recentFeatures");
			}
		}

		return new BasicDBObject("recents", ret);
	}
}
