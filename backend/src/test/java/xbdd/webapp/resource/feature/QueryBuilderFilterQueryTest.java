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
import com.mongodb.util.JSON;
import org.junit.Assert;
import org.junit.Test;
import xbdd.webapp.util.Coordinates;

import static org.hamcrest.Matchers.equalTo;

public class QueryBuilderFilterQueryTest {
	@Test
	public void noFiletersQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = (DBObject) JSON
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$and' : null}");
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 0, 0, null), equalTo(expected));
	}

	@Test
	public void passedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = (DBObject) JSON
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'passed'}]}");
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "", 1, 0, 0, 0, null), equalTo(expected));
	}

	@Test
	public void failedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = (DBObject) JSON
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'failed'}]}");
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 1, 0, 0, null), equalTo(expected));
	}

	@Test
	public void skippedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = (DBObject) JSON
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'skipped'}]}");
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 0, 1, null), equalTo(expected));
	}

	@Test
	public void undefinedFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = (DBObject) JSON
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$or' : [ { 'calculatedStatus' : 'undefined'}]}");
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 1, 0, null), equalTo(expected));
	}

	@Test
	public void searchFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = (DBObject) JSON
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$and' : [ { 'name' : { '$regex' : '.*this.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*is.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*a.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*test.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*filter.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*string.*' , '$options' : 'i'}}]}");
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "this is a test filter string", 0, 0, 0, 0, null),
				equalTo(expected));
	}

	@Test
	public void tagSearchFilterQuery() {
		final Coordinates co = new Coordinates();
		co.setBuild("test");
		co.setMajor(1);
		co.setMinor(1);
		co.setProduct("test");
		co.setServicePack(1);
		final DBObject expected = (DBObject) JSON
				.parse("{ 'coordinates.product' : 'test' , 'coordinates.major' : 1 , 'coordinates.minor' : 1 , 'coordinates.servicePack' : 1 , 'coordinates.build' : 'test' , '$and' : [ { 'tags.name' : { '$regex' : '.*@this.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*is.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*a.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*test.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*tag.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*filter.*' , '$options' : 'i'}} , { 'name' : { '$regex' : '.*string.*' , '$options' : 'i'}}]}");
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "@this is a test tag filter string", 0, 0, 0, 0, null),
				equalTo(expected));
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
		Assert.assertThat(QueryBuilder.getInstance().buildFilterQuery(co, "", 0, 0, 0, 0, ""), equalTo(expected));
	}

}
