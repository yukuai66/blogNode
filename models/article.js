// const Article = require('../lib/mongo').Article;

// module.exports = {
//     // 获取文章列表
//     getArticleList: function getArticleList(params) {
//         return Article.paginate({}, params);
//     },

//     // 根据参数获取文章
//     getArticle: function getArticle(params = {}) {
//         return Article.findOne(params).exec();
//     },

//     //创建文章
//     addArticle: (params) => {
//         return Article.create(params);
//     },

//     //更新文章
//     updateArticle: (params) => {
//         return Article.findByIdAndUpdate(params._id, { ...params }).exec();
//     },

//     //删除文章
//     removeArticle: (params) => {
//         return Article.deleteOne(params).exec();
//     },
// }
