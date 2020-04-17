package io.github.orionhealth.xbdd.resources;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.mongodb.BasicDBList;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.util.Coordinates;
import io.github.orionhealth.xbdd.util.SerializerUtil;

@Path("/search")
public class Search {

	public final static int SEARCH_LIMIT = 50;

	@Autowired
	private DB mongoLegacyDb;

	@GET
	@Path("/{product}/{major}.{minor}.{servicePack}/{build}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSearchResults(@BeanParam final Coordinates coordinates, @QueryParam("keywords") final String keyword) {
		final String[] searchCategories = { "name", "description", "tags.name", "elements.name", "elements.description",
				"elements.steps.name", "elements.tags.name" };
		final List<String> searchWords = Arrays.asList(keyword.split("\\s+"));
		final DBCollection collection = this.mongoLegacyDb.getCollection("features");
		final List<DBObject> searchResults = new ArrayList<>();

		final io.github.orionhealth.xbdd.resources.QueryBuilder queryBuilder = QueryBuilder.getInstance();
		final DBCursor results = collection.find(queryBuilder.getSearchQuery(searchWords, coordinates, searchCategories));

		while (results.hasNext()) {
			final DBObject doc = results.next();
			searchResults.add(doc);
		}

		searchResults.sort(new DBObjectComparator(searchWords));

		while (searchResults.size() > SEARCH_LIMIT) {
			searchResults.remove(searchResults.size() - 1);
		}

		final BasicDBList basicDBList = new BasicDBList();
		basicDBList.addAll(searchResults);

		return Response.ok(SerializerUtil.serialise(basicDBList)).build();
	}
}
