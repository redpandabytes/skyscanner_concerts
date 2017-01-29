/**
========================================================================================================
  Generic Imports
========================================================================================================
**/

var path = require('path');
var dir = require('../../config/dir.js');
var ext = require( path.join(dir.CONFIG, 'ext.js') );
var cons = require( path.join(dir.CONFIG, 'cons.js') );

var url_autosuggest = "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/ES/USD/EN/?";
var url_browse_quotes = "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/ES/USD/en-GB/";

var getLocationId = function(location, callback) {
  var url_query = url_autosuggest + "query=" + location + "&apiKey=" + cons.API_KEY_SKYSCANNER;
  ext.unirest.get(url_query)
  .end(function (response) {
    var locations = JSON.parse(response["raw_body"]);
    if (ext.isEmptyObject(locations["Places"])) {
      return callback("Not known city, no id", null);
    }
    callback(null, locations["Places"][0]['CityId']);
  });
}

var getFlights = function(origin, destination, inboundDate, outboundDate, callback) {
  var url_query = url_browse_quotes + origin + "/" + destination + "/" + inboundDate + "/" + outboundDate + "?apiKey=" + cons.API_KEY_SKYSCANNER; ///CDG/2017-02-11/2017-02-15?apiKey
  ext.unirest.get(url_query)
  .end(function (response) {
    var flightSet = response.body;  //TODO filter narrow it
    callback(flightSet);
  });
}

/**
========================================================================================================
  Routing
========================================================================================================
**/

module.exports = function (origin, destination, inboundDate, outboundDate, callback) {
  getLocationId(origin, function(errOrigin, originId) {
    getLocationId(destination, function(errDestination, destinationId) {
      if (errOrigin || errDestination) {
        console.log("Errors:" + errOrigin + " and " + errDestination);
      }
      getFlights(originId, destinationId, inboundDate, outboundDate, flightSet => {
        callback(flightSet);
      });
    });
  });
};
