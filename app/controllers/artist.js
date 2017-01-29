/**
========================================================================================================
  Generic Imports
========================================================================================================
**/

var path = require('path');
var dir = require('../../config/dir.js');
var ext = require( path.join(dir.CONFIG, 'ext.js') );

/**
========================================================================================================
  Routing
========================================================================================================
**/

var APIspotify = function(artist, callback) {
  var artistSet = ["Ed Sheeran", "Calvin Harris"];
  callback(artistSet);
}

var APIsongkick = function(artist, callback) {
  var concertSet = [{'city': 'London', 'date': '2017-02-11', 'price': 30}, {'city': 'Paris', 'date': '2017-02-11', 'price': 50}];
  callback(concertSet);
}

var APIskyscanner = require(path.join(dir.CONTROLLER, 'api-skyscanner.js'));

module.exports = function (req, res) {
  var origin = "Edinburgh";   //TODO guess by geolocalisation
  var artistRequested = req.query['artist'];

  console.log(artistRequested);
  APIspotify(artistRequested, artistSet => {
    artistSet.forEach(artist => {
      APIsongkick(artist, concertSet => {
        concertSet.forEach(concert => {
          var inboundDate = concert.date;   //TODO interval time for in/out bound
          var outboundDate = concert.date;
          APIskyscanner(origin, concert.city, inboundDate, outboundDate, flightSet => {
            console.log("------------------------------- NEW CONCERT -------------------------------");
            console.log(concert.price); //TODO send to client
            console.log(flightSet);
          });
        });
      });
    });
  });
  /*
  var destination = "Paris";

  var inboundDate = "2017-02-11";
  var outboundDate = "2017-02-11";

  console.log();*/


};
