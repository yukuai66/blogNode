const config = require('config-lite')(__dirname);
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        })
        return results
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})

exports.Article = mongolass.model('article', {
    title: { type: 'string', required: true },
    article: { type: 'string', require: false },
    createdDateTime: { type: 'number', require: true },
});

exports.User = mongolass.model('user', {
    name: { type: 'string', required: true },
    password: { type: 'string', require: true },
});