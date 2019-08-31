const userModel = require("../models/userModel");
const coordinatesModel = require("../models/coordinatesModel");
const homeModel = require("../models/homeModel");

exports.getLoginPage = (req, res, next) => {
  res.render("login");
};

exports.getHomePage = (req, res, next) => {
    // userModel.getUsersWithin10km('home', res);
    // coordinatesModel.getLocation();
    // console.log("wut");
    // res.render("home", {data: {city: "at home"}});
    // res.send(coordinatesModel.getLocation());
    userModel.homeMedia(req, res, req.session.username);
  };

  exports.getFindPage = (req, res, next) => {
    // res.render("find");
    userModel.getUsersWithin10km(req, res);
  };

  exports.getProfilePage = (req, res, next) => {
    homeModel.getMyProfile(req, res);
  };

  exports.getNotifications = (req, res, next) => {
    homeModel.notifcount(req, res);
  };

  exports.readNotifications = (req, res, next) => {
    homeModel.closenotif(req, res);
  };

  exports.completeprofile = (req, res, next) => {
    res.render('completeprofile');
  }

  exports.getUser = (req, res, next) => {
    userModel.user(req, res);
  }
