'use strict';

/* Directives */


angular.module('kinghunt.directives', []).
  directive('chessboard', ['id', 'position', function(id, position) {
    id = id || 'board';
    position = position || 'start';
    return function(scope, elm, attrs) {
      return new ChessBoard(id, position);
    };
  }]).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
