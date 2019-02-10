var express = require('express');
var router = express.Router();

/* GET article page. */
router.get('/', function(req, res, next) {
  res.render('page/contact', { title: '联系我' });
});

module.exports = router;
