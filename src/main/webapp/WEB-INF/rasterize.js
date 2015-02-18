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
var page = require('webpage').create(),
	system = require('system'),
	address, output, username, password, testindex = 0,
	loadInProgress = false,
	intervalTime = 50,
	run,
	steps;

function request() {
	clearInterval(run);
	if (!loadInProgress && typeof steps[testindex] === "function") {
		steps[testindex]();
		testindex++;
	}
	if (typeof steps[testindex] !== "function") {
		phantom.exit();
	}
	// dynamically change the run interval
	if (testindex === 3) {
		intervalTime = 4000;
	}
	run = setInterval(request, intervalTime); // start the setInterval()
}

page.onLoadStarted = function () {
	loadInProgress = true;
};

page.onLoadFinished = function () {
	loadInProgress = false;
};

if (system.args.length < 5) {
	phantom.exit(1);
} else {
	address = system.args[1];
	output = system.args[2];
	username = system.args[3];
	password = system.args[4];
	page.viewportSize = {
		width: 600,
		height: 600
	};
	page.paperSize = {
		format: 'A4',
		orientation: 'portrait',
		margin: '1cm'
	};

	page.onError = function (msg, trace) {
		var msgStack = ['ERROR: ' + msg];
		if (trace && trace.length) {
			msgStack.push('TRACE:');
			trace.forEach(function (t) {
				msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
			});
		}
	};
	page.settings.localToRemoteUrlAccessEnabled = true;
	page.settings.webSecurityEnabled = false;

	steps = [
			function () {
				//Load Login Page
				page.open(address);
			},
			function () {
				page.evaluate(function (usernameString, passwordString) {
					var username = document.getElementById("j_username");
					var password = document.getElementById("j_password");
					//Use system details
					username.value = usernameString;
					password.value = passwordString;
				}, username, password);
			},
			function () {
				page.evaluate(function () {
					var loginform = document.getElementById("loginform");
					loginform.submit();
				});
			},
			function () {
				page.render(output, {
					quality: 100
				});
				phantom.exit();
			}
		];
	run = setInterval(request, intervalTime); // start setInterval as "run"
}