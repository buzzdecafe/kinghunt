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
        bookDfd.reject();
        solvedDfd.reject();
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

        var id = "English Chess Problems, Vol. 1";
        // open store, initialize if necessary, fetch contents, resolve promise with contents
        var bookStore = db.transaction(["book"], "readonly").objectStore("book");
        var bookRequest = bookStore.get(id);

        bookRequest.onsuccess = function(e) {
          var solvedStore = db.transaction(["solved"], "readonly").objectStore("solved");
          var solvedRequest = solvedStore.get(id);

          solvedRequest.onsuccess = function(e) {
            solved = e.target.result;
            solvedDfd.resolve(solved);
          };
          solvedRequest.onerror = function(e) {
            solvedDfd.reject();
          };

          book = e.target.result;
          bookDfd.resolve(book);
        };
        bookRequest.onerror = function(e) {
          // TODO: if there is no book defined, load default book and return it
          bookDfd.reject();
          solvedDfd.reject();
        };

      });

      return {
        db: dbDfd.promise,
        book: bookDfd.promise,
        solved: solvedDfd.promise
      };

    }]);