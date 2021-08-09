'use strict';

/*----------------------------------------------------------------------------------------*\
 * Commons exceptions                                                                     *
\*----------------------------------------------------------------------------------------*/

// Imports
var _ = require('lodash'),
    log = require('log4js').getLogger('jmcnet.exception'),
    util = require('util');

var BASE_EXCEPTION_NAME = 'BaseException';
var TECHNICAL_EXCEPTION_NAME= 'TechnicalException';
var FUNCTIONAL_EXCEPTION_NAME= 'FunctionalException';

/**
 * The BaseException for all classes
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
BaseException.prototype = new Error();
BaseException.prototype.name = BASE_EXCEPTION_NAME;
BaseException.prototype.constructor = BaseException;
BaseException.prototype.toString = function() {
    return '['+this.name+' message="'+this.message+'" parameters="'+util.inspect(this.parameters)+'"]';
};

function TechnicalException(message, parameters) {
    log.trace('TechnicalException CTOR message="%s" parameters="%s"', message, parameters);
    BaseException.call(this, message, parameters);
    var err = new Error();
    this.stack = err.stack;
}
TechnicalException.prototype = new BaseException();
TechnicalException.prototype.name = TECHNICAL_EXCEPTION_NAME;
TechnicalException.prototype.constructor = TechnicalException;

function FunctionalException(message, parameters) {
    log.trace('FunctionalException CTOR message="%s" parameters="%s"', message, parameters);
    BaseException.call(this, message, parameters);
    var err = new Error();
    this.stack = err.stack;
}
FunctionalException.prototype = new BaseException();
FunctionalException.prototype.name = FUNCTIONAL_EXCEPTION_NAME;
FunctionalException.prototype.constructor = FunctionalException;

module.exports = {
    BaseException : BaseException,
    TechnicalException : TechnicalException,
    FunctionalException : FunctionalException,
    BASE_EXCEPTION_NAME : BASE_EXCEPTION_NAME,
    TECHNICAL_EXCEPTION_NAME : TECHNICAL_EXCEPTION_NAME,
    FUNCTIONAL_EXCEPTION_NAME : FUNCTIONAL_EXCEPTION_NAME
};