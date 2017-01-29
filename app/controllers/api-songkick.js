/**
 ========================================================================================================
 Generic Imports
 ========================================================================================================
 **/

var path = require('path');
var dir = require('../../config/dir.js');
var ext = require( path.join(dir.CONFIG, 'ext.js') );
var cons = require( path.join(dir.CONFIG, 'cons.js') );
var DOMParser = require("jsdom").jsdom;


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
    var name = "ed sheeran";
    var id = 2083334; // ed sheeran

    getArtistIdByName(name, function(response) {
        console.log(response.resultsPage.results.artist[0].id);
        // res.sendFile(path.join(dir.VIEW, 'home.html'));
    });

    getEventsByID(id, function(response) {
        var ourResponse = [];
        response.resultsPage.results.event.forEach( function(item) {
            getPriceByEventURL(item.uri, function (priceInfo){
                var document = jsdom(priceInfo);
                var window = document.defaultView();
                console.log(window.document.documentElement.outerHTML);

                // if(htmlDoc.getElementsByClassName("price").length > 0){
                //     // console.log("Scraped info: " + priceInfo);
                //     // console.log(priceInfo.gettype());
                //     // ourResponse.push({'date': item.start.date,
                //     //     'city': item.venue.metroArea.displayName,
                //     //     'country': item.venue.metroArea.country.displayName
                //     // });
                //     console.log("found something with price info")
                // }

            });
        });
        console.log(ourResponse);
        console.log("Finished");
    });
};
