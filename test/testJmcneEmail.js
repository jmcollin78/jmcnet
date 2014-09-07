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
        it('should not be possible to send email without a transport', function(done) {
            log.debug('Test send without transport');
            expect(email.sendEmail).to.throw(jmcnetException.TechnicalException);
            done();
        });
        it('should be possible to send email with a fake transport', function(done) {
            log.debug('Test send with a transport');
            jmcnetEmail.setFakeTransport();
            expect(email.sendEmail).to.not.throw(Error);
            done();
        });
        it('should have an error when sending email to a false smtp server', function(done) {
            log.debug('Test send with a false transport');
            jmcnetEmail.setSmtpTransport('127.0.0.1', 25, 'login', 'password', 250);
            email.sendEmail(function(err, info) {
                log.trace('Send Email return. Err="%s", info="%s"',err, util.inspect(info));
                expect(err).to.exist;
                done();
            });
        });
    });
});

// Send a real email. Put some real informations in the fields below to test and remonve the .skip after describe
var smtpServer = 'smtp.laposte.net';
var port = 465;
var login = 'jm.collin@laposte.net';
var pwd = 'schwp3v5';
var from='jm.collin@laposte.com';
var to='jm.collin@laposte.com';
describe.only('<JMCNet Email Integration Test>', function () {
    var email;
    before(function (done) {
        email = new Email(from, to, 'Test email fron JmcNetEmail lib', 'My text string', '<html>My html string</html>');
        done();
    });
    describe('Creating and sending an real email on a real smtp server', function () {
        it('should be possible to send a real email on a real smtp server', function (done) {
            expect(email).to.exist;
            jmcnetEmail.setSmtpTransport(smtpServer, port, login, pwd, 60000);
            this.timeout(60000);
            email.sendEmail(function (err, info) {
                log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"',err, util.inspect(info));
                expect(err).to.not.exist;
                done();
            });
        });
    });
});
