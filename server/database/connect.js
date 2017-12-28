const mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'dev';
var dbHost = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

if (env === 'test') {
  var dbName = 'TestTodoApp'
} else if (env === 'dev') {
  var dbName = 'TodoApp';
} else {
  // Configured by the production server.
  var dbName = '';
}

var dbOptions = {
  useMongoClient: true
};

mongoose.Promise = global.Promise;
mongoose.connect(dbHost + dbName, dbOptions).then(() => {
  console.log('Connected to database on ' + dbHost + dbName);
}, err => {
  console.log('Failed to connect to database on ' + dbHost + dbName);
});

module.exports = mongoose;
