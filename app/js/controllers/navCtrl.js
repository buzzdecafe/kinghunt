'use strict';

/* Controllers */

angular.module('kinghunt.controllers').
    controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
      $scope.show = $location.path().match(/board/);
      $scope.$on('$locationChangeStart', function(e) {
        $scope.show = $location.path().match(/board/);
      });
    }]);
