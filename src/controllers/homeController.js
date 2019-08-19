const userModel = require("../models/userModel");
const coordinatesModel = require("../models/coordinatesModel");


exports.getLoginPage = (req, res, next) => {
  res.render("login");
};

exports.getHomePage = (req, res, next) => {
    userModel.getUsersWithin10km('home', res);
    // coordinatesModel.getLocation();
    // console.log("wut");
    // res.render("home", {data: {city: "at home"}});
    // res.send(coordinatesModel.getLocation());
  };

  exports.getFindPage = (req, res, next) => {
    res.render("find");
  };

  exports.getProfilePage = (req, res, next) => {
    res.render("profile");
  };
