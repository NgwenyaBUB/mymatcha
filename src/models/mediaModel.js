var db = require("../databaseModel");

exports.saveImages = (req, res, username) => {
    var imgs = req.body.picture.split("|");
    if (imgs.length > 0) {
            var dbo = db.get().db("matcha")
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
                    dbo.collection("media").insertMany(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("added it");
                    })
                }
            }
    }
}

exports.getImage = (req, res) => {
    var dbo = db.get().db("matcha");
    var query = { username: req.query.username};
    dbo.collection("media").find(query).toArray((err, result) => {
        if (result.length > 0)
        {
            // res.set('Content-Type', "image/jpeg");
            res.send(result[0].data);
        }
        else {
            res.sendStatus(404);
        }
    });
}