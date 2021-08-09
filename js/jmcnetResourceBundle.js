'use strict';

/**
 * A module for managing a set of properties files. Those properties are automatically reloaded after a file is changed.
 * A set of properties file is based on a master config file named master-confug.properties. This file contains all the subfile to be reloaded.
 */

var
    _ = require('lodash'),
    log = require('log4js').getLogger('jmcnet.resourceBundle'),
    jmcnetException = require('../js/jmcnetException.js'),
    util = require('util'),
    fs = require('fs'),
    PropertiesFile = require('java-properties').PropertiesFile;

var gBundles = {};
var gDefaultOptions = {
    reloadOnChange: true,
    checkReloadTimeSec: 60
};

/**
 * Creates and load a ResourceBundle from a pathname and a bundleBaseName.
 * @param bundlePath String The path where all bundles files can be found
 * @param bundleBaseName String the bundle base name. For example in the properties file myProperties-fr_Fr.properties, the base name is myProperties
 * @return the newly created ResourceBundle
 */
var ResourceBundle = function (bundlePath, bundleBaseName, options) {
    this.setOptions(options);
    this.files = {}; // store the file indexed with lang
    this.bundlePath = _.endsWith(bundlePath, '/') ? bundlePath : bundlePath + '/';
    this.bundleBaseName = bundleBaseName;
    gBundles[bundleBaseName] = this;
};

/**
 * Loads all files of this ResourceBundle. If cb is given the files are loaded in a async way and callback is called one the load is terminated.
 * If not, the load is done synchronously
 * @param cb the callback function when files are loaded
 */
ResourceBundle.prototype.loadFiles = function (cb) {
    log.info('Calling ResourceBundle.loadFiles bundlePath="%s" bundleBaseName="%s"', this.bundlePath, this.bundleBaseName);
    var me = this;
    try {
        _.forEach(fs.readdirSync(this.bundlePath), function (filename) {
            log.trace('Read file "%s" in dir "%s"', filename, me.bundlePath);
            if (_.startsWith(filename, me.bundleBaseName)) {
                var filePath = me.bundlePath + filename;
                var props = new PropertiesFile(filePath);
                // extract lang
                var rx = new RegExp(me.bundleBaseName + '_(.*).properties', 'gm');
                var locale = rx.exec(filename);
                log.trace('locale is "%s"', util.inspect(locale));
                if (!locale || locale.length < 2) {
                    log.warn('Fund file "%s" which name is formatted correctly. Ignoring this file', filename);
                } else {
                    var now = Math.floor((new Date()).getTime() / 1000);
                    me.files[locale[1]] = {
                        props: props,
                        filePath: filePath,
                        timeLastCheck: now,
                        timeNextCheck: now + me.options.checkReloadTimeSec
                    };
                }
            } else log.trace('File "%s" is not part of bundle "%s"', filename, me.bundleBaseName);
        });
        if (cb) cb();
    } catch (err) {
        if (cb) cb(err);
        else {
            var exc = new jmcnetException.TechnicalException(err.message, [me.bundlePath, me.bundleBaseName]);
            log.error('%s', util.inspect(exc));
            throw exc;
        }
    }
};

ResourceBundle.prototype.getFiles = function () {
    log.trace('ResourceBundle.files = "%s"', util.inspect(this.files));
    return this.files;
};

ResourceBundle.prototype.setOptions = function (options) {
    if (!options) options = {};
    this.options = _.defaults(options, gDefaultOptions);
};

/**
 * Checks if time check is expired and reload a file if it has changed during the last check
 * @param options The ResourceBundle options of this file
 * @param file an object containing filePath, timeLastCheck, timeNextCheck and props (the PropertiesFile)
 * @return file the updated file
 */
var checkReloadFile = function (bundleOptions, file) {
    if (!bundleOptions.reloadOnChange) return file;
    var now = Math.floor((new Date()).getTime() / 1000);
    if (now < file.timeNextCheck) {
        log.trace('Time is not expired. Do not check if reload is needed');
    } else {
        log.debug('Time check is expired for file "%s"', file.filePath);
        var stats = null;
        try {
            stats = fs.statSync(file.filePath);
            if (stats.isFile() && stats.mtime >= file.timeLastCheck * 1000) {
                log.trace('File "%s" has been changed since last check (%s)', file.filePath, new Date(file.timeLastCheck * 1000));
                file.props = new PropertiesFile(file.filePath);
                file.timeLastCheck = now;
                file.timeNextCheck = now + bundleOptions.checkReloadTimeSec;
            } else log.trace('File mtime "%d" is not changed', stats.mtime);
        } catch (err) {
            log.error(err);
        }
    }
    return file;
};

/*
 * Returns the first PropertiesFile matching the locale given in arguments. 'en' match 'en_En'
 * @return propertiesFile instance of PropertiesFile class or null is no file is found matching the locale
 */
ResourceBundle.prototype.getLocaleFile = function (locale) {
    if (!locale) locale = require('../js/jmcnetI18n.js').getLocale();
    if (!locale) {
        log.error('ResourceBundle : No locale defined while trying to access locale file');
        return undefined;
    }
    // try to return the first lang matching
    // First check the given locale
    var file = this.files[locale];
    if (!file) {
        // not found directly extract the lang before the '_'
        var lang;
        var idx = locale.indexOf('_');
        if (idx > 0) lang = locale.substring(0, idx);
        if (lang) {
            log.trace('search for lang "%s"', lang);
            file = this.files[lang];
        }
    }
    if (file) {
        log.trace('We have found a file "%s". Check if we need to reload it', file.filePath);
        return checkReloadFile(this.options, file).props;
    } else {
        log.warn('No bundle file for locale "%s" for bundle "%s"', locale, this.bundleBaseName);
        return undefined;
    }
};

var getBundle = function (bundleBaseName) {
    if (gBundles[bundleBaseName]) {
        return gBundles[bundleBaseName];
    } else {
        log.warn('No bundle named "%s" is loaded. You must first load the ResourceBundle with new ResourceBundle()', bundleBaseName);
        return undefined;
    }
};

var getLocaleFile = function (bundleBaseName, locale) {
    if (!locale) locale = require('../js/jmcnetI18n.js').getLocale();
    var bundle = getBundle(bundleBaseName);
    if (bundle) {
        return bundle.getLocaleFile(locale);
    } else {
        log.warn('No bundle named "%s" is loaded. You must first load the ResourceBundle with new ResourceBundle()', bundleBaseName);
        return undefined;
    }
};

module.exports = {
    ResourceBundle: ResourceBundle,
    getBundle: getBundle,
    getLocaleFile : getLocaleFile
};