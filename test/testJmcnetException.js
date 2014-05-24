'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'); // jshint ignore:line
var jmcnet = require('../js/jmcnetException.js'),
    _ = require('lodash');

// Globals
//var ex1, ex2, ex3;

// The tests
describe('<JMCNet Exception Unit Test>', function () {
    describe('BaseException manipulation :', function () {
        before(function (done) {
            done();
        });

        describe('Instanciate', function () {
            var ex1, ex2, ex3;
            before (function (done) {
                ex1 = new jmcnet.BaseException();
                ex2 = new jmcnet.BaseException('This is the message', ['param1', 'param2']);
                ex3 = new jmcnet.BaseException('This is the message', 'param3');
                done();
            });
            it('should have a default base exception', function (done) {
                expect(ex1.name).to.be(jmcnet.BASE_EXCEPTION_NAME);
                expect(ex1.message).to.be('');
                expect(_.isEmpty(ex1.parameters)).to.be(true);
                done();
            });
            
            it('should have a base exception with message and parameters', function (done) {
                expect(ex2.name).to.be(jmcnet.BASE_EXCEPTION_NAME);
                expect(ex2.message).to.be('This is the message');
                expect(_.isEmpty(ex2.parameters)).to.be(false);
                expect(ex2.parameters).to.eql(['param1', 'param2']);
                done();
            });
            
            it('should have a base exception with message and one parameter', function (done) {
                expect(ex3.name).to.be(jmcnet.BASE_EXCEPTION_NAME);
                expect(ex3.message).to.be('This is the message');
                expect(_.isEmpty(ex3.parameters)).to.be(false);
                expect(ex3.parameters).to.eql(['param3']);
                done();
            });
        });
    });
    
    describe('TechnicalException manipulation :', function () {
        before(function (done) {
            done();
        });

        describe('Instanciate', function () {
            var ex1, ex2, ex3;
            before (function (done) {
                ex1 = new jmcnet.TechnicalException();
                ex2 = new jmcnet.TechnicalException('This is the message', ['param1', 'param2']);
                ex3 = new jmcnet.TechnicalException('This is the message', 'param3');
                done();
            });
            it('should have a default base exception', function (done) {
                expect(ex1.name).to.be(jmcnet.TECHNICAL_EXCEPTION_NAME);
                expect(ex1.message).to.be('');
                expect(_.isEmpty(ex1.parameters)).to.be(true);
                done();
            });

            it('should have a base exception with message and parameters', function (done) {
                expect(ex2.name).to.be(jmcnet.TECHNICAL_EXCEPTION_NAME);
                expect(ex2.message).to.be('This is the message');
                expect(_.isEmpty(ex2.parameters)).to.be(false);
                expect(ex2.parameters).to.eql(['param1', 'param2']);
                done();
            });
            
            it('should have a base exception with message and one parameter', function (done) {
                expect(ex3.name).to.be(jmcnet.TECHNICAL_EXCEPTION_NAME);
                expect(ex3.message).to.be('This is the message');
                expect(_.isEmpty(ex3.parameters)).to.be(false);
                expect(ex3.parameters).to.eql(['param3']);
                done();
            });
        });
    });
    
    describe('FunctionalException manipulation :', function () {
        before(function (done) {
            done();
        });

        describe('Instanciate', function () {
            var ex1, ex2, ex3;
            before (function (done) {
                ex1 = new jmcnet.FunctionalException();
                ex2 = new jmcnet.FunctionalException('This is the message', ['param1', 'param2']);
                ex3 = new jmcnet.FunctionalException('This is the message', 'param3');
                done();
            });
            it('should have a default base exception', function (done) {
                expect(ex1.name).to.be(jmcnet.FUNCTIONAL_EXCEPTION_NAME);
                expect(ex1.message).to.be('');
                expect(_.isEmpty(ex1.parameters)).to.be(true);
                done();
            });

            it('should have a base exception with message and parameters', function (done) {
                expect(ex2.name).to.be(jmcnet.FUNCTIONAL_EXCEPTION_NAME);
                expect(ex2.message).to.be('This is the message');
                expect(_.isEmpty(ex2.parameters)).to.be(false);
                expect(ex2.parameters).to.eql(['param1', 'param2']);
                done();
            });

            it('should have a base exception with message and one parameter', function (done) {
                expect(ex3.name).to.be(jmcnet.FUNCTIONAL_EXCEPTION_NAME);
                expect(ex3.message).to.be('This is the message');
                expect(_.isEmpty(ex3.parameters)).to.be(false);
                expect(ex3.parameters).to.eql(['param3']);
                done();
            });
        });
    });
});
