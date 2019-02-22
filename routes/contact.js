const express = require('express');
const router = express.Router();
const note = require('../models/note');

/* GET article page. */
router.get('/', function (req, res, next) {
  res.render('page/contact', { title: '联系我' });
});

router.post('/addArticle', function (req, res, next) {
  let params = {
    ...req.body,
  }

  note.addNote(params).then((list) => {
    res.json({
      data: "success"
    })
  })
});

module.exports = router;
