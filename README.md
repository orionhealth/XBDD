XBDD
====

Installation
------------

1. See [INSTALL.md](/docs/INSTALL.md) for details on Tomcat configuration
2. Navigate to https://localhost:8443/xbdd/  (or whichever port you have specified during your tomcat configuration)

For performance / production
---

1. Run the script contained within mongoIndexes.txt to create compound indexes required for search/sort.

Usage
=====

See the [user guide](/docs/usage/user-guide.md) for an overview of XBDD functionality.

Upload
------

Cucumber json reports can be uploaded manually from the XBDD main page. See [UPLOAD.md](/docs/UPLOAD.md) for instructions on automating the upload with maven.

Contributing
=====
For all those wishing to contribute to XBDD please fork the repository, and submit your changes via a pull request.
Please ensure your pull request follows the pre-existing coding style and that `mvn clean verify` passes.  You can use `grunt pretty` to format your CSS and JS correctly.
If the build is failing due to licenses missing, please run `mvn licence:format`