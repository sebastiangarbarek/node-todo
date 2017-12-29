const mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'dev';

var dbHost = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
var dbOptions = {useMongoClient: true};
var dbName;

switch (env) {
  case 'test':
    dbName = 'TestTodoApp'
    break;
  case 'dev':
    dbName = 'TodoApp';
    break;
  default:
    // Configured by the production server.
    dbName = '';
}

mongoose.Promise = global.Promise;
mongoose.connect(dbHost + dbName, dbOptions).catch((err) => {
  console.log('Failed to connect to database on ' + dbHost + dbName);
});

module.exports = mongoose;
