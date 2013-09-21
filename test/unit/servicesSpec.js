'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('kinghunt.services'));


  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.0.1');
    }));
  });

  describe('ChessBoard', function() {
    xit('should return a ChessBoard object', inject(function(ChessBoard) {
        expect(ChessBoard instanceof ChessBoard).toBe(true);
    }));
  });

  describe('bookSvc', function() {
    it('should return an object with correct interface', inject(function(bookSvc) {
      expect(bookSvc instanceof Object).toBe(true);
      expect(bookSvc.getFenById instanceof Function).toBe(true);
      expect(bookSvc.getNext instanceof Function).toBe(true);
      expect(bookSvc.getPrev instanceof Function).toBe(true);
      expect(bookSvc.book instanceof Object).toBe(true);

      describe('book object', function() {
        var book = bookSvc.book;
        it('has the following attributes: title, author, year, fen', function() {
          expect(book.title).toBeDefined();
          expect(book.year).toBeDefined();
          expect(book.problems instanceof Array).toBe(true);
        });
      });

      describe('fen object', function() {
        var book = bookSvc.book;
        it('has attributes: id, stipulation, position', function() {
          var problem = book.problems[0];
          expect(problem.id).toBeDefined();
          expect(problem.stipulation).toBeDefined();
          expect(problem.fen).toBeDefined();
          expect(problem.author).toBeDefined();
        });
      });
    }));
  });

  describe('gameSvc', function() {
    it('should return an object with correct interface', inject(function(gameSvc) {
      expect(gameSvc.fenToObject instanceof Function).toBe(true);

      describe('fenToObject', function() {
        if("converts a FEN string to an object", function() {
          expect(fenToObject("7n/3NR3/1P3p2/1p1kbN1B/1p6/1K6/6b1/1Q6 w - - 0 1")).toEqual(
              {
                position: "7n/3NR3/1P3p2/1p1kbN1B/1p6/1K6/6b1/1Q6",
                turn: "w",
                castle: "-",
                enpassant: "-",
                ply: "0",
                move: "1"
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
