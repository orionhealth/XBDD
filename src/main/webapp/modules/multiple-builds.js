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
YUI().add('multiple-builds', function (Y) {
	Y.namespace('Builds').Multiple = {
		loadMultipleBuilds: function (tID, response) {
			var data = JSON.parse(response.responseText), // Response data.
				Handlebars = Y.Handlebars,
				statusHelpers = Y.statusHelpers,
				template = Handlebars.compile(Y.xbdd.getTemplate('multipleBuildsTable')),
				multipleBuilds = Y.one('#multipleBuilds');

			Handlebars.registerHelper('color', function (c) {
				return statusHelpers.getStatusStyle(c[0]);
			});

			Handlebars.registerHelper('icon', statusHelpers.getStatusStyleIcon);

			Handlebars.registerHelper('url', function (url, index) {
				return 'data-url=' + url.replace('/{{BUILD_NAME}}/', '/' + builds[index - 1] + '/');
			});

			multipleBuilds.setHTML(template(data));

			Y.all('.loading-container').setHTML('');
			multipleBuilds.removeClass('hidden');

			Y.all('.merge-scenario .collapse-tr').each(function (item) {
				var h = item.getComputedStyle('height');
				item.setStyle('height', h).setData('default-height', h);
			});

			Y.all('.feature-title').on('click', Y.bind(function (e) {
				var id = e.currentTarget.one('.merge-feature').getData('feature'),
					trigger = e.currentTarget,
					scenarios = Y.all('.merge-scenario[data-parent="' + id + '"] .collapse-tr');

				if (trigger.getData('status') === 'hidden') {
					this._showRow(trigger, scenarios);
				} else {
					this._hideRow(trigger, scenarios);
				}
			}, this));

			Y.all('.build-status-icon[data-url]:not(.glyphicon-ban-circle)').on('click', function (e) {
				window.location = contextPath + e.currentTarget.getData('url');
			});

			Y.all('.visibility-toggle > .btn-show').on('click', Y.bind(function () {
				this._showRow(Y.all('tr th.feature-title'), Y.all('.merge-scenario .collapse-tr'));
			}, this));

			Y.all('.visibility-toggle > .btn-hide').on('click', Y.bind(function () {
				this._hideRow(Y.all('tr th.feature-title'), Y.all('.merge-scenario .collapse-tr'));
			}, this));

			if (Y.buildNav) {
				Y.buildNav.navSlideListeners('#build-menu-trig');
			}
		},
		loadMultipleBuildsFailed: function () {
			Y.all('.loading-container').setHTML('<h2>Oops something went wrong</h2>');
		},
		_showRow: function (feature, scenarios) {
			feature.setData('status', 'visible');
			scenarios.each(function (item) {
				item.setStyles({
					height: item.getData('default-height')
				}).removeClass('merge-scenario-hide').ancestor().removeAttribute('style');
			});
		},
		_hideRow: function (feature, scenarios) {
			feature.setData('status', 'hidden');
			scenarios.each(function (item) {
				item.setStyles({
					height: 0
				}).addClass('merge-scenario-hide').ancestor().setStyle('border', 0);
			});
		}
	};
}, {
	requires: ['io-base', 'event-base', 'event-custom', 'json', 'handlebars', 'statusHelpers', 'xbdd', 'build-nav']
});
