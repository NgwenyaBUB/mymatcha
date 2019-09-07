const userModel = require("../models/userModel");
const coordinatesModel = require("../models/coordinatesModel");
const homeModel = require("../models/homeModel");

exports.getLoginPage = (req, res, next) => {
  res.render("login");
};

exports.getHomePage = (req, res, next) => { 
    if (!req.session.username)
    {
      res.render('index', {error : 'You are not logged in'});
    }
    else
    {
      userModel.homeMedia(req, res, req.session.username);
    }
  };

  exports.getFindPage = (req, res, next) => {
    // res.render("find");
    if (!req.session.username)
    {
      res.render('index', {error : 'You are not logged in'});
    }else
    {
      userModel.getUsersWithin10km(req, res);
    }
  };

  exports.getFindListPage = (req, res, next) => {
    // res.render("find");
    if (!req.session.username)
    {
      res.render('index', {error : 'You are not logged in'});
    }else {
      userModel.getListUsers(req, res);
    }
  };

  exports.getProfilePage = (req, res, next) => {
    if (!req.session.username)
    {
      res.render('index', {error : 'You are not logged in'});
    }
    else {
      homeModel.getMyProfile(req, res);
    }
  };

  exports.getNotifications = (req, res, next) => {
    if (!req.session.username)
    {
      res.send("0");
    }
    else {
      homeModel.notifcount(req, res);
    }
  };

  exports.readNotifications = (req, res, next) => {
    if (!req.session.username)
    {
      res.send("0");
    }
    else {
      homeModel.closenotif(req, res);
    }
  };

  exports.completeprofile = (req, res, next) => {
    res.render('completeprofile');
  }

  exports.getUser = (req, res, next) => {
    if (!req.session.username)
    {
      res.render('index', {error : 'You are not logged in'});
    }
    else {
      userModel.user(req, res);
    }
  }

  exports.logout = (req, res, next) => {
    userModel.changeStatus(req.session.username, "offline");
    req.session.username = "";
    res.render('index');
  }
