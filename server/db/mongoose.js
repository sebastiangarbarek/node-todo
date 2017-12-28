require('dotenv').config();
var mongoose = require('mongoose');

var dbHost = process.env.MONGODB_URI || process.env.DB_HOST;
if (process.env.NODE_ENV === 'test') {
  var dbName = 'TestTodoApp'
} else if (process.env.NODE_ENV === 'dev') {
  var dbName = 'TodoApp';
} else {
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
