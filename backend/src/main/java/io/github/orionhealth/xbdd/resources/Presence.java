package io.github.orionhealth.xbdd.resources;

import java.util.Calendar;
import java.util.Date;

import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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

import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.Field;
import io.github.orionhealth.xbdd.util.LoggedInUserUtil;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/presence")
public class Presence {

	@Autowired
	private DB mongoLegacyDb;

	@POST
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addPresence(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId) {
		final DBCollection collection = this.mongoLegacyDb.getCollection("presence");
		final BasicDBObject query = new BasicDBObject("coordinates",
				coordinates.getObject(Field.PRODUCT, Field.VERSION, Field.BUILD).append(
						"featureId", featureId))
								.append("_id", coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates
										.getBuild() + "/" + featureId);
		final Date now = Calendar.getInstance().getTime();
		collection.update(query,
				new BasicDBObject("$set",
						new BasicDBObject("users." + LoggedInUserUtil.getLoggedInUser().getDisplay(), now).append("lastUpdated", now)),
				true,
				false);
		final DBObject newPresence = collection.findOne(query);
		newPresence.put("currentUser", LoggedInUserUtil.getLoggedInUser().getDisplay());
		return Response.ok(SerializerUtil.serialise(newPresence)).build();
	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}/{featureId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPresence(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId) {
		final DBCollection collection = this.mongoLegacyDb.getCollection("presence");
		final BasicDBObject query = new BasicDBObject("coordinates",
				coordinates.getObject(Field.PRODUCT, Field.VERSION, Field.BUILD).append(
						"featureId", featureId))
								.append("_id", coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates
										.getBuild() + "/" + featureId);
		final DBObject newPresence = collection.findOne(query);
		newPresence.put("currentUser", LoggedInUserUtil.getLoggedInUser().getDisplay());
		return Response.ok(SerializerUtil.serialise(newPresence)).build();

	}

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPresencesForBuild(@BeanParam final Coordinates coordinates) {
		final DBCollection collection = this.mongoLegacyDb.getCollection("presence");
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
	public Response deletePresence(@BeanParam final Coordinates coordinates, @PathParam("featureId") final String featureId) {
		final DBCollection collection = this.mongoLegacyDb.getCollection("presence");
		final BasicDBObject query = new BasicDBObject("coordinates",
				coordinates.getObject(Field.PRODUCT, Field.VERSION, Field.BUILD).append(
						"featureId", featureId))
								.append("_id", coordinates.getProduct() + "/" + coordinates.getVersionString() + "/" + coordinates
										.getBuild() + "/" + featureId);
		collection.update(query,
				new BasicDBObject("$unset", new BasicDBObject("users." + LoggedInUserUtil.getLoggedInUser().getDisplay(), 1)),
				true, false);
		final DBObject newPresence = collection.findOne(query);
		newPresence.put("currentUser", LoggedInUserUtil.getLoggedInUser().getDisplay());
		return Response.ok(SerializerUtil.serialise(newPresence)).build();
	}
}
