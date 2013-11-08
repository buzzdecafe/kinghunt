'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('solvedMark', ['bookSvc', function(bookSvc) {
      return {
        restrict: 'C',
        replace: true,
        template: '<button class="pull-right btn btn-default"><span class="glyphicon {{ problemSolved | toProblemClass }}"></span></button>',
        link: function(scope, element, attrs) {
          // update model
          scope.problemSolved = bookSvc.isSolved(scope.problem.id);
          element.on('click', function(e) {
            var id = scope.problem.id;
            scope.problemSolved = !element.find("span.glyphicon").is(".solved");
            bookSvc.markSolved(id, scope.problemSolved);
            scope.$apply();
          });
        }
      };
    }]);