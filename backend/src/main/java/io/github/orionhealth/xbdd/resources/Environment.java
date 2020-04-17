package io.github.orionhealth.xbdd.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/environment")
public class Environment {

	@Autowired
	private DB mongoLegacyDb;

	@GET
	@Path("/{product}")
	public Response getEnvironmentsForProduct(@PathParam("product") final String product) {
		final DBCollection collection = this.mongoLegacyDb.getCollection("environments");
		final DBObject rtn = collection.findOne(new BasicDBObject("coordinates.product", product));

		return Response.ok(SerializerUtil.serialise(rtn)).build();
	}
}
