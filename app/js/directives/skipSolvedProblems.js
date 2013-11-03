'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('skipSolvedProblems', ['bookSvc', function(bookSvc) {
      return {
        restrict: 'C',
        replace: false,
        link: function(scope, element, attrs) {
          scope.skipSolved = bookSvc.getSkipSolved();

          element.on('click', function(e) {
            bookSvc.toggleSkipSolved();
            scope.skipSolved = bookSvc.getSkipSolved();
            scope.$apply();
          });
        }
      }
    }]);