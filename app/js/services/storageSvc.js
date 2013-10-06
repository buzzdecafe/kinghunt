'use strict';

angular.module('kinghunt.services').
  factory('storageSvc', ['$window', '$q', function($window, $q) {
    var request = $window.indexedDB.open("KingHunt");
    var db;
    var storageSvc;
    var readyDfd = $q.defer();
    var readyPromise = readyDfd.promise;

    // initialization
    request.onerror = function(event) {
      readyDfd.reject();
    };
    request.onsuccess = function(event) {
      db = request.result;
      readyDfd.resolve();
    };
    request.onupgradeneeded = function(evt) {};

    storageSvc = {
      ready: function(fn) {
        return readyPromise.then(fn);
      },

      filterSolved: function(value, solvedProblems) {
        var solvedIds;
        var dfd = $q.defer();
        if (value) { // if true, we want to filter out solved problems
          solvedIds = Object.keys(solvedProblems);
        } else { // otherwise, return the whole schmear
          
        }
        return dfd.promise;
      },

      getBook: function() {

      },

      setBook: function(book) {

      },

      getSolved: function(id) {

      },

      markSolved: function(id, value) {

      }
    };

    // CRUD


    return storageSvc;
  }]);
