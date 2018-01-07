var todos = require('./routes/todos');

exports.test = (server) => {
  todos.test(server);
};
