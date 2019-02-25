module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 86400000
  },
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/myblog',
  },
  viewPath: "page/",
  layoutPath: "layout/"
}