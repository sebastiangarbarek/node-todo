var index = require('./routes/index');
var todos = require('./routes/todos');

exports.test = (server) => {
  index.test(server);
  todos.test(server);
};
