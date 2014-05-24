'use strict';

/*----------------------------------------------------------------------------------------*\
 * Commons exceptions                                                                     *
\*----------------------------------------------------------------------------------------*/

// Imports
var _ = require('lodash');

var BASE_EXCEPTION_NAME = 'BaseException';
var TECHNICAL_EXCEPTION_NAME= 'TechnicalException';
var FUNCTIONAL_EXCEPTION_NAME= 'FunctionalException';

/**
 * The BaseException for all classes
 * @param message String The exception message
 * @param parameters Array the array of parameters
 */
function BaseException(message, parameters) {
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

function TechnicalException(message, parameters) {
    BaseException.call(this, message, parameters);
}
TechnicalException.prototype = new BaseException();
TechnicalException.prototype.name = TECHNICAL_EXCEPTION_NAME;
TechnicalException.prototype.constructor = TechnicalException;

function FunctionalException(message, parameters) {
    BaseException.call(this, message, parameters);
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