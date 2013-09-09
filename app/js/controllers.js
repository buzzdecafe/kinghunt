'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('LoadCtrl', ['$scope', 'book', function($scope, book) {
    $scope.book = book;
  }]).
  controller('BoardCtrl', ['$scope', '$location', function($scope, $location) {
    var game = new Chess();
    $scope.fen = $location.search().fen;
    $scope.board = new ChessBoard('board', $scope.fen);
  }]).
  controller('AboutCtrl', ['$scope', 'version', 'credits',  function($scope, version, credits) {
    $scope.version = version;
    $scope.credits = credits;
  }]);
