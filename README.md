# [![JMCNet Logo](https://code.google.com/p/jmcnet/logo)](https://github.com/jmcollin78/jmcnet/) JMCNet library !

JMCNet provides a JavaScript implementation of the JMCNet Java library (cf. [JMCNet Java Library](https://code.google.com/p/jmcnet/) for more information).

## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm

### Tools Prerequisites
* NPM - Node.js package manage; should be installed when you install node.js.

### Optional [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
* Grunt - Download and Install [Grunt](http://gruntjs.com).
```
$ npm install -g grunt-cli
```

## Additional Packages
* none yet.

## Quick Install
The quickest way to get started with JMCNet Library is to fork the Github repo.

$ [sudo] git fork git@github/jmcollin78/jmcnet.git
$ cd jmcnet
$ npm install

We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the test :

$ grunt testu

If grunt aborts because of JSHINT errors, these can be overridden with the `force` flag:

$ grunt -f testu

Alternatively, when not using `grunt` you can run:

$ node test

## Troubleshooting
During install some of you may encounter some issues.

Most issues can be solved by one of the following tips, but if are unable to find a solution feel free to contact us via the repository issue tracker or the links provided below.

#### Update NPM, Bower or Grunt
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*. Usually updating those tools to the latest version solves the issue.

* Updating NPM:
```
$ npm update -g npm
```

* Updating Grunt:
```
$ npm update -g grunt-cli
```

#### Cleaning NPM and Bower cache
NPM and Bower has a caching system for holding packages that you already installed.
We found that often cleaning the cache solves some troubles this system creates.

* NPM Clean Cache:
```
$ npm cache clean
```

* Bower Clean Cache:
```
$ bower cache clean
```

## Getting Started with Mean
JMCNet Library contains those modules :

### Exception
* A base module containing BaseException, FunctionalException and TechnicalException

### Date manipulation
* A module containing date functions like :
$ jmcnet.date.getDateHourMinuteNow() : gives the current date limited to minutes informations (skip seconds and millisec),
$ jmcnet.date.getDateNow() : gives the current date limited to date informations (skip hours, muinutes, seconds and millisec),
$ jmcnet.date.addDays(date, nbDays) : gives back a date which is date in argument with days augmented by nbDays,
$ jmcnet.date.addWeeks(date, nbWeeks) : gives back a date which is date in argument with weeks augmented by nbWeeks,
$ jmcnet.date.addMonth(date, nbMonths) : gives back a date which is date in argument with month augmented by nbMonths,
$ jmcnet.date.addMonth(date, nbYears) : gives back a date which is date in argument with year augmented by nbYears,

## More Information
* Visit us at [Clouderial.com](http://clouderial.com/).
* Visit our blog informations at [Clouderial.com](http://clouderial.com/blog).
* Visit our support forum informations at [Clouderial.com](http://clouderial.com/forum).

## License
This module is distributed under the MIT License.
