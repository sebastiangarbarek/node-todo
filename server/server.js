require('dotenv').config({path: 'server/config/conf.env'});

var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
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

app.listen(port, () => {
  console.log('Todo is running on port ' + port);
});

module.exports = app;
