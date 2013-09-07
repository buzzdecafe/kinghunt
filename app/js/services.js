'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kinghunt.services', []).
  value('version', '0.1').
  value("book",
    {
      id: 4,
      title: "English Chess Problems",
      author: "Abbott, Joseph William",
      year: "1876",
      fen: [
          "7n/3NR3/1P3p2/1p1kbN1B/1p6/1K6/6b1/1Q6",
          "3K4/4B3/3Rp3/8/4pk2/1Qp1Np2/2p2P2/2R5"
      ]
    }
  ).
  factory('ChessBoard', function() {
    return new ChessBoard('board', 'start');
  });
