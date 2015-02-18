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
YUI.add('build-nav', function (Y) {


	Y.buildNav = {
		generateReportObject: function (data) {
			var reports = {};
			Y.Array.each(data, function (report) {
				var product = reports[report.coordinates.product],
					c = report.coordinates;
				if (!product) {
					product = {};
					reports[report.coordinates.product] = product;
					reports[report.coordinates.product].favourite = report.favourite;
				}
				if (!report.pinned) {
					report.pinned = [];
				}
				product['' + c.major + '.' + c.minor + '.' + c.servicePack] = {
					"value": report.builds.reverse(),
					"pinned": report.pinned.reverse()
				};
			});
			return reports;
		},
		renderNavs: function (data) {
			var reports,
				template = Y.Handlebars.compile(Y.xbdd.getTemplate('buildNav'));
			reports = Y.buildNav.generateReportObject(data);
			//Register handlebar helpers
			Y.Handlebars.registerHelper("eachProperty", Y.statusHelpers.eachProperty);
			Y.Handlebars.registerHelper("eachVersionInReverseOrder", Y.statusHelpers.eachVersionInReverseOrder);
			Y.Handlebars.registerHelper("latestVersionInBuild", Y.statusHelpers.latestVersionInBuild);
			Y.Handlebars.registerHelper('safeencode', Y.statusHelpers.safeEncode);
			Y.Handlebars.registerHelper("adminonly", Y.statusHelpers.adminOnly);
			Y.Handlebars.registerHelper("haspinned", function (data, options) {
				if (data.pinned.length) {
					return options.fn(this);
				}
			});
			Y.Handlebars.registerHelper("ispinned", function (build, vers, options) {
				if (vers.pinned.indexOf(build) !== -1) {
					return options.fn(this);
				}
			});

			//Render the build navs at the bottom of the page
			Y.one("body").append(Y.Node.create(template(reports)));

			//Listeners for seach and version select
			Y.all(".build-nav-vselect").on("change", Y.bind(function (e) {
				var product = e.target.getData('product');
				Y.all(".nav-in > ul").setStyle("display", "none");
				Y.one(document.getElementById(product + "buildsV" + e.target.get('value'))).setStyle("display", "block");
				this._initialiseMultipleState();
			}, this));

			Y.all(".build-search").on('keyup', function (e) {
				var scan = this.get('value').join("");
				e.target.ancestor().all("ul li").each(function () {
					if (this.get('text').split(scan).length > 1) {
						this.setStyle("display", "block");
					} else {
						this.setStyle("display", "none");
					}
				});
			});
			//listens for toggle of single and multiple build select
			Y.all(".toggle-multi-select").on('click', Y.bind(function () {
				this._toggleMultiple();
			}, this));

			//Wait for all other scripts to run before firing off the event
			//Timeout of 0 waits for thread to be empty
			setTimeout(function () {
				Y.Global.fire("product-build-render-complete");
			}, 0);
			
			//Listen for reorder request
			Y.all('.reorder-trigger').on('click', function (e) {
				var version = Y.one('.nav-in.active select').get('value');
				window.location = Y.statusHelpers.getContext() + '/build-order/' + e.currentTarget.getData('product') + '/' + version;
			});
		},
		navSlideOut: function (e) {
			//Get default product and version info
			//Get the versionSelect dropdown using the product href assign to the link that was clicked
			var productName = e.target.getData('product').replace(new RegExp(' ', 'g'), '_'),
				versionSelect = Y.one('#' + productName + ' #build-nav-vselect'),
				versionNumber = versionSelect.get('value'),
				fadeContainer = Y.Node.create('<div>').addClass('dismiss'),
				x;

			this._initialiseMultipleState();

			//One time set the default version
			Y.one(document.getElementById(productName + 'buildsV' + versionNumber)).addClass('active-builds').setStyle('display', 'block');

			Y.one('body').addClass('nav-vis').append(fadeContainer);
			//Force a client redraw so the transition works
			x = fadeContainer.getDOMNode().clientHeight;

			Y.one('.dismiss').addClass('fade-in').on('click', function () {
				Y.one('body').removeClass('nav-vis');
				Y.one('.nav-slide-right').removeClass('slide-in');
				Y.one('.dismiss').removeClass('fade-in');
				Y.all('#products-list .nav-tabs li.active').removeClass('active');
				//Wait for it to fade out for killing everything
				setTimeout(function () {
					Y.all('.dismiss').remove();
					Y.all('.nav-in.active').removeClass('active');
				}, 300);
			});
			Y.one('#' + productName).addClass('active').ancestor().addClass('slide-in');

			if (Y.all('.nav-in.active .build-nav-item').size() - Y.all('.nav-in.active .pinned-builds-cont .build-nav-item').size() < 2) {
				Y.all('.nav-in.active .toggle-multi-select').addClass('hidden');
			}
		},
		navSlideListeners: function (selectorString) {
			Y.all(selectorString).on('click', function (e) {
				if (e.target.getData('product') && !Y.one('.dismiss')) {
					Y.buildNav.navSlideOut(e);
				}
			});
		},
		_initialiseMultipleState: function () {
			$('[data-toggle=tooltip]').tooltip();
			this.multiple = false;
			this.selected = [];
			this._renderMultiple(this.multiple);
		},
		_toggleMultiple: function () {
			this.multiple = !this.multiple;
			this._renderMultiple(this.multiple);
		},
		_getUniqueSortedArray: function (array, builds) {
			var retArray = [],
				i;
			if (array.length > 1) {
				//sorts list
				array.sort(function (obj1, obj2) {
					return builds.indexOf(obj1) - builds.indexOf(obj2);
				});

				//makes unique list to return
				retArray.push(array[0]);
				for (i = 1; i < array.length; i++) {
					if (array[i] !== array[i - 1]) {
						retArray.push(array[i]);
					}
				}
				return retArray;
			}
			return array;
		},
		_renderMultiple: function (multiple) {
			var icon = Y.all('.toggle-multi-select .btn .glyphicon'),
				buildItems = Y.all('.build-nav-item'),
				productMenu = Y.all('.build-nav-item .product-action-menu').addClass('hidden'),
				builds = [],
				combineBuilds;

			Y.all('.nav-in.active .active-builds > .build-nav-item .build-link').each(function (item) {
				var buildName = item.get('innerHTML').replace('Build ', '');
				builds.push(buildName);
			});

			if (multiple) {
				Y.all('.btn-group-justified.up-new').prepend('<a class="btn btn-info combine-builds" disabled>Merge View</a>');
				Y.all('.btn-group-justified.up-new .open-upload').addClass('hidden');
				combineBuilds = Y.all('.btn-group-justified.up-new .combine-builds');
				icon.removeClass('glyphicon-list').addClass('glyphicon-align-justify');

				buildItems.addClass('un-selected');
				productMenu.addClass('hidden');

				Y.all('.btn-group-justified.up-new .combine-builds').on('click', Y.bind(function () {
					var form = Y.Node.create('<form action="' + Y.statusHelpers.getContext() + 'reports/multiple" method="post"></form>'),
						activeNav = Y.one('.nav-in.active'),
						versionSelector = activeNav.one('#build-nav-vselect'),
						productName = activeNav.one('.open-upload').getAttribute('name');

					if (versionSelector) {
						this.selected = this._getUniqueSortedArray(this.selected, builds);
						//append builds
						form.append(Y.Node.create('<input name="builds" />').set('value', JSON.stringify(this.selected)));
						//append version
						form.append(Y.Node.create('<input name="version" />').set('value', versionSelector.get('value')));
						//append product
						form.append(Y.Node.create('<input name="product" />').set('value', productName));
						form.submit();
					}
				}, this));

				Y.all('.build-nav-item .build-link').on('click', Y.bind(function (e) {
					var current = e.currentTarget,
						build = current.ancestor(),
						buildName = build.one('.build-link').get('innerHTML').replace('Build ', ''),
						buildPosition;

					e.preventDefault();
					e.stopPropagation();

					if (e.clientX !== -1) {
						Y.all('.nav-in a[href="' + current.getAttribute('href') + '"]').each(function (item) {
							if (item !== current) {
								item.simulate("click", {
									clientX: -1
								});
							}
						});
					}

					build.toggleClass('un-selected');
					build.one('.glyphicon-ok').toggleClass('hidden');

					if (!build.hasClass('un-selected')) {
						this.selected.push(buildName);
					} else {
						buildPosition = this.selected.indexOf(buildName);
						if (~buildPosition) {
							this.selected.splice(buildPosition, 1);
						}
					}

					if (this._getUniqueSortedArray(this.selected, builds).length > 1) {
						combineBuilds.removeAttribute('disabled');
					} else {
						combineBuilds.setAttribute('disabled');
					}
				}, this));
			} else {
				Y.all('.build-nav-item .glyphicon-ok').addClass('hidden');
				Y.all('.btn-group-justified.up-new .open-upload').removeClass('hidden');

				Y.all('.btn-group-justified.up-new .combine-builds').remove();
				icon.removeClass('glyphicon-align-justify').addClass('glyphicon-list');

				this.selected = [];

				Y.all('.build-nav-item .build-link').detach();
				buildItems.removeClass('un-selected');
				productMenu.removeClass('hidden');
			}
		}
	};
}, {
	requires: ['node', 'event-base', 'handlebars', 'json-parse', 'node-event-simulate', 'statusHelpers']
});
