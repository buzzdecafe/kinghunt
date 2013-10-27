'use strict';

/* Controllers */

angular.module('kinghunt.controllers').
    controller('BoardCtrl', ['$scope', '$route', '$location', 'bookSvc', 'gameSvc', '$routeParams',
      function($scope, $route, $location, bookSvc, gameSvc, $routeParams) {
        var game = gameSvc.getGame();
        var board;

        $scope.setStatus = function(status) {
          $scope.status = status;
          // side effects:
          if (status.progress === "SOLVED") {
            bookSvc.markSolved($scope.currentId, true);
          } else if (status.progress === "FAILED") {
            bookSvc.markSolved($scope.currentId, false);
          }
        };

        $scope.pieces = ['q', 'r', 'b', 'n'];
        $scope.currentId = $routeParams.id;
        $scope.book = bookSvc.getBook();
        $scope.problem = bookSvc.getFenById($scope.currentId);
        $scope.goal = $scope.problem.stipulation;
        $scope.goalMoves = +$scope.goal.substr(1); // TODO: handle more cases

        game.load($scope.problem.fen);

        $scope.board = new ChessBoard('board', gameSvc.getBoardConfig($scope));
        $scope.setStatus(gameSvc.getStatus($scope.goalMoves));

        //--------------------------------------------------------------
        // handle boardNav events
        $scope.$on('boardNav/prevProblem', function() {
          var prev = bookSvc.getPrev($scope.currentId);
          if (prev && prev.id) {
            $location.path('/board/' + prev.id);
          } else {
            $scope.status.situation = "No previous problem";
          }
          $scope.$apply();
        });

        $scope.$on('boardNav/nextProblem', function() {
          var next = bookSvc.getNext($scope.currentId);
          if (next && next.id) {
            $location.path('/board/' + next.id);
          } else {
            $scope.status.situation = "No next problem";
          }
          $scope.$apply();
        });

        $scope.$on('boardNav/undo', function() {
          var move = game.undo();
          if (move) {
            $scope.board.position(game.fen());
            $scope.status = gameSvc.getStatus($scope.goalMoves);
          } else {
            $scope.status.situation = "Failed to undo";
          }
          $scope.$apply();
        });

        $scope.$on('boardNav/reload', function() {
          $route.reload();
          $scope.$apply();
        });

      }
    ]);

