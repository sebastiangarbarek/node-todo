var env = process.env.NODE_ENV || 'dev';

var conf = require('./config.json');

const load = (json) => {
  Object.keys(json).forEach((key) => {
    process.env[key] = json[key];
  });
};

// Load global environment variables.
load(conf['global']);

// Load environment specific variables.
load(conf[env]);
