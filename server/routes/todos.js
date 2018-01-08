const express = require('express');

var authenticate = require('../middleware/authenticate');
var todos = require('../controllers/todos');

var router = express.Router();

router.all('*', authenticate.user);

router.route('/')
  .get(todos.getTodos)
  .post(todos.postTodo);

router.route('/:id')
  .get(todos.getTodo)
  .delete(todos.deleteTodo)
  .patch(todos.patchTodo);

module.exports = router;
