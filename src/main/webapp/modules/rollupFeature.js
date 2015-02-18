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
YUI.add('rollupFeatures', function (Y) {
	Y.rollupFeatures = {};

	Y.Handlebars.registerHelper("isCurrentBuild", function (context, options) {
		var obj = options.hash;
		//		alert(JSON.stringify(obj));
		if (obj.build !== obj.buildInFocus) {
			return "btn-xs";
		}
	});

	Y.Handlebars.registerHelper("eachProperty", Y.statusHelpers.eachProperty);

	Y.rollupFeatures.rollupDetail = Y.Base.create('rollupDetail', Y.Model, [Y.ModelSync.REST], {
		url: contextPath + 'rest/feature/rollup/{product}/{version}/{feature}',
	});

	Y.rollupFeatures.rollupDetailView = Y.Base.create('rollupDetailView', Y.View, [], {

		template: Y.Handlebars.compile(Y.xbdd.getTemplate('rollup')),

		initializer: function () {
			var model = this.get('model');
			model.after('load', this.render, this);
			model.after('destroy', this.destroy, this);
		},

		// The render function is responsible for rendering the view to the page. It
		// will be called whenever the model changes.
		render: function () {
			var model = this.get('model');
			var container = Y.one(this.get('featureView').get('container')).one('.rollup');
			var jsonModel = model.toJSON();
			var html = this.template(jsonModel);
			// Render this view's HTML into the container element.
			container.setHTML(html);

			return this;
		},

	});

}, '0.0.1', {
	requires: ['yui-base', 'model', 'view', 'model-sync-rest', 'handlebars', 'io-base', 'xbdd', 'statusHelpers']
});
