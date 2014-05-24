'use strict';

var paths = {
    js: ['js/**/*.js'],
    html: [],
    css: []
};

module.exports = function(grunt) {

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['public/build'],
        focus: {
            sources: {
                include: ['js', 'html', 'css', 'grunt']
            },
            testu: {
                include: ['js', 'html', 'css', 'testu', 'grunt']
            },
            testi: {
                include: ['js', 'html', 'css', 'testu', 'testi', 'grunt']
            }
        },
        watch: {
            js: {
                files: paths.js,
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: paths.html,
                options: {
                    livereload: true
                }
            },
            css: {
                files: paths.css,
                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            },
            testu: {
                files: ['test/**/*.js', 'js/**/*.js'],
                tasks: ['mochaTest'],
                options: {}
            },
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        },
        jshint: {
            all: {
                src: paths.js,
                options: {
                    jshintrc: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: '<%= assets.js %>'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: paths.css
        },
        cssmin: {
            combine: {
                files: '<%= assets.css %>'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['clean','cssmin', 'uglify', 'concurrent']);
    } else {
        grunt.registerTask('default', ['clean','jshint', 'csslint', 'concurrent']);
    }

    //Test task.
    grunt.registerTask('testu', ['env:test', 'mochaTest', 'focus:testu']);
};
