'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('overlay', ['$q', function($q) {
      return {
        restrict: 'C',
        replace: false,
        templateUrl: 'partials/promotion.html',
        link: function(scope, element, attrs, controller) {
          scope.overlay = {
            open: function(turn) {
              this.deferred = $q.defer();
              element.show();
              element.find('button.' + turn).show();
              return this.deferred.promise;
            },
            close: function(value) {
              this.deferred.resolve(value);
              delete this.deferred;
              element.hide().find('button').hide();
            }
          };
        }
      };
    }]);