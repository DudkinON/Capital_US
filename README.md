# Capital US (Neighborhood Map)

This application provides a map with locations of every U.S. state capital as 
well as a New York Times news API that for each city gives, "articles, photos and videos... 
including hotel, restaurant and attraction information with reader reviews and
advice on where to stay, where to eat and what to do."


## Install

In a terminal, put the following comments:

```
git clone "https://github.com/DudkinON/Capital_US"
```

```
cd Capital_US
```

## Usage

To use, you must run any HTTP server, for example [Python](https://docs.python.org/2/library/simplehttpserver.html). 
The entry point must be in the application folder. Run HTTP server and go 
to http://localhost:8000.

Change in index.html on line 7 "YOUR-NY-TIMES-API-KEY" to your New York Times 
API key. 

Change in index.html on line 49 the link 
"//maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_KEY&v=3&libraries=places&callback=initMap" 
you need to change "YOUR_GOOGLE_KEY" to your Google API key.

> Download Python you can [here](https://www.python.org/downloads/release/python-2714/)

## Used 
#### Libraries and Frameworks 

* [jQuery v3.2.1](http://jquery.com/download/)
* [Knockout JavaScript library v3.4.2](http://knockoutjs.com/downloads/index.html)

#### APIs

* [Google Maps APIs](https://developers.google.com/maps/)
* [The New York Times API](https://developer.nytimes.com/)

## LICENSE

[MIT](LICENSE)

