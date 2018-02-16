var MongoClient = require('mongodb').MongoClient;
// 连接数据库
var url_test = 'mongodb://localhost:27017/test'; //数据库test本不存在，连接时会自动创建

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  // Client returned
  var db = client.db('test');

  db.collection('site').insertOne({name: 'guojc', age: 99, hobby: 'movie'}, function(err, result){
    console.log('inserted successly');
    console.log(result);
    client.close();
    console.log('close');
  });
});