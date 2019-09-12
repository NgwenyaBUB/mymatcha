// var MongoClient = require('mongodb').MongoClient;
var passwordHash = require('password-hash');
const coordinatesModel = require("../models/coordinatesModel");
const mediaModel = require("../models/mediaModel");
const notifModel = require("../models/notificationsModel");
const msgModel = require("../models/messageModel");
const homeModel = require("../models/homeModel");
var db = require("../databaseModel");
let fame = {};
let blocklist = [];

// MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.get().db("matcha")
//     dbo.listCollections({ name: "users" })
//         .next(function (err, collinfo) {
//             if (!collinfo) {
//                 dbo.createCollection("users", function (err1, res) {
//                     if (err1) throw err1;
//                     console.log("Collection created!");
//                     //
//                 });
//             }
//         });
// });

exports._calculateFame = () => {

        var dbo = db.get().db("matcha")
        dbo.collection("users").find().toArray((err, result) => {
            if (err) throw err;
            let highest = 0;
            for (const iterator of result) {
                fame[iterator.username] = iterator.viewed.length;
                if (iterator.viewed.length > highest) {
                    highest = iterator.viewed.length;
                }
            }
            for (const iterator of result) {
                fame[iterator.username] = (fame[iterator.username] / highest) * 100;
            }
        });

}

// exports._calculateFame();

exports.register = (req, res) => {
        var dbo = db.get().db("matcha")
        var hashedPassword = passwordHash.generate(req.body.pass, { algorithm: 'whirlpool', saltLength: 8, iterations: 1 });
        var myobj = {
            name: req.body.fname,
            surname: req.body.lname,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            connected: [],
            viewed: [],
            liked: [],
            blocklist: [],
            additional: {
            },
            lastseen: 0,
            status: "offline"
        };
        var query = { username: req.body.username };
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                dbo.collection("users").insertOne(myobj, function (err, result) {
                    if (err) { console.log("yeah reconnect bru"); throw err; }
                    console.log("1 user added");
                });
                req.session.tempuser = req.body.username;
                res.render('completeprofile');
            }
            else {
                console.log("username exists");
                res.render('login', { error: null });
            }
        });
}

exports.homeMedia = (req, res, username) => {
        var dbo = db.get().db("matcha")
        var query = { username: username };
        dbo.collection("media").find(query).toArray((err, result) => {
            if (err) throw err;
            res.render('home', { pics: result });
        });

}

exports.login = (req, res) => {
        exports._calculateFame();
        var query = { username: req.body.username };
        let col = db.get().db("matcha").collection("users");
        col.find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("USERNAME IS DOESN'T EXIST");
                res.render('login', { error: "USERNAME DOESN'T EXIST" });
            }
            else {
                if (passwordHash.verify(req.body.password, result[0]["password"])) {
                    if (!result[0]["additional"].sexualpreference) {
                        req.session.tempuser = req.body.username;
                        res.render('completeprofile')
                    } else
                        if (result[0]["complete"] > 0) {
                            res.render('login', { error: "Check Email to log in!" });
                        } else {
                            blocklist = result[0].blocklist;
                            req.session.username = req.body.username;
                            if (result[0].additional.sexualpreference == "both") {
                                req.session.sexualpreference = "both";
                            }
                            else if (result[0].additional.sexualpreference == "women") {
                                req.session.sexualpreference = "female";
                            }
                            else if (result[0].additional.sexualpreference == "men") {
                                req.session.sexualpreference
                                    = "male";
                            }
                            exports.changeStatus(req.session.username, "online");
                            exports.homeMedia(req, res, req.body.username);
                        }
                } else {
                    res.render('login', { error: "Wrong password!" });
                }
            }
        });
}

exports.changeStatus = (username, status) => {
        var dbo = db.get().db("matcha")
        var query = { username: username };
        var newvalues = { $set: { "status": status } };
        if (status == "offline") {
            var newvalues1 = { $set: { lastseen: Math.floor(Date.now() / 1000) } };
            dbo.collection("users").updateOne(query, newvalues1, function (err, res) {
                if (err) throw err;
                console.log(res.result.nModified + " lastseen status (s) updated");
            });
        }
        dbo.collection("users").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " online/offline document(s) updated");
        });
}

