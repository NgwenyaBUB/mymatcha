exports.getLoginPage = (req, res, next) => {
  res.render("login");
};

exports.getHomePage = (req, res, next) => {
    res.render("home");
  };

  exports.getFindPage = (req, res, next) => {
    res.render("find");
  };
