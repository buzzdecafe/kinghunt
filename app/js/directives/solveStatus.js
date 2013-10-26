'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('solveStatus', [function() {
      return {
        restrict: 'C',
        replace: true,
        transclude: true,
        template: '<div><span class="turn turn-{{ status.turn }}"></span> <span>{{ status.situation }}</span> <span>{{ status.progress }}</span></div>'
      };
    }]);