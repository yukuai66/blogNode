const Article = require('../lib/mongo').Article

module.exports = {
    // 获取文章列表
    getArticleList: function getArticleList(title) {
        return Article.find({})
    },


    // // 根据id获取文章
    // getArticleById: function getArticleList(title) {
    //     return Article
    //         .find({})
    //         .exec()
    // },

    //创建文章
    addArticle: (params) => {
        return Article.create(params)
    },

    //更新文章
    updateArticle: (params) => {
        // return Article.create(params).exec();
    },
    // getPosts: function getPosts(author) {
    //     const query = {}
    //     if (author) {
    //         query.author = author
    //     }
    //     return Post
    //         .find(query)
    //         .populate({ path: 'author', model: 'User' })
    //         .sort({ _id: -1 })
    //         .addCreatedAt()
    //         .contentToHtml()
    //         .exec()
    // },
}
