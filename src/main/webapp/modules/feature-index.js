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
YUI.add('feature-index', function (Y) {
	var Handlebars = Y.Handlebars;

	Y.featureIndex = {};

	Handlebars.registerHelper('ifHasTag', function (tags, tagName, options) {
		var i;
		if (tags) {
			for (i = 0; i < tags.length; i++) {
				if (tagName === tags[i].name) {
					return options.fn(this);
				}
			}
		}
		return '';
	});

	Y.featureIndex.IndexEntry = Y.Base.create('indexEntry', Y.Model, {});

	Y.featureIndex.IndexList = Y.Base.create('indexList', Y.ModelList, [], {

		initializer: function (cfg) {
			var that = this;
			this.product = cfg.product;
			this.version = cfg.version;
			this.build = cfg.build;
			this.filter = cfg.filter;
			this.queryString = Y.QueryString.stringify(cfg.filter);
			// if a feature is saved, then try to update entry in the list with the new status.
			Y.Global.on('featureUpdated', function (e) {
				that.each(function (indexEntry) {
					if (indexEntry.get('id') === e.id) {
						indexEntry.set('calculatedStatus', e.calculatedStatus);
					}
				});
			});
			Y.Global.on('featureSearchChanged', function (e) {
				that.queryString = Y.QueryString.stringify(e);
				that.load();
			});
		},

		sync: function (action, options, callback) {
			if (action === 'read') {
				//ignores if filtering everything
				if (this.queryString.indexOf('viewFailed=0&viewPassed=0&viewSkipped=0&viewUndefined=0') > -1) {
					callback(null, '');
					return;
				}
				Y.io(contextPath + this.get('viewManager').getUrl() + this.product + '/' + this.version + '/' + this.build + '?' + this.queryString, {
					method: 'GET',
					on: {
						success: function (transactionId, response) {
							var data = Y.JSON.parse(response.responseText); // Response data.
							callback(null, data);
						},
						failure: function () {
							alert('A problem occurred whilst attempting to retrieve more features.');
						}
					}
				});
			} else {
				callback('Unsupported sync action: ' + action);
			}
		},

		model: Y.featureIndex.IndexEntry,
	}, {
		ATTRS: {
			viewManager: {
				value: []
			}
		}
	});

	/**
	 * The view responsible for displaying a "Feature" and managing/handling with all the events that get generated on it.
	 * Nests a rollupDetailView to display previous test results.
	 */
	Y.featureIndex.IndexEntryView = Y.Base.create('indexEntryView', Y.View, [], {

		containerTemplate: '<div class="another-index-entry">',
		// Specify delegated DOM events to attach to the container.
		events: {
			//'#ok': {click: 'ok'},
		},

		template: Y.Handlebars.compile(Y.xbdd.getTemplate('listViewEntry')),

		initializer: function () {

		},

		render: function () {
			var model = this.get('model'),
				container = this.get('container'),
				jsonModel = model.toJSON(),
				html = this.template(jsonModel);
			// Render this view's HTML into the container element.
			container.setHTML(html);
			return this;
		}
	});

	Y.featureIndex.IndexListView = Y.Base.create('indexListView', Y.View, [], {
		initializer: function () {

		},
		markIndexEntryAsInFocus: function (featureId) {
			var container = this.get('container'),
				indexNode = container.one('[data-featureId="' + featureId + '"] .col-sm-12 .alert');
			container.all('.feature-index-entry .col-sm-12 .alert').removeClass('highlighted-index-entry');
			if (indexNode) {
				indexNode.addClass('highlighted-index-entry');
			}
		},
		events: {
			'.feature-index-entry': {
				click: 'indexEntryClick'
			},
		},
		indexEntryClick: function (e) {
			var featureId = e.currentTarget.getAttribute("data-featureId"),
				FeatureNavigationHelper = Y.FeatureNavigationHelper;
			this.get('viewManager').setFeatureInFocus(featureId);

			if (this.get('viewManager').get('featureInFocus')) {
				FeatureNavigationHelper.loadFeature(featureId);
				this.markIndexEntryAsInFocus(featureId);
			}
		},
		add: function (e) {
			var container = this.get('container'),
				featureView = new Y.featureIndex.IndexEntryView({
					model: e.model,
					readOnly: false
				});

			container.append(
				featureView.render().get('container')
			);
		},
		render: function () {
			var model = this.get('model'),
				container = this.get('container'),
				featureInFocus = this.get('viewManager').getFeatureInFocus();

			container.setHTML('');
			model.each(function (model) {
				var featureView = new Y.featureIndex.IndexEntryView({
					model: model,
					readOnly: false
				});
				container.append(
					featureView.render().get('container')
				);
			});
			if (!container.inDoc()) {
				Y.one('body').append(container);
			}

			if (featureInFocus) {
				this.markIndexEntryAsInFocus(featureInFocus, this);
			}
		}
	}, {
		ATTRS: {
			container: {
				valueFn: function () {
					return 'div#featureIndex';
				}
			},
			viewManager: {
				value: []
			}
		}
	});

	Y.featureIndex.IndexTagView = Y.Base.create('indexTagView', Y.View, [], {
		render: function () {
			var jsonModel = this.get('model').toJSON(),
				container = this.get('container'),
				template = Y.Handlebars.compile(Y.xbdd.getTemplate('tagViewEntry'));

			container.setHTML(template(jsonModel));

			this._addClickListeners();
		},
		_addClickListeners: function () {
			Y.all('.tag-view-feature').on('click', Y.bind(function (e) {
				var selectedFeature = e.currentTarget,
					featureId = selectedFeature.getAttribute('data-feature-id'),
					FeatureNavigationHelper = Y.FeatureNavigationHelper;
				this.markIndexEntryAsInFocus(featureId);
				FeatureNavigationHelper.loadFeature(featureId);
				this.get('viewManager').setFeatureInFocus(featureId);
			}, this));

			Y.all('.tag-view-scenario').on('click', Y.bind(function (e) {
				var clickedScenario = e.currentTarget,
					selectedFeature = clickedScenario.ancestor('.feature-container').one('.tag-view-feature'),
					featureId = selectedFeature.getAttribute('data-feature-id'),
					scenarioId = clickedScenario.getAttribute('data-scenario-id'),
					FeatureNavigationHelper = Y.FeatureNavigationHelper;
				this.markIndexEntryAsInFocus(featureId);
				FeatureNavigationHelper.loadScenario(featureId, scenarioId);
				this.get('viewManager').setFeatureInFocus(featureId, false);
			}, this));
		},
		markIndexEntryAsInFocus: function (featureId) {
			Y.all('.tag-view-selected').removeClass('tag-view-selected');
			Y.one('#tag-view').all('[data-feature-id="' + featureId + '"].tag-view-feature').addClass('tag-view-selected');
		}
	}, {
		ATTRS: {
			container: {
				valueFn: function () {
					return 'div#featureIndex';
				}
			}
		}
	});

	Y.featureIndex.IndexUriView = Y.Base.create('indexUriView', Y.View, [], {
		render: function () {
			var container = this.get('container'),
				used = [],
				Handlebars = Y.Handlebars,
				template = Handlebars.compile(Y.xbdd.getTemplate('uriView')),
				uriStructure = this._generateUriStructure(this.get('model').toJSON());

			Handlebars.registerHelper("color", Y.statusHelpers.getFeatureStatusStyle);
			Handlebars.registerHelper("index", function () {
				if (used.indexOf(this) === -1) {
					used.push(this);
					return used.length + 1;
				} else {
					return used.indexOf(this);
				}
			});
			Handlebars.registerHelper('iffolder', function (fn) {
				if (typeof this.content !== 'undefined') {
					return fn.fn(this);
				}
			});
			Handlebars.registerHelper('iffeature', function (fn) {
				if (typeof this.content === 'undefined') {
					return fn.fn(this);
				}
			});
			Handlebars.registerHelper('renderContent', function () {
				return template(this.content);
			});

			var html = template(uriStructure);

			// Render this view's HTML into the container element.
			container.setHTML(html);

			this._addClickListeners();
		},
		_addClickListeners: function () {
			Y.all('.tag-view-feature').on('click', Y.bind(function (e) {
				var selectedFeature = e.currentTarget,
					featureId = selectedFeature.getAttribute('data-feature-id'),
					FeatureNavigationHelper = Y.FeatureNavigationHelper;

				this.markIndexEntryAsInFocus(featureId);

				FeatureNavigationHelper.loadFeature(featureId);
				this.get('viewManager').setFeatureInFocus(selectedFeature.getAttribute('data-feature-id'));
			}, this));

			Y.all('.xbdd-folder-toggle').on('click', function (e) {
				Y.one(e.currentTarget).one('span').toggleClass('glyphicon-folder-close').toggleClass('glyphicon-folder-open');
			});
		},
		_generateUriStructure: function (json) {
			var uri = [],
				current,
				path,
				p,
				i;

			// For each feature in our JSON
			for (i in json) {
				// Ensure it is actually a feature
				if (json.hasOwnProperty(i)) {
					// Current feature
					current = json[i];
					path = current.uri.split('/');
					// Remove the file name from the end of the URI
					path.pop();
					// Iterate through the path
					for (p = 0; p < path.length; p++) {
						// Creating the path node if it does not exists
						this._createPath(uri, path, p);
					}
					// Then add the file to the final node of the path
					this._addToPath(uri, path, json[i]);
				}
			}
			// Return the URI structure
			return uri;
		},
		_createPath: function (uri, path, p) {
			var cUri = uri,
				found,
				// i is used to iterate up to the current path index p
				i;

			for (i = 0; i <= p; i++) {
				found = false;
				for (var c in cUri) {
					// Check that the path exists
					if (typeof cUri[c] !== 'undefined' && cUri[c].name === path[i] && typeof cUri[c].content !== 'undefined') {
						cUri = cUri[c].content;
						found = true;
					}
				}
				// If the path wasn't found create an empty path there
				if (!found) {
					cUri.push({
						name: path[p],
						content: []
					});
				}
			}
		},
		_addToPath: function (uri, path, obj) {
			var cUri = uri,
				p;
			// Loop through the path 
			for (p = 0; p < path.length; p++) {
				// Loop through the folders in the current URI
				for (var c in cUri) {
					// Check the folder is actually a folder and not a method of the Object
					if (typeof cUri[c] !== 'undefined' && cUri[c].name === path[p] && typeof cUri[c].content !== 'undefined') {
						// Change the current URI to the target
						cUri = cUri[c].content;
					}
				}
			}
			// We have the final URI path lets add the feature to it
			cUri.push({
				name: obj.name,
				id: obj.id,
				state: obj.calculatedStatus
			});
			// Lets sort the current URI path so everything is in alphabetical order with folders at the top
			cUri.sort(function (a, b) {
				var names = [a.name, b.name],
					aIsFolder = typeof a.content !== 'undefined',
					bIsFolder = typeof b.content !== 'undefined';

				if (aIsFolder === bIsFolder) {
					return (names.sort()[0] === a.name ? -1 : 1);
				} else {
					return (aIsFolder ? -1 : 1);
				}
			});
		},
		markIndexEntryAsInFocus: function (featureId) {
			var container = Y.one('#featureIndex');
			container.all('.tag-view-feature').removeClass('tag-view-selected');
			container.all('[data-feature-id="' + featureId + '"].tag-view-feature').addClass('tag-view-selected');
		}
	}, {
		ATTRS: {
			container: {
				valueFn: function () {
					return 'div#featureIndex';
				}
			}
		}
	});

	Y.featureIndex.IndexViewManager = Y.Base.create('indexSwitchView', Y.Model, [], {
		initializer: function (cfg) {
			var model,
				indexListView,
				indexTagView,
				indexUriView,
				buildStats;

			if (featureFocus) { // if hyperlinked direct to this feature then store it in local storage.
				this.setFeatureInFocus(featureFocus);
			}

			this._syncLocalStorage();

			model = new Y.featureIndex.IndexList(cfg);
			model.set('viewManager', this);

			model.load();

			this.set('model', model);

			indexListView = new Y.featureIndex.IndexListView({
				model: this.get('model'),
				viewManager: this
			});

			indexTagView = new Y.featureIndex.IndexTagView({
				model: this.get('model'),
				viewManager: this
			});

			indexUriView = new Y.featureIndex.IndexUriView({
				model: this.get('model'),
				viewManager: this
			});

			buildStats = new Y.buildStats.buildStatsObject();

			this.set('buildStats', buildStats);
			this.set('indexListView', indexListView);
			this.set('indexTagView', indexTagView);
			this.set('indexUriView', indexUriView);

			if (this.get('featureInFocus').length === 0) {
				this.get('buildStats').render();
			}

			model.after('reset', this.render, this);
			model.after('add', this.render, this);
		},
		getCurrentView: function () {
			if (this.get('targetView') === 'tagView') {
				return this.get('indexTagView');
			} else if (this.get('targetView') === 'uriView') {
				return this.get('indexUriView');
			} else {
				return this.get('indexListView');
			}
		},
		getUrl: function () {
			if (this.get('targetView') === 'tagView') {
				return 'rest/reports/featureTagIndex/';
			} else {
				return 'rest/reports/featureIndex/';
			}
		},
		_addCLickListeners: function () {
			Y.all('#feature-index-action-list-view').on('click', Y.bind(function () {
				if (this.get('targetView') !== 'listView') {
					this.set('targetView', 'listView');
					this._setLocalStorage();
					this.get('model').load();
				}
			}, this));

			Y.all('#feature-index-action-tag-view').on('click', Y.bind(function () {
				if (this.get('targetView') !== 'tagView') {
					this.set('targetView', 'tagView');
					this._setLocalStorage();
					this.get('model').load();
				}
			}, this));

			Y.all('#feature-index-action-uri-view').on('click', Y.bind(function () {
				if (this.get('targetView') !== 'uriView') {
					this.set('targetView', 'uriView');
					this._setLocalStorage();
					this.get('model').load();
				}
			}, this));
		},
		render: function () {
			this._addCLickListeners();

			if (this.get('targetView') === 'tagView') {
				this._renderTagView();
			} else if (this.get('targetView') === 'uriView') {
				this._renderUriView();
			} else {
				this._renderListView();
			}

			var max = Y.one('#featureIndex');
			max.setStyle('maxHeight', max.get('winHeight') - 190);
		},
		_renderTagView: function () {
			Y.all('.feature-index-action-menu .drop-down-selected').addClass('hidden');
			Y.all('#feature-index-action-tag-view span').removeClass('hidden');
			this._clearContainer();
			this.get('indexTagView').render();
		},
		_renderUriView: function () {
			Y.all('.feature-index-action-menu .drop-down-selected').addClass('hidden');
			Y.all('#feature-index-action-uri-view span').removeClass('hidden');
			this._clearContainer();
			this.get('indexUriView').render();
		},
		_renderListView: function () {
			Y.all('.feature-index-action-menu .drop-down-selected').addClass('hidden');
			Y.all('#feature-index-action-list-view span').removeClass('hidden');
			this._clearContainer();
			this.get('indexListView').render();
		},
		_renderBuildStats: function () {
			this.set('featureInFocus', null);
			Y.one("#featureTest").setHTML('');
			this.get('model').load();
			history.pushState(null, null, Y.statusHelpers.getContext() + 'reports/' + product + '/' + version + '/' + build);
			this.get('buildStats').render();
		},
		_clearContainer: function () {
			var container = Y.all('#featureIndex');
			container.setHTML('');
		},
		getFeatureInFocus: function () {
			return this.get('featureInFocus');
		},
		setFeatureInFocus: function (featureId, notHide) {
			if (this.get('featureInFocus') === featureId && typeof notHide === 'undefined') {
                Y.Global.fire('render.build.stats', this);
			} else {
				Y.one("#buildStats").setHTML('');
				this.set('featureInFocus', featureId);
			}
			this._setLocalStorage();
		},
		_setLocalStorage: function () {
			var currentState = {
				'targetView': this.get('targetView'),
				'featureInFocus': this.get('featureInFocus')
			};

			localStorage.setItem('currentState', JSON.stringify(currentState));
		},
		_syncLocalStorage: function () {
			var currentState = JSON.parse(localStorage.getItem('currentState'));

			if (currentState) {
				if (currentState.targetView) {
					this.set('targetView', currentState.targetView);
				}
				if (currentState.featureInFocus && featureFocus !== "") {
					this.set('featureInFocus', currentState.featureInFocus);
				} else {
					this.set('featureInFocus', []);
				}
			}
		}
	}, {
		ATTRS: {
			model: {
				value: []
			},
			targetView: {
				value: []
			},
			indexListView: {
				value: []
			},
			indexTagView: {
				value: []
			},
			indexUriView: {
				value: []
			},
			featureInFocus: {
				value: []
			},
			buildStats: {
				value: []
			}
		}
	});


}, '0.0.1', {
	requires: ['yui-base', 'event-custom', 'model-sync-rest', 'model', 'view', 'model-list', 'handlebars', 'io-base', 'querystring-stringify', 'xbdd', 'xbdd-build-stats']
});
