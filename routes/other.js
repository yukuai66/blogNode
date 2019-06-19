const express = require('express');
const router = express.Router();
// const users = require('../models/users');
// const checkNotLogin = require('../middlewares/check').checkNotLogin

// router.get('/', function (req, res, next) {
//     res.render('page/login', { title: '文章' });
// })

router.get('/getVisualizationData', function (req, res, next) {
    let params = {
      ...req.query
    }
    // article.getArticleList(params).then(function (data) {
    //   res.json(data);
    // });
  });

module.exports = router;