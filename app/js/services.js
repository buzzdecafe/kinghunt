'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kinghunt.services', []).
  value('version', '0.1.0').
  value('credits', [
    {name: 'chess.js', url: 'https://github.com/jhlywa/chess.js'},
    {name: 'chessboardjs', url: 'https://github.com/oakmac/chessboardjs'},
    {name: 'Yet Another Chess Problem Database', url: 'http://www.yacpdb.org/'}
  ]).
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
  }]).
  factory('storageSvc', ['$window', '$q', function($window, $q) {
    var request = $window.indexedDB.open("KingHunt");
    var db;
    var storageSvc;
    var readyDfd = $q.defer();
    var readyPromise = readyDfd.promise;

    // initialization
    request.onerror = function(event) {
      readyDfd.reject();
    };
    request.onsuccess = function(event) {
      db = request.result;
      readyDfd.resolve();
    };
    request.onupgradeneeded = function(evt) {};

    storageSvc = {
      ready: function(fn) {
        return readyPromise.then(fn);
      },

      getBook: function() {

      },

      setBook: function(book) {

      },

      getSolved: function(id) {

      },

      markSolved: function(id, value) {

      }
    };

    // CRUD


    return storageSvc;
  }]).
  factory("bookSvc", ['storageSvc', function(storageSvc) {

      var bookSvc = {};
      var bookId = '';
      var book = {};
      var solved = {};
      var skipSolved = false;
      var dbDfd = $q.defer();
      var dbPromise = dbDfd.promise;
      var bookDfd = $q.defer();
      var bookPromise = bookDfd.promise;
      var solveDfd = $q.defer();
      var solvePromise = solveDfd.promise;
      var readyPromise = $q.all([dbPromise, bookPromise, solvePromise]);

      var request = $window.indexedDB.open("KingHunt", 1);
      var db;

      request.onsuccess = function(event) {
        db = request.result;
        // when all promises are resolved then:
        dbDfd.resolve();
      };

      // initialization
      request.onerror = function(event) {
        dbDfd.reject(event);
      };

      request.onupgradeneeded = function(event) {
        if(!db.objectStoreNames.contains("book")) {
          thisDB.createObjectStore("book");
        }
        if(!db.objectStoreNames.contains("solved")) {
          thisDB.createObjectStore("solved", {keypath: "bookId"});
        }
      };

      dbPromise.then(function() {
        var bookXact = db.transaction(["book"], "readonly");
        var solvedXact = db.transaction(["solved"], "readonly");
        // load the book
        solvedXact.objectStore("book").get(bookId).onsuccess(function(e) {
          book = e.target.result;
          bookDfd.resolve();
        });

        // load the solved object
        solvedXact.objectStore("solved").get(bookId).onsuccess(function(e) {
          solved = e.target.result;
          solveDfd.resolve();
        });
      });


      // TODO: initialize book


      // TODO: initialize solved

      readyPromise.then(function() {
        bookSvc =  {

          getFenById: function(id) {
            var problems = book.problems;
            var i, flen;
            for (i = 0, flen = problems.length; i < flen; i++) {
              if (problems[i].id === id) {
                return problems[i];
              }
            }
          },

          getNext: function(id) {
            var problems = book.problems;
            var i, flen;
            for (i = 0, flen = problems.length; i < flen; i++) {
              if (problems[i].id === id) {
                return (problems[i + 1]) ? problems[i + 1] : null;
              }
            }
          },

          getPrev: function(id) {
            var problems = book.problems;
            var i, flen;
            for (i = 0, flen = problems.length; i < flen; i++) {
              if (problems[i].id === id) {
                return (problems[i - 1]) ? problems[i - 1] : null;
              }
            }
          },

          setSkipSolved: function(value) {
            skipSolved = value;
          },

          getSkipSolved: function() {
            return skipSolved;
          },

          toggleSkipSolved: function() {
            skipSolved = !skipSolved;
          },

          setBook: function(newBook) {
            book = newBook;
          },

          // TODO: unstub; move to indexedDB
          loadSolved: function(s) {
            solved = s;
          },

          isSolved: function(id) {
            return solved[id];
          },

          // TODO: unstub
          markSolved: function(id, value) {
            if (value) { solved[id] = value; }
            else { delete solved[id]; }
          }
        }

      });

      return bookSvc;
    }]);

