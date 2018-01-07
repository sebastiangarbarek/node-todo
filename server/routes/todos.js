const express = require('express');

var authenticate = require('../middleware/authenticate');
var todo = require('../controllers/todos');

var router = express.Router();

router.route('/')
  .all(authenticate)
  .get(todos.getTodos)
  .post(todos.postTodo);
router.route('/:id')
  .all(authenticate)
  .get(todo.getTodo)
  .delete(todos.deleteTodo)
  .patch(todos.patchTodo);

module.exports = router;
