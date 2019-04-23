module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 86400000
  },
  mongodb: {
    url: 'mongodb://47.96.131.253:27017/myblog',
  },
  viewPath: "page/",
  layoutPath: "layout/",
  customDBLabel: {
    totalDocs: 'total',
    docs: 'list',
    limit: 'perPage',
    page: 'pageNo',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    totalPages: 'pageCount',
    // pagingCounter: 'slNo',
  }
}