'use strict';
/*jshint expr:true */

/**
 * Module dependencies.
 */
var expect = require('chai').expect; // jshint ignore:line
var jmcnetResourceBundle = require('../js/jmcnetResourceBundle.js'),
    jmcnetException = require('../js/jmcnetException.js'),
    log = require('log4js').getLogger('jmcnet.resourceBundle'),
    util = require('util'),
    fs = require('fs')
//    ,_ = require('lodash')
;

// The tests
describe('<JMCNet ResourceBundle Unit Test>', function () {
    describe('create and loading files', function () {
        var rsc;
        before(function(done) {
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
        
        it('should be possible to retrieve the fr PropertiesFile', function(done) {
            var bundle = jmcnetResourceBundle.getBundle('test1', 'fr');
            expect(bundle.get('w2')).to.equal('Bonjour ceci est une phrase en Français et je la termine.');
            done();
        });
        
        it('should be possible to retrieve the fr_FR PropertiesFile', function(done) {
            var bundle = jmcnetResourceBundle.getBundle('test1', 'fr_FR');
            expect(bundle.get('w2')).to.equal('Bonjour ceci est une phrase en Français de France et je la termine.');
            done();
        });
        
        it('should be possible to retrieve the en PropertiesFile', function(done) {
            var bundle = jmcnetResourceBundle.getBundle('test1', 'en');
            expect(bundle.get('w2')).to.equal('Hello this is an English sentence and I will terminate it.');
            done();
        });
        
        it('should be possible to fall down to the en PropertiesFile when asking for en_EN file', function(done) {
            var bundle = jmcnetResourceBundle.getBundle('test1', 'en_EN');
            expect(bundle.get('w2')).to.equal('Hello this is an English sentence and I will terminate it.');
            done();
        });
        
        it('should not be possible to get the de PropertiesFile', function(done) {
            var bundle = jmcnetResourceBundle.getBundle('test1', 'de');
            expect(bundle).to.not.exist;
            done();
        });
        
        it('should not be possible to get a bundle named test2', function(done) {
            var bundle = jmcnetResourceBundle.getBundle('test2', 'fr');
            expect(bundle).to.not.exist;
            done();
        });
    });
});