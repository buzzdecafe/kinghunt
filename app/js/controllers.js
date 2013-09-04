'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('LoadCtrl', [function() {

  }])
  .controller('BoardCtrl', ['$scope', 'ChessBoard',  function($scope, board) {
    $scope.board = board;
  }]);
