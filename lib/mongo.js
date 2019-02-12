// const config = require('config-lite')(__dirname)
const config = require('../config/dev');
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.Article = mongolass.model('article', {
    title: { type: 'string', required: true },
    article: { type: 'string', require: false },
    createdDateTime: { type: 'number', require: true },
});