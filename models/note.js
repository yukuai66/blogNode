const Note = require('../lib/mongo').Note

module.exports = {
    //创建联系留言
    addNote: (params) => {
        console.log(params)
        return Note.create(params)
    },
}
