const express = require('express');
const router = express.Router();
const article = require('../models/article');

/* GET article page. */
router.get('/', function (req, res, next) {
  res.render('page/article', { title: '文章' });
});

router.get('/getList', function (req, res, next) {
  article.getArticleList().then(function (list) {
    res.json(list);
  });
});

module.exports = router;
