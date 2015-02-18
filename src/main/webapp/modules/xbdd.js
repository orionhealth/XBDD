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
YUI.add('xbdd', function (Y) {
	var tmpl_cache = null;

	var getTemplate = function (tmpl_name) {
		if (!tmpl_cache) {
			tmpl_cache = {};
		}

		if (!tmpl_cache[tmpl_name]) {
			var tmpl_dir = contextPath + 'templates',
				tmpl_url = tmpl_dir + '/' + tmpl_name + '.html',
				cfg = {
					sync: true,
				};
			var result = Y.io(tmpl_url, cfg);
			if (result.status !== 200) {
				throw 'Could not download template:' + tmpl_url + '. Error:' + result.status + ':' + result.responseText;
			}
			tmpl_cache[tmpl_name] = result.responseText;
		}

		return tmpl_cache[tmpl_name];
	};

	Y.xbdd = {};
	Y.xbdd.getTemplate = getTemplate;

}, '0.0.1', {
	requires: ['yui-base', 'io-base']
});
