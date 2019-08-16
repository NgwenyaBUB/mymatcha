var MongoClient = require('mongodb').MongoClient;
var passwordHash = require('password-hash');

MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, function (err, db) {
// MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {

    if (err) throw err;
    var dbo = db.db("matcha");
    dbo.listCollections({name: "users"})
    .next(function(err, collinfo) {
        if (!collinfo) {
            dbo.createCollection("users", function(err1, res) {
                if (err1) throw err1;
                console.log("Collection created!");
                db.close();
            });
        }
    });
});

exports.register = (req) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, function(err, db) {
// MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var hashedPassword = passwordHash.generate(req.body.pass, {algorithm: 'whirlpool', saltLength: 8, iterations: 1});
        var myobj = { name: req.body.fname, surname: req.body.lname, email: req.body.email, username: req.body.username, password: hashedPassword};
        var query = {username: req.body.username};
        dbo.collection("users").find(query).toArray(function(err, result){
            if (err) throw err;
            if (result.length == 0)
            {       
                dbo.collection("users").insertOne(myobj, function(err, res) {
                    if (err) {console.log("yeah reconnect bru"); throw err;}
                    console.log("1 document inserted");
                });
            }
            else
            {
                console.log("username exists");
            }
        db.close();
        });
      });
}

exports.login = (req, res) => {
    var succ = false;
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, function(err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("matcha");  
            var query = {username: req.body.username};
            dbo.collection("users").find(query).toArray(function(err, result){
                if (err) throw err;
                if (result.length == 0)
                {
                    console.log("USERNAME IS DOESN'T EXIST");
                }
                else
                {
                    console.log("username: ", result[0]["username"]);
                    console.log("password: ", req.body.pass);
                    // var hashedPassword = passwordHash.generate(req.body.pass, {algorithm: 'whirlpool', saltLength: 8, iterations: 1});
                    if(passwordHash.verify(req.body.pass, result[0]["password"]))
                    {
                      console.log("yay");
                      res.render('home');
                      succ = true;
                    }
                }
                db.close();
            });
        });
    return  succ;
}