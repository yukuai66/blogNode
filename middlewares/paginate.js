const customLabel = require('../lib/customLabel');

module.exports = {
    //生成分页
    generatePaginate: function generatePaginate(req, res, next) {
        // if (req.query.page && req.query.limit) {
        //     req.query.customLabel = customLabel;
        // } else {
        //     req.query.customLabel = customLabel;
        // }
        req.query.customLabels = customLabel;
        if (req.query.limit) req.query.limit = Number(req.query.limit);
        if (req.query.page) req.query.page = Number(req.query.page);
        next();
    }
}