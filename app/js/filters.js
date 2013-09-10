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
  filter('translateStipulation', [function() {
    var mateInRx = /^#(\d+)$/;
    return function(stip) {
      var okFormat = mateInRx.exec(stip);
      return (okFormat) ? "Mate in " + okFormat[1] || "(unknown)" : stip;
    };
  }]);

