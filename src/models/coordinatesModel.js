
var request = require('request');
var async = require('async');

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

exports.getDistance = (pointA, pointB) => {
    return distanceInKmBetweenEarthCoordinates(pointA.lat, pointA.lon, pointB.lat, pointB.lon);
}

exports.getLocation = () => {
    var location ={city:  "", longitude: 0, latitude: 0};
    var url = 'http://api.ipstack.com/check?access_key=03cc3fd4e61ce21f0324f328b0a7e67c';
    request.get(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            // console.log(body) // Print the google web page.
            console.log(this);
            var obj = JSON.parse(body);
            location.city = body.city;
            location.latitude = body.latitude;
            location.longitude = body.longitude;
        }
    })
    // setTimeout(2000);
    return location;
}

exports.handler = function(req, res) {
    async.parallels([
      /*
       * First external endpoint
       */
      function(callback) {
        var url = "http://external1.com/api/some_endpoint";
        request(url, function(err, response, body) {
          // JSON body
          if(err) { console.log(err); callback(true); return; }
          obj = JSON.parse(body);
          callback(false, obj);
        });
      },
      /*
       * Second external endpoint
       */
      function(callback) {
        var url = "http://external2.com/api/some_endpoint";
        request(url, function(err, response, body) {
          // JSON body
          if(err) { console.log(err); callback(true); return; }
          obj = JSON.parse(body);
          callback(false, obj);
        });
      },
    ],
    /*
     * Collate results
     */
    function(err, results) {
      if(err) { console.log(err); res.send(500,"Server Error"); return; }
      res.send({api1:results[0], api2:results[1]});
    }
    );
  };