const express = require('express');
const router = express.Router();
const users = require('../models/users');
// const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/', function (req, res, next) {
    res.render('page/login', { title: '文章' });
})

router.post('/login', function (req, res, next) {
    const name = req.body.name;
    const password = req.body.password;
    users.getUserByName(name).then(function (data) {
        if (!data || password !== data.password) {
            res.json({ data: false });
        } else {
            //用户信息写入session
            req.session.user = { name: name }
            res.json({ data: true });
        }
    });
});

module.exports = router;