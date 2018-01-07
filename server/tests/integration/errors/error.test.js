const http = require('http');

var {app, connect} = require('../../../app');
var {populate} = require('../seeds/user+todo');
var error400 = require('./400/400');
var error401 = require('./401');
var error404 = require('./404/404');

var server = http.createServer(app);

before(done => {
  populate(done);
});

describe('error', () => {
  describe('400', () => {error400.test(server)});
  describe('401', () => {error401.test(server)});
  describe('404', () => {error404.test(server)});
});

after(done => {
  server.close(() => {
    connect.connection.close(done);
  });
});
