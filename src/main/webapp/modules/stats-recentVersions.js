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
YUI.add('stats-recentVersions', function (Y) {
	var numberOfDecimal,
		trendChart,
		styleDef = {
			series: {
				passed: {
					marker: {
						fill: {
							color: "#ffffff"
						},
						border: {
							color: "#356635"
						},
						width: 5,
						height: 5
					},
					line: {
						color: "#d6e9c6",
						weight: 1
					},
					area: {
						color: "rgba(71,164,71,0.25)",
					}
				},
				failed: {
					line: {
						color: "#ebccd1",
						weight: 1
					},
					area: {
						color: "rgba(210,50,45,0.25)",
					},
					marker: {
						fill: {
							color: "#ffffff"
						},
						border: {
							color: "#953b39"
						},
						width: 5,
						height: 5
					}
				},
				skipped: {
					line: {
						color: "#bce8f1",
						weight: 1
					},
					area: {
						color: "rgba(188,232,241,0.25)",
					},
					marker: {
						fill: {
							color: "#ffffff"
						},
						border: {
							color: "#3a87ad"
						},
						width: 5,
						height: 5
					}
				},
				"undefined": {
					line: {
						color: "#faebcc",
						weight: 1
					},
					area: {
						color: "rgba(237,156,40,0.15)",
					},
					marker: {
						fill: {
							color: "#ffffff"
						},
						border: {
							color: "#a47e3c"
						},
						width: 5,
						height: 5
					}
				}
			}
		},
		trendChartAxes = {
			reportValues: {
				keys: ["passed", "failed", "skipped", "undefined"],
				position: "left",
				labelFunction: function (value) {
					return value.toFixed(numberOfDecimal);
				}
			},
			versions: {
				keys: ["version"],
				position: "bottom",
				type: "category",
				styles: {
					majorTicks: {
						display: "none"
					},
					label: {
						rotation: -45,
						margin: {
							top: 5
						}
					}
				}
			}
		},
		setTrendData = function (reportHistory, id) {
			var testsReportHistory = [],
				// max number of tests report value 
				maxValue = 0;

			// report history is in reverse order, first element is the newest report
			for (var i = 0; i < reportHistory.length; i++) {
				var report = reportHistory[i],
					passedTestsCount = report.summary.passed || 0,
					failedTestsCount = report.summary.failed || 0,
					undefinedTestsCount = report.summary["undefined"] || 0,
					skippedTestsCount = report.summary.skipped || 0,
					numberOfTests = passedTestsCount + failedTestsCount + undefinedTestsCount + skippedTestsCount;

				maxValue = Math.max(maxValue, numberOfTests);
				// build our graph data, report history is in reverse order, first element is the newest so use unshift instead of push
				testsReportHistory.unshift({
					version: report.coordinates.version + " : " + report.coordinates.build,
					passed: passedTestsCount,
					failed: failedTestsCount,
					"undefined": undefinedTestsCount,
					skipped: skippedTestsCount,
				});
			}

			// chart divides Y Axis in ten sections, if our max value if < 10, we want to display Y axis values with one decimal 
			numberOfDecimal = maxValue < 10 ? 1 : 0;

			// Instantiate and render the chart
			trendChart = new Y.Chart({
				dataProvider: testsReportHistory,
				stacked: true,
				horizontalGridlines: true,
				verticalGridlines: true,
				styles: styleDef,
				type: "combo",
				axes: trendChartAxes,
				render: id
			});
		},
		recentVersionCfg = {
			on: {
				success: function (id, o) {
					var reportHistory = JSON.parse(o.responseText);
					if (reportHistory.length > 0) {
						setTrendData(reportHistory, "#versionTrendChart");
					}
				},
				failure: function (id, o) {
					alert(id + ": Transaction Event Failure.  The status text is: " + o.statusText + ".");
				}
			}
		},
		uri = contextPath + "rest/automation-statistics/recent-versions/" + product + '?limit=10';

	Y.drawGraph = function () {
		Y.io(uri, recentVersionCfg);
	};

	Y.drawGraph();

	//Sent the request
	Y.io(uri, recentVersionCfg);
}, {
	requires: ['node', 'io-base', 'event-base', 'json-parse', 'querystring-parse', 'charts']
});
