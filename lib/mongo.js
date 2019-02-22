// const config = require('config-lite')(__dirname);
// const moment = require('moment');
// const objectIdToTimestamp = require('objectid-to-timestamp');
// const Mongolass = require('mongolass');
// const mongolass = new Mongolass();

// mongolass.connect(config.mongodb);

// exports.Article = mongolass.model('article', {
//     title: { type: 'string', required: true },
//     article: { type: 'string', require: false },
//     createdDateTime: { type: 'number', require: true },
// });

// exports.User = mongolass.model('user', {
//     name: { type: 'string', required: true },
//     password: { type: 'string', require: true },
// });

// // 根据 id 生成创建时间 created_at
// mongolass.plugin('addCreatedAt', {
//     afterFind: function (results) {
//         results.forEach(function (item) {
//             item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
//         })
//         return results
//     },
//     afterFindOne: function (result) {
//         if (result) {
//             result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
//         }
//         return result
//     }
// })

// //创建时间
// mongolass.plugin('addCreateDateTime', {
//     afterInsert: function (results) {
//         results.forEach(function (item) {
//             item.createDateTime = moment().format('X')
//         })
//         return results
//     },
// })

// //更新时间
// mongolass.plugin('addUpdateDateTime', {
//     beforeInsert: function (results) {
//         results.forEach(function (item) {
//             item.updateDateTime = moment().format('X')
//         })
//         return results
//     },
// })

const config = require('config-lite')(__dirname);
const mongoose = require('mongoose');
//todofix 默认配置其它地方也引用了 config
mongoose.connect("mongodb://127.0.0.1:27017/myblog", { useNewUrlParser: true });


//article表
let articleSchema = new mongoose.Schema({
    title: String,
    article: String,
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });

exports.Article = mongoose.model('article', articleSchema);

//user表
let userSchema = new mongoose.Schema({
    name: String,
    password: String,
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });

exports.User = mongoose.model('user', userSchema);

//note
let noteSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    note: String,
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });

exports.Note = mongoose.model('note', noteSchema);
