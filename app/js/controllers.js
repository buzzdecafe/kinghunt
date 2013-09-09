'use strict';

/* Controllers */

angular.module('kinghunt.controllers', []).
  controller('LoadCtrl', ['$scope', 'book', function($scope, book) {
    $scope.book = book;
  }]).
  controller('BoardCtrl', ['$scope', '$location', 'fenFormat', function($scope, $location, fenFormat) {
    var game = new Chess();
    var board;
    var fen = fenFormat($location.search().fen);
    var statusElem = $("#statusElem"); // TODO: move to directive?
    var updateStatus = function() {
      var status = '';
      var moveColor = (game.turn() === 'b') ? "Black" : 'White';

      if (game.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
      } else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
      } else {
        status = moveColor + ' to move';

        if (game.in_check() === true) {
          status += ', ' + moveColor + ' is in check';
        }
      }
      statusElem.html(status);
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
    };
    var boardConf = {
      position: fen,
      draggable: true,
      onDragStart: function(source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) === 0) ||
            (game.turn() === 'b' && piece.search(/^w/) === 0)) {
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
        // TODO: fire event to update view
        updateStatus();
        setTimeout(opponentMove, 500);
      },
      onSnapbackEnd: function() {
        board.position(game.fen());
      }
    };

    game.load(boardConf.position);
    board = new ChessBoard('board', boardConf);

    $scope.fen = boardConf.position;
    $scope.board = board;
  }]).
  controller('AboutCtrl', ['$scope', 'version', 'credits',  function($scope, version, credits) {
    $scope.version = version;
    $scope.credits = credits;
  }]);
