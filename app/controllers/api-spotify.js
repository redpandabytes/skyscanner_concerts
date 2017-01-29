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

var getSimilarArtists = function (artistRequested, singerId, callback) {
  var relatedArtists = new Array();
  ext.unirest.get("https://api.spotify.com/v1/artists/" + singerId + "/related-artists" )
      .end(function (response) {
              var maxNumArt = 4;
              var similarArt_id = JSON.parse(response['raw_body'])["artists"];
              for (i = 0; i <= maxNumArt; i++) {
                var singer = similarArt_id[i]['name']
                relatedArtists.push(singer);
              }
              relatedArtists.push(artistRequested); //original one
              callback(relatedArtists);
      });
};

module.exports = function (artistRequested, callback) {

  var Request = ext.unirest.get("https://api.spotify.com/v1/search?q=" + artistRequested + "&type=artist&limit=1")
  .query('name=Artist')
  .end(function (response) {
      var singerId = JSON.parse(response['raw_body'])['artists']['items'][0]['id'];
      console.log(singerId)
      getSimilarArtists(artistRequested, singerId, function(relatedArtists) {
        callback(relatedArtists);
      });
  });

};
