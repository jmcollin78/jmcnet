'use strict';

var jmcnetDate = require('./jmcnetDate.js'),
    jmcnetException = require('./jmcnetException.js'),
    jmcnetHtmlTemplate = require('./jmcnetHtmlTemplate.js'),
    jmcnetEmailTemplate = require('./jmcnetEmailTemplate.js'),
    jmcnetEmail = require('./jmcnetEmail.js'),
    jmcnetConfig = require('./jmcnetConfig.js'),
    jmcnetResourceBundle = require('./jmcnetResourceBundle.js'),
    jmcnetI18n = require('./jmcnetI18n.js');

module.exports = {
    date : jmcnetDate,
    exception : jmcnetException,
    config : jmcnetConfig,
    htmlTemplate : jmcnetHtmlTemplate,
    emailTemplate : jmcnetEmailTemplate,
    email : jmcnetEmail,
    resourceBundle : jmcnetResourceBundle,
    i18n : jmcnetI18n
};