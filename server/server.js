var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./database/connect');
var Todo = require('./models/todo');
var User = require('./models/user');

var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/api/todo', (req, res) => {
  var todo = new Todo({
    task: req.body.task
  });
  todo.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/api/todo', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.post('/register', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save().then(() => {
    user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
  console.log('Todo is running on port', port);
});

module.exports = app;
