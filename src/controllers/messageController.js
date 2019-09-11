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
  
  exports.readMessages = (req, res, next) => {
    msgModel.readMessage(req, res);
  };

  exports.getChat = (req, res, next) => {
    if (!req.session.username)
    {
      res.render('index', {error : 'You are not logged in'});
    }
    else {
      msgModel.getChat(req, res);
    }
  }