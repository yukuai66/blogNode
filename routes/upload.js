const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');//接收图片
const fs = require('fs');

const upload = multer({
    dest: 'public/uploadFile'
});//定义图片上传的目录


router.post('/image', upload.single("imageFile"), function (req, res, next) {
    let newImagePath = `public/uploadFile/${req.file.filename}_${moment().format('X')}_${req.file.originalname}`
    fs.rename(req.file.path, newImagePath)
    let obj = {
        // errno 即错误代码，0 表示没有错误。
        //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
        "errno": 0,
        "data": [newImagePath.substring(newImagePath.indexOf("/"), newImagePath.length)]
    }
    res.send(obj);
});

module.exports = router;