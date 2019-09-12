var MongoClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');
var mail = require("../config/nodemailer.js");
const userModel = require("../models/userModel");

exports.getAllMessages = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = {
            "$or": [{
                from: req.session.username,
                to: req.query.username
            }, {
                from: req.query.username,
                to: req.session.username
            }]
        };
        dbo.collection("messages").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                res.send([]);
            }
            else {
                res.send(result);
            }
            db.close();
        });
    });
}

exports.getMessageCount = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { to: req.session.username, read: "false" };
        dbo.collection("messages").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                res.send("0");
            }
            else {
                res.send("" + result.length);
            }
            db.close();
        });
    });
}

exports.sendMessage = (req, resp) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var myobj = {
            from: req.session.username,
            to: req.body.to,
            read: "false",
            text: req.body.text,
            timestamp: Math.floor(Date.now() / 1000)
        };
        dbo.collection("messages").insertOne(myobj, function (err, res) {
            if (err) { console.log("yeah msg sent bru"); throw err; }
            console.log("1 document inserted");
            resp.sendStatus(200);
        });
        db.close();
    });
}

exports.readMessage = (req, resp) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { to: req.session.username, from: req.query.username };
        var newvalues = { $set: { read: "true" } };
        dbo.collection("messages").updateMany(query, newvalues, function (err, res) {
            if (err) { console.log(" bru"); throw err; }
            console.log(res.result.nModified + " document(s) updated");
            resp.sendStatus(200);
        })
    });
}

exports.getChat = (req, res) => {

    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.session.username };
        dbo.collection("users").find().toArray((err, result1) => {
            var myusers;
            var mymedia = {};
            var allusers = {};
            if (err) throw err;
            for (const iterator of result1) {
                if (iterator.username == req.session.username) {
                    myusers = iterator;
                }
                else {
                    allusers[iterator.username] = iterator;
                }
            }
            // dbo.collection("media").find().toArray((err, result) => {
            //     if (err) throw err;
            //     for (const iterator of result) {
            //         mymedia[iterator.username] = iterator;
            //     }
            //     db.close();
                res.render('chat', { users: myusers.connected, allusers: allusers });
            });
        });
    // });
}

exports.sendEmail = (req, res, messages) => {
    var transporter = nodemailer.createTransport(mail.credentials);
    var email = {
        to: messages.to,
        sbj: messages.subject,
        msj: messages.text
    };

    transporter.sendMail(mail.options(email.to, email.sbj, email.msj), function (err, info) {
        if (err) throw err;
        console.log("msg email sent");
    });
}

exports.newUserEmail = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.session.tempuser };
        dbo.collection("users").find(query).toArray((err, result1) => {
            exports.sendEmail(req, res, {
                to: result1[0].email,
                subject: "Complete Registration",
                text: "Click on this <a href=http://localhost:3000/complete?username=" + req.session.tempuser + "&id=" + result1[0].complete + ">link</a> to complete your registration"
            });
        })
    })
}

exports.resetPassword = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: req.session.username };
        let num = Math.trunc(Math.random() * 100000000000000000);
        dbo.collection("users").find(query).toArray((err, result1) => {
            exports.sendEmail(req, res, {
                to: result1[0].email,
                subject: "Reset password",
                text: "Click on this <a href=http://localhost:3000/reset?username=" + req.session.username + "&id=" + num + ">link</a> to complete your reset your password"
            });

            var newvalues = {
                $set: {
                    complete: num
                }
            }
            dbo.collection("users").updateOne(query, newvalues, function (err, resp) {
                if (err) throw err;
                console.log(resp.result.nModified + " document(s) updated");
                userModel.changeStatus(req.session.username, "offline");
                req.session.username = "";
                res.render('index', { error: "go to email to reset password" });
            });
        })
    })
} 