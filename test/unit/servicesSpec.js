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

  describe('book', function() {
    it('should return a book object', inject(function(book) {
      expect(book instanceof Object).toBe(true);

      describe('book object', function() {
        it('has the following attributes: title, author, year, fen', function() {
          expect(book.title).toBeDefined();
          expect(book.authors instanceof Array).toBe(true);
          expect(book.year).toBeDefined();
          expect(book.fen instanceof Array).toBe(true);
        });
      });

      describe('fen object', function() {
        it('has attributes: id, stipulation, position', function() {
          var fen0 = book.fen[0];
          expect(fen0.id).toBeDefined();
          expect(fen0.stipulation).toBeDefined();
          expect(fen0.position).toBeDefined();
        });
      });
    }));
  });

  describe('fenToObject', function() {
    it("converts a FEN string to an object", inject(function(fenToObject) {
      expect(fenToObject instanceof Function).toBe(true);

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
