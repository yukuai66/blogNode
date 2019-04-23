const express = require('express');
const router = express.Router();
const article = require('../models/article');
const checkLogin = require('../middlewares/check').checkLogin

/* GET article page. */
router.get('/', checkLogin, function (req, res, next) {
  res.render('page/manage', { title: '文章' });
});

// router.get('/getList', function (req, res, next) {
//   article.getArticleList().then(function (list) {
//     res.json(list);
//   });
// });

module.exports = router;
