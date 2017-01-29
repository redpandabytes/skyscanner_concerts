/**
 ========================================================================================================
 Generic Imports
 ========================================================================================================
 **/

var path = require('path');
var dir = require('../../config/dir.js');
var ext = require( path.join(dir.CONFIG, 'ext.js') );
var cons = require( path.join(dir.CONFIG, 'cons.js') );

var getArtistIdByName = function(name, callback){
    var url_query = "http://api.songkick.com/api/3.0/search/artists.json?query=" + name + "&apikey=io09K9l3ebJxmxe2";
    ext.unirest.get(url_query)
        .end(function (response) {
            callback(response.body);
        });
}

var getEventsByID = function(id, callback){
    var url_query = "http://api.songkick.com/api/3.0/artists/" + id + "/calendar.json?apikey=io09K9l3ebJxmxe2";
    ext.unirest.get(url_query)
        .end(function (response) {
            callback(response.body);
        });
}

var getPriceByEventURL = function(url, callback){
    var url_query = url;
    ext.unirest.get(url_query)
        .end(function (response) {
            callback(response.body)
        });
}

/**
 ========================================================================================================
 Routing
 ========================================================================================================
 **/

module.exports = function (artist, callback) {
    //var name = "ed sheeran";
    //var id = 2083334; // ed sheeran
    getArtistIdByName(artist, function(response) {
        var artistID = response.resultsPage.results.artist[0].id;
        getEventsByID(artistID, function(response) {
            var ourResponse = [];
            var results = response.resultsPage.results;

            if (ext.isEmptyObject(results)) {
              return callback("Empty concertSet", null);
            }
            ext.async.forEach(results.event, function (item, next){
                console.log(item); // print the key
                getPriceByEventURL(item.uri, function (priceInfo) {
                  var scrappedPrice = 60;
                  console.log("Scraped info: " + scrappedPrice);
                  ourResponse.push({'date': item.start.date,
                      'artist' : artist,
                    'city': item.venue.metroArea.displayName,
                    'country': item.venue.metroArea.country.displayName,
                    'price': scrappedPrice
                  });
                  console.log("added");
                  // tell async that that particular element of the iterator is done
                  next()
                });
             }, function(err) {
                  callback(null, ourResponse);
                  console.log("Finished");
               });
            //
            // results.event.forEach( function(item) {
            //     getPriceByEventURL(item.uri, function (priceInfo){
            //       /*
            //         var document = jsdom(priceInfo);
            //         var window = document.defaultView();
            //         console.log(window.document.documentElement.outerHTML);*/
            //
            //         //if(htmlDoc.getElementsByClassName("price").length > 0)
            //         if(true) { //TODO
            //           var scrappedPrice = 60;
            //           console.log("Scraped info: " + scrappedPrice);
            //           ourResponse.push({'date': item.start.date,
            //             'city': item.venue.metroArea.displayName,
            //             'country': item.venue.metroArea.country.displayName,
            //             'price': scrappedPrice
            //           });
            //           console.log("added");
            //         }
            //
            //     });
            // }); //OK synchronous
            // console.log(ourResponse);
            // callback(null, ourResponse);
            // console.log("Finished");
        });

    });
};
