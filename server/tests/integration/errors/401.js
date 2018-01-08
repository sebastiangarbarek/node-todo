var unauthorized = require('../helpers/unauthorized');

exports.test = (server) => {
  describe('/', () => {
    unauthorized.test(server, '/', 'get');
    unauthorized.test(server, '/logout', 'delete');
  });

  describe('/todos', () => {
    unauthorized.test(server, '/todos', 'get');
    unauthorized.test(server, '/todos', 'post');
    unauthorized.test(server, `/todos/123456`, 'get');
    unauthorized.test(server, `/todos/123456`, 'delete');
    unauthorized.test(server, `/todos/123456`, 'patch');
  });
};
