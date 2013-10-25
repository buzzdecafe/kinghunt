'use strict';

angular.module('kinghunt.services').
  factory("bookSvc", ['$window', 'defaultBook', function($window, defaultBook) {

      var put = function(key, val) {
        $window.localStorage.setItem(key, JSON.stringify(val));
      };
      var fetch = function(key) {
        return JSON.stringify($window.localStorage.getItem(key));
      };
    var book = fetch("book");
    var solved;



      if (!book) {
        book = defaultBook;
        put("book", book);
      }
      solved = fetch(book.id);
      if (!solved) {
        solved = {};
        put(book.id, solved);
      }

    var skipSolved = fetch("skipSolved") || false;

    return  {
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

      getSkipSolved: function() {
        return skipSolved;
      },

      toggleSkipSolved: function() {
        skipSolved = !skipSolved;
        put("skipSolved", skipSolved);
      },

      loadBook: function(newBook) {
        book = newBook;
      },

      // TODO: unstub; move to indexedDB
      loadSolved: function(s) {
        solved = s;
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

  }]);

