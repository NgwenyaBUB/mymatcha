const msgModel = require("../models/messageModel");

exports.getMessages = (req, res, next) => {
    msgModel.getAllMessages(req, res);
  };

  exports.getMessageCount = (req, res, next) => {
    msgModel.getMessageCount(req, res);
  };