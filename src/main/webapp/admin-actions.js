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
YUI.add('admin-utils', function (Y) {
	var deleteProductListener,
		deleteBuildListener,
		deleteVersionListener,
		renameProductListener;

	Y.Admin = {
		initListeners: function () {
			if (deleteProductListener) {
				deleteProductListener.detach();
			}
			if (deleteBuildListener) {
				deleteBuildListener.detach();
			}
			if (deleteVersionListener) {
				deleteVersionListener.detach();
			}
			if (renameProductListener) {
				renameProductListener.detach();
			}
			//Listen on all product delete buttons
			deleteProductListener = Y.all('.delete-product').on('click', function (e) {
				var currentNode = e.currentTarget,
					confirmDelete = confirm('Are you sure you want to delete the follow product: ' + currentNode.getData('product'));
				if (confirmDelete) {
					Y.io(contextPath + 'rest/admin/delete/' + currentNode.getData('product'), {
						method: 'DELETE',
						on: {
							complete: function () {
								currentNode.ancestor().ancestor().ancestor().remove();
								Y.Favourites.renderFavourites();
							},
							failure: function (tID, e) {
								if (e.status === 500) {
									alert('An error occurred during the deletion proccess.  Some data may have been permenantly lost');
								} else {
									alert('An error has ocurred. Please ensure you are an admin');
								}
							}
						}
					});
				}
			});
			//Listen on all version delete buttons
			deleteVersionListener = Y.all('.delete-version').on('click', function (e) {
				var confirmDelete = confirm('Are you sure you want to delete the follow version: ' + e.currentTarget.getData('version'));
				e.stopPropagation();
				if (confirmDelete) {
					Y.io(contextPath + 'rest/admin/delete/' + e.currentTarget.getData('version'), {
						method: 'DELETE',
						on: {
							complete: function () {
								var URI = e.currentTarget.getData('version').split('/'),
									product = URI[0],
									version = URI[1],
									select = Y.one('.build-nav-vselect[data-product="' + product + '"]'),
									options = select.all('option');
								options.each(function () {
									if (this.get('value') === version) {
										this.remove();
									}
								});
								select.simulate('change');
								if (options.refresh().isEmpty()) {
									Y.one('.dismiss').simulate('click');
									Y.all('.product-item').each(function () {
										var child = this.get('children').item(0);
										if (child.get('text').trim() === product) {
											this.remove();
										}
									});
									Y.Favourites.renderFavourites();
								}
								alert('The version was deleted successfully');
							},
							failure: function (tID, e) {
								if (e.status === 500) {
									alert('An error occurred during the deletion proccess.  Some data may have been permenantly lost');
								} else {
									alert('An error has ocurred. Please ensure you are an admin');
								}
							}
						}
					});
				}
				return false;
			});
			//Listen on all build delete buttons
			deleteBuildListener = Y.all('.delete-build').on('click', function (e) {
				var confirmDelete = confirm('Are you sure you want to delete the follow build: ' + e.currentTarget.getData('build'));
				if (confirmDelete) {
					Y.io(contextPath + 'rest/admin/delete/' + e.currentTarget.getData('build'), {
						method: 'DELETE',
						on: {
							complete: function () {
								e.currentTarget.ancestor().ancestor().ancestor().remove();
							},
							failure: function () {
								if (e.status === 500) {
									alert('An error occurred during the deletion proccess.  Some data may have been permenantly lost');
								} else {
									alert('An error has ocurred. Please ensure you are an admin');
								}
							}
						}
					});
				}
			});
			//Listen on all rename buttons
			renameProductListener = Y.all('.rename-product').on('click', function (e) {
				var newName = prompt('Please enter the new name for: ' + e.currentTarget.getData('product'));
				if (!newName) {
					return false;
				}
				Y.io(contextPath + 'rest/admin/' + e.currentTarget.getData('product'), {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					data: '{"name": "' + newName + '"}',
					on: {
						complete: function () {
							e.currentTarget.setData('product', newName);
							e.currentTarget.ancestor().ancestor().ancestor().one('a').setHTML(newName);
							alert('The product has been renamed');
							window.location.reload();
						},
						failure: function () {
							if (e.status === 500) {
								alert('An error occurred during the renaming process');
							} else {
								alert('An error has ocurred. Please ensure you are an admin');
							}
						}
					}
				});
			});
		}
	};
}, {
	requires: ['node', 'io-base', 'event-base', 'json-parse']
});

YUI().use('node', 'event-base', 'node-event-simulate', 'io-base', 'admin-utils', 'event-custom', 'json-parse', 'favourites', 'build-nav', 'xbdd', 'handlebars', 'statusHelpers', 'session-timeout', function (Y) {
	var Handlebars = Y.Handlebars,
		statusHelpers = Y.statusHelpers;

	Handlebars.registerHelper('getFeatureURLFromFeature', statusHelpers.getFeatureURLFromFeature);
	Handlebars.registerHelper('getContext', statusHelpers.getContext);
	Handlebars.registerHelper('eachProperty', statusHelpers.eachProperty);
	Handlebars.registerHelper('safeencode', statusHelpers.safeEncode);
	Handlebars.registerHelper('adminonly', statusHelpers.adminOnly);
	Handlebars.registerHelper('latestbuild', function () {
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
		buildArray = this.value[sortedArray[0]].sort(function (a, b) {
			return b - a;
		});
		return sortedArray[0] + '/' + buildArray[0];
	});
	Y.Global.on('product-build-render-complete', function () {
		Y.Admin.initListeners();
	});
});
