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

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;

@Path("/build-reorder")
public class BuildReOrdering {

	private final MongoDBAccessor client;

	@Inject
	public BuildReOrdering(final MongoDBAccessor client) {
		this.client = client;
	}

	@SuppressWarnings("unchecked")
	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}")
	public List<String> getBuildsForProductVersion(@BeanParam Coordinates coordinates) {
		final DB db = this.client.getDB("bdd");
		final DBCollection summaryCollection = db.getCollection("summary");
		final BasicDBObject query = new BasicDBObject("_id", coordinates.getProduct() + "/" + coordinates.getVersionString());
		return (List<String>) summaryCollection.findOne(query).get("builds");
	}

	public static class Builds {
	    public List<String> builds;
	}

	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}")
	@Consumes("application/json")
	public Response setBuildOrderForProductVersion(@BeanParam Coordinates coordinates,
			final Builds json) {
		final DB db = this.client.getDB("bdd");
		final DBCollection summaryCollection = db.getCollection("summary");
		final BasicDBObject query = new BasicDBObject("_id", coordinates.getProduct() + "/" + coordinates.getVersionString());
		summaryCollection.update(query, new BasicDBObject("$set", new BasicDBObject("builds", json.builds)));

		return Response.ok().build();
	}
}
