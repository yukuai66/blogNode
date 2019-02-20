var MongoClient = require('mongodb').MongoClient;
// 连接数据库

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  var db = client.db('test');

  db.collection('site').insertOne({name: 'guojc', age: 99, hobby: 'movie'}, function(err, result){
    console.log('inserted successly');
    console.log(result);
    client.close();
    console.log('close');
  });
});


//db
// app.use(function(req,res,next){
//   MongoClient.connect('mongodb://localhost:27017', (err, client) => {
//     req.db = client.db('myblog');
//     next();
//   });
//   // req.db = db;
// });


