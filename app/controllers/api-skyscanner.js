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
    //console.log(locations["Places"][0]['CityId']);
    callback(locations["Places"][0]['CityId']);
  });
}

var getFlights = function(origin, destination, inboundDate, outboundDate) {
  var url_query = url_browse_quotes + origin + "/" + destination + "/" + inboundDate + "/" + outboundDate + "?apiKey=" + cons.API_KEY_SKYSCANNER; ///CDG/2017-02-11/2017-02-15?apiKey
  ext.unirest.get(url_query)
  .end(function (response) {
    console.log(response.body);
  });
}

/**
========================================================================================================
  Routing
========================================================================================================
**/

module.exports = function (req, res) {
  var origin = "Edinburgh";
  var destination = "Paris";

  var inboundDate = "2017-02-11";
  var outboundDate = "2017-02-11";

  getLocationId(origin, function(originId) {
    getLocationId(destination, function(destinationId) {
      getFlights(originId, destinationId, inboundDate, outboundDate);
    });
  });
  res.sendFile(path.join(dir.VIEW, 'home.html'));
};
