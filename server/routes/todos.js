const express = require('express');

var authenticate = require('../middleware/authenticate');
var todoController = require('../controllers/todo-controller');

var router = express.Router();

router.route('/')
  .all(authenticate)
  .get(todoController.getTodos)
  .post(todoController.postTodo);
router.route('/:id')
  .all(authenticate)
  .get(todoController.getTodo)
  .delete(todoController.deleteTodo)
  .patch(todoController.patchTodo);

module.exports = router;
