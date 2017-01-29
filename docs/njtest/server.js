var http = require('http');
const PORT=8080;
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
  }
var server = http.createServer(handleRequest);
server.listen(PORT, function(){
console.log("Server listening on: http://localhost:%s", PORT);
})


function (artistRequested) {
  var unirest = require('unirest');
  var relatedArtist = new Array();

  var getSimilarArtists = function (singerId) {
    unirest.get("https://api.spotify.com/v1/artists/" + singerId + "/related-artists" )
        .end(function (response) {
                var SimilarArt_int = JSON.parse(response['raw_body'])["artists"];
                for (i = 0; i <= 4; i++){
                    var singer = SimilarArt_int[i]['name']
                    relatedArtist.push(singer);
                    }
        });
  };

  var Request = unirest.get("https://api.spotify.com/v1/search?q=" + artistRequested + "&type=artist&limit=1")
    .query('name=Artist')
    .end(function (response) {
        var singerId = JSON.parse(response['raw_body'])['artists']['items'][0]['id'];
        console.log(singerId)
        getSimilarArtists(singerId);
        });

};
