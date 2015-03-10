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
YUI.add('feature-test', function (Y) {

	Y.Handlebars.registerHelper("eachArray", Y.statusHelpers.eachArray);
	Y.Handlebars.registerHelper("eachProperty", Y.statusHelpers.eachProperty);
	Y.Handlebars.registerHelper("escapeCucumberId", Y.statusHelpers.escapeCucumberId);
	Y.Handlebars.registerHelper("getAutomatedScenarioStatus", Y.statusHelpers.getAutomatedScenarioStatus);
	Y.Handlebars.registerHelper("getAutomatedScenarioStatusIcon", Y.statusHelpers.getAutomatedScenarioStatusIcon);
	Y.Handlebars.registerHelper("getFeatureURLFromFeature", Y.statusHelpers.getFeatureURLFromFeature);
	Y.Handlebars.registerHelper("getFeatureStatusStyle", Y.statusHelpers.getFeatureStatusStyle);
	Y.Handlebars.registerHelper("getManualStatusClass", Y.statusHelpers.getManualStatusClass);
	Y.Handlebars.registerHelper("getScenarioStatus", Y.statusHelpers.getScenarioStatus);
	Y.Handlebars.registerHelper("getScenarioStatusIcon", Y.statusHelpers.getScenarioStatusIcon);
	Y.Handlebars.registerHelper("getScenarioStatusStyleIcon", Y.statusHelpers.getScenarioStatusStyleIcon);
	Y.Handlebars.registerHelper("getScenarioStatusStyle", Y.statusHelpers.getScenarioStatusStyle);
	Y.Handlebars.registerHelper("getScenarioURL", Y.statusHelpers.getScenarioURL);
	Y.Handlebars.registerHelper("getStatusStyleIcon", Y.statusHelpers.getStatusStyleIcon);
	Y.Handlebars.registerHelper("getStatusStyle", Y.statusHelpers.getStatusStyle);
	Y.Handlebars.registerHelper("getAutomatedStepStatusClass", Y.statusHelpers.getAutomatedStepStatusClass);
	Y.Handlebars.registerHelper("manageScenarioStatus", Y.statusHelpers.scenarioStatusHelper);
	Y.Handlebars.registerHelper("niceDate", Y.statusHelpers.niceDate);
	Y.Handlebars.registerHelper("setCollapseState", Y.statusHelpers.setCollapseState);
	Y.Handlebars.registerHelper("toMarkDown", Y.statusHelpers.toMarkDown);
	Y.Handlebars.registerHelper("timeDate", Y.statusHelpers.timeDate);
	Y.Handlebars.registerHelper("constructEdit", Y.statusHelpers.constructEdit);
	Y.Handlebars.registerHelper("getContext", Y.statusHelpers.getContext);

	Y.featureTest = {};

	Y.featureTest.envData = Y.Base.create('envData', Y.Model, [], {
		initializer: function (cfg) {
			this.product = cfg.product;
		},
		sync: function (action, options, callback) {

			if (action === 'read') {
				var that = this;
				Y.io(contextPath + 'rest/environment/' + this.product, {
					method: 'GET',
					on: {
						success: function (transactionId, response) {
							var data = Y.JSON.parse(response.responseText); // Response data.
							if (data) {
								that.set('envList', data.environments);
							}
							callback(null, data);
						}
					}
				});
			} else {
				callback('Unsupported sync action: ' + action);
			}
		}
	}, {
		ATTRS: {
			envList: {
				value: []
			}
		}
	});

	Y.featureTest.FeatureTestDetail = Y.Base.create('featureTestDetail', Y.Model, [Y.ModelSync.REST], {
		initializer: function (cfg) {
			this.url = contextPath + 'rest/feature/' + cfg.coordinates.product + '/' + cfg.coordinates.version + '/' + cfg.coordinates.build + '/' + cfg.id;
			this.after('save', function () {
				Y.Global.fire('featureUpdated', this.toJSON());
			});
		}
	});

	Y.featureTest.FeatureList = Y.Base.create('featureList', Y.ModelList, [], {
		initializer: function (cfg) {
			this.product = cfg.product;
			this.version = cfg.version;
			this.build = cfg.build;
			this.filter = cfg.filter;
			this.queryString = Y.QueryString.stringify(cfg.filter);
			this.timestamp = new Date().getUTCMilliseconds();
			this.printable = cfg.printable;
		},

		sync: function (action, options, callback) {
			var that = this;
			if (action === 'read') {
				Y.io(Y.Lang.sub(contextPath + 'rest/reports/{product}/{version}/{build}?' + this.queryString, this), {
					method: 'GET',
					on: {
						success: function (transactionId, response) {
							var data = Y.JSON.parse(response.responseText); // Response data.
							if (data.length < 1) {
								that.allModelsLoaded = true;
								console.log('All models have been loaded @ ' + that.filter.start + data.length);
							}
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

		model: Y.featureTest.FeatureTestDetail
	});

	/**
	 * The view responsible for displaying a "Feature" and managing/handling with all the events that get generated on it.
	 * Nests a rollupDetailView to display previous test results.
	 */
	Y.featureTest.FeatureTestDetailView = Y.Base.create('featureTestDetailView', Y.View, [], {

		containerTemplate: '<div class="anotherFeature">',
		// Specify delegated DOM events to attach to the container.
		events: {
			'#ok': {
				click: 'ok'
			},
			'.save': {
				click: 'save'
			},
			'.cancel': {
				click: 'cancel'
			},
			'.show-changes': {
				click: 'showChanges'
			},
			'.error-message-host': {
				click: 'toggleErrorMessage'
			},
			'textarea': {
				valuechange: 'noteHasChanged'
			},
			'.steps li': {
				click: 'toggleStepHighlight'
			},
			'.statusSetters .btn': {
				click: 'toggleScenarioStatus'
			},
			'a[data-toggle="collapse"]': {
				click: 'rememberExpansion'
			},
			'.change-mode': {
				click: 'changeMode'
			}
		},

		initializer: function (cfg) {
			this.set('expandedScenarios', {}); //tracks expanded scenarios so on a re-render they can be re-opened.
			var model = this.get('model'),
                editInProgress = function() {
                    var i = 0;
                    for (var property in model.changed) {
                        if (model.changed.hasOwnProperty(property)) {
                            i++;
                        }
                    }
                    return i>0;
                };

			this.template = Y.Handlebars.compile(Y.xbdd.getTemplate(cfg.printable ? 'feature-printable' : 'feature'));
			if (cfg.printable) {
				this.events = {}; // if this is printable it should be read only; hence disable all view events to prevent editing etc.
			}
			model.after('save', this.render, this);
			model.after('load', this.render, this);
			model.after('change', this.announcePresence, this);
			model.after('save', this.removePresence, this);
			model.after('destroy', this.destroy, this);

			window.onbeforeunload = (function () {
				return function () {
					if (editInProgress()) {
						return "You have unsaved changes!";
					}
				};
			}());
            Y.Global.detach("render.build.stats");
            Y.Global.on('render.build.stats', function(viewManager) {
                if (editInProgress()) {
                    alert("You have unsaved changes, please save or discard before continuing");
                } else {
                    viewManager._renderBuildStats();
                }
            });
		},
		changeMode: function (e) {
			var container = e.target.ancestor('.form-group');

			container.all('.swap-out-panel').each(function (node) {
				if (node.hasClass('hide')) {
					node.removeClass('hide');
				} else {
					node.addClass('hide');
				}
			});
			if (e.target.hasClass('glyphicon-edit')) {
				e.target.removeClass('glyphicon-edit');
				e.target.addClass('glyphicon-eye-open');
			} else {
				e.target.removeClass('glyphicon-eye-open');
				e.target.addClass('glyphicon-edit');
			}
		},
		rememberExpansion: function (e) {
			//temporarily for the views life if it was expanded or not (saves/discards cause the view to re-rended as collapsed otherwise).
			//Strip the # from the id and use it as a key to store the expansion detail.
			var selectedId = e.target.ancestor('a[data-toggle="collapse"]').getAttribute('href').replace('#', '');
			//Needs inversion so that it will represent the expansion state AFTER the click.
			this.get('expandedScenarios')[selectedId] = !this.get('container').one('#' + selectedId).hasClass('in');
		},
		_addClickListeners: function () {
			Y.all('.upload-attachment').each(Y.bind(function (item) {
                item.ancestor().on('click', Y.bind(function(e) {
                    var editInProgress = function(model) {
                            var i = 0;
                            for (var property in model.changed) {
                                if (model.changed.hasOwnProperty(property)) {
                                    i++;
                                }
                            }
                            return i>0;
                        },
                        model = this.get('model');

                    if (editInProgress(model)) {
                        alert('Please save or discard your changes before uploading attachments');
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }, this));
				item.on('change', Y.bind(function () {
					var model = this.get('model'),
						formgroup = item.ancestor(".image-form"),
						parentId = item.ancestor('.scenario-section').get('id'),
						scenarioId = parentId.split(';')[1],
						product = model.get('coordinates.product'),
						version = model.get('coordinates.version'),
						build = model.get('coordinates.build'),
						feature = model.get('id');
					
					scenarioId = scenarioId.replace('/', '&2F');
	
					Y.io(contextPath + "/rest/upload-attachment/" + scenarioId + "/" + product + "/" + version + "/" + build + "/" + feature, {
						method: 'POST',
						data: "user=yahoo",
						form: {
							id: formgroup,
							useDisabled: true,
							upload: true
						},
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						on: {
							complete: Y.bind(function (tID, response) {
								this.removePresence();
								model.load();
							}, this)
						}
					});
				}, this));
			}, this));
		},
		_checkImage: function (src) {
            var img = Y.Node.create('<img/>'),
                parent = this.ancestor();

            img.on('error', Y.bind(function () {
                if (parent.hasClass('printable-attachment')) {
                    parent.remove();
                } else {
                    parent.setHTML('Attached File<br>').removeAttribute('rel');
                }
            }, this));
            img.setAttribute('src', src);
		},

		render: function () {
			var model = this.get('model'),
				container = this.get('container'),
				jsonModel = model.toJSON(),
				checkImage = this._checkImage,
				html;
			
			jsonModel.expandedScenarios = this.get('expandedScenarios'); // include if this should be expanded or not.
			jsonModel.readOnly = this.get('readOnly');
			html = this.template(jsonModel);
			// Render this view's HTML into the container element.
			container.setHTML(html);
			
			Y.all('.attach-image').each(function(item) {
				checkImage.call(item, this.getAttribute('src'));
			});
			
			if (!this.get('printable')) {
				this.addRollup(); //disable rollup detail on print (not currently user and expensive).
			}
			var envData = new Y.featureTest.envData({
				product: jsonModel.coordinates.product
			});
			envData.after('load', function () {
				Y.one('body').addClass('yui3-skin-sam');
				Y.all('[data-text-type="environment-notes"]').plug(Y.Plugin.AutoComplete, {
					resultHighlighter: 'phraseMatch',
					resultFilters: 'phraseMatch',
					source: this.get('envList')
				});
			});
			envData.load();
			
			this._addClickListeners();
			
			return this;
		},

		// Get the rollup model for this feature and render the view on to the feature view.
		addRollup: function () {
			//			alert('rollup');
			var model = this.get('model');
			var rollupModel = new Y.rollupFeatures.rollupDetail({
				product: model.get('coordinates.product'),
				version: model.get('coordinates.version'),
				build: model.get('coordinates.build'),
				feature: model.get('id')
			}, this);
			this.set('rollupModel', rollupModel);
			new Y.rollupFeatures.rollupDetailView({
				model: rollupModel,
				featureView: this
			});
			rollupModel.load();
		},
		//on a dirty event, announce the current users presence; at the same time if someone else is present on this feature alert the user.
		announcePresence: function (e) {
			var m = this.get('model');
			this.get('container').all('.announcement-edit').removeClass('hidden');
			if (e.src === 'dirty') { // if this is not the result of a load/save event.
				Y.io(contextPath + 'rest/presence/' + m.get('coordinates.product') + '/' + m.get('coordinates.version') + '/' + m.get('coordinates.build') + '/' + m.get('id'), {
					method: 'POST',
					on: {
						success: function (transactionId, response) {
							var data = Y.JSON.parse(response.responseText); // Response data.
							var conflictOccurred = false;
							var conflictText = '<div class="alert alert-warning announcement-conflict well-sm"><p>Others are modifying this feature:</p>';
							Y.Object.each(data.users, function (value, key) {
								if (key !== data.currentUser) {
									conflictOccurred = true;
									conflictText += '<p><strong><span class="glyphicon glyphicon-user"></span></strong>' + key + ' ' + moment(value).fromNow() + ' .</p>';
								}
							});
							conflictText += '</div>';
							var conflictNotification = Y.one(".announcements .announcement-conflict");
							if (conflictNotification) conflictNotification.remove(true);
							if (conflictOccurred) {
								Y.one(".announcements").append(conflictText);
							}
						}
					}
				});
			}
		},
		noteHasChanged: function (e) {
			var model = this.get('model');
			var elements = model.get('elements');
			var scenario = Y.Array.find(elements, function (el) {
				if (el.id === e.target.ancestor('.scenario-section').get('id')) {
					return true;
				}
			});
			//ensure the "view" panel updates as the "edit" panel is changed.
			e.target.ancestor('.form-group').one('.markdown-panel').setHTML(Y.statusHelpers.toMarkDown(e.target.get('value')));
			scenario[e.target.getAttribute('data-text-type')] = e.target.get('value');
			console.log('text:' + e.target.get('value'));
			model.set('elements', elements, {
				src: 'dirty'
			});
		},
		removePresence: function () {
			var m = this.get('model');
			Y.io(contextPath + 'rest/presence/' + m.get('coordinates.product') + '/' + m.get('coordinates.version') + '/' + m.get('coordinates.build') + '/' + m.get('id'), {
				method: 'DELETE'
			});
			return "Going somewhere?";
		},
		save: function () {
			var model = this.get('model');
			console.log(model.get('elements'));
			model.save();
			console.log(model.get('elements'));
		},
		cancel: function () {
			this.removePresence();
			this.get('model').load();
		},
		showChanges: function (e) {
			//get template maybe and show in a panel look how upload etc load into a box
			var model = this.get('model'),
				edits = model.get('edits');

			e.preventDefault();
			if (edits !== undefined) {
				var template = Y.Handlebars.compile(Y.xbdd.getTemplate('revisionHistory'));
				Y.one("#data_div").setHTML(template(edits));
				Y.one(document.body).addClass("noscroll");
				Y.myPanel.show();
			}
		},
		toggleErrorMessage: function (e) {
			e.target.ancestor().all('.testErrorMessages').toggleView();
		},
		toggleStepHighlight: function (e) {
			//			alert('toggle');
			if (!this.get('readOnly')) { //don't allow modification if its readOnly.
				if (!e.target.ancestor('.error-message-host') && !e.target.hasClass('icon-attachment')) { //don't do anything if this is an attachment or error message in the step.
					var model = this.get('model');
					var elements = model.get('elements');
					var isScenarioStep = e.currentTarget.ancestor('.scenario-steps');
					//find the scenario in the model with the id equal to that of the parent ".scenarioSection" id.
					var scenario = Y.Array.find(elements, function (el) {
						if (el.id === e.currentTarget.ancestor('.scenario-section').get('id')) {
							return true;
						}
					});
					// uses the start
					var updateElements = function (updateElement, itemList, start, end, passOnly) {
						var i;
						for (i = start; i <= end; i++) {
							var node = itemList.item(i);
							// calculate the status based on current status and update.
							if (end === i && !passOnly) { //if this is the node clicked on, then update status (unless passOnly is true)
								if (node.hasClass('step-passed')) {
									node.removeClass('step-passed');
									node.addClass('step-failed');
									updateElement.steps[i].result.manualStatus = 'failed';
								} else if (node.hasClass('step-failed')) {
									node.removeClass('step-failed');
									delete updateElement.steps[i].result.manualStatus;
								} else {
									node.addClass('step-passed');
									updateElement.steps[i].result.manualStatus = 'passed';
								}
							} else { //otherwise only pass it if it hasn't got a recorded failure.
								if (!node.hasClass('step-failed')) {
									node.addClass('step-passed');
									updateElement.steps[i].result.manualStatus = 'passed';
								}
							}

						}
					};

					var itemList = e.currentTarget.ancestor('ol').all('li'); //get the list of all scenario steps
					var index = itemList.indexOf(e.currentTarget);
					var start = index;
					if (e.shiftKey) {
						start = 0; // if shift is depressed then pass all up to and including the one clicked.
					}
					if (isScenarioStep) {
						updateElements(scenario, itemList, start, index); // update the scenario step
						if (e.shiftKey && e.currentTarget.ancestor('.steps').one('.background-steps')) { // if shift is down check the background steps too.
							itemList = e.currentTarget.ancestor('.steps').one('.background-steps').all('li'); //get the background steps
							updateElements(scenario.background, itemList, 0, itemList.size() - 1, true); // update check all the steps
						}
					} else {
						updateElements(scenario.background, itemList, start, index); // update what was clicked on
					}
					//update the model and fire a dirty event.
					model.set('elements', elements, {
						src: 'dirty'
					});
				}
			}
		},
		toggleScenarioStatus: function (e) {
			if (!this.get('readOnly')) { //don't allow modification if its readOnly.

				var model = this.get('model');
				var elements = model.get('elements');

				var scenario = Y.Array.find(elements, function (el) {
					if (el.id === e.currentTarget.ancestor('.scenario-section').get('id')) {
						return true;
					}
				});

				// sets manual scenario status
				var updateElements = function (updateElement, itemList, value) {
					//update model
					Y.Array.each(updateElement.steps, function (item) {
						item.result.manualStatus = value;
					});
					//update view
					itemList.each(function (node, index) {
						var statusClass = Y.statusHelpers.getManualStatusClass(updateElement.steps[index].result.manualStatus);
						node.toggleClass('step-passed', statusClass === 'step-passed');
						node.toggleClass('step-failed', statusClass === 'step-failed');
					});
				};

				var value = e.target.getAttribute('data-status');

				var itemList = e.currentTarget.ancestor('.scenario-section').one('.scenario-steps').all('li'); //get the list of all scenario steps					
				updateElements(scenario, itemList, value); // update the scenario step
				if (e.currentTarget.ancestor('.scenario-section').one('.background-steps')) { //check the background steps too.
					itemList = e.currentTarget.ancestor('.scenario-section').one('.background-steps').all('li'); //get the background steps
					updateElements(scenario.background, itemList, value); // update check all the steps
				}

				//update the model and fire a dirty event.
				model.set('elements', elements, {
					src: 'dirty'
				});
			}
		}
	});

	/*
	 * Feature View, but with the container set so it doesn't need to exist inside the listView.
	 */
	Y.featureTest.StandaloneFeatureTestDetailView = Y.Base.create('standaolineFeatureTestDetailView', Y.featureTest.FeatureTestDetailView, [], {}, {
		ATTRS: {
			container: {
				valueFn: function () {
					return '#featureTest';
				}
			},
			render: {
				value: []
			}
		}
	});


	Y.featureTest.FeatureListView = Y.Base.create('featureListView', Y.View, [], {
		initializer: function () {
			var model = this.get('model');
			this.timestamp = new Date().getUTCMilliseconds();
			model.after('reset', this.render, this);
			model.after('add', this.add, this);
			model.after('destroy', this.destroy, this);
		},
		add: function (e) {
			var container = this.get('container'),
				featureView = new Y.featureTest.FeatureTestDetailView({
					model: e.model,
					readOnly: false
				});
			container.append(
				featureView.render().get('container')
			);
		},
		render: function (e) {
			var model = this.get('model');
			console.log('Re-render model-list:' + model.timestamp);
			var container = this.get('container');
			container.setHTML('');
			e.target.each(function (model, index, list) {
				var featureView = new Y.featureTest.FeatureTestDetailView({
					model: model,
					readOnly: false,
					printable: list.printable
				});
				container.append(
					featureView.render().get('container')
				);
			});
			if (!container.inDoc()) {
				Y.one('body').append(container);
			}
			Y.pdfPrint.connectDropdown();
			Y.Print.Select.renderFeatureSelect();
		}
	}, {
		ATTRS: {
			container: {
				valueFn: function () {
					return '#featureTest';
				}
			}
		}
	});

}, '0.0.1', {
	requires: ['yui-base', 'event-custom', 'event-valuechange', 'model', 'model-list', 'pdf-print', 'view', 'model-sync-rest', 'handlebars', 'io-base', 'querystring-stringify', 'statusHelpers', 'xbdd', 'rollupFeatures', 'autocomplete', 'autocomplete-highlighters', 'uploader', 'io', 'panel']
});
