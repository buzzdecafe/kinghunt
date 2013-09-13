module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jasmine : {
      src : 'app/**/*.js',
      options : {
        specs : 'test/unit/**/*.js',
      }
    },
  });
     
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.registerTask('test', ['jasmine']);
};
      
