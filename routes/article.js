const express = require('express');
const router = express.Router();
const article = require('../models/article');

/* GET article page. */
router.get('/', function (req, res, next) {
  res.render('page/article');
});

/* GET article-details page. */
router.get('/details', function (req, res, next) {
  res.render('page/article-details');
});

router.get('/getList', function (req, res, next) {
  article.getArticleList().then(function (list) {
    res.json(list);
  });
});

router.get('/getArticle', function (req, res, next) {
  // article.getArticleById().then(function (list) {
  //   res.json(list);
  // });
});

router.post('/addArticle', function (req, res, next) {
  // console.log(article.updateArticle);
  article.addArticle().then((list) => {
    res.json({
      data: "success"
    })
  })
  // article.getArticleById().then(function (list) {
  //   res.json(list);
  // });
});

module.exports = router;
