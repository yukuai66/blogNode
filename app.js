const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// const MongoClient = require('mongodb').MongoClient;

const index = require('./routes/index');
// var users = require('./routes/users');
const article = require('./routes/article');
const contact = require('./routes/contact');
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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 处理表单及文件上传的中间件
// app.use(require('express-formidable')({
//   uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
//   keepExtensions: true// 保留后缀
// }))

//session
app.use(session({
  ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    //name: 'hhw',
    secret: 'keyboard cat', 
    cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  60000 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true, 
    //强制“未初始化”的会话保存到存储。 
    saveUninitialized: true,  
    // store: new MongoStore({// 将 session 存储到 mongodb
    //   url: config.mongodb// mongodb 地址
    // })
    
}))
// 只需要用express app的use方法将session挂载在‘/’路径即可，这样所有的路由都可以访问到session。
//可以给要挂载的session传递不同的option参数，来控制session的不同特性 
// app.get('/', function(req, res, next) {
//   var sess = req.session//用这个属性获取session中保存的数据，而且返回的JSON数据
//   if (sess.views) {
//     sess.views++
//     res.setHeader('Content-Type', 'text/html')
//     res.write('<p>欢迎第 ' + sess.views + '次访问       ' + 'expires in:' + (sess.cookie.maxAge / 1000) + 's</p>')
//     res.end();
//   } else {
//     sess.views = 1
//     res.end('welcome to the session demo. refresh!')
//   }
// });

//db
// app.use(function(req,res,next){
//   MongoClient.connect('mongodb://localhost:27017', (err, client) => {
//     req.db = client.db('myblog');
//     next();
//   });
//   // req.db = db;
// });


//router
app.use('/', index);
app.use('/index', index);
// app.use('/users', users);
app.use('/article', article);
app.use('/contact', contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
