'use strict';

/* Directives */

angular.module('kinghunt.directives').
    directive('fenentry', ['$window', function($window) {
      return {
        restrict: 'C',
        replace: true,
        transclude: true,
        scope: {},
        template: '<div><input type="text" name="fen" id="fen" /><button id="fengo">Go</button></div>',
        link: function(scope, element, attrs) {
          var button = angular.element('#fengo');
          var fenInput = angular.element('#fen');
          button.on('click', function(e) {
            var fenstr = fenInput.val(); // validate FEN?
            $window.location.href = '#/board?fen=' + fenstr;
          });
        }
      };
    }]);