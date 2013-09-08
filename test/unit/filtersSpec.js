'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
  beforeEach(module('kinghunt.filters'));


  describe('interpolate', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));


    it('should replace VERSION', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });


  describe('translateStipulation', function() {

    it("translates mate-in-x stipulation to a readable string", inject(function(translateStipulationFilter) {
      var mateInTwoStip = "#2";
      var mateInTenStip = "#10";
      expect(translateStipulationFilter(mateInTwoStip)).toBe("Mate in 2");
      expect(translateStipulationFilter(mateInTenStip)).toBe("Mate in 10");
    }));

    xit("translates helpmate stipulation to a readable string", inject(function(translateStipulationFilter) {
      var helpmateInTwoStip = "h#10";
      expect(translateStipulationFilter(helpmateInTwoStip)).toEqual("Helpmate in 2");
    }));

    xit("translates selfmate stipulation to a readable string", inject(function(translateStipulationFilter) {
      var selfmateInTwoStip = "s#10";
      expect(translateStipulationFilter(selfmateInTwoStip)).toEqual("Selfmate in 2");
    }));

    it("passes through when it can't translate", inject(function(translateStipulationFilter) {
      var unsupported = "whatever";
      expect(translateStipulationFilter(unsupported)).toEqual("whatever");
    }));

  });
});

