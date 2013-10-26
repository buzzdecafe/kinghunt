'use strict';

/* Controllers */

angular.module('kinghunt.controllers').
    controller('AboutCtrl', ['$scope', 'version', 'credits',  function($scope, version, credits) {
      $scope.year = (new Date()).getFullYear();
      $scope.version = version;
      $scope.credits = credits;
    }]);

