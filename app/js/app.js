'use strict';


// Declare app level module which depends on filters, and services
angular.module('kinghunt', ['kinghunt.filters', 'kinghunt.services', 'kinghunt.directives', 'kinghunt.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/load', {
        templateUrl: 'partials/load.html',
        controller: 'LoadCtrl'
    });
    $routeProvider.when('/board/:id', {
        templateUrl: 'partials/board.html',
        controller: 'BoardCtrl'
    });
    $routeProvider.when('/about', {
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl'
    });
    $routeProvider.otherwise({
        redirectTo: '/load'
    });
  }]).
  config( ['$compileProvider', function( $compileProvider ) {   
      // whitelist 'app:/' protocol or angular will label it "unsafe":
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);
    }
  ]);

