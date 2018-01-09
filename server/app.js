require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var connect = require('./database/connect');
var index = require('./routes/index');
var todos = require('./routes/todos');
var errors = require('./middleware/errors');

var app = express();

app.use(bodyParser.json());

app.use('/', index);
app.use('/todos', todos);

app.use(errors.mongoErrorHandler);
app.use(errors.mongooseErrorHandler);
app.use(errors.userErrorHandler);
app.use(errors.errorHandler);

module.exports = {app, connect};