exports.getUsersWithin10km = (req, res) => {
    var users = [];
    var current;
        var dbo = db.get().db("matcha")
        var query = {
            "$or": [{
                'additional.gender': "male"
            }, {
                'additional.gender': "female"
            }, { "username": req.session.username }]
        };
        if (req.session.sexualpreference != "both") {
            query = {
                "$or": [{ "additional.gender": req.session.sexualpreference }, { "username": req.session.username }]
            }
        }
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("NO USERS FOUND!!!");
                res.send([]);
            }
            else {
                for (let index = 0; index < result.length; index++) {
                    if (req.session.username != result[index].username && !result[index].blocklist.includes(req.session.username)) {
                        users.push(result[index]);
                    }
                    else {
                        current = result[index];
                    }
                }
                res.render('find', { users: users, me: current });
            }
        });
}

exports.user = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.query.username };

        dbo.collection("users").find({username: req.session.username}).toArray(function (err, result) {
            blocklist = result[0].blocklist;
        })
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                res.render('user', { user: null, fame: fame, blocklist: blocklist });
            }
            else {
                if (req.query.username === req.session.username) {
                    res.render('profile', { me: result[0], fame: fame });
                }
                else {
                    var usr = result[0];
                    if (!usr.blocklist.includes(req.session.username)) {
                        dbo.collection("media").find(query).toArray((err, result1) => {
                            var favourite = [];
                            for (const iterator of result1) {
                                if (iterator.likes.indexOf(req.session.username) > -1) {
                                    favourite.push("favorite");
                                }
                                else {
                                    favourite.push("favorite_border");
                                }
                            }
                            var disabled = "disabled";
                            var liked = "Like"
                            if (usr.connected.includes(req.session.username)) {
                                disabled = "";
                            }
                            if (usr.liked.includes(req.session.username)) {
                                liked = "Unlike";
                            }
                            exports.visituser(req);
                            notifModel.addnotif(req, res, { type: "view", username: usr.username });
                            res.render('user', { user: usr, media: result1, likes: favourite, disabled: disabled, liked: liked, fame: fame, blocklist: blocklist  });
                        });
                    }
                    else {
                        homeModel.getMyProfile(req, res);
                    }
                }
            }
        });
}

exports.visituser = (req, res) => {
    exports._calculateFame();
        var dbo = db.get().db("matcha")
        var query = { username: req.query.username };
        var newvalues = { $addToSet: { viewed: req.session.username } };
        dbo.collection("users").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " document(s) updated View added ", req.query.username);
        });
}

exports.likepic = (req, resp) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.query.username, id: req.query.id };
        var newvalues = { $addToSet: { likes: req.session.username } };
        dbo.collection("media").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " pic like(s) updated");
            notifModel.addnotif(req, res, { type: "like", username: req.query.username, id: req.query.id });
            resp.sendStatus(200);
        });
}

exports.unlikepic = (req, resp) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.query.username, id: req.query.id };
        var newvalues = { $pull: { likes: req.session.username } };
        dbo.collection("media").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " unlike pic(s) updated");
            notifModel.addnotif(req, res, { type: "unlike", username: req.query.username, id: req.query.id });
            //
            resp.sendStatus(200);
        });
    // });
}

exports.unblockuser = (req, resp) => {
    // MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        // if (err) throw err;
        var dbo = db.get().db("matcha")
        var query = { username: req.session.username };
        var newvalues = { $pull: { blocklist: req.query.username } };
        dbo.collection("users").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " unblock(s) updated");
            //
        });
    // });
}

exports.blockuser = (req, resp) => {
    // MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        // if (err) throw err;
        var dbo = db.get().db("matcha")
        var query = { username: req.session.username };
        var newvalues = { $addToSet: { blocklist: req.query.username } };
        dbo.collection("users").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " block(s) updated");
            exports.unlikeUser(req, resp);
            //
        });
    // });
}

