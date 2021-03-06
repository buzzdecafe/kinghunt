module.exports = function(config) {

  config.set({

    //logLevel: config.LOG_DEBUG,
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/lib/jquery/*.js',
      'app/lib/chess/**/*.js',
      'app/js/app.js',
      'app/js/controllers/controllers.js',
      'app/js/directives/directives.js',
      'app/js/services/services.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],
    autoWatch: true,
    browsers: ['PhantomJS', 'Firefox', 'Chrome'],
    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });

};