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
/**
 * Creates and load a ResourceBundle from a pathname and a bundleBaseName.
 * @param bundlePath String The path where all bundles files can be found
 * @param bundleBaseName String the bundle base name. For example in the properties file myProperties-fr_Fr.properties, the base name is myProperties
 * @return the newly created ResourceBundle
 */
var ResourceBundle = function (bundlePath, bundleBaseName) {
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
    log.trace('Calling ResourceBundle.loadFiles bundlePath="%s" bundleBaseName="%s"', this.bundlePath, this.bundleBaseName);
    var me = this;
    try {
        _.forEach(fs.readdirSync(this.bundlePath), function (filename) {
            log.trace('Read file "%s" in dir "%s"', filename, me.bundlePath);
            if (_.startsWith(filename, me.bundleBaseName)) {
                var props = new PropertiesFile(me.bundlePath + filename);
                // extract lang
                var rx = new RegExp(me.bundleBaseName + '-(.*).properties', 'gm');
                var locale = rx.exec(filename);
                log.trace('locale is "%s"', util.inspect(locale));
                if (!locale || locale.length < 2) {
                    log.warn('Fund file "%s" which name is formatted correctly. Ignoring this file', filename);
                } else {
                    me.files[locale[1]] = props;
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

/*
 * Returns the first PropertiesFile mathcing the locale given in arguments. 'en' match 'en_En'
 * @return propertiesFile instance of PropertiesFile class or null is no file is found matching the locale
 */
ResourceBundle.prototype.getLocaleFile = function (locale) {
    // try to return the first lang matching
    // First check the given locale
    if (this.files[locale]) return this.files[locale];
    // not found directly extract the lang before the '_'
    var lang;
    var idx = locale.indexOf('_');
    if (idx > 0) lang = locale.substring(0, idx);
    if (lang) {
        log.trace('search for lang "%s"', lang);
        if (this.files[lang]) return this.files[lang];
    }
    log.warn('No bundle file for locale "%s" for bundle "%s"', locale, this.bundleBaseName);
    return undefined;
};

var getBundle = function (bundleBaseName, locale) {
    if (gBundles[bundleBaseName]) {
        return gBundles[bundleBaseName].getLocaleFile(locale);
    }
    else {
        log.warn('No bundle named "%" is loaded. You must first load the ResourceBundle with new ResourceBundle()', bundleBaseName);
        return undefined;
    }
};

module.exports = {
    ResourceBundle: ResourceBundle,
    getBundle : getBundle
};