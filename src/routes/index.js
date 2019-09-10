mealsController = require("../controllers/mealsController");
userController = require("../controllers/userController");
homeController = require("../controllers/homeController");
msgController = require("../controllers/messageController");

exports.appRoute = router => {
  router.get("/menu", mealsController.getMenuController);

  router.get("/loginpage", homeController.getLoginPage);
  router.get("/home", homeController.getHomePage);
  router.get("/find", homeController.getFindPage);
  router.get("/profile", homeController.getProfilePage);
  router.get("/getNotifications", homeController.getNotifications);
  router.get("/readNotifications", homeController.readNotifications);
  router.get("/notifications", homeController.notifications);
  router.get("/allNotifications", homeController.allNotifications);
  router.get("/completeprofile", homeController.completeprofile);
  router.get("/user", homeController.getUser);
  router.get("/findlist", homeController.getFindListPage);
  router.get("/logout", homeController.logout);
  router.get("/complete", homeController.complete);
  router.get("/resetpassemail", homeController.resetpassemail);
  router.get("/reset", homeController.reset);

  /* =================== DEBUG*/
  router.get("/test", homeController.test);
  /*====================== END OF DEBUG*/

  router.get("/chat", msgController.getChat);
  router.get("/getMessages", msgController.getMessages);
  router.get("/getMessageCount", msgController.getMessageCount);

  router.get("/getUsersWithin10kms", userController.getUsersWithin10kms);
  router.get("/likePicture", userController.likePic);
  router.get("/unlikePicture", userController.unlikePic);
  router.get("/likeUser", userController.likeUser);
  router.get("/unlikeUser", userController.unlikeUser);
  router.get("/sortbyage", userController.sortbyage);
  router.get("/sortbytag", userController.sortbytags);
  router.get("/sortbylocation", userController.sortbylocation);
  router.get("/sortbyrating", userController.sortbyrating);
  router.get("/visituser", userController.visit);
  
  router.post("/resetPass", userController.resetPass);
  router.post('/logina', userController.getUserController);
  router.post('/registera', userController.getRegisterController);
  router.post("/sendMessage", msgController.sendMessage);
  router.post("/search", userController.findUsers);
  router.post("/completea", userController.complete);
};
