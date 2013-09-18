'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.show = $location.path().match(/board/);
    $scope.$on('$locationChangeStart', function(e) {
      $scope.show = $location.path().match(/board/);
    });
  }]).
  controller('LoadCtrl', ['$scope', 'bookSvc', function($scope, bookSvc) {
    $scope.book = bookSvc.book;
  }]).
  controller('BoardCtrl', ['$scope', '$route', '$location', 'bookSvc', 'gameSvc', '$routeParams', function($scope, $route, $location, bookSvc, gameSvc, $routeParams) {
    var game = new Chess();
    var board;

    $scope.currentId = $routeParams.id;
    $scope.book = bookSvc.book;
    $scope.problem = bookSvc.getFenById($scope.currentId);
    $scope.goal = $scope.problem.stipulation;

    game.load($scope.problem.position);

    $scope.board = new ChessBoard('board', gameSvc.getBoardConfig($scope, game));
    $scope.status = gameSvc.getStatus(game);
    $scope.movesRemaining = +$scope.goal.substring(1);
    $scope.goalText = gameSvc.getGoalText(game, $scope.movesRemaining);

    // handle boardNav events
    $scope.$on('boardNav/prevProblem', function() {
      var prev = bookSvc.getPrev($scope.currentId);
      if (prev && prev.id) {
        $location.path('/board/' + prev.id);
      } else {
        $scope.status = "There is no previous problem!";
      }
      $scope.$apply();
    });
    $scope.$on('boardNav/nextProblem', function() {
      var next = bookSvc.getNext($scope.currentId);
      if (next && next.id) {
        $location.path('/board/' + next.id);
      } else {
        $scope.status = "There is no next problem!";
      }
      $scope.$apply();
    });
    $scope.$on('boardNav/undo', function() {
      var move = game.undo();
      if (move) {
        $scope.board.position(game.fen());
        //TODO: rollback status and goal text
      } else {
        $scope.status = "Failed to undo";
      }
      $scope.$apply();
    });
    $scope.$on('boardNav/reload', function() {
      $route.reload();
      $scope.$apply();
    });
  }]).
  controller('AboutCtrl', ['$scope', 'version', 'credits',  function($scope, version, credits) {
    $scope.year = (new Date()).getFullYear();
    $scope.version = version;
    $scope.credits = credits;
  }]);
