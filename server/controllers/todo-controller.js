var Todo = require('../models/todo');

exports.getTodos = (req, res) => {
  Todo.find({
    // User ID is set on the request through authentication middleware.
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  });
};

exports.getTodo = (req, res) => {

};

exports.postWriteTodo = (req, res) => {
  var todo = new Todo({
    task: req.body.task,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
};

exports.deleteTodo = (req, res) => {

};

exports.patchTodo = (req, res) => {

};
