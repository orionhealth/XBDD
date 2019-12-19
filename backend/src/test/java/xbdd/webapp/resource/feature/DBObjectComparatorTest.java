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
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class DBObjectComparatorTest {
	private DBObjectComparator dbObjectComparator;

	@Before
	public void setup() {
		this.dbObjectComparator = new DBObjectComparator(Arrays.asList("random", "search", "words"));
	}

	@Test
	public void compareToNull() {
		final int actual = this.dbObjectComparator.compare(null, null);
		assertEquals(0, actual);
	}

	@Test
	public void compareSingleNull() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "random");
		final int comparison1 = this.dbObjectComparator.compare(dbObj, null);
		assertThat(comparison1, lessThanOrEqualTo(-1));
		final int comparison2 = this.dbObjectComparator.compare(null, dbObj);
		assertThat(comparison2, greaterThanOrEqualTo(1));
	}

	@Test
	public void singleDBObjectSingleWordAttribute() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "random");
		final int actual = this.dbObjectComparator.compare(dbObj, dbObj);
		assertEquals(0, actual);
	}

	@Test
	public void twoDBObjectsSingleWordAttribute() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "random");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "other");
		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertThat(comparison1, lessThanOrEqualTo(-1));
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertThat(comparison2, greaterThanOrEqualTo(1));
	}

	@Test
	public void twoDBObjectsMultipleWordAttribute() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "these are some random words to test");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "these are some other words to test");
		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertThat(comparison1, lessThanOrEqualTo(-1));
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertThat(comparison2, greaterThanOrEqualTo(1));
	}

	@Test
	public void twoDBObjectsMultipleWordAttributes() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "these are some random words to test")
				.append("Attr2", "these are some more search words")
				.append("Attr3", "and some more words");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "these are some other words to test")
				.append("Attr2", "these are some more none key string")
				.append("Attr3", "they are boring to read");
		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertThat(comparison1, lessThanOrEqualTo(-1));
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertThat(comparison2, greaterThanOrEqualTo(1));
	}

	@Test
	public void countRegexMatchesAll() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "these are some random words to test")
				.append("Attr2", "these are some more search words")
				.append("Attr3", "and some more words");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "these are some other words to test");

		this.dbObjectComparator = new DBObjectComparator(Arrays.asList("random", ".*", "\\d+"));

		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertThat(comparison1, is(0));
	}

	@Test
	public void countRegexMatchesSomePattern() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "1")
				.append("Attr2", "12")
				.append("Attr3", "1234");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "12a34 56x78");

		this.dbObjectComparator = new DBObjectComparator(Collections.singletonList("\\d+"));

		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertThat(comparison1, lessThanOrEqualTo(-1));
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertThat(comparison2, greaterThanOrEqualTo(1));
	}
}
