'use strict';

/**
 * A module for generating email templates. This module is based on 'ejs'
 */

var
// _ = require('lodash'),
    fs = require('fs'),
    log = require('log4js').getLogger('jmcnet.emailTemplate'),
    util = require('util'),
    jmcnetException = require('../js/jmcnetException.js'),
    ejs = require('ejs');

require('../js/jmcnetDate.js');

var gLstMailTpl = {};
var gLang = 'fr';

/**
 * Construct a new EmailTemplate from a templateName, a subject template name and a bodyTemplate
 */
function EmailTemplate(templateName, subjectTemplate, bodyTemplate) {
    log.trace('Constructing a new template "%s"', templateName);
    this.subjectTemplate = subjectTemplate;
    this.bodyTemplate = bodyTemplate;
    this.initTemplate(templateName);
}

EmailTemplate.prototype.initTemplate = function (templateName) {
    log.trace('Initializing the template "%s"', templateName);
    this.subjectCompile = ejs.compile(this.subjectTemplate);
    this.bodyCompile = ejs.compile(this.bodyTemplate);
    gLstMailTpl[templateName] = this;
    log.trace('Template list is now "%s"', util.inspect(gLstMailTpl));
    return this;
};

/**
 * Renders the subjects template for an EmailTemplate
 * @param context an object describing the context
 * @param lang fr|en
 * @return the String containing the rendered subject
 */
EmailTemplate.prototype.renderSubject = function (context, lang) {
    if (lang) gLang = lang;
    return this.subjectCompile(context);
};
EmailTemplate.prototype.renderBody = function (context, lang) {
    if (lang) gLang = lang;
    return this.bodyCompile(context);
};

function getEmailTemplate(templateName) {
    return gLstMailTpl[templateName];
}

function getLstTemplates() {
    return gLstMailTpl;
}

function resetEmailTemplates() {
    gLstMailTpl = {};
}

/**
 * Create a new EmailTemplate from a filename containing the body
 * @param templateName String the name of the template to be created
 * @param subjectTemplate String the template of the email's subject
 * @param bodyFileName String the file path and name containing the template body
 * @return a new instance of EmailTemplate
 */
function loadEmailTemplateFromFile(templateName, subjectTemplate, bodyFileName) {
    log.trace('Loading template "%s" from file "%s"', templateName, bodyFileName);
    try {
        var body = fs.readFileSync(bodyFileName, 'utf8');
        body.replace(/\r/g, '');
        return new EmailTemplate(templateName, subjectTemplate, body);
    } catch (err) {
        log.error('Impossible to load EmailTemplate from file. Err is "%s"', util.inspect(err));
        throw new jmcnetException.TechnicalException(err.message, [bodyFileName]);
    }
}

/**
 * An EJS filter to display a date correctly
 */
ejs.filters.toLocaleDateString = function(d) {
    log.trace('Into ejs.filters.toLocaleDateString');
    if (gLang === 'fr') {
        return d.format('shortDateFr');
    }
    else {
        return d.format('shortDateEn');
    }
};

module.exports = {
    EmailTemplate: EmailTemplate,
    loadEmailTemplateFromFile: loadEmailTemplateFromFile,
    getLstTemplates: getLstTemplates,
    getEmailTemplate: getEmailTemplate,
    resetEmailTemplates: resetEmailTemplates
};