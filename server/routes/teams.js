const express = require('express');

var authenticate = require('../middleware/authenticate');
var teams = require('../controllers/teams');

var router = express.Router();

router.all('*', authenticate.user);

router.route('/')
  .get(teams.getTeams)
  .post(teams.postTeam);

router.all('*', authenticate.team);

router.route('/:team')
  .delete(teams.deleteTeam);

router.route('/:team/members')
  .get(teams.getMembers)
  .post(teams.postMember)
  .delete(teams.deleteMember);

router.route('/:team/todos')
  .get(teams.getTodos)
  .post(teams.postTodo);

router.route('/:team/todos/:todo')
  .get(teams.getTodo)
  .delete(teams.deleteTodo)
  .patch(teams.patchTodo);

module.exports = router;
