'use strict';

/**
 * A module for generating email templates. This module is based on 'ejs'
 */

var _ = require('lodash'),
    log = require('log4js').getLogger('jmcnet.emailTemplate'),
    util = require('util');

var BASE_EXCEPTION_NAME = 'BaseException';
var TECHNICAL_EXCEPTION_NAME= 'TechnicalException';
var FUNCTIONAL_EXCEPTION_NAME= 'FunctionalException';

/**
 * Loads an email template by 
 * @param message String The exception message
 * @param parameters Array the array of parameters
 */
function BaseException(message, parameters) {
    log.trace('BaseException CTOR message="%s" parameters="%s"', message, parameters);
    this.message = message || '';
    if (_.isEmpty(parameters)) {
        this.parameters = [];
    }
    else {
        this.parameters = _.isArray(parameters) ? parameters : [ parameters ];
    }
}

module.exports = {
    BaseException : BaseException,
    TechnicalException : TechnicalException,
    FunctionalException : FunctionalException,
    BASE_EXCEPTION_NAME : BASE_EXCEPTION_NAME,
    TECHNICAL_EXCEPTION_NAME : TECHNICAL_EXCEPTION_NAME,
    FUNCTIONAL_EXCEPTION_NAME : FUNCTIONAL_EXCEPTION_NAME
};