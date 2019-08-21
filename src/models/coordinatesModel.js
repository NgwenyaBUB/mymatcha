
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

exports.getLocation = (res, media) => {
  // var location = {city : "", latitude: "", longitude: ""};
    // var url = 'http://api.ipstack.com/check?access_key=03cc3fd4e61ce21f0324f328b0a7e67c';
    var url = 'http://ip-api.com/json';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body) // Print the google web page.
            // console.log(this);
            var obj = JSON.parse(body);
            // location.city = obj.city;
            // location.latitude = obj.latitude;
            // location.longitude = obj.longitude;
            // console.log(location);
            // res.send(obj);
            console.log("media", media[0].data);
            res.render('home', { data: obj, pics: media[0]});
        }
    })
}

exports.handler = function(req, res) {
  // var location = {city : "", latitude: "", longitude: ""};
  //   async.parallels([
  //     /*
  //      * First external endpoint
  //      */
  //     function(callback) {
  //       var url = 'http://api.ipstack.com/check?access_key=03cc3fd4e61ce21f0324f328b0a7e67c';
  //       request(url, function(err, response, body) {
  //         // JSON body
  //         if(err) { console.log(err); callback(true); return; }
  //         obj = JSON.parse(body);
  //         location.city = obj.city;
  //           location.latitude = obj.latitude;
  //           location.longitude = obj.longitude;
  //         callback(false, obj);
  //       });
  //     },
  //   ],
  //   /*
  //    * Collate results
  //    */
  //   function(err, results) {
  //     if(err) { console.log(err); res.send(500,"Server Error"); return; }
  //     // res.send({api1:results[0]});
  //   }
  //   );
  };