'use strict';

/* Filters */

angular.module('kinghunt.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]).
  filter('uriencode', [function() {
    return function(str) {
      return encodeURIComponent(str);
    };
  }]).
  filter('whoseTurn', ['gameSvc', function(gameSvc) {
    return function(fen) {
      var color = gameSvc.fenToObject(fen).turn === 'w' ? 'White' : 'Black';
      return color;
    };
  }]).
  filter('wholeNumbers', [function() {
    return function(remaining) {
      return remaining >> 0;
    };
  }]).
  filter('toProblemClass', function() {
    return function(isSolved) {
      return isSolved ? "glyphicon-check solved" : "glyphicon-unchecked unsolved";
    };
  }).
  filter('translateStipulation', [function() {
    var mateInRx = /^#(\d+)$/;
    return function(stip) {
      var okFormat = mateInRx.exec(stip);
      return (okFormat) ? "mate in " + okFormat[1] || "(unknown)" : stip;
    };
  }]);

