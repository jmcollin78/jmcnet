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
}

Email.prototype.sendEmail = function (cb) {
    log.trace('Sending email "%s"', util.inspect(this));
    if (!gTransporter) {
        var exc = new jmcnetException.TechnicalException('Email transport must be set before sending email');
        log.error(exc);
        throw exc;
    }

    if (gBaseImgDir) {
        log.trace('Substituing all image path on the html by cid:xxx');

    }

    return gTransporter.sendMail(this, cb);
};

function FakeTransport() {
    this.sentEmails = [];
}

FakeTransport.prototype.sendMail = function (emailProps, cb) {
    this.sentEmails.push(emailProps);
    if (cb) {
        cb(null, {
            messageId: -1,
            response: 'Email send successfully to fake transport'
        }); // the info structure
    }
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
    },
    Email: Email,
    setBaseImgDir: function (baseImgDir) {
        gBaseImgDir = baseImgDir;
    }
};