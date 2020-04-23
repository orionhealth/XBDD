package io.github.orionhealth.xbdd.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

@RunWith(MockitoJUnitRunner.class)
public class QueryBuilderTest {

	private QueryBuilder queryBuilder;

	private Coordinates coordinates;

	@Before
	public void setup() {
		this.queryBuilder = QueryBuilder.getInstance();

		final DBObject coordinatesDBObj = new BasicDBObject();
		coordinatesDBObj.put("coordinates.product", "test");
		coordinatesDBObj.put("coordinates.major", 1);
		coordinatesDBObj.put("coordinates.minor", 0);
		coordinatesDBObj.put("coordinates.servicePack", 0);
		coordinatesDBObj.put("coordinates.build", "1");

		this.coordinates = new Coordinates(coordinatesDBObj);
	}

	@Test
	public void buildTestQueryWithEmptySearch() {
		final String[] searchCategories = { "name", "age" };
		final List<String> searchKeys = new ArrayList<>();
		searchKeys.add("");

		final BasicDBObject searchQuery = this.queryBuilder.getSearchQuery(searchKeys, this.coordinates, searchCategories);

		@SuppressWarnings("unchecked")
		final List<DBObject> queryResults = (ArrayList<DBObject>) searchQuery.get("$or");

		assertTrue(queryResults.isEmpty());
	}

	@Test
	public void buildSimpleTestQuery() {
		final String[] searchCategories = { "name", "age" };
		final List<String> searchKeys = new ArrayList<>();
		searchKeys.add("hi");
		searchKeys.add("there");

		final BasicDBObject searchQuery = this.queryBuilder.getSearchQuery(searchKeys, this.coordinates, searchCategories);

		@SuppressWarnings("unchecked")
		final List<DBObject> queryResults = (ArrayList<DBObject>) searchQuery.get("$or");

		assertEquals("{\"name\": {\"$regex\": \"hi\", \"$options\": \"i\"}}", queryResults.get(0).toString());
		assertEquals("{\"age\": {\"$regex\": \"hi\", \"$options\": \"i\"}}", queryResults.get(1).toString());
		assertEquals("{\"name\": {\"$regex\": \"there\", \"$options\": \"i\"}}", queryResults.get(2).toString());
		assertEquals("{\"age\": {\"$regex\": \"there\", \"$options\": \"i\"}}", queryResults.get(3).toString());

	}
}
