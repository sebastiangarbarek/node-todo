require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var connect = require('./database/connect');
var index = require('./routes/index');
var todos = require('./routes/todos');
var handler = require('./middleware/handler');

var app = express();

app.use(bodyParser.json());

app.use('/', index);
app.use('/todos', todos);

app.use(handler.mongoErrorHandler);
app.use(handler.mongooseErrorHandler);
app.use(handler.userErrorHandler);
app.use(handler.errorHandler);

module.exports = {app, connect};
