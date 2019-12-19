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

import com.mongodb.*;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Path("/user")
public class User {

	private final MongoDBAccessor client;

	@Inject
	public User(final MongoDBAccessor client) {
		this.client = client;
	}

	@GET
	@Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
	@Consumes("application/json")
	public DBObject getTagsAssignment(@BeanParam final Coordinates coordinates) {
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("tagsAssignment");
		final BasicDBObject coq = coordinates.getReportCoordinatesQueryObject();
		final DBObject document = collection.findOne(coq);

		if (document != null) {
			final BasicDBList tags = (BasicDBList) document.get("tags");
			return tags;
		}
		return null;
	}

	@PUT
	@Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
	@Consumes("application/json")
	public Response putTagsAssignment(@BeanParam final Coordinates coordinates, final DBObject patch) {
		try {
			final DB db = this.client.getDB("bdd");
			final DBCollection collection = db.getCollection("tagsAssignment");
			final BasicDBObject coq = coordinates.getReportCoordinatesQueryObject();
			final BasicDBObject storedDocument = (BasicDBObject) collection.findOne(coq);

			final String tagName = (String) patch.get("tag");
			final String userName = (String) patch.get("userName");

			if (storedDocument != null) {
				final BasicDBObject documentToUpdate = (BasicDBObject) storedDocument.copy();
				updateTagsAssignment(documentToUpdate, tagName, userName);
				collection.save(documentToUpdate);
			} else {
				DBObject newDocument = generateNewTagAssignment(coordinates, tagName, userName);
				collection.save(newDocument);
			}
			return Response.ok().build();
		} catch (final Throwable th) {
			th.printStackTrace();
			return Response.serverError().build();
		}
	}

	private void updateTagsAssignment(final DBObject documentToUpdate, final String tagName, final String userName) {
		final BasicDBList tags = (BasicDBList) documentToUpdate.get("tags");
		for (Object fetchTag : tags) {
			String fetchTagName = (String) ((DBObject) fetchTag).get("tag");
			if (fetchTagName.equals(tagName)) {
				((DBObject) fetchTag).put("userName", userName);
				return;
			}
		}
		tags.add(generateNewTag(tagName, userName));
	}

	private DBObject generateNewTagAssignment(final Coordinates coordinates, final String tagName, final String userName) {
		final BasicDBObject co = coordinates.getReportCoordinates();
		final BasicDBObject newDocument = new BasicDBObject();
		final BasicDBList tags = new BasicDBList();
		final DBObject tag = generateNewTag(tagName, userName);

		tags.add(tag);

		newDocument.put("coordinates", co);
		newDocument.put("tags", tags);

		return newDocument;
	}

	private DBObject generateNewTag(String tagName, String userName) {
		final DBObject newTag = new BasicDBObject();

		newTag.put("tag", tagName);
		newTag.put("userName", userName);

		return newTag;
	}

	@GET
	@Path("/ignoredTags/{product}")
	@Consumes("application/json")
	public DBObject getIgnoredTags(@BeanParam final Coordinates coordinates) {
		final DB db = this.client.getDB("bdd");
		final DBCollection collection = db.getCollection("ignoredTags");
		final BasicDBObject coq = coordinates.getProductCoordinatesQueryObject();
		final DBObject document = collection.findOne(coq);

		if (document != null) {
			final BasicDBList tags = (BasicDBList) document.get("tags");
			return tags;
		}
		return null;
	}

	@PUT
	@Path("/ignoredTags/{product}")
	@Consumes("application/json")
	public Response putIgnoredTags(@BeanParam final Coordinates coordinates, final DBObject patch) {
		try {
			final DB db = this.client.getDB("bdd");
			final DBCollection collection = db.getCollection("ignoredTags");
			final BasicDBObject coq = coordinates.getProductCoordinatesQueryObject();
			final BasicDBObject storedDocument = (BasicDBObject) collection.findOne(coq);

			final String tagName = (String) patch.get("tagName");

			if (storedDocument != null) {
				final BasicDBObject documentToUpdate = (BasicDBObject) storedDocument.copy();
				updateIgnoredTag(documentToUpdate, tagName);
				collection.save(documentToUpdate);
			} else {
				DBObject newDocument = generateNewIgnoredTags(coordinates, tagName);
				collection.save(newDocument);
			}
			return Response.ok().build();
		} catch (final Throwable th) {
			th.printStackTrace();
			return Response.serverError().build();
		}
	}

	private void updateIgnoredTag(final BasicDBObject documentToUpdate, final String tagName) {
		final BasicDBList tags = (BasicDBList) documentToUpdate.get("tags");
		if (tags.contains(tagName)) {
			tags.remove(tagName);
		} else {
			tags.add(tagName);
		}
	}

	private DBObject generateNewIgnoredTags(final Coordinates coordinates, final String tagName) {
		final BasicDBObject co = coordinates.getProductCoordinates();
		final BasicDBObject newDocument = new BasicDBObject();
		final BasicDBList newTags = new BasicDBList();

		newTags.add(tagName);

		newDocument.put("coordinates", co);
		newDocument.put("tags", newTags);

		return newDocument;
	}

}
