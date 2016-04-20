'use strict';
// wrapper function that exposes the grunt instance
module.exports = function(grunt) {
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // DIRS=========================================================
    var BUILD_DIR = './public/';
    var BUILD_DIR_IMAGES = BUILD_DIR + 'images/';
    var BUILD_DIR_JS = BUILD_DIR + 'javascripts/';
    var BUILD_DIR_MIN_JS = BUILD_DIR + 'min_javascripts/';
    var BUILD_DIR_LESS = BUILD_DIR + 'less/';
    var BUILD_DIR_CSS = BUILD_DIR + 'stylesheets/';
    // FILES=========================================================
    var BUILD_FILES_JS = BUILD_DIR_JS + '*.js';
    var BUILD_FILES_LESS = BUILD_DIR_LESS + '*.less';
    var BUILD_FILES_CSS = BUILD_DIR_CSS + '*.css';
    // =========================================================
    var AP_BROWSERS = ['Android 2.3', 'Android >= 4', 'Chrome >= 20', 'Firefox >= 24', // Firefox 24 is the latest ESR
        'Explorer >= 8', 'iOS >= 6', 'Opera >= 12', 'Safari >= 6'
    ];
    var jsVendorSourceFiles = [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
    ];
    var myFILES = [
        "./public/javascripts/libs.js",
        "./public/javascripts/general.js",
        "./public/javascripts/graphs.js",
        "./public/javascripts/gyroscope_controller.js",
        "./public/javascripts/index.js",
        "./public/javascripts/keyboard_controller.js",
        "./public/javascripts/speech_controller.js",
        "./public/stylesheets/style.css"
    ];
    // =========================================================
    // configure the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        asciify: {
            banner: {
                text: '<%= pkg.name %> ',
                options: {
                    font: 'doom',
                    log: true
                },
            },
        },
	// =============================================
	// =            Core Tasks                     =
	// =============================================
        // copy files into dist directory
        copy: {
            bootstrap_fonts: {
                files: [{
                    expand: true,
                    cwd: './node_modules/bootstrap/fonts/',
                    src: ['**'],
                    dest: BUILD_DIR + 'fonts'
                }, ],
            },
        },
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
                sourceMap: true,
            },
            js: {
                src: jsVendorSourceFiles,
                dest: myFILES[0],
            }
        },
        less: {
            development: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
                    compress: true,
                    cleancss: false,
                    sourceMap: true,
                    sourceMapURL: './style.css.map',
                    sourceMapRootpath: '../../',
                },
                files: [{
                    expand: true,
                    cwd: BUILD_DIR_LESS,
                    src: ['*.less', '!_imports.less'],
                    dest: BUILD_DIR_CSS,
                    ext: '.css'
                }],
            },
        },
	/*=========================================
	=            Development Tasks            =
	=========================================*/
        watch: {
            stylesless: {
                options: {
                    livereload: true
                },
                files: [BUILD_FILES_LESS],
                tasks: ['less:development']
            },
            javascripts: {
                options: {
                    livereload: true
                },
                files: [BUILD_DIR_JS],
                tasks: ['uglify']
            },
        },
	/*==================================
	=            Production Tasks      =
	==================================*/
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
                sourceMap: true
            },
            my_code: {
                files: [{
                    expand: true,
                    cwd: BUILD_DIR_JS,
                    src: ['**/*.js', '!libs/*.js'],
                    dest: BUILD_DIR_MIN_JS,
                }],
            },
            libs: {
                files: [{
                    expand: true,
                    cwd: './public/javascripts/libs',
                    src: ['**/*.js'],
                    dest: './public/min_javascripts/libs',
                }],
            },
        },
        autoprefixer: {
            options: {
                browsers: AP_BROWSERS
            },
            build: {
                expand: true,
                cwd: BUILD_DIR,
                src: ['css/*.css'],
                dest: BUILD_DIR
            }
        },
        imageEmbed: {
            options: {
                deleteAfterEncoding: false,
                preEncodeCallback: function(filename) {
                    return true;
                },
            },
            dist: {
                files: {
                    BUILD_DIR_CSS: BUILD_DIR_CSS,
                },
            },
        },
        clean: {
            production: {
                src: ['./public/min_javascripts/*.map', './public/min_javascripts/libs/*.map', './public/stylesheets/*.map'],
            },
        },
    });
    grunt.registerTask('javascripts', ['concat', 'uglify']);
    grunt.registerTask('css', ['copy', 'less']);
    grunt.registerTask('production', ['asciify', 'css', 'javascripts', 'autoprefixer', 'clean']);
    grunt.registerTask('development', ['asciify', 'css', 'javascripts', 'watch']);
};
