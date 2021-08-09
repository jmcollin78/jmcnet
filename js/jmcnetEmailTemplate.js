'use strict';

/**
 * A module for generating email templates. This module is based on 'ejs'
 */

var
// _ = require('lodash'),
//    fs = require('fs'),
    log = require('log4js').getLogger('jmcnet.emailTemplate'),
    util = require('util'),
    jmcnetI18n = require('../js/jmcnetI18n.js'),
    jmcnetHtmlTemplate = require('../js/jmcnetHtmlTemplate.js'),
    HtmlTemplate = jmcnetHtmlTemplate.HtmlTemplate,
    ejs = require('ejs');

/**
 * Construct a new EmailTemplate from a templateName, a subject template name and a bodyTemplate
 */
function EmailTemplate(templateName, subjectTemplate, bodyTemplate) {
    log.trace('Constructing a new EmailTemplate "%s"', util.inspect(this)/*, templateName*/);
    HtmlTemplate.call(this, templateName, bodyTemplate);

    this.subjectTemplate = subjectTemplate;
    this.bodyTemplate = bodyTemplate;
    log.trace('this is "%s"',util.inspect(this));

    if (! this.initTemplate) log.error('Pas de initTemplate');
    this.initTemplate(templateName);
}

util.inherits(EmailTemplate, HtmlTemplate);
/*EmailTemplate.prototype = new HtmlTemplate();
EmailTemplate.prototype.constructor = EmailTemplate;*/


EmailTemplate.prototype.initTemplate = function (templateName) {
    log.trace('Initializing the EmailTemplate "%s"', templateName);
    this.initHtmlTemplate(templateName);
    if (this.subjectTemplate) this.subjectCompile = ejs.compile(this.subjectTemplate);
    return this;
};

/**
 * Renders the subjects template for an EmailTemplate
 * @param context an object describing the context
 * @return the String containing the rendered subject
 */
EmailTemplate.prototype.renderSubject = function (context) {
    context.jmcnetI18n = jmcnetI18n;
    return this.subjectCompile(context);
};

/**
 * Renders the body template for an EmailTemplate
 * @param context an object describing the context
 * @return the String containing the rendered subject
 */
EmailTemplate.prototype.renderBody = function (context) {
    context.jmcnetI18n = jmcnetI18n;
    return this.render(context);
};

/**
 * Send an email using this EmailTemplate and a context.
 * @param email an jmcnetEmail.Email object initialized with from, to and others fields
 * @param context an object storing the context (list of key : value),
 * @param lang 'fr' or 'en',
 * @param cb the callback function once email has been send. This callback takes err and info in arguments
 */
EmailTemplate.prototype.sendEmail = function(email, context, cb) {
    log.trace('Sending the email "%s" with template "%s", context "%s" and lang="%s"', util.inspect(email), util.inspect(this), util.inspect(context), jmcnetI18n.getLocale());
    email.subject = this.renderSubject(context);
    email.html = this.renderBody(context);
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
EmailTemplate.prototype.sendEmail2Pass = function(email, context, cb) {
    log.trace('Sending the email "%s" with template "%s", context "%s" and lang="%s" with 2 pass', util.inspect(email), util.inspect(this), util.inspect(context), jmcnetI18n.getLocale());
    var tmp = this.renderSubject(context);
    log.trace('subjectPass1="%s"', tmp);
    email.subject = ejs.render(tmp, context);
    tmp = this.renderBody(context);
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
    this.setTemplate(bodyTemplate);
};

/**
 * Create a new EmailTemplate from a filename containing the body
 * @param templateName String the name of the template to be created
 * @param subjectTemplate String the template of the email's subject
 * @param bodyFileName String the file path and name containing the template body
 * @return a new instance of EmailTemplate
 */
function loadEmailTemplateFromFile(templateName, subjectTemplate, bodyFileName) {
    log.trace('Loading template "%s" from file "%s"', templateName, bodyFileName);
    var eTpl = new EmailTemplate(templateName, subjectTemplate, undefined);
    return eTpl.loadTemplateFromFile(bodyFileName);
}

/**
 * An EJS filter to display a date correctly
 */
/*
Date.prototype.toLocaleDateString = function toLocaleDateString() {
    log.trace('Into ejs.filters.toLocaleDateString');
    if (gLang === 'fr') {
        return this.format('shortDateFr');
    }
    else {
        return this.format('shortDateEn');
    }
};

*/
module.exports = {
    EmailTemplate: EmailTemplate,
    loadEmailTemplateFromFile: loadEmailTemplateFromFile,
    getLstTemplates: jmcnetHtmlTemplate.getLstTemplates,
    getEmailTemplate: jmcnetHtmlTemplate.getHtmlTemplate,
    resetEmailTemplates: jmcnetHtmlTemplate.resetHtmlTemplates
};