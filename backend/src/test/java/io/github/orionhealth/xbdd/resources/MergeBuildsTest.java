package io.github.orionhealth.xbdd.resources;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

import io.github.orionhealth.xbdd.resources.MergeBuilds.Merge;

@RunWith(MockitoJUnitRunner.class)
public class MergeBuildsTest {

	@InjectMocks
	private MergeBuilds mergeBuilds;

	@Mock
	private DB mongoLegacyDb;

	@Mock
	private DBCollection collection;

	@Mock
	private DBCursor cursor;

	private BasicDBObject feature1;
	private BasicDBObject feature2;
	private BasicDBObject feature3;

	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);

		this.feature1 = BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'passed'},'name' : 's2'}]}, {'id' : 'e2','description' : '','name' : 'e2','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'undefined'},'name' : 's2',}]}], 'coordinates' : {'product' : 'p1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'undefined', 'originalAutomatedStatus' : 'undefined'}");
		this.feature2 = BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'failed'},'name' : 's2'}]}, {'id' : 'e2','description' : '','name' : 'e2','steps' : [{'result' : {'status' : 'failed'},'name' : 's1',},{'result' : {'status' : 'undefined'},'name' : 's2',}]}], 'coordinates' : {'product' : 'p1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'failed', 'originalAutomatedStatus' : 'undefined'}");
		this.feature3 = BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's1',},{'result' : {'status' : 'undefined'},'name' : 's2'}]}, {'id' : 'e2','description' : '','name' : 'e2','steps' : [{'result' : {'status' : 'passed'},'name' : 's1',},{'result' : {'status' : 'passed'},'name' : 's2',}]}], 'coordinates' : {'product' : 'p1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build3','version' : '1.1.1'},'calculatedStatus' : 'undefined', 'originalAutomatedStatus' : 'undefined'}");

		when(this.mongoLegacyDb.getCollection(anyString())).thenReturn(this.collection);
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

		final DBObject result = BasicDBObject
				.parse("{'features' : [{'id' : 'f1', 'name' : 'f1', 'elements' : [ { 'id' : 'e1', 'name' : 'e1', 'statuses' : [ 'passed' , 'passed', 'failed', 'undefined']} , {'id' : 'e2', 'name' : 'e2', 'statuses' : ['failed', 'undefined' , 'failed', 'passed']}], 'statuses' : ['failed', 'undefined', 'failed', 'undefined'], 'url': 'reports/p1/1.1.1/{{BUILD_NAME}}/f1'}], 'builds':['Merged', 'build1', 'build2', 'build3']}");
		assertEquals(this.mergeBuilds.getMergedBuilds(merge), result);
	}
}
