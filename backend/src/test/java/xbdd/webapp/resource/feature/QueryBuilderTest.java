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
import com.mongodb.DBObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import xbdd.webapp.util.Coordinates;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

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

		@SuppressWarnings("unchecked") final List<DBObject> queryResults = (ArrayList<DBObject>) searchQuery.get("$or");

		assertTrue(queryResults.isEmpty());
	}

	@Test
	public void buildSimpleTestQuery() {
		final String[] searchCategories = { "name", "age" };
		final List<String> searchKeys = new ArrayList<>();
		searchKeys.add("hi");
		searchKeys.add("there");

		final BasicDBObject searchQuery = this.queryBuilder.getSearchQuery(searchKeys, this.coordinates, searchCategories);

		@SuppressWarnings("unchecked") final List<DBObject> queryResults = (ArrayList<DBObject>) searchQuery.get("$or");

		assertEquals("{\"name\": {\"$regex\": \"hi\", \"$options\": \"i\"}}", queryResults.get(0).toString());
		assertEquals("{\"age\": {\"$regex\": \"hi\", \"$options\": \"i\"}}", queryResults.get(1).toString());
		assertEquals("{\"name\": {\"$regex\": \"there\", \"$options\": \"i\"}}", queryResults.get(2).toString());
		assertEquals("{\"age\": {\"$regex\": \"there\", \"$options\": \"i\"}}", queryResults.get(3).toString());

	}
}
