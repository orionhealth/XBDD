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
YUI().use('node', 'io', 'xbdd', 'statusHelpers', 'handlebars', 'build-reordering', 'session-timeout', function (Y) {
	Y.on('domready', function () {
		Y.io(contextPath + 'rest/build-reorder/' + product + '/' + version, {
			method: 'GET',
			on: {
				success: function (tID, response) {
					var template = Y.Handlebars.compile(Y.xbdd.getTemplate('buildOrdering')),
						buildArray = JSON.parse(response.responseText).reverse();

					Y.one('#build-list').setHTML(template(buildArray));

					$('.sortable').sortable({
						forcePlaceholderSize: true,
						placeholder: '<li class="placeholder-build build"></li>'
					}).bind('sortupdate', function () {
						Y.one('#revert-order').removeAttribute('disabled');
						Y.one('#save-order').removeAttribute('disabled');
					});

					$('[data-toggle="tooltip"]').tooltip();

					Y.one('#revert-order').on('click', function () {
						window.location.reload();
					});

					Y.one('#save-order').on('click', function () {
						var builds = Y.all('.list .build'),
							buildArray = [],
							i;

						for (i = 0; i < builds.size(); i++) {
							buildArray.push(builds.item(i).get('text').trim());
						}

						Y.io(contextPath + 'rest/build-reorder/' + product + '/' + version, {
							method: "PUT",
							headers: {
								'Content-Type': 'application/json'
							},
							data: '{"builds": ' + JSON.stringify(buildArray.reverse()) + '}',
							on: {
								success: function () {
									Y.one('#revert-order').setAttribute('disabled', 'disabled');
									Y.one('#save-order').setAttribute('disabled', 'disabled');
								}
							}
						});
					});

					Y.Build.Reordering.init();
				}
			}
		});
	});
});
