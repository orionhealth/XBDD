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

import java.util.ArrayList;

import javax.inject.Inject;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.factory.MongoDBAccessor;
import io.github.orionhealth.xbdd.model.common.TagAssignmentPatch;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/user")
public class User {

	private final MongoDBAccessor client;

	@Inject
	public User() {
		this.client = new MongoDBAccessor();
	}

	@GET
	@Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTagsAssignment(@BeanParam final Coordinates coordinates) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("tagsAssignment");
		final BasicDBObject coq = coordinates.getReportCoordinatesQueryObject();
		final DBObject document = collection.findOne(coq);

		if (document != null) {
			final BasicDBList tags = (BasicDBList) document.get("tags");
			return Response.ok(SerializerUtil.serialise(tags)).build();
		}

		return Response.ok(new ArrayList<>()).build();
	}

	@PUT
	@Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putTagsAssignment(@BeanParam final Coordinates coordinates, final TagAssignmentPatch tagPatch) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("tagsAssignment");
		final BasicDBObject coq = coordinates.getReportCoordinatesQueryObject();
		final BasicDBObject storedDocument = (BasicDBObject) collection.findOne(coq);

		if (storedDocument != null) {
			final BasicDBObject documentToUpdate = (BasicDBObject) storedDocument.copy();
			updateTagsAssignment(documentToUpdate, tagPatch.getTag(), tagPatch.getUserName());
			collection.save(documentToUpdate);
		} else {
			final DBObject newDocument = generateNewTagAssignment(coordinates, tagPatch.getTag(), tagPatch.getUserName());
			collection.save(newDocument);
		}
		return Response.ok().build();
	}

	private void updateTagsAssignment(final DBObject documentToUpdate, final String tagName, final String userName) {
		final BasicDBList tags = (BasicDBList) documentToUpdate.get("tags");
		for (final Object fetchTag : tags) {
			final String fetchTagName = (String) ((DBObject) fetchTag).get("tag");
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

	private DBObject generateNewTag(final String tagName, final String userName) {
		final DBObject newTag = new BasicDBObject();

		newTag.put("tag", tagName);
		newTag.put("userName", userName);

		return newTag;
	}

	@GET
	@Path("/ignoredTags/{product}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getIgnoredTags(@BeanParam final Coordinates coordinates) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("ignoredTags");
		final BasicDBObject coq = coordinates.getProductCoordinatesQueryObject();
		final DBObject document = collection.findOne(coq);

		if (document != null) {
			final BasicDBList tags = (BasicDBList) document.get("tags");
			return Response.ok(SerializerUtil.serialise(tags)).build();
		}
		return Response.ok(new ArrayList<>()).build();
	}

	@PUT
	@Path("/ignoredTags/{product}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putIgnoredTags(@BeanParam final Coordinates coordinates, final BasicDBObject patch) {
		final DB db = this.client.getDB();
		final DBCollection collection = db.getCollection("ignoredTags");
		final BasicDBObject coq = coordinates.getProductCoordinatesQueryObject();
		final BasicDBObject storedDocument = (BasicDBObject) collection.findOne(coq);

		final String tagName = (String) patch.get("tagName");

		if (storedDocument != null) {
			final BasicDBObject documentToUpdate = (BasicDBObject) storedDocument.copy();
			updateIgnoredTag(documentToUpdate, tagName);
			collection.save(documentToUpdate);
		} else {
			final DBObject newDocument = generateNewIgnoredTags(coordinates, tagName);
			collection.save(newDocument);
		}
		return Response.ok().build();
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
