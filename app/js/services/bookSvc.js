'use strict';

angular.module('kinghunt.services').
  factory("bookSvc", ['ready', function(ready) {

    var bookSvc = {};
    var book;
    ready.bookPromise.then(function(bk) {
      bookSvc.loadBook(bk);
    });
    var solved;
    ready.solvedPromise.then(function(slvd) {
      bookSvc.loadSolved(slvd);
    });
    var skipSolved = false;

    bookSvc =  {

      getFenById: function(id) {
        var problems = book.problems;
        var i, flen;
        for (i = 0, flen = problems.length; i < flen; i++) {
          if (problems[i].id === id) {
            return problems[i];
          }
        }
      },

      getProblems: function() {
        return book.problems || [];
      },

      getNext: function(id) {
        var problems = book.problems;
        var i, flen;
        for (i = 0, flen = problems.length; i < flen; i++) {
          if (problems[i].id === id) {
            return (problems[i + 1]) ? problems[i + 1] : null;
          }
        }
      },

      getPrev: function(id) {
        var problems = book.problems;
        var i, flen;
        for (i = 0, flen = problems.length; i < flen; i++) {
          if (problems[i].id === id) {
            return (problems[i - 1]) ? problems[i - 1] : null;
          }
        }
      },

      setSkipSolved: function(value, $scope) {
        skipSolved = value;
        storageSvc.filterSolved(value, solved).then(function() {
          $scope.$apply();
        });
      },

      getSkipSolved: function() {
        return skipSolved;
      },

      toggleSkipSolved: function() {
        skipSolved = !skipSolved;
      },

      loadBook: function(newBook) {
        book = newBook;
        // $scope.$apply();
      },

      // TODO: unstub; move to indexedDB
      loadSolved: function(s) {
        solved = s;
        // $scope.$apply();
      },

      isSolved: function(id) {
        return solved[id];
      },

      // TODO: unstub
      markSolved: function(id, value) {
        if (value) { solved[id] = value; }
        else { delete solved[id]; }
      }

    }; // bookSvc

    return bookSvc;
  }]);

