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
YUI.add('favourites', function (Y) {
	var clickHandle,
		pinHandle;
	Y.Global.globalFire = true;

	Y.Global.on("product-build-render-complete", function () {
		if (Y.Global.globalFire) {
			Y.Favourites.addPinHandles(".pin-build");
			Y.Global.globalFire = false;
		}
	});

	Y.Favourites = {
		toggleFavouriteState: function (product, state) {
			var method = (state ? 'PUT' : 'DELETE');

			Y.io(contextPath + 'rest/favourites/' + product, {
				method: method,
				on: {
					success: function () {
						Y.Favourites.renderFavourites();
					},
					failure: function () {
						alert("Something went wrong whith the favourite process");
					}
				}
			});
		},
		addFavouriteTogglers: function (selectorString) {
			if (clickHandle) {
				clickHandle.detach();
			}
			clickHandle = Y.all(selectorString).on("click", function (e) {
				var that = e.currentTarget.one('.fav-state');

				Y.Favourites.toggleFavouriteState(e.currentTarget.getData("product"), !that.hasClass('gold-star'));

				Y.all(".product-action-menu .fav-state").each(function () {
					var string = this.ancestor().all('span').item(1);
					
					if (this.ancestor('.toggle-fav').getData('product') === that.ancestor('.toggle-fav').getData('product')) {
						this.toggleClass("glyphicon-star-empty").toggleClass("glyphicon-star").toggleClass("gold-star");
						string.setHTML((string.getHTML() === 'Favourite' ? 'Un-Favourite' : 'Favourite'));
					}
				});
			});
		},
		getFavouriteState: function (product, callback) {
			Y.io(contextPath + 'rest/favourites/' + product, {
				method: 'GET',
				on: {
					success: function (tID, response) {
						var data = Y.JSON.parse(response.responseText);
						callback(data.state);
					}
				}
			});
		},
		renderFavourites: function () {
			Y.io(contextPath + 'rest/favourites/', {
				method: 'GET',
				on: {
					success: function (tID, response) {
						var data = Y.buildNav.generateReportObject(Y.JSON.parse(response.responseText)),
							Handlebars = Y.Handlebars,
							productTemplate = Handlebars.compile(Y.xbdd.getTemplate('products')),
							empty = true;

						//Render the favourites
						Y.one("#favourites-container").setHTML(productTemplate(data));
						Y.Favourites.addFavouriteTogglers(".product-action-menu .toggle-fav");
						Y.buildNav.navSlideListeners("#favourites-container .product-item");

						for (var prop in data) {
							if (data.hasOwnProperty(prop)) {
								empty = false;
							}
						}
						if (empty) {
							Y.one("#favourites-container").setHTML('<h1><small>You have no favourites yet</small></h1>');
						}
						Y.Global.fire("product-build-render-complete");
					}
				}
			});
		},
		addPinHandles: function (selector) {
			Y.all(selector).detach("|*");
			pinHandle = Y.all(selector).on("pinning|click", function (e) {
				Y.Favourites.togglePinState(e.currentTarget.getData("build"), e.currentTarget.getData("pinned"));
				return false;
			});
		},
		togglePinState: function (uri, pinned) {
			var method = (pinned === "true" ? "DELETE" : "PUT");

			Y.io(contextPath + 'rest/favourites/pin/' + uri, {
				method: method,
				on: {
					success: function () {
						alert(uri + " has been " + (pinned === "true" ? "un-pinned" : "pinned") + " successfully");
						window.location.reload();
						return false;
					},
					failure: function () {
						alert("Something went wrong with the pinning process");
						return false;
					}
				}
			});
			return false;
		}
	};
}, {
	requires: ['node', 'io-base', 'event-base', 'handlebars', 'json-parse', 'build-nav', 'event-custom']
});
