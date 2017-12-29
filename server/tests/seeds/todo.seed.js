const ObjectID = require('mongodb');

var Todo = require('./../../models/todo');

const todos = [{
  _id: new ObjectID(),
  task: 'Test GET'
}, {
  _id: new ObjectID(),
  task: 'Test POST'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

module.exports = {todos, populateTodos};
