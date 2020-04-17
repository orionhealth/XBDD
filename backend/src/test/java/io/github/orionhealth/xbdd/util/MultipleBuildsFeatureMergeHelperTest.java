package io.github.orionhealth.xbdd.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.util.ArrayList;
import java.util.Arrays;

import org.junit.Test;

import com.mongodb.BasicDBObject;

import io.github.orionhealth.xbdd.model.simple.Feature;

public class MultipleBuildsFeatureMergeHelperTest {

	@Test
	public void featureNoScenarios() {
		final Feature feature = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature);
		assertEquals(target.getMergeFeature(feature.getId()).getStatuses().get(0), Statuses.UNKNOWN.getTextName());
	}

	@Test
	public void noFeatureAdded() {
		final Feature feature = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 'e2',},{'result' : {'status' : 'passed'},'name' : 'e3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));

		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		assertNull(target.getMergeFeature(feature.getId()));
	}

	@Test
	public void featureAddedPassed() {
		final Feature feature1 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3',}],},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3',}],},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertEquals(target.getMergeFeature(feature1.getId()).getStatuses().get(0), Statuses.PASSED.getTextName());
	}

	@Test
	public void featureAddedFailed() {
		final Feature feature1 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'failed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertEquals(target.getMergeFeature(feature1.getId()).getStatuses().get(0), Statuses.FAILED.getTextName());
	}

	@Test
	public void featureAddedUndefined() {
		final Feature feature1 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'failed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertEquals(target.getMergeFeature(feature1.getId()).getStatuses().get(0), Statuses.UNDEFINED.getTextName());
	}

	@Test
	public void scenarioNoSteps() {
		final Feature feature1 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1'}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'failed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertEquals(target.getMergeFeature(feature1.getId()).getScenarios().get(0).getStatuses().get(0), Statuses.UNKNOWN.getTextName());
	}

	@Test
	public void featuresDontContainBuild() {
		final Feature feature1 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build0", "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertNull(target.getMergeFeature(feature1.getId()));
	}

	@Test
	public void featureAddedUnknown() {
		final Feature feature1 = new Feature(BasicDBObject
				.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '', 'name' : 'f1', 'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'failed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'undefined'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertEquals(target.getMergeFeature(feature1.getId()).getStatuses().get(0), Statuses.UNKNOWN.getTextName());
	}

	@Test
	public void featuresFromTheSameBuild() {
		final Feature feature1 = new Feature(BasicDBObject
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
						.parse("{'_id' : 'p1/f2','id' : 'f2','description' : '' ,'name' : 'f2', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'undefined'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature1);
		target.addFeature(feature2);
		assertEquals(target.getMergeFeature(feature1.getId()).getStatuses().get(0), Statuses.UNDEFINED.getTextName());
	}

	@Test
	public void orderAddedDosentMatter() {
		final Feature feature1 = new Feature(BasicDBObject
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final Feature feature2 = new Feature(BasicDBObject
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'failed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build2','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final String[] builds = { "build1", "build2" };
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(Arrays.asList(builds));
		target.addFeature(feature2);
		target.addFeature(feature1);
		assertEquals(target.getMergeFeature(feature1.getId()).getStatuses().get(0), Statuses.PASSED.getTextName());
	}

	@Test
	public void emptyBuilds() {
		final Feature feature1 = new Feature(BasicDBObject
						.parse("{'_id' : 'p1/f1','id' : 'f1','description' : '' ,'name' : 'f1', 'elements' : [{'id' : 'e1','description' : '','name' : 'e1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2',},{'result' : {'status' : 'passed'},'name' : 's3'}]},{'id' : 'e2','description' : '','name' : 's1','steps' : [{'result' : {'status' : 'passed'},'name' : 's2'},{'result' : {'status' : 'passed'},'name' : 's3',}],}],'coordinates' : {'product' : 'P1','major' : 1,'minor' : 1,'servicePack' : 1,'build' : 'build1','version' : '1.1.1'},'calculatedStatus' : 'unknown status? - expected passed,failed or undefined','originalAutomatedStatus' : 'unknown status? - expected passed,failed or undefined'}"));
		final MultipleBuildsFeatureMergeHelper target = new MultipleBuildsFeatureMergeHelper(new ArrayList<>());
		target.addFeature(feature1);
		assertNull(target.getMergeFeature(feature1.getId()));
	}
}
