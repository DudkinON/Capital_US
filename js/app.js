if (initMap !== undefined) var initMap;

(function () {
  'use strict';

  var map;

  var Worker = function () {
    var scope = this;
    scope.getLocations = function (func) {
      $.getJSON('/js/locations.json', func)
    };
  };

})();