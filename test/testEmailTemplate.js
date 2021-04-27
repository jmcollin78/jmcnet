/* jshint expr:true*/
'use strict';

/**
 * Unit test file for testing the EmailTemplate module
 * Author : Jean-Marc Collin
 */

 const
    log4js = require('log4js'),
    jsonLayout = require('log4js-json-layout');
log4js.addLayout('json', jsonLayout);

/* Module dependencies */
var expect = require('chai').expect; // jshint ignore:line
var assert = require('assert'); // jshint ignore:line
var log = require('log4js').getLogger('testu'),
    jmcnetEmail = require('../js/jmcnetEmail.js'),
    jmcnetEmailTemplate = require('../js/jmcnetEmailTemplate.js'),
    jmcnetI18n = require('../js/jmcnetI18n.js'),
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
                log.error('Error while loading EmailTemplate : err="%s"', util.inspect(err));
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
                subject = tpl.renderSubject({
                    title: 'This is the title of the mail',
                    body: 'This is the body of the mail'
                });
                body = tpl.renderBody({
                    title: 'This is the title of the mail',
                    body: 'This is the body of the mail'
                });
                expect(subject).to.equal('subject This is the title of the mail');
                expect(body).to.equal('body This is the body of the mail');
            } catch (err) {
                log.error('Error : "%s"', err);
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

                subject = tpl.renderSubject({
                    title: 'This is the title of the mail',
                    body: 'This is the body of the mail'
                });
                body = tpl.renderBody({
                    title: 'This is the title of the mail',
                    body: 'This is the body of the mail'
                });
                expect(subject).to.equal('subject This is the title of the mail');
                expect(body).to.equal('<html>This is the body of the mail</html>');
            } catch (err) {
                assert.fail('we should not be there err=' + err.message);
            }
            done();
        });
    });

    describe('Rendering a Date in locale String :', function () {
        var tpl;
        before(function (done) {
            jmcnetEmailTemplate.resetEmailTemplates();
            tpl = new jmcnetEmailTemplate.EmailTemplate('template1', 'The date is <%= jmcnetI18n.formatDate(date) %>', 'body <%=body%>');
            done();
        });
        it('should be possible to render the subject and body', function (done) {
            log.debug('Test Render subject with date');
            var subject;
            var d = new Date(Date.parse('2014-08-31'));
            jmcnetI18n.setLocale('fr');
            subject = tpl.renderSubject({
                date: d,
                body: 'This is the body of the mail'
            });
            expect(subject).to.equal('The date is 31/08/2014');
            subject = tpl.renderSubject({
                date: d,
                body: 'This is the body of the mail'
            });
            expect(subject).to.equal('The date is 31/08/2014');
            jmcnetI18n.setLocale('en');
            subject = tpl.renderSubject({
                date: d,
                body: 'This is the body of the mail'
            });
            expect(subject).to.equal('The date is 08-31-2014');
            done();
        });
    });
    
    describe('Set subject and body template', function(done) {
        var tpl;
        before(function (done) {
            jmcnetEmailTemplate.resetEmailTemplates();
            tpl = new jmcnetEmailTemplate.EmailTemplate('template1');
            done();
        });
        it('should be possible to change and render the subject and body', function (done) {
            tpl.setSubjectTemplate('The date is <%= date %>');
            tpl.setBodyTemplate('body <%=body%>');
            var subject, body;
            subject = tpl.renderSubject({
                date: '2014-10-05',
                body: 'This is the body of the mail'
            });
            expect(subject).to.equal('The date is 2014-10-05');
            body = tpl.renderBody({
                date: '2014-10-05',
                body: 'This is the body of the mail'
            }, 'fr');
            expect(body).to.equal('body This is the body of the mail');
            done();
        });
    });

    after(function (done) {
        // TODO do some after exit clean
        done();
    });
});

// Send a real email. Put some real informations in the fields below to test and remonve the .skip after describe
var smtpServer = 'smtp.xxx.xxx';
var port = 465;
var login = 'xxxx';
var pwd = 'xxxx';
var from = 'xxxx@xxx.com';
var to = ['xxxx@xxxx.com', 'yyyy@yyyy.com' ];
describe.skip(' < JMCNet Email Template Integration Test > ', function () {
    var email, template;
    before(function (done) {
        email = new jmcnetEmail.Email(from, to);
        jmcnetEmail.setSmtpTransport(smtpServer, port, login, pwd, 60000);
        jmcnetEmailTemplate.resetEmailTemplates();
        template = jmcnetEmailTemplate.loadEmailTemplateFromFile('realTemplate ', '[\u2601 Testu] Création d\'un compte', 'test/emailTemplates/realTemplate.html');
        done();
    });
    
    describe('Creating and sending an real email on a real smtp server from a real template', function () {
        it('should be possible to send a real email on a real smtp server from a real template', function (done) {
            expect(email).to.exist;
            expect(template).to.exist;
            this.timeout(60000);
            var context={
                mail_commons_header : 'Vous recevez cet e-mail car vous êtes utilisateur CLOUDerial.',
                headerH1 : 'Création d\'un compte',
                messageCoreHtml : 'Vous venez de créer un compte sur Clouderial.com.<br/>Pour <span style="font-weight:bold; font-size:125%; background-color:yellow;"><a href="<%=urlActivateAccount%>">finaliser votre inscription, cliquez ici</a></span>.<br/>Vous pourrez ensuite personnaliser votre mot de passe.<br/>Vos informations :<br/><ul><li>login : <%=account.email%></li><li>pseudo : <%=account.pseudo%></li><li>mot de passe temporaire : <%=password%></li></ul><br/>Une fois votre compte activé, votre espace client sera accessible en cliquant <a href="<%=urlAccountApp%>">ici</a>.',
                mail_commons_signature : 'Merci de votre confiance.<p>L\'équipe Clouderial.</p>',
                mailConditions : '<p><u>Conditions d\'utilisation :</u></p><p>Cette inscription est gratuite. Vous bénéficiez d\'un accès complet à toutes les fonctions proposées par <a href="http://www.clouderial.com">Clouderial.com</a> à concurrence de 25 objets partageables. En cas de dépassement, votre compte restera gratuit mais aura un accès limité ne lecture seule.</p>',
                mail_commons_footer_msg1 : 'CLOUDerial est une marque déposée de CLOUDERIAL SAS',
                mail_commons_footer_msg2 : 'CLOUDerial SAS - 13 rue des acacias - 78650 BEYNES',
                mail_commons_footer_msg3 : 'SAS au capital de 9000 € - 790 998 553 RCS de Versailles',
                urlActivateAccount : 'http://clouderial.com/activate-account.html?id=A4012',
                account : {
                    email : 'test@testu.com',
                    pseudo : 'The test man'
                    
                },
                password : 'hyXPyDKx',
                urlAccountApp : 'http://clouderial.com/account-web'
            };
            jmcnetEmail.setBaseImgDir('./test/emailTemplates/images');
//            jmcnetEmail.setBaseImgDir('http://clouderial.com/templates/images/');
            template.sendEmail2Pass(email, context, 'fr', function (err, info) {
                log.trace('Send real Email on a real smtp server return. Err="%s", info="%s"', err, util.inspect(info));
                expect(err).to.not.exist;
                done();
            });
        });
    });
});