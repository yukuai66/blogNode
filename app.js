const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
// const config = require('config-lite')(__dirname)
// const MongoStore = require('connect-mongo')(session)
// const multer = require('multer');

const index = require('./routes/index');
// const users = require('./routes/users');
// const article = require('./routes/article');
// const contact = require('./routes/contact');
// const manage = require('./routes/manage');
// const edit = require('./routes/edit');
const upload = require('./routes/upload');
const logAnalysis = require('./routes/logAnalysis');

// var connectHistoryApiFallback = require('connect-history-api-fallback');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//环境变量
//process.env.NODE_ENV

//由js控制路由
// app.use('/', connectHistoryApiFallback());
// 静态文件配置
// app.use('/client/web', express.static(path.join(__dirname, 'client/web')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 引用最后的静态文件
// app.use(express.static(path.join(__dirname, 'views')))
// app.get('/', function (req, res) {
//   res.sendFile('./views/index.html')
// })


// 处理表单及文件上传的中间件
// app.use(require('express-formidable')({
//   uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
//   keepExtensions: true// 保留后缀
// }))

// session 中间件
// app.use(session({
//   name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
//   secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
//   resave: true, // 强制更新 session
//   saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
//   cookie: {
//     maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
//   },
//   store: new MongoStore({// 将 session 存储到 mongodb
//     url: config.mongodb.url// mongodb 地址
//   })
// }));

//router
app.use('/', index);
// app.use('/index', index);
// app.use('/users', users);
// app.use('/article', article);
// app.use('/contact', contact);
// app.use('/manage', manage);
// app.use('/edit', edit);
app.use('/upload', upload);
app.use('/logAnalysis', logAnalysis);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
