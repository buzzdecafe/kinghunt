'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.show = $location.path().match(/board/);
    $scope.$on('$locationChangeStart', function(e) {
      $scope.show = $location.path().match(/board/);
    });
  }]).
  controller('LoadCtrl', ['$scope', 'book', 'fenToObject', function($scope, book, fenToObject) {
    $scope.book = book;
  }]).
  controller('BoardCtrl', ['$scope', '$route', 'book', '$routeParams', 'fenToObject', function($scope, $route, book, $routeParams, fenToObject) {
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
      if (game.in_checkmate() === true && remaining >= 0) {
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
          opponentMove();
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

    // handle boardNav events
    $scope.$on('board/prevProblem', function() {
      console.log("get previous problem!");
    });
    $scope.$on('board/nextProblem', function() {
      console.log("get next problem!");
    });
    $scope.$on('board/undo', function() {
      var move = game.undo();
      if (move) {
        console.log('UNDO');
        board.position(game.fen());
        //TODO: rollback status and goal text
      } else {
        console.log('UNDO FAIL');
      }
    });
    $scope.$on('board/reload', function() {
      console.log('RELOAD');
      $route.reload();
    });
  }]).
  controller('AboutCtrl', ['$scope', 'version', 'credits',  function($scope, version, credits) {
    $scope.year = (new Date()).getFullYear();
    $scope.version = version;
    $scope.credits = credits;
  }]);
