'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('kinghunt.services', []).
  value('version', '0.1').
  factory('ChessBoard', function() {
    return new ChessBoard('board', 'start');
  });
