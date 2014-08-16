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

var gConfig={};
/*var timeLastCheck = 0;
var timeNextCheck = (new Date()).getTime();*/

var MASTER_CONFIG_FILE = 'master-config.properties';

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
    var defaultOptions = {
        masterFileName : MASTER_CONFIG_FILE,
        reloadOnChange : true,
        checkReloadTime : 10
    };
    if (!options) options = {};
    
    options = _.extend(options, defaultOptions);
    
    log.trace('Loading config from dir "%s" with options "%s"', dir, util.inspect(defaultOptions));
    // check if the master file is present
    var masterConfigFilePath = dir + options.masterFileName;
    var stats = null;
    try {
        stats = fs.statSync(masterConfigFilePath);
    } catch (err) {
        log.error(err);
    }
    if (stats === null || !stats.isFile()) {
        log.error('masterConfigFile "%s" not found or is not a file. Stop loading the config.', masterConfigFilePath);
        gConfig = {};
        throw new jmcnetException.TechnicalException('Config file not found', [masterConfigFilePath]);
    } else {
        var config=Properties.of(masterConfigFilePath);
        var keys = config.getKeys();
        log.trace(util.inspect(keys));
        keys.forEach(function(key) {
            var fileName=config.get(key);
            log.trace('Loading subfile "%s" for key "%s"',fileName,key);
            config.addFile(dir + fileName);
        });
        log.trace('config is now : "%s"', util.inspect(config));
        gConfig = config;
        
    }
}

function getConfig() { return gConfig; }

module.exports = {
    loadConfig: loadConfig,
    getConfig: getConfig
};