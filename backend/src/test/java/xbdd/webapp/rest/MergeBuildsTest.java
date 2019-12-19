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
package xbdd.webapp.rest;

import com.mongodb.*;
import com.mongodb.util.JSON;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import xbdd.webapp.factory.MongoDBAccessor;
import xbdd.webapp.rest.MergeBuilds.Merge;

import java.util.ArrayList;
import java.util.Arrays;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MergeBuildsTest {

	@Mock
	private MongoDBAccessor client;
	@Mock
	private DB db;
	@Mock
	private DBCollection collection;
	@Mock
	private DBCursor cursor;

	private MergeBuilds mergeBuilds;
	private BasicDBObject feature1;
	private BasicDBObject feature2;
	private BasicDBObject feature3;

	@Before
	public void setup() {
		this.mergeBuilds = new MergeBuilds(this.client);

		this.feature1 = (BasicDBObject) JSON
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'passed'},'name' : 's2'}]}, {'id' : 'e2','description' : '','name' : 'e2','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'undefined'},'name' : 's2',}]}], 'coordinates' : {'product' : 'p1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'undefined', 'originalAutomatedStatus' : 'undefined'}");
		this.feature2 = (BasicDBObject) JSON
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'failed'},'name' : 's2'}]}, {'id' : 'e2','description' : '','name' : 'e2','steps' : [{'result' : {'status' : 'failed'},'name' : 's1',},{'result' : {'status' : 'undefined'},'name' : 's2',}]}], 'coordinates' : {'product' : 'p1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'failed', 'originalAutomatedStatus' : 'undefined'}");
		this.feature3 = (BasicDBObject) JSON
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's1',},{'result' : {'status' : 'undefined'},'name' : 's2'}]}, {'id' : 'e2','description' : '','name' : 'e2','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'passed'},'name' : 's2',}]}], 'coordinates' : {'product' : 'p1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build3','version' : '1.1.1'},'calculatedStatus' : 'undefined', 'originalAutomatedStatus' : 'undefined'}");

		when(this.client.getDB(anyString())).thenReturn(this.db);
		when(this.db.getCollection(anyString())).thenReturn(this.collection);
		when(this.collection.find(any(DBObject.class), any(DBObject.class))).thenReturn(this.cursor);
		when(this.cursor.hasNext()).thenReturn(true, true, true, false);
	}

	@Test
	public void test() {
		final Merge merge = new Merge();
		final String[] builds = { "build1", "build2", "build3" };
		merge.builds = new ArrayList<String>();
		merge.builds.addAll(Arrays.asList(builds));

		when(this.cursor.next()).thenReturn(this.feature1, this.feature2, this.feature3);

		final DBObject result = (BasicDBObject) JSON
				.parse("{'features' : [{'id' : 'f1', 'name' : 'f1', 'elements' : [ { 'id' : 'e1', 'name' : 'e1', 'statuses' : [ 'passed' , 'passed', 'failed', 'undefined']} , {'id' : 'e2', 'name' : 'e2', 'statuses' : ['failed', 'undefined' , 'failed', 'passed']}], 'statuses' : ['failed', 'undefined', 'failed', 'undefined'], 'url': 'reports/p1/1.1.1/{{BUILD_NAME}}/f1'}], 'builds':['Merged', 'build1', 'build2', 'build3']}");
		assertThat(this.mergeBuilds.getMergedBuilds(merge), is(result));
	}
}
