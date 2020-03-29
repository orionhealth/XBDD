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

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.DuplicateKeyException;

@Path("/admin")
public class AdminUtils {

	private static final Logger LOGGER = Logger.getLogger(AdminUtils.class);

	@Autowired
	private DB mongoLegacyDb;

	@DELETE
	@Path("/delete/{product}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response softDeleteEntireProduct(@PathParam("product") final String product) {

		final DBCollection collection = this.mongoLegacyDb.getCollection("summary");
		final DBCollection targetCollection = this.mongoLegacyDb.getCollection("deletedSummary");

		final BasicDBObject query = new BasicDBObject("coordinates.product", product);

		final DBCursor cursor = collection.find(query);
		DBObject doc;

		while (cursor.hasNext()) {
			doc = cursor.next();
			// kill the old id
			doc.removeField("_id");
			try {
				targetCollection.insert(doc);
			} catch (final Throwable e) {
				return Response.status(500).build();
			}
		}

		collection.remove(query);

		return Response.ok().build();
	}

	@DELETE
	@Path("/delete/{product}/{version}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response softDeleteSingleVersion(@PathParam("product") final String product,
			@PathParam("version") final String version) {

		final DBCollection collection = this.mongoLegacyDb.getCollection("summary");
		final DBCollection targetCollection = this.mongoLegacyDb.getCollection("deletedSummary");

		final Pattern productReg = java.util.regex.Pattern.compile("^" + product + "/" + version + "$");
		final BasicDBObject query = new BasicDBObject("_id", productReg);

		final DBCursor cursor = collection.find(query);
		DBObject doc;

		while (cursor.hasNext()) {
			doc = cursor.next();
			// kill the old id
			doc.removeField("_id");
			try {
				targetCollection.insert(doc);
			} catch (final Throwable e) {
				return Response.status(500).build();
			}
		}

		collection.remove(query);

		return Response.ok().build();
	}

	@DELETE
	@Path("/delete/{product}/{version}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response softDeleteSingleBuild(@PathParam("product") final String product,
			@PathParam("build") final String build,
			@PathParam("version") final String version) {

		final DBCollection collection = this.mongoLegacyDb.getCollection("summary");
		final DBCollection targetCollection = this.mongoLegacyDb.getCollection("deletedSummary");

		final Pattern productReg = java.util.regex.Pattern.compile("^" + product + "/" + version + "$");
		final BasicDBObject query = new BasicDBObject("_id", productReg);

		final DBCursor cursor = collection.find(query);

		while (cursor.hasNext()) {
			final DBObject doc = cursor.next();
			final DBObject backupDoc = doc;
			// Make sure the backup document only has the deleted build number
			try {
				final String[] singleBuild = { build };
				backupDoc.put("builds", singleBuild);
				targetCollection.insert(backupDoc);
			} catch (final DuplicateKeyException e) {
				// The backup document already exists, possibly already deleted a build
				// Lets add the deleted build to the existing document
				targetCollection.update(new BasicDBObject("_id", backupDoc.get("_id")),
						new BasicDBObject("$push", new BasicDBObject("builds", build)));
			} catch (final Exception e) {
				return Response.serverError().build();
			}
			// Remove the build number from the current document and push it back into the collection
			try {
				collection.update(new BasicDBObject("_id", doc.get("_id")), new BasicDBObject("$pull", new BasicDBObject("builds", build)));
			} catch (final Exception e) {
				LOGGER.error(e);
				return Response.serverError().build();
			}
		}
		return Response.ok().build();
	}

	// Lets register the helper class that replaces the instances of the old product name with the new one
	private DBObject renameDoc(final String product, final String newname, final DBObject doc) {
		doc.put("_id", ((String) doc.get("_id")).replaceAll(product + "/", newname + "/"));
		if (doc.containsField("coordinates")) {
			final DBObject coordinates = (DBObject) doc.get("coordinates");
			coordinates.put("product", newname);
			doc.put("coordinates", coordinates);
		}
		return doc;
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/{product}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response renameProduct(@PathParam("product") final String product,
			final Product renameObject) {

		final List<DBCollection> collections = Arrays
				.asList(this.mongoLegacyDb.getCollection("summary"), this.mongoLegacyDb.getCollection("features"),
						this.mongoLegacyDb.getCollection("reportStats"),
						this.mongoLegacyDb.getCollection("testingTips"));

		final Pattern productReg = Pattern.compile("^" + product + "/");
		final BasicDBObject query = new BasicDBObject("_id", productReg);

		// Before anything lets check the new name isn't already in use

		final BasicDBObject existsQuery = new BasicDBObject("_id", Pattern.compile("^" + renameObject.name + "/"));
		final int summaryCount = this.mongoLegacyDb.getCollection("summary").find(existsQuery).count();
		final int delCount = this.mongoLegacyDb.getCollection("deletedSummary").find(existsQuery).count();

		if (delCount + summaryCount != 0) {
			throw new WebApplicationException();
		}

		// We need to rename the product everywhere
		// First up are all the collection with the product in the _id attribute
		for (final DBCollection collectioni : collections) {
			final DBCursor cursor = collectioni.find(query);
			while (cursor.hasNext()) {
				DBObject doc = cursor.next();
				final String id = (String) doc.get("_id");
				doc = renameDoc(product, renameObject.name, doc);
				collectioni.insert(doc);
				collectioni.remove(new BasicDBObject("_id", id));
			}
		}

		// Then we deal with the environments collection where only the coordinates.product is set
		final DBCollection[] noIDCollections = { this.mongoLegacyDb.getCollection("environments"),
				this.mongoLegacyDb.getCollection("deletedSummary") };
		final BasicDBObject enviroQuery = new BasicDBObject("coordinates.product", product);

		for (final DBCollection noIDCollection : noIDCollections) {
			final DBCursor enviroCursor = noIDCollection.find(enviroQuery);

			while (enviroCursor.hasNext()) {
				final DBObject doc = enviroCursor.next();
				final DBObject coordinates = (DBObject) doc.get("coordinates");
				coordinates.put("product", renameObject.name);
				final DBObject updateDoc = new BasicDBObject("$set", new BasicDBObject("coordinates", coordinates));
				noIDCollection.update(new BasicDBObject("_id", doc.get("_id")), updateDoc);
			}
		}

		// Then we correct the name in any users favourites object
		final DBCollection userCollection = this.mongoLegacyDb.getCollection("users");
		final BasicDBObject favouriteQuery = new BasicDBObject("favourites." + product, new BasicDBObject("$exists", true));
		final DBCursor users = userCollection.find(favouriteQuery);

		while (users.hasNext()) {
			final DBObject doc = users.next();
			final DBObject favs = (DBObject) doc.get("favourites");
			favs.put(renameObject.name, favs.get(product));
			final BasicDBObject updateDoc = new BasicDBObject("$set", new BasicDBObject("favourites", favs));
			updateDoc.put("$unset", new BasicDBObject(product, ""));
			userCollection.update(new BasicDBObject("_id", doc.get("_id")), updateDoc);
		}

		return Response.ok().build();
	}

	public static class Product {
		public String name;
	}
}
