const userModel = require("../models/userModel");
const coordinatesModel = require("../models/coordinatesModel");
const homeModel = require("../models/homeModel");
const notifModel = require("../models/notificationsModel");
const msgModel = require("../models/messageModel");

exports.getLoginPage = (req, res, next) => {
  res.render("login", {error : null});
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
      notifModel.notifcount(req, res);
    }
  };

  exports.readNotifications = (req, res, next) => {
    if (!req.session.username)
    {
      res.send("0");
    }
    else {
      notifModel.closenotif(req, res);
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
    res.render('index', {error: null});
  }

  exports.notifications = (req, res, next) => {
    notifModel.getNotif(req, res);
  }

  exports.allNotifications = (req, res, next) => {
    notifModel.getAllNotif(req, res);
  }

  exports.complete = (req, res, next) => {
    userModel.validateRegistration(req, res);
  }

  exports.test = (req, res, next) => 
  {
    // req.session.tempuser = "umasiza123";
    coordinatesModel.getLocation(req, res);
    // msgModel.newUserEmail(req, res);
  }

  exports.resetpassemail = (req, res, next) => {
    msgModel.resetPassword(req, res);
  }

  exports.reset = (req, res, next) => {
    homeModel.checkReset(req, res);
  }

  exports.homereset = (req, res, next) => {
    req.session.username = req.body.username;
    msgModel.resetPassword(req, res);
  }