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
YUI().use('test-console', 'test', function(Y) {
	var win = Y.config.win,
		Test = Y.Test,
		Assert = Test.Assert,
		exampleTestSuite = new Test.Suite('XBDD.ExampleTests');

	exampleTestSuite.add(new Test.Case({
		name: 'Example.Case',

		// setUp() runs every time before each test
		setUp: function() {
			this.foo = "bar";
		},

		// tearDown() runs every time after each test
		tearDown: function() {
			this.foo = null;
		},

		// each test should be in the format {function being tested}() should {what it should do} if {stuff happens}
		'theFunction() should "do something" if "something happens"': function() {
			Assert.areEqual(true, true);
		}
	}));

	new Test.Console().render();

	Test.Runner.add(exampleTestSuite).run();
});