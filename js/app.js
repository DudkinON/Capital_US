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
      /**
       * loop through the markers and hide them all
       * @param {markers}
       * return void
       */
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    };

    scope.createLink = function ($scope) {
      /**
       * Create an element of menu
       * @type {HTMLElement | null}
       * @return void
       */

        // Get menu container
      var element = document.getElementById('menu');

      // Create "a" element and set attributes
      var a = document.createElement('a');
      a.setAttribute('class', 'mdl-navigation__link');
      a.setAttribute('href', "");
      a.setAttribute('id', $scope.marker.id);
      a.innerText = $scope.marker.title;
      element.appendChild(a);

      // Create a new event on click
      a.addEventListener('click', function (elem) {
        elem.preventDefault();
        var item = $scope.markers[Number(this.getAttribute("id"))];
        $scope.populateInfoWindow(item, $scope.largeInfowindow, $scope.locations);
      }, false);
    };

    scope.createMarkers = function (locations, $scope) {
      /**
       * Create markers on the map
       * @param {locations | array}
       * @param {$scope | object}
       * @return void
       */
      for (var i = 0; i < locations.length; i++) {

        // Create a marker per location, and put into markers array.
        $scope.marker = new google.maps.Marker({
          map: map,
          place_id: locations[i].place_id,
          long_name: locations[i].long_name,
          position: locations[i].location,
          title: locations[i].title,
          animation: google.maps.Animation.DROP,
          id: i
        });

        scope.createLink($scope);

        // Push the marker to our array of markers.
        $scope.markers.push($scope.marker);

        // Create an onclick event to open an infowindow at each marker.
        $scope.marker.addListener('click', function () {
          $scope.populateInfoWindow(this, $scope.largeInfowindow, $scope.locations);
        });
        $scope.bounds.extend($scope.markers[i].position);
      }
      // Extend the boundaries of the map for each marker
      map.fitBounds($scope.bounds);
    };

    scope.getTemplate = function (articles, cityinfo, img) {
      /**
       * Create template add data and return it
       * @param {articles | array}
       * @param {cityinfo | array}
       * @param {img | url}
       * @return html
       */
      return '<div class="nm-card-square mdl-card mdl-shadow--2dp">\n' +
        '  <div class="mdl-card__title mdl-card--expand" ' +
        'style="background-image: ' + img + '">' +
        '    <h2 class="mdl-card__title-text">' + cityinfo.formatted_address + '</h2>\n' +
        '  </div>\n' +
        '  <div class="mdl-card__supporting-text">\n' +
        '  <h4>' + articles[0].headline.main + '</h4>' +
        '  <p>' + articles[0].snippet + '</p>' +
        '  </div>\n' +
        '  <div class="mdl-card__actions mdl-card--border">\n' +
        '    <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" ' +
        '       href="' + articles[0].web_url + '" target="_blank"' +
        '     >read</a>\n' +
        '  </div>\n' +
        '</div>';
    };

    scope.getEmptyArticle = function () {
      /**
       * Return empty article
       * return array
       */
      return [{
        headline: {main: "Articles didn't found"},
        snippet: "",
        web_url: ""
      }];
    };
  };


  var View = function () {

    // Define scope
    var scope = this;

    // Define scope variables
    scope.markers = [];
    scope.marker = {};
    scope.worker = new Worker();
    scope.largeInfowindow = {};
    scope.bounds = {};
    scope.title = 'Capital US';
    scope.locations = ko.observableArray([]);
    scope.filter = ko.observable("");

    scope.init = function (data) {

      // Get locations
      scope.locations(data);

      initMap = function () {

        // Create map object
        map = new google.maps.Map(document.getElementById('map'), {
          zoomControl: true,
          mapTypeControl: true
        });
        // Create info window
        scope.largeInfowindow = new google.maps.InfoWindow();
        scope.bounds = new google.maps.LatLngBounds();

        // Create markers
        scope.worker.createMarkers(scope.locations(), scope);
      };
    };
  }

})();