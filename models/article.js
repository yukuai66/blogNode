const Article = require('../lib/mongo').Article
const User = require('../lib/mongo').User

module.exports = {
    // 获取文章列表
    getArticleList: function getArticleList(title) {
        return Article
            .find({})
            .exec()
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