exports.getListUsers = (req, res) => {
    exports._calculateFame();
    // MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        // if (err) throw err;
        var dbo = db.get().db("matcha")
        var query = {
            "$or": [{
                'additional.gender': "male"
            }, {
                'additional.gender': "female"
            }, { "username": req.session.username }]
        };
        if (req.session.sexualpreference != "both") {
            query = {
                "$or": [{ "additional.gender": req.session.sexualpreference }, { "username": req.session.username }]
            }
        }
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("NO USERS FOUND!!!");
                res.send([]);
            }
            else {
                var users = [];
                for (let index = 0; index < result.length; index++) {
                    if (req.session.username != result[index].username && !result[index].blocklist.includes(req.session.username)) {
                        users.push(result[index]);
                    }
                }
                users = result;
                res.render('findlist', { users: users, fame: fame });
            }
        });
}

exports.findUsers = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.body.search };
        if (req.body.group1 == "tags") {
            exports.findByTag(req, res);
        }
        else if (req.body.group1 == "age") {
            exports.findByAge(req, res);
        }
        else if (req.body.group1 == "location") {
            exports.findByLocation(req, res);
        }
        else {
            dbo.collection("users").find().toArray(function (err, result) {
                if (err) throw err;
                if (result.length == 0) {
                    console.log("USERNAME IS DOESN'T EXIST");
                    res.render('findlist', { users: [], fame: fame });
                }
                else {
                    console.log(req.body);
                    var users = [];
                    for (const iterator of result) {
                        if (iterator.username.includes(req.body.search) && !iterator.blocklist.includes(req.session.username)) {
                            users.push(iterator);
                        }
                    }
                    res.render('findlist', { users: users, fame: fame });
                }
            });
        }
}

exports.findByTag = (req, res) => {
        var dbo = db.get().db("matcha")
        dbo.collection("users").find().toArray(function (err, result) {
            var users = [];
            for (const iterator of result) {
                if (iterator.username != req.session.username && !iterator.blocklist.includes(req.session.username)) {
                    for (const tag of iterator.additional.tags) {
                        if (tag.toLowerCase().includes(req.body.search.toLowerCase())) {
                            users.push(iterator);
                            break;
                        }
                    }
                }
            }
        res.render('findlist', { users: users, fame: fame });
        });
}

exports.findByLocation = (req, res) => {
        var dbo = db.get().db("matcha")
        dbo.collection("users").find().toArray(function (err, result) {
            var users = [];
            for (const iterator of result) {
                if (iterator.username != req.session.username && !iterator.blocklist.includes(req.session.username)) {
                    if (iterator.additional.userlocation.toLowerCase().includes(req.body.search.toLowerCase())) {
                        users.push(iterator);
                    }
                }
            }
                res.render('findlist', { users: users, fame: fame });
            });
}

exports._calculateAge = function (birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

exports.findByAge = (req, res) => {
        var dbo = db.get().db("matcha")
        dbo.collection("users").find().toArray(function (err, result) {
            var outusers = [];
            for (const iterator of result) {
                if (iterator.username != req.session.username && !iterator.blocklist.includes(req.session.username)) {
                    if (exports._calculateAge(new Date(iterator.additional.dob)) == req.body.search) {
                        outusers.push(iterator);
                    }
                }
            }
                res.render('findlist', { users: outusers, fame: fame });
            });
}

exports.sortByAge = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = {
            "$or": [{
                'additional.gender': "male"
            }, {
                'additional.gender': "female"
            }, { "username": req.session.username }]
        };
        if (req.session.sexualpreference != "both") {
            query = {
                "$or": [{ "additional.gender": req.session.sexualpreference }, { "username": req.session.username }]
            }
        }
        dbo.collection("users").find(query).toArray(function (err, result) {
            var outusers = [];
            var temp = result;
            temp = temp.filter((iterator) => {return !iterator.blocklist.includes(req.session.username)});
            outusers = temp.sort(function (a, b) {
                var ageA = exports._calculateAge(new Date(a.additional.dob));
                var ageB = exports._calculateAge(new Date(b.additional.dob));
                return (ageA > ageB ? 1 :
                    ageA == ageB ? 0 : -1);
            });
                res.render('findlist', { users: outusers, fame: fame });
        });
}

