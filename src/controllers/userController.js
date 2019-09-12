const userModel = require("../models/userModel");

exports.getUserController = (req, res, next) => {
  const succ = userModel.login(req, res);
  // console.log(succ, " : done");
  //  res.render("menu", { meals });
  // res.send("done");
};

exports.getRegisterController = (req, res, next) => {
  userModel.register(req, res);
  // console.log(succ, " : done");
  //  res.render("menu", { meals });
};

exports.getUsersWithin10kms = (req, res, next) => {
  if (!req.session.username) {
    res.render('index', { error: 'You are not logged in' });
  }
  else {
    userModel.getUsersWithin10km(req, res);
  }
}

exports.likePic = (req, res, next) => {
  userModel.likepic(req, res);
}

exports.unlikePic = (req, res, next) => {
  userModel.unlikepic(req, res);
}

exports.findUsers = (req, res, next) => {
  if (!req.session.username) {
    res.render('index', { error: 'You are not logged in' });
  }
  else {
    userModel.findUsers(req, res);
  }
}

exports.likeUser = (req, res, next) => {
  userModel.likeUser(req, res);
}

exports.unlikeUser = (req, res, next) => {
  userModel.unlikeUser(req, res);
}

exports.complete = (req, res, next) => {
  userModel.complete(req, res);
}

exports.sortbyage = (req, res, next) => {
  if (!req.session.username) {
    res.render('index', { error: 'You are not logged in' });
  }
  else {
    userModel.sortByAge(req, res);
  }
}

exports.sortbytags = (req, res, next) => {
  if (!req.session.username) {
    res.render('index', { error: 'You are not logged in' });
  }
  else {
    userModel.sortByTags(req, res);
  }
}

exports.sortbylocation = (req, res, next) => {
  if (!req.session.username) {
    res.render('index', { error: 'You are not logged in' });
  }
  else {
    userModel.sortByLocation(req, res);
  }
}

exports.sortbyrating = (req, res, next) => {
  if (!req.session.username) {
    res.render('index', { error: 'You are not logged in' });
  }
  else {
    userModel.sortByRating(req, res);
  }
}

exports.visit = (req, res, next) => {
  userModel.visituser(req, res);
}

exports.resetPass = (req, res, next) => {
  userModel.resetPassword(req, res);
}

exports.updateProfile = (req, res, next) => {
  userModel.updateUser(req, res);
}

exports.updateAdditional = (req, res, next) => {
  userModel.updateadditional(req, res);
}

exports.block = (req, res, next) => {
  userModel.blockuser(req, res);
}

exports.unblock = (req, res, next) => {
  userModel.unblockuser(req ,res);
}