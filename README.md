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
```
$ [sudo] git fork git@github/jmcollin78/jmcnet.git
$ cd jmcnet
$ npm install
```

We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the test :
```
$ grunt testu
```

If grunt aborts because of JSHINT errors, these can be overridden with the `force` flag:
```
$ grunt -f testu
```

Alternatively, when not using `grunt` you can run:
```
$ node test
```

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

## Getting Started with JMCNet library
JMCNet Library contains those modules :

### Exception
* A base module containing BaseException, FunctionalException and TechnicalException

### Date manipulation
* A module containing date helpers functions like :
 * <b><i>jmcnet.date.getDateHourMinuteNow()</i></b> : gives the current date limited to minutes informations (skip seconds and millisec),
 * <b><i>jmcnet.date.getDateNow()</i></b> : gives the current date limited to date informations (skip hours, muinutes, seconds and millisec),
 * <b><i>jmcnet.date.addDays(date, nbDays)</i></b> : gives back a date which is date in argument with days augmented by nbDays,
 * <b><i>jmcnet.date.addWeeks(date, nbWeeks)</i></b> : gives back a date which is date in argument with weeks augmented by nbWeeks,
 * <b><i>jmcnet.date.addMonth(date, nbMonths)</i></b> : gives back a date which is date in argument with month augmented by nbMonths,
 * <b><i>jmcnet.date.addMonth(date, nbYears)</i></b> : gives back a date which is date in argument with year augmented by nbYears,

### .properties files manipulations
* A module for dealing with configuration files in the .properties style (like in Java) with <b>automatic reload of the properties on file changes</b>
 * <b><i>jmcnet.config.loadConfig(path, options)</i></b> : loads a set of configuration files. Path is the base directory of all configuration files. Options are the following :
 ```
    // the base file containing a reference to all subfile
    masterFileName: 'master-config.properties',
    // when the master file or a subfile is changed, reloads all
    reloadOnChange: true,
    // period in second between two checks
    checkReloadTimeSec: 10                      
```

 * <b><i>jmcnet.config.get(key)</i></b> : get the value of a key
 * <b><i>jmcnet.config.getKeys()</i></b> : get all the properties keys

## More Information
* Visit us at [Clouderial.com](http://clouderial.com/).
* Visit our blog informations at [Clouderial.com](http://clouderial.com/blog).
* Visit our support forum informations at [Clouderial.com](http://clouderial.com/forum).

## License
This module is distributed under the MIT License.
