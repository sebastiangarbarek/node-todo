const express = require('express');

var authenticate = require('../middleware/authenticate');
var teams = require('../controllers/teams');

var router = express.Router();

router.route('/')
  .all(authenticate)
  .get(teams.getTeams)
  .post(teams.postTeam);

router.delete('/:team', authenticate, teams.deleteTeam);

router.route('/:team/members')
  .all(authenticate)
  .get(teams.getMembers)
  .post(teams.postMember)
  .delete(teams.deleteMember);

router.route('/:team/todos')
  .all(authenticate)
  .get(teams.getTodos)
  .post(teams.postTodo);

router.route('/:team/todos/:todo')
  .all(authenticate)
  .get(teams.getTodo)
  .delete(teams.deleteTodo)
  .patch(teams.patchTodo);

module.exports = router;
