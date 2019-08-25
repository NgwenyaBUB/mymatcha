const msgModel = require("../models/messageModel");

exports.getMessages = (req, res, next) => {
    msgModel.getAllMessages(req, res);
  };

  exports.getMessageCount = (req, res, next) => {
    msgModel.getMessageCount(req, res);
  };

  exports.sendMessage = (req, res, next) => {
    msgModel.sendMessage(req, res);
  };

  exports.getChat = (req, res, next) => {
    msgModel.getChat(req, res);
  }