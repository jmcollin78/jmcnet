'use strict';

/**
 * Module dependencies.
 */
var expect = require('chai').expect; // jshint ignore:line
var jmcDate = require('../js/jmcnetDate.js'),
    log = require('log4js').getLogger('jmcnet.date')
//    ,_ = require('lodash')
    ;

// The tests
describe('<JMCNet Date Unit Test>', function () {
    describe('getDateHourMinuteNow', function() {
        it('should be possible to create a date with dateHourMinute only', function(done){
            var d = jmcDate.getDateHourMinuteNow();
            var now = Date.now();
            log.debug('getDateHourMinuteNow is "%s"', d);
            expect(d.getTime()).to.be.lessThan(now);
            expect(d.getTime() - now).to.be.lessThan(60000); // one minute max
            expect(d.getSeconds()).to.equal(0);
            expect(d.getMilliseconds()).to.equal(0);
            done();
        });
    });
    
    describe('getDateToday', function() {
        it('should be possible to create a date with date only', function(done){
            var d = jmcDate.getDateToday();
            var now = Date.now();
            log.debug('getDateToday is "%s"', d);
            expect(d.getTime()).to.be.lessThan(now);
            expect(d.getTime() - now).to.be.lessThan(86400000); // one day max
            expect(d.getHours()).to.equal(0);
            expect(d.getMinutes()).to.equal(0);
            expect(d.getSeconds()).to.equal(0);
            expect(d.getMilliseconds()).to.equal(0);
            done();
        });
    });
    
    describe('addDays', function() {
        it('should be possible to add a day to one normal date', function(done){
            var now = jmcDate.getDateToday();
            var d = jmcDate.addDays(now, 1);
            log.debug('d + 1 day is "%s"', d);
            expect(d.getTime()).to.be.greaterThan(now);
            expect(d.getTime() - now).to.equal(86400000); // one day exactly
            done();
        });
        
        it('should be possible to substract a day to one normal date', function(done){
            var now = jmcDate.getDateToday();
            var d = jmcDate.addDays(now, -1);
            log.debug('d - 1 day is "%s"', d);
            expect(d.getTime()).to.be.lessThan(now);
            expect(d.getTime() - now).to.equal(-86400000); // one day exactly
            done();
        });
        
        it('should be possible to add a day to a date which is an end of month', function(done){
            var now = new Date(2014, 5, 30); // June 30, 2014
            var d = jmcDate.addDays(now, 1);
            log.debug('d + 1 day is "%s"', d);
            expect(d.getTime()).to.be.greaterThan(now);
            expect(d.getTime() - now).to.equal(86400000); // one day exactly
            expect(d.getMonth()).to.equal(6); // July
            expect(d.getDate()).to.equal(1);
            done();
        });
    });
    
    describe('addWeeks', function() {
        it('should be possible to add a week to one normal date', function(done){
            var now = jmcDate.getDateToday();
            var d = jmcDate.addWeeks(now, 1);
            var d2 = jmcDate.addDays(now, 7);
            log.debug('d + 1 week is "%s"', d);
            expect(d.getTime()).to.be.greaterThan(now);
            expect(d.getTime() - now).to.equal(7 * 86400000); // one week exactly
            expect(d.getTime()).to.equal(d2.getTime());
            done();
        });

        it('should be possible to substract a week to one normal date', function(done){
            var now = jmcDate.getDateToday();
            var d = jmcDate.addWeeks(now, -1);
            var d2 = jmcDate.addDays(now, -7);
            log.debug('d - 1 week is "%s"', d);
            expect(d.getTime()).to.be.lessThan(now);
            expect(d.getTime() - now).to.equal(-7 * 86400000); // one week exactly
            expect(d.getTime()).to.equal(d2.getTime());
            done();
        });

        it('should be possible to add 2 weeks to a date which is an end of month', function(done){
            var now = new Date(2014, 1, 28); // Feb 28, 2014
            var d = jmcDate.addWeeks(now, 2);
            log.debug('d + 2 weeks is "%s"', d);
            expect(d.getTime()).to.be.at.least(now);
            expect(d.getTime() - now).to.equal(14*86400000); // 2 weeks exactly
            expect(d.getMonth()).to.equal(2); // March
            expect(d.getDate()).to.equal(14);
            done();
        });
    });
    
    describe('addMonth', function() {
        it('should be possible to add a month to one normal date', function(done){
            var now = jmcDate.getDateToday();
            var d = jmcDate.addMonths(now, 1);
            log.debug('d + 1 month is "%s"', d);
            expect(d.getTime()).to.be.at.least(28 * 86400000 + now.getTime());
            expect(d.getTime()).to.be.at.most(31 * 86400000 + now.getTime());
            done();
        });

        it('should be possible to substract a month to one normal date', function(done){
            var now = jmcDate.getDateToday();
            var d = jmcDate.addMonths(now, -1);
            log.debug('d - 1 month is "%s"', d);
            expect(d.getTime()).to.be.lessThan(-28 * 86400000 + now.getTime());
            expect(d.getTime()).to.be.at.least(-31 * 86400000 + now.getTime());
            done();
        });

        it('should be possible to add 2 months to a date which is an end of year', function(done){
            var now = new Date(2014, 10, 17); // Nov 17, 2014
            var d = jmcDate.addMonths(now, 2);
            log.debug('d + 2 months is "%s"', d);
            expect(d.getMonth()).to.equal(0); // Jan
            expect(d.getDate()).to.equal(17);
            done();
        });
    });
});