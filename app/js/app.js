'use strict';


// Declare app level module which depends on filters, and services
angular.module('kinghunt', ['kinghunt.filters', 'kinghunt.services', 'kinghunt.directives', 'kinghunt.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/load', {templateUrl: 'partials/load.html', controller: 'LoadCtrl'});
    $routeProvider.when('/board', {templateUrl: 'partials/board.html', controller: 'BoardCtrl'});
    $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'});
    $routeProvider.otherwise({redirectTo: '/load'});
  }]);
