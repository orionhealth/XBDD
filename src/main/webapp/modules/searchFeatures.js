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
YUI.add('search-features', function (Y) {
	var Handlebars = Y.Handlebars,
		XBDD = Y.xbdd,
		template = Handlebars.compile(XBDD.getTemplate('leftColumnHeader')),
		containsKeyWords;

	Y.namespace('SearchFeatures');

	containsKeyWords = function (sentence, keyWords) {
		var lowerSentence = sentence.toLowerCase();
		for (var i = 0; i < keyWords.length; i++) {
			if (keyWords[i]) {
				if (lowerSentence.split(keyWords[i].toLowerCase()).length > 1) {
					return true;
				}
			}
		}
		return false;
	};

	//Highlight occurrences of key words in results
	Handlebars.registerHelper('highlight', function (text, keys) {
		var high = '(',
			pattern;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i]) {
				high += keys[i] + '|';
			}
		}

		high = high.substr(0, high.length - 1);
		pattern = new RegExp(high + ')', 'ig');

		text = text.replace(pattern, '<span class="search-highlighted">$1</span>');
		return text;
	});

	//Leaves out field if it does not contain any of the key words
	Handlebars.registerHelper('ifcontains', function (str, keys, options) {
		if (containsKeyWords(str, keys)) {
			return options.fn(this);
		}

		return '';
	});

	//Leaves out a scenario if the scenario contains no fields containing any of the key words
	Handlebars.registerHelper('ifscenariocontains', function (scenario, keys, options) {
		var i;

		//checks if contained in scenario name
		if (containsKeyWords(scenario.name, keys)) {
			return options.fn(this);
		}


		//checks if contained in scenario description
		if (containsKeyWords(scenario.description, keys)) {
			return options.fn(this);
		}

		//checks if contained in scenario steps
		if (scenario.steps) {
			for (i = 0; i < scenario.steps.length; i++) {
				if (containsKeyWords(scenario.steps[i].name, keys)) {
					return options.fn(this);
				}
			}
		}

		//checks if contained in scenario tags
		if (scenario.tags) {
			for (i = 0; i < scenario.tags.length; i++) {
				if (containsKeyWords(scenario.tags[i].name, keys)) {
					return options.fn(this);
				}
			}
		}

		return '';
	});

	Y.SearchFeatures.renderFilters = function (data) {
		Y.one('.left-column-header').setHTML(template(data));
	};

	Y.SearchFeatures.filterEvents = function (caller) {
		Y.all('.statusFilters .btn').on('click', function (e) {
			caller._selectCheckBox(e);
		});
	};

	Y.SearchFeatures.searchData = Y.Base.create('searchData', Y.Model, [], {
		initializer: function (cfg) {
			this.urlString = cfg.url;
		},
		sync: function (action, options, callback) {

			if (action === 'read') {
				this.tagList = [];
				Y.io(contextPath + 'rest/reports/tags/' + this.urlString, {
					method: 'GET',
					on: {
						success: Y.bind(function (transactionId, response) {
							var data = Y.JSON.parse(response.responseText); // Response data.
							if (data) {
								this.tagList = data;
							}
							callback(null, data);
						}, this)
					}
				});
			} else {
				callback('Unsupported sync action: ' + action);
			}
		}
	}, {
		ATTRS: {
			tagList: {
				value: []
			}
		}
	});

	Y.SearchFeatures.searchDetail = Y.Base.create('searchDetail', Y.Model, [], {
		initializer: function () {
			this.after('save', function () {
				Y.Global.fire('featureSearchChanged', this.toJSON());
			});
		},
		sync: function (action, options, callback) {
			var data;

			switch (action) {
			case 'create':
				callback('Invalid action - should always be an update given Id is specified');
				break;

			case 'read':
				// Look for an item in localStorage with this model's id.
				data = localStorage.getItem('xbddSearchTerms');

				if (!data) {
					localStorage.setItem(this.get('id'), Y.JSON.stringify(this.toJSON()));
				}
				callback(null, data);
				break;

			case 'update':
				data = this.toJSON();
				// Update the record in localStorage, then call the callback.
				localStorage.setItem(this.get('id'), Y.JSON.stringify(data));
				callback(null, data);
				return;

			case 'delete':
				callback('Invalid action - no need to delete');
				break;

			default:
				callback('Invalid action');
			}
		}
	}, {
		ATTRS: {

			id: {
				value: 'xbddSearchTerms' // default value
			},

			viewFailed: {
				value: true
			},

			viewPassed: {
				value: true
			},

			viewSkipped: {
				value: true
			},

			viewUndefined: {
				value: true
			},

			searchText: {
				value: null
			}
		}
	});

	Y.SearchFeatures.searchDetailView = Y.Base.create('searchDetailView', Y.View, [], {

		// Specify delegated DOM events to attach to the container.
		events: {
			'.statusFilters label.btn': {
				click: '_selectCheckBox'
			},
			'#view-feature-list': {
				click: 'viewFeatureList'
			}
		},

		template: Handlebars.compile(XBDD.getTemplate('menubar')),

		initializer: function () {
			var model = this.get('model'),
				tagModel = this.get('tagModel'),
				searchCont = Y.one('#search-results-con');
			model.after('load', this.render, this);
			model.after('save', this.render, this);
			model.after('destroy', this.destroy, this);
			tagModel.after('load', Y.bind(function () {
				this.tagList = tagModel.tagList;
			}, this), this);
			if (searchCont) {
				searchCont.addClass('hide-search-container');
			}
		},

		// The render function is responsible for rendering the view to the page. It
		// will be called whenever the model changes.
		render: function () {
			var model = this.get('model'),
				container = this.get('container'),
				jsonModel = model.toJSON(),
				menuBarHTML,
				searchNode;

			jsonModel.coordinates = {
				"product": product,
				"version": version,
				"build": build
			};

			Handlebars.registerHelper('safeencode', Y.statusHelpers.safeEncode);

			Y.SearchFeatures.renderFilters(jsonModel);
			Y.SearchFeatures.filterEvents(this);

			menuBarHTML = this.template(jsonModel);
			// Render this view's HTML into the container element.
			container.setHTML(menuBarHTML);

			//Add click listener to build nav
			Y.buildNav.navSlideListeners("#build-menu-trig");

			this.set('searchNode', Y.one('#uriSearch'));
			searchNode = this.get('searchNode');

			if (searchNode) {
				//on focusing on search bar shows search box
				searchNode.on('click', Y.bind(function (e) {
					if (searchNode.get('value')) {
						this._showSearchBox();
						e.stopPropagation();
					}
				}, this));

				//hide search box if the body if clicked
				Y.one('win').on('click', Y.bind(function () {
					this._hideSearchBox();
				}, this));

				//on key up does search
				searchNode.on('keyup', Y.bind(function () {
					this._listenToSearchChange();
				}, this));

				searchNode.focus();
			}

			Y.pdfPrint.connectDropdown();
			return this;
		},
		_listenToSearchChange: function () {
			var value = this.get('searchNode').get('value'),
				SEARCH_WAIT = 500;

			if (this.oldeSearchValue !== value) {
				clearTimeout(this.searchTimeout);
				this.oldeSearchValue = value;
				this.searchTimeout = setTimeout(Y.bind(function () {
					this._doSearch();
				}, this), SEARCH_WAIT);
			}
		},
		_doSearch: function () {
			var searchNode = this.get('searchNode'),
				value = searchNode.get('value'),
				searchResults = Y.all('#search-results'),
				Statushelpers = Y.statusHelpers,
				searchURL = 'rest/search/' + product + '/' + version + '/' + build + '?keywords=' + value;
			if (!value) {
				this._hideSearchBox();
				return false;
			}

			//send ajax request for search results
			Y.bind(Y.io(Statushelpers.getContext() + searchURL, {
				method: 'GET',
				on: {
					success: Y.bind(function (tID, response) {
						this._renderSearchResults(response, searchResults, value);
					}, this),
					failure: Y.bind(function () {
						this.noSearchResults();
					}, this)
				}
			}), this);
		},
		_renderNoSearchResults: function () {
			var searchResults = Y.all('#search-results'),
				template = XBDD.getTemplate('noSearchResults');
			searchResults.setHTML(template);
			this._showSearchBox();
		},
		_hideSearchBox: function () {
			var searchResults = Y.one('#search-results'),
				searchCont = Y.one('#search-results-con'),
				HIDE_TRANSITION_DELAY = 700;

			if (searchCont) {
				setTimeout(function () {
					searchCont.addClass('hide-search-container');
				}, HIDE_TRANSITION_DELAY);
			}

			if (searchResults) {
				searchResults.setStyle('height', '0');
				searchResults.setStyle('opacity', '0');
			}
		},
		_showSearchBox: function () {
			var searchResults = Y.one('#search-results'),
				searchCont = Y.one('#search-results-con'),
				widgetHeight,
				previouseHeight;

			if (searchCont) {
				searchCont.removeClass('hide-search-container');
			}

			//force transition between auto heights
			if (searchResults) {
				previouseHeight = searchResults.getComputedStyle('height');
				widgetHeight = searchResults.setStyle('height', 'auto').getComputedStyle('height');
				searchResults.setStyle('height', previouseHeight);
				searchResults.get('clientHeight');
				searchResults.setStyle('opacity', '1');
				searchResults.setStyle('height', widgetHeight);
			}
		},
		_addSearchElementClickListeners: function () {
			//sets click listeners for selecting features in a search
			Y.all('.search-feature-select').on('click', Y.bind(function (e) {
				var FeatureNavigationHelper = Y.FeatureNavigationHelper,
					featureId = e.currentTarget.getAttribute('data-feature-id');

				indexViewManager.getCurrentView().markIndexEntryAsInFocus(featureId);
				FeatureNavigationHelper.loadFeature(featureId);
				indexViewManager.setFeatureInFocus(featureId, true);
			}, this));

			//sets click listeners for selecting scenarios in a search
			Y.all('.search-scenario').on('click', Y.bind(function (e) {
				var clickedScenario = e.currentTarget,
					featureId = clickedScenario.ancestor('.search-feature').one('.search-feature-select').getAttribute('data-feature-id'),
					scenarioId = clickedScenario.getAttribute('data-scenario-id'),
					FeatureNavigationHelper = Y.FeatureNavigationHelper;

				indexViewManager.getCurrentView().markIndexEntryAsInFocus(featureId);
				FeatureNavigationHelper.loadScenario(featureId, scenarioId);
				indexViewManager.setFeatureInFocus(featureId, true);
			}, this));
		},
		_renderSearchResults: function (response, searchResults, searchValue) {
			try {
				var responseText = Y.JSON.parse(response.responseText), // Response data.
					data,
					template;

				if (!responseText.length) {
					this._renderNoSearchResults();
					return false;
				}

				data = {
					"features": responseText,
					"searchKey": searchValue.trim().split(/\s+/)
				};

				template = Handlebars.compile(XBDD.getTemplate('searchResults'));
				searchResults.setHTML(template(data));

				this._addSearchElementClickListeners();

				this._showSearchBox();

			} catch (e) {
				this._renderNoSearchResults();
			}
		},
		_selectCheckBox: function (e) {
			var target = e.target,
				value = target.one('input').get('value');
			this.get('model').set('view' + value, !target.hasClass('active'), {
				silent: true
			});
			this.get('model').save();
		},
		viewFeatureList: function () {
			Y.Global.fire('viewFeatureList');
		}
	}, {
		ATTRS: {
			container: {
				valueFn: function () {
					return '#titlebar';
				},
			},
			tagList: {
				value: []
			},
			searchNode: {
				value: []
			}
		}
	});
}, '0.0.1', {
	requires: ['yui-base', 'app', 'event-custom', 'handlebars', 'io-base', 'querystring-parse', 'xbdd', 'node', 'json-parse', 'autocomplete', 'autocomplete-highlighters', 'autocomplete-filters', 'event-key', 'build-nav', 'pdf-print', 'feature-navigation-helper']
});
