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
YUI().use('node', 'io-base', 'event-base', 'json-parse', 'handlebars', 'statusHelpers', 'xbdd', 'feature-test', 'panel', 'node-event-simulate', 'build-nav', 'formInput', 'favourites', 'session-timeout', function (Y) {
	var Handlebars = Y.Handlebars,
		statusHelpers = Y.statusHelpers,
		featureTemplate = Handlebars.compile(Y.xbdd.getTemplate('recentFeature')),
		reportTemplate = Handlebars.compile(Y.xbdd.getTemplate('recentReport')),
		uploadTemplate = Handlebars.compile(Y.xbdd.getTemplate('upload')),
		productTemplate = Handlebars.compile(Y.xbdd.getTemplate('products')),
		featureContainer = Y.one("#recent-features-list"),
		reportContainer = Y.one("#recent-reports-list"),
		uploadFeature = Y.one("#upload-feature"),
		feature;

	//Add all custom Handlebar helpers
	Handlebars.registerHelper("getStatusStyleIcon", statusHelpers.getStatusStyleIcon);
	Handlebars.registerHelper("niceDate", statusHelpers.niceDate);
	Handlebars.registerHelper("getFeatureURLFromFeature", statusHelpers.getFeatureURLFromFeature);
	Handlebars.registerHelper("getContext", statusHelpers.getContext);
	Handlebars.registerHelper('input_label', Y.formInput.inputLabelCreate);
	Handlebars.registerHelper('input_text', Y.formInput.inputFormCreate);
	Handlebars.registerHelper("eachProperty", statusHelpers.eachProperty);
	Handlebars.registerHelper('safeencode', statusHelpers.safeEncode);
	Handlebars.registerHelper("adminonly", statusHelpers.adminOnly);

	Handlebars.registerHelper("latestbuild", function () {
		var versionArray = [],
			sortedArray = [],
			obj = this.value,
			buildArray;
		// extract all the versions in the array
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				versionArray.push(prop);
			}
		}
		sortedArray = versionArray.sort(function (a, b) {
			var aV = a.split('.');
			var bV = b.split('.');
			var aVal, bVal;
			var i;
			for (i = 0; i < 3; i++) {
				aVal = parseInt(aV[i]);
				bVal = parseInt(bV[i]);
				if (aVal !== bVal) {
					return aVal - bVal;
				}
			}
			return 0;
		}).reverse();
		buildArray = this.value[sortedArray[0]].value.sort(function (a, b) {
			return b - a;
		});
		return sortedArray[0] + "/" + buildArray[0];
	});

	//Add all recent features to the list of recents
	Y.io(contextPath + 'rest/recents/features', {
		method: 'GET',
		on: {
			success: function (transactionId, response) {
				var data = Y.JSON.parse(response.responseText),
					recentFeatures = data.recents,
					i = recentFeatures.length - 1,
                    feature;

				if (recentFeatures.length === 0) {
					featureContainer.setHTML("<h1><small>You have no Recent Features</small></h1>");
				}

				while (i >= 0) {
                    feature = {
                        name: recentFeatures[i].name,
                        id: recentFeatures[i].id,
                        coordinates: {
                            product: recentFeatures[i].product,
                            version: recentFeatures[i].version,
                            build: recentFeatures[i].build
                        }
                    };
                    featureContainer.append(featureTemplate(feature));
					i--;
				}
			}
		}
	});

	//Add all recent builds to the list of recents
	Y.io(contextPath + 'rest/recents/builds', {
		method: 'GET',
		on: {
			success: function (transactionId, response) {
				var data = Y.JSON.parse(response.responseText),
					recentBuilds = data.recents,
					i = recentBuilds.length - 1;

				if (recentBuilds.length === 0) {
					reportContainer.setHTML("<h1><small>You have no Recent Reports</small></h1>");
				}
				while (i >= 0) {
					reportContainer.append(reportTemplate(recentBuilds[i]));
					i--;
				}
			}
		}
	});

	//Create the Upload Form
	if (uploadFeature) {
		uploadFeature.append(uploadTemplate());
	}

	//Product searching
	Y.all('.product-search').on(["keypress", "keydown", "keyup"], function (e) {
		var target = this.get('value').toString().toLowerCase();

		if (e.type === "keypress") {
			target += String.fromCharCode(e.which).toLowerCase();
		}

		Y.all(".product-item .product-link").each(function (node) {
			var name = node.get('text').toString().toLowerCase();
			if (name.split(target).length > 1) {
				node.ancestor().setStyle("display", "block");
			} else {
				node.ancestor().setStyle("display", "none");
			}
		});
	});

	//Populate the favorites list

	//Generate the product list and the build navigation
	Y.io(contextPath + 'rest/reports', {
		method: 'GET',
		on: {
			success: function (transactionId, response) {
				var buildNav = Y.buildNav,
					responseData = Y.JSON.parse(response.responseText),
					//Can't use responseData below because the variable gets modified strangely
					reports = buildNav.generateReportObject(Y.JSON.parse(response.responseText));

				//Render the product list
				Y.one("#products-list").setHTML(productTemplate(reports));

				//Render the build navigations
				buildNav.renderNavs(responseData);
				buildNav.navSlideListeners(".product-item .product-link");

				//Render the favourites list
				Y.Favourites.renderFavourites();

				//Register the favourite toggler handles
				Y.Favourites.addFavouriteTogglers(".product-action-menu .toggle-fav");
			},
			failure: function () {
				new Y.Panel({
					bodyContent: '<div class="message icon-warn">A problem occurred whilst attempting to retrieve report summary.</div>',
					width: 400,
					modal: true,
					centered: true,
					buttons: {
						footer: ['close']
					}
				}).render();
			}
		}
	});

	$('#help-modal').on('show.bs.modal', function () {
		var nav = Y.one('.help-nav'),
			content = Y.one('#help-content'),
			navTemplate = Handlebars.compile(Y.xbdd.getTemplate('docs/nav')),
			helpFiles = ['product-overview', 'uploading-a-build', 'viewing-builds', 'selecting-a-feature', 'selecting-a-scenario', 'editing-a-scenario', 'manual-testing', 'search', 'favourite-products-pin-builds', 'merge-view', 're-order-builds', 'print', 'build-stats', 'statuses', 'featureHistory'],
			helpNames = ['Product Overview', 'Uploading a Build', 'Viewing Builds', 'Selecting a Feature', 'Selecting a Scenario', 'Editing a Scenario', 'Manual Testing', 'Searching', 'Favouriting and Pinning', 'Merge Multiple Builds', 'Re-Ordering Builds', 'Print Page', 'Build Statistics', 'Statuses', 'Revision History'],
			helpDocs = [],
			clicks;

		Handlebars.registerHelper('name', function (i) {
			return helpNames[i];
		});

		Handlebars.registerHelper('divider', function (n, o) {
			if (n === 'product-overview' || n === 'print') {
				return o.fn(this);
			}
		});

		nav.setHTML(navTemplate(helpFiles));

		for (var i in helpFiles) {
			if (helpFiles.hasOwnProperty(i)) {
				helpDocs[helpFiles[i]] = Handlebars.compile(Y.xbdd.getTemplate('docs/' + helpFiles[i]));
			}
		}

		clicks = function () {
			Y.all('.help-nav li, .help-content span[data-doc]').detach().on('click', function (e) {
				var item = e.currentTarget;

				$('.help-content').scrollTop(0);

				nav.all('li.active').removeClass('active');
				Y.one(item.getData('doc')).addClass('active');
				content.setHTML(helpDocs[Y.one(item.getData('doc')).getData('file')]());
				clicks();
			});
		};
		clicks();
		Y.one('.help-nav li').addClass('active');
		content.setHTML(helpDocs['product-overview']());
	});
});
