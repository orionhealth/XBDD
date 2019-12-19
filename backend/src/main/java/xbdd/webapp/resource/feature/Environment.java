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

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import xbdd.webapp.factory.MongoDBAccessor;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

@Path("/environment")
public class Environment {

	private final MongoDBAccessor client;

	@Inject
	public Environment(final MongoDBAccessor client) {
		this.client = client;
	}

	@GET
	@Path("/{product}")
	public DBObject getEnvironmentsForProduct(@PathParam("product") final String product) {
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("environments");
		return collection.findOne(new BasicDBObject("coordinates.product", product));

	}
}
