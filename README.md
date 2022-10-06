# XBDD

![backend](https://github.com/orionhealth/XBDD/actions/workflows/github-actions-build-backend.yml/badge.svg)
[![codacy](https://app.codacy.com/project/badge/Grade/ff7f073905bb4f34a64e4db904aff972)](https://www.codacy.com/gh/orionhealth/XBDD/dashboard)

XBDD is a tool to unite automated and manual testing efforts using Cucumber feature files. Test reports can be uploaded to XBDD manually or via a continuous integration server, giving you an information radiator on how many tests are passing, how many failed and how many can be run manually. Pin a report and get your team to walk through the manual feature files and check off each step to perform a full regression test.


## Installation

See [INSTALL](/docs/INSTALL.md) for details on installation and configuration of a production server.

## Development

See [DEVELOPMENT](/docs/DEVELOPMENT.md) for information on setting up a development environment.

## For Performance / Production

Run the script contained within `mongoIndexes.txt` to create compound indexes required for search/sort.

To adjust the authentication timeout, see backend application.yml - server.servlet.session.timeout

## Uploading reports

See [UPLOAD](/docs/UPLOAD.md) for instructions on automated test report uploads via Maven. 

# Contributing

Pull requests are welcome!
