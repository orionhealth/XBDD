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

import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.util.Coordinates;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

@RunWith(MockitoJUnitRunner.class)
public class SearchTest {

	private Search search;

	private Coordinates coordinates;

	@Mock
	private MongoDBAccessor client;
	@Mock
	private DB db;
	@Mock
	private DBCollection collection;
	@Mock
	private DBCursor cursor;

	@Before
	public void setup() {
		this.search = new Search(this.client);

		final DBObject coordinatesDBObj = new BasicDBObject();
		coordinatesDBObj.put("coordinates.product", "test");
		coordinatesDBObj.put("coordinates.major", 1);
		coordinatesDBObj.put("coordinates.minor", 0);
		coordinatesDBObj.put("coordinates.servicePack", 0);
		coordinatesDBObj.put("coordinates.build", "1");

		this.coordinates = new Coordinates(coordinatesDBObj);

		when(this.client.getDB(anyString())).thenReturn(this.db);
		when(this.db.getCollection(anyString())).thenReturn(this.collection);
		when(this.collection.find(any(DBObject.class))).thenReturn(this.cursor);
	}

	@Test
	public void restrictingResultSize() {

		final BasicDBObject dbObj = new BasicDBObject();
		when(this.cursor.hasNext()).thenAnswer(new Answer<Boolean>() {
			private int count = Search.SEARCH_LIMIT + 10;

			@Override
			public Boolean answer(final InvocationOnMock invocation) throws Throwable {
				if (this.count < 0) {
					return false;
				} else {
					this.count--;
					return true;
				}
			}
		});
		when(this.cursor.next()).thenReturn(dbObj);

		final BasicDBList searchResults = this.search.getSearchResults(this.coordinates, "hello");

		assertThat(searchResults.size(), is(Search.SEARCH_LIMIT));
	}

	@Test
	public void testQueryWithSearchWordHavingSpecialRegexMeaning() {
		when(this.cursor.hasNext()).thenReturn(false, false);

		final BasicDBList searchResults = this.search.getSearchResults(this.coordinates, "(");

		assertThat(searchResults, is(empty()));

	}
}
