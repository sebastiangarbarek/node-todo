require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var connect = require('./database/connect');
var index = require('./routes/index');
var todos = require('./routes/todos');

var app = express();

app.use(bodyParser.json());

app.use('/', index);
app.use('/todos', todos);

module.exports = app;
