const userModel = require("../models/userModel");

exports.getUserController = (req, res, next) => {
  const succ = userModel.login(req, res);
  // console.log(succ, " : done");
//  res.render("menu", { meals });
    // res.send("done");
};

exports.getRegisterController = (req, res, next) => {
    userModel.register(req);
    // console.log(succ, " : done");
  //  res.render("menu", { meals });
      res.send("done");
  };

exports.getUsersWithin10kms = (req, res, next) => {
  userModel.getUsersWithin10km(req, res);
}