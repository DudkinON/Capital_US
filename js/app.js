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
      /**
       * Gets string and searches within startsWith string at beginning
       * @type {*|string}
       * @return bool
       */
      string = string || "";
      if (startsWith.length > string.length)
        return false;
      return string.substring(0, startsWith.length) === startsWith;
    };
  };

})();