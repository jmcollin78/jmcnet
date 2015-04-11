'use strict';
/*jshint expr:true */

/**
 * Module dependencies.
 */
var expect = require('chai').expect; // jshint ignore:line
var jmcnetI18n = require('../js/jmcnetI18n.js');
var jmcnetResourceBundle = require('../js/jmcnetResourceBundle.js');

// The tests
describe('<JMCNet I18N Unit Test>', function () {
    it('should be possible to access jmnetI18n resource bundle', function () {
        var i18n = jmcnetResourceBundle.getBundle('jmcnetI18n');
        expect(i18n).to.exist;
        expect(i18n.getFiles().de).to.exist;
        expect(i18n.getFiles().fr).to.exist;
        expect(i18n.getFiles().en).to.exist;
    });

    it('should be poassible to get locale from a request', function () {
        expect(jmcnetI18n.getLocaleFromRequest({
            headers : {
                'accept-language' : 'fr-Fr;onsenfout;en-US'
            }
        })).to.equal('fr');
        expect(jmcnetI18n.getLocale()).to.equal('fr');
    });

    describe('French format', function () {
        before(function () {
            jmcnetI18n.setLocale('fr').setCurrencySymbol('€');
            expect(jmcnetI18n.getCurrencySymbol()).to.equal('€');
        });

        it('should be possible to format currency', function () {
            expect(jmcnetI18n.formatCurrency(123456, false)).to.equal('1.234,56&nbsp;€');
            expect(jmcnetI18n.formatCurrency(123456, true)).to.equal('1.234,56');
            expect(jmcnetI18n.formatCurrency(123400, true)).to.equal('1.234,00');
            expect(jmcnetI18n.formatCurrency(1234, false)).to.equal('12,34&nbsp;€');
            expect(jmcnetI18n.formatCurrency(1200, true)).to.equal('12,00');
        });

        it('should be possible to format float value', function () {
            expect(jmcnetI18n.formatFloatCent(123456, false)).to.equal('1.234,56');
            expect(jmcnetI18n.formatFloatCent(123456, true)).to.equal('1.234,56');
            expect(jmcnetI18n.formatFloatCent(123400, false)).to.equal('1.234');
            expect(jmcnetI18n.formatFloatCent(123400, true)).to.equal('1.234,00');
            expect(jmcnetI18n.formatFloatCent(1234, false)).to.equal('12,34');
        });

        it('should be possible to format percent value', function () {
            expect(jmcnetI18n.formatPercent(1234, false)).to.equal('12,34 %');
            expect(jmcnetI18n.formatPercent(1234, true)).to.equal('12,34 %');
            expect(jmcnetI18n.formatPercent(1200, false)).to.equal('12 %');
            expect(jmcnetI18n.formatPercent(1200, true)).to.equal('12,00 %');
        });

        it('should be possible to format a date', function () {
            var d = new Date(Date.parse('2015-04-11'));
            expect(jmcnetI18n.formatDate(d)).to.equal('11/04/2015');
        });
    });

    describe('English format', function () {
        before(function () {
            jmcnetI18n.setLocale('en');
            jmcnetI18n.setCurrencySymbol('$');
        });

        it('should be possible to format currency', function () {
            expect(jmcnetI18n.formatCurrency(123456, false)).to.equal('$&nbsp;1,234.56');
            expect(jmcnetI18n.formatCurrency(123456, true)).to.equal('1,234.56');
            expect(jmcnetI18n.formatCurrency(123400, true)).to.equal('1,234.00');
            expect(jmcnetI18n.formatCurrency(1234, false)).to.equal('$&nbsp;12.34');
        });

        it('should be possible to format float value', function () {
            expect(jmcnetI18n.formatFloatCent(123456, false)).to.equal('1,234.56');
            expect(jmcnetI18n.formatFloatCent(123456, true)).to.equal('1,234.56');
            expect(jmcnetI18n.formatFloatCent(123400, false)).to.equal('1,234');
            expect(jmcnetI18n.formatFloatCent(123400, true)).to.equal('1,234.00');
            expect(jmcnetI18n.formatFloatCent(1234, false)).to.equal('12.34');
        });

        it('should be possible to format percent value', function () {
            expect(jmcnetI18n.formatPercent(1234, false)).to.equal('12.34 %');
            expect(jmcnetI18n.formatPercent(1234, true)).to.equal('12.34 %');
            expect(jmcnetI18n.formatPercent(1200, false)).to.equal('12 %');
            expect(jmcnetI18n.formatPercent(1200, true)).to.equal('12.00 %');
        });

        it('should be possible to format a date', function () {
            var d = new Date(Date.parse('2015-04-11'));
            expect(jmcnetI18n.formatDate(d)).to.equal('04-11-2015');
        });
    });

    describe('German format', function () {
        before(function () {
            jmcnetI18n.setLocale('de');
            jmcnetI18n.setCurrencySymbol('DM-');
        });

        it('should be possible to format currency', function () {
            expect(jmcnetI18n.formatCurrency(123456, false)).to.equal('1.234,56&nbsp;DM-');
            expect(jmcnetI18n.formatCurrency(123456, true)).to.equal('1.234,56');
            expect(jmcnetI18n.formatCurrency(123400, true)).to.equal('1.234,00');
            expect(jmcnetI18n.formatCurrency(1234, false)).to.equal('12,34&nbsp;DM-');
        });

        it('should be possible to format float value', function () {
            expect(jmcnetI18n.formatFloatCent(123456, false)).to.equal('1.234,56');
            expect(jmcnetI18n.formatFloatCent(123456, true)).to.equal('1.234,56');
            expect(jmcnetI18n.formatFloatCent(123400, false)).to.equal('1.234');
            expect(jmcnetI18n.formatFloatCent(123400, true)).to.equal('1.234,00');
            expect(jmcnetI18n.formatFloatCent(1234, false)).to.equal('12,34');
        });

        it('should be possible to format percent value', function () {
            expect(jmcnetI18n.formatPercent(1234, false)).to.equal('12,34 %');
            expect(jmcnetI18n.formatPercent(1234, true)).to.equal('12,34 %');
            expect(jmcnetI18n.formatPercent(1200, false)).to.equal('12 %');
            expect(jmcnetI18n.formatPercent(1200, true)).to.equal('12,00 %');
        });

        it('should be possible to format a date', function () {
            var d = new Date(Date.parse('2015-04-11'));
            expect(jmcnetI18n.formatDate(d)).to.equal('11.04.2015');
        });
    });
});