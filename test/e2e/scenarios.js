'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });


  it('should automatically redirect to /load when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/load");
  });


  describe('load', function() {

    beforeEach(function() {
      browser().navigateTo('#/load');
    });

    it('should render the "load" view when user navigates to /load', function() {
      expect(element('[ng-view] p:first').text()).toMatch(/partial for load view/);
    });

  });


  describe('board', function() {

    beforeEach(function() {
      browser().navigateTo('#/board');
    });

    it('should render board view when user navigates to /board', function() {
      expect(element('[ng-view] p:first').text()).toMatch(/partial for board view/);
    });

  });

  describe('board', function() {

    beforeEach(function() {
      browser().navigateTo('#/board');
    });

    it('should render board view when user navigates to /board', function() {
      expect(element('[ng-view] p:first').text()).toMatch(/partial for board view/);
    });

  });

});
