const express = require('express');

var authenticate = require('../middleware/authenticate');
var index = require('../controllers/index');

var router = express.Router();

router.post('/join', index.postJoin);
router.post('/login', index.postLogin);

router.all('*', authenticate.user);

router.get('/', index.getIndex);
router.delete('/logout', index.deleteLogout);
router.get('/invites', index.getInvites);
router.delete('/invites/:invite', index.deleteInvite);

module.exports = router;
