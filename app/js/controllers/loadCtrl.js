'use strict';

/* Controllers */

angular.module('kinghunt.controllers').
    controller('LoadCtrl', ['$scope', 'bookSvc', function($scope, bookSvc) {
      $scope.book = bookSvc.getBook();
      $scope.solved = bookSvc.getSolved();

      $scope.hideProblem = function(problem) {
        return $scope.skipSolved && $scope.solved[problem.id];
      };
    }]);
