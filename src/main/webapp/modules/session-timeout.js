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
YUI.add('session-timeout', function (Y) {
	var doMessage = true,
		error = false;

	function onFailure(tID, e) {
		if (e.status === 403 && doMessage) {
			var context = Y.statusHelpers.getContext(),
				template,
				modal,
				iframe;

			if (!Y.one('#login-modal')) {
				modal = Y.Node.create('<div class="modal" id="login-modal"></div>');
				template = Y.xbdd.getTemplate('session-timeout');
				modal.setHTML(template);
				Y.one('body').append(modal);
			} else {
				Y.all('.modal iframe').removeClass('login-iframe-hidden');
				Y.all('.modal iframe').addClass('login-iframe-shown');
			}

			//prevents user clicking out of modal
			$('#login-modal').modal('show').on('hide.bs.modal', function () {
				return false;
			});

			iframe = Y.one('.login-iframe');

			if (!iframe) {
				return false;
			}

			//set iframe src
			if (error) {
				iframe.set('src', context + '/j_security_check');
				error = false;
			} else {
				iframe.set('src', context);
			}

			iframe.on('load', function () {
				var iframeDoc = Y.one(iframe.getDOMNode().contentWindow.document),
					containers = iframeDoc.all('.container'),
					container = containers.item(containers.size() - 1),
					form = iframeDoc.one('form'),
					navbar = iframeDoc.one('.navbar-brand');

				if (navbar) {
					navbar.set('innerHTML', 'Your Session Has Timed Out');
					navbar.addClass('login-modal-navbar');
				}

				if (container) {
					container.addClass('login-modal-container');
				}

				//hides iframe when form is fired so that unwanted pages are not displayed
				if (form) {
					form.on('submit', function () {
						Y.all('.modal iframe').removeClass('login-iframe-shown');
						Y.all('.modal iframe').addClass('login-iframe-hidden');
					});
				}

				//Checks to leave modal
				iframe.on('load', function () {
					iframe.detach();
					Y.io(context, {
						method: 'GET',
						on: {
							success: function () {
								error = false;
							}
						}
					});
					$('#login-modal').unbind().modal('hide');
					doMessage = true;
					error = true;
				});
			});
			doMessage = false;
		}
	}
	Y.on('io:failure', onFailure, Y, 'Transaction Failed');
}, {
	requires: ['io-base', 'xbdd', 'io', 'statusHelpers']
});
