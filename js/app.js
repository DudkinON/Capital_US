var initMap;

function googleError(err) {
  console.log(err);
  $('#map').html('<h1 style="color: red;">Can\'t load map, please try later</h1>');
}

(function () {
  'use strict';

  var map;

  var Worker = function () {

    var scope = this;

    scope.getLocations = function (func, e) {
      /**
       * Async function provide locations
       */
      $.getJSON('/js/locations.json', func).fail(e);
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

    scope.showMarkers = function (markers, $scope) {
      /**
       * Show markers
       * @param {markers}
       * @type {google.maps.LatLngBounds}
       * return void
       */
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        $scope.marker = markers[i];
        $scope.marker.setMap(map);
        scope.addMenuItem($scope);
        bounds.extend($scope.marker.position);
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

    scope.addMenuItem = function ($scope) {
      /**
       * Create an element of menu
       * @type {HTMLElement | null}
       * @return void
       */
      $scope.menu.push($scope.marker);
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

        scope.addMenuItem($scope);

        // Push the marker to our array of markers.
        $scope.markers.push($scope.marker);

        // Create an onclick event to open an infowindow at each marker.
        $scope.marker.addListener('click', $scope.listener);
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
      var titleEtc;
      var snippetEtc;
      if (articles[0].headline.main.length > 23) titleEtc = '...';
      else titleEtc = '';
      if (articles[0].snippet.length > 194) snippetEtc = '...';
      else snippetEtc = '';
      return '<div class="nm-card-square mdl-card mdl-shadow--2dp">\n' +
        '  <div class="mdl-card__title mdl-card--expand" ' +
        'style="background-image: ' + img + '">' +
        '    <h2 class="mdl-card__title-text">' + cityinfo.formatted_address + '</h2>\n' +
        '  </div>\n' +
        '  <div class="mdl-card__supporting-text">\n' +
        '  <h4>' + articles[0].headline.main.substring(0, 23) + titleEtc + '</h4>' +
        '  <p>' + articles[0].snippet.substring(0, 194) + snippetEtc + '</p>' +
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

    scope.error = function (marker) {
      /**
       * If the locations are not available, show error message
       */
      $('#map').html('<h1 style="color: red;">Can\'t load the locations.</h1>\n' +
        '<h3 style="color: red;">' + err.statusText + '.</h3>');
    };

    scope.getImage = function (marker) {
      var img_params = 'size=350x350&location=';
      var img_url = '//maps.googleapis.com/maps/api/streetview?' + img_params;
      return "url('" + img_url + marker.title + '+' + marker.long_name + "')";
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
    scope.title = 'U.S. Capitals';
    scope.locations = ko.observableArray([]);
    scope.menu = ko.observableArray([]);
    scope.filter = ko.observable("");
    scope.AddLink = function () {
      console.log(this);
      var item = scope.markers[Number(this.id)];
      scope.marker.setAnimation(null);
      scope.populateInfoWindow(item, scope.largeInfowindow, scope.locations);
    };

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

        // Create filter
        scope.filteredPlaces = ko.computed(function () {
          var filter = scope.filter().toLowerCase();
          if (filter) {

            // Hide all markers
            scope.worker.hideMarkers(scope.markers);

            // Remove all menu elements
            scope.menu([]);

            // Get filtered markers
            var markers = ko.utils.arrayFilter(scope.markers, function (item) {
              return scope.worker.stringStartsWith(item.title.toLowerCase(), filter);
            });

            // Display filtered markers
            scope.worker.showMarkers(markers, scope);
          } else {
            // Display all markers
            scope.worker.showMarkers(scope.markers, scope);
          }
        }, scope);

        // Create markers
        scope.worker.createMarkers(scope.locations(), scope);
      };
    };

    // Get locations and init map
    scope.worker.getLocations(scope.init, scope.worker.error);

    scope.populateInfoWindow = function (marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker !== marker) {

        // Define current marker
        scope.marker = marker;

        // Create city info variable
        var cityinfo;

        // Prepare city title for query
        var city = scope.worker.prepareAddress(marker.title);

        // Prepare request info
        var request = {placeId: marker.place_id};

        // Create an instance of the Places Service
        var service = new google.maps.places.PlacesService(map);

        // Get detailed info on the place
        service.getDetails(request, function (data) {

          // Define city info
          cityinfo = data;

          // Get images
          var img = scope.worker.getImage(marker);

          // Define info window marker
          infowindow.marker = marker;

          // Get articles and display it
          scope.worker.getArticles(city, function (data) {

            // Define articles
            var articles;
            if (data && data.status === "OK" && data.response.docs.length > 0) {
              articles = data.response.docs;
            } else {
              articles = scope.worker.getEmptyArticle();
            }

            // Add marker animation
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // Create an information window
            infowindow.setContent(scope.worker.getTemplate(articles, cityinfo, img));
            infowindow.open(map, marker);

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {

              // Remove current marker animation
              marker.setAnimation(null);

              // Close info window
              infowindow.marker = null;
            });
          });
        });
      }
    };

    scope.listener = function () {
      /**
       * Create info window for current element
       * @return void
       */

      // Remove current marker animation
      scope.marker.setAnimation(null);

      // Create info window
      scope.populateInfoWindow(this, scope.largeInfowindow, scope.locations);
    };
  };

  ko.applyBindings(new View(), document.getElementsByTagName('html')[0]);
})();