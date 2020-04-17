package io.github.orionhealth.xbdd.resources;

import java.util.ArrayList;

import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.model.common.SingleTagAssignment;
import io.github.orionhealth.xbdd.model.common.User;
import io.github.orionhealth.xbdd.persistence.TagAssignmentDao;
import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.LoggedInUserUtil;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/user")
public class UserResource {

	@Autowired
	private DB mongoLegacyDb;

	@Autowired
	private TagAssignmentDao tagAssignmentDao;

	@GET
	@Path("/loggedin")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getLoggedInUser() {
		return Response.ok(LoggedInUserUtil.getLoggedInUser()).build();
	}

	@GET
	@Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTagsAssignment(@BeanParam final Coordinates coordinates) {
		return Response.ok(this.tagAssignmentDao.getTagAssignments(coordinates)).build();
	}

	@PUT
	@Path("/tagAssignment/{product}/{major}.{minor}.{servicePack}/{build}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response putTagsAssignment(@BeanParam final Coordinates coordinates, final SingleTagAssignment singleTagAssignment) {
		final User user = LoggedInUserUtil.getLoggedInUser();

		singleTagAssignment.setUserId(user.getUserId());
		singleTagAssignment.setSocialLogin(user.getSocialLogin());
		singleTagAssignment.setLoginType(user.getLoginType());
		singleTagAssignment.setDisplay(LoggedInUserUtil.getLoggedInUser().getDisplay());

		this.tagAssignmentDao.saveTagAssignment(coordinates, singleTagAssignment);
		return Response.ok().build();
	}

	@GET
	@Path("/ignoredTags/{product}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getIgnoredTags(@BeanParam final Coordinates coordinates) {
		final DBCollection collection = this.mongoLegacyDb.getCollection("ignoredTags");
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
		final DBCollection collection = this.mongoLegacyDb.getCollection("ignoredTags");
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
