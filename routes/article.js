var express = require('express');
var router = express.Router();

/* GET article page. */
router.get('/', function(req, res, next) {
  res.render('page/article', { title: '文章列表' });
});

module.exports = router;
