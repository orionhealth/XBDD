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
// YUI Upload Functionality
YUI().use('autocomplete', 'autocomplete-highlighters', 'autocomplete-filters', 'json-parse', 'event', 'formInput', 'panel', 'node', 'dd-plugin', 'event-base', 'io', 'button-plugin', 'yui-object', 'yui-array', function (Y) {
	Y.on("domready", function () {
		var product = Y.one('#product'),
			version = Y.one('#version'),
			build = Y.one('#build'),
			file = Y.one('#file'),
			uploadForm = Y.one('#uploadForm');

		// Posts uploaded file to report database
		function postReport() {
			var productUrl = product.get('value') + '/' + version.get('value') + '/' + build.get('value');
			Y.io('rest/reports/' + productUrl, {
				method: 'POST',
				data: "user=yahoo",
				form: {
					id: uploadForm,
					useDisabled: true,
					upload: true
				},
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				on: {
					complete: function (id, response) {
						if (response.responseText === 'success') {
							uploadSuccess.show();
						} else {
							if (response.responseText.length > 1000) {
								Y.all('.errorTips').set('text', response.responseText.slice(0, 1000) + " ...");
							} else {
								Y.all('.errorTips').set('text', response.responseText);
							}
							uploadFailure.show();
						}
					}
				}
			});
		}

		// Checks validity of proposed file upload
		function handleSubmit() {
			var numError = Y.formInput.checkInput(Y.all('.input-form-upload'), Y.one("#validateTips"));
			if (numError === 0) {
				Y.io(contextPath + 'rest/reports', {
					method: 'GET',
					on: {
						success: function (transactionId, response) {
							var data = Y.JSON.parse(response.responseText); // Response data.
							var isDuplicate = Y.formInput.reportExists(data, product.get('value'), version.get('value'), build.get('value'));
							if (isDuplicate) {
								uploadDuplicate.show();
							} else {
								postReport();
							}
						}
					}
				});
			} else {
				uploadDialog.show(); //if user input is inappropriate
			}
		}

		// Success upload prompt
		var uploadSuccess = new Y.Panel({
			srcNode: '#uploadSuccessContent',
			width: 400,
			zIndex: 6,
			centered: true,
			modal: true,
			visible: false,
			render: true,
			plugins: [Y.Plugin.Drag],
			buttons: [{
				value: 'Upload New',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadSuccess.hide();
					uploadDialog.show();
				}
			}, {
				value: 'Homepage',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadSuccess.hide();
					window.location.href = contextPath;
				}
			}, {
				value: 'View Report',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadSuccess.hide();
					var queryString = product.get('value') + '/' + version.get('value') + '/' + build.get('value');
					window.location.href = contextPath + 'reports/' + queryString;
				}
			}]
		});

		// Failure upload prompt
		var uploadFailure = new Y.Panel({
			srcNode: '#uploadFailureContent',
			zIndex: 6,
			centered: true,
			modal: true,
			visible: false,
			render: true,
			plugins: [Y.Plugin.Drag],
			buttons: [{
				value: 'Try Again',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadFailure.hide();
					uploadDialog.show();
				}
			}, {
				value: 'Cancel',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadFailure.hide();
				}
			}]
		});

		// Upload Duplicate prompt
		var uploadDuplicate = new Y.Panel({
			srcNode: '#uploadDuplicateContent',
			width: 400,
			zIndex: 6,
			centered: true,
			modal: true,
			visible: false,
			render: true,
			plugins: [Y.Plugin.Drag],
			buttons: [{
				value: 'Change Details',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadDuplicate.hide();
					uploadDialog.show();
				}
			}, {
				value: 'Upload Anyway',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadDuplicate.hide();
					postReport();
				}
			}]
		});

		// Upload Modal Panel	
		var uploadDialog = new Y.Panel({
			srcNode: '#uploadDialogContent',
			headerContent: 'Upload a new file',
			centered: true,
			modal: true,
			visible: false,
			width: 400,
			render: true,
			zIndex: 5,
			plugins: [Y.Plugin.Drag],
			buttons: [{
				value: 'Upload',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					Y.all('.input-form-upload').each(function (node) {
						node.removeClass('form-error');
					});
					uploadDialog.hide();
					handleSubmit();
				}
			}, {
				value: 'Clear',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					Y.all('.input-form-upload').each(function (node) {
						node.set('value', "");
						node.removeClass('form-error');
					});
					Y.one("#validateTips").set('innerHTML', '');
				}
			}, {
				value: 'Cancel',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					uploadDialog.hide();
				}
			}]
		});

		// Every time the input form is clicked the data is re-retrieved
		Y.all('.input-form-upload').on(['focus', 'blur', 'change'], function () {
			// Auto-complete product form
			Y.io(contextPath + 'rest/reports', {
				method: 'GET',
				on: {
					success: function (transactionId, response) {
						var data = Y.JSON.parse(response.responseText); // Response data.
						// Auto-complete for product
						product.plug(Y.Plugin.AutoComplete, {
							resultHighlighter: 'phraseMatch',
							resultFilters: 'phraseMatch',
							maxResults: 10,
							source: Y.formInput.productsList(data)
						});
						// Every time the input form is clicked the version list is refreshed
						Y.all('.input-form-upload').on(['focus', 'click', 'blur'], function () {
							// Auto-complete for versions
							version.plug(Y.Plugin.AutoComplete, {
								resultHighlighter: 'phraseMatch',
								resultFilters: 'phraseMatch',
								maxResults: 10,
								source: Y.formInput.versionsList(data, product.get('value'))
							});
						});
					}
				}
			});
		});

		// Shows the upload dialog on request, either empty or prepopulated
		Y.on('contentready', function () {
			//Set an interval waiting for the upload buttons to be rendered
			//quirk in Firefox where contentready fires before the IO request returns
			//Once the buttons are rendered we can attach the upload function
			var upRendered = setInterval(function () {
				if (Y.one(".nav-slide-right")) {
					window.clearInterval(upRendered);
					Y.all('.open-upload').on('click', function (e) {
						var cv = '';
						e.preventDefault();
						if (e.target.hasClass('drop-upload')) {
							product.set('value', e.target.get('name'));
							Y.all(".build-nav-vselect").each(function () {
								if (this.getData('product').replace("_", " ") === e.target.get('name')) {
									cv = this.get('value');
								}
							});
							version.set('value', cv);
						} else {
							product.set('value', '');
							version.set('value', '');
						}
						build.set('value', '');
						file.set('value', '');
						uploadDialog.show();
					});
				}
			}, 10);
		}, '#products-list');
	});
});