exports.sortByTags = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = {
            "$or": [{
                'additional.gender': "male"
            }, {
                'additional.gender': "female"
            }, { "username": req.session.username }]
        };
        if (req.session.sexualpreference != "both") {
            query = {
                "$or": [{ "additional.gender": req.session.sexualpreference }, { "username": req.session.username }]
            }
        }
        dbo.collection("users").find(query).toArray(function (err, result) {
            var outusers = [];
            var temp = result;
            temp = temp.filter((iterator) => {return !iterator.blocklist.includes(req.session.username)});
            outusers = temp.sort(function (a, b) {
                var tagA = a.additional.tags.length;
                var tagB = b.additional.tags.length;
                return (tagA < tagB ? 1 :
                    tagA == tagB ? 0 : -1);
            });
                res.render('findlist', { users: outusers, fame: fame });
            });
}

exports.sortByRating = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = {
            "$or": [{
                'additional.gender': "male"
            }, {
                'additional.gender': "female"
            }, { "username": req.session.username }]
        };
        if (req.session.sexualpreference != "both") {
            query = {
                "$or": [{ "additional.gender": req.session.sexualpreference }, { "username": req.session.username }]
            }
        }
        dbo.collection("users").find(query).toArray(function (err, result) {
            var outusers = [];
            var temp = result;
            temp = temp.filter((iterator) => {return !iterator.blocklist.includes(req.session.username)});
            outusers = temp.sort((a, b) => {
                var tagA = a.viewed.length;
                var tagB = b.viewed.length;
                return (tagA < tagB ? 1 :
                    tagA == tagB ? 0 : -1);
            });
                res.render('findlist', { users: outusers, fame: fame });
        });
}

exports.sortByLocation = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = {
            "$or": [{
                'additional.gender': "male"
            }, {
                'additional.gender': "female"
            }, { "username": req.session.username }]
        };
        if (req.session.sexualpreference != "both") {
            query = {
                "$or": [{ "additional.gender": req.session.sexualpreference }, { "username": req.session.username }]
            }
        }
        let user;
        dbo.collection("users").find({username : req.session.username}).toArray(function (err, result) {
            user = result[0];
        })
        dbo.collection("users").find(query).toArray(function (err, result) {
            var outusers = [];
            var temp = result;
            temp = temp.filter((iterator) => {return !iterator.blocklist.includes(req.session.username)});
            outusers = temp.sort(function (a, b) {
                var tagA = coordinatesModel.getDistance({ lat: a.additional.latitude, lon: a.additional.longitude }, { lat: user.additional.latitude, lon: user.additional.longitude });
                var tagB = coordinatesModel.getDistance({ lat: b.additional.latitude, lon: b.additional.longitude }, { lat: user.additional.latitude, lon: user.additional.longitude  });
                return (tagA < tagB ? 1 :
                    tagA == tagB ? 0 : -1);
            });
                res.render('findlist', { users: outusers, fame: fame });
            });
}

exports.likeUser = (req, resp) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.query.username };
        var newvalues = { $addToSet: { liked: req.session.username } };
        dbo.collection("users").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            if (res.result.nModified > 0)
            {
                console.log(res.result.nModified + " user liked");
                exports.connect(req.query.username, req.session.username);
                notifModel.addnotif(req, res, { type: "connect", username: query.username });
            }
            resp.sendStatus(200);
        });
}

exports.unlikeUser = (req, resp) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.query.username };
        var newvalues = { $pull: { liked: req.session.username } };
        dbo.collection("users").updateOne(query, newvalues, function (err, res) {
            if (err) throw err;
            if (res.result.nModified > 0)
            {
                console.log(res.result.nModified + " user unliked");
                exports.disconnect(req.query.username, req.session.username);
                notifModel.addnotif(req, res, { type: "unconnect", username: query.username });
            }
        });
}

exports.connect = (username1, username2) => {
        var dbo = db.get().db("matcha")
        var query = {
            "$or": [{
                username: username1,
            }, {
                username: username2,
            }]
        };
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length < 2) {
            }
            else {
                if ((result[0].liked.includes(username1) && result[1].liked.includes(username2)) || (result[1].liked.includes(username1) && result[0].liked.includes(username2))) {
                    var query1 = { username: username2 };
                    var query2 = { username: username1 };
                    var newvalues1 = { $addToSet: { connected: username1 } };
                    var newvalues2 = { $addToSet: { connected: username2 } };
                    dbo.collection("users").updateMany(query1, newvalues1, function (err, res) {
                        console.log(res.result.nModified + " document(s) updated", " connected");
                    });
                    dbo.collection("users").updateMany(query2, newvalues2, function (err, res) {
                        console.log(res.result.nModified + " document(s) updated", " connected");
                    });
                }
            }
        });
}

