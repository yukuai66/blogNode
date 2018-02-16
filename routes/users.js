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
    console.log(req)
    req.db.collection('site').insertOne({name: 'guojc', age: 99, hobby: 'movie'}, function(err, result){
    });

    res.render('page/login');
  } catch (error) {
    console.log(error)
  }
  
});

router.get(`/getUserInfor`, function(req, res, next) {
  res.send('getUserInfor');
});

module.exports = router;
