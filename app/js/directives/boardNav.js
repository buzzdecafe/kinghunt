'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('boardNav', ['$rootScope', function($rootScope) {
      return {
        restrict: 'C',
        replace: true,
        transclude: true,
        templateUrl: 'partials/boardNav.html',
        link: function(scope, element, attrs) {
          var buttons = element.find('.board-button');
          // ids we're listening for: prevProblem, nextProblem, undo, reload
          buttons.on('click', function(e) {
            $rootScope.$broadcast('boardNav/' + e.target.id);
          });
        }
      };
    }]);