var MongoClient = require('mongodb').MongoClient;
var passwordHash = require('password-hash');
const coordinatesModel = require("../models/coordinatesModel");

MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {

    if (err) throw err;
    var dbo = db.db("matcha");
    dbo.listCollections({ name: "users" })
        .next(function (err, collinfo) {
            if (!collinfo) {
                dbo.createCollection("users", function (err1, res) {
                    if (err1) throw err1;
                    console.log("Collection created!");
                    db.close();
                });
            }
        });
});

exports.register = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var hashedPassword = passwordHash.generate(req.body.pass, { algorithm: 'whirlpool', saltLength: 8, iterations: 1 });
        var myobj = { name: req.body.fname, surname: req.body.lname, email: req.body.email, username: req.body.username, password: hashedPassword, connected: [], viewed: [], liked: [], additional: {} };
        var query = { username: req.body.username };
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                dbo.collection("users").insertOne(myobj, function (err, res) {
                    if (err) { console.log("yeah reconnect bru"); throw err; }
                    console.log("1 document inserted");
                });
                res.sendStatus(200);
            }
            else {
                console.log("username exists");
                res.sendStatus(200);
            }
            db.close();
        });
    });
}

exports.homeMedia = (req, res, username) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, (err, db) => {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username };
        dbo.collection("media").find(query).toArray((err, result) => {
            if (err) throw err;
            // coordinatesModel.getLocation(res, result);
            // console.log(result);
            res.render('home', { pics: result });
        });
        db.close();
    });
}

exports.login = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, (err, db) => {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.body.username };
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("USERNAME IS DOESN'T EXIST");
            }
            else {
                // console.log("username: ", result[0]["username"]);
                // console.log("password: ", req.body.pass);
                // var hashedPassword = passwordHash.generate(req.body.pass, {algorithm: 'whirlpool', saltLength: 8, iterations: 1});
                if (passwordHash.verify(req.body.pass, result[0]["password"])) {
                    req.session.username = req.body.username;
                    //   console.log("yay");
                    exports.homeMedia(req, res, req.body.username);
                }
            }
            db.close();
        });
    });
}

exports.getUsersWithin10km = (req, res) => {
    var users = [];
    var current;
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        dbo.collection("users").find().toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("NO USERS FOUND!!!");
                res.send([]);
            }
            else {
                for (let index = 0; index < result.length; index++) {
                    if (req.session.username != result[index].username) {
                        users.push(result[index]); 
                    }
                    else {
                        current = result[index];
                    }
                }
                res.render('find', {users: users, me: current});
            }
            db.close();
        });
    });
}