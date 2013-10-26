'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('solvedMark', ['bookSvc', function(bookSvc) {
      return {
        restrict: 'C',
        replace: true,
        template: '<button class="pull-right btn btn-default"><span class="glyphicon {{ solved[problem.id] | toProblemClass }}"></span></button>',
        link: function(scope, element, attrs) {
          // update model
          element.on('click', function(e) {
            var id = scope.problem.id;
            var icon = element.find("span.glyphicon");
            var solvedProblem = icon.is(".solved");
            bookSvc.markSolved(id, !solvedProblem);
            scope.$apply();
          });
        }
      };
    }]);