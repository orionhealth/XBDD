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

import java.util.Calendar;
import java.util.Date;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.factory.MongoDBAccessor;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.Field;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/presence")
public class Presence {

	private final MongoDBAccessor client;

	@Inject
	public Presence() {
		this.client = new MongoDBAccessor();
	}

	@POST
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addPresence(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			@Context final HttpServletRequest req) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("presence");
		final BasicDBObject query = new BasicDBObject("coordinates",
				coordinates.getObject(Field.PRODUCT, Field.VERSION, Field.BUILD).append(
						"featureId", featureId))
				.append("_id", coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates
						.getBuild() + "/" + featureId);
		final Date now = Calendar.getInstance().getTime();
		collection.update(query,
				new BasicDBObject("$set", new BasicDBObject("users." + req.getRemoteUser(), now).append("lastUpdated", now)), true,
				false);
		final DBObject newPresence = collection.findOne(query);
		newPresence.put("currentUser", req.getRemoteUser());
		return Response.ok(SerializerUtil.serialise(newPresence)).build();
	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPresence(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			@Context final HttpServletRequest req) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("presence");
		final BasicDBObject query = new BasicDBObject("coordinates",
				coordinates.getObject(Field.PRODUCT, Field.VERSION, Field.BUILD).append(
						"featureId", featureId))
				.append("_id", coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates
						.getBuild() + "/" + featureId);
		final DBObject newPresence = collection.findOne(query);
		newPresence.put("currentUser", req.getRemoteUser());
		return Response.ok(SerializerUtil.serialise(newPresence)).build();

	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPresencesForBuild(@BeanParam final Coordinates coordinates) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("presence");
		final BasicDBObject query = coordinates.getQueryObject(Field.PRODUCT, Field.VERSION, Field.BUILD);
		final BasicDBList presencesForBuild = new BasicDBList();
		final DBCursor cursor = collection.find(query);
		while (cursor.hasNext()) {
			presencesForBuild.add(cursor.next());
		}
		return Response.ok(SerializerUtil.serialise(presencesForBuild)).build();

	}

	@DELETE
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deletePresence(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId,
			@Context final HttpServletRequest req) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("presence");
		final BasicDBObject query = new BasicDBObject("coordinates",
				coordinates.getObject(Field.PRODUCT, Field.VERSION, Field.BUILD).append(
						"featureId", featureId))
				.append("_id", coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates
						.getBuild() + "/" + featureId);
		collection.update(query, new BasicDBObject("$unset", new BasicDBObject("users." + req.getRemoteUser(), 1)), true, false);
		final DBObject newPresence = collection.findOne(query);
		newPresence.put("currentUser", req.getRemoteUser());
		return Response.ok(SerializerUtil.serialise(newPresence)).build();
	}
}
