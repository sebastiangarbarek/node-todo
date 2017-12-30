const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var connect = require('./database/connect');
var Todo = require('./models/todo');
var User = require('./models/user');
var authenticate = require('./middleware/authenticate');

var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todo', authenticate, (req, res) => {
  var todo = new Todo({
    task: req.body.task,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/todo', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/logout', authenticate, (req, res) => {
  req.user.removeAuthToken(req.token).then(() => {
    res.status(200).send();
  }).catch((err) => {
    res.status(400).send();
  });
});

app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((err) => {
    res.status(400).send();
  });
});

app.post('/join', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/home', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log('Todo is running on port', port);
});

module.exports = app;
