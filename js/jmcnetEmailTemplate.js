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
    if (this.subjectTemplate) this.subjectCompile = ejs.compile(this.subjectTemplate);
    if (this.bodyTemplate)    this.bodyCompile = ejs.compile(this.bodyTemplate);
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

/**
 * Renders the body template for an EmailTemplate
 * @param context an object describing the context
 * @param lang fr|en
 * @return the String containing the rendered subject
 */
EmailTemplate.prototype.renderBody = function (context, lang) {
    if (lang) gLang = lang;
    return this.bodyCompile(context);
};

/**
 * Send an email using this EmailTemplate and a context.
 * @param email an jmcnetEmail.Email object initialized with from, to and others fields
 * @param context an object storing the context (list of key : value),
 * @param lang 'fr' or 'en',
 * @param cb the callback function once email has been send. This callback takes err and info in arguments
 */
EmailTemplate.prototype.sendEmail = function(email, context, lang, cb) {
    log.trace('Sending the email "%s" with template "%s", context "%s" and lang="%s"', util.inspect(email), util.inspect(this), util.inspect(context), lang);
    email.subject = this.renderSubject(context, lang);
    email.html = this.renderBody(context, lang);
    log.debug('Sending an email with subject="%s" and html="%s"', email.subject, email.html);
    email.sendEmail(cb);
};

/**
 * Send an email using this EmailTemplate and a context but do a 2nd pass.
 * @param email an jmcnetEmail.Email object initialized with from, to and others fields
 * @param context an object storing the context (list of key : value),
 * @param lang 'fr' or 'en',
 * @param cb the callback function once email has been send. This callback takes err and info in arguments
 */
EmailTemplate.prototype.sendEmail2Pass = function(email, context, lang, cb) {
    log.trace('Sending the email "%s" with template "%s", context "%s" and lang="%s" with 2 pass', util.inspect(email), util.inspect(this), util.inspect(context), lang);
    var tmp = this.renderSubject(context, lang);
    log.trace('subjectPass1="%s"', tmp);
    email.subject = ejs.render(tmp, context);
    tmp = this.renderBody(context, lang);
    log.trace('htmlPass1="%s"', tmp);
    email.html = ejs.render(tmp, context);
    log.debug('Sending an email with subject="%s" and html="%s"', email.subject, email.html);
    email.sendEmail(cb);
};

/**
 * Sets the subject template
 */
EmailTemplate.prototype.setSubjectTemplate = function(subjectTemplate) {
    this.subjectTemplate = subjectTemplate;
    if (subjectTemplate) this.subjectCompile = ejs.compile(this.subjectTemplate);
};

/**
 * Sets the body template
 */
EmailTemplate.prototype.setBodyTemplate = function(bodyTemplate) {
    this.bodyTemplate = bodyTemplate;
    if (bodyTemplate) this.bodyCompile = ejs.compile(this.bodyTemplate);
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
        log.error('Impossible to load EmailTemplate "%s" from file "%s". Err is "%s"', templateName, bodyFileName, util.inspect(err));
        throw new jmcnetException.TechnicalException(err.message, [bodyFileName]);
    }
}

/**
 * An EJS filter to display a date correctly
 */
Date.prototype.toLocaleDateString = function toLocaleDateString() {
    log.trace('Into ejs.filters.toLocaleDateString');
    if (gLang === 'fr') {
        return this.format('shortDateFr');
    }
    else {
        return this.format('shortDateEn');
    }
};

module.exports = {
    EmailTemplate: EmailTemplate,
    loadEmailTemplateFromFile: loadEmailTemplateFromFile,
    getLstTemplates: getLstTemplates,
    getEmailTemplate: getEmailTemplate,
    resetEmailTemplates: resetEmailTemplates
};