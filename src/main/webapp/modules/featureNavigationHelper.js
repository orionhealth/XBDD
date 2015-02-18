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
YUI.add('feature-navigation-helper', function (Y) {
	var scrollY,
		onElementLoaded,
		getCurrentFeature,
		loadFeature,
		loadScenario,
		getScenarioOffset;

	scrollY = function (offset, animationDuration) {
		var scroll;

		scroll = new Y.Anim({
			duration: animationDuration,
			node: 'win',
			easing: 'easeBoth',
			to: {
				scroll: [0, offset]
			}
		});

		scroll.run();
	};

	onElementLoaded = function (waitTime, element, callback) {
		var pollCount = 0,
			POLL_INTERVAL_TIME = 100,
			failCount,
			pollInterval;

		failCount = waitTime / POLL_INTERVAL_TIME;

		pollInterval = setInterval(function () {
			//Scrolls to the scenario that is clicked on
			if (element()) {
				clearTimeout(pollInterval);
				callback();
			} else {
				if (pollCount >= failCount) {
					//ajax request appears to have failed
					clearTimeout(pollInterval);
					throw "element not found";
				}
				pollCount++;
			}
		}, POLL_INTERVAL_TIME);
	};

	getCurrentFeature = function () {
		var currentFeature = null;

		Y.all('.row.feature').each(function (item) {
			if (item.getAttribute('data-feature-id')) {
				currentFeature = item.getAttribute('data-feature-id');
			}
		});
		return currentFeature;
	};

	getScenarioOffset = function (selectedScenario) {
		var allScenarios = Y.all('.panel-group .scenario-entry-header'),
			scenarioIndex = allScenarios.indexOf(selectedScenario),
			SCENARIO_PADDING = 5,
			offset = 0,
			count = 0,
			firstScenario;

		if (scenarioIndex !== -1) {
			firstScenario = Y.one(".panel-group .scenario-section");
			if (firstScenario) {
				offset = parseInt(firstScenario.getXY()[1]);
				allScenarios.each(function () {
					if (count < scenarioIndex) {
						count++;
						offset += parseInt(this.getComputedStyle('height')) + SCENARIO_PADDING;
					}
				});
			}
		}
		offset -= 60;
		return offset;
	};

	loadFeature = function (featureIdLoad, dontScroll) {
		var ANIMATION_DURATION = 0.5;

		if (featureIdLoad !== getCurrentFeature()) {
			Y.Global.fire('indexEntryClicked', {
				featureId: featureIdLoad
			});
		}
		if (typeof dontScroll === 'undefined' || dontScroll === false) {
			scrollY(0, ANIMATION_DURATION);
		}
	};

	loadScenario = function (featureId, scenarioId) {
		var ANIMATION_DURATION = 0.5,
			WAIT_TIME = 2000,
			scenario = function () {
				return Y.one('div[id=\"' + scenarioId.replace("'", "\'") + '\"] div.row.scenario-entry-header');
			},
			rollup = function () {
				return Y.one('.rollup .rollupTable');
			};

		if (getCurrentFeature() !== featureId) {
			loadFeature(featureId, true);
		}

		onElementLoaded(WAIT_TIME, scenario, function () {
			onElementLoaded(WAIT_TIME, rollup, function () {
				var selectedScenario = scenario(),
					offset;

				offset = getScenarioOffset(selectedScenario);

				scrollY(offset, ANIMATION_DURATION);

				//opens the scenario content
				if (selectedScenario.ancestor('.scenario-link.collapsed')) {
					selectedScenario.simulate('click');
				}
			});
		});
	};

	Y.FeatureNavigationHelper = {
		'loadFeature': loadFeature,
		'loadScenario': loadScenario
	};
});
