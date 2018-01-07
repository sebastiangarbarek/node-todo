const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

var Todo = require('../models/todo');

exports.getTodos = (req, res, next) => {
  Todo.find({
    // User ID is set on the request through authentication middleware.
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }).catch((err) => {
    next(err);
  });
};

exports.getTodo = (req, res, next) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({todo});
  }).catch((err) => {
    next(err);
  });
};

exports.postTodo = (req, res, next) => {
  var todo = new Todo({
    task: req.body.task,
    _creator: req.user._id
  });

  todo.save().then((todo) => {
    res.send({todo});
  }).catch((err) => {
    next(err);
  });
};

exports.deleteTodo = (req, res, next) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({todo});
  }).catch((err) => {
    next(err);
  });
};

exports.patchTodo = (req, res, next) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['task', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({todo});
  }).catch((err) => {
    next(err);
  });
};