exports.disconnect = (username1, username2) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.get().db("matcha")
        var query1 = { username: username1 };
        var query2 = { username: username2 };

        var newvalues1 = { $pull: { connected: username2 } };
        var newvalues2 = { $pull: { connected: username1 } };

        dbo.collection("users").updateOne(query1, newvalues1, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " disconnected (s) updated");
        });

        dbo.collection("users").updateOne(query2, newvalues2, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " disconnected(s) updated");

        });
        //
    });
}

exports.complete = (req, res) => {
    if (!req.body.gender || !req.body.sexual || !req.body.bio || !req.body.location || !req.body.birthdate) {
        res.render('index', { error: "OOPS Something went wrong. Please try that again." });
    }
    else {
            var dbo = db.get().db("matcha")
            var query = { username: req.session.tempuser };
            var newvalues = {
                $set: {
                    additional: {
                        gender: req.body.gender,
                        sexualpreference: req.body.sexual,
                        bio: req.body.bio,
                        tags: req.body.tagsinput.split(","),
                        userlocation: req.body.location,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                        dob: req.body.birthdate
                    },
                    complete: Math.trunc(Math.random() * 100000000000000000)
                }
            };
            if (!req.session.tempuser) {
                res.render('index', { error: "You are not logged in" });
            }
            else {
                dbo.collection("users").updateOne(query, newvalues, function (err, resp) {
                    if (err) throw err;
                    mediaModel.saveImages(req, res, req.session.tempuser);
                    console.log(resp.result.nModified + " profile complete(s) updated");
                });
                msgModel.newUserEmail(req, res);
                if (!req.body.latitude || !req.body.longitude) {
                    coordinatesModel.getLocation(req, res);
                }
                res.render('login', { error: "Check email to complete registration!" });
            }
    }
}

exports.updateadditional = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.session.username };
        var newvalues = {
            $set: {
                "additional.gender": req.body.gender,
                'additional.sexualpreference': req.body.sexual,
                'additional.bio': req.body.bio,
                'additional.userlocation': req.body.location
            }
        }
        dbo.collection("users").updateOne(query, newvalues, function (err, resp) {
            if (err) throw err;
            console.log(resp.result.nModified + " update addittional(s) updated");
            homeModel.getMyProfile(req, res);
        });
}

exports.updateUser = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.session.username };
        var newvalues = {
            $set: {
                name: req.body.fname,
                surname: req.body.lname,
                email: req.body.email,
                username: req.body.username,
            }
        }
        dbo.collection("users").updateOne(query, newvalues, function (err, resp) {
            if (err) throw err;
            console.log(resp.result.nModified + " user(s) updated");
            homeModel.getMyProfile(req, res);
        });
}

exports.validateRegistration = (req, res) => {
        var dbo = db.get().db("matcha")
        var query = { username: req.query.username };
        dbo.collection("users").find(query).toArray((err, result1) => {
            if (result1.length < 1) {
                res.render('index', { error: "Something went wrong" });
            }
            else {
                if (result1[0].complete != req.query.id) {
                    res.render('index', { error: "Invalid Registration token. Check your email or contact info@matcha.com for help" });
                }
                else {
                    let newvalues = {
                        $set: {
                            complete: -1
                        }
                    }
                    dbo.collection("users").updateOne(query, newvalues, function (err, resp) {
                        if (err) throw err;
                        res.render('login', { error: 'Registration Successful' });
                    });
                }
            }
        })
}

exports.resetPassword = (req, res) => {
        var dbo = db.get().db("matcha")
        if (req.body.confirmpassword != req.body.pass) {
            res.render('index', { error: "Passwords didnt match! Reset failed" });
        }
        else {
            var hashedPassword = passwordHash.generate(req.body.pass, { algorithm: 'whirlpool', saltLength: 8, iterations: 1 });
            var query = { username: req.body.username };
            var newvalues = {
                $set: {
                    password: hashedPassword,
                    complete: -1
                }
            }
            dbo.collection("users").updateOne(query, newvalues, function (err, resp) {
                if (err) throw err;
                res.render('index', { error: "Reset Successful" });
            });
        }
}

