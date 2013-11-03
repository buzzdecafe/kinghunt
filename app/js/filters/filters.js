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
      return gameSvc.fenToObject(fen).turn === 'w' ? 'White' : 'Black';
    };
  }]).
  filter('toProblemClass', function() {
    return function(isSolved) {
      return isSolved ? "glyphicon-check solved" : "glyphicon-unchecked unsolved";
    };
  }).
  filter('solvedMsg', function() {
    return function(skip) {
      return skip ? "Show" : "Hide";
    };
  }).
  filter('translateStipulation', [function() {
    var mateInRx = /^#(\d+)$/;
    return function(stipulation) {
      var okFormat = mateInRx.exec(stipulation);
      return (okFormat) ? "mate in " + okFormat[1] || "(unknown)" : stipulation;
    };
  }]);

