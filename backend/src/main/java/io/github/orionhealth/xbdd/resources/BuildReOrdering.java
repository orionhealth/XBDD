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

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;

import io.github.orionhealth.xbdd.factory.MongoDBAccessor;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.SerializerUtil;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("/build-reorder")
public class BuildReOrdering {

	private final MongoDBAccessor client;

	@Inject
	public BuildReOrdering(final MongoDBAccessor client) {
		this.client = client;
	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getBuildsForProductVersion(@BeanParam Coordinates coordinates) {
		final DB db = this.client.getDB("bdd");
		final DBCollection summaryCollection = db.getCollection("summary");
		final BasicDBObject query = new BasicDBObject("_id", coordinates.getProduct() + "/" + coordinates.getVersionString());
		final Object builds = summaryCollection.findOne(query).get("builds");
		if (builds instanceof List<?>) {
			return Response.ok(SerializerUtil.serialise((List<String>) builds)).build();
		}

		return Response.ok(new ArrayList<>()).build();
	}

	@PUT
	@Path("/{product}/{major}.{minor}.{servicePack}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response setBuildOrderForProductVersion(@BeanParam Coordinates coordinates,
			final Builds json) {
		final DB db = this.client.getDB("bdd");
		final DBCollection summaryCollection = db.getCollection("summary");
		final BasicDBObject query = new BasicDBObject("_id", coordinates.getProduct() + "/" + coordinates.getVersionString());
		summaryCollection.update(query, new BasicDBObject("$set", new BasicDBObject("builds", json.builds)));

		return Response.ok().build();
	}

	public static class Builds {
		public List<String> builds;
	}
}
