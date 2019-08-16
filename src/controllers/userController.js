const userModel = require("../models/userModel");

exports.getUserController = (req, res, next) => {
  const succ = userModel.login(req);
  console.log(succ, " : done");
//  res.render("menu", { meals });
    res.send("done");
};

exports.getRegisterController = (req, res, next) => {
    userModel.register(req);
    console.log(succ, " : done");
  //  res.render("menu", { meals });
      res.send("done");
  };