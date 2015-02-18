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
YUI().use('node', 'io-base', 'event-base', 'event-custom', 'json-parse', 'handlebars', 'statusHelpers', 'xbdd', 'build-nav', 'session-timeout', 'favourites', 'multiple-builds', 'node-event-simulate', function (Y) {
	var buildsUrl = 'rest/reports/multiple';

	Y.io(contextPath + 'rest/reports', {
		method: 'GET',
		on: {
			success: function (tID, response) {
				var buildNav = Y.buildNav;

				Y.Handlebars.registerHelper('getContext', Y.statusHelpers.getContext);

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
		Y.io(Y.statusHelpers.getContext() + buildsUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			data: '{"builds": ' + JSON.stringify(builds) + ' , "version": "' + version + '", "product": "' + product + '"}',
			on: {
				success: function (tID, response) {
					Y.Builds.Multiple.loadMultipleBuilds(tID, response);
				},
				failure: function () {
					Y.Builds.Multiple.loadMultipleBuildsFailed();
				}
			}
		});
	});
});
