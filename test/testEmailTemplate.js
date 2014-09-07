/* jshint expr:true*/
'use strict';

/**
 * Unit test file for testing the EmailTemplate module
 * Author : Jean-Marc Collin
 */

/* Module dependencies */
var expect = require('chai').expect; // jshint ignore:line
var assert = require('assert'); // jshint ignore:line
var log = require('log4js').getLogger('jmcnet.emailTemplate'),
    // jmcnetException = require('../js/jmcnetException.js'),
    jmcnetEmailTemplate = require('../js/jmcnetEmailTemplate.js'),
    util = require('util');

// The tests
describe('<JMCNet EmailTemplate Unit Test>', function () {
    before(function (done) {
        jmcnetEmailTemplate.resetEmailTemplates();
        done();
    });
    describe('Creating and retrieve a new template from String', function () {
        it('should be possible to create and retrieve a new EmailTemplate from Stings', function (done) {
            log.debug('Test create and retrieve a EmailTemplate from String');
            expect(jmcnetEmailTemplate.getLstTemplates()).to.be.empty;
            try {
                var tpl = new jmcnetEmailTemplate.EmailTemplate('template1', 'subject', 'body');
                expect(tpl).to.exist;

            } catch (err) {
                assert.fail('we should not be there');
            }
            expect(jmcnetEmailTemplate.getLstTemplates()).to.be.not.empty;
            expect(jmcnetEmailTemplate.getLstTemplates().template1).to.exist;
            expect(jmcnetEmailTemplate.getLstTemplates().template1.subjectTemplate).to.equal('subject');
            expect(jmcnetEmailTemplate.getLstTemplates().template1.bodyTemplate).to.equal('body');

            var tpl1 = jmcnetEmailTemplate.getEmailTemplate('template1');
            expect(tpl1).to.deep.equal(jmcnetEmailTemplate.getLstTemplates().template1);
            done();
        });
    });

    describe('Rendering the subject and body Test :', function () {
        var tpl;
        before(function (done) {
            jmcnetEmailTemplate.resetEmailTemplates();
            tpl = new jmcnetEmailTemplate.EmailTemplate('template1', 'subject <%= title %>', 'body <%=body%>');
            done();
        });
        it('should be possible to render the subject and body', function (done) {
            log.debug('Test Render subject');
            var subject, body;
            try {
				subject = tpl.renderSubject({ title : 'This is the title of the mail', body : 'This is the body of the mail' });
                body = tpl.renderBody({ title : 'This is the title of the mail', body : 'This is the body of the mail' });
                expect(subject).to.equal('subject This is the title of the mail');
                expect(body).to.equal('body This is the body of the mail');
            } catch (err) {
                assert.fail('we should not be there');
            }
            done();
        });
    });
    
    describe('Loading a template from a file :', function () {
        before(function (done) {
            jmcnetEmailTemplate.resetEmailTemplates();
            done();
        });
        it('should be possible to load a template from a file', function (done) {
            log.debug('Test Load template from a file');
            var subject, body;
            try {
                var tpl = jmcnetEmailTemplate.loadEmailTemplateFromFile('template1', 'subject <%= title %>', 'test/emailTemplates/template1.html');
                log.debug('tpl is "%s"', util.inspect(tpl));
            
				subject = tpl.renderSubject({ title : 'This is the title of the mail', body : 'This is the body of the mail' });
                body = tpl.renderBody({ title : 'This is the title of the mail', body : 'This is the body of the mail' });
                expect(subject).to.equal('subject This is the title of the mail');
                expect(body).to.equal('<html>This is the body of the mail</html>');
            } catch (err) {
                assert.fail('we should not be there err='+err.message);
            }
            done();
        });
    });
    
    describe('Rendering a Date in locale String :', function () {
        var tpl;
        before(function (done) {
            jmcnetEmailTemplate.resetEmailTemplates();
            tpl = new jmcnetEmailTemplate.EmailTemplate('template1', 'The date is <%=: date | toLocaleDateString %>', 'body <%=body%>');
            done();
        });
        it('should be possible to render the subject and body', function (done) {
            log.debug('Test Render subject with date');
            var subject;
            var d = new Date(Date.parse('2014-08-31'));
            subject = tpl.renderSubject({ date : d, body : 'This is the body of the mail' });
            expect(subject).to.equal('The date is 31/08/2014');
            subject = tpl.renderSubject({ date : d, body : 'This is the body of the mail' }, 'fr');
            expect(subject).to.equal('The date is 31/08/2014');
                subject = tpl.renderSubject({ date : d, body : 'This is the body of the mail' }, 'en');
            expect(subject).to.equal('The date is 08/31/2014');
            done();
        });
    });


    after(function (done) {
        // TODO do some after exit clean
        done();
    });
});