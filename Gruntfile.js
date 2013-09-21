module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['app/js/*.js', 'test/e2e/*.js', 'test/unit/*.js'],
      options: {
        globalstrict: true,
        browser: true,
        globals: {
          jQuery: true,
          Chess: true,
          ChessBoard: true,
          angular: true,
          describe: true,
          it: true,
          xit: true,
          inject: true,
          module: true,
          element: true,
          expect: true,
          beforeEach: true,
          browser: true
        }
      }
    },

    jasmine : {
      src : 'app/**/*.js',
      options : {
        specs : 'test/unit/**/*.js',
      }
    },

    compress: {
      main: {
        options: {
          archive: 'build/kinghunt.zip'
        },
        files: [
          {src: ['app/**', 'VERSION', 'manifest.webapp']}, // includes files in path and its subdirs
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('build', ['compress:main']);
};
      
