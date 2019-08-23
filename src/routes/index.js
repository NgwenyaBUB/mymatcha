mealsController = require("../controllers/mealsController");
userController = require("../controllers/userController");
homeController = require("../controllers/homeController");

exports.appRoute = router => {
  router.get("/menu", mealsController.getMenuController);
  router.get("/loginpage", homeController.getLoginPage);
  router.get("/home", homeController.getHomePage);
  router.get("/find", homeController.getFindPage);
  router.get("/profile", homeController.getProfilePage);
  router.post('/logina', userController.getUserController);
  router.post('/registera', userController.getRegisterController);
  router.get("/getNotifications", homeController.getNotifications);
};
