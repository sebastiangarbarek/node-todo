const express = require('express');

var authenticate = require('../middleware/authenticate');
var index = require('../controllers/index');

var router = express.Router();

router.get('/', authenticate, index.getIndex);
router.post('/join', index.postJoin);
router.post('/login', index.postLogin);
router.delete('/logout', authenticate, index.deleteLogout);

module.exports = router;
