var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('page/index', { title: 'Express' });
});

module.exports = router;
