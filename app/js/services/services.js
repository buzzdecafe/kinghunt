'use strict';

angular.module('kinghunt.services', []).
  value('version', '0.1.0').
  value('credits', [
    {name: 'chess.js', url: 'https://github.com/jhlywa/chess.js'},
    {name: 'chessboardjs', url: 'https://github.com/oakmac/chessboardjs'},
    {name: 'Yet Another Chess Problem Database', url: 'http://www.yacpdb.org/'}
  ]);

