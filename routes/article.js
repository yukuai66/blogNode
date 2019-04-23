const express = require('express');
const router = express.Router();
const article = require('../models/article');
const generatePaginate = require('../middlewares/paginate').generatePaginate;

/* GET article page. */
router.get('/', function (req, res, next) {
  res.render('page/article');
});

/* GET article-details page. */
router.get('/details', function (req, res, next) {
  res.render('page/article-details');
});

router.get('/getList', generatePaginate, function (req, res, next) {
  let params = {
    ...req.query
  }
  article.getArticleList(params).then(function (data) {
    res.json(data);
  });
});

router.get('/getArticle', function (req, res, next) {
  let params = {
    ...req.query
  }
  article.getArticle(params).then(function (item) {
    res.json({
      data: item
    });
  });
});

router.post('/addArticle', function (req, res, next) {
  let params = {
    ...req.body,
  }
  article.addArticle(params).then((list) => {
    res.json({
      data: "success"
    })
  })
});

router.post("/removeArticle", (req, res, next) => {
  let params = {
    ...req.body,
  }
  article.removeArticle(params).then((list) => {
    res.json({
      data: "success"
    })
  })
})

router.post("/updateArticle", (req, res, next) => {
  let params = {
    ...req.body,
  }
  article.updateArticle(params).then((list) => {
    res.json({
      data: "success"
    })
  })
})

module.exports = router;
