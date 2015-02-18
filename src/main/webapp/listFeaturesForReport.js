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
/*jshint -W031 */
YUI().use('node', 'io-base', 'event-base', 'event-custom', 'json-parse', 'querystring-parse', 'handlebars', 'statusHelpers', 'cookie', 'xbdd', 'feature-test', 'feature-index', 'node-event-html5', 'search-features', 'gallery-lightbox', 'build-nav', 'charts', 'session-timeout', 'favourites', function (Y) {
	var numberOfFeaturesToLoadAtATime = 1,
		Handlebars = Y.Handlebars,
		printWarningTemplate = Handlebars.compile(Y.xbdd.getTemplate('printWarning')),
		phantom = Y.one("#phantom-missing"),
		setCheckBoxes,
		updateRecentFeatures,
		updateRecents,
		getModelListSearchObject;

	Y.Lightbox.init();

	Y.on('windowresize', function () {
		var max = Y.one('#featureIndex');
		max.setStyle('maxHeight', max.get('winHeight') - 190);
	});

	//Register helpers for determining a scenarios status based on step statuses.
	Handlebars.registerHelper("getScenarioStatus", Y.statusHelpers.getScenarioStatus);
	Handlebars.registerHelper("getFeatureStatus", Y.statusHelpers.getFeatureStatus);
	Handlebars.registerHelper("manageScenarioStatus", Y.statusHelpers.scenarioStatusHelper);
	Handlebars.registerHelper("eachProperty", Y.statusHelpers.eachProperty);
	Handlebars.registerHelper("getScenarioURL", Y.statusHelpers.getScenarioURL);
	Handlebars.registerHelper("getScenarioStatusIcon", Y.statusHelpers.getScenarioStatusIcon);
	Handlebars.registerHelper("isScenario", Y.statusHelpers.isScenario);

	//Set the functions
	setCheckBoxes = function () {
		var checks = Y.all('.statusFilters input');
		checks.each(function (node) {
			var value = Y.Cookie.get('show' + node.get('value'));
			if (value !== undefined) {
				node.set('checked', (value === 'true'));
				if (value === 'false') {
					var all = Y.all('.' + node.get('value') + '-shadow');
					all.hide(true);
				}
			}
		});
	};

	updateRecentFeatures = function (feature) {
		var featureIndexItem = Y.one("[data-featureid='" + feature.id + "']");
		if (!feature.name) {
			if (featureIndexItem) {
				feature.name = featureIndexItem.one(".feature-name").get('text');
			} else {
				return false;
			}
		}

		Y.io(contextPath + 'rest/recents/feature/' + feature.coordinates.product + '/' + feature.coordinates.version + '/' + feature.coordinates.build + '/' + feature.id + '?name=' + feature.name, {
			method: 'PUT'
		});
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
		Y.io(contextPath + 'rest/recents/build/' + product + '/' + version + '/' + build, {
			method: 'PUT'
		});
	};

	Y.myPanel = new Y.Panel({
		srcNode: '#panel-content',
		width: "75%",
		zIndex: 5,
		centered: true,
		modal: true,
		visible: true,
		render: true,
		headerContent: "Revision history",
		alignOn: [{
			node: 'win',
			eventName: 'scroll'
		}],
		buttons: {
			footer: [{
				name: 'close',
				label: 'Close',
				action: 'onClose'
			}]
		}
	});
	Y.myPanel.hide();

	Y.myPanel.onClose = function (e) {
		e.preventDefault();
		Y.one(document.body).removeClass("noscroll");
		this.hide();
	};

	if (phantom) {
		phantom.append(printWarningTemplate());
	}

	Y.io(contextPath + 'rest/reports', {
		method: 'GET',
		on: {
			success: function (transactionId, response) {
				var buildNav = Y.buildNav;

				//Render the build navigation
				buildNav.renderNavs(Y.JSON.parse(response.responseText));

				//Add toggle listeners
				Y.Favourites.addPinHandles('.pin-build');

				//Choose the version that we are currently on and select it
				Y.all('.build-nav-vselect option').each(function () {
					if (this.get("value") === version) {
						this.set("selected", "true");
					}
				});
				Y.all('.btn.open-upload').each(function (item) {
					var node = Y.Node.create('<div class="hidden"></div>');
					item.ancestor().append(node.append(item));
				});
			},
			failure: function () {
				var panel = new Y.Panel({
					bodyContent: '<div class="message icon-warn">A problem occurred whilst attempting to retrieve build summary.</div>',
					width: 400,
					modal: true,
					centered: true,
					buttons: {
						footer: ['close']
					}
				});
				panel.render();
			}
		}
	});

	Y.on('domready', function () {
		var dataModel = new Y.SearchFeatures.searchData({
				url: product + '/' + version + '/' + build
			}),
			searchModel = new Y.SearchFeatures.searchDetail({
				id: 'xbddSearchTerms'
			}),
			currentModel = null,
			updateFeatureInFocus;

		new Y.SearchFeatures.searchDetailView({
			model: searchModel,
			tagModel: dataModel
		});

		updateRecents(); //update recently viewed reports
		Y.Global.on('featureUpdated', function (e) {
			updateRecentFeatures(e); //updated recent features if we edit one.
		});

		Y.Global.on('viewFeatureList', function () {
			Y.one('.feature-index-column').removeClass('hidden-xs');
			Y.one('.feature-detail-column').addClass('hidden-xs');
		});


		//Restore the search options (saved in localStorage)
		searchModel.load();

		dataModel.load();

		updateFeatureInFocus = function (featureId) {
			var ob = {
					id: featureId,
					coordinates: {
						product: product,
						version: version,
						build: build
					}
				},
				featureView;
			if (currentModel) {
				if (currentModel.isModified()) {
					alert("Please save or dismiss your changes before selecting another feature.");
					return;
				}
				currentModel.destroy();
			}

			currentModel = new Y.featureTest.FeatureTestDetail(ob);
			featureView = new Y.featureTest.StandaloneFeatureTestDetailView({
				model: currentModel
			});
			currentModel.load();
			Y.Global.fire('featureInFocus', {
				featureId: featureId
			});

			updateRecentFeatures({
				id: featureId,
				coordinates: {
					product: product,
					version: version,
					build: build
				}
			});

			return currentModel;
		};
		//when back button pops state instead of redirects, load the previous model.
		Y.on('popstate', function () {
			updateFeatureInFocus(featureFocus);
		});

		Y.Global.on('indexEntryClicked', function (e) {
			var currModel = updateFeatureInFocus(e.featureId),
				modObj = currModel.toJSON();
			history.pushState(modObj, modObj.name, Y.statusHelpers.getFeatureURLFromFeature(modObj));
			Y.all('.feature-index-column').addClass('hidden-xs'); //manage whether feature index or the feature in focus is shown on small displays
			Y.all('.feature-detail-column').removeClass('hidden-xs');

			//Adding responsiveness
			Y.all('.left-column-container').addClass('left-column-container-hidden');
			Y.all('.right-column-container').addClass('right-column-container-show');
			Y.all('.navbar-brand').item(0).addClass('hidden-xs');
			Y.all('.responsive-back-button').removeClass('hidden');
		});

		Y.all('.responsive-back-button').on('click', function () {
			//Adding responsiveness
			Y.all('.left-column-container').removeClass('left-column-container-hidden');
			Y.all('.right-column-container').removeClass('right-column-container-show');
			Y.all('.navbar-brand').item(0).removeClass('hidden-xs');
			Y.all('.responsive-back-button').addClass('hidden');
		});

		if (featureFocus) { // if hyperlinked direct to this feature then open it first.
			updateFeatureInFocus(featureFocus);
		}

		indexViewManager = new Y.featureIndex.IndexViewManager(getModelListSearchObject(null, searchModel, true));
	});
});
