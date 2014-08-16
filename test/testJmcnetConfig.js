'use strict';
/*jshint expr:true */

/**
 * Module dependencies.
 */
var expect = require('chai').expect; // jshint ignore:line
var assert = require('assert'); // jshint ignore:line
var jmcnetConfig = require('../js/jmcnetConfig.js'),
    jmcnetException = require('../js/jmcnetException.js'),
    log = require('log4js').getLogger('jmcnet.config'),
    util = require('util')
//    ,_ = require('lodash')
    ;

// The tests
describe('<JMCNet Config Unit Test>', function () {
    describe('loadConfig in empty dir', function() {
        it('should not be possible to load a config file that doesn"t exists', function(done){
            log.debug('Test loadConfig empty');
            try {
                jmcnetConfig.loadConfig('./test/emptyConfig/');
                assert.fail('we should not be there');
             } catch (err) {
                expect(err).to.be.an.instanceOf(jmcnetException.TechnicalException);
            }
            expect(jmcnetConfig.getConfig()).to.be.empty;
            done();
        });
    });
    describe('loadConfig', function() {
        it('should be possible to load a config file', function(done){
            log.debug('Test loadConfig OK');
            try {
                jmcnetConfig.loadConfig('./test/config/');
             } catch (err) {
                 log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            log.debug('Config is now : %s', util.inspect(jmcnetConfig.getConfig().getKeys()));
            expect(jmcnetConfig.getConfig().getKeys()).to.be.not.empty;
            expect(jmcnetConfig.getConfig().get('sub1.value1')).to.equal('value 1');
            expect(jmcnetConfig.getConfig().get('sub1.value2')).to.equal('value 2/sub1');
            expect(jmcnetConfig.getConfig().get('sub2.value1')).to.equal('value 2');
            expect(jmcnetConfig.getConfig().get('sub2.value2')).to.equal('value 1/sub2');
            done();
        });
    });
    describe.only('loadConfig', function() {
        it('should be possible to load a config file with non default options', function(done){
            log.debug('Test loadConfig with options OK');
            try {
                // TODO ca marche pas... La config n'est pas prise en compte
                jmcnetConfig.loadConfig('./test/config/', { masterConfigFile : 'dontexist.properties', reloadOnChange : false, checkReloadTime : 1});
             } catch (err) {
                 log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            log.debug('Config is now : %s', util.inspect(jmcnetConfig.getConfig().getKeys()));
            expect(jmcnetConfig.getConfig().getKeys()).to.be.not.empty;
            expect(jmcnetConfig.getConfig().get('sub1.value1')).to.equal('value 1');
            expect(jmcnetConfig.getConfig().get('sub1.value2')).to.equal('value 2/sub1');
            expect(jmcnetConfig.getConfig().get('sub2.value1')).to.equal('value 2');
            expect(jmcnetConfig.getConfig().get('sub2.value2')).to.equal('value 1/sub2');
            done();
        });
    });
});