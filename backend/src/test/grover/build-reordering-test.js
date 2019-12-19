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
YUI().use('test-console', 'test', 'build-reordering', function(Y) {
	var Test = Y.Test,
		Assert = Test.Assert,
		buildReorderingSuite = new Test.Suite('XBDD.Build.Reordering'),
		Reordering = Y.Build.Reordering,
		ArrayAssert = Y.ArrayAssert;

	buildReorderingSuite.add(new Test.Case({
		name: 'XBDD Build Reordering',

		// setUp() runs every time before each test
		setUp: function() {
			Y.one('#test-wrapper')
				.append('<button disabled="disabled" id="revert-order">#revertOrder</button>')
				.append('<button disabled="disabled" id="save-order">#saveOrder</button>')
				.append('<button disabled="disabled" id="do-order">#doOrder</button>');
		},

		// tearDown() runs every time after each test
		tearDown: function() {
			Y.one('#test-wrapper').all('button').remove();
			Y.one('.list').setHTML('');
		},

        _generateBuildList: function() {
            var buildStr = '',
                i;

            for (i=0; i<15; i++) {
                buildStr += '<div class="build">' + Math.floor(Math.random() * 40) + '</div>';
            }

            Y.one('.list').setHTML(buildStr);
        },

		'_compareBuildNames() should sort numbers in order from highest to lowest': function() {
			var array = ['1', '4', '3', '2', '6', '5', '7'];
			
			array.sort(Y.bind(function(a, b) {
					return this._compareBuildNames(a, b);
				}, Reordering));
			
			ArrayAssert.itemsAreEqual(['7', '6', '5', '4', '3', '2', '1'], array, 'Expected sorted numbers');
		},
		
		'_compareBuildNames() should sort strings in reverse alphabetical order': function() {
			var array = ['delta', 'beta', 'foo', 'alpha', 'gamma'];
			
			array.sort(Y.bind(function(a, b) {
				return this._compareBuildNames(a, b);
			}, Reordering));
			
			ArrayAssert.itemsAreEqual(['gamma', 'foo', 'delta', 'beta', 'alpha'], array, 'Expected sorted strings');
		},
		
		'_compareBuildNames() should sort a mixture of strings and numbers with ints in order at the top, and strings in order at the bottom': function() {
			var array = ['delta', '4', '1', 'beta', '6', '2', 'gamma'];
			
			array.sort(Y.bind(function(a, b) {
				return this._compareBuildNames(a, b);
			}, Reordering));
			
			ArrayAssert.itemsAreEqual(['6', '4', '2', '1', 'gamma', 'delta', 'beta'], array, 'Expected sorted mixture of strings and numbers');
		},
		
		'doAutoSort() should call _compareBuildNames()': function() {
			var i,
				builds;
			
			this._generateBuildList();
			Reordering._doAutoSort();
			builds = Y.all('.list .build');

			Assert.areEqual('', Y.one('#revert-order').getAttribute('disabled'), 'Revert Button should be re-enabled');
			Assert.areEqual('', Y.one('#save-order').getAttribute('disabled'), 'Save Button should be re-enabled');
			
			this.testOrder = Y.bind(function() {
				return this._compareBuildNames(builds.item(i-1).get('text').trim(), builds.item(i).get('text').trim());
			}, Reordering);
			
			for (i=1; i<15; i++) {
				Assert.isTrue(this.testOrder() <= 0, 'Builds should be ordered correctly');
			}
		}
	}));

	new Test.Console().render();

	Test.Runner.add(buildReorderingSuite).run();
});