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
package xbdd.util;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import org.junit.Test;
import xbdd.model.MergeFeature;
import xbdd.model.simple.Feature;

import java.util.Arrays;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class MultipleBuildsFeatureMergeHelperTest {

	@Test
	public void featureNoScenarios() {
		final Feature feature = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature);
		assertThat(target.getMergeFeature(feature.getId()).getStatuses().get(0), is(Statuses.UNKNOWN.getTextName()));
	}

	@Test
	public void noFeatureAdded() {
		final Feature feature = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 'e2',},{'result' : {'status' : 'passed'},'name' : 'e3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));

		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		final MergeFeature isNull = null;
		assertThat(target.getMergeFeature(feature.getId()), is(isNull));
	}

	@Test
	public void featureAddedPassed() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3',}],},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3',}],},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertThat(target.getMergeFeature(feature1.getId()).getStatuses().get(0), is(Statuses.PASSED.getTextName()));
	}

	@Test
	public void featureAddedFailed() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'failed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertThat(target.getMergeFeature(feature1.getId()).getStatuses().get(0), is(Statuses.FAILED.getTextName()));
	}

	@Test
	public void featureAddedUndefined() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'failed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertThat(target.getMergeFeature(feature1.getId()).getStatuses().get(0), is(Statuses.UNDEFINED.getTextName()));
	}

	@Test
	public void scenarioNoSteps() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1'}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'failed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertThat(target.getMergeFeature(feature1.getId()).getScenarios().get(0).getStatuses().get(0), is(Statuses.UNKNOWN.getTextName()));
	}

	@Test
	public void featuresDontContainBuild() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build0", "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		final MergeFeature isNull = null;
		assertThat(target.getMergeFeature(feature1.getId()), is(isNull));
	}

	@Test
	public void featureAddedUnknown() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'failed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertThat(target.getMergeFeature(feature1.getId()).getStatuses().get(0), is(Statuses.UNKNOWN.getTextName()));
	}

	@Test
	public void featuresFromTheSameBuild() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f2','id' : 'f2','description' : '' ,'name' : 'f2', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertThat(target.getMergeFeature(feature1.getId()).getStatuses().get(0), is(Statuses.UNDEFINED.getTextName()));
	}

	@Test
	public void orderAddedDosentMatter() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'failed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature2);
		target.addFeature(feature1);
		assertThat(target.getMergeFeature(feature1.getId()).getStatuses().get(0), is(Statuses.PASSED.getTextName()));
	}

	@Test
	public void emptyBuilds() {
		final Feature feature1 = new Feature(
				(BasicDBObject) JSON
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = {};
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		final MergeFeature isNull = null;
		assertThat(target.getMergeFeature(feature1.getId()), is(isNull));
	}
}
