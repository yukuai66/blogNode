const config = require('config-lite')(__dirname);
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const timestampsConfig = { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } };
//todofix 默认配置其它地方也引用了 config
mongoose.connect(config.mongodb.url, { useNewUrlParser: true });


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
}, timestampsConfig);
articleSchema.plugin(mongoosePaginate);

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
}, timestampsConfig);

exports.User = mongoose.model('user', userSchema);

//note表
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
}, timestampsConfig);

exports.Note = mongoose.model('note', noteSchema);
