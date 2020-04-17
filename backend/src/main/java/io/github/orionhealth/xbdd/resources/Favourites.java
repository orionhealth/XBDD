package io.github.orionhealth.xbdd.resources;

import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
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
import io.github.orionhealth.xbdd.util.LoggedInUserUtil;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/favourites")
public class Favourites {

	@Autowired
	private DB mongoLegacyDb;

	public void setFavouriteStateOfProduct(final String product, final boolean state) {

		final DBCollection collection = this.mongoLegacyDb.getCollection("users");

		final BasicDBObject user = new BasicDBObject();
		user.put("user_id", LoggedInUserUtil.getLoggedInUser().getDisplay());

		final DBObject blank = new BasicDBObject();
		collection.findAndModify(user, blank, blank, false, new BasicDBObject("$set", user), true, true);

		// User exists
		final DBObject favourites = new BasicDBObject("favourites." + product, state);
		final DBObject update = new BasicDBObject("$set", favourites);
		collection.update(user, update);
	}

	@PUT
	@Path("/{product}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response productFavouriteStateOn(@PathParam("product") final String product) {

		setFavouriteStateOfProduct(product, true);
		return Response.ok().build();
	}

	@DELETE
	@Path("/{product}")
	public Response productFavouriteStateOff(@PathParam("product") final String product) {
		setFavouriteStateOfProduct(product, false);
		return Response.ok().build();
	}

	@GET
	@Path("/{product}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFavouriteStateOfProduct(@PathParam("product") final String product) {
		final DBCollection collection = this.mongoLegacyDb.getCollection("users");

		final BasicDBObject query = new BasicDBObject("user_id", LoggedInUserUtil.getLoggedInUser().getDisplay());
		query.put("favourites." + product, true);

		final DBObject favState = collection.findOne(query);

		return Response.ok(favState != null).build();
	}

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSummaryOfAllReports() {
		final DBCollection collection = this.mongoLegacyDb.getCollection("summary");
		final DBCollection usersCollection = this.mongoLegacyDb.getCollection("users");

		final BasicDBObject user = new BasicDBObject();
		user.put("user_id", LoggedInUserUtil.getLoggedInUser().getDisplay());

		final DBObject blank = new BasicDBObject();
		final DBObject uDoc = usersCollection.findAndModify(user, blank, blank, false,
				new BasicDBObject("$setOnInsert", new BasicDBObject("favourites", new BasicDBObject())), true, true);
		DBObject userFavourites;

		if (uDoc.containsField("favourites")) {
			userFavourites = (DBObject) uDoc.get("favourites");
		} else {
			userFavourites = new BasicDBObject();
		}

		final DBCursor cursor = collection.find();

		try {
			final BasicDBList returns = new BasicDBList();
			DBObject doc;

			while (cursor.hasNext()) {
				doc = cursor.next();
				final String product = ((String) ((DBObject) doc.get("coordinates")).get("product"));
				if (userFavourites.containsField(product) && (boolean) userFavourites.get(product)) {
					doc.put("favourite", userFavourites.get(product));
					returns.add(doc);
				}
			}

			return Response.ok(SerializerUtil.serialise(returns)).build();
		} finally {
			cursor.close();
		}
	}

	private void setPinStateOfBuild(final String product,
			final String version,
			final String build,
			final boolean state) {

		final DBCollection collection = this.mongoLegacyDb.getCollection("summary");

		final BasicDBObject query = new BasicDBObject("_id", product + "/" + version);
		final BasicDBObject toBePinned = new BasicDBObject("pinned", build);
		final String method;

		if (state) {
			method = "$addToSet";
		} else {
			method = "$pull";
		}

		collection.update(query, new BasicDBObject(method, toBePinned));
	}

	@PUT
	@Path("/pin/{product}/{major}.{minor}.{servicePack}/{build}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response pinABuild(@BeanParam final Coordinates coordinates) {

		setPinStateOfBuild(coordinates.getProduct(), coordinates.getVersionString(), coordinates.getBuild(), true);
		return Response.ok().build();
	}

	@DELETE
	@Path("/pin/{product}/{major}.{minor}.{servicePack}/{build}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response unPinABuild(@BeanParam final Coordinates coordinates) {

		setPinStateOfBuild(coordinates.getProduct(), coordinates.getVersionString(), coordinates.getBuild(), false);
		return Response.ok().build();
	}
}
