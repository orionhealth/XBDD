/*
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
YUI().use('test-console', 'test', 'node', 'multiple-builds', 'node-event-simulate', 'handlebars', 'statusHelpers', 'xbdd', function(Y) {
	var win = Y.config.win,
		Test = Y.Test,
		Assert = Test.Assert,
		exampleTestSuite = new Test.Suite('XBDD.Test.Build.Multiple');

	exampleTestSuite.add(new Test.Case({
		name: 'XBDD Multiple Builds',

		// setUp() runs every time before each test
		setUp: function() {
			contextPath = 'http://localhost:8000/';
			builds = ['111', '110'];
			var tID = '',
				response = {
					responseText: '{ "features" : [ { "id" : "f1" , "name" : "f1" , "elements" : [ { "id" : "s1" , "name" : "s1" , "statuses" : [ "passed" , "passed" , "dont exist"]} , { "id" : "s2" , "name" : "s2" , "statuses" : [ "unknown status? - expected passed,failed or undefined" , "unknown status? - expected passed,failed or undefined" , "passed"]}] , "statuses" : [ "passed" , "passed" , "failed"] , "url" : "reports/xbdd/1.0.0/ /f1"} , { "id" : "f2" , "name" : "f2" , "elements" : [ { "id" : "s1" , "name" : "s1" , "statuses" : [ "undefined" , "undefined" , "undefined"]}] , "statuses" : [ "undefined" , "undefined" , "undefined"] , "url" : "reports/xbdd/1.0.0/ /f2"}] , "builds" : [ "Merged" , "111" , "110"]}',
					status: 200
				};
			Y.one('#test-enclosure').setHTML('<div class="btn-group visibility-toggle" role="group"><button type="button" class="btn btn-info btn-show">Show All</button><button type="button" class="btn btn-warning btn-hide">Hide All</button></div><div class="col-xs-12 hidden" id="multipleBuilds"></div><div class="loading-container"></div>');
			Y.Builds.Multiple.loadMultipleBuilds(tID, response);
		},

		// tearDown() runs every time after each test
		tearDown: function() {
			Y.one('#test-enclosure').setHTML('');
		},

		'setUp() should mock the layout of a multiple build page when the tests are run': function() {
			var enclosure = Y.one('#test-enclosure');
			Assert.isNotNull(enclosure);
			Assert.isNotNull(enclosure.one('#multipleBuilds'));
			Assert.isNotNull(enclosure.one('.visibility-toggle'));
			Assert.isNotNull(enclosure.one('.visibility-toggle > .btn-hide'));
		},
		
		'loadMultipleBuilds() should load data dynamically when run in setUp()': function() {
			Assert.isNotNull(Y.one('.table'), 'table');
			Assert.isNotNull(Y.one('.merge-scenario'), 'merge-scenario');
			Assert.isNotNull(Y.one('.feature-title'), 'feature');
		},
		
		'when clicking on a feature should toggle visibility of scenarios in that feature)': function() {
			var featureTitle = Y.one('.feature-title');
			Assert.isNull(Y.one('.merge-scenario .merge-scenario-hide'), 'Scenario visible before click');
			featureTitle.simulate('click');
			Assert.isNotNull(Y.one('.merge-scenario .merge-scenario-hide'), 'Scenario hidden after first click');
			featureTitle.simulate('click');
			Assert.isNull(Y.one('.merge-scenario .merge-scenario-hide'), 'Scenario visible once clicked again');
		},
		
		'when clicking on hide all button visibility of all scenarios should be hidden)': function() {
			Assert.isNull(Y.one('.merge-scenario .merge-scenario-hide'), 'Scenarios visible before click');
			Y.one('.visibility-toggle > .btn-hide').simulate('click');
			Assert.areEqual(Y.all('.merge-scenario td').size(), Y.all('.merge-scenario td .merge-scenario-hide').size(), 'All scenarios are hidden after click');
		},
		
		'when clicking on show all button visibility of all scenarios should be shown)': function() {
			Y.one('.visibility-toggle > .btn-hide').simulate('click');
			Assert.areEqual(Y.all('.merge-scenario td').size(), Y.all('.merge-scenario td .merge-scenario-hide').size(), 'All scenarios are hidden before click');
			Y.one('.visibility-toggle > .btn-show').simulate('click');
			Assert.areEqual(0, Y.all('.merge-scenario .merge-scenario-hide').size(), 'Scenarios visible after click');
		},
		
		'when server processing fails a message is displayed)': function() {
			Y.Builds.Multiple.loadMultipleBuildsFailed();
			Assert.areEqual('Oops something went wrong', Y.one('.loading-container h2').get('innerHTML'));
		},
	}));

	new Test.Console().render();

	Test.Runner.add(exampleTestSuite).run();
});