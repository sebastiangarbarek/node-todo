var shared = require('../common/shared');

exports.test = (server) => {
  describe('/', () => {
    shared.unauthorized(server, '/', 'get');
    shared.unauthorized(server, '/logout', 'delete');
  });

  describe('/todos', () => {
    shared.unauthorized(server, '/todos', 'get');
    shared.unauthorized(server, '/todos', 'post');
    shared.unauthorized(server, `/todos/123456`, 'get');
    shared.unauthorized(server, `/todos/123456`, 'delete');
    shared.unauthorized(server, `/todos/123456`, 'patch');
  });
};
