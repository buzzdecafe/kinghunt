'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('kinghunt.services'));

  var testFen2 = "3N4/7r/N2p4/1p1k1p2/4qP2/1KB3P1/Q5B1/2b5  w - - 0 1";
  var testFen3 = "5B2/8/6p1/3P4/1Npk1p2/n3N2B/5Q2/5K2  w - - 0 1";

  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1.0');
    }));
  });

  describe('bookSvc', function() {

    it('should return an object with correct interface', inject(function(bookSvc) {
      expect(bookSvc instanceof Object).toBe(true);
      expect(bookSvc.getBook instanceof Function).toBe(true);
      expect(bookSvc.getFenById instanceof Function).toBe(true);
      expect(bookSvc.getNext instanceof Function).toBe(true);
      expect(bookSvc.getPrev instanceof Function).toBe(true);
      expect(bookSvc.getProblems instanceof Function).toBe(true);
      expect(bookSvc.getSolved instanceof Function).toBe(true);
      expect(bookSvc.isSolved instanceof Function).toBe(true);
      expect(bookSvc.loadBook instanceof Function).toBe(true);
      expect(bookSvc.markSolved instanceof Function).toBe(true);

      describe('book object', function() {
        var book = bookSvc.getBook();
        it('has the following attributes: title, author, year, fen', function() {
          expect(book.title).toBeDefined();
          expect(book.year).toBeDefined();
          expect(book.problems instanceof Array).toBe(true);
        });
      });

      describe('fen object', function() {
        var book = bookSvc.getBook();
        it('has attributes: id, stipulation, position', function() {
          var problem = book.problems[0];
          expect(problem.id).toBeDefined();
          expect(problem.stipulation).toBeDefined();
          expect(problem.fen).toBeDefined();
          expect(problem.author).toBeDefined();
        });
      });

      describe("solved interface", function() {

        beforeEach(function() {
          delete bookSvc.getSolved().test;
        });

        describe('isSolved', function() {
          it("reports the T|F status of a problem", function() {
            expect(bookSvc.isSolved("test")).toBeFalsy(); // should be undef
            bookSvc.markSolved("test", true);
            expect(bookSvc.isSolved("test")).toBe(true);
          });
        });

        describe('markSolved', function() {
          it("'true' value adds the id to the solved object", function() {
            bookSvc.markSolved("test", true);
            expect(bookSvc.isSolved("test")).toBe(true);
          });
          it("'false' value removes the entry from the solved db", function() {
            expect(bookSvc.isSolved("test")).toBeFalsy(); // should be undef
            bookSvc.markSolved("test", true);
            expect(bookSvc.isSolved("test")).toBe(true);
            bookSvc.markSolved("test", false);
            expect(bookSvc.isSolved("test")).toBeFalsy();
          });
        });
      });


    }));
  });

  describe('gameSvc', function() {
    it('should return an object with correct interface', inject(function(gameSvc) {

      expect(gameSvc.getGame instanceof Function).toBe(true);
      describe('getGame', function() {
        it("returns a Chess.js object", function() {
          var game = gameSvc.getGame();
          expect(game instanceof Object).toBe(true);
          expect(game.fen instanceof Function).toBe(true);  // it looks like a duck
          expect(game.undo instanceof Function).toBe(true); // it walks like a duck
          expect(game.moves() instanceof Array).toBe(true); // it quacks like a duck
                                                            // it's a duck
        });
        it("always returns the same game object (it's a singleton)", function() {
          var game1 = gameSvc.getGame();
          var game2 = gameSvc.getGame();
          var game3 = gameSvc.getGame();
          expect(game1).toBe(game2);
          expect(game2).toBe(game3);
          // and so by the transitive property ....
          expect(game1).toBe(game3);
        });
      });

      expect(gameSvc.getMovesRemaining instanceof Function).toBe(true);
      describe('getMovesRemaining', function() {
        var game = gameSvc.getGame();
        var getMovesRemaining = gameSvc.getMovesRemaining;
        var goalMoves = 3;
        var moves;

        game.load(testFen3);
        expect(getMovesRemaining(goalMoves)).toBe(3);

        moves = game.moves();
        game.move(moves[Math.floor(Math.random() * moves.length)]);
        expect(getMovesRemaining(goalMoves)).toBe(2);

        moves = game.moves();
        game.move(moves[Math.floor(Math.random() * moves.length)]);
        expect(getMovesRemaining(goalMoves)).toBe(2);

        moves = game.moves();
        game.move(moves[Math.floor(Math.random() * moves.length)]);
        expect(getMovesRemaining(goalMoves)).toBe(1);

        game.undo();
        expect(getMovesRemaining(goalMoves)).toBe(2);

        game.undo();
        expect(getMovesRemaining(goalMoves)).toBe(2);

        game.undo();
        expect(getMovesRemaining(goalMoves)).toBe(3);
      });

      expect(gameSvc.getStatus instanceof Function).toBe(true);

      describe('getStatus', function() {
        it("returns a status object", function() {
          var goalMoves = 2;
          var game = gameSvc.getGame();
          game.load(testFen2);

          // case: JUST STARTED
          expect(gameSvc.getStatus(goalMoves)).toEqual({
            turn: 'w',
            situation: ' to move',
            progress: '(2 to go)'
          });

          // case: IN PROGRESS
          game.move("Qe2");
          expect(gameSvc.getStatus(goalMoves)).toEqual({
            turn: 'b',
            situation: ' to move',
            progress: '(1 to go)'
          });

          game.move("Qxg2");
          expect(gameSvc.getStatus(goalMoves)).toEqual({
            turn: 'w',
            situation: ' to move',
            progress: '(1 to go)'
          });

          // case: FAILED
          game.move("Qf2"); // wow--bad move!
          expect(gameSvc.getStatus(goalMoves)).toEqual({
            turn: 'b',
            situation: ' to move',
            progress: 'FAILED'
          });

          // case: SOLVED
          game.undo();
          expect(gameSvc.getStatus(goalMoves)).toEqual({
            turn: 'w',
            situation: ' to move',
            progress: '(1 to go)'
          });

          game.move("Qd3#"); // that's better
          expect(gameSvc.getStatus(goalMoves)).toEqual({
            turn: 'b',
            situation: ' checkmated',
            progress: 'SOLVED'
          });
        });
      });

      expect(gameSvc.getBoardConfig instanceof Function).toBe(true);
      describe('getBoardConfig', function() {
        var scope = {
          problem: {
            fen: testFen2
          }
        };
        var config = gameSvc.getBoardConfig(scope);
        var game = gameSvc.getGame();
        it("returns a configuration object for ChessBoard.js object", function() {
          expect(config.position).toBe(scope.problem.fen);
          expect(config.draggable).toBe(true);
          expect(config.onDragStart instanceof Function).toBe(true);
          expect(config.onDrop instanceof Function).toBe(true);
          expect(config.onSnapbackEnd instanceof Function).toBe(true);
        });
      });

      expect(gameSvc.fenToObject instanceof Function).toBe(true);
      describe('fenToObject', function() {
        it("converts a FEN string to an object", function() {
          expect(gameSvc.fenToObject(testFen2)).toEqual(
              {
                position: "3N4/7r/N2p4/1p1k1p2/4qP2/1KB3P1/Q5B1/2b5",
                turn: "w",
                castle: "-",
                enpassant: "-",
                halfmove: "0",
                fullmove: "1"
              }
          );
        });
      });
    }));
  });

  describe('credits', function() {
    it('returns an array of name:url tuples', inject(function(credits){
      expect(credits).toEqual([
        {name: 'chess.js', url: 'https://github.com/jhlywa/chess.js'},
        {name: 'chessboardjs', url: 'https://github.com/oakmac/chessboardjs'},
        {name: 'Yet Another Chess Problem Database', url: 'http://www.yacpdb.org/'}
      ]);
    }));

  });
});
