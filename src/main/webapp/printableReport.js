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
YUI().use('node', 'io-base', 'event-base', 'event-custom', 'json-parse', 'querystring-parse', 'handlebars', 'statusHelpers', 'cookie', 'xbdd', 'feature-test', 'feature-index', 'search-features', 'session-timeout', 'print-feature-select', 'build-stats', function (Y) {
	var numberOfFeaturesToLoadAtATime = 1,
		Handlebars = Y.Handlebars,
		statusHelpers = Y.statusHelpers,
		updateRecentFeatures,
		getModelListSearchObject,
		updateRecents,
		printWarningTemplate = Y.Handlebars.compile(Y.xbdd.getTemplate('printWarning'));

	// register helper for determining a scenarios status based on step statuses.
	Handlebars.registerHelper("getScenarioStatus", statusHelpers.getScenarioStatus);
	Handlebars.registerHelper("getFeatureStatus", statusHelpers.getFeatureStatus);
	Handlebars.registerHelper("manageScenarioStatus", statusHelpers.scenarioStatusHelper);
	Handlebars.registerHelper("eachProperty", statusHelpers.eachProperty);
	Handlebars.registerHelper("getScenarioURL", statusHelpers.getScenarioURL);
	Handlebars.registerHelper("getScenarioStatusIcon", statusHelpers.getScenarioStatusIcon);
	Handlebars.registerHelper("isScenario", statusHelpers.isScenario);

	updateRecentFeatures = function (feature) {
		var items = JSON.parse(localStorage.getItem('recentFeatures')) || [],
			buffer = [],
			i = 0,
			curr = {
				"name": feature.name,
				"product": feature.coordinates.product,
				"version": feature.coordinates.version,
				"build": feature.coordinates.build,
				"id": feature.id
			};

		for (i = 0; i < items.length; i++) {
			var n = items[i];
			if (!(n.product === curr.product && n.version === curr.version && n.build === curr.build && n.id === curr.id)) {
				buffer.push(n);
			}
		}
		buffer.push(curr);
		if (buffer.length > 12) {
			buffer = buffer.slice(buffer.length - 12, buffer.length);
		}

		localStorage.setItem('recentFeatures', JSON.stringify(buffer));
	};

	/**
	 * Create the object to be passed to the Feature ModelList constructor that contains product coordinates and search filter info.
	 * @param {Y.featureTest.FeatureList} currentFeatureList the current FeatureList for the page
	 * @param {Y.searchFeatures.searchDetail} searchDetail the current searchDetail providing search parameters
	 * @param {boolean} newFeatureList is this a new FeatureList? if so, extract parameters from the window Query params.
	 * @return {object} object for passing in to a FeatureList constructor with relevant product coordinates and the searchDetail info
	 */
	getModelListSearchObject = function (currentFeatureList, searchDetail, newFeatureList) {
		var criteria;
		if (newFeatureList) {
			criteria = {
				product: product,
				version: version,
				build: build
			};
		} else {
			criteria = {
				product: currentFeatureList.product,
				version: currentFeatureList.version,
				build: currentFeatureList.build
			};
		}
		criteria.filter = searchDetail.toJSON();
		criteria.filter.start = 0;
		criteria.filter.limit = numberOfFeaturesToLoadAtATime;
		return criteria;
	};

	updateRecents = function () {
		var items = JSON.parse(localStorage.getItem('recentReports')) || [],
			buffer = [],
			i = 0,
			curr = {
				"product": product,
				"version": version,
				"build": build,
			};

		for (i = 0; i < items.length; i++) {
			var n = items[i];
			if (!(n.product === curr.product && n.version === curr.version && n.build === curr.build)) {
				buffer.push(n);
			}
		}
		buffer.push(curr);
		if (buffer.length > 12) {
			buffer = buffer.slice(buffer.length - 12, buffer.length);
		}

		localStorage.setItem('recentReports', JSON.stringify(buffer));
	};

	Y.one("#phantom-missing").append(printWarningTemplate());

	Y.on('domready', function () {
		var modelList,
			featureListView;
		updateRecents(); //update recently viewed reports

		Y.one('title').set('text', product + ' Version: ' + version + ', Build: ' + build);
		modelList = new Y.featureTest.FeatureList({
			product: product,
			version: version,
			build: build,
			printable: true,
		});
		featureListView = new Y.featureTest.FeatureListView({
			model: modelList
		});
		modelList.load();
		Y.Print.Select.init();
	});
});
