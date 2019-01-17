<p align="center">
  <a href="https://travis-ci.org/ar4eve/pr-status"><img src="https://travis-ci.org/ar4eve/pr-status.svg?branch=master" alt="tavis-ci: build"></a>
  <a href="https://github.com/facebook/jest"><img src="https://jestjs.io/img/jest-badge.svg" alt="jest"></a>
  <a href="https://badge.fury.io/js/pr-status"><img src="https://badge.fury.io/js/pr-status.svg" alt="npm version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

# pr-status

Command line utility to check the status of open pull requests of an organization.

## Installation
Install pr-status using [`npm`](https://www.npmjs.com/)
```bash
$ npm install -g pr-status
```
Note: This package only works with [Github](https://github.com/) and the minimum supported Node version is v6.16.0 by default.

## Usage

Before starting please make sure you have GitHub personal access [token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

1. By passing flag i.e. command line arguments.
```bash
$ pr-status --org 'organizationName' --token 'personalAccessToken'
```

2. By setting Environment Variables.
```bash
$ export PR_STATUS_ORG='organizationName'
$ export PR_STATUS_TOKEN='personalAccessToken'
$ pr-status
```
Note: `prs` can also be used to run the command instead of `pr-status`.

## Tests
```bash
$ npm test
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)