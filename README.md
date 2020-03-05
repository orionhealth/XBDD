# XBDD

[![Build Status](https://travis-ci.org/orionhealth/XBDD.svg?branch=master)](https://travis-ci.org/orionhealth/XBDD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e4e302179ece414aba739157ff82c222)](https://www.codacy.com/app/orionhealth/XBDD)

XBDD is a tool to unite automated and manual testing efforts using Cucumber feature files. Test reports can be uploaded to XBDD manually or via a continuous integration server, giving you an information radiator on how many tests are passing, how many failed and how many can be run manually. Pin a report and get your team to walk through the manual feature files and check off each step to perform a full regression test.

---

**_NOTE:_** XBDD is currently being rebuilt using newer libraries and tooling. If you want to use the older version please use the `legacy/1.2.0 branch` or the `1.2.0` tag.

---

## Installation

See [INSTALL.md](/docs/INSTALL.md) for details on prerequisites, installation and configuration.

## For Performance / Production

Run the script contained within `mongoIndexes.txt` to create compound indexes required for search/sort.

## Uploading reports

Cucumber JSON reports can be uploaded manually from the XBDD main page. See [UPLOAD.md](/docs/UPLOAD.md) for instructions on automating the upload with Maven.

# Contributing

For all those wishing to contribute to XBDD please fork the repository, and submit your changes via a pull request. See [INSTALL.md](/docs/INSTALL.md) for information on setting up a development environment.
