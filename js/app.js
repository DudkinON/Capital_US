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

    scope.getArticles = function (q, func) {
      /**
       * Async function get articles and use func to provide data
       * @param (q: string, func: function)
       * @type {string}
       */
      var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
      var link = url + 'api-key=' + $('#ny-api-key').data('api-key') + '&q=' + q;
      $.getJSON(link, func);
    };

    scope.showMarkers = function (markers) {
      /**
       * Show markers
       * @param {markers}
       * @type {google.maps.LatLngBounds}
       * return void
       */
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    };

    scope.hideMarkers = function (markers) {

      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    };
  };

})();