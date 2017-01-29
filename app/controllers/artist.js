/**
========================================================================================================
  Generic Imports
========================================================================================================
**/

var path = require('path');
var dir = require('../../config/dir.js');
var ext = require( path.join(dir.CONFIG, 'ext.js') );
var cons = require( path.join(dir.CONFIG, 'cons.js') );

/**
========================================================================================================
  Routing
========================================================================================================
**/


//var artistSet = ["Ed Sheeran", "Calvin Harris"];
//callback(artistSet);
/*
var APIsongkick = function(artist, callback) {
  var concertSet = [{'city': 'London', 'date': '2017-02-11', 'price': 30}, {'city': 'Paris', 'date': '2017-02-11', 'price': 50}];
  callback(concertSet);
}*/
var APIspotify = require(path.join(dir.CONTROLLER, 'api-spotify.js'));
var APIsongkick = require(path.join(dir.CONTROLLER, 'api-songkick.js'));
var APIskyscanner = require(path.join(dir.CONTROLLER, 'api-skyscanner.js'));

/*
var adventuresFeed = pusher.feed('adventures');
adventuresFeed.subscribe({
  onOpen: () => console.log('Connection established'),
  onItem: item => console.log('Item:', item),
  onError: error => console.error('Error:', error),
});*/

var updateFeed = function(data) {
  var options = { method: 'POST',
    url: 'https://api.private-beta-1.pusherplatform.com:443/apps/' + cons.API_KEY_PUSHER + '/feeds/adventures',
    body: { items: data },  //[ { message: 'test' }, { message: 'testy' } ]
    json: true };

  ext.request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });

  var options2 = { method: 'POST',
    url: 'https://api.private-beta-1.pusherplatform.com:443/apps/' + cons.API_KEY_PUSHER + '/feeds/livesearch',
    body: { items: data },  //[ { message: 'test' }, { message: 'testy' } ]
    json: true };

  ext.request(options2, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}

var getCarrierNameFromId =  function (id, carriers) {
  for (var i = 0; i < carriers.length; i++) {
    if (id == carriers[i]['CarrierId']) {
      return carriers[i]['Name'];
    }
  }
  return "Unknown";
}

var updateLiveSearches = function(data) {
  var options = { method: 'POST',
    url: 'https://api.private-beta-1.pusherplatform.com:443/apps/' + cons.API_KEY_PUSHER + '/feeds/livesearch',
    body: { items: data },  //[ { message: 'test' }, { message: 'testy' } ]
    json: true };

  ext.request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}


module.exports = function (req, res) {
  var origin = "Edinburgh";   //TODO guess by geolocalisation
  var artistRequested = req.query['artist'];
  console.log(artistRequested);

  APIspotify(artistRequested, artistSet => {
    artistSet.forEach(artist => {
      APIsongkick(artist, (err, concertSet) => {
        if (err) {
          console.log(err);
          return;
        }

        //redirect results page
        res.sendFile(path.join(dir.VIEW, 'results.html'));

        //update feed
        concertSet.forEach(concert => {
          var inboundDate = concert.date;   //TODO interval time for in/out bound
          var outboundDate = concert.date;
          APIskyscanner(origin, concert.city, inboundDate, outboundDate, flightSet => {
            console.log("------------------------------- NEW CONCERT -------------------------------");
            console.log(require('util').inspect(flightSet, { depth: null }));
            //console.log(require('util').inspect(flightSet.Quotes, { depth: null }));

            if (("Quotes" in flightSet) && ("Carriers" in flightSet) && !ext.isEmptyObject(flightSet.Quotes) && !ext.isEmptyObject(flightSet.Carriers)) {  //if there are flights possible
              var flight = flightSet.Quotes[0]; //TODO sort price
              var carriers = flightSet.Carriers;
              var data = {};
              if (("InboundLeg" in flight)) {
                data = {'concert': {
                  'date': concert.date,
                  'city': concert.city,
                  'country': concert.country,
                  'price': concert.price
                  },
                  'flights': {
                    'carrier': getCarrierNameFromId(flight.InboundLeg.CarrierIds[0], carriers),
                    'origin': origin,
                    'destination': concert.city,
                    'date': flight.InboundLeg.DepartureDate,
                    'price': flight.MinPrice
                  }
                };

                console.log("DATAAAAAAAA");
                console.log(data);
                updateFeed([data]);
              }
              else if (("OutboundLeg" in flight)) {
                data = {'concert': {
                  'date': concert.date,
                  'city': concert.city,
                  'country': concert.country,
                  'price': concert.price
                  },
                  'flights': {
                    'carrier': getCarrierNameFromId(flight.OutboundLeg.CarrierIds[0], carriers),
                    'origin': origin,
                    'destination': concert.city,
                    'date': flight.OutboundLeg.DepartureDate,
                    'price': flight.MinPrice
                  }
                };

                console.log("DATAAAAAAAA");
                console.log(data);
                updateFeed([data]);
              }
            }
            //console.log(require('util').inspect(flightSet, { depth: null }));
            //console.log(flightSet);
          });
        });
      });
    });
  });
};
