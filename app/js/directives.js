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
  directive('solveStatus', [function() {
    return {
      restrict: 'C',
      replace: true,
      transclude: true,
      template: '<div><span class="turn turn-{{ status.turn }}"></span> <span>{{ status.situation }}</span> <span>{{ status.progress }}</span></div>'
    };
  }]).
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
          bookSvc.markSolved(id, icon.is(".solved"));
          scope.$apply();
        });
      }
    };
  }]).
  directive('skipSolvedProblems', ['bookSvc', function() {
    return {
      restrict: 'C',
      replace: false,
      template: '<button class="btn btn-default" ng-click="bookSvc.toggleSkipSolved()">{{ bookSvc.getSkipSolved() | solvedMsg }} solved</button>',
    }
  }]).
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
