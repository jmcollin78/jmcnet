'use strict';

/**
 * A module for sending email througt SMTP protocole. This module is based on 'nodemailer' module.
 */

var
// _ = require('lodash'),
    nodemailer = require('nodemailer'),
    // smtpTransport = require('nodemailer-smtp-transport'),
    log = require('log4js').getLogger('jmcnet.email'),
    util = require('util'),
    jmcnetException = require('../js/jmcnetException.js');

var gTransporter;
var gBaseImgDir;

function Email(from, to, subject, text, htmlText) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = htmlText;
    this.attachments = [];
}

Email.prototype.sendEmail = function (cb) {
    if (!gTransporter) {
        var exc = new jmcnetException.TechnicalException('Email transport must be set before sending email');
        log.error(exc);
        throw exc;
    }

    if (gBaseImgDir) {
        log.trace('Substituing all image path on the html by cid:xxx');
        this.createImageAttachmentFromHtml(gBaseImgDir);
    }

    log.trace('Sending email "%s"', util.inspect(this));

    return gTransporter.sendMail(this, cb);
};

/**
 * adds an attachment file to the email.
 * @param filename The name of the attachment that will be displayed by your emailer client
 * @param path The local pathname of the file to attach or an URL
 * @param cid the cid name of the attachment. Facultative
 */
Email.prototype.addAttachment = function (filename, path, cid) {
    var att = {
        filename: filename,
        path: path
    };
    if (cid) att.cid = cid;
    this.attachments.push(att);
};

/**
 * Removes all attachment from email
 */
Email.prototype.removeAttachments = function() {
    this.attachments = [];
};

Email.prototype.createImageAttachmentFromHtml = function(baseImgDir) {
    // removes leading '/' or '\'
    gBaseImgDir = baseImgDir.replace(/[\/\\]$/,'');
    var cid = 0;
    var mail = this;
    function imgReplacer(match, p0, p1, offset, string) {
        log.trace('Calling createImageAttachmentFromHtml.replacer with "%s", "%s", "%s", "%s"', match, p1, offset, string);
        if (p1.indexOf('cid:') === 0) { // ie startsWith cid:
            log.trace('Replacement is already done');
            return '<img'+p0+'src="'+p1+'"';
        }
        else {
            var cidName='img'+cid;
            mail.addAttachment(p1, gBaseImgDir+'/'+p1, cidName);
            cid++;
            return '<img'+p0+'src="cid:'+cidName+'"';
        }
    }
    
    function urlReplacer(match, p1, offset, string) {
        log.trace('Calling createImageAttachmentFromHtml.replacer with "%s", "%s", "%s", "%s"', match, p1, offset, string);
        var cidName='img'+cid;
        mail.addAttachment(p1, gBaseImgDir+'/'+p1, cidName);
        cid++;
        return 'url("cid:'+cidName+'")';
    }
    
    this.html = this.html.replace(new RegExp('<img([^>]*)src[ ]*=[ ]*[\'\"]([^>]*)[\'\"]','g'), imgReplacer);
    this.html = this.html.replace(/url\("(.*)"\)/, urlReplacer);
};

function FakeTransport() {
    this.resetSentEmails();
}

FakeTransport.prototype.sendMail = function (emailProps, cb) {
    log.trace('Sending email "%s" to fakeTransport', util.inspect(emailProps));
    this.sentEmails.push(emailProps);
    if (cb) {
        cb(null, {
            messageId: -1,
            response: 'Email send successfully to fake transport'
        }); // the info structure
    }
};

FakeTransport.prototype.resetSentEmails = function() {
    this.sentEmails = [];
};

var setSmtpTransport = function (smtpServerName, port, login, password, timeout, secure) {
    log.trace('Setting smtpTransport');
    if (!timeout) timeout = 5000;
    if (!secure) secure = true;
    gTransporter = nodemailer.createTransport({
        port: port,
        host: smtpServerName,
        secure: secure,
        auth: {
            user: login,
            pass: password
        },
        connectionTimeout: timeout,
        debug: false
    });
};

module.exports = {
    setSmtpTransport: setSmtpTransport,
    setFakeTransport: function () {
        gTransporter = new FakeTransport();
        return gTransporter;
    },
    Email: Email,
    setBaseImgDir: function (baseImgDir) {
        gBaseImgDir = baseImgDir;
    }
};