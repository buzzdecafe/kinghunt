'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kinghunt.services', []).
  value('version', '0.1').
  value("book",
    {
      title: "English Chess Problems",
      authors: ["Abbott, Joseph William"],
      year: "1876",
      fen: [
        {id: 4, stipulation: "#2", position: "7n/3NR3/1P3p2/1p1kbN1B/1p6/1K6/6b1/1Q6"},
        {id: 6, stipulation: "#2",  position: "3K4/4B3/3Rp3/8/4pk2/1Qp1Np2/2p2P2/2R5"}
      ]
    }
  ).
  value('credits', [
      {name: 'angular-seed', url: 'https://github.com/angular/angular-seed'},
      {name: 'chess.js', url: 'https://github.com/jhlywa/chess.js'},
      {name: 'chessboardjs', url: 'https://github.com/oakmac/chessboardjs'},
      {name: 'Yet Another Chess Problem Database', url: 'http://www.yacpdb.org/'}
  ]).
  factory('fenFormat', function() {
      return function(fen) {
        // TODO: do a proper job on this
        // stubbed out to append other attributes to satisfy chess.js
        return fen + " w - - 0 1";
      };
  });
