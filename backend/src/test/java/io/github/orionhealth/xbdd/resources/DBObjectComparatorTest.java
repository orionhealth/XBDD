package io.github.orionhealth.xbdd.resources;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.Collections;

import org.junit.Before;
import org.junit.Test;

import com.mongodb.BasicDBObject;

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
		assertTrue(comparison1 < 0);
		final int comparison2 = this.dbObjectComparator.compare(null, dbObj);
		assertTrue(comparison2 > 0);
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
		assertTrue(comparison1 < 0);
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertTrue(comparison2 > 0);
	}

	@Test
	public void twoDBObjectsMultipleWordAttribute() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "these are some random words to test");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "these are some other words to test");
		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertTrue(comparison1 < 0);
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertTrue(comparison2 > 0);
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
		assertTrue(comparison1 < 0);
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertTrue(comparison2 > 0);
	}

	@Test
	public void countRegexMatchesAll() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "these are some random words to test")
				.append("Attr2", "these are some more search words")
				.append("Attr3", "and some more words");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "these are some other words to test");

		this.dbObjectComparator = new DBObjectComparator(Arrays.asList("random", ".*", "\\d+"));

		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertEquals(comparison1, 0);
	}

	@Test
	public void countRegexMatchesSomePattern() {
		final BasicDBObject dbObj = new BasicDBObject("Attr1", "1")
				.append("Attr2", "12")
				.append("Attr3", "1234");
		final BasicDBObject otherDBObj = new BasicDBObject("Attr1", "12a34 56x78");

		this.dbObjectComparator = new DBObjectComparator(Collections.singletonList("\\d+"));

		final int comparison1 = this.dbObjectComparator.compare(dbObj, otherDBObj);
		assertTrue(comparison1 < 0);
		final int comparison2 = this.dbObjectComparator.compare(otherDBObj, dbObj);
		assertTrue(comparison2 > 0);
	}
}
