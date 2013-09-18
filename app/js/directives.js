'use strict';

/* Directives */


angular.module('kinghunt.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('boardNav', ['$rootScope', '$route', function($rootScope, $route) {
      return {
        restrict: 'C',
        replace: true,
        transclude: true,
        templateUrl: 'partials/boardNav.html',
        link: function(scope, element, attrs) {
          var buttons = element.find('.board-button');
          var prevProblem = element.find('#prevProblem');
          var nextProblem = element.find('#nextProblem');
          var undo = element.find('#undo');
          var reload = element.find('#reload');
          buttons.on('click', function(e) {
            $rootScope.$broadcast('boardNav/' + e.target.id);
          });
        }
      };
    }]).
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