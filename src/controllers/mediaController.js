const mediaModel = require("../models/mediaModel");

exports.getPicture = (req, res, next) => {
  mediaModel.getImage(req, res);
}