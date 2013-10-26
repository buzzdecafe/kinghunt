module.exports = function(config) {

  config.set({

    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/lib/jquery/*.js',
      'app/lib/chess/**/*.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],
    autoWatch: true,
    browsers: ['Firefox', 'Chrome'],
    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
    logLevel: config.LOG_DEBUG

  });

};