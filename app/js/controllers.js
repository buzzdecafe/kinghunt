'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('LoadCtrl', ['$scope', 'book', function($scope, book) {
    $scope.book = book;
  }]).
  controller('BoardCtrl', ['$scope', '$location', 'ChessBoard',  function($scope, $location, board) {
    var game = new Chess();
    $scope.board = board;
    $scope.fen = $location.search().fen;

    $scope.board.position($scope.fen);
  }]).
  controller('AboutCtrl', ['$scope', 'version', 'credits',  function($scope, version, credits) {
    $scope.version = version;
    $scope.credits = credits;
  }]);
