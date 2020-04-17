package io.github.orionhealth.xbdd.resources;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;

import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/build-reorder")
public class BuildReOrdering {

	@Autowired
	private DB mongoLegacyDb;

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getBuildsForProductVersion(@BeanParam final Coordinates coordinates) {
		final DBCollection summaryCollection = this.mongoLegacyDb.getCollection("summary");
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
	public Response setBuildOrderForProductVersion(@BeanParam final Coordinates coordinates,
			final Builds json) {
		final DBCollection summaryCollection = this.mongoLegacyDb.getCollection("summary");
		final BasicDBObject query = new BasicDBObject("_id", coordinates.getProduct() + "/" + coordinates.getVersionString());
		summaryCollection.update(query, new BasicDBObject("$set", new BasicDBObject("builds", json.builds)));

		return Response.ok().build();
	}

	public static class Builds {
		public List<String> builds;
	}
}
