package io.github.orionhealth.xbdd.resources;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
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
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/stats")
public class Stats {

	@Autowired
	private DB mongoLegacyDb;

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

		final DBCollection collection = this.mongoLegacyDb.getCollection("features");
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
		final DBCollection collection = this.mongoLegacyDb.getCollection("summary");
		final DBObject productQuery = coordinates.getQueryObject(Field.PRODUCT, Field.MAJOR, Field.MINOR, Field.SERVICEPACK);
		final DBCursor results = collection.find(productQuery);

		while (results.hasNext()) {
			buildList = (List<String>) results.next().get("builds");
		}

		final DBCollection featureCollection = this.mongoLegacyDb.getCollection("features");

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
