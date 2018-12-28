'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    argv = require('yargs').argv,
    env = require('gulp-env'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    istanbul = require('gulp-istanbul'),
//	debug = require('gulp-debug'),
//	nodeInspector = require('gulp-node-inspector'),
    del = require('rimraf'),
    _ = require('lodash');

//var util = require('util');

var paths = {
    jsServer: ['js/**/*.js'],
    jsTestuPkg: ['test/**/*.js']
};

var environment;

var beep = function(){
    gutil.beep();
};

var setEnv = function (newEnv) {
    env({
        vars: {
            NODE_ENV: newEnv,
            NODE_PATH: process.env.NODE_PATH,
            LOG4JS_CONFIG: 'log4js.json'
        }
    });
    environment = newEnv;
};

gulp.task('env-dev', function (done) {
    setEnv('development');
	done();
});

gulp.task('env-test', function (done) {
    setEnv('test');
	done();
});

gulp.task('watchTestu', function (done) {
    gulp.watch(_.union(paths.jsServer, paths.jsTestuPkg), { usePolling: true, interval: 100 }, 				gulp.series('jshintTestu', 'mochaTestu'));
	done();
});

gulp.task('watchCoverage', function () {
    gulp.watch(_.union(paths.jsServer, paths.jsTestuPkg), gulp.series('jshintTestu', 'openCoverage'));
});

gulp.task('jshintTestu', function(){
    return gulp.src(_.union(paths.jsServer, paths.jsTestuPkg))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error', beep);
});

gulp.task('mochaTestu', function () {
    console.log('Starting testu ...');
    return gulp.src(paths.jsTestuPkg, {
            read: false
        })
//		.pipe(debug())
        .pipe(mocha({
            reporter: 'spec',
            timeout: 10000,
			bail: argv.bail || false
        }))
        .on('error', beep) ;
});

gulp.task('instanbul-pre-test', function(){
    return gulp.src(paths.jsServer)
        .pipe(istanbul({ includeUntested : true }))
        .pipe(istanbul.hookRequire());
});

gulp.task('startCoverage', gulp.series('instanbul-pre-test', function(){
    return gulp.src(paths.jsTestuPkg)
    .pipe(mocha({timeout : 10000, reporter: 'spec', bail: argv.bail || false}))
    .on('error', beep)
    .pipe(istanbul.writeReports({
        dir : './coverage',
        reporters : [ 'lcov' ],
        reportOpts : { dir : './coverage' }
    }))
	/*.pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }))*/;
}));

gulp.task('cleanCoverage', function(done){
    del('./coverage/', done);
});

gulp.task('openCoverage', gulp.series('cleanCoverage', 'startCoverage', function(){
    require('child_process').exec('google-chrome ./coverage/lcov-report/index.html', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
}));

gulp.task('testu', gulp.series('env-test', 'mochaTestu', 'watchTestu', function (done) { done();}));
gulp.task('coverage', gulp.series('env-test', 'openCoverage', function(done) { done();}));

gulp.task('default', gulp.series('testu'));
