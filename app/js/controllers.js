'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('LoadCtrl', [function() {

  }])
  .controller('BoardCtrl', ['$scope', function($scope) {
    $scope.board = new ChessBoard('board', 'start');
  }]);
