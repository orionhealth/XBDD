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
package xbdd.webapp.resource.feature;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.SerializerUtil;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("/environment")
public class Environment {

	private final MongoDBAccessor client;

	@Inject
	public Environment(final MongoDBAccessor client) {
		this.client = client;
	}

	@GET
	@Path("/{product}")
	public Response getEnvironmentsForProduct(@PathParam("product") final String product) {
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("environments");
		final DBObject rtn = collection.findOne(new BasicDBObject("coordinates.product", product));
		
		return Response.ok(SerializerUtil.serialise(rtn)).build();
	}
}
