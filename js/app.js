if (initMap !== undefined) var initMap;

(function () {
  'use strict';

  var map;

  var Worker = function () {

    var scope = this;

    scope.getLocations = function (func) {
      /**
       * Async function provide locations
       */
      $.getJSON('/js/locations.json', func)
    };

    scope.stringStartsWith = function (string, startsWith) {

      string = string || "";
      if (startsWith.length > string.length)
        return false;
      return string.substring(0, startsWith.length) === startsWith;
    };
  };

})();