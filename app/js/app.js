'use strict';


// Declare app level module which depends on filters, and services
angular.module('kinghunt', ['ui.bootstrap', 'kinghunt.filters', 'kinghunt.services', 'kinghunt.directives', 'kinghunt.controllers']).
  config(['$routeProvider', '$window', '$q', function($routeProvider, $window, $q) {
    var request = $window.indexedDB.open("KingHunt");
    var db;
    var dbDfd = $q.defer();
    var bookDfd = $q.defer();
    var solvedDfd = $q.defer();
    var readyPromise = $q.all([bookDfd.promise, solvedDfd.promise]).then(
        function() { return true; },
        function() { return false; }
    );

    var resolveObj = {
      book: function() { return bookDfd.promise; },
      solved: function() { return solvedDfd.promise; }
    };

    // initialization
    request.onerror = function(event) {
      dbDfd.reject();
    };
    request.onsuccess = function(event) {
      db = request.result;
      dbDfd.resolve();
    };
    // run this the first time through, to setup stores
    request.onupgradeneeded = function(evt) {
      // TODO: implement me
    };

    dbDfd.promise.then(function(e) {

      // open store, initialize if necessary, fetch contents, resolve promise with contents
      var bookStore = db.transaction(["book"], "readonly").objectStore("book");
      var bookRequest = bookStore.getAll();

      var solvedStore = db.transaction(["solved"], "readonly").objectStore("solved");
      // FIXME: get just the solved ones for this store please:
      var solvedRequest = solvedStore.getAll();

      bookRequest.onsuccess = function(e) {
        bookDfd.resolve(e.result);
      };
      bookRequest.onerror = function(e) {
        bookDfd.reject();
      };

      solvedRequest.onsuccess = function(e) {
        solvedDfd.resolve(e.result);
      };
      solvedRequest.onerror = function(e) {
        solvedDfd.reject();
      };
    });


    $routeProvider.when('/load', {
      templateUrl: 'partials/load.html',
      resolve: resolveObj,
      controller: 'LoadCtrl'
    });
    $routeProvider.when('/board/:id', {
      templateUrl: 'partials/board.html',
      resolve: {
        dbReady: function() { return readyPromise; }
      },
      controller: 'BoardCtrl'
    });
    $routeProvider.when('/about', {
      templateUrl: 'partials/about.html',
      controller: 'AboutCtrl'
    });
    $routeProvider.otherwise({
      redirectTo: '/load'
    });
  }]).
  config( ['$compileProvider', function( $compileProvider ) {   
      // whitelist 'app:/' protocol or angular will label it "unsafe":
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);
    }
  ]);

