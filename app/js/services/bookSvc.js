'use strict';

angular.module('kinghunt.services').
  factory("bookSvc", ['$window', 'defaultBook', function($window, defaultBook) {

    var put = function(key, val) {
      $window.localStorage.setItem(key, JSON.stringify(val));
    };
    var fetch = function(key) {
      var value = $window.localStorage.getItem(key);
      return value ? JSON.parse(value) : value;
    };
    var book = fetch("book");
    var skipSolved = fetch("skipSolved") || false;
    var solved;

    if (!book) {
      book = defaultBook;
      put("book", book);
    }
    solved = fetch(book.id) || {};

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

      getBook: function() {
        return book;
      },

      getProblems: function() {
        return book.problems || [];
      },

      getNext: function(id) {
        var problems = book.problems;
        var i, j, flen;
        for (i = 0, flen = problems.length; i < flen; i++) {
          if (problems[i].id === id) {
            if (skipSolved) {
              for (j = i + 1; j < problems.length; j++) {
                if (!solved[problems[j].id]) {
                  return problems[j];
                }
              }
            } else {
              return (problems[i + 1]) ? problems[i + 1] : null;
            }
          }
        }
        return null;
      },

      getPrev: function(id) {
        var problems = book.problems;
        var i, j, flen;
        for (i = 0, flen = problems.length; i < flen; i++) {
          if (problems[i].id === id) {
            if (skipSolved) {
              for (j = i - 1; j > -1; j--) {
                if (!solved[problems[j].id]) {
                  return problems[j];
                }
              }
            } else {
              return (problems[i - 1]) ? problems[i - 1] : null;
            }
          }
        }
        return null;
      },

      getSolved: function() {
        return solved;
      },

      getSkipSolved: function() {
        return skipSolved;
      },

      toggleSkipSolved: function() {
        skipSolved = !skipSolved;
        put("skipSolved", skipSolved);
      },

      loadBook: function(newBook) {
        put("book", newBook);
        book = newBook;
        solved = fetch(book.id) || {};
      },

      isSolved: function(id) {
        return solved[id];
      },

      markSolved: function(id, value) {
        if (value) {
          solved[id] = value;
        }
        else {
          delete solved[id];
        }
        put(book.id, solved);
      }

    }; // bookSvc

  }]);

