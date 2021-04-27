/* jshint expr:true*/
'use strict';

/**
 * Unit test file for testing the HtmlTemplate module
 * Author : Jean-Marc Collin
 */

/* Module dependencies */
const
    log4js = require('log4js'),
    jsonLayout = require('log4js-json-layout');
log4js.addLayout('json', jsonLayout);

var expect = require('chai').expect; // jshint ignore:line
var assert = require('assert'); // jshint ignore:line
var log = require('log4js').getLogger('testu'),
    jmcnetHtmlTemplate = require('../js/jmcnetHtmlTemplate.js'),
    util = require('util');

// The tests
describe('<JMCNet HtmlTemplate Unit Test>', function () {
    before(function (done) {
        jmcnetHtmlTemplate.resetHtmlTemplates();
        done();
    });
    describe('Creating and retrieve a new html template from String', function (done) {
        var tpl;
        it('should be possible to create and retrieve a new HtmlTemplate from Stings', function (done) {
            log.debug('Test create and retrieve a HtmlTemplate from String');
            tpl = new jmcnetHtmlTemplate.HtmlTemplate('template1', '<%- text %> templated.');
            expect(tpl).to.exist;
            done();
        });
           
        it('Should be possible to render', function(done){
            var result = tpl.render({ text : 'The text'});
            expect(result).to.equal('The text templated.');
            done();
        });
    });
    
    describe('Syntax error handling', function(){
         var tpl;
        it('should not be possible to create and retrieve a new HtmlTemplate from Strings with syntax error', function (done) {
            log.debug('Test create and retrieve a HtmlTemplate from String with syntax error');
            try {
                tpl = new jmcnetHtmlTemplate.HtmlTemplate('template1', '<%- text % > wrong templated.');
                expect('We should not be there').to.not.exist;
            }
            catch(e) {
                log.debug('Error in compile is "%s"', util.inspect(e));
                console.log(util.inspect(e));
            }
            expect(tpl).to.not.exist;
            done();
        });          
    });
});
           
           
            