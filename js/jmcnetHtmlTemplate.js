'use strict';

/**
 * A module for generating email templates. This module is based on 'ejs'
 */

var
// _ = require('lodash'),
    fs = require('fs'),
    log = require('log4js').getLogger('jmcnet.htmlTemplate'),
    util = require('util'),
    jmcnetException = require('../js/jmcnetException.js'),
    jmcnetI18n = require('../js/jmcnetI18n.js'),
    ejs = require('ejs');

var gLstTpl = {};

/**
 * Construct a new HtmlTemplate from a templateName and a template text
 */
function HtmlTemplate(templateName, template) {
    log.trace('Constructing a new HtmlTemplate');
    this.template = template;
    this.initHtmlTemplate(templateName, template);
}

HtmlTemplate.prototype.initHtmlTemplate = function (templateName, template) {
    log.trace('Initializing the HtmlTemplate "%s"', templateName);
    this.templateName = templateName;
    if (this.template) this.bodyCompile = ejs.compile(this.template, { compileDebug : true, client : true });
    gLstTpl[templateName] = this;
    log.trace('Template list is now "%s"', util.inspect(gLstTpl));
    return this;
};

/**
 * Renders the template for an HtmlTemplate
 * @param context an object describing the context
 * @param lang fr|en
 * @return the String containing the rendered subject
 */
HtmlTemplate.prototype.render = function (context) {
    context.jmcnetI18n = jmcnetI18n;
    return this.bodyCompile(context);
};

HtmlTemplate.prototype.loadTemplateFromFile = function (bodyFileName) {
    try {
        var body = fs.readFileSync(bodyFileName, 'utf8');
        body.replace(/\r/g, '');
        this.setTemplate(body);
        return this;
    } catch (err) {
        log.error('Impossible to load HtmlTemplate "%s" from file "%s". Err is "%s"', this.templateName, bodyFileName, util.inspect(err));
        throw new jmcnetException.TechnicalException(err.message, [bodyFileName]);
    }
};

/**
 * Sets the body template
 */
HtmlTemplate.prototype.setTemplate = function (template) {
    this.template = template;
    if (template) this.bodyCompile = ejs.compile(this.template, { compileDebug : true });
};

function getHtmlTemplate(templateName) {
    return gLstTpl[templateName];
}

function getLstTemplates() {
    return gLstTpl;
}

function resetHtmlTemplates() {
    gLstTpl = {};
}

/**
 * Create a new HtmlTemplate from a filename containing the body
 * @param templateName String the name of the template to be created
 * @param subjectTemplate String the template of the email's subject
 * @param bodyFileName String the file path and name containing the template body
 * @return a new instance of HtmlTemplate
 */
function loadHtmlTemplateFromFile(templateName, bodyFileName) {
    log.trace('Loading template "%s" from file "%s"', templateName, bodyFileName);
    var tpl = new HtmlTemplate(templateName, undefined);
    return tpl.loadTemplateFromFile(bodyFileName);
}

module.exports = {
    HtmlTemplate: HtmlTemplate,
    loadHtmlTemplateFromFile: loadHtmlTemplateFromFile,
    getLstTemplates: getLstTemplates,
    getHtmlTemplate: getHtmlTemplate,
    resetHtmlTemplates: resetHtmlTemplates,
};