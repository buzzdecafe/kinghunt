'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('skipSolvedProblems', ['bookSvc', function(bookSvc) {
      return {
        restrict: 'C',
        replace: false,
        template: '<button class="btn btn-default" ng-click="bookSvc.toggleSkipSolved()">{{ bookSvc.getSkipSolved() | solvedMsg }} solved</button>',
      }
    }]);