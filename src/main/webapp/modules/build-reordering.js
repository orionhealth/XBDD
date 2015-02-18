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
YUI.add('build-reordering', function(Y) {
	Y.namespace('Build').Reordering = {
		init: function() {
			this._initClickListeners();
		},
		_isInt: function(i) {
			return (parseInt(i).toString() === i.toString());
		},
		_compareBuildNames: function(a, b) {
			if (this._isInt(a) && this._isInt(b)) {
				return b - a;
			} else if (this._isInt(a) && !this._isInt(b)) {
				return -1;
			} else if (!this._isInt(a) && this._isInt(b)) {
				return 1;
			} else {
				return -1 * a.localeCompare(b);
			}
		},
 		_doAutoSort: function() {
			var builds = Y.all('.list .build'),
				buildArray = [],
				target = Y.one('.list'),
				i;
		
			for (i = 0; i < builds.size(); i++) {
				buildArray.push(builds.item(i));
			}
		
			buildArray.sort(Y.bind(function (a, b) {
				a = a.get('text').trim();
				b = b.get('text').trim();

				return this._compareBuildNames(a, b);
			}, this));
		
			for (i = 0; i < buildArray.length; i++) {
				target.append(buildArray[i]);
			}
		
			this._enableButtons();
		},
		_moveToTop: function(build) {
			Y.one('.list').prepend(build.ancestor('.build'));
			this._enableButtons();
		},
		_moveToBot: function(build) {
			Y.one('.list').append(build.ancestor('.build'));
			this._enableButtons();
		},
		_enableButtons: function() {
			Y.one('#revert-order').removeAttribute('disabled');
			Y.one('#save-order').removeAttribute('disabled');
		},
		_initClickListeners: function() {
			Y.one('#do-order').on('click', function() {
				this._doAutoSort();
			}, this);
			Y.all('.to-top').on('click', function(e) {
				this._moveToTop(e.currentTarget);
			}, this);
			Y.all('.to-bot').on('click', function(e) {
				this._moveToBot(e.currentTarget);
			}, this);
		}
	};
}, {
	requires: ['node-base']
});