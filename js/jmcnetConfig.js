'use strict';

/**
 * A module for managing a set of properties files. Those properties are automatically reloaded after a file is changed.
 * A set of properties file is based on a master config file named master-confug.properties. This file contains all the subfile to be reloaded.
 */

var
    _ = require('lodash'),
    log = require('log4js').getLogger('jmcnet.config'),
    jmcnetException = require('../js/jmcnetException.js'),
    util = require('util'),
    fs = require('fs'),
    Properties = require('java-properties');

var gConfig = {};
var gTimeLastCheck = 0;
var gTimeNextCheck = 0;
/* Managed options are : 
 * - masterFileName : the name of the file containing sub files
 * - reloadOnChange : reloads all configuration when the master file or one of its subfile change,
 * - checkReloadTimeSec : period in second for checking if one of the file has been changed
 */
var MASTER_CONFIG_FILE = 'master-config.properties';
var gOptions = {
    masterFileName: MASTER_CONFIG_FILE,
    reloadOnChange: true,
    checkReloadTimeSec: 10
};
var gDir='.';

var gFiles = [];

/**
 * Loads a set of config files. This method first loads a master property file which contains a list of properties which values are the file path to load (relative to the dir directory in first argument).
 * Available options are the following :
 *   - masterFileName :  : the name of the master property file. Default value : master-config.properties,
 *   - reloadOnChange : true if the files are automatically reloaded when they change. Default to true,
 *   - checkReloadTime : the period between two checks of file that may have change in second. Defaults to : 10
 * @param dir String The base directory where the files should be found
 * @param options Object some options. See above.
 */
function loadConfig(dir, options) {
    if (!options) options = {};
    gOptions = _.defaults(options, gOptions);

    log.trace('Loading config from dir "%s" with options "%s"', dir, util.inspect(gOptions));
    gDir = dir;
    // check if the master file is present
    var masterConfigFilePath = gDir + options.masterFileName;
    var stats = null;
    try {
        stats = fs.statSync(masterConfigFilePath);
    } catch (err) {
        log.error(err);
    }
    
    if (stats === null || !stats.isFile()) {
        log.error('masterConfigFile "%s" not found or is not a file. Stop loading the config.', masterConfigFilePath);
        throw new jmcnetException.TechnicalException('Config file not found', [masterConfigFilePath]);
    } else {
        gFiles = [ masterConfigFilePath ];
        var config = Properties.of(masterConfigFilePath);
        var keys = config.getKeys();
        log.trace(util.inspect(keys));
        keys.forEach(function (key) {
            var fileName = config.get(key);
            log.trace('Loading subfile "%s" for key "%s"', fileName, key);
            config.addFile(gDir + fileName);
            gFiles.push(gDir + fileName);
        });
        log.trace('config is now : "%s"', util.inspect(config));
        log.trace('Files loaded : "%s"', gFiles);
        gConfig = config;
        gTimeLastCheck = Math.floor((new Date()).getTime() / 1000);
        gTimeNextCheck = gTimeLastCheck + gOptions.checkReloadTimeSec;
    }
}

/**
 * Checks if one of the files (master file and subfile) has been changed.
 * @return true if one of the file has been changed since last check. False is the period of check is not expired (see checkReloadTimeSec option) or if none of the file has been changed
 */
function checkFileChanges() {
    var now = Math.floor((new Date()).getTime()/1000);
    log.trace('Calling checkFileChanges now is : "%d" timeLastCheck is : "%d"', now, gTimeLastCheck);
    
    if (now < gTimeNextCheck) {
        log.trace('Period of check is not expired. Returns false');
        return false;
    }
    // we shoud do a check
    var ret = false;
    gFiles.forEach(function (file) {
        log.trace('Checking file "%s"', file);
        var stats = null;
        try {
            stats = fs.statSync(file);
            if (stats.isFile() && stats.mtime >= gTimeLastCheck*1000) {
                log.trace('File "%s" has been changed since last check (%s)',file, new Date(gTimeLastCheck*1000));
                ret = true;
                return false; // to stop loop
            }
            else log.trace('File mtime "%d" is not changed', stats.mtime);
        } catch (err) {
            log.error(err);
        }
    });
    return ret;
}

function getConfig() {
    return gConfig;
}

function getOptions() {
    return gOptions;
}

function get(key) {
    if (checkFileChanges) {
        log.info('We must reload the config');
        loadConfig(gDir, gOptions);
    }
    return gConfig.get(key);
}

function getKeys() { return gConfig.getKeys(); }

module.exports = {
    loadConfig: loadConfig,
    getConfig : getConfig,
    getKeys: getKeys,
    get : get,
    getOptions: getOptions,
    checkFileChanges : checkFileChanges
};