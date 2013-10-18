angular.module('kinghunt.services').
    factory('readySvc', ['$window', '$q', 'defaultBook', 'defaultSolved', function($window, $q, defaultBook, defaultSolved) {

      var request = $window.indexedDB.open("KingHunt", 1);
      var db;
      var book;
      var solved;
      var dbDfd = $q.defer();
      var bookDfd = $q.defer();
      var solvedDfd = $q.defer();

      // initialization
      request.onerror = function(event) {
        dbDfd.reject();
      };
      request.onsuccess = function(event) {
        db = event.target.result;
        dbDfd.resolve();
      };
      // run this the first time through, to setup stores
      request.onupgradeneeded = function(event) {
        var idb = event.target.result;
        var bookStore = idb.createObjectStore("book", {keyPath: "id"});
        var solvedStore = idb.createObjectStore("solved", {keyPath: "bookId"});
        bookStore.put(defaultBook);
        solvedStore.put(defaultSolved);
      };

      dbDfd.promise.then(function(e) {

        // open store, initialize if necessary, fetch contents, resolve promise with contents
        var bookStore = db.transaction(["book"], "readonly").objectStore("book");
        var bookRequest = bookStore.getAll();

        var solvedStore = db.transaction(["solved"], "readonly").objectStore("solved");
        // FIXME: get just the solved ones for this store please:
        var solvedRequest = solvedStore.getAll();

        bookRequest.onsuccess = function(e) {
          book = e.result;
          bookDfd.resolve(book);
        };
        bookRequest.onerror = function(e) {
          // TODO: if there is no book defined, load default book and return it
          bookDfd.reject();
        };

        solvedRequest.onsuccess = function(e) {
          solved = e.result;
          solvedDfd.resolve(solved);
        };
        solvedRequest.onerror = function(e) {
          solvedDfd.reject();
        };
      });

      return {
        promise: $q.all([dbDfd.promise, bookDfd.promise, solvedDfd.promise]),
        db: db,
        book: book,
        solved: solved
      };
    }]);