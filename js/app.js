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

    scope.prepareAddress = function (q) {
      /**
       * Gets a string and creates a new line with "+" character between words
       * @param q - string
       * @type {Array|{index: number, input: string}|*}
       * @return string
       */
      var re = /[a-zA-Zа-яА-Я0-9]+/g;
      var query = q.match(re);
      return query.join('+');
    };
  };

})();