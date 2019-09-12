var MongoClient = require('mongodb').MongoClient;

exports.closenotif = (req, resp) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.session.username, viewed: "false" };
        var newvalues = { $set: { "viewed": "true" } };
        dbo.collection("notifications").updateMany(query, newvalues, function (err, res) {
            if (err) throw err;
            // console.log(res.result.nModified +" document(s) updated");
            db.close();
            resp.send("done");
        });
    });
}

exports.notifcount = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.session.username, viewed: "false" };
        dbo.collection("notifications").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                // console.log("USERNAME IS DOESN'T EXIST", result);
                res.send("0");
            }
            else {
                // console.log(result);
                res.send("" + result.length);
            }
            db.close();
        });
    });
}

exports.addnotif = (req, res, query) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        let type = {
            like: "liked your picture with id " + query.id,
            unlike: "unliked your picture with id " + query.id,
            view: "viewed your profile",
            connect: "requested to connect with you",
            unconnect: "withdrew their requested to connect with you"
        }

        let myobj = {
            username: query.username,
            type: type[query.type],
            from: req.session.username,
            timestamp: Math.floor(Date.now() / 1000),
            viewed: "false"
        }

        dbo.collection("notifications").insertOne(myobj, function (err, res) {
            if (err) { console.log("yeah reconnect bru"); throw err; }
            console.log("1 notification inserted");
        });
    });
}

exports.getNotif = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.session.username, viewed: "false" };
        dbo.collection("notifications").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                res.send([]);
            }
            else {
                // console.log(result);
                res.send(result);
            }
            db.close();
        });
    });
}

exports.getAllNotif = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.session.username };
        dbo.collection("notifications").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                res.send([]);
            }
            else {
                // console.log(result);
                res.send(result);
            }
            db.close();
        });
    });
}

//ALl notifications/history