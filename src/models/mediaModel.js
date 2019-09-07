var MongoClient = require('mongodb').MongoClient;
//Move all picture related stuffs to here

exports.saveImages = (req, res, username) => {
    var imgs = req.body.picture.split("|");
    if (imgs.length > 0) {
        MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("matcha");
            for (let i = 0; i < imgs.length; i++) {
                if (imgs[i]) {
                    var myobj = {
                        "id": ""+ i,
                        "type": "picture",
                        "username": username,
                        "data": imgs[i],
                        "likes": [],
                        "viewed": []
                    }
                    dbo.collection("media").insertOne(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("added it");
                    })
                }
            }
        });
    }
}
