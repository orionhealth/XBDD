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
module.exports = function( grunt ){
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-csscomb');
grunt.loadNpmTasks('grunt-jsbeautifier');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-cssbeautifier');
grunt.loadNpmTasks('grunt-file-creator');
grunt.loadNpmTasks('grunt-contrib-copy');

var target = grunt.option('cwd') || '.',
	pjs = require('phantomjs'),
	phantom = pjs.path,
	isWin = /^win/.test(process.platform),
	fileCreatorOpts = {};

if (isWin) {
	delim = '\\';
} else {
	delim = '/';
}

fileCreatorOpts["target" + delim + "yui-reports" + delim + "report.xml"] = function(fs, fd, done) {
	fs.writeSync(fd, '');
	done();
};

grunt.initConfig({
	connect: {
		server: {
			options: {
				port: 8000,
				hostname: '*',
				base: 'src/main/webapp',
				middleware: function(connect, options, middlewares) {
					middlewares.unshift(function(req, res, next) {
						res.setHeader('Access-Control-Allow-Origin', '*');
						res.setHeader('Access-Control-Allow-Methods', '*');
						res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Content-Type');
						return next();
					});

					return middlewares;
				}
			}
		}
	},
	cssbeautifier : {
		files : ['src/main/webapp/css/style.css', 'src/main/webapp/css/xbdd.css'],
		options : {
			indent: '    ',
			openbrace: 'end-of-line',
			autosemicolon: true
		}
	},
	csscomb: {
        options: {
            config: 'csscomb.conf'
        },
        precommit: {
            files: {
            	'src/main/webapp/css/style.css': ['src/main/webapp/css/style.css'],
            	'src/main/webapp/css/xbdd.css': ['src/main/webapp/css/xbdd.css']
            }
        }
    },
    jsbeautifier : {
        options : {
        	js: {
                braceStyle: "collapse",
                breakChainedMethods: false,
                e4x: false,
                evalCode: false,
                indentChar: "	",
                indentLevel: 0,
                indentSize: 1,
                indentWithTabs: true,
                jslintHappy: true,
                keepArrayIndentation: false,
                keepFunctionIndentation: false,
                maxPreserveNewlines: 10,
                preserveNewlines: true,
                spaceBeforeConditional: true,
                spaceInParen: false,
                unescapeStrings: false,
                wrapLineLength: 0
            }
        },
        modules: {
        	expand: true,
        	cwd: 'src/main/webapp/modules/',
        	src: ['*.js'],
        	dest: 'src/main/webapp/modules/'
        },
        pageFiled: {
        	expand: true,
        	cwd: 'src/main/webapp/',
        	src: ['*.js'],
        	dest: 'src/main/webapp/'
        }
    },
	jshint: {
		junitReporting: {
			src: [
				'GruntFile.js',
				'src/main/webapp/modules/*.js',
				'src/main/webapp/WEB-INF/*.js',
				'src/main/webapp/*.js',
				'src/test/**/*.js'
			],
			options: {
				reporter: require("jshint-junit-reporter"),
				reporterOutput: 'target/jshint-reports/report.xml',
				force: true,
				ignores: [
					'src/main/webapp/js/*.js'
				]
			}
		},
		consoleReporting: {
			src: [
				'GruntFile.js',
				'src/main/webapp/modules/*.js',
				'src/main/webapp/WEB-INF/*.js',
				'src/main/webapp/*.js',
				'src/test/**/*.js'
			],
			options: {
				ignores: ['src/main/webapp/js/*.js']
			}
		}
	},
	"file-creator": {
		"basic": fileCreatorOpts
	},
	copy: {
		phantom: {
			files: [
				{
					expand: true,
					src: ['phantomjs.exe'],
					dest: 'node_modules/phantomjs/lib/phantom/bin/',
					cwd: 'node_modules/phantomjs/lib/phantom/',
					rename: function(dest, src) {
						return dest + src.replace('.exe', '');
					}
				}
			]
		}
	},
	shell: {
		grover: {
			command: ['node_modules' + delim + '.bin' + delim + 'istanbul instrument src' + delim + 'main' + delim + 'webapp -o target' + delim + 'coverage',
			'node_modules' + delim + '.bin' + delim + 'grover --phantom-bin ' + phantom + ' src' + delim + 'test' + delim + 'grover' + delim + '*.html -o target' + delim + 'yui-reports' + delim + 'report.xml --junit --coverage --istanbul-report target' + delim + 'coverage-report'].join("&&"),
			options: {
				callback: function (err, stdout, stderr, cb) {
					var fs = require('fs'),
						data;

					data = fs.readFileSync('target' + delim + 'yui-reports' + delim + 'report.xml').toString();

					if (data.split("<failure message=").length !== 1 || data.split("testsuite").length <= 1 || err !== null) {
						cb(false);
					}

					cb(true);
				}
			}
		}
	}
});
grunt.registerTask('default',['jshint', 'connect', 'file-creator', 'copy', 'shell:grover']);
grunt.registerTask('pretty', ['cssbeautifier', 'csscomb', 'jsbeautifier', 'jshint']);
};
