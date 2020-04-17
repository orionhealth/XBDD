package io.github.orionhealth.xbdd.resources;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.util.Coordinates;

public class QueryBuilderFilterQueryTest {
	@Test
	public void noFiletersQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = BasicDBObject
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$and' : null}");
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 0, 0, null), expected);
	}

	@Test
	public void passedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = BasicDBObject
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'passed'}]}");
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "", 1, 0, 0, 0, null), expected);
	}

	@Test
	public void failedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = BasicDBObject
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'failed'}]}");
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 1, 0, 0, null), expected);
	}

	@Test
	public void skippedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = BasicDBObject
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'skipped'}]}");
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 0, 1, null), expected);
	}

	@Test
	public void undefinedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = BasicDBObject
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'undefined'}]}");
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 1, 0, null), expected);
	}

	@Test
	public void searchFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = BasicDBObject
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$and' : [ { 'name' : { '$regex' : '.*this.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*is.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*a.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*test.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*filter.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*string.*' , '$options' : 'i'}}]}");
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "this is a test filter string", 0, 0, 0, 0, null),
				expected);
	}

	@Test
	public void tagSearchFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = BasicDBObject
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$and' : [ { 'tags.name' : { '$regex' : '.*@this.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*is.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*a.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*test.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*tag.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*filter.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*string.*' , '$options' : 'i'}}]}");
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "@this is a test tag filter string", 0, 0, 0, 0, null),
				expected);
	}

	@Test
	public void startNotNullQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = new BasicDBObject();
		expected.put("coordinates.product", "test");
		expected.put("coordinates.major", 1);
		expected.put("coordinates.minor", 1);
		expected.put("coordinates.servicePack", 1);
		expected.put("coordinates.build", "test");
		expected.put("uri", new BasicDBObject("$gt", ""));
		expected.put("$and", null);
		assertEquals(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 0, 0, ""), expected);
	}

}
