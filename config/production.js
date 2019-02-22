module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: {
    url: 'mongodb://47.96.131.253:27017/myblog',
  },
}