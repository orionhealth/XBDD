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
YUI().add('print-feature-select', function (Y) {
	Y.namespace('Print.Select');
	Y.Print.Select = {
		init: function(render) {
			this._initClickListeners();
			this.buildStats = new Y.buildStats.buildStatsObject();
			this.buildStats.render(true && typeof render === 'undefined');
		},
		_initClickListeners: function () {
			var bars = Y.all('#controls .btn-group'),
				statusBar = bars.item(0),
				chooseBar = bars.item(1);

			this.statusVis = {
				passed: true,
				failed: true,
				undefined: true,
				skipped: true
			};

			this.features = [];
			this.tags = [];

			statusBar.all('.btn').on('click', Y.bind(function (e) {
				e.currentTarget.toggleClass('btn-faded');
				this._toggleStatus(e.currentTarget.getData('status'));
			}, this));

			chooseBar.one('.btn').on('click', Y.bind(function (e) {
				this._toggleAttachments(e.currentTarget);
			}, this));
		},
		_toggleStatus: function (status) {
			this.statusVis[status] = !this.statusVis[status];
			this._filterPrint();
		},
		_toggleAttachments: function (btn) {
			btn.setHTML((btn.getHTML().split('Hide').length > 1 ? 'Show Attachments' : 'Hide Attachments'));
			btn.toggleClass('active');
			Y.all('.attach-image').toggleClass('hidden');
		},
		_filterPrint: function () {
			var features = this.features,
				f,
				featureId;

			for (f = 0; f < features.length; f++) {
				featureId = features[f].id;
				if (!Y.one('#featureSelectList .feature[data-rel-feature=' + featureId + ']').hasClass('selected') || !this.statusVis[Y.one('#' + featureId).getData('status')]) {
					Y.one('#' + featureId).setStyle('display', 'none');
				} else {
					Y.one('#' + featureId).setStyle('display', 'block');
				}
			}
		},
		_toggleBigSelect: function () {
			var selectAll = Y.one('#selectAllFeatures'),
				selectNone = Y.one('#selectNoFeatures'),
				selectList = Y.one('#featureSelectList'),
				fade = 'btn-faded',
				numFeatures = selectList.all('.feature').size(),
				numSelected = selectList.all('.feature.selected').size(),
				tags = Y.all('.btn[data-tag]');
			
			if (numFeatures === numSelected && numFeatures !== 0) {
				selectAll.addClass(fade);
				selectNone.removeClass(fade);
				tags.removeClass(fade);
			} else if (numSelected === 0) {
				selectAll.removeClass(fade);
				selectNone.addClass(fade);
				tags.addClass(fade);
			} else {
				selectAll.removeClass(fade);
				selectNone.removeClass(fade);
			}
		},
		_addClickListeners: function () {
			Y.all('#featureSelectList .feature').on('click', Y.bind(function (e) {
				e.currentTarget.toggleClass('selected');
				this._updateTagSelection();
				this._toggleBigSelect();
			}, this));

			Y.one('#makeFeatureSelection').on('click', Y.bind(function () {
				this._filterPrint();
				$("#featureSelect").modal('hide');
			}, this));

			Y.one('#selectNoFeatures').on('click', Y.bind(function () {
				Y.all('#featureSelectList .feature.selected').removeClass('selected');
				this._toggleBigSelect();
			}, this));

			Y.one('#selectAllFeatures').on('click', Y.bind(function () {
				Y.all('#featureSelectList .feature').addClass('selected');
				this._toggleBigSelect();
			}, this));

			Y.all('.tag-selection').on('click', Y.bind(function (e) {
				var btn = e.currentTarget,
					features = this.tags[btn.getData('tag')].features,
					selectedFeatures = [],
					unselectedFeatures = [],
					fade = btn.hasClass('btn-faded'),
					featureList = Y.one('#featureSelectList'),
					tagFeatures,
					i,
					t,
					f;

				btn.toggleClass('btn-faded');
				for (f = 0; f < features.length; f++) {
					for (t = 0; t < this.tags.length; t++) {
						tagFeatures = this.tags[t].features;
						for (i = 0; i < tagFeatures.length; i++) {
							if (tagFeatures[i] === features[f] && !Y.one('.btn[data-tag="' + t + '"]').hasClass('btn-faded')) {
								selectedFeatures.push(features[f]);
							} else if (tagFeatures[i] === features[f]) {
								unselectedFeatures.push(features[f]);
							}
						}
					}
				}
				for (i = 0; i < unselectedFeatures.length; i++) {
					featureList.one('.feature[data-rel-feature=' + unselectedFeatures[i] + ']').removeClass('selected');
				}
				for (i = 0; i < selectedFeatures.length; i++) {
					featureList.one('.feature[data-rel-feature=' + selectedFeatures[i] + ']').addClass('selected');
				}
				this._toggleBigSelect();
				if (fade === btn.hasClass('btn-faded')) {
					btn.toggleClass('btn-faded');
				}
			}, this));
		},
		_updateTagSelection: function () {
			var featureId,
				selectCount,
				i,
				f;

			for (i = 0; i < this.tags.length; i++) {
				selectCount = 0;
				for (f = 0; f < this.tags[i].features.length; f++) {
					featureId = this.tags[i].features[f];
					if (Y.one('#featureSelectList .feature[data-rel-feature=' + featureId + ']').hasClass('selected')) {
						selectCount++;
					}
				}
				if (selectCount === this.tags[i].features.length) {
					Y.one('.btn[data-tag="' + i + '"]').removeClass('btn-faded');
				} else {
					Y.one('.btn[data-tag="' + i + '"]').addClass('btn-faded');
				}
			}
		},
		renderFeatureSelect: function () {
			var context,
				i;
			
			Y.all('.feature-view').each(Y.bind(function (item) {
				var nameCon = item.one('.feature-summary .text-center strong');

				this.features.push({
					name: (nameCon ? nameCon.get('text') : 'Unknown Name'),
					id: item.get('id'),
					status: item.getData('status')
				});
			}, this));
			
			Y.all('.tags .label').each(Y.bind(function (item) {
				var tagName = item.get('text'),
					featureId = item.ancestor('.feature-view').get('id'),
					found = false,
					i;
				
				for (i in this.tags) {
					if (this.tags[i].name === tagName) {
						found = i;
					}
				}

				if (found !== false) {
					this.tags[found].features.push(featureId);
				} else {
					this.tags.push({
						name: tagName,
						features: [featureId]
					});
				}
			}, this));

			for (i = 0; i < this.features.length; i++) {
				context = 'muted';
				switch (this.features[i].status) {
				case 'passed':
					context = 'success';
					break;
				case 'failed':
					context = 'danger';
					break;
				case 'undefined':
					context = 'warning';
					break;
				case 'skipped':
					context = 'info';
					break;
				}
				Y.one('#featureSelectList').append('<div class="feature bg-' + context + ' selected" data-rel-feature=\'' + this.features[i].id + '\'>' + this.features[i].name + '</div>');
			}

			for (i = 0; i < this.tags.length; i++) {
				Y.one('#featureSelectTags').append('<div class="btn-group btn-group-justified voffset2"><a class="btn btn-primary tag-selection" data-tag=\'' + i + '\'>' + this.tags[i].name + '</a></div>');
			}

			this._addClickListeners();
		}
	};
}, {
	requires: ['xbdd-build-stats']
});