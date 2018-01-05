const mongoose = require('mongoose');

var dbOptions = {useMongoClient: true};

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, dbOptions).catch((err) => {
  console.log('Failed to connect to database on ' + process.env.MONGODB_URI);
});

process.on('SIGINT', () => {
  mongoose.disconnect(() => {
    process.exit(0);
  });
});

module.exports = mongoose;
