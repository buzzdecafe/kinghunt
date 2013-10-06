'use strict';

angular.module('kinghunt.services').
  factory('gameSvc', [function() {
    var gameObj = (function() {
      var game;

      return {
        getGame: function() {
          if  (!game) {
            game = new Chess();
          }
          return game;
        },

        getMovesRemaining: function(goalMoves) {
          // TODO: at present, only for "w to play & mate" scenarios; expand for more scenarios
          var fenObj = gameObj.fenToObject(game.fen());
          var remaining = goalMoves - fenObj.fullmove;
          return (fenObj.turn === 'w') ? remaining + 1 : remaining;
        },

        getStatus: function(goalMoves) {
          var moveColor = game.turn();
          var isMate = game.in_checkmate();
          var remaining = gameObj.getMovesRemaining(goalMoves);
          var status = {
            turn: moveColor,
            situation: "",
            progress: ""
          };

          if (isMate) {
            status.situation = ' checkmated';
          } else if (game.in_draw()) {
            status.situation = ' Drawn';
            status.progress = 'FAILED';
          } else if (game.in_check() === true) {
            status.situation = ' is in check';
          } else {
            status.situation = ' to move';
          }

          if (isMate && remaining >= 0) {
            status.progress = "SOLVED";
          } else if (remaining < 1) {
            status.progress = "FAILED";
          } else {
            status.progress = "(" + remaining +  " to go)";
          }
          return status;
        },

        isPromotable: function(source, target, pce, newPos, oldPos, colorMoving) {
          var color = pce.substr(0, 1);
          var piece = pce.substr(1);
          var fromFile = source.charCodeAt(0);
          var toFile = target.charCodeAt(0);
          var fromRank = source.substr(1);
          var toRank = target.substr(1);

          var isToLastRank = (color === 'b') ?
              fromRank === "2" && toRank === "1" :
              fromRank === "7" && toRank === "8";

          // there must be an opposing piece on the landing square, and it must be one file over
          function isPawnCapture() {
            var landingPiece = oldPos[target];
            var diffFile = Math.abs(fromFile - toFile) === 1;
            return landingPiece && landingPiece.substr(0, 1) !== color && diffFile;
          }

          return piece === 'P' && isToLastRank && ((fromFile === toFile) || isPawnCapture());
        },

        promote: function(scope, moveCfg, color) {
          var promise = scope.overlay.open(color);
          promise.then(function(piece) {
            var move;
            moveCfg.promotion = piece;
            move = game.move(moveCfg);
            // illegal move
            if (move === null) {
              game.undo();
              return 'snapback';
            }

            scope.board.position(gameObj.fenToObject(game.fen()).position);
            scope.setStatus(gameObj.getStatus(scope.goalMoves));
          });
        },

        getBoardConfig: function(scope) {
          return {
            position: scope.problem.fen,
            draggable: true,
            onDragStart: function(source, piece, position, orientation) {
              var turn = game.turn();
              if (game.game_over() === true ||
                  (turn === 'w' && piece.search(/^b/) === 0) ||
                  (turn === 'b' && piece.search(/^w/) === 0)) {
                return false;
              }
            },
            onDrop: function(source, target, piece, newPos, oldPos, colorMoving) {
              var moveCfg = {
                from: source,
                to: target
              };

              var move;

              if (gameObj.isPromotable(source, target, piece, newPos, oldPos, colorMoving)) {
                gameObj.promote(scope, moveCfg, piece.charAt(0));
              } else {
                // TODO: DRY this up
                move = game.move(moveCfg);
                // illegal move
                if (move === null) {
                  return 'snapback';
                }

                scope.setStatus(gameObj.getStatus(scope.goalMoves));
                scope.$apply();
              }
            },

            onSnapbackEnd: function() {
              scope.board.position(game.fen());
            }
          };
        },

        fenToObject: function(fen) {
          var parts = fen.split(/\s+/);
          return {
            position: parts[0],
            turn: parts[1] || 'w',
            castle: parts[2] || '-',
            enpassant: parts[3] || '-',
            halfmove: parts[4] || 0,
            fullmove: parts[5] || 1
          };
        }
      };
    }());

    return gameObj;
  }]);
