'use strict';
/*jshint expr:true */

/**
 * Module dependencies.
 */
 const
    log4js = require('log4js'),
    jsonLayout = require('log4js-json-layout');
log4js.addLayout('json', jsonLayout);

var expect = require('chai').expect; // jshint ignore:line
var jmcnetResourceBundle = require('../js/jmcnetResourceBundle.js'),
    jmcnetI18n = require('../js/jmcnetI18n.js'),
    log = require('log4js').getLogger('jmcnet.resourceBundle'),
//    util = require('util'),
    fs = require('fs')
    //    ,_ = require('lodash')
;

// The tests
describe('<JMCNet ResourceBundle Unit Test>', function () {
    describe('create and loading files', function () {
        var rsc;
        before(function (done) {
            rsc = new jmcnetResourceBundle.ResourceBundle('./test/resources/test1', 'test1');
            done();
        });
        it('should not be possible to creates and load a bundle', function (done) {
            log.debug('Test loadBundle');
            rsc.loadFiles();
            expect(rsc.getFiles()).to.be.not.empty;
            expect(rsc.getFiles().fr).to.be.not.empty;
            expect(rsc.getFiles().en).to.be.not.empty;
            expect(rsc.getFiles().fr_FR).to.be.not.empty;

            done();
        });
        
        it('should be possible to get the bundle', function() {
            var bundle = jmcnetResourceBundle.getBundle('test1');
            expect(bundle).to.deep.equal(rsc);
        });

        it('should be possible to retrieve the fr PropertiesFile', function (done) {
            var localFile = jmcnetResourceBundle.getLocaleFile('test1', 'fr');
            expect(localFile.get('w2')).to.equal('Bonjour ceci est une phrase en Français et je la termine.');
            done();
        });

        it('should be possible to retrieve the fr_FR PropertiesFile', function (done) {
            var localFile = jmcnetResourceBundle.getLocaleFile('test1', 'fr_FR');
            expect(localFile.get('w2')).to.equal('Bonjour ceci est une phrase en Français de France et je la termine.');
            done();
        });

        it('should be possible to retrieve the en PropertiesFile', function (done) {
            var localFile = jmcnetResourceBundle.getLocaleFile('test1', 'en');
            expect(localFile.get('w2')).to.equal('Hello this is an English sentence and I will terminate it.');
            done();
        });

        it('should be possible to fall down to the en PropertiesFile when asking for en_EN file', function (done) {
            var localFile = jmcnetResourceBundle.getLocaleFile('test1', 'en_EN');
            expect(localFile.get('w2')).to.equal('Hello this is an English sentence and I will terminate it.');
            done();
        });

        it('should not be possible to get the de PropertiesFile', function (done) {
            var localFile = jmcnetResourceBundle.getLocaleFile('test1', 'de');
            expect(localFile).to.not.exist;
            done();
        });

        it('should not be possible to get a bundle named test2', function (done) {
            var localFile = jmcnetResourceBundle.getLocaleFile('test2', 'fr');
            expect(localFile).to.not.exist;
            done();
        });
        
        it('should be possible to get a template String replaced from bundle named test2', function (done) {
            var localFile = jmcnetResourceBundle.getLocaleFile('test1', 'fr');
            expect(localFile).to.exist;
            var replacedValue = jmcnetI18n.getLocaleString(localFile, 'templatedString', { val1 : 'val1', val2 : 12});
            expect(replacedValue).to.equal('The templated String with val1=val1 and val2=12.');
            done();
        });
        
        it('should be possible to get a template String replaced from bundle named test2 with globale locale', function (done) {
            jmcnetI18n.setLocale('fr');
            var localFile = jmcnetResourceBundle.getLocaleFile('test1');
            expect(localFile).to.exist;
            var replacedValue = jmcnetI18n.getLocaleString(localFile, 'templatedString', { val1 : 'val1', val2 : 12});
            expect(replacedValue).to.equal('The templated String with val1=val1 and val2=12.');
            done();
        });
    });

    describe('check automatic reload Test :', function () {
        var rsc;
        before(function (done) {
            rsc = new jmcnetResourceBundle.ResourceBundle('./test/resources/test1', 'test1', {
                reloadOnChange: true,
                checkReloadTimeSec: 0 // always check
            });
            rsc.loadFiles(done);
        });
        it('should be possible to reload file if it has change', function (done) {
            log.debug('Test reload file on file change');
            expect(rsc.getLocaleFile('fr').get('w3')).to.not.exist;

            var fileName = './test/resources/test1/test1_fr.properties';
            var stats = fs.statSync(fileName);
            fs.appendFile(fileName, '\nw3=The new value', function (err) {
                if (err) throw err;
                // reload must be done
                expect(jmcnetResourceBundle.getLocaleFile('test1', 'fr').get('w3')).to.equal('The new value');
                // remove the last blank
                fs.truncateSync(fileName, stats.size);
                done();
            });
        });
        it('should not be possible to reload file that hasn\'t has change', function () {
            log.debug('Test reload file on file change');
            expect(jmcnetResourceBundle.getLocaleFile('test1', 'fr').get('w3')).to.not.exist;
            expect(jmcnetResourceBundle.getLocaleFile('test1', 'fr').get('w3')).to.not.exist;
        });
        it('should not be possible to reload when reloadOnChange option is false', function (done) {
            rsc.setOptions({
                reloadOnChange: false,
                checkReloadTimeSec: 0 // always check
            });
            expect(rsc.getLocaleFile('fr').get('w3')).to.not.exist;

            var fileName = './test/resources/test1/test1_fr.properties';
            var stats = fs.statSync(fileName);
            fs.appendFile(fileName, '\nw3=The new value', function (err) {
                if (err) throw err;
                // reload must be done
                expect(jmcnetResourceBundle.getLocaleFile('test1', 'fr').get('w3')).to.not.exist;
                // remove the last blank
                fs.truncateSync(fileName, stats.size);
                done();
            });
        });
        it('should be possible to reload when reloadOnChange option is true and checkReloadTimeSec is 1 sec', function (done) {
            rsc.setOptions({
                reloadOnChange: true,
                checkReloadTimeSec: 1 // always check
            });
            expect(rsc.getLocaleFile('fr').get('w3')).to.not.exist;

            var fileName = './test/resources/test1/test1_fr.properties';
            var stats = fs.statSync(fileName);
            fs.appendFile(fileName, '\nw3=The new value', function (err) {
                if (err) throw err;
                // reload must be done after 1 sec
                setTimeout(function () {
                    log.trace('File is modified and timeout is expired, reload and check the value');
                    expect(jmcnetResourceBundle.getLocaleFile('test1', 'fr').get('w3')).to.equal('The new value');
                    // remove the last blank
                    fs.truncateSync(fileName, stats.size);
                    done();
                }, 1100);
            });
        });
    });
});