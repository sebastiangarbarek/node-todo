const ObjectID = require('mongodb').ObjectID;

var Todo = require('./../../models/todo');

const seedTodos = [{
  _id: new ObjectID(),
  task: 'Test GET'
}, {
  _id: new ObjectID(),
  task: 'Test POST'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(seedTodos);
  }).then(() => done());
}

module.exports = {seedTodos, populateTodos};
