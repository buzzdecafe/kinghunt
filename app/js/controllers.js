'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('LoadCtrl', ['$scope', 'book', 'fenToObject', function($scope, book, fenToObject) {
    $scope.book = book;
  }]).
  controller('BoardCtrl', ['$scope', 'book', '$routeParams', 'fenToObject', function($scope, book, $routeParams, fenToObject) {
    var game = new Chess();
    var board;
    var getStatus = function() {
      var moveColor = (game.turn() === 'b') ? "Black" : 'White';
      var status = "";
      if (game.in_checkmate() === true) {
        status = 'Game over: ' + moveColor + ' is checkmated.';
      } else if (game.in_draw() === true) {
        status = 'Game over: Drawn.';
      } else {
        status = moveColor + ' to move';

        if (game.in_check() === true) {
          status += ', ' + moveColor + ' is in check';
        }
      }
      return status;
    };

    var getGoalText = function(remaining) {
      var txt = "";
      if (game.in_checkmate() === true && remaining >= 1) {
        return "Problem solved! Well done.";
      } else if (remaining < 1) {
        return "Problem failed";
      } else {
        return (remaining >> 0) +  " moves remaining.";
      }
    };

    // TODO: put some logic here for somebody's sake
    var opponentMove = function() {
      if (game.game_over()) {
        return;
      }
      var moves = game.moves();
      var move = moves[Math.floor(Math.random() * moves.length)];
      game.move(move);
      board.position(game.fen());
      $scope.status = getStatus();
      $scope.$apply();
    };



    $scope.currentId = $routeParams.id;
    $scope.book = book;
    $scope.problem = book.getFenById($scope.currentId);
    $scope.goal = $scope.problem.stipulation;

    var boardConf = {
      position: $scope.problem.position,
      draggable: true,
      onDragStart: function(source, piece, position, orientation) {
        var turn = game.turn();
        if (game.game_over() === true ||
            (turn === 'w' && piece.search(/^b/) === 0) ||
            (turn === 'b' && piece.search(/^w/) === 0)) {
          return false;
        }
      },
      onDrop: function(source, target) {
        // see if the move is legal
        var move = game.move({
          from: source,
          to: target,
          promotion: 'q' // TODO: handle all promotions
        });

        // illegal move
        if (move === null) {
          return 'snapback';
        }
        $scope.status = getStatus();
        $scope.movesRemaining -= 0.5;
        $scope.goalText = getGoalText($scope.movesRemaining);


        $scope.$apply();
        if ($scope.mode === 'auto') {
          setTimeout(opponentMove, 500);
        }
      },
      onSnapbackEnd: function() {
        board.position(game.fen());
      }
    };

    game.load(boardConf.position);
    board = new ChessBoard('board', boardConf);

    $scope.status = getStatus();
    $scope.movesRemaining = +$scope.goal.substring(1);
    $scope.goalText = getGoalText($scope.movesRemaining);
    $scope.board = board;
  }]).
  controller('AboutCtrl', ['$scope', 'version', 'credits',  function($scope, version, credits) {
    $scope.year = (new Date()).getFullYear();
    $scope.version = version;
    $scope.credits = credits;
  }]);
