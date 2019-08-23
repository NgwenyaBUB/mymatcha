var MongoClient = require('mongodb').MongoClient;

exports.getAllMessages = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true , useUnifiedTopology: true}, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { "$or": [{
            from: "bngweny123",
            to: "bngweny69"
        }, {
            from: "bngweny69",
            to: "bngweny123"
        }]};
        dbo.collection("messages").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                // console.log("USERNAME IS DOESN'T EXIST", result);
                res.send("0");
            }
            else {
                res.send("" + result);
            }
            db.close();
        });
    });
}

exports.getMessageCount = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true , useUnifiedTopology: true}, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { to: "bngweny69", read:"false"};
        dbo.collection("messages").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                // console.log("USERNAME IS DOESN'T EXIST", result);
                res.send("0");
            }
            else {
                console.log("username", req.session.username);
                res.send("" + result.length);
            }
            db.close();
        });
    });
}

exports.sendMessage = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true , useUnifiedTopology: true}, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { to: "bngweny69", read:"false"};
        dbo.collection("messages").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                // console.log("USERNAME IS DOESN'T EXIST", result);
                res.send("0");
            }
            else {
                res.send("" + result.length);
            }
            db.close();
        });
    });
}