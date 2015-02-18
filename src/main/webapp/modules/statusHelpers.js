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
YUI.add('statusHelpers', function (Y) {

	var escapeCucumberId = function (id) {
		return id.replace(/\W/g, '');
	};

	var contains = function (array, value) {
		var i = 0;
		for (i = 0; i < array.length; i++) {
			if (array[i] === value) return true;
		}
		return false;
	};

	var reduceStatuses = function (allStatuses) {
		if (contains(allStatuses, "failed")) return "failed";
		if (contains(allStatuses, "undefined")) return "undefined";
		if (contains(allStatuses, "skipped")) return "skipped";
		if (contains(allStatuses, "passed")) return "passed";
		else {
			return "unknown status? - expected passed,failed or undefined";
		}
	};

	var getAutomatedStepStatusClass = function (status) {
		switch (status) {
		case 'failed':
			return 'step-failed-auto';
		case 'passed':
			return 'step-passed-auto';
		default:
			return '';
		}
	};

	var getManualStatusClass = function (status) {
		switch (status) {
		case 'failed':
			return 'step-failed';
		case 'passed':
			return 'step-passed';
		default:
			return '';
		}
	};

	var getStatusStyle = function (status) {
		switch (status) {
		case 'failed':
			return 'danger';
		case 'undefined':
			return 'warning';
		case 'skipped':
			return 'info';
		case 'passed':
			return 'success';
		default:
			return 'muted';
		}
	};

	var getStatusStyleIcon = function (status) {
		switch (status) {
		case 'failed':
			return 'text-danger glyphicon glyphicon-remove-sign';
		case 'undefined':
			return 'text-warning glyphicon glyphicon-question-sign';
		case 'skipped':
			return 'text-info glyphicon glyphicon-minus-sign';
		case 'passed':
			return 'text-success glyphicon glyphicon-ok-sign';
		case 'dont exist':
			return 'text-muted glyphicon glyphicon-ban-circle';
		case 'unknown status? - expected passed,failed or undefined':
			return 'text-muted glyphicon glyphicon-unchecked';
		default:
			{
				return 'icon-warning';
			}
		}
	};

	var getFeatureStatusStyle = function (featureStatus) {
		return getStatusStyle(featureStatus);
	};

	var getScenarioStatusStyle = function (scenario) {
		return getStatusStyle(getScenarioStatus(scenario));
	};

	var getScenarioStatusIcon = function (scenario) {
		return getStatusStyleIcon(getScenarioStatus(scenario));
	};

	var getAutomatedScenarioStatusIcon = function (scenario) {
		return getStatusStyleIcon(getAutomatedScenarioStatus(scenario));
	};

	var getScenarioStatus = function (scenario) {
		return getFinalScenarioStatus(scenario, true);
	};

	var getAutomatedScenarioStatus = function (scenario) {
		return getFinalScenarioStatus(scenario, false);
	};

	// go through all the steps in a scenario and reduce to a status for the scenario.
	var getFinalScenarioStatus = function (scenario, includeManualResults) {
		var allStatuses = [],
			i,
			hasManuallyExecutedSteps = false,
			manualSteps = [],
			step;
		if (includeManualResults) { //if we have got a bunch of manual step executions
			if (scenario.steps) {
				for (i = 0; i < scenario.steps.length; i++) {
					step = scenario.steps[i];
					if (step.result.manualStatus) {
						manualSteps.push(step.result.manualStatus); //if there is manual status include it
						hasManuallyExecutedSteps = true; //mark that there is a manual step executed
					} else {
						manualSteps.push('undefined'); // otherwise it is effectively unexecuted/undefined
					}
				}
			}
			// do the same for the background steps
			if (scenario.background) { //only if there are background steps.
				for (i = 0; i < scenario.background.steps.length; i++) {
					step = scenario.background.steps[i];
					if (step.result.manualStatus) {
						manualSteps.push(step.result.manualStatus); //if there is manual status include it
						hasManuallyExecutedSteps = true; //mark that there is a manual step executed
					} else {
						manualSteps.push('undefined'); // otherwise it is effectively unexecuted/undefined
					}
				}
			}
			if (hasManuallyExecutedSteps) { //if any steps have been executed
				allStatuses = allStatuses.concat(manualSteps); //then treat this scenario as though it has been manually executed.
			} else {
				if (scenario.steps) {
					for (i = 0; i < scenario.steps.length; i++) {
						step = scenario.steps[i];
						allStatuses.push(step.result.status); //otherwise just include whatever automated step statuses exist.
					}
				}
				if (scenario.background) {
					for (i = 0; i < scenario.background.steps.length; i++) {
						step = scenario.background.steps[i];
						allStatuses.push(step.result.status); //make sure to include the background steps too.
					}
				}
			}
		} else { //if we are not including manual steps then just include the automated statuses.
			if (scenario.steps) {
				for (i = 0; i < scenario.steps.length; i++) {
					step = scenario.steps[i];
					allStatuses.push(step.result.status);
				}
			}
			if (scenario.background) {
				for (i = 0; i < scenario.background.steps.length; i++) {
					step = scenario.background.steps[i];
					allStatuses.push(step.result.status); //make sure to include the background steps too.
				}
			}
		}

		var result = reduceStatuses(allStatuses);
		return result;
	};

	var eachProperty = function (context, options) {
		var ret = "",
			keys = Y.Object.keys(context).sort(function (a, b) {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			}),
			sortedContext = {};

		Y.Array.each(keys, function (key) {
			sortedContext[key] = context[key];
		});

		for (var prop in sortedContext) {
			if (sortedContext.hasOwnProperty(prop)) {
				var property = {
					key: prop,
					value: sortedContext[prop]
				};
				ret = ret + options.fn(property);
			}
		}
		return ret;
	};

	var eachVersionInReverseOrder = function (context, options) {
		var ret = "",
			versionArray = [];
		// extract all the versions in the array
		for (var prop in context) {
			if (context.hasOwnProperty(prop) && prop !== 'favourite') {
				versionArray.push(prop);
			}
		}
		//sort by reverse order, going through major,minor,sp
		versionArray = versionArray.sort(function (a, b) {
			var aV = a.split('.');
			var bV = b.split('.');
			var aVal, bVal;
			var i;
			for (i = 0; i < 3; i++) {
				aVal = parseInt(aV[i]);
				bVal = parseInt(bV[i]);
				if (aVal !== bVal) {
					return aVal - bVal;
				}
			}
			return 0;
		}).reverse();

		//go through the ordered array and render.
		var i;
		for (i = 0; i < versionArray.length; i++) {
			var property = {
				key: versionArray[i],
				value: context[versionArray[i]].value,
				pinned: context[versionArray[i]].pinned
			};
			ret = ret + options.fn(property);
		}
		return ret;
	};

	var latestVersionInBuild = function (context, options) {
		var ret = "",
			versionArray = [];
		// extract all the versions in the array
		for (var prop in context) {
			if (context.hasOwnProperty(prop)) {
				versionArray.push(prop);
			}
		}
		//sort by reverse order, going through major,minor,sp
		versionArray = versionArray.sort(function (a, b) {
			var aV = a.split('.'),
				bV = b.split('.'),
				aVal, bVal,
				i;

			for (i = 0; i < 3; i++) {
				aVal = parseInt(aV[i]);
				bVal = parseInt(bV[i]);
				if (aVal !== bVal) {
					return aVal - bVal;
				}
			}
			return 0;
		}).reverse();
		//render with the first version
		var property = {
			key: versionArray[0],
			value: context[versionArray[0]]
		};
		ret = ret + options.fn(property);
		return ret;
	};

	/**
	 * Does what "each" does but give you an object that also contains the array index
	 */
	var eachArray = function (context, options) {
		var modulo = options.hash.modulo,
			ret = "",
			i = 0;

		for (i = 0; i < context.length; i++) {
			var ob = {
				item: context[i],
				index: i
			};
			if (modulo) {
				ob.modulo = ((i % modulo) === 0);
			}
			if (i === context.length - 1) {
				ob.last = true;
			}
			ret = ret + options.fn(ob);
		}
		return ret;
	};

	var getFeatureURLFromFeature = function (feature) {
		var url = contextPath + "reports" +
			"/" + feature.coordinates.product +
			"/" + feature.coordinates.version +
			"/" + feature.coordinates.build +
			"/" + feature.id;
		return url;
	};

	var niceDate = function (date) {
		if (date) {
			return moment(date.$date).fromNow();
		} else {
			return 'Un-edited';
		}
	};

	var setCollapseState = function (id, expandedScenarios) {
		id = escapeCucumberId(id); //ensure the id is escaped.
		if (expandedScenarios[id]) {
			return "in";
		} else {
			return "collapse";
		}
	};

	var timeDate = function (date) {
		if (date) {
			return moment(date).format("dddd DD.MM.YYYY h:mm a");
		}
	};

	var getContext = function () {
		return contextPath;
	};

	var constructEdit = function (edit) {
		if (edit.id.indexOf("embeddings") === 0) {
			//display as embedding
			if (edit.added !== null) {
				return edit.added + " <div  class='label-div'><span class='label alert-success curr-label'>added</span></div>";
			} else if (edit.removed !== null) {
				return edit.removed + "<div  class='label-div'><span class='label alert-danger curr-label'>removed</span></div>";
			}
		} else {
			//display as statechage 
			return edit.id + "<div class='edit-label'><div class='label-div'><span class='label alert-" + getStatusStyle(edit.prev) + " prev-label'>" + edit.prev + "</span></div><div class='arrow-div'><span class='html-entity'>&#8594;</span> </div><div  class='label-div'><span class='label alert-" + getStatusStyle(edit.curr) + " curr-label'>" + edit.curr + "</span></div></div>	";
		}
	};

	var toMarkDown = (function () {
		var styledRender = new marked.Renderer();
		styledRender.table = function (header, body) {
			return "<table class='table table-hover'>" + header + body + "</table>";
		};
		marked.setOptions({
			renderer: styledRender,
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			sanitize: true,
			smartLists: true,
			smartypants: false
		});
		return function (markDownText) {
			markDownText = (!markDownText ? "" : markDownText);
			return marked(markDownText);
		};
	})();

	var safeEncode = function (options) {
		return (options.fn(this)).toString().replace(/\ /g, '_');
	};

	var adminOnly = function (options) {
		return (admin ? options.fn(this) : '');
	};

	Y.statusHelpers = {
		"adminOnly": adminOnly,
		"eachArray": eachArray,
		"eachProperty": eachProperty,
		"eachVersionInReverseOrder": eachVersionInReverseOrder,
		"escapeCucumberId": escapeCucumberId,
		"getAutomatedScenarioStatus": getAutomatedScenarioStatus,
		"getAutomatedScenarioStatusIcon": getAutomatedScenarioStatusIcon,
		"getAutomatedStepStatusClass": getAutomatedStepStatusClass,
		"getFeatureURLFromFeature": getFeatureURLFromFeature,
		"getScenarioStatus": getScenarioStatus,
		"getScenarioStatusIcon": getScenarioStatusIcon,
		"getScenarioStatusStyle": getScenarioStatusStyle,
		"getStatusStyleIcon": getStatusStyleIcon,
		"getStatusStyle": getStatusStyle,
		"latestVersionInBuild": latestVersionInBuild,
		"toMarkDown": toMarkDown,
		"niceDate": niceDate,
		"getContext": getContext,
		"getManualStatusClass": getManualStatusClass,
		"safeEncode": safeEncode,
		"setCollapseState": setCollapseState,
		"timeDate": timeDate,
		"constructEdit": constructEdit,
		"getFeatureStatusStyle": getFeatureStatusStyle
	};


}, '0.0.1', {
	requires: ['querystring-parse']
});
