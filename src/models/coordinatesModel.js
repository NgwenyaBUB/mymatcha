
var request = require('request');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

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

exports.getLocation = (req, res) => {
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
            req.session.lat = obj.lat;
            req.session.lon = obj.lon;
            console.log('location', req.session.lat);
            MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("matcha");
                var query = { username: req.session.tempuser };
                var newvalues = {
                    $set: {
                        "additional.latitude": obj.lat,
                        "additional.longitude": obj.lon,
                    }
                };
                dbo.collection("users").updateOne(query, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("Like user");
                    console.log(res.result.nModified + " lcaotion(s) updated");
                    db.close();
                });
            });
        }
    })
}
