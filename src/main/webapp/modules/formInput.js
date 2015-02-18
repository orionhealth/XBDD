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
YUI.add('formInput', function (Y) {

	var errorStrings = [];

	// Checks for the length of inputs
	var checkLength = function (o, min, max) {
		var inputvalue = o.get('value');
		var inputlength = inputvalue.length;
		if (inputlength > max || inputlength < min) {
			o.addClass('form-error');
			errorStrings.push("Length of " + o.get('title') + " must be between " + min + " and " + max + ".");
		}
	};

	//Checks for a valid version number
	var checkVersion = function (o) {
		var inputvalue = o.get('value');
		var regexp = /^\w+\.\w+\.\w+$/;
		var validValues = 0;
		if (regexp.test(inputvalue)) {
			var versionArray = inputvalue.split('.');
			validValues += checkRegexp(versionArray[0], 'Major');
			validValues += checkRegexp(versionArray[1], 'Minor');
			validValues += checkRegexp(versionArray[2], 'Service Pack');
		}
		if (validValues !== 3) {
			errorStrings.unshift('Version must be of the format {Major}.{Minor}.{Service Pack}');
			o.addClass("form-error");
		}
	};

	// Checks for integer and max length 5 in major, minor and service pack
	// Returns 1 if valid
	var checkRegexp = function (value, name) {
		var regexp = /^\d{1,5}$/;
		if (!(regexp.test(value))) {
			errorStrings.push('{' + name + '} must be an integer between 1 and 5 digits long.');
			return 0;
		} else return 1;
	};

	// Messages if incorrect inputs
	var updateTips = function (tips) {
		if (errorStrings.length === 0) {
			tips.set('innerHTML', "");
		} else {
			var plural = " errors.";
			if (errorStrings.length === 1) {
				plural = " error.";
			}

			tips.set('innerHTML', "Please fix the following " + errorStrings.length + plural);

			var parent = Y.Node.create('<ul/>'),
				child;
			for (var i = 0; i < errorStrings.length; i++) {
				child = Y.Node.create('<li/>');
				child.set('innerHTML', errorStrings[i]);
				parent.appendChild(child);
			}
			parent.addClass('form-error-highlight');
			tips.appendChild(parent);
			tips.addClass('form-error-highlight');
		}
	};

	//Checks if a file of set type is attached, and that a file is indeed attached
	var fileCheck = function (file) {
		var filePath = file.get("value");

		if (filePath) {
			var startIndex = (filePath.indexOf('\\') >= 0 ? filePath.lastIndexOf('\\') : filePath.lastIndexOf('/'));
			var filename = filePath.substring(startIndex);
			if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				filename = filename.substring(1); // filename
			}
			var ext = filename.split('.').pop();
			if ((ext !== "json") && (ext !== "txt")) {
				file.addClass("form-error");
				errorStrings.push(file.get('title') + " is not of the type JSON or txt.");
			}
		} else {
			file.addClass("form-error");
			errorStrings.push("No " + file.get('title') + " is selected.");
		}
	};

	//checks user input data is of appropriate type and length
	var checkInput = function (inputInfo, tips) {
		errorStrings = [];

		// Check if file is selected and of type JSON/txt
		inputInfo.each(function (node) {
			if (node.get('type') === 'text') {
				if (node.get('name') === 'version') {
					checkVersion(node);
				} else {
					checkLength(node, 1, 30);
				}
			} else if (node.get('type') === 'file') {
				fileCheck(node);
			}
		});
		updateTips(tips);
		return errorStrings.length;
	};

	//returns true if a report already exists in the database with the specified identifiers
	var reportExists = function (data, product, version, build) {
		for (var k = 0; k < data.length; k++) {
			var c = data[k].coordinates;
			var cversion = c.major + '.' + c.minor + '.' + c.servicePack;
			if ((c.product === product) && (cversion === version)) {
				for (var j = 0; j < data[k].builds.length; j++) {
					if (build === data[k].builds[j]) {
						return true;
					}
				}
			}
		}
		return false;
	};

	// Array of products list is returned from complete data
	var productsList = function (data) {
		var products = [];
		for (var i = 0; i < data.length; i++) {
			var existingProduct = false;
			for (var j = 0; j < products.length; j++) {
				if (data[i].coordinates.product === products[j]) {
					existingProduct = true;
					break;
				}
			}
			if (existingProduct === false) {
				products.push(data[i].coordinates.product);
			}
		}
		return products;
	};

	// Array of version strings is returned for the specified product from complete data
	var versionsList = function (data, productInput) {
		var versions = [];
		for (var k = 0; k < data.length; k++) {
			var c = data[k].coordinates;
			if (c.product === productInput) {
				versions.push(c.major + '.' + c.minor + '.' + c.servicePack);
			}
		}
		return versions;
	};

	//	Handlebars helpers for upload.html
	var inputLabelCreate = function (context, options) {
		var id = options.hash.id;
		return '<label for = "' + id + '">' + context + ': </label>';
	};

	var inputFormCreate = function (options) {
		var id = options.hash.id,
			type = options.hash.type,
			title = options.hash.title;
		return '<input type="' + type + '" id="' + id + '" name="' + id + '" title = "' + title + '"value="" class="form-control input-form-upload"  />';
	};

	Y.formInput = {};
	Y.formInput.fileCheck = fileCheck;
	Y.formInput.updateTips = updateTips;
	Y.formInput.checkVersion = checkVersion;
	Y.formInput.checkRegexp = checkRegexp;
	Y.formInput.checkLength = checkLength;
	Y.formInput.checkInput = checkInput;
	Y.formInput.reportExists = reportExists;
	Y.formInput.productsList = productsList;
	Y.formInput.versionsList = versionsList;
	Y.formInput.inputLabelCreate = inputLabelCreate;
	Y.formInput.inputFormCreate = inputFormCreate;

}, '0.0.1', {
	requires: ['event', 'panel', 'node', 'event-base', 'io', 'button-plugin', 'yui-object', 'yui-array', ]
});
