XBDD [![Build Status](https://travis-ci.org/orionhealth/XBDD.svg)](https://travis-ci.org/orionhealth/XBDD)
====

XBDD lets you use Cucumber feature files for your automated and manual testing. Test reports can be uploaded to XBDD manually or via a continuous integration server, giving you an information radiator on how many tests are passing, how many failed and how many can be run manually. Pin a report and get your team to walk through the manual feature files and check off each step to perform a full regression test.

Installation
------------

See [INSTALL.md](/docs/INSTALL.md) for details on prerequisites, installation and configuration.

For Performance / Production
----------------------------

Run the script contained within `mongoIndexes.txt` to create compound indexes required for search/sort.

Usage
=====

See the [user guide](/docs/usage/user-guide.md) for an overview of XBDD functionality.

Uploading reports
-----------------

Cucumber JSON reports can be uploaded manually from the XBDD main page. See [UPLOAD.md](/docs/UPLOAD.md) for instructions on automating the upload with Maven.

Contributing
============
For all those wishing to contribute to XBDD please fork the repository, and submit your changes via a pull request.
Please ensure your pull request follows the pre-existing coding style and that `mvn clean verify` passes.  You can use `grunt pretty` to format your CSS and JS correctly.
If the build is failing due to licenses missing, please run `mvn licence:format`
