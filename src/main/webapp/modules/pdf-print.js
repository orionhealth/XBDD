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
YUI().add('pdf-print', function (Y) {
	Y.pdfPrint = {};
	Y.pdfPrint.connectDropdown = function () {
		var q = Y.QueryString.parse(window.location.search.substr(1));
		var queryString = product + '/' + version + '/' + build;

		// Panel showing PhantomJS was missing
		var phantomMissing = new Y.Panel({
			srcNode: '#phantomMissing',
			width: 300,
			zIndex: 6,
			centered: true,
			modal: true,
			visible: false,
			render: true,
			plugins: [Y.Plugin.Drag],
			buttons: [{
				value: 'OK',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					phantomMissing.hide();
					window.location.href = contextPath + 'print/' + queryString;
				}
			}, {
				value: 'Back to Report',
				section: Y.WidgetStdMod.FOOTER,
				action: function (e) {
					e.preventDefault();
					phantomMissing.hide();
					window.location.href = contextPath + 'reports/' + queryString;
				}
			}]
		});

		// To be displayed if this page was redirected as PhantomJS was missing
		if (q.phantom === "no") {
			phantomMissing.show();
		}

		// Return to listFeaturesForReport
		var returnNode = Y.one('#return');
		if (returnNode) {
			returnNode.on('click', function (node) {
				node.preventDefault();
				window.location.href = contextPath + 'reports/' + queryString;
			});
		}
		//View a PDF report
		Y.one('#view-PDF').on('click', function (node) {
			node.preventDefault();
			window.location.href = contextPath + 'rest/pdfreports/' + queryString;
		});
		//Download a PDF report
		Y.one('#download-PDF').on('click', function (node) {
			node.preventDefault();
			window.location.href = contextPath + 'rest/pdfreports/' + queryString + '?view=attachment';
		});
		//Print preview in web
		var previewNode = Y.one('#preview-Web');
		if (previewNode) {
			previewNode.on('click', function (node) {
				node.preventDefault();
				window.location.href = contextPath + 'print/' + queryString;
			});
		}
	};
}, '0.0.1', {
	requires: ['node', 'event-base', 'querystring-parse', 'panel']
});
