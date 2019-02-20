module.exports = {
  //检查登陆
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) {
      return res.redirect('/users');
    }
    next();
  },

  //检查未登陆
  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      return res.json({
        success: false
      })
    }
    next();
  }
}