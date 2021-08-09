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
    util = require('util'),
    fs = require('fs')
    //    ,_ = require('lodash')
;

// The tests
describe('<JMCNet Config Unit Test>', function () {
    describe('loadConfig in empty dir', function () {
        it('should be possible to access non initialized config file', function() {
            log.debug('Test non initialized config file');
            expect(jmcnetConfig.get('dontexists','defaultValue')).to.equal('defaultValue');
            expect(jmcnetConfig.getInt('dontexists',12)).to.equal(12);
            expect(jmcnetConfig.getFloat('dontexists',12.34)).to.equal(12.34);
        });
        it('should not be possible to load a config file that doesn"t exists', function (done) {
            log.debug('Test loadConfig empty');
            try {
                jmcnetConfig.loadConfig('./test/emptyConfig/');
                assert.fail('we should not be there');
            } catch (err) {
                expect(err).to.be.an.instanceOf(jmcnetException.TechnicalException);
            }
            expect(jmcnetConfig.getConfig().getKeys()).to.be.empty;
            done();
        });
    });
    describe('loadConfig with a config file', function () {
        it('should be possible to load a config file', function (done) {
            log.debug('Test loadConfig OK');
            try {
                jmcnetConfig.loadConfig('./test/config/');
            } catch (err) {
                log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            log.debug('Config is now : %s', util.inspect(jmcnetConfig.getKeys()));
            expect(jmcnetConfig.getKeys()).to.be.not.empty;
            expect(jmcnetConfig.get('sub1.value1')).to.equal('value 1');
            expect(jmcnetConfig.get('sub1.value2')).to.equal('value 2/sub1');
            expect(jmcnetConfig.get('sub2.value1')).to.equal('value 2');
            expect(jmcnetConfig.get('sub2.value2')).to.equal('value 1/sub2');
            done();
        });
    });
    describe('loadConfig with a config file (without trailing / at the end of the name)', function () {
        it('should be possible to load a config file without a trailing /', function (done) {
            log.debug('Test loadConfig OK');
            try {
                jmcnetConfig.loadConfig('./test/config');
            } catch (err) {
                log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            log.debug('Config is now : %s', util.inspect(jmcnetConfig.getKeys()));
            expect(jmcnetConfig.getKeys()).to.be.not.empty;
            expect(jmcnetConfig.get('sub1.value1')).to.equal('value 1');
            expect(jmcnetConfig.get('sub1.value2')).to.equal('value 2/sub1');
            expect(jmcnetConfig.get('sub2.value1')).to.equal('value 2');
            expect(jmcnetConfig.get('sub2.value2')).to.equal('value 1/sub2');
            done();
        });
    });
    describe('loadConfig with options', function () {
        it('should be possible to load a config file with non default options', function (done) {
            log.debug('Test loadConfig with options OK');
            try {
                jmcnetConfig.loadConfig('./test/config/', {
                    masterFileName: 'master2.properties',
                    reloadOnChange: false,
                    checkReloadTimeSec: 1
                });
            } catch (err) {
                log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            var options = jmcnetConfig.getOptions();
            log.debug('Options are : %s', util.inspect(options));
            expect(options.masterFileName).to.equal('master2.properties');
            expect(options.reloadOnChange).to.be.false;
            expect(options.checkReloadTimeSec).to.equal(1);

            log.debug('Config is now : %s', util.inspect(jmcnetConfig.getKeys()));
            expect(jmcnetConfig.getKeys()).to.be.not.empty;
            expect(jmcnetConfig.get('sub1.value1')).to.equal('value 1');
            expect(jmcnetConfig.get('sub1.value2')).to.equal('value 2/sub1');
            expect(jmcnetConfig.get('sub2.value1')).to.equal('value 2');
            expect(jmcnetConfig.get('sub2.value2')).to.equal('value 1/sub2');
            done();
        });
    });
    describe('check file changes after loadConfig', function () {
        it('check file changes must be false after loading', function (done) {
            log.debug('Test check file changes false after loading config');
            try {
                jmcnetConfig.loadConfig('./test/config/', {
                    masterFileName: 'master2.properties',
                    reloadOnChange: false,
                    checkReloadTimeSec: 10
                });
            } catch (err) {
                log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            expect(jmcnetConfig.checkFileChanges()).to.be.false;
            done();
        });
    });
    describe('check file changes after master file modification', function () {
        it('check file changes must be true after a file modification', function (done) {
            log.debug('Test check file changes after a master file modification');
            try {
                jmcnetConfig.loadConfig('./test/config/', {
                    masterFileName: 'master2.properties',
                    reloadOnChange: true,
                    checkReloadTimeSec: 0 // always check
                });
            } catch (err) {
                log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            // just after loading check is false
            expect(jmcnetConfig.checkFileChanges()).to.be.false;
            log.trace('Touching the master file');
            var fileName='./test/config/master2.properties';
            var stats = fs.statSync(fileName);
            fs.appendFile(fileName, ' ', function (err) {
                if (err) throw err;
                // check must be true now
                expect(jmcnetConfig.checkFileChanges()).to.be.true;
                // remove the last blank
                fs.truncateSync(fileName, stats.size);
                done();
            });
        });
    });
    describe('check reload config after a subfile modification', function () {
        before(function(done) {
            fs.writeFileSync('./test/config/master3.properties','subfile.1=subdir/subfile1.properties\nsubfile.2=subfile3.properties');
            fs.writeFile('./test/config/subfile3.properties','subfile3.value=my value', done);
        });
        it('should reload the config after a subfile change', function (done) {
            log.debug('Test reload the configuration after a subfile modification');
            try {
                jmcnetConfig.loadConfig('./test/config/', {
                    masterFileName: 'master3.properties',
                    reloadOnChange: true,
                    checkReloadTimeSec: 0 // always check
                });
            } catch (err) {
                log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            expect(jmcnetConfig.get('subfile3.value')).to.equal('my value');
            log.trace('Modifying the value of subfile3.value properties');
            fs.writeFile('./test/config/subfile3.properties','subfile3.value=${sub1.value1}/my value', function (err) {
                if (err) throw err;
                // check must be true now
                expect(jmcnetConfig.get('subfile3.value')).to.equal('value 1/my value');
                done();
            });
        });
        after(function(done) {
            fs.unlinkSync('./test/config/master3.properties');
            fs.unlink('./test/config/subfile3.properties', done);
            // done();
        });
    });
    describe('check calling listener after a subfile modification', function () {
        var nbListenerCall=0;
        var incListenerCall=function() { nbListenerCall++;};
        
        before(function(done) {
            fs.writeFileSync('./test/config/master3.properties','subfile.1=subdir/subfile1.properties\nsubfile.2=subfile3.properties');
            fs.writeFile('./test/config/subfile3.properties','subfile3.value=my value', done);
        });
        it('should call the listener after a subfile change', function (done) {
            
            log.debug('Test calling the listener after a subfile modification');
            try {
                jmcnetConfig.loadConfig('./test/config/', {
                    masterFileName: 'master3.properties',
                    reloadOnChange: true,
                    checkReloadTimeSec: 1 // one second between 2 checks
                });
                expect(nbListenerCall).to.equal(0);
                jmcnetConfig.addListener(incListenerCall);
            } catch (err) {
                log.error('Error is "%s"', err.message);
                assert.fail('We should not be there');
            }
            log.trace('Get subfile3.value');
            expect(jmcnetConfig.get('subfile3.value')).to.equal('my value');
            setTimeout(function() {
                log.trace('Modifying the value of subfile3.value properties');
                fs.writeFile('./test/config/subfile3.properties','subfile3.value=${sub1.value1}/my value', function (err) {
                    if (err) throw err;
                    // check must be true now
                    expect(jmcnetConfig.get('subfile3.value')).to.equal('value 1/my value');
                    expect(nbListenerCall).to.equal(1);
                    done();
                });
                } , 1100);
        });
        after(function(done) {
            fs.unlinkSync('./test/config/master3.properties');
            fs.unlink('./test/config/subfile3.properties', done);
            // done();
        });
    });
    describe('check default value', function() {
        before(function(done) {
            log.trace('\n\n-----------------------------------\n\n');
            jmcnetConfig.loadConfig('./test/config/');
            done();
        });
        it('should get a default value when key does not exists', function() {
            expect(jmcnetConfig.get('sub1.value1.dontExists','defaultValue')).to.equal('defaultValue');
            expect(jmcnetConfig.get('sub1.value1.dontExists')).to.not.exist;
            // normal value with default
            expect(jmcnetConfig.get('sub1.value2','defaultValue')).to.equal('value 2/sub1');
        });
    });
    describe('check int value', function() {
        before(function(done) {
            log.trace('\n\n-----------------------------------\n\n');
            jmcnetConfig.loadConfig('./test/config/');
            done();
        });
        it('should get a int value', function() {
            expect(jmcnetConfig.getInt('sub1.value1.dontExists')).to.not.exist;
            expect(jmcnetConfig.getInt('sub1.value1.dontExists',12)).to.equal(12);
            expect(jmcnetConfig.getInt('sub2.int.value')).to.equal(14);
            expect(jmcnetConfig.getInt('sub2.int.value', 12)).to.equal(14);
        });
    });
    describe('check bool value', function() {
        before(function(done) {
            log.trace('\n\n-----------------------------------\n\n');
            jmcnetConfig.loadConfig('./test/config/');
            done();
        });
        it('should get a boolean value', function() {
            expect(jmcnetConfig.getBoolean('sub1.value1.dontExists')).to.be.false;
            expect(jmcnetConfig.getBoolean('sub1.value1.dontExists', true)).to.be.true;
            expect(jmcnetConfig.getBoolean('sub2.true.value1')).to.be.true;
            expect(jmcnetConfig.getBoolean('sub2.true.value2')).to.be.true;
            expect(jmcnetConfig.getBoolean('sub2.false.value1')).to.be.false;
            expect(jmcnetConfig.getBoolean('sub2.false.value2')).to.be.false;
        });
    });
    
    describe('check override value in 2nd file', function() {
        before(function(done) {
            log.trace('\n\n-----------------------------------\n\n');
            jmcnetConfig.loadConfig('./test/config/');
            done();
        });
        it('should get a String value', function() {
            expect(jmcnetConfig.getAll('sub2.override.value')).to.eql(['value sub2', 'overriden value']);
            expect(jmcnetConfig.getFirst('sub2.override.value')).to.eql('value sub2');
            expect(jmcnetConfig.getLast('sub2.override.value')).to.eql('overriden value');
            expect(jmcnetConfig.getLast('sub2.override.value')).to.eql(jmcnetConfig.get('sub2.override.value'));
        });
        
        it('should get a Boolean value', function() {
            expect(jmcnetConfig.getAll('sub2.override.boolean.value')).to.eql(['true', 'false']);
            expect(jmcnetConfig.getFirst('sub2.override.boolean.value')).to.eql('true');
            expect(jmcnetConfig.getLast('sub2.override.boolean.value')).to.eql('false');
            expect(jmcnetConfig.getLast('sub2.override.boolean.value')).to.eql(''+jmcnetConfig.get('sub2.override.boolean.value'));
            expect(jmcnetConfig.getBoolean('sub2.override.boolean.value')).to.be.false;
        });
    });
});