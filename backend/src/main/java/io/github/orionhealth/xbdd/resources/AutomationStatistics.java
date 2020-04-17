package io.github.orionhealth.xbdd.resources;

import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
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
import io.github.orionhealth.xbdd.util.Field;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/automation-statistics")
public class AutomationStatistics {

	@Autowired
	private DB mongoLegacyDb;

	@GET
	@Path("/recent-builds/{product}")
	public Response getRecentBuildStatsForProduct(@BeanParam final Coordinates coordinates, @QueryParam("limit") final Integer limit) {
		final BasicDBList returns = new BasicDBList();
		final DBCollection collection = this.mongoLegacyDb.getCollection("reportStats");
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
		return Response.ok(SerializerUtil.serialise(returns)).build();
	}

	/**
	 * Go through the prior versions of this product; for each version, find the latest build and contribute the stats for that to the
	 * returned list.
	 */
	@GET
	@Path("/recent-versions/{product}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRecentVersionStatsForProduct(@BeanParam final Coordinates coordinates, @QueryParam("limit") final Integer limit) {
		final BasicDBList returns = new BasicDBList();

		final DBCollection summaryCollection = this.mongoLegacyDb.getCollection("summary");
		final DBCollection reportStatsCollection = this.mongoLegacyDb.getCollection("reportStats");
		final DBCursor versions = summaryCollection.find(coordinates.getQueryObject(Field.PRODUCT))
				.sort(Coordinates.getFeatureSortingObject());
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

		return Response.ok(SerializerUtil.serialise(returns)).build();
	}

}
