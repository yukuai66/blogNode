var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('page/login', { title: 'Express' });
});

router.get(`/login`, function(req, res, next) {
  res.render('page/login', { title: 'Express' });
});

//注册
router.get(`/register`, function(req, res, next) {
  res.render('page/register');
});

router.post(`/register/create`, function(req, res, next) {
  // res.render('page/login');
  // console.log(db.collection, "db")
  // req.db.collection('user')
  try {
    req.db.collection('user').insert({'username': 123,'password':333}, function (err, result) {
      if(!err){
          res.send({'status':1});
      }else{
          res.send({'status':0});
      }
      console.log(error, "29")
    });
  } catch (error) {
    console.log(error,"32")
  }
  
});

router.get(`/getUserInfor`, function(req, res, next) {
  res.send('getUserInfor');
});

module.exports = router;
