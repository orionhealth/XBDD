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
YUI.add('xbdd-build-stats', function (Y) {
	var percent = function (n, t) {
		return Math.round((n * 100) / t);
	};

	Y.namespace('buildStats').buildStatsObject = new Y.Base.create('buildStatsView', Y.View, [], {
		render: function (graphs) {
			var container = Y.one("#buildStats");
			container.append("<div id='stats-1'></div>");
			container.append("<div id='stats-2'></div>");
			this.set('buildContainer', Y.one('#stats-1'));
			this.set('productContainer', Y.one('#stats-2'));
			this.graphs = typeof graphs === 'undefined';
			this.doRender = (this.graphs ? true : graphs);
			
			if (this.doRender) {
				this._getBuildStats();
			}
			if (this.graphs) {
				this._renderProductStats();
			}
		},
		_getBuildStats: function () {
			Y.io(Y.statusHelpers.getContext() + 'rest/stats/build/' + product + '/' + version + '/' + build, {
				method: "GET",
				on: {
					success: Y.bind(function (tId, response) {
						var data = response.responseText,
							json = Y.JSON.parse(data);

						json.total = {
							"p": json.automated.p + json.manual.p,
							"f": json.automated.f + json.manual.f,
							"s": json.automated.s + json.manual.s,
							"u": json.automated.u + json.manual.u
						};

						json.total.t = json.total.p + json.total.f + json.total.s + json.total.u;

						this._renderBuildStatsTemplate(json);
					}, this)
				}
			});
		},
		_generateRatioData: function (json) {
			var total = json.p + json.f + json.u + json.s;

			return [{
				label: 'Passed',
				value: percent(json.p, total)
			}, {
				label: 'Failed',
				value: percent(json.f, total)
			}, {
				label: 'Undefined',
				value: percent(json.u, total)
			}, {
				label: 'Skipped',
				value: percent(json.s, total)
			}];
		},
		_renderBuildStatsTemplate: function (json) {
			var container = this.get('buildContainer'),
				template = Y.Handlebars.compile(Y.xbdd.getTemplate('buildStats')),
				totalAuto = json.automated.p + json.automated.f + json.automated.s + json.automated.u,
				totalManual = json.manual.p + json.manual.f + json.manual.s + json.manual.u,
				total = totalAuto + totalManual,
				contextualColors = ['#5cb85c', '#d9534f', '#f0ad4e', '#5bc0de'],
				ratioAll = this._generateRatioData(json.total),
				ratioAuto = this._generateRatioData(json.automated),
				ratioManual = this._generateRatioData(json.manual),
				ratioAutoMan = [{
					label: 'Automated',
					value: percent(totalAuto, total)
				}, {
					label: 'Manual',
					value: percent(totalManual, total)
				}],
				formatter = function (y) {
					return y + '%';
				};

			// Set the bootstramp column width in handlebars (col-lg-X)
			// If there are Auto and Manual tests then there will be 4 graphs so col-lg-3
			// If there is only one out of Auto and Manual then there will be 3 graphs so col-lg-4
			// If there are no Auto or Manual then there will be two graphs so col-lg-6
			json.lgcol = (totalAuto && totalManual ? 3 : (totalAuto || totalManual ? 4 : 6));
			json.ta = totalAuto;
			json.tm = totalManual;
			json.showGraphs = this.graphs;
			container.setHTML(template(json));

			//Render the graphs
			Morris.Donut({
				element: 'ratio-all',
				data: ratioAll,
				colors: contextualColors,
				formatter: formatter,
				resize: true
			});
			if (totalAuto) {
				Morris.Donut({
					element: 'ratio-auto',
					data: ratioAuto,
					colors: contextualColors,
					formatter: formatter,
					resize: true
				});
			}
			if (totalManual) {
				Morris.Donut({
					element: 'ratio-manual',
					data: ratioManual,
					colors: contextualColors,
					formatter: formatter,
					resize: true
				});
			}
			Morris.Donut({
				element: 'ratio-auto-vs-manual',
				data: ratioAutoMan,
				formatter: function (y) {
					return y + '%';
				},
				resize: true
			});
		},
		_renderProductStats: function () {
			Y.io(Y.statusHelpers.getContext() + 'rest/stats/product/' + product + '/' + version + '/' + build, {
				method: "GET",
				on: {
					success: Y.bind(function (tId, response) {
						var data = response.responseText,
							json = Y.JSON.parse(data);

						this.set('productJson', json);
						this._renderProductStatsTemplate(this.get('productJson'));
					}, this)
				}
			});
		},
		_renderProductStatsTemplate: function (json) {
			var container = this.get('productContainer'),
				template = Y.Handlebars.compile(Y.xbdd.getTemplate('productStats')),
				html = template(json),
				data = this._generateProductData("20");

			container.setHTML(html);

			this._drawProductGraph(data);

			this._addProductClickListeners();
		},
		_drawProductGraph: function (data) {
			var contextualColors = ['#5cb85c', '#d9534f', '#f0ad4e', '#5bc0de'];
			Y.one('#build-graph').setHTML('');

			Morris.Area({
				element: 'build-graph',
				data: data,
				xkey: 'name',
				ykeys: ['passed', 'failed', 'undefined', 'skipped'],
				labels: ['Passed', 'Failed', 'Undefined', 'Skipped'],
				lineColors: contextualColors,
				parseTime: false,
				hideHover: true,
				ymin: 0,
				hoverCallback: function (index, options, content, row) {
					var temp = Y.Node.create("<div></div>");

					temp.setHTML(content);
					temp.one('.morris-hover-row-label').setHTML('Build&nbsp;' + row.name);
					return temp.getHTML();
				}
			});
		},
		_addProductClickListeners: function () {
			var buttons = Y.all('#stats-2 .btn-group .btn[data-builds]'),
				input = Y.one('#stats-2 .btn input');

			buttons.on('click', Y.bind(function (e) {
				var targetButton = e.currentTarget,
					i = targetButton.getData('builds');

				Y.all('#stats-2 .btn-group .btn').removeClass('active');
				targetButton.addClass('active');

				setTimeout(Y.bind(function () {
					this._drawProductGraph(this._generateProductData(i));
				}, this), 0);
			}, this));

			input.on('paste', function (e) {
				e.preventDefault();
			});

			input.on('keydown', function (e) {
				var key = String.fromCharCode(e.charCode),
					arr = [8, 9, 13, 16, 17, 18, 35, 36, 37, 39, 45, 46];
				if (parseInt(key).toString() !== key && arr.indexOf(e.charCode) === -1) {
					e.preventDefault();
				} else if (parseInt(key).toString() === key) {
					Y.all('#stats-2 .btn-group .btn').removeClass('active');
					e.target.ancestor().addClass('active');
				}
			});

			input.on('keyup', Y.bind(function (e) {
				setTimeout(Y.bind(function () {
					this._drawProductGraph(this._generateProductData(parseInt(e.target.get('value'))));
				}, this), 0);
			}, this));
		},
		_generateProductData: function (i) {
			var json = this.get('productJson'),
				x = json.length - parseInt(i),
				index = (x < 0 ? 0 : x);

			if (parseInt(i).toString() === i.toString()) {
				return json.slice(index);
			} else {
				return json;
			}
		}
	}, {
		ATTRS: {
			// The DIV container for the build graphs
			buildContainer: {
				value: []
			},
			// The DIV container for the product graph
			productContainer: {
				value: []
			},
			// The JSON used to render and redraw the product graph
			productJson: {
				value: []
			}
		}
	});
});
