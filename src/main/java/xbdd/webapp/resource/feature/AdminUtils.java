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

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import xbdd.webapp.factory.MongoDBAccessor;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.DuplicateKeyException;

@Path("/rest/admin")
public class AdminUtils {

	private final MongoDBAccessor client;

	@Inject
	public AdminUtils(final MongoDBAccessor client,
			@Context final HttpServletRequest req) {
		this.client = client;
		if (!req.isUserInRole("admin")) {
			throw new WebApplicationException();
		}
	}
	
	@DELETE
	@Path("/delete/{product}")
	@Produces("application/json")
	public Response softDeleteEntireProduct(@PathParam("product") final String product,
			@Context final HttpServletRequest req,
			@Context final HttpServletResponse response) throws IOException {
		
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("summary");
		final DBCollection targetCollection = db.getCollection("deletedSummary");
		
		final BasicDBObject query = new BasicDBObject("coordinates.product",product);
		
		final DBCursor cursor = collection.find(query);
		DBObject doc;
		
		while(cursor.hasNext()) {
			doc = cursor.next();
			//kill the old id
			doc.removeField("_id");
			try {
				targetCollection.insert(doc);
			} catch (Throwable e) {
				return Response.status(500).build();
			}
		}
		
		collection.remove(query);
		
		return Response.ok().build();
	}
	
	@DELETE
	@Path("/delete/{product}/{version}")
	@Produces("application/json")
	public Response softDeleteSingleVersion(@PathParam("product") final String product,
			@PathParam("version") final String version,
			@Context final HttpServletRequest req,
			@Context final HttpServletResponse response) throws IOException {
		
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("summary");
		final DBCollection targetCollection = db.getCollection("deletedSummary");
		
		final Pattern productReg = java.util.regex.Pattern.compile("^"+product+"/"+version+"$");
		final BasicDBObject query = new BasicDBObject("_id", productReg);
		
		final DBCursor cursor = collection.find(query);
		DBObject doc;
		
		while(cursor.hasNext()) {
			doc = cursor.next();
			//kill the old id
			doc.removeField("_id");
			try {
				targetCollection.insert(doc);
			} catch (Throwable e) {
				return Response.status(500).build();
			}
		}
		
		collection.remove(query);
		
		return Response.ok().build();
	}
	
	@DELETE
	@Path("/delete/{product}/{version}/{build}")
	@Produces("application/json")
	public Response softDeleteSingleBuild(@PathParam("product") final String product,
			@PathParam("build") final String build,
			@PathParam("version") final String version,
			@Context final HttpServletRequest req,
			@Context final HttpServletResponse response) throws IOException {
		
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("summary");
		final DBCollection targetCollection = db.getCollection("deletedSummary");
		
		final Pattern productReg = java.util.regex.Pattern.compile("^"+product+"/"+version+"$");
		final BasicDBObject query = new BasicDBObject("_id", productReg);
		
		final DBCursor cursor = collection.find(query);
		
		while (cursor.hasNext()) {
			DBObject doc = cursor.next();
			DBObject backupDoc = doc;
			//Make sure the backup document only has the deleted build number
			try {
				final String[] singleBuild = {build};
				backupDoc.put("builds", singleBuild);
				targetCollection.insert(backupDoc);
			} catch (DuplicateKeyException e) {
				//The backup document already exists, possibly already deleted a build
				//Lets add the deleted build to the existing document
				targetCollection.update(new BasicDBObject("_id",backupDoc.get("_id")), new BasicDBObject("$push", new BasicDBObject("builds",build)));
			} catch(Exception e) {
				return Response.status(500).build();
			}
			//Remove the build number from the current document and push it back into the collection
			try {
				collection.update(new BasicDBObject("_id",doc.get("_id")), new BasicDBObject("$pull",new BasicDBObject("builds", build)));
			} catch(Exception e) {
				System.out.println(e);
				return Response.status(500).build();
			}
		}
		return Response.ok().build();
	}

	
	//Lets register the helper class that replaces the instances of the old product name with the new one
	private DBObject renameDoc(String product, String newname, DBObject doc) {
		doc.put("_id", ((String) doc.get("_id")).replaceAll(product+"/", newname+"/"));
		if (doc.containsField("coordinates")) {
			DBObject coordinates = (DBObject) doc.get("coordinates");
			coordinates.put("product",newname);
			doc.put("coordinates", coordinates);
		}
		return doc;
	}
	
	public static class Product {
	    public String name;
	}
	
	@PUT @Consumes(MediaType.APPLICATION_JSON)
	@Path("/{product}")
	@Produces("application/json")
	public Response renameProduct(@PathParam("product") final String product,
			final Product renameObject) {
		
		final DB db = this.client.getDB("bdd");
		final List<DBCollection> collections = Arrays.asList(db.getCollection("summary"), db.getCollection("features"), db.getCollection("reportStats"), db.getCollection("testingTips"));
		
		final Pattern productReg = Pattern.compile("^"+product+"/");
		final BasicDBObject query = new BasicDBObject("_id", productReg);
		
		//Before anything lets check the new name isn't already in use
		
		final BasicDBObject existsQuery = new BasicDBObject("_id", Pattern.compile("^"+renameObject.name+"/"));
		final int summaryCount = db.getCollection("summary").find(existsQuery).count();
		final int delCount = db.getCollection("deletedSummary").find(existsQuery).count();
		
		if (delCount + summaryCount != 0) {
			throw new WebApplicationException();
		}
		
		//We need to rename the product everywhere
		//First up are all the collection with the product in the _id attribute
		for (DBCollection collectioni : collections) {
			DBCursor cursor = collectioni.find(query);
			while(cursor.hasNext()) {
				DBObject doc = cursor.next();
				String id = (String) doc.get("_id");
				doc = renameDoc(product, renameObject.name, doc);
				collectioni.insert(doc);
				collectioni.remove(new BasicDBObject("_id", id));
			}
		}
		
		//Then we deal with the environments collection where only the coordinates.product is set
		final DBCollection[] noIDCollections = {db.getCollection("environments"),db.getCollection("deletedSummary")};
		final BasicDBObject enviroQuery = new BasicDBObject("coordinates.product", product);
		
		for (int i=0;i<noIDCollections.length;i++) {
			final DBCursor enviroCursor = noIDCollections[i].find(enviroQuery);
			
			while (enviroCursor.hasNext()) {
				DBObject doc = enviroCursor.next();
				DBObject coordinates = (DBObject) doc.get("coordinates");
				coordinates.put("product",renameObject.name);
				DBObject updateDoc = new BasicDBObject("$set", new BasicDBObject("coordinates", coordinates));
				noIDCollections[i].update(new BasicDBObject("_id", doc.get("_id")), updateDoc);
			}
		}
		
		//Then we correct the name in any users favourites object
		final DBCollection userCollection = db.getCollection("users");
		final BasicDBObject favouriteQuery = new BasicDBObject("favourites."+product, new BasicDBObject("$exists",true));
		final DBCursor users = userCollection.find(favouriteQuery);
		
		while(users.hasNext()) {
			DBObject doc = users.next();
			DBObject favs = (DBObject) doc.get("favourites");
			favs.put(renameObject.name, favs.get(product));
			BasicDBObject updateDoc = new BasicDBObject("$set",new BasicDBObject("favourites",favs));
			updateDoc.put("$unset", new BasicDBObject(product, ""));
			userCollection.update(new BasicDBObject("_id", doc.get("_id")), updateDoc);
		}
		
		return Response.ok().build();
	}
}
