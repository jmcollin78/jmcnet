/* jshint expr:true*/
'use strict';

/**
 * Unit test file for testing the Email module
 * Author : Jean-Marc Collin
 */

/* Module dependencies */
var expect = require('chai').expect; // jshint ignore:line
//var assert = require('assert'); // jshint ignore:line
var log = require('log4js').getLogger('jmcnet.email'),
    jmcnetException = require('../js/jmcnetException.js'),
    jmcnetEmail = require('../js/jmcnetEmail.js'),
    Email = jmcnetEmail.Email,
    util = require('util');

// The unit tests
describe('<JMCNet Email Unit Test>', function () {
    var email;
    before(function (done) {
        email = new Email('from@test.com', 'to@test.com', 'My subject string', 'My text string', '<html>My html string</html>');
        done();
    });
    describe('Creating and sending an email', function () {
        it('should be possible to create an email', function (done) {
            log.debug('Test create an emailT');
            expect(email).to.exist;
            expect(email.from).to.equal('from@test.com');
            expect(email.to).to.equal('to@test.com');
            expect(email.subject).to.equal('My subject string');
            expect(email.text).to.equal('My text string');
            expect(email.html).to.equal('<html>My html string</html>');
            done();
        });
        it('should not be possible to send email without a transport', function (done) {
            log.debug('Test send without transport');
            expect(email.sendEmail).to.throw(jmcnetException.TechnicalException);
            done();
        });
        it('should be possible to send email with a fake transport', function (done) {
            log.debug('Test send with a fake transport');
            var fkTp = jmcnetEmail.setFakeTransport();
            log.debug('FakeTransport is "%s" sentEmails="%s"', util.inspect(fkTp), util.inspect(fkTp.sentEmails));
            expect(fkTp).to.exist;
            expect(fkTp.sentEmails).to.have.length(0);
            expect(email.sendEmail).to.not.throw(Error);
            done();
        });
        it('should be possible to get back the sent mail with FakeTransport', function (done) {
            log.debug('Test send with a fake transport and get back the sent mail');
            var fkTp = jmcnetEmail.setFakeTransport();
            email.sendEmail(function () {
                expect(fkTp.sentEmails).to.have.length(1);
                var sentEmail = fkTp.sentEmails[0];
                log.debug('SentEmail="%"', util.inspect(sentEmail));
                expect(sentEmail.from).to.equal(email.from);
                expect(sentEmail.to).to.equal(email.to);
                expect(sentEmail.subject).to.equal(email.subject);
                // reseting the sent maile
                fkTp.resetSentEmails();
                expect(fkTp.sentEmails).to.have.length(0);
                done();
            });
        });
        it('should have an error when sending email to a false smtp server', function (done) {
            log.debug('Test send with a false transport');
            // false smtp server transport
            jmcnetEmail.setSmtpTransport('google.com', 18, 'login', 'password', 250);
            email.sendEmail(function (err, info) {
                log.trace('Send Email return. Err="%s", info="%s"', util.inspect(err), util.inspect(info));
                expect(err).to.exist;
                done();
            });
        });
    });
    describe('Creating attachments from html template Test :', function () {
        before(function (done) {
            email = new Email('from@test.com', 'to@test.com', 'My subject string', 'My text string', '<html>My html string with an image : <img src="./images/test.png"></img></html>');
            done();
        });
        it('should be possible to replace img src by attachments', function (done) {
            log.debug('Test replacing img src by attachments');
            email.createImageAttachmentFromHtml('./test/');
            expect(email.html).to.equal('<html>My html string with an image : <img src="cid:img0"></img></html>');
            expect(email.attachments).to.have.length(1);
            expect(email.attachments[0].path).to.equal('./test/./images/test.png');
            done();
        });
    });
    describe('Twice substitute does nothing template Test :', function () {
        before(function (done) {
            email = new Email('from@test.com', 'to@test.com', 'My subject string', 'My text string', '<html>My html string with an image : <img src="./images/test.png"></img></html>');
            done();
        });
        it('should be possible to twice replace img src by attachments', function (done) {
            log.debug('Test replacing img src by attachments');
            email.createImageAttachmentFromHtml('./test/');
            email.createImageAttachmentFromHtml('./test/');
            expect(email.html).to.equal('<html>My html string with an image : <img src="cid:img0"></img></html>');
            expect(email.attachments).to.have.length(1);
            expect(email.attachments[0].path).to.equal('./test/./images/test.png');
            done();
        });
    });
});

// Send a real email. Put some real informations in the fields below to test and remonve the .skip after describe
var smtpServer = 'smtp.xxx.xxx';
var port = 465;
var login = 'xxxx';
var pwd = 'xxxx';
var from = 'xxxx';
var to = 'xxxx';
describe.skip('<JMCNet Email Integration Test>', function () {
    var email;
    before(function (done) {
        email = new Email(from, to, 'Test email fron JmcNetEmail lib', 'My text string', '<html>My html string</html>');
        jmcnetEmail.setSmtpTransport(smtpServer, port, login, pwd, 60000);
        done();
    });
    describe('Creating and sending an real email on a real smtp server', function () {
        it('should be possible to send a real email on a real smtp server', function (done) {
            expect(email).to.exist;
            this.timeout(60000);
            email.sendEmail(function (err, info) {
                log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"', err, util.inspect(info));
                expect(err).to.not.exist;
                done();
            });
        });
    });
    describe('Sending a email with an URL image in attachment', function () {
        it('should be possible to send an email with an URL image in attachment', function (done) {
            expect(email).to.exist;
            email.html = 'With an image coming from the url http://clouderial.com/wordpress/wp-content/uploads/2013/08/clouderial-logo-small1-135x80.png';
            email.addAttachment('jmc.png', 'http://clouderial.com/wordpress/wp-content/uploads/2013/08/clouderial-logo-small1-135x80.png');
            this.timeout(60000);
            email.sendEmail(function (err, info) {
                log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"', err, util.inspect(info));
                expect(err).to.not.exist;
                done();
            });
        });
    });
    describe('Sending a email with an local image in attachment', function () {
        it('should be possible to send an email with an local image in attachment', function (done) {
            expect(email).to.exist;
            email.html = 'With a local image';
            email.removeAttachments();
            email.addAttachment('jmc.png', './test/test.png');
            this.timeout(60000);
            email.sendEmail(function (err, info) {
                log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"', err, util.inspect(info));
                expect(err).to.not.exist;
                done();
            });
        });
    });
    describe('Sending a email with an image in html', function () {
        it('should be possible to send an email with an local image in attachment', function (done) {
            expect(email).to.exist;
            email.html = '<html>My html string with an image : <img src="./images/test.png"></img></html>';
            jmcnetEmail.setBaseImgDir('./test/');
            email.removeAttachments();
            this.timeout(60000);
            email.sendEmail(function (err, info) {
                log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"', err, util.inspect(info));
                expect(err).to.not.exist;
                done();
            });
        });
    });
    describe('Sending a email with 2 images in html', function () {
        it('should be possible to send an email with 2 images on one line with style in attachment', function (done) {
            expect(email).to.exist;
            email.html = '<html><body><img style="border: 5px solid #b0b0b0;"  src="images/background.jpg"/>My html string with two images in one line : <img src="./images/test.png"/>\n</body></html>';
            jmcnetEmail.setBaseImgDir('./test/');
            email.removeAttachments();
            this.timeout(60000);
            email.sendEmail(function (err, info) {
                log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"', err, util.inspect(info));
                expect(err).to.not.exist;
                done();
            });
        });
    });

});